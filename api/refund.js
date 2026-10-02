import { readJson, refundsHeld } from "./lib/store.js";
export default function handler(req, res) {
  const book = readJson("orders.json", { refundAutoMax: 20, orders: [] });
  const state = readJson("store-state.json", { refundsHeld: false });
  const held = refundsHeld(state);
  const autoMax = Number(process.env.REFUND_AUTO_MAX || book.refundAutoMax || 20);
  if (req.method === "GET") {
    const order = (book.orders || []).find((item) => item.id === String(req.query.id || ""));
    res.status(200).json({ held, autoMax, order: order ? { id: order.id, productId: order.productId, amount: order.amount, status: order.status, ship: order.ship } : null });
    return;
  }
  const body = req.body || {};
  const amount = Number(body.amount || 0);
  if (held) { res.status(423).json({ error: "Refunds are held." }); return; }
  if (amount > autoMax) { res.status(409).json({ error: "Over the auto limit. The owner has to confirm this refund." }); return; }
  res.status(200).json({ ok: true, amount, note: "Approved to refund in Stripe. This app does not send the card refund." });
}
