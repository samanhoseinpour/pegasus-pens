# Pegasus Pens brand assets

Source files supplied by the owner on 2026-11-02. Nothing in `docs/` is deployed to Shopify; only `assets/` is.

## The logo

`logo-original.jpg` is the emblem: a gold, embossed medallion with a winged horse and pen, British Columbia mountains and pines, maple leaves, and a serif "PEGASUS PENS" wordmark on parchment. It is a JPEG on white, so there is no vector or transparent original. `assets/pegasus-emblem.png` (200 px, transparent, circular crop) is derived from it and used in the header, the footer and as the favicon fallback. A merchant-uploaded logo or favicon (Theme settings → Logo) overrides it.

`assets/pegasus-emblem-large.webp` (1080 px, same circular crop, 220 KB) is the About page hero. It is cut from the original at full size, so it is as sharp as the source allows. To make it again:

```
magick docs/brand/logo-original.jpg -resize 1080x1080 \( -size 1080x1080 xc:black -fill white -draw "circle 540,540 540,5" \) -alpha off -compose CopyOpacity -composite -define webp:method=6 -quality 85 assets/pegasus-emblem-large.webp
```

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

### Product photos (the client's folder)

The client's source files are in `product-images/` at the repo root (gitignored, about 98 MB): one folder per pen, `1` to `8`, with the photos and a Word doc (name, materials, hours of work, price); `Pegasus about us.docx` (the maker story); and `_zips/` (the same files as Google Drive downloads). On 2026-11-13 they were uploaded to the products in Shopify, renamed and with alt text, so the store holds the photos. Nothing here is deployed.

| # | Pen | Handle | Type | CAD |
|---|---|---|---|---|
| 1 | Date Seed Pen | `date-seed-pen` | Date seed | 180 |
| 2 | Canadian Leather Pen | `canadian-leather-pen` | Leather | 120 |
| 3 | Plum Wood & Persian Khatam Pen | `plum-wood-persian-khatam-pen` | Hardwood | 100 |
| 4 | Cross-Grain Oak Pen | `cross-grain-oak-pen` | Hardwood | 80 |
| 5 | Six Hardwoods Pen | `six-hardwoods-pen` | Segmented wood | 80 |
| 6 | Maple Wood Pen | `maple-wood-pen` | Hardwood | 80 |
| 7 | Walnut, Rosewood, Maple & Acrylic Pen | `walnut-rosewood-maple-acrylic-pen` | Segmented wood | 80 |
| 8 | Olive Wood Pen | `olive-wood-pen` | Hardwood | 100 |

**Naming rule:** `<product handle>-<view>.<ext>`, lowercase with hyphens (front, side, a short name for the scene, in-stand, on-paper).

**Alt text rule:** say what is visible (material, shape, hardware, setting), make each one unique, never start with "image of", and stay under 125 characters. The first photo of each pen names it.

**Order:** the first photo is always a white studio shot. The studio white is rgb 254, the same as the gallery mat `--pg-mat`, and the spotlight cutout, the drifting pens and the cards depend on that first photo. The eight landscape camera shots (`5/1-1` to `8/1-8`, light grey) were centre-cropped to 4:5, the studio shots' ratio, so the gallery pairs line up.

| Pen | File name in Shopify | Source in `product-images/` | Alt text |
|---|---|---|---|
| 1 | `date-seed-pen-front.png` | `1/47A1BE1E-ECB3-4C87-B589-9330F7CF1BB8.png` | Handmade date seed pen, upright, its sculpted barrel a mosaic of cream, grey and red seed, with gold-tone clip and tip |
| 1 | `date-seed-pen-side.png` | `1/96574725-61FE-4E4C-AEE2-D02B1C519F2D.png` | Side view of the date seed pen, showing the curve of the barrel and the gold-tone pocket clip |
| 1 | `date-seed-pen-on-office-desk.png` | `1/FB562C62-F2A9-44B8-B64F-184DBB3C7BCB.png` | Date seed pen in a clear acrylic stand on a dark marble desk, a city skyline at dusk in the window behind |
| 1 | `date-seed-pen-blank-workshop.jpg` | `1/ccd8a670-7201-48fc-b0dc-f5eacf397a49.jpg` | The pen blank in the workshop: trimmed date seeds glued upright around a brass tube, before turning |
| 1 | `date-seed-pen-seeds-workbench.jpg` | `1/b50d8a35-9553-4c06-bf2d-aab73bd8e289.jpg` | Rows of trimmed date seeds glued side by side on the workbench, loose seed pieces behind |
| 2 | `canadian-leather-pen-front.png` | `2/B5059771-EA36-4188-8A9A-B335ADC88BB6.png` | Canadian leather pen: grey layered leather above a gold-tone band, black, cream and wine-red leather below |
| 2 | `canadian-leather-pen-on-office-desk.png` | `2/0D87CB94-0D8A-4F95-9064-62AFEB1D48AB.png` | Leather pen in a clear acrylic stand on a dark marble desk, beside a leather folio and a black and gold globe |
| 2 | `canadian-leather-pen-on-paper.jpg` | `2/ca157210-e737-47cf-8c67-895c769e0cdf.jpg` | The leather pen lying on white paper, clip side up, showing the stacked layers of leather |
| 2 | `canadian-leather-pen-on-paper-back.jpg` | `2/5809caa0-d4cc-4b2f-bf03-a348e58f64a0.jpg` | The leather pen on white paper from the other side, its ridged grey upper and striped lower barrel |
| 3 | `plum-wood-persian-khatam-pen-front.png` | `3/95F0C288-2C70-4C91-B978-9CA94AC700A7.png` | Hourglass-shaped plum wood pen with dark Persian Khatam inlay in two curved grooves, gold-tone band and tip |
| 3 | `plum-wood-persian-khatam-pen-on-library-desk.png` | `3/7FE79203-A314-4AA4-88FF-3DFFD72BD0A6.png` | Plum wood and Khatam pen on a small clear stand on a leather desk, old books and a brass lamp behind |
| 3 | `plum-wood-persian-khatam-pen-on-paper.jpg` | `3/4c197174-01c8-49ca-8aeb-9f46c77e9ff4.jpg` | The plum wood pen on white paper, showing the wood grain and the dark Khatam inlay |
| 4 | `cross-grain-oak-pen-front.png` | `4/EDAD9E59-0C77-4CBD-AF22-4851112867B0.png` | Cross-grain oak pen with a wavy sculpted barrel, the oak's growth rings running across it, gold-tone hardware |
| 4 | `cross-grain-oak-pen-on-slate.png` | `4/60DCEAA2-538C-476B-A623-764E3E074CC6.png` | Oak pen on a slab of dark slate beside a leather journal, a pine cone and warm string lights |
| 4 | `cross-grain-oak-pen-on-paper.jpg` | `4/bb2dd538-9bc5-48c1-8c74-a7977520b9c6.jpg` | The oak pen lying on white paper, clip side up |
| 4 | `cross-grain-oak-pen-on-paper-side.jpg` | `4/d22ede58-9dd3-4e96-a793-e07c398dcf95.jpg` | The oak pen on white paper from the side, the grain running across the barrel |
| 5 | `six-hardwoods-pen-front.png` | `5/Segmented Wooden Pen with Gold Accents.png` | Segmented pen in bands of ebony, maple, oak, padauk, teak and purpleheart, gold-tone clip facing forward |
| 5 | `six-hardwoods-pen-side.png` | `5/Handcrafted Multitone Wooden Pen.png` | Side view of the six-wood pen, its sculpted curves and gold-tone pocket clip |
| 5 | `six-hardwoods-pen-on-leather-notebook.png` | `5/Luxurious Handcrafted Wood and Gold Pen.png` | Six-wood pen resting on a brown leather notebook and desk pad, beside a black marble tray |
| 5 | `six-hardwoods-pen-in-stand.jpg` | `5/1-1.jpg (cropped to 4:5)` | The six-wood pen upright in a clear acrylic stand |
| 5 | `six-hardwoods-pen-in-stand-angled.jpg` | `5/1-2.jpg (cropped to 4:5)` | The six-wood pen leaning in a clear acrylic stand, clip side showing |
| 6 | `maple-wood-pen-front.png` | `6/Elegant Wooden Pen with Gold Accents.png` | Maple wood pen with a smooth upper barrel and a wavy lower barrel, gold-tone clip facing forward |
| 6 | `maple-wood-pen-side.png` | `6/Luxury Wooden Pen with Gold Accents.png` | Side view of the maple pen, the gold-tone pocket clip and the fine figure of the wood |
| 6 | `maple-wood-pen-on-oak-desk.png` | `6/Handcrafted Wooden Pen Still Life.png` | Maple pen resting on a brown leather notebook on an oak desk, beside a stone tray and green leaves |
| 6 | `maple-wood-pen-in-stand.jpg` | `6/1-3.jpg (cropped to 4:5)` | The maple pen upright in a clear acrylic stand |
| 6 | `maple-wood-pen-in-stand-angled.jpg` | `6/1-4.jpg (cropped to 4:5)` | The maple pen leaning in a clear acrylic stand |
| 7 | `walnut-rosewood-maple-acrylic-pen-front.png` | `7/Handcrafted Rosewood and Pink Resin Pen.png` | Pen with a smooth wooden upper barrel and a lower barrel banded in walnut, rosewood, maple and pink acrylic |
| 7 | `walnut-rosewood-maple-acrylic-pen-side.png` | `7/Luxury Handcrafted Wood and Resin Pen (2).png` | Side view of the wood and pink acrylic pen with its gold-tone pocket clip |
| 7 | `walnut-rosewood-maple-acrylic-pen-by-candlelight.png` | `7/Luxurious Pen and Candlelit Journal.png` | Wood and pink acrylic pen on a leather journal on a walnut desk, beside a lit pink candle |
| 7 | `walnut-rosewood-maple-acrylic-pen-in-stand.jpg` | `7/1-5.jpg (cropped to 4:5)` | The wood and pink acrylic pen upright in a clear acrylic stand |
| 7 | `walnut-rosewood-maple-acrylic-pen-in-stand-angled.jpg` | `7/1-6.jpg (cropped to 4:5)` | The wood and pink acrylic pen leaning in a clear acrylic stand |
| 8 | `olive-wood-pen-front.png` | `8/Polished Wooden Pen with Gold Accents.png` | Olive wood pen in golden brown with dark grain markings, gold-tone clip facing forward |
| 8 | `olive-wood-pen-side.png` | `8/Handcrafted Honey Wood and Gold Pen.png` | Side view of the olive wood pen, the gold-tone clip and the dark streaks in the grain |
| 8 | `olive-wood-pen-on-leather-desk-pad.png` | `8/Luxurious Leather Desk Still Life.png` | Olive wood pen on a leather desk pad beside a leather-bound book, an espresso and a magnifying glass |
| 8 | `olive-wood-pen-in-stand.jpg` | `8/1-7.jpg (cropped to 4:5)` | The olive wood pen upright in a clear acrylic stand |
| 8 | `olive-wood-pen-in-stand-angled.jpg` | `8/1-8.jpg (cropped to 4:5)` | The olive wood pen leaning in a clear acrylic stand |

Two workshop photos of pen 1 are also in Files, for theme sections (image settings `shopify://shop_images/<name>`):
- `pegasus-workshop-date-seed-blank.jpg`, in the home story.
- `pegasus-workshop-date-seeds.jpg`, in the About story.

### Cut-outs (2026-11-13)

So the pens float on the page with their own shadow (the client asked for them to "look 3D on the background"), each studio shot also exists as a cut-out: the same photo, same size, on a transparent background. They are in Files as `<handle>-front-cutout.png` and `<handle>-side-cutout.png`, with the matching photo's alt text, and listed on each product in the metafield **Cut-outs** (`custom.cutouts`), in the same order as the photos: front, then side. There are 13: the front shot of all eight pens, plus the side shot of pens 1, 5, 6, 7 and 8 (the second photo of pens 2 to 4 is a scene, which stays a photo).

How they were made: Apple Vision's subject mask (`VNGenerateForegroundInstanceMaskRequest`, the engine behind Preview's Remove Background), with the soft edge tightened and one pixel taken off so no white fringe is left (`magick photo.png \( mask.png -level 45%,100% -morphology Erode Disk:1 \) -alpha off -compose CopyOpacity -composite cutout.png`). The glossy studio floor mirrors the tip of pens 1 and 2, so their masks were cut just below the ball point. They are made for light backgrounds: on espresso, a thin light sliver can show in the narrow gap between a clip and the barrel.

**For a new pen:** open the white studio shot in Preview, choose Tools > Remove Background, then File > Export as PNG. Name it `<handle>-front-cutout.png` and add it to the product's Cut-outs field (then the side shot's, if there is one). Without a cut-out the pen simply keeps the old look.

### Earlier photos (`products/`, 2026-11-02)

The 15 images supplied first (the 16th file is the logo). Before the client named the pens, I gave them names from their look; they turned out to be five of the eight pens plus one more:

| Earlier name | Real pen |
|---|---|
| `marbled-*` | Date Seed Pen |
| `grey-ribbed-*` | Canadian Leather Pen |
| `burl-*` | Plum Wood & Persian Khatam Pen |
| `brown-wood-*` | Cross-Grain Oak Pen |
| `laminate-*` | Six Hardwoods Pen |
| `rose-*` | a pink resin pen the client has not described yet (the draft product `rose-resin-pen`). `rose-writing` shows a third-party handbag logo and is not used. |

Five lifestyle scenes from these are bundled in `assets/pegasus-scene-*.jpg`. Sections use them as default images until a merchant picks their own (`snippets/pegasus-scene.liquid`):
- `skyline`: the date seed pen
- `desk`: the leather pen
- `burl`: the plum and Khatam pen
- `stone`: the oak pen
- `leather`: the six hardwoods pen
