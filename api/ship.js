import crypto from "node:crypto";
import { readJson } from "./lib/store.js";
function sign(code) { return crypto.createHmac("sha256", code).update("northline-owner-v1").digest("hex"); }
export default function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only." }); return; }
  const expected = process.env.OWNER_ACCESS_CODE;
  const body = req.body || {};
  if (!expected || String(body.token || "") !== sign(expected)) { res.status(401).json({ error: "Owner key required to mark sent." }); return; }
  const book = readJson("orders.json", { orders: [] });
  const order = (book.orders || []).find((item) => item.id === String(body.id || ""));
  if (!order) { res.status(404).json({ error: "That code is not in the book." }); return; }
  order.status = "sent";
  order.ship = String(body.note || "Sent").slice(0, 80);
  order.sentAt = new Date().toISOString();
  res.status(200).json({ ok: true, id: order.id, status: "sent", ship: order.ship, file: JSON.stringify(book, null, 2) + "\n" });
}
