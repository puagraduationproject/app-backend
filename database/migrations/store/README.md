# Schema `store`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 11.3. When the design changes, this page changes with it.

Only the `store` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
store_settings   business_id, slug, domain, theme(jsonb), sections(jsonb), published
store_page       id, business_id, kind(home|menu|about|custom), content(jsonb),
                 seo(jsonb), published_at
search_profile   business_id, descriptions(jsonb), structured_data(jsonb),
                 listing_status(jsonb), score, checked_at          (term 2)
review           id, business_id, source, rating, body, reply, replied_at (term 2)
```
