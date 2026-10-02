import { readJson, productLink, storePaused } from "./lib/store.js";

const PLANS = { shop: "STRIPE_PAYMENT_LINK_SHOP", operate: "STRIPE_PAYMENT_LINK_OPERATE", scale: "STRIPE_PAYMENT_LINK_SCALE" };

function safeUrl(url) {
  try {
    const target = new URL(url);
    return target.protocol === "https:" ? target.toString() : null;
  } catch { return null; }
}

export default function handler(req, res) {
  const state = readJson("store-state.json", { paused: false });
  const productId = String(req.query.product || "");
  if (productId && storePaused(state)) {
    res.status(503).json({ error: "The store is paused." });
    return;
  }
  if (productId) {
    const catalog = readJson("catalog.json", { products: [] });
    const product = (catalog.products || []).find((item) => item.id === productId);
    if (!product) { res.status(404).json({ error: "That product is not on the shelf." }); return; }
    if (Number(product.stock) < 1) { res.status(503).json({ error: "Sold out. Buy is stopped until the count is at least 1." }); return; }
    const link = safeUrl(productLink(product)) || safeUrl(process.env.STRIPE_PAYMENT_LINK_SHOP || "");
    if (!link) { res.status(501).json({ error: "Set STRIPE_PAYMENT_LINK_SHOP, then redeploy." }); return; }
    res.writeHead(302, { Location: link });
    res.end();
    return;
  }
  const key = PLANS[String(req.query.plan || "shop")];
  const url = key && safeUrl(process.env[key] || "");
  if (!url) { res.status(501).json({ error: "Payment link is not set." }); return; }
  res.writeHead(302, { Location: url });
  res.end();
}
