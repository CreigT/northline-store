export class TenantError extends Error {
  constructor(status = 404) {
    super(status === 403 ? "Forbidden." : "Not found.");
    this.status = status;
  }
}

export function storeIdsFor(memberships) {
  return (memberships || []).map((row) => row.storeId);
}

export function assertStoreAccess(memberships, storeId) {
  if (!storeId || !storeIdsFor(memberships).includes(storeId)) throw new TenantError(404);
  return storeId;
}

export function assertResourceAccess(memberships, resource) {
  if (!resource) throw new TenantError(404);
  return assertStoreAccess(memberships, resource.storeId);
}
