import crypto from "node:crypto";
import { readJson } from "./lib/store.js";
function sign(code) { return crypto.createHmac("sha256", code).update("northline-owner-v1").digest("hex"); }
export default function handler(req, res) {
  const catalog = readJson("catalog.json", { products: [] });
  if (req.method === "GET") {
    res.status(200).json({ products: (catalog.products || []).map((item) => ({ id: item.id, name: item.name, stock: Number(item.stock) || 0, buyOpen: Number(item.stock) > 0 })) });
    return;
  }
  const expected = process.env.OWNER_ACCESS_CODE;
  const body = req.body || {};
  if (!expected || String(body.token || "") !== sign(expected)) { res.status(401).json({ error: "Owner key required to change stock." }); return; }
  const product = (catalog.products || []).find((item) => item.id === String(body.id || ""));
  const next = Number(body.stock);
  if (!product || !Number.isInteger(next) || next < 0) { res.status(400).json({ error: "Need a product and a whole count." }); return; }
  const from = Number(product.stock) || 0;
  product.stock = next;
  res.status(200).json({ ok: true, id: product.id, from, to: next, buyOpen: next > 0, file: JSON.stringify(catalog, null, 2) + "\n" });
}
