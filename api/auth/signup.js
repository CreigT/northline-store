import { hashPassword } from "../../lib/auth.js";
import { requireDatabase, slugOk } from "../../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only." });
    return;
  }
  try {
    requireDatabase();
    if (!process.env.AUTH_SECRET) throw Object.assign(new Error("AUTH_SECRET is not set."), { status: 503 });
  } catch (error) {
    res.status(error.status || 503).json({ error: error.message, liveVerification: "BLOCKED" });
    return;
  }
  const body = req.body || {};
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const storeName = String(body.storeName || "").trim();
  const slug = String(body.slug || "").trim().toLowerCase();
  if (!email.includes("@") || password.length < 10 || !storeName || !slugOk(slug)) {
    res.status(400).json({ error: "Need a valid email, a password of 10 or more characters, a store name, and a slug of letters, numbers, and hyphens." });
    return;
  }
  hashPassword(password);
  res.status(503).json({ error: "Account was not created. Prisma client is not connected in this phase. No user was saved.", liveVerification: "BLOCKED" });
}
