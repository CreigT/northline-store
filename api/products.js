import { assertResourceAccess } from "../lib/tenant.js";
import { requireDatabase } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    requireDatabase();
  } catch (error) {
    res.status(503).json({ error: error.message, liveVerification: "BLOCKED" });
    return;
  }
  try {
    assertResourceAccess([], { storeId: String(req.query.storeId || "") });
  } catch (error) {
    res.status(error.status || 404).json({ error: error.message });
    return;
  }
  res.status(503).json({ error: "Product query is not executed until the database client is connected.", liveVerification: "BLOCKED" });
}
