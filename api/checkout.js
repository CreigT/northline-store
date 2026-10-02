import { readJson, productLink, storePaused } from "./lib/store.js";

function safeUrl(url) {
  try {
    const target = new URL(url);
    return target.protocol === "https:" ? target.toString() : null;
  } catch {
    return null;
  }
}

export default function handler(req, res) {
  const state = readJson("store-state.json", { paused: false });
  if (storePaused(state)) {
    res.status(503).json({ error: "The store is paused." });
    return;
  }
  const merchant = readJson("merchant.json", { products: [] });
  const productId = String(req.query.product || "");
  const product = (merchant.products || []).find((item) => item.id === productId);
  if (!product) {
    res.status(404).json({ error: "That product is not saved for this merchant." });
    return;
  }
  if (Number(product.stock) < 1) {
    res.status(503).json({ error: "Sold out." });
    return;
  }
  const link = safeUrl(productLink(product)) || safeUrl(process.env.STRIPE_PAYMENT_LINK_SHOP || "");
  if (!link) {
    res.status(501).json({ error: "No payment link is set." });
    return;
  }
  res.writeHead(302, { Location: link });
  res.end();
}
