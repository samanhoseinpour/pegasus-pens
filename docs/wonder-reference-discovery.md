# Reference discovery: "Nook" (Wonder theme) → Pegasus Pens

Status: **discovery + draft plan. Nothing has been built.** Captured 2026-11-01.

## 1. What the reference actually is

- Awwwards listing: "Nook-Wonder Theme for Shopify", Nominee (Oct 17, 2026), studio **Nethype**. Jury scores seen: 7.30, 7.50, 8.50 overall. Built with: E-Commerce, Responsive, Storytelling, UI design, Shopify.
- Live store: `wonder-theme-interior.myshopify.com`. `Shopify.theme` reports `schema_name: "Wonder"`, `schema_version: "2.5.1"`, `theme_store_id: null`. So **Wonder is a commercial theme sold outside Shopify's theme store**, and "NOOK" is one demo preset of it (interior-design catalog).
- The store is not password-gated. Wonder's CSS/JS were **not downloaded or copied**. Everything below is observed rendering (screenshots, computed styles, CSS variables read from the live page).

## 2. Design tokens (observed)

| Token | Value |
|---|---|
| Font | **Mona Sans** (400/500, plus 400 italic). A second face, `GTStandard-M 500`, also loads (a commercial Grilli Type font; not needed) |
| Body | 16px / 24px, weight 400, color `#1e1b18` |
| Headings | weight 500, line-height 1.2. Hero h2 57.6px / 69.12px. Product h1 32px / 38.4px. Parallax headline ≈ 100px+ |
| Eyebrow | 12.4px, uppercase, letter-spacing 1.3px, weight 500 |
| Card | title 16px/400, price 16px/500, vendor 12px uppercase gray |
| Ink / border | `#1e1b18` / `#e6e3de` |
| Cream / footer / panel bg | `#F4EEDA` (teaser) / `#f0eeeb` (footer) / `#f7f7f5` |
| Buttons | primary fill `#383531`, radius **30px (pill)**, padding 16px 24px, 16px text. Outline pill: 1px `#e6e3de` |
| Badges | pill r=30px, 14px text, padding 4px 10px, h=27px. Trending `#2252B5`, Eco Friendly `#5B6D5B`, Sale `#6F3434`, Limited `#9F8756`, all white text |
| Sale price | `#6f3434`. Rating stars `#d4af37` |
| Announcement bar | blue (≈`#1a3fd6`, sampled from screenshot only), 28.6px high, 3 slots (left / centered / right) |
| Layout | page width 1440, side padding **32px** (content 1376px), grid gap **8px**, section gap 80px desktop / 42px mobile |

## 3. Geometry at 1440×900 (desktop)

Announcement 29 → header 121 (two rows: logo + pill search + utilities, then centered nav). On scroll it collapses to **83px**, one row: hamburger + logo + search + utilities. The hamburger reveals the nav row. Hero is 632px (≈70vh). Product grid is 4 columns with square cards (≈338px), and the collection page uses a 258px filter sidebar plus 3 columns (≈347px).

Homepage sections in order (height px): slideshow 632 · collection list 319 · collage 605 · rich text 153 · featured-collection **tabs** 599 · image+text 592 · rich text 153 · featured-collection tabs 596 · **blur banner** 1647 · video reels 979 · brands 140 · shoppable image 889 · button 119 · **parallax** 4260 · scrolling icon+text 80 · grid view 720 · rich text 177 · grid view 560 · rich text 223 · pills nav 264 · testimonials 407 · image+text 632 · testimonial marquee 424 · multicolumn 748 · features banner 311 · footer 877. Total 17,255px.

Collection page: banner 273 · product grid 2036 · separator · features banner · map/address · footer. Product page: breadcrumbs 34 · main 1275 · rich text · testimonial marquee · video reels · before/after · map · footer.

## 4. Signature patterns (what makes it feel like this)

- **Header:** 2-row → compact sticky; pill search that expands into a full-width predictive overlay (Products, Suggestions, Articles, Collections, "View all" pill). Mega menu is full-width, 5 image cards on `#f5f5f5`, with page dim+blur behind. Localization is a right-hand drawer (country list with flags and currency, language tab, search).
- **Hero:** full-bleed image, uppercase eyebrow, huge white h2, two *underlined text links* (not buttons), dots **below** the image. On mobile the copy moves below the image on a flat tan panel.
- **Cards:** gray media box, hover reveals image-gallery arrows and a progress line, stacked badges, swatch dots, quick-buy overlay, "siblings" (linked variants).
- **Carousels:** horizontal scroll with a thin progress scrollbar and tab switching (featured collections).
- **Blur banner:** background image with 3 translucent white cards (opacity .9).
- **Parallax:** one pinned giant headline while product cutouts drift past at different speeds.
- **Shoppable image:** hotspot dots open a product drawer. **Scrolling text marquee** and **testimonial marquee**.
- **Cart drawer:** tiered reward bar (-10% / Free Delivery / -20%), qty stepper, free-assembly checkbox, Order Note / Discount Code / Shipping tabs, dark pill checkout, payment icons.
- **Product page:** image-swatch variant picker, qty pill + full-width pill Add to cart, payment icons, low-stock bar, discount-code + countdown, 3 trust icons, accordions, sticky bottom add-to-cart bar.
- **Footer:** 4 columns, pill email field, social + payment icons, and a **full-width oversized wordmark**.
- Misc: scroll-to-top circle button (bottom right), `instantpage` prefetch, low-power video handling.

## 5. Tech observations

All requests go to the store itself or Shopify (no GSAP, Lenis or other third-party animation lib; `swiper.css` is present). Motion is first-party CSS/JS. Components are custom elements (`page-header`, `card-gallery`, `parallax-section`, `scrolling-text-banner`, `shoppable-drawer`, `video-reels`, `wt-tabs`, `quick-size-picker`, `countdown-timer`, ...), the same architecture style as this repo's Craft theme.

## 6. Not yet verified

Only 1440 and 390 widths were sampled (no 768/1024 breakpoints). Animation durations and easings were not measured. Not seen: cart page, search results, blog/article, account pages, 404, password page, gift card, and checkout (Shopify-hosted). Video reels and countdown behavior were seen only as stills. A few computed-style probes returned empty (nav link font, ATC button), so those sizes come from screenshots.

## 7. Where the evidence lives (temporary)

Screenshots and JSON: `/private/tmp/claude-501/-Users-saman-Desktop-pegasus-pens/14ab8b56-3ea6-4d66-a468-03ea11317a23/scratchpad/recon/shots/` (home/collection/product tiles at desktop and mobile, 10 interaction shots, per-page section geometry and 262 CSS variables). Capture scripts: `.../scratchpad/tools/`. **This folder is session-scoped and may disappear. Copy it somewhere permanent before relying on it.**

## 8. Draft plan (pending the open question)

Base: this repo's Craft theme (OS 2.0, custom elements, per-section CSS). Own code only.

0. **Decisions + assets:** brand, typeface, photography, catalog, copy. The reference's content is interior design, so layout carries over but images and words do not.
1. **Foundation:** tokens (colors, type scale, radii, spacing) as theme settings + CSS variables; self-hosted Mona Sans; container/grid/gap rules.
2. **Global chrome:** announcement bar, two-row→compact header, mega menu, predictive search, localization drawer, cart drawer, mobile menu, footer wordmark, scroll-to-top.
3. **Product card system** → collection page → product page.
4. **Home sections**, ordered by reuse: slideshow, collection list, collage, featured-collection tabs, image+text, blur banner, brands, testimonials/marquees, multicolumn, features banner, then the heavy ones (shoppable image, video reels, parallax).
5. **Motion pass**, then secondary templates (cart, search, blog, account, 404, password).
6. **Fidelity QA loop:** Playwright screenshots of reference vs ours at 1440 / 1024 / 768 / 390. Because content differs, compare **structure** (element bounding boxes and computed styles for matching selectors) and use pixel-diff only on layout-only fixtures with placeholder content. Keep `shopify theme check` at or below the current baseline (2 errors, 9 warnings).

### My calls so far (change any of these)

1. Rebuild with our own markup/CSS/JS on this Craft theme; no Wonder/Nethype code, imagery, icons, logo or the GT Standard font.
2. Mona Sans self-hosted (believed to be SIL OFL; verify before shipping) unless Pegasus has its own typeface.
3. `AGENTS.md` says to preserve existing setting IDs and merchant config. I'd add new sections/snippets rather than rewrite existing schemas where possible. The header and product card are the likely exceptions.
4. Desktop 1440 and mobile 390 first, other widths interpolated and then checked.
