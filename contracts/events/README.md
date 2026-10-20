# Events

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.6 and 7.4. When the design changes, this page changes with it.

Every state change emits an event through the outbox, written in the same
transaction as the change. One page per event.

## The envelope

Every event has: `event_id`, `type`, `version`, `business_id`, `occurred_at`,
`actor`, `correlation_id`, `causation_id` (the event that caused it), the IDs it
is about (`customer_id`, `order_id`, ...), and its data.

## All events (42)

| Event | Emitted by | Listened to by |
|-------|------------|----------------|
| [`AiModelChanged`](AiModelChanged.md) | AI layer | none yet |
| [`AiPermissionChanged`](AiPermissionChanged.md) | AI layer | none yet |
| [`BookingCreated`](BookingCreated.md) | CRM | AI layer |
| [`BusinessCreated`](BusinessCreated.md) | Core | AI layer |
| [`CampaignSent`](CampaignSent.md) | Marketing | AI layer |
| [`CaseOpened`](CaseOpened.md) | CRM | AI layer |
| [`CaseResolved`](CaseResolved.md) | CRM | AI layer |
| [`CashGapFound`](CashGapFound.md) | ERP | AI layer, Reports |
| [`ConsentChanged`](ConsentChanged.md) | CRM | AI layer |
| [`ConversationHandedOff`](ConversationHandedOff.md) | Channels | AI layer |
| [`CostChanged`](CostChanged.md) | ERP | AI layer |
| [`CustomerCreated`](CustomerCreated.md) | CRM | AI layer |
| [`CustomerForgotten`](CustomerForgotten.md) | CRM | AI layer, Channels, ERP, Marketing |
| [`CustomerInactive`](CustomerInactive.md) | CRM | AI layer |
| [`CustomerMerged`](CustomerMerged.md) | CRM | AI layer, Channels, ERP, Marketing |
| [`DebtDue`](DebtDue.md) | ERP | AI layer |
| [`LoyaltyRewardReached`](LoyaltyRewardReached.md) | CRM | AI layer |
| [`MemberInvited`](MemberInvited.md) | Core | AI layer |
| [`MemberJoined`](MemberJoined.md) | Core | AI layer |
| [`MessageReceived`](MessageReceived.md) | Channels | AI layer, CRM |
| [`MessageSent`](MessageSent.md) | Channels | AI layer |
| [`OfferStarted`](OfferStarted.md) | Marketing | AI layer |
| [`OrderCancelled`](OrderCancelled.md) | ERP | AI layer, Reports |
| [`OrderCompleted`](OrderCompleted.md) | ERP | AI layer, CRM, Marketing, Reports |
| [`OrderCreated`](OrderCreated.md) | ERP | AI layer, Channels, CRM |
| [`OrderReady`](OrderReady.md) | ERP | AI layer, Channels |
| [`PackTurnedOff`](PackTurnedOff.md) | Core | AI layer |
| [`PackTurnedOn`](PackTurnedOn.md) | Core | AI layer |
| [`PaymentReceived`](PaymentReceived.md) | ERP | AI layer, CRM, Reports |
| [`PostPublished`](PostPublished.md) | Channels | AI layer |
| [`PostScheduled`](PostScheduled.md) | Studio | AI layer |
| [`PriceChanged`](PriceChanged.md) | ERP | AI layer |
| [`PurchaseReceived`](PurchaseReceived.md) | ERP | AI layer |
| [`RefundIssued`](RefundIssued.md) | ERP | AI layer, CRM, Reports |
| [`ReviewReceived`](ReviewReceived.md) | Store website | AI layer |
| [`RoleChanged`](RoleChanged.md) | Core | AI layer |
| [`ShiftMissed`](ShiftMissed.md) | Team | AI layer |
| [`SitePublished`](SitePublished.md) | Store website | AI layer |
| [`StockExpiring`](StockExpiring.md) | ERP | AI layer |
| [`StockLow`](StockLow.md) | ERP | AI layer |
| [`TaskOverdue`](TaskOverdue.md) | Team | AI layer |
| [`WasteLogged`](WasteLogged.md) | ERP | AI layer, Reports |
