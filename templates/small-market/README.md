# Template: Small market

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7.2 and 7.3. When the design changes, this page changes with it.

A recommended set of packs plus fields, stages, home items, AI defaults and
skills. A new business type is a new template, not new code.

## Packs on

`orders`, `delivery`, `sales_screen`, `shifts_cash`, `barcodes`, `stock`, `purchasing`, `expiry`, `credit`, `expenses`, `support`, `telegram`, `website`

## Everything in the template

| Part | Coffee shop | Small market |
|------|-------------|--------------|
| Packs on (7.3) | recipes, options, tables, loyalty, pickup and delivery | credit accounts, expiry dates, barcodes, delivery |
| Item fields | size, milk type, extra shot | brand, unit, barcode, expiry |
| Order stages | new, preparing, ready, collected or delivered | new, packed, out for delivery, delivered |
| Home items | stock running out, cash gap, slow hours | debts due, items expiring, stock running out |
| AI rules | tone, which actions need approval | tone, credit limits, which actions need approval |
| Skills | milk check before the rush, match-night bookings | debt reminders, expiry discounts |
