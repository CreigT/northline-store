# Northline SaaS audit

Audited commit on main after the merchant-store step. Sponsored by Creignificent LLC.

This is not a production SaaS. The audit does not invent missing systems.

## What works

- Static pages on Vercel: home, shop, pricing, prices, stock, orders, week, console, `/s/store`.
- `vercel.json` sets clean URLs and basic security headers.
- Checkout redirects to a Stripe Payment Link only if `STRIPE_PAYMENT_LINK_SHOP` or a product link is set, and only if stock is at least 1.
- Owner gate compares `OWNER_ACCESS_CODE` on the server and returns an HMAC token. It is one shared key, not an account.
- Price, stock, book, ship, and merchant saves require that token. They return a JSON file. Nothing is written to a database.
- Catalog and orders files are empty. No sample products are committed.

## Classification

| Component | Class | Why |
| --- | --- | --- |
| Pages and CSS | KEEP | Readable. Do not redesign for taste. |
| vercel.json headers | KEEP | Useful. Add more when auth exists. |
| Checkout redirect | MODIFY | Keep the stock stop. Replace the payment-link redirect with Checkout Sessions and verified webhooks. |
| Owner key | MODIFY | Keep as an emergency break. It is not merchant login. |
| Price and stock checks | MODIFY | Rules stay. Persistence must move to the database. |
| JSON files as the store | REPLACE | Not tenant-safe. A write does not survive on Vercel. |
| Single `/s/store` page | REPLACE | One hard-coded merchant. Need `/store/{slug}` from the database. |
| Week and book pages | MODIFY | Keep the plain language. Numbers must come from real orders. |
| Auth, database, cart, Connect, email, analytics, admin, tests, CI | ADD | Not in the repo. |

## Missing

A second merchant cannot sign up. There is no user, session, email verification, or password reset. There is no Postgres database, migration, or ORM. Tenant id is not enforced. Checkout does not create a Checkout Session. No webhook verifies payment. Orders are not created by a payment. Inventory is not locked. There is no cart. No Stripe Connect. No subscription state. No customer record. No email. No audit log that persists. No platform admin. No tests. No CI.

## Security problems

- One `OWNER_ACCESS_CODE` is shared. Anyone with it can act as the only merchant.
- `api/merchant.js` accepts a browser body and returns a file. It does not check a user-to-store membership.
- `api/book.js` and `api/week.js` still read `orders.json`, which is not the merchant record. Two sources of truth.
- Success-page returns are not payment proof. The current code does not mark paid from a browser return, which is correct, but it also never receives a webhook.
- No rate limit. No CSRF token on the console forms. No webhook signature check because there is no webhook.
- `.env.example` has names only. No secrets are in the tracked files reviewed here. History before this audit was not scanned for leaked secrets.

## Architecture decision

Do not delete the Vercel app. Extend it.

Phase 2 is Postgres plus real accounts. Until `DATABASE_URL` and an auth provider are set, those routes must not pretend to sign a merchant up. JSON remains only as the current single-store file, labeled not production.

Blocked on credentials: database host, Stripe secret key, webhook secret, Connect client id, email provider. Those are not invented here.
