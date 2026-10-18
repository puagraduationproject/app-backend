# Module: Studio

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 12. When the design changes, this page changes with it.

The business's look and its content (term 2, the brand kit starts in term 1 if
time allows).

Its tools are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

## Areas

| Folder | Holds |
|--------|-------|
| [`adapters`](adapters/README.md) | The open image model (term 2) |

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `tools` | One handler per tool page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every tool, every rule |

## Data (schema `studio`)

```
brand_kit        business_id, colours(jsonb), fonts(jsonb), logo_url, voice(jsonb)
design_template  id, kind(post|story|menu|flyer|purchase_order), layout(jsonb),
                 season, version                         (shared, versioned)
design           id, business_id, template_id, data(jsonb), image_url, created_by_type
post             id, business_id, design_id, caption_ar, caption_en, channels,
                 status(draft|approved|scheduled|published), scheduled_at,
                 published_at, results(jsonb)
```

## Events

- **Emits:** PostScheduled
- **Listens to:** none

## Tools (10)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`studio.get_brand_kit`](../../contracts/tools/studio/get_brand_kit.md) | Colours, fonts, logo, voice | R | `studio` | 2 (1 if time allows) |
| [`studio.update_brand_kit`](../../contracts/tools/studio/update_brand_kit.md) | Change the brand kit | W | `studio` | 2 (1 if time allows) |
| [`studio.list_templates`](../../contracts/tools/studio/list_templates.md) | Templates by kind and season | R | `studio` | 2 |
| [`studio.render_design`](../../contracts/tools/studio/render_design.md) | Template + data -> image or PDF preview | W | `studio` | 2 |
| [`studio.generate_image`](../../contracts/tools/studio/generate_image.md) | Background or product shot from the open image model | W | `studio` | 2 |
| [`studio.save_design`](../../contracts/tools/studio/save_design.md) | Keep a design | W | `studio` | 2 |
| [`studio.list_designs`](../../contracts/tools/studio/list_designs.md) | Saved designs | R | `studio` | 2 |
| [`studio.create_post`](../../contracts/tools/studio/create_post.md) | Draft: design + captions in Arabic and English | W | `studio` | 2 |
| [`studio.schedule_post`](../../contracts/tools/studio/schedule_post.md) | Time and channels | W | `studio` | 2 |
| [`studio.list_posts`](../../contracts/tools/studio/list_posts.md) | Drafts, scheduled, published, with results | R | `studio` | 2 |
