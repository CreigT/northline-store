import crypto from "node:crypto";
import { readJson } from "./lib/store.js";

function sign(code) {
  return crypto.createHmac("sha256", code).update("northline-owner-v1").digest("hex");
}

export default function handler(req, res) {
  const merchant = readJson("merchant.json", { id: "store", name: "", email: "", currency: "USD", products: [] });
  if (req.method === "GET") {
    res.status(200).json({
      id: merchant.id,
      name: merchant.name || "",
      email: merchant.email || "",
      currency: merchant.currency || "USD",
      products: merchant.products || [],
      storePath: "/s/" + merchant.id
    });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "GET or POST only." });
    return;
  }
  const expected = process.env.OWNER_ACCESS_CODE;
  const body = req.body || {};
  if (!expected || String(body.token || "") !== sign(expected)) {
    res.status(401).json({ error: "Owner key required to save this merchant." });
    return;
  }
  const name = String(body.name || "").trim();
  const productName = String(body.productName || "").trim();
  const price = Number(body.price);
  const stock = Number(body.stock);
  if (!name) {
    res.status(400).json({ error: "Merchant name is required." });
    return;
  }
  merchant.name = name;
  merchant.email = String(body.email || "").trim();
  if (productName) {
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      res.status(400).json({ error: "A product needs a name, a price above 0, and a whole stock count." });
      return;
    }
    const id = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
    const products = merchant.products || [];
    const existing = products.find((item) => item.id === id);
    const row = { id, name: productName, price, stock };
    if (existing) Object.assign(existing, row);
    else products.push(row);
    merchant.products = products;
  }
  res.status(200).json({
    ok: true,
    storePath: "/s/" + merchant.id,
    file: JSON.stringify(merchant, null, 2) + "\n",
    note: "Replace data/merchant.json, push, and redeploy. The store then shows only what you saved."
  });
}
