import { readFileSync } from "node:fs";
import { join } from "node:path";

export function readJson(name, fallback) {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", name), "utf8"));
  } catch {
    return fallback;
  }
}

export function productLink(product) {
  if (!product) return "";
  const fromEnv = process.env["STRIPE_LINK_" + String(product.id || "").toUpperCase().replace(/-/g, "_")];
  return fromEnv || product.paymentLink || "";
}

export function storePaused(state) {
  return process.env.STORE_PAUSED === "true" || Boolean(state && state.paused);
}

export function refundsHeld(state) {
  return process.env.REFUNDS_HELD === "true" || Boolean(state && state.refundsHeld);
}
