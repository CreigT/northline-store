import { readJson, productLink, storePaused, refundsHeld } from './lib/store.js';
export default function handler(_req, res) {
  const catalog = readJson('catalog.json', { store: {}, products: [] });
  const policy = readJson('policy.json', { maxPriceChangePct: 15 });
  const state = readJson('store-state.json', { paused: false, refundsHeld: false });
  const products = (catalog.products || []).map((item) => ({ id: item.id, name: item.name, price: item.price, stock: Number(item.stock) || 0, blurb: item.blurb, ship: item.ship, buyReady: Boolean(productLink(item) || process.env.STRIPE_PAYMENT_LINK_SHOP) }));
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ siteName: process.env.SITE_NAME || catalog.store.name || 'Northline', tagline: process.env.SITE_TAGLINE || catalog.store.tagline || '', supportEmail: process.env.SUPPORT_EMAIL || catalog.store.supportEmail || '', currency: process.env.CURRENCY || 'USD', paused: storePaused(state), refundsHeld: refundsHeld(state), maxPriceChangePct: Number(process.env.MAX_PRICE_CHANGE_PCT || policy.maxPriceChangePct || 15), checkoutReady: products.some((item) => item.buyReady), plans: { operate: Boolean(process.env.STRIPE_PAYMENT_LINK_OPERATE), scale: Boolean(process.env.STRIPE_PAYMENT_LINK_SCALE) }, ownerGateReady: Boolean(process.env.OWNER_ACCESS_CODE), products });
}
