# Module: CRM

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 9. When the design changes, this page changes with it.

Relationships: who the customers are, and what they need from the business.

Its system calls are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

## Areas

| Folder | Holds |
|--------|-------|
| [`customers`](customers/README.md) | Customers, stats cache, usual order, merge and forget |
| [`identities`](identities/README.md) | Resolve identity, phone to +20, merge suggestions |
| [`timeline`](timeline/README.md) | Activity from other modules' events |
| [`loyalty`](loyalty/README.md) | Points and rewards |
| [`support`](support/README.md) | Cases, case events, vouchers, follow-ups |
| [`bookings`](bookings/README.md) | Bookings |
| [`engagement`](engagement/README.md) | Notes, tags, follow-ups |
| [`segments`](segments/README.md) | Segments and consent (term 2) |

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `syscalls` | One handler per system call page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every system call, every rule |

## Data (schema `crm`)

```
customer          id, business_id, name, area, lifecycle_stage, owner_user_id,
                  custom_fields(jsonb), first_seen_at, merged_into, forgotten_at
customer_identity id, business_id, customer_id, type(phone|whatsapp|telegram|
                  instagram|email), value_normalized, value_raw, verified
                  UNIQUE (business_id, type, value_normalized)
activity          id, business_id, customer_id, type(message|order|payment|note|
                  task|loyalty|booking|case), source_module, ref_type, ref_id,
                  summary, actor_type, occurred_at
customer_stats    customer_id, orders_count, total_spent_cents, avg_order_cents,
                  usual_order(jsonb), last_order_at, last_message_at      (cache)
loyalty_account   customer_id, points, tier
loyalty_entry     id, customer_id, points, reason, ref, created_at
support_case      id, business_id, number, customer_id, order_id, conversation_id,
                  type(complaint|request|question), status(open|waiting|resolved),
                  priority, assigned_to, resolution, created_at, resolved_at
case_event        id, case_id, type, note, actor_type, actor_id, created_at
voucher           id, business_id, customer_id, value_cents, reason, case_id,
                  expires_at, used_at
booking           id, business_id, customer_id, starts_at, party_size,
                  deposit_cents, status, note
tag, customer_tag, note, follow_up                           (engagement)
segment           id, business_id, name, filter(jsonb)        (term 2)
consent           id, business_id, customer_id, channel, status (term 2)
```

## Events

- **Emits:** BookingCreated, CaseOpened, CaseResolved, ConsentChanged, CustomerCreated, CustomerForgotten, CustomerInactive, CustomerMerged, LoyaltyRewardReached
- **Listens to:** MessageReceived, OrderCompleted, OrderCreated, PaymentReceived, RefundIssued

## System calls (31)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.find_customer`](../../contracts/syscalls/crm/find_customer.md) | By name or phone | R | `essentials` | 1 |
| [`crm.get_customer`](../../contracts/syscalls/crm/get_customer.md) | Full view: history, usual order, points, notes, open cases | R | `essentials` | 1 |
| [`crm.list_customers`](../../contracts/syscalls/crm/list_customers.md) | Filter: regulars, quiet, new, area, spend | R | `essentials` | 1 |
| [`crm.get_timeline`](../../contracts/syscalls/crm/get_timeline.md) | Everything that happened with this customer | R | `essentials` | 1 |
| [`crm.create_customer`](../../contracts/syscalls/crm/create_customer.md) | New customer | W | `essentials` | 1 |
| [`crm.update_customer`](../../contracts/syscalls/crm/update_customer.md) | Name, area, template fields | W | `essentials` | 1 |
| [`crm.suggest_merge`](../../contracts/syscalls/crm/suggest_merge.md) | Possible duplicates | R | `essentials` | 1 |
| [`crm.merge_customers`](../../contracts/syscalls/crm/merge_customers.md) | Merge two records | W | `essentials` | 2 |
| [`crm.add_note`](../../contracts/syscalls/crm/add_note.md) | Note on a customer | W | `essentials` | 1 |
| [`crm.tag_customer`](../../contracts/syscalls/crm/tag_customer.md) | Add or remove tags | W | `essentials` | 1 |
| [`crm.create_follow_up`](../../contracts/syscalls/crm/create_follow_up.md) | "Call Mariam Thursday", for staff or the AI | W | `essentials` | 1 |
| [`crm.get_loyalty`](../../contracts/syscalls/crm/get_loyalty.md) | Points, tier, next reward | R | `loyalty` | 1 |
| [`crm.add_points`](../../contracts/syscalls/crm/add_points.md) | Add points with a reason | W | `loyalty` | 1 |
| [`crm.redeem_reward`](../../contracts/syscalls/crm/redeem_reward.md) | Use a reward on an order | W | `loyalty` | 1 |
| [`crm.update_loyalty_rules`](../../contracts/syscalls/crm/update_loyalty_rules.md) | Points per pound, rewards | W | `loyalty` | 1 |
| [`crm.open_case`](../../contracts/syscalls/crm/open_case.md) | Complaint or request, linked to the order and the chat | W | `support` | 1 |
| [`crm.get_case`](../../contracts/syscalls/crm/get_case.md) | Status and history | R | `support` | 1 |
| [`crm.list_cases`](../../contracts/syscalls/crm/list_cases.md) | Open, by priority, by staff member | R | `support` | 1 |
| [`crm.update_case`](../../contracts/syscalls/crm/update_case.md) | Status, priority, assign to staff | W | `support` | 1 |
| [`crm.add_case_note`](../../contracts/syscalls/crm/add_case_note.md) | Note on a case | W | `support` | 1 |
| [`crm.issue_voucher`](../../contracts/syscalls/crm/issue_voucher.md) | Voucher as compensation | W | `support` | 1 |
| [`crm.resolve_case`](../../contracts/syscalls/crm/resolve_case.md) | Close with a result: apology, replacement, voucher, or refund (calls `erp.refund_payment`) | W | `support` | 1 |
| [`crm.check_availability`](../../contracts/syscalls/crm/check_availability.md) | Free times for a party size | R | `bookings` | 1 basic, 2 full |
| [`crm.create_booking`](../../contracts/syscalls/crm/create_booking.md) | Book, with an optional deposit | W | `bookings` | 1 basic, 2 full |
| [`crm.update_booking`](../../contracts/syscalls/crm/update_booking.md) | Time, size | W | `bookings` | 1 basic, 2 full |
| [`crm.cancel_booking`](../../contracts/syscalls/crm/cancel_booking.md) | Cancel | W | `bookings` | 1 basic, 2 full |
| [`crm.list_bookings`](../../contracts/syscalls/crm/list_bookings.md) | Today, this week | R | `bookings` | 1 basic, 2 full |
| [`crm.create_segment`](../../contracts/syscalls/crm/create_segment.md) | Saved filter: "Tuesday regulars" | W | `segments_consent` | 2 |
| [`crm.list_segment_members`](../../contracts/syscalls/crm/list_segment_members.md) | Who is in it | R | `segments_consent` | 2 |
| [`crm.get_consent`](../../contracts/syscalls/crm/get_consent.md) | Who agreed to marketing messages, on which channel | R | `segments_consent` | 2 |
| [`crm.record_consent`](../../contracts/syscalls/crm/record_consent.md) | Opt in or out ("stop" in chat = opt out) | W | `segments_consent` | 2 |
