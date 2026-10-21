# Packs

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7.3. When the design changes, this page changes with it.

Every business gets the [essentials](essentials.md). Everything else is a pack
the owner turns on or off. A pack is the capability: a system call's pack field names it.

## How a pack works

1. Each pack is one file in the contracts: its key, its module, what it needs,
   its system calls, its windows and sections, its skills, its event listeners, its
   settings, and a setup skill
2. **One switch for everything.** The pack is the capability: a system call's
   capability field names its pack. When a pack is off, its system calls do not exist
   for that business, its windows and sidebar items hide, its skills are not
   offered, and its listeners do nothing
3. **Events still flow.** ERP always emits `OrderCompleted`; if `loyalty` is off,
   no points are added; if `stock` is off, no stock is deducted. No module needs
   to know which packs another business has on
4. **Skills say what they need.** A skill lists its packs (`needs: [orders]`), and
   a step can depend on one (`if stock: erp.get_stock_levels`), so one skill
   works for businesses with different packs
5. **Turning on:** owner only, from Settings or by asking the AI. Packs it needs
   are turned on too, after the owner confirms. The setup skill walks them
   through it ("add your ingredients, or send a photo of your invoice").
   Emits `PackTurnedOn`
6. **Turning off:** refused while another pack that is on needs it (the owner
   can turn both off), and while it has open work (an open shift, open orders,
   purchase orders not received). The data is kept and hidden, never deleted,
   and comes back when the pack is turned on again. Emits `PackTurnedOff`
7. **The AI suggests packs, never turns them on.** "You tell me about spoiled
   milk every day; want stock tracking?" comes as an approval card
8. Every module's tables exist for every business; a pack only switches access,
   so turning one on needs no database change

## The library (30)

| Pack | Module | Adds | Needs | Term |
|------|--------|------|-------|:----:|
| [`orders`](orders.md) | ERP | Orders from chat and the website, stages, payments, order status page | catalog | 1 |
| [`options`](options.md) | ERP | Modifiers: milk type, extra shot, sugar | catalog | 1 |
| [`delivery`](delivery.md) | ERP | Delivery areas and fees | orders | 1 |
| [`tables`](tables.md) | ERP | Dine-in and table numbers | orders | 1 |
| [`sales_screen`](sales_screen.md) | ERP | Counter sales on a tablet or phone | orders | 1 |
| [`shifts_cash`](shifts_cash.md) | ERP | Shifts, the cash count, cash gaps | sales_screen | 1 |
| [`stock`](stock.md) | ERP | The stock ledger, levels, waste, counts, forecasts | catalog | 1 |
| [`recipes`](recipes.md) | ERP | Ingredients, recipes, cost and margin per item | stock | 1 |
| [`purchasing`](purchasing.md) | ERP | Suppliers, purchase orders, receiving | stock | 1 |
| [`expiry`](expiry.md) | ERP | Expiry dates and alerts | stock | 1 basic, 2 full |
| [`barcodes`](barcodes.md) | ERP | Barcodes on items and the sales screen | sales_screen | 1 |
| [`credit`](credit.md) | ERP | Customer debts, limits, reminders | orders | 1 basic, 2 full |
| [`expenses`](expenses.md) | ERP | Expenses, and profit after expenses |  | 1 |
| [`branches`](branches.md) | ERP | More than one location, stock transfers | stock | 2 |
| [`online_payments`](online_payments.md) | ERP | Outside payment and courier services | orders | 2 |
| [`couriers`](couriers.md) | ERP | Outside payment and courier services | orders | 2 |
| [`offline_sales`](offline_sales.md) | ERP | Selling without internet; tax invoices | sales_screen | 2 |
| [`e_invoicing`](e_invoicing.md) | ERP | Selling without internet; tax invoices | sales_screen | 2 |
| [`loyalty`](loyalty.md) | CRM | Points and rewards | orders | 1 |
| [`support`](support.md) | CRM | Support cases and vouchers |  | 1 |
| [`bookings`](bookings.md) | CRM | Table or appointment bookings |  | 1 basic, 2 full |
| [`segments_consent`](segments_consent.md) | CRM | Saved customer groups, marketing consent |  | 2 |
| [`telegram`](telegram.md) | Channels | The Telegram bot |  | 1 |
| [`whatsapp`](whatsapp.md) | Channels | WhatsApp |  | 1 if Meta approves, 2 |
| [`instagram_facebook`](instagram_facebook.md) | Channels | Instagram and Facebook messages |  | 2 |
| [`website`](website.md) | Store | Full site: pages, banner, which items show |  | 1 basic, 2 full |
| [`search_presence`](search_presence.md) | Store | SEO and GEO, the Google profile, reviews | website | 2 |
| [`studio`](studio.md) | Studio | Brand kit, designs, post images, posts |  | 2 (brand kit 1 if time) |
| [`marketing`](marketing.md) | Marketing | Offers and campaigns | segments_consent | 2 |
| [`team`](team.md) | Team | Rota, attendance, tasks |  | 2 |
