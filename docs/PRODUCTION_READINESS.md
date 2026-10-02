# Production readiness

Northline is not production-ready. Sponsored by Creignificent LLC.

| Item | Status | Problem | Next action |
| --- | --- | --- | --- |
| Authentication | BLOCKED | Shared owner key only. | Add real sign-up after an auth provider is chosen. Do not add a fake user. |
| Database | BLOCKED | JSON files only. | Provision Postgres and add migrations. |
| Multi-tenancy | FAIL | One hard-coded store id. | Store slug from the database, not `/s/store`. |
| Tenant isolation | FAIL | No second tenant and no test. | Add the isolation test when two stores exist. |
| Products | FAIL | Empty file. Save returns a download. | Persist in Postgres. |
| Inventory | FAIL | File count. No lock. | Transaction on paid webhook. |
| Storefront | FAIL | One page. | `/store/{slug}` from data. |
| Cart | FAIL | Not built. | Server cart. Ignore browser prices. |
| Customer checkout | BLOCKED | Redirects to a payment link. No webhook. | Stripe secret and webhook secret required. |
| Stripe Connect | BLOCKED | Not built. | Connect client id required. |
| Orders | FAIL | Empty file. Not written by payment. | Create order in the webhook. |
| Refunds | FAIL | Approval message only. No Stripe refund. | Refund API after Connect. |
| Merchant SaaS billing | FAIL | Plan links only. No entitlement. | Separate Billing webhook. |
| Customers | FAIL | Not built. | Create on verified payment. |
| Shipping | FAIL | A ship note can edit a file. | Status on the order row. |
| Emails | BLOCKED | Not built. | Provider key required. |
| Analytics | FAIL | Week page is not from paid orders. | Query orders. Never fill empty charts. |
| Audit logging | FAIL | Console log only. | Append-only table. |
| Platform admin | FAIL | Not built. | Separate role after auth. |
| Security | FAIL | No tenant check, no rate limit. | Server membership check first. |
| Privacy controls | FAIL | No terms, privacy, or deletion. | Pages plus a real delete path. |
| Mobile | PASS | Simple pages wrap. | Recheck after dashboard exists. |
| Accessibility | FAIL | Some forms lack explicit label associations. | Labels on the next forms. |
| Tests | FAIL | None. | Isolation test is the first. |
| CI/CD | FAIL | No workflow. | Add after tests exist. |
| Production build | PASS | Static files plus Vercel functions. No app build step. | Revisit when a framework is added. |
| Deployment | BLOCKED | Repo can import. Live payment is not configured. | Vercel env and Stripe webhook. |

Files created this step: `docs/SAAS_AUDIT.md`, `docs/PRODUCTION_READINESS.md`.

No database migration. No secrets added.

Known limitation: the 25-step done list is not met. Calling this production-ready would be false.
