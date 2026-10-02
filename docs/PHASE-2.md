# Phase 2

Branch: feature/saas-foundation. Not merged.

PostgreSQL schema and migration exist. JSON is not the intended production store.

Signup validates input and hashes a password in memory. It returns 503 and saves no user until DATABASE_URL, AUTH_SECRET, and a connected Prisma client exist. That is live verification blocked, not a fake account.

Tenant access is allow-list membership. A store id from the browser is rejected unless the session membership includes it. Tests cover product, order, customer, and settings shape.

Tests run: node --test tests/tenant.test.js. Result: 4 passed, 0 failed.
Lint and typecheck: node --check on the new modules. Passed.
Build: node --check api/checkout.js. Passed.
Prisma generate and migrate were not run. No database URL in this environment.
