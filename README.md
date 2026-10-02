# Northline

A small store you own. You add variables, push, and redeploy. You do not run the daily clerk work. You stay responsible for what sells.

Repo: https://github.com/CreigT/northline-store

## Deploy

1. Import this repo on Vercel. Framework preset: Other.
2. Add the variables below.
3. Redeploy after every variable change.

## Variables

| Name | What it does |
| --- | --- |
| SITE_NAME | Name on the pages |
| SITE_TAGLINE | Line under the name |
| SUPPORT_EMAIL | Shown for questions |
| CURRENCY | USD unless you change it |
| STRIPE_PAYMENT_LINK_SHOP | Customer Buy button |
| STRIPE_PAYMENT_LINK_OPERATE | Owner plan, suggested $29/mo |
| STRIPE_PAYMENT_LINK_SCALE | Owner plan, suggested $99/mo |
| OWNER_ACCESS_CODE | Opens the console |
| MAX_PRICE_CHANGE_PCT | Default 15. A bigger price move waits for you |
| STORE_PAUSED | true stops product checkout |
| REFUNDS_HELD | true stops every refund |
| REFUND_AUTO_MAX | Default 20. Over that, you confirm |
| STRIPE_LINK_FIELD_MUG | Optional link for that product |
| STRIPE_LINK_EVERYDAY_TEE | Optional link for that product |
| STRIPE_LINK_AMBER_OIL | Optional link for that product |

Do not put secret keys in the HTML. Card data stays on Stripe.

## Pages

- `/` shop shelf
- `/week` sales, shipped rows, and holds
- `/orders?order=NL-1001` receipt

## Sample shelf

Field mug, $28, 12 in stock. Everyday tee, $42, 4 in stock. Amber oil, $36, sold out. A count under 1 never reaches Stripe.

## What this build includes

Shop, paywall, owner key, price guard, receipt, stock stop, order book, ship note, week page.

Not in this build: ads, tax filing, suppliers.

A price, stock count, new order, or ship note sticks after you replace the file in `data/` and redeploy.
