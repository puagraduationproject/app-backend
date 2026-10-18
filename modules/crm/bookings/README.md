# CRM: bookings

Bookings.

| | |
|-|-|
| Tables | booking |
| Emits | BookingCreated |

## Tools (5)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.check_availability`](../../../contracts/tools/crm/check_availability.md) | Free times for a party size | R | `bookings` | 1 basic, 2 full |
| [`crm.create_booking`](../../../contracts/tools/crm/create_booking.md) | Book, with an optional deposit | W | `bookings` | 1 basic, 2 full |
| [`crm.update_booking`](../../../contracts/tools/crm/update_booking.md) | Time, size | W | `bookings` | 1 basic, 2 full |
| [`crm.cancel_booking`](../../../contracts/tools/crm/cancel_booking.md) | Cancel | W | `bookings` | 1 basic, 2 full |
| [`crm.list_bookings`](../../../contracts/tools/crm/list_bookings.md) | Today, this week | R | `bookings` | 1 basic, 2 full |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
