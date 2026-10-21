# Pack `studio`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | Studio |
| Adds | Brand kit, designs, post images, posts |
| Needs | only the essentials |
| Term | 2 (brand kit 1 if time) |
| On by default in | none by default |

## System calls

- [`channels.publish_post`](../syscalls/channels/publish_post.md)
- [`studio.get_brand_kit`](../syscalls/studio/get_brand_kit.md)
- [`studio.update_brand_kit`](../syscalls/studio/update_brand_kit.md)
- [`studio.list_templates`](../syscalls/studio/list_templates.md)
- [`studio.render_design`](../syscalls/studio/render_design.md)
- [`studio.generate_image`](../syscalls/studio/generate_image.md)
- [`studio.save_design`](../syscalls/studio/save_design.md)
- [`studio.list_designs`](../syscalls/studio/list_designs.md)
- [`studio.create_post`](../syscalls/studio/create_post.md)
- [`studio.schedule_post`](../syscalls/studio/schedule_post.md)
- [`studio.list_posts`](../syscalls/studio/list_posts.md)

## Windows and sidebar items

To write.

## Skills that need it

To write (the AI team lists them).

## Listeners that only run when it is on

To write.

## Settings

To write.

## Setup skill

What the AI walks the owner through when the pack is turned on. To write.

## Turning it off

Refused while another pack that is on needs it, or while it has open work. Its
data is kept and hidden, and comes back when it is turned on again.
