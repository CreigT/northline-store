import crypto from 'node:crypto';
function sign(code) { return crypto.createHmac('sha256', code).update('northline-owner-v1').digest('hex'); }
export default function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only.' }); return; }
  const expected = process.env.OWNER_ACCESS_CODE;
  if (!expected) { res.status(501).json({ error: 'Set OWNER_ACCESS_CODE, then redeploy.' }); return; }
  const body = req.body || {};
  if (body.token && body.token === sign(expected)) { res.status(200).json({ ok: true, role: 'owner' }); return; }
  const a = Buffer.from(String(body.code || ''));
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) { res.status(401).json({ error: 'That key does not open the console.' }); return; }
  res.status(200).json({ ok: true, role: 'owner', token: sign(expected) });
}
