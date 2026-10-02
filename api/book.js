import crypto from "node:crypto";
import { readJson } from "./lib/store.js";
function sign(code) { return crypto.createHmac("sha256", code).update("northline-owner-v1").digest("hex"); }
function publicRow(order) { return { id: order.id, productId: order.productId, amount: order.amount, status: order.status, ship: order.ship || "", sentAt: order.sentAt || null }; }
export default function handler(req, res) {
  const book = readJson("orders.json", { refundAutoMax: 20, orders: [] });
  const orders = book.orders || [];
  if (req.method === "GET") {
    const id = String(req.query.id || "");
    if (id) {
      const order = orders.find((item) => item.id === id);
      res.status(order ? 200 : 404).json({ order: order ? publicRow(order) : null });
      return;
    }
    res.status(200).json({ orders: orders.map(publicRow) });
    return;
  }
  if (req.method !== "POST") { res.status(405).json({ error: "GET or POST only." }); return; }
  const expected = process.env.OWNER_ACCESS_CODE;
  const body = req.body || {};
  if (!expected || String(body.token || "") !== sign(expected)) { res.status(401).json({ error: "Owner key required to write the book." }); return; }
  const catalog = readJson("catalog.json", { products: [] });
  const product = (catalog.products || []).find((item) => item.id === String(body.productId || ""));
  const amount = Number(body.amount || (product && product.price) || 0);
  if (!product || amount <= 0) { res.status(400).json({ error: "Need a known product and an amount." }); return; }
  if (Number(product.stock) < 1) { res.status(409).json({ error: "Cannot book a product with no stock." }); return; }
  const id = String(body.id || ("NL-" + Date.now().toString().slice(-6)));
  if (orders.some((item) => item.id === id)) { res.status(200).json({ ok: true, order: publicRow(orders.find((item) => item.id === id)) }); return; }
  const row = { id, productId: product.id, email: String(body.email || ""), amount, status: "paid", ship: product.ship || "Ships soon", at: new Date().toISOString() };
  orders.push(row);
  book.orders = orders;
  res.status(200).json({ ok: true, order: publicRow(row), file: JSON.stringify(book, null, 2) + "\n", note: "Replace data/orders.json, push, and redeploy." });
}
