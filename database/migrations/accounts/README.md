# Schema `accounts`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.3, 7.1 and 7.6. When the design changes, this page changes with it.

The people of each business, split by business: one slot per business. An
account belongs to one business only.

```
account           business_id, id, username (unique in the business),
                  display_name, role, email (optional for staff),
                  email_verified_at, google_id, phone, password_hash,
                  must_change_password, second_step, language,
                  failed_logins, locked_until, created_at, updated_at
                  PRIMARY KEY (business_id, id),
                  UNIQUE (business_id, username)
invite            business_id, id, email, role, token_hash, invited_by,
                  expires_at, accepted_at
email_code        business_id, id, account_id, purpose, code_hash,
                  attempts, expires_at, used_at
```

- Every email and Google ID here also has its row in `directory.login`,
  written in the same transaction
- Replaces today's `core.account`, `core.membership`, `core.invite` and the
  account part of `core.email_code`

No migrations yet.
