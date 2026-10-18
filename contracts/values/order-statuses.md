# Order statuses

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 8.2. When the design changes, this page changes with it.

Stages come from the template:

```
new --> accepted --> preparing --> ready --> collected / delivered
 |         |            |
 +---------+------------+--> cancelled
```

| Move | What happens |
|------|-------------|
| new to accepted | reserve stock, emit `OrderCreated` |
| ready | emit `OrderReady`; Channels tells the customer |
| collected or delivered | deduct stock (sale movement), mark paid if cash, emit `OrderCompleted` |
| cancelled | release reserved stock, emit `OrderCancelled` |

A counter sale is created and completed in one step. All moves live in one
place; any other move is rejected.
