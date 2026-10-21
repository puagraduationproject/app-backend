# Essentials

> From the design, section 7.3. Always on for every business; cannot be turned off.

| Module | What every business gets |
|--------|--------------------------|
| Core | The business, members and roles, locations, audit, notifications |
| AI | Home chat for the owner and staff, the customer face, approvals, skills |
| ERP | **Catalog only:** items or services, sizes, prices, categories, available or not. This is what the AI answers customers from |
| CRM | Customers, identities, timeline, notes, tags, follow-ups |
| Channels | Website chat and the Inbox |
| Store | The shop page: the catalog and the chat |
| Reports | Home numbers, from whatever packs are on |

## System calls (59)

- [`ai.find_syscalls`](../syscalls/ai/find_syscalls.md)
- [`ai.load_skill`](../syscalls/ai/load_skill.md)
- [`ai.search_knowledge`](../syscalls/ai/search_knowledge.md)
- [`ai.remember`](../syscalls/ai/remember.md)
- [`ai.ask_approval`](../syscalls/ai/ask_approval.md)
- [`ai.ask_question`](../syscalls/ai/ask_question.md)
- [`ai.schedule`](../syscalls/ai/schedule.md)
- [`ai.save_skill`](../syscalls/ai/save_skill.md)
- [`ai.get_permissions`](../syscalls/ai/get_permissions.md)
- [`ai.set_permission`](../syscalls/ai/set_permission.md)
- [`ai.list_models`](../syscalls/ai/list_models.md)
- [`ai.set_model`](../syscalls/ai/set_model.md)
- [`ogr.get_thing`](../syscalls/ogr/get_thing.md)
- [`ogr.list_links`](../syscalls/ogr/list_links.md)
- [`core.get_business`](../syscalls/core/get_business.md)
- [`core.update_business`](../syscalls/core/update_business.md)
- [`core.list_packs`](../syscalls/core/list_packs.md)
- [`core.turn_on_pack`](../syscalls/core/turn_on_pack.md)
- [`core.turn_off_pack`](../syscalls/core/turn_off_pack.md)
- [`core.list_members`](../syscalls/core/list_members.md)
- [`core.invite_member`](../syscalls/core/invite_member.md)
- [`core.change_role`](../syscalls/core/change_role.md)
- [`core.remove_member`](../syscalls/core/remove_member.md)
- [`core.list_locations`](../syscalls/core/list_locations.md)
- [`core.get_audit_log`](../syscalls/core/get_audit_log.md)
- [`core.notify`](../syscalls/core/notify.md)
- [`erp.search_items`](../syscalls/erp/search_items.md)
- [`erp.get_item`](../syscalls/erp/get_item.md)
- [`erp.list_categories`](../syscalls/erp/list_categories.md)
- [`erp.create_item`](../syscalls/erp/create_item.md)
- [`erp.update_item`](../syscalls/erp/update_item.md)
- [`erp.change_price`](../syscalls/erp/change_price.md)
- [`erp.set_availability`](../syscalls/erp/set_availability.md)
- [`erp.archive_item`](../syscalls/erp/archive_item.md)
- [`crm.find_customer`](../syscalls/crm/find_customer.md)
- [`crm.get_customer`](../syscalls/crm/get_customer.md)
- [`crm.list_customers`](../syscalls/crm/list_customers.md)
- [`crm.get_timeline`](../syscalls/crm/get_timeline.md)
- [`crm.create_customer`](../syscalls/crm/create_customer.md)
- [`crm.update_customer`](../syscalls/crm/update_customer.md)
- [`crm.suggest_merge`](../syscalls/crm/suggest_merge.md)
- [`crm.merge_customers`](../syscalls/crm/merge_customers.md)
- [`crm.add_note`](../syscalls/crm/add_note.md)
- [`crm.tag_customer`](../syscalls/crm/tag_customer.md)
- [`crm.create_follow_up`](../syscalls/crm/create_follow_up.md)
- [`channels.list_conversations`](../syscalls/channels/list_conversations.md)
- [`channels.get_conversation`](../syscalls/channels/get_conversation.md)
- [`channels.reply`](../syscalls/channels/reply.md)
- [`channels.send_message`](../syscalls/channels/send_message.md)
- [`channels.handoff_to_staff`](../syscalls/channels/handoff_to_staff.md)
- [`channels.hand_back_to_ai`](../syscalls/channels/hand_back_to_ai.md)
- [`channels.assign_conversation`](../syscalls/channels/assign_conversation.md)
- [`channels.tag_conversation`](../syscalls/channels/tag_conversation.md)
- [`channels.close_conversation`](../syscalls/channels/close_conversation.md)
- [`channels.list_channels`](../syscalls/channels/list_channels.md)
- [`channels.set_auto_reply`](../syscalls/channels/set_auto_reply.md)
- [`reports.get_sales`](../syscalls/reports/get_sales.md)
- [`reports.get_profit`](../syscalls/reports/get_profit.md)
- [`reports.get_trends`](../syscalls/reports/get_trends.md)
- [`reports.get_home_numbers`](../syscalls/reports/get_home_numbers.md)
- [`reports.get_value_report`](../syscalls/reports/get_value_report.md)
