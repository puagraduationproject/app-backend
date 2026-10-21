# Roles

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7.1 and 17.2. When the design changes, this page changes with it.

Default roles: `owner`, `manager`, `staff`, `viewer`. Roles live in data, not
code; each business can change their permissions.

## What each role sees (draft; Security decides):

| Window | Owner | Manager | Staff | Viewer |
|--------|:-----:|:-------:|:-----:|:------:|
| Home: AI chat | all system calls | most system calls | sales, stock and how-to only | read-only answers |
| Sales screen, Orders | yes | yes | yes | view |
| Menu and stock | yes | yes | stock and waste only | view |
| Customers, Inbox | yes | yes | Inbox only | view |
| Approvals | yes | below the owner's limit | no | no |
| Team | yes | yes | own shifts and tasks | no |
| Marketing, Website and search | yes | if allowed | no | view |
| Settings | yes | no | no | no |
