# Schema `studio`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 12.1. When the design changes, this page changes with it.

Only the `studio` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
brand_kit        business_id, colours(jsonb), fonts(jsonb), logo_url, voice(jsonb)
design_template  id, kind(post|story|menu|flyer|purchase_order), layout(jsonb),
                 season, version                         (shared, versioned)
design           id, business_id, template_id, data(jsonb), image_url, created_by_type
post             id, business_id, design_id, caption_ar, caption_en, channels,
                 status(draft|approved|scheduled|published), scheduled_at,
                 published_at, results(jsonb)
```
