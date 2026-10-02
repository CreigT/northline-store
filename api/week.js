import { readJson, storePaused, refundsHeld } from "./lib/store.js";

export default function handler(_req, res) {
  const book = readJson("orders.json", { refundAutoMax: 20, orders: [] });
  const state = readJson("store-state.json", { paused: false, refundsHeld: false });
  const catalog = readJson("catalog.json", { products: [] });
  const orders = book.orders || [];
  const paid = orders.filter((item) => item.status === "paid" || item.status === "sent");
  const sent = orders.filter((item) => item.status === "sent");
  const sales = paid.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const stock = (catalog.products || []).reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
  const soldOut = (catalog.products || []).filter((item) => Number(item.stock) < 1).map((item) => item.name);

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    sales,
    paidCount: paid.length,
    sentCount: sent.length,
    waitingCount: paid.length - sent.length,
    paused: storePaused(state),
    refundsHeld: refundsHeld(state),
    refundAutoMax: Number(process.env.REFUND_AUTO_MAX || book.refundAutoMax || 20),
    stock,
    soldOut,
    rows: paid.map((item) => ({
      id: item.id,
      productId: item.productId,
      amount: item.amount,
      status: item.status
    }))
  });
}
