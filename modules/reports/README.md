# Module: Reports

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 15. When the design changes, this page changes with it.

- Event listeners keep summary tables (sales by day, hour, item, staff, channel)
- The numbers on Home come from the template
- Feeds the app, the morning briefing and the AI
- Read only

Its system calls are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `syscalls` | One handler per system call page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every system call, every rule |

## Events

- **Emits:** none
- **Listens to:** CashGapFound, OrderCancelled, OrderCompleted, PaymentReceived, RefundIssued, WasteLogged

## System calls (5)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`reports.get_sales`](../../contracts/syscalls/reports/get_sales.md) | Totals by period, grouped by item, hour, staff, channel | R | `essentials` | 1 |
| [`reports.get_profit`](../../contracts/syscalls/reports/get_profit.md) | Sales minus recipe cost minus expenses | R | `essentials` | 1 |
| [`reports.get_trends`](../../contracts/syscalls/reports/get_trends.md) | This period against the last one | R | `essentials` | 1 |
| [`reports.get_home_numbers`](../../contracts/syscalls/reports/get_home_numbers.md) | The key numbers on Home | R | `essentials` | 1 |
| [`reports.get_value_report`](../../contracts/syscalls/reports/get_value_report.md) | Money saved and earned this month, in pounds | R | `essentials` | 1 |
