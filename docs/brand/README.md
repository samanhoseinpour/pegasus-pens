# Pegasus Pens brand assets

Source files supplied by the owner on 2026-11-02. Nothing in `docs/` is deployed to Shopify; only `assets/` is.

## The logo

`logo-original.jpg` is the emblem: a gold, embossed medallion with a winged horse and pen, British Columbia mountains and pines, maple leaves, and a serif "PEGASUS PENS" wordmark on parchment. It is a JPEG on white, so there is no vector or transparent original. `assets/pegasus-emblem.png` (200 px, transparent, circular crop) is derived from it and used in the header, the footer and as the favicon fallback. A merchant-uploaded logo or favicon (Theme settings → Logo) overrides it.

## Palette (sampled from the emblem, then checked for WCAG contrast)

| Role | Value | Where |
|---|---|---|
| Parchment | `#F6ECD8` | page background, scheme-1 |
| Sand | `#E9CDA9` | panels, scheme-2 |
| Bronze | `#7D5027` | scheme-3, accents on light surfaces (5.9:1) |
| Espresso | `#22110A` | dark sections, scheme-4 |
| Ink | `#2A1508` | text on light surfaces (14.8:1) |
| Gold | `#D4A857` | **dark surfaces only**: buttons, lines, stars (8.3:1 on espresso, 1.9:1 on parchment) |
| Maple | `#8E221C` | scheme-5, sale prices (the logo's maple-leaf red) |

Rule: never put gold text or thin gold lines on parchment or sand. Use bronze there.

## Photos

`products/` holds the 15 images (the 16th file is the logo). Names describe the look; the owner has not named the products yet.

| Pen (placeholder name) | Product shots (white background) | Lifestyle scene |
|---|---|---|
| Marbled Resin | `marbled-1`, `marbled-2` | `marbled-desk` |
| Grey Ribbed | `grey-ribbed-1` | `grey-ribbed-desk` |
| Burl Hourglass | `burl-1`, `burl-2` | `burl-desk` |
| Brown Wood | `brown-wood-1` | `brown-wood-stone` |
| Rose Resin | `rose-1`, `rose-2` | `rose-writing` (shows a third-party handbag logo; not used on the site) |
| Laminated Wood | `laminate-1`, `laminate-2` | `laminate-leather` |

Product shots belong on the products themselves (upload them in Shopify admin). Five lifestyle scenes are bundled in `assets/pegasus-scene-*.jpg` as default images for sections until a merchant picks their own (`snippets/pegasus-scene.liquid`).

Material names, prices and product names in the local preview are placeholders inferred from the photos.
