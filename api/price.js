import crypto from 'node:crypto';
import { readJson } from './lib/store.js';
function sign(code) { return crypto.createHmac('sha256', code).update('northline-owner-v1').digest('hex'); }
export default function handler(req, res) {
  const catalog = readJson('catalog.json', { products: [] });
  const policy = readJson('policy.json', { maxPriceChangePct: 15, minPrice: 1, maxPrice: 500 });
  const limit = Number(process.env.MAX_PRICE_CHANGE_PCT || policy.maxPriceChangePct || 15);
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only.' }); return; }
  const body = req.body || {};
  if (!process.env.OWNER_ACCESS_CODE || body.token !== sign(process.env.OWNER_ACCESS_CODE)) { res.status(401).json({ error: 'Owner key required.' }); return; }
  const product = (catalog.products || []).find((item) => item.id === String(body.id || ''));
  const next = Number(body.price);
  if (!product || next < policy.minPrice || next > policy.maxPrice) { res.status(400).json({ error: 'Price must be between 1 and 500.' }); return; }
  const old = Number(product.price);
  const changePct = Math.abs((next - old) / old) * 100;
  if (changePct > limit && body.confirm !== true) { res.status(409).json({ needsConfirm: true, error: 'That move is over ' + limit + '%. Confirm to publish.' }); return; }
  product.price = Math.round(next * 100) / 100;
  res.status(200).json({ ok: true, from: old, to: product.price, file: JSON.stringify(catalog, null, 2) + '\n' });
}
