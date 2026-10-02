import test from "node:test";
import assert from "node:assert/strict";
import { assertResourceAccess, assertStoreAccess, TenantError } from "../lib/tenant.js";

const merchantA = [{ storeId: "store-a" }];
const merchantB = [{ storeId: "store-b" }];
const productB = { id: "product-b", storeId: "store-b" };

test("merchant A cannot read merchant B product", () => {
  assert.throws(() => assertResourceAccess(merchantA, productB), (error) => error instanceof TenantError && error.status === 404);
});

test("merchant A cannot read merchant B order, customer, or settings", () => {
  for (const resource of [{ storeId: "store-b" }, { storeId: "store-b" }, { storeId: "store-b" }]) {
    assert.throws(() => assertResourceAccess(merchantA, resource), (error) => error.status === 404);
  }
});

test("merchant B can read its own product", () => {
  assert.equal(assertStoreAccess(merchantB, productB.storeId), "store-b");
});

test("a browser-supplied store id is ignored unless it is in the session membership", () => {
  assert.throws(() => assertStoreAccess(merchantA, "store-b"), (error) => error.status === 404);
});
