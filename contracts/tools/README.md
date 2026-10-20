# Tool reference

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 4. When the design changes, this page changes with it.

One page per tool, one folder per module. The page is the contract: the backend
builds to it, the frontend and the AI team build on it, and an automatic test
checks the backend against it.

## Every page has

| Part | What it says |
|------|--------------|
| Purpose | What it does, when to use it and when not to |
| Inputs | Every parameter: name, type, required or optional, allowed values, default, example |
| Output | Every field returned, with its type and meaning |
| Errors | Every error code, what it means, what the caller should do |
| Effects | What it changes, which events it emits, what it never touches |
| Rules | Permission, pack, face, approval default, retry key, undo, limits |
| Examples | Full calls with results, including a refused one and an error |
| Changes | The current version and every change, with its date |

## Naming

`module.verb_noun`, always. The same names everywhere: a `customer_id` from CRM is
what Marketing takes.

## All tools (161)

### Core (12)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`core.get_business`](./core/get_business.md) | Profile, hours, location, delivery areas | R | `essentials` | 1 |
| [`core.update_business`](./core/update_business.md) | Hours, settings, profile | W | `essentials` | 1 |
| [`core.list_packs`](./core/list_packs.md) | Packs on, packs in the library, what each needs | R | `essentials` | 1 |
| [`core.turn_on_pack`](./core/turn_on_pack.md) | Turn a pack on, with the packs it needs (undo: turn off) | W | `essentials` | 1 |
| [`core.turn_off_pack`](./core/turn_off_pack.md) | Turn a pack off; its data is kept (undo: turn on) | W | `essentials` | 1 |
| [`core.list_members`](./core/list_members.md) | Members and roles | R | `essentials` | 1 |
| [`core.invite_member`](./core/invite_member.md) | Invite by phone or email with a role | W | `essentials` | 1 |
| [`core.change_role`](./core/change_role.md) | Change a member's role | W | `essentials` | 1 |
| [`core.remove_member`](./core/remove_member.md) | Remove a member | W | `essentials` | 1 |
| [`core.list_locations`](./core/list_locations.md) | Branches | R | `essentials` | 1 |
| [`core.get_audit_log`](./core/get_audit_log.md) | Who changed what | R | `essentials` | 1 |
| [`core.notify`](./core/notify.md) | Notification to a member | W | `essentials` | 1 |

### ERP (54)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.search_items`](./erp/search_items.md) | Search the menu by name, category, available now | R | `essentials` | 1 |
| [`erp.get_item`](./erp/get_item.md) | Item with sizes, options, price, photo, and its cost if the role allows | R | `essentials` | 1 |
| [`erp.list_categories`](./erp/list_categories.md) | Menu sections | R | `essentials` | 1 |
| [`erp.create_item`](./erp/create_item.md) | New item with sizes and options | W | `essentials` | 1 |
| [`erp.update_item`](./erp/update_item.md) | Name, description, photo, category, template fields | W | `essentials` | 1 |
| [`erp.change_price`](./erp/change_price.md) | New price | W | `essentials` | 1 |
| [`erp.set_availability`](./erp/set_availability.md) | Sold out today, back in stock | W | `essentials` | 1 |
| [`erp.manage_modifiers`](./erp/manage_modifiers.md) | Option groups: milk type, extra shot, sugar | W | `options` | 1 |
| [`erp.archive_item`](./erp/archive_item.md) | Hide an item (undo: restore) | W | `essentials` | 1 |
| [`erp.list_ingredients`](./erp/list_ingredients.md) | Ingredients with unit and cost | R | `recipes` | 1 |
| [`erp.create_ingredient`](./erp/create_ingredient.md) | New ingredient | W | `recipes` | 1 |
| [`erp.update_ingredient`](./erp/update_ingredient.md) | Unit, cost, supplier | W | `recipes` | 1 |
| [`erp.get_recipe`](./erp/get_recipe.md) | What one sale uses | R | `recipes` | 1 |
| [`erp.set_recipe`](./erp/set_recipe.md) | Recipe lines for an item or size | W | `recipes` | 1 |
| [`erp.get_item_cost`](./erp/get_item_cost.md) | Cost now, margin, change since last month | R | `recipes` | 1 |
| [`erp.suggest_price`](./erp/suggest_price.md) | Price for a target margin | R | `recipes` | 1 |
| [`erp.get_stock_levels`](./erp/get_stock_levels.md) | Levels; filter low, expiring, by branch | R | `stock` | 1 |
| [`erp.get_stock_history`](./erp/get_stock_history.md) | Movements for one ingredient or product | R | `stock` | 1 |
| [`erp.forecast_stock`](./erp/forecast_stock.md) | When it runs out, at the current pace | R | `stock` | 1 |
| [`erp.log_waste`](./erp/log_waste.md) | Waste with a reason | W | `stock` | 1 |
| [`erp.adjust_stock`](./erp/adjust_stock.md) | Count correction | W | `stock` | 1 |
| [`erp.record_stock_in`](./erp/record_stock_in.md) | Stock bought without a purchase order | W | `stock` | 1 |
| [`erp.transfer_stock`](./erp/transfer_stock.md) | Between branches | W | `branches` | 2 |
| [`erp.create_order`](./erp/create_order.md) | Pickup, delivery or dine-in order | W | `orders` | 1 |
| [`erp.record_counter_sale`](./erp/record_counter_sale.md) | Sale created and paid in one step | W | `sales_screen` | 1 |
| [`erp.get_order`](./erp/get_order.md) | One order by number, with lines, status, payment | R | `orders` | 1 |
| [`erp.list_orders`](./erp/list_orders.md) | Open, today, by channel, by customer | R | `orders` | 1 |
| [`erp.update_order_status`](./erp/update_order_status.md) | Move to the next stage | W | `orders` | 1 |
| [`erp.edit_order`](./erp/edit_order.md) | Add or remove lines before preparing | W | `orders` | 1 |
| [`erp.cancel_order`](./erp/cancel_order.md) | Cancel; releases stock | W | `orders` | 1 |
| [`erp.apply_discount`](./erp/apply_discount.md) | Discount on an order | W | `orders` | 1 |
| [`erp.record_payment`](./erp/record_payment.md) | Cash, card, wallet, on account | W | `orders` | 1 |
| [`erp.list_payments`](./erp/list_payments.md) | By period, method, shift | R | `orders` | 1 |
| [`erp.refund_payment`](./erp/refund_payment.md) | Full or partial refund | W | `orders` | 1 |
| [`erp.get_shift`](./erp/get_shift.md) | The open shift: expected cash so far | R | `shifts_cash` | 1 |
| [`erp.list_shifts`](./erp/list_shifts.md) | Past shifts with gaps | R | `shifts_cash` | 1 |
| [`erp.record_cash_movement`](./erp/record_cash_movement.md) | Cash in or out of the drawer | W | `shifts_cash` | 1 |
| [`erp.list_suppliers`](./erp/list_suppliers.md) | Suppliers and what they supply | R | `purchasing` | 1 |
| [`erp.get_supplier`](./erp/get_supplier.md) | Prices, history, delivery days | R | `purchasing` | 1 |
| [`erp.create_supplier`](./erp/create_supplier.md) | New supplier | W | `purchasing` | 1 |
| [`erp.update_supplier`](./erp/update_supplier.md) | Contact, items, prices | W | `purchasing` | 1 |
| [`erp.compare_supplier_prices`](./erp/compare_supplier_prices.md) | Same ingredient across suppliers | R | `purchasing` | 1 |
| [`erp.draft_purchase_order`](./erp/draft_purchase_order.md) | Draft from low stock or by request | W | `purchasing` | 1 |
| [`erp.update_purchase_order`](./erp/update_purchase_order.md) | Lines, quantities | W | `purchasing` | 1 |
| [`erp.send_purchase_order`](./erp/send_purchase_order.md) | Send to the supplier | W | `purchasing` | 1 |
| [`erp.receive_purchase`](./erp/receive_purchase.md) | Full or partial delivery, actual costs | W | `purchasing` | 1 |
| [`erp.cancel_purchase_order`](./erp/cancel_purchase_order.md) | Cancel | W | `purchasing` | 1 |
| [`erp.get_credit_account`](./erp/get_credit_account.md) | Balance, limit, history | R | `credit` | 1 |
| [`erp.list_debts`](./erp/list_debts.md) | Due and overdue | R | `credit` | 1 |
| [`erp.charge_on_account`](./erp/charge_on_account.md) | Sale on credit | W | `credit` | 1 |
| [`erp.record_debt_payment`](./erp/record_debt_payment.md) | Payment against a debt | W | `credit` | 1 |
| [`erp.set_credit_limit`](./erp/set_credit_limit.md) | Change a customer's limit | W | `credit` | 1 |
| [`erp.record_expense`](./erp/record_expense.md) | Rent, salaries, bills, with a receipt photo | W | `expenses` | 1 |
| [`erp.list_expenses`](./erp/list_expenses.md) | By period and category | R | `expenses` | 1 |

### CRM (31)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.find_customer`](./crm/find_customer.md) | By name or phone | R | `essentials` | 1 |
| [`crm.get_customer`](./crm/get_customer.md) | Full view: history, usual order, points, notes, open cases | R | `essentials` | 1 |
| [`crm.list_customers`](./crm/list_customers.md) | Filter: regulars, quiet, new, area, spend | R | `essentials` | 1 |
| [`crm.get_timeline`](./crm/get_timeline.md) | Everything that happened with this customer | R | `essentials` | 1 |
| [`crm.create_customer`](./crm/create_customer.md) | New customer | W | `essentials` | 1 |
| [`crm.update_customer`](./crm/update_customer.md) | Name, area, template fields | W | `essentials` | 1 |
| [`crm.suggest_merge`](./crm/suggest_merge.md) | Possible duplicates | R | `essentials` | 1 |
| [`crm.merge_customers`](./crm/merge_customers.md) | Merge two records | W | `essentials` | 2 |
| [`crm.add_note`](./crm/add_note.md) | Note on a customer | W | `essentials` | 1 |
| [`crm.tag_customer`](./crm/tag_customer.md) | Add or remove tags | W | `essentials` | 1 |
| [`crm.create_follow_up`](./crm/create_follow_up.md) | "Call Mariam Thursday", for staff or the AI | W | `essentials` | 1 |
| [`crm.get_loyalty`](./crm/get_loyalty.md) | Points, tier, next reward | R | `loyalty` | 1 |
| [`crm.add_points`](./crm/add_points.md) | Add points with a reason | W | `loyalty` | 1 |
| [`crm.redeem_reward`](./crm/redeem_reward.md) | Use a reward on an order | W | `loyalty` | 1 |
| [`crm.update_loyalty_rules`](./crm/update_loyalty_rules.md) | Points per pound, rewards | W | `loyalty` | 1 |
| [`crm.open_case`](./crm/open_case.md) | Complaint or request, linked to the order and the chat | W | `support` | 1 |
| [`crm.get_case`](./crm/get_case.md) | Status and history | R | `support` | 1 |
| [`crm.list_cases`](./crm/list_cases.md) | Open, by priority, by staff member | R | `support` | 1 |
| [`crm.update_case`](./crm/update_case.md) | Status, priority, assign to staff | W | `support` | 1 |
| [`crm.add_case_note`](./crm/add_case_note.md) | Note on a case | W | `support` | 1 |
| [`crm.issue_voucher`](./crm/issue_voucher.md) | Voucher as compensation | W | `support` | 1 |
| [`crm.resolve_case`](./crm/resolve_case.md) | Close with a result: apology, replacement, voucher, or refund (calls `erp.refund_payment`) | W | `support` | 1 |
| [`crm.check_availability`](./crm/check_availability.md) | Free times for a party size | R | `bookings` | 1 basic, 2 full |
| [`crm.create_booking`](./crm/create_booking.md) | Book, with an optional deposit | W | `bookings` | 1 basic, 2 full |
| [`crm.update_booking`](./crm/update_booking.md) | Time, size | W | `bookings` | 1 basic, 2 full |
| [`crm.cancel_booking`](./crm/cancel_booking.md) | Cancel | W | `bookings` | 1 basic, 2 full |
| [`crm.list_bookings`](./crm/list_bookings.md) | Today, this week | R | `bookings` | 1 basic, 2 full |
| [`crm.create_segment`](./crm/create_segment.md) | Saved filter: "Tuesday regulars" | W | `segments_consent` | 2 |
| [`crm.list_segment_members`](./crm/list_segment_members.md) | Who is in it | R | `segments_consent` | 2 |
| [`crm.get_consent`](./crm/get_consent.md) | Who agreed to marketing messages, on which channel | R | `segments_consent` | 2 |
| [`crm.record_consent`](./crm/record_consent.md) | Opt in or out ("stop" in chat = opt out) | W | `segments_consent` | 2 |

### Channels (12)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`channels.list_conversations`](./channels/list_conversations.md) | Open, waiting, by channel, handled by AI or staff | R | `essentials` | 1 |
| [`channels.get_conversation`](./channels/get_conversation.md) | Messages and state | R | `essentials` | 1 |
| [`channels.reply`](./channels/reply.md) | Reply in a conversation | W | `essentials` | 1 |
| [`channels.send_message`](./channels/send_message.md) | Start a message to one customer | W | `essentials` | 1 |
| [`channels.handoff_to_staff`](./channels/handoff_to_staff.md) | Pass the chat to a person, with the reason | W | `essentials` | 1 |
| [`channels.hand_back_to_ai`](./channels/hand_back_to_ai.md) | Staff give the chat back | W | `essentials` | 1 |
| [`channels.assign_conversation`](./channels/assign_conversation.md) | To a staff member | W | `essentials` | 1 |
| [`channels.tag_conversation`](./channels/tag_conversation.md) | Add or remove tags | W | `essentials` | 1 |
| [`channels.close_conversation`](./channels/close_conversation.md) | Close | W | `essentials` | 1 |
| [`channels.list_channels`](./channels/list_channels.md) | Connected channels and their status | R | `essentials` | 1 |
| [`channels.set_auto_reply`](./channels/set_auto_reply.md) | Away, opening hours, greeting | W | `essentials` | 1 |
| [`channels.publish_post`](./channels/publish_post.md) | Publish a Studio post to a channel | W | `studio` | 2 |

### Store website (10)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`store.get_site`](./store/get_site.md) | Pages, sections, theme, what is published | R | `website` | 1 |
| [`store.update_page`](./store/update_page.md) | Edit a page or section | W | `website` | 1 |
| [`store.set_banner`](./store/set_banner.md) | Announcement banner ("closed Friday until 2") | W | `website` | 1 |
| [`store.set_menu_display`](./store/set_menu_display.md) | Which items and sections show | W | `website` | 1 |
| [`store.update_theme`](./store/update_theme.md) | Look of the site, from the brand kit | W | `website` | 2 |
| [`store.get_search_presence`](./store/get_search_presence.md) | Score and issues | R | `search_presence` | 2 |
| [`store.update_descriptions`](./store/update_descriptions.md) | Descriptions and structured data | W | `search_presence` | 2 |
| [`store.sync_listing`](./store/sync_listing.md) | Push hours, menu and photos to the Google profile | W | `search_presence` | 2 |
| [`store.list_reviews`](./store/list_reviews.md) | New and unanswered reviews | R | `search_presence` | 2 |
| [`store.reply_review`](./store/reply_review.md) | Answer a review | W | `search_presence` | 2 |

### Studio (10)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`studio.get_brand_kit`](./studio/get_brand_kit.md) | Colours, fonts, logo, voice | R | `studio` | 2 (1 if time allows) |
| [`studio.update_brand_kit`](./studio/update_brand_kit.md) | Change the brand kit | W | `studio` | 2 (1 if time allows) |
| [`studio.list_templates`](./studio/list_templates.md) | Templates by kind and season | R | `studio` | 2 |
| [`studio.render_design`](./studio/render_design.md) | Template + data -> image or PDF preview | W | `studio` | 2 |
| [`studio.generate_image`](./studio/generate_image.md) | Background or product shot from the open image model | W | `studio` | 2 |
| [`studio.save_design`](./studio/save_design.md) | Keep a design | W | `studio` | 2 |
| [`studio.list_designs`](./studio/list_designs.md) | Saved designs | R | `studio` | 2 |
| [`studio.create_post`](./studio/create_post.md) | Draft: design + captions in Arabic and English | W | `studio` | 2 |
| [`studio.schedule_post`](./studio/schedule_post.md) | Time and channels | W | `studio` | 2 |
| [`studio.list_posts`](./studio/list_posts.md) | Drafts, scheduled, published, with results | R | `studio` | 2 |

### Marketing (6)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`marketing.list_offers`](./marketing/list_offers.md) | Current and past offers | R | `marketing` | 2 |
| [`marketing.create_offer`](./marketing/create_offer.md) | Discount or bundle with dates and hours | W | `marketing` | 2 |
| [`marketing.end_offer`](./marketing/end_offer.md) | End early | W | `marketing` | 2 |
| [`marketing.create_campaign`](./marketing/create_campaign.md) | Draft: segment, offer, message, channels | W | `marketing` | 2 |
| [`marketing.send_campaign`](./marketing/send_campaign.md) | Send to the segment, consent checked | W | `marketing` | 2 |
| [`marketing.get_campaign_results`](./marketing/get_campaign_results.md) | Reach, orders, money earned | R | `marketing` | 2 |

### Team (10)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`team.list_staff`](./team/list_staff.md) | Staff, roles, availability | R | `team` | 2 |
| [`team.get_rota`](./team/get_rota.md) | Who works when | R | `team` | 2 |
| [`team.set_rota`](./team/set_rota.md) | Plan shifts for the week | W | `team` | 2 |
| [`team.swap_shift`](./team/swap_shift.md) | Swap between two staff | W | `team` | 2 |
| [`team.record_attendance`](./team/record_attendance.md) | Clock in or out | W | `team` | 2 |
| [`team.list_attendance`](./team/list_attendance.md) | Late, missed, hours worked | R | `team` | 2 |
| [`team.create_task`](./team/create_task.md) | Task for a staff member | W | `team` | 2 |
| [`team.list_tasks`](./team/list_tasks.md) | Open and overdue tasks | R | `team` | 2 |
| [`team.complete_task`](./team/complete_task.md) | Mark done | W | `team` | 2 |
| [`team.get_staff_performance`](./team/get_staff_performance.md) | Sales, waste, cash gaps per staff member | R | `team` | 2 |

### Reports (5)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`reports.get_sales`](./reports/get_sales.md) | Totals by period, grouped by item, hour, staff, channel | R | `essentials` | 1 |
| [`reports.get_profit`](./reports/get_profit.md) | Sales minus recipe cost minus expenses | R | `essentials` | 1 |
| [`reports.get_trends`](./reports/get_trends.md) | This period against the last one | R | `essentials` | 1 |
| [`reports.get_home_numbers`](./reports/get_home_numbers.md) | The key numbers on Home | R | `essentials` | 1 |
| [`reports.get_value_report`](./reports/get_value_report.md) | Money saved and earned this month, in pounds | R | `essentials` | 1 |

### AI layer (11)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`ai.find_tools`](./ai/find_tools.md) | Finds the tools that match a task, filtered for this person | R | `essentials` | 1 |
| [`ai.load_skill`](./ai/load_skill.md) | Loads a skill's full steps | R | `essentials` | 1 |
| [`ai.search_knowledge`](./ai/search_knowledge.md) | Searches the business's FAQs and policies | R | `essentials` | 1 |
| [`ai.remember`](./ai/remember.md) | Saves a decision to memory, after the owner confirms | R | `essentials` | 1 |
| [`ai.ask_approval`](./ai/ask_approval.md) | Sends an approval card and waits | R | `essentials` | 1 |
| [`ai.schedule`](./ai/schedule.md) | Runs a skill or a plan later, or repeatedly | R | `essentials` | 1 |
| [`ai.save_skill`](./ai/save_skill.md) | Saves a new or edited skill, after the owner confirms | R | `essentials` | 1 |
| [`ai.get_permissions`](./ai/get_permissions.md) | What the AI may do here: each area's setting and limit (6.6) | R | `essentials` | 1 |
| [`ai.set_permission`](./ai/set_permission.md) | Changes a setting. Called only by the app when the owner taps it; never by the AI | R | `essentials` | 1 |
| [`ai.list_models`](./ai/list_models.md) | The models the owner can pick, with where each runs, what it costs and what data leaves our server | R | `essentials` | 2 |
| [`ai.set_model`](./ai/set_model.md) | Sets the model per face. Called only by the app when the owner taps it; never by the AI | W | `essentials` | 2 |
