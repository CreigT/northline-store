import crypto from 'node:crypto';
function sign(code) { return crypto.createHmac('sha256', code).update('northline-owner-v1').digest('hex'); }
export default function handler(req, res) {
  const expected = process.env.OWNER_ACCESS_CODE;
  const body = req.body || {};
  if (!expected || body.token !== sign(expected)) { res.status(401).json({ error: 'Owner token required.' }); return; }
  res.status(200).json({ ok: true, entry: { action: body.action, at: new Date().toISOString() } });
}
