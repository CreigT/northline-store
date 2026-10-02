export function requireDatabase() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not set. Live database calls are blocked.");
    error.status = 503;
    throw error;
  }
  return process.env.DATABASE_URL;
}

export function slugOk(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug || "")) && slug.length <= 48;
}
