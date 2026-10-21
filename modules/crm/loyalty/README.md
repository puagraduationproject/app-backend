# CRM: loyalty

Points and rewards.

| | |
|-|-|
| Tables | loyalty_account, loyalty_entry |
| Emits | LoyaltyRewardReached |

## System calls (4)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.get_loyalty`](../../../contracts/syscalls/crm/get_loyalty.md) | Points, tier, next reward | R | `loyalty` | 1 |
| [`crm.add_points`](../../../contracts/syscalls/crm/add_points.md) | Add points with a reason | W | `loyalty` | 1 |
| [`crm.redeem_reward`](../../../contracts/syscalls/crm/redeem_reward.md) | Use a reward on an order | W | `loyalty` | 1 |
| [`crm.update_loyalty_rules`](../../../contracts/syscalls/crm/update_loyalty_rules.md) | Points per pound, rewards | W | `loyalty` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
