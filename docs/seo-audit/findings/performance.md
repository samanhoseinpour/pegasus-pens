# Performance findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt, `resolved=`) · Date: 2026-11-13 · Agent: performance

Category score: 58/100. This is my judgement from lab data and static analysis, not a Lighthouse score. Desktop is fast in the lab (LCP 0.9 to 1.8 s). Mobile under throttling is poor on the home page: LCP 9.7 s and CLS 0.32, both traced to fixable theme causes.

**Every number below is lab-only.** The store is 6 days old and there is no CrUX key, so there is no field data, and these results do not say how real visitors score. Method: one run per page and device, by a Playwright (playwright-core 1.63.0, bundled Chromium) script I wrote that records PerformanceObserver entries.
- Mobile = 412x823 viewport, DPR 2.625, CPU throttled 4x, network 1.6 Mbps down / 150 ms RTT.
- Desktop = 1350x940, no throttling.
- Each load was followed by an automated scroll and a few clicks.

Other tools:
- `preload_check.py` on `/` (static signals).
- `lcp_subparts.py` was NOT run: it needs CrUX.
- `pagespeed_check.py` answered "PSI rate limit exceeded" without a key.
- `npx lighthouse` was blocked by the permission system.

So there is no Lighthouse score and no Lighthouse INP/TBT.

## Lab results (Playwright, single run each)

| Page | Device | LCP (element) | FCP | CLS at load | TBT-like (long tasks over 50 ms) |
|---|---|---|---|---|---|
| `/` | mobile | 9,684 ms (`.pg-hero__image`, 273x273 shown) | 1,216 ms | **0.318** | 196 ms at load, 338 ms total |
| `/products/date-seed-pen` | mobile | 4,948 ms (main photo, 990w) | 1,172 ms | 0.061 | 306 ms at load |
| `/collections/hardwood` | mobile | 2,496 ms (first card photo) | 1,180 ms | 0.070 | 139 ms |
| `/` | desktop | 1,648 ms (hero medallion, 491x491) | 908 ms | 0.032 | 0 ms |
| `/products/date-seed-pen` | desktop | 856 ms (main photo) | 816 ms | 0.006 (0.0999 after scroll and clicks) | 0 ms at load; 3,620 ms during the scroll and click phase |
| `/collections/hardwood` | desktop | 1,760 ms (first card photo) | 932 ms | 0.001 | 29 ms |

- TTFB was 319 to 367 ms on all six loads (Shopify, `103>200` Early Hints).
- INP proxy: event-timing durations for single automated clicks, not true INP. Mobile `/` menu icon click = 224 ms (processing 121 ms), search trigger = 168 ms. Mobile product 128 ms and 40 ms. Mobile collection 88 ms. Desktop 32 to 104 ms. Mobile is under 4x CPU throttling.
- The mobile `/` menu click is over the 200 ms "good" line in the lab.

## What works
- All theme scripts are `defer`; there are no synchronous scripts. Shopify's own loaders are `async`, `defer` or `type=module`. (Static, home and 2 other saved pages.)
- Fonts are self-hosted, preloaded with `crossorigin`, and `font-display: swap` on all three @font-face rules (live `pegasus.css`). Craft's Quattrocento Sans and Trirong @font-face rules are declared but not downloaded ("unloaded" in `document.fonts`).
- Every `<img>` in the four saved pages checked (home, product, hardwood, `/collections/all`) has `width` and `height`. Cards and gallery have `srcset` plus accurate `sizes`. Below-fold images are `loading="lazy"` (home: 92 of 95 imgs).
- Shopify's CDN serves WebP or AVIF to a modern browser. Mobile `/`: 37 WebP, 1 AVIF, 1 JPEG. The pen files are PNG at the source.
- Desktop LCP and CLS are within the good band in the lab on all three pages (the product page's CLS passes at load; see PERF-07 for the later 0.0999).
- Early Hints (`103`) on every HTML page. No `cache-control: no-store`, no `unload` handler (bfcache-friendly signals in `preload_check.py`).
- Stylesheets are small on the wire. Mobile `/`: 41 theme stylesheets = 39 KB transferred (Shopify minifies and compresses).
- The scroll-driven CSS and sticky header need no layout JavaScript beyond `holdHeader`.

## Findings

### PERF-01: The hero (LCP) image has no priority hint, no srcset and is much larger than it is drawn
- Severity: High
- Evidence:
  - Live `/` HTML, first slide: `<img src=".../pegasus-scene-desk.jpg?v=..." width="1145" height="1526" loading="eager" class="pg-hero__image">`. No `fetchpriority`, no `srcset`, no `<link rel=preload>`.
  - `preload_check.py /` returned score 50: `preload_lcp_candidate: false`, `fetchpriority_high: 0`, no speculation rules.
  - Lab (Playwright): this image was the LCP element, 9,684 ms mobile and 1,648 ms desktop. It is drawn at 273x273 (mobile) or 491x491 (desktop) from a 1145x1526 file (source JPG 254,189 B; the CDN sent 183,560 B of WebP on mobile).
  - Cause in source: `snippets/pegasus-scene.liquid` prints a bare `<img>`. `snippets/pegasus-hero-slide.liquid` sets `fetch_priority = 'high'` for the first slide, but only the `image_tag` branch (a merchant-chosen image) uses it. The bundled-scene branch passes only `loading`.
  - Theme assets (`asset_url`) are not resized by the CDN, so there is no `?width=` to lean on.
  - The same pattern serves `pegasus-scene-stone.jpg` (source 271,504 B, 225,682 B WebP on the wire) eager and un-prioritised in the `/collections/hardwood` banner medallion.
- Why it matters: LCP is the metric Google measures, and this image is the largest paint on the home page. The browser finds it late and downloads about 3x the pixels it shows. The load competes with fonts and other images on a slow link.
- Fix (theme):
  - Add a `fetchpriority` parameter to `snippets/pegasus-scene.liquid` and pass `fetch_priority` from `pegasus-hero-slide.liquid`.
  - Ship each scene in 2 or 3 widths (for example 600, 900 and 1200 px) as theme assets, built as `{{ 'pegasus-scene-desk-600.jpg' | asset_url }} 600w, ...`. Use `sizes="(min-width: 990px) 44vw, 80vw"` (the same sizes the `image_tag` branch already uses).
  - Better: upload the scenes to Files and render them with `image_url` + `image_tag`, so the CDN resizes and converts them.
  - Keep the first slide `loading="eager"`. Add `<link rel="preload" as="image" fetchpriority="high" imagesrcset=... imagesizes=...>` only if fetchpriority alone is not enough.
- Depends on: none
- Domain switch: auto (`asset_url` and `image_url` follow the host)
- How we'd know it failed: `preload_check.py` on `/` still shows `fetchpriority_high: 0`, or a lab mobile LCP run still reports more than 2.5 s with the hero as the LCP element.
- Leading indicator: bytes of the hero request in DevTools Network (target under about 60 KB on mobile), and PSI/CrUX LCP once the domain has field data.

### PERF-02: Mobile home CLS of 0.318 in the lab, from the announcement bar changing height when the font arrives
- Severity: High
- Evidence (Playwright mobile `/`, same value in two separate runs, 0.3183):
  - One shift at about 8.9 s. Sources: `P.announcement-bar__message` went from 352x56 to 342x38 px (two lines to one). `STICKY-HEADER` moved from y=57 to y=39. `svg.pg-hero__sky` moved from y=189 to y=171. `.pg-hero__actions` also moved (that source's previous rect was 0x0: it was not yet laid out).
  - Announcement text: "Handcrafted in Vancouver, British Columbia".
  - Mobile `/products/date-seed-pen` shows the same sources (`MAIN`, `STICKY-HEADER`, `announcement-bar__message`), CLS 0.061 at about 7.4 s. Mobile hardwood: 0.061 at about 9.2 s, same sources.
  - Live CSS (`pegasus.css`): `.announcement-bar__message` is a flex row with a 0.9 rem star before and after and `gap: 1.2rem`, on a narrow screen it wraps in the fallback font and fits on one line in Pegasus Sans.
- Inference (not isolated by a font-blocking experiment): the wrap changes when the web font replaces the fallback. The late font swap (PERF-03) widens the window in which it happens. The `holdHeader()` reservation in `pegasus.js` covers `.section-header` only; the announcement bar is a separate section above it.
- Why it matters: 0.318 is over the 0.25 "poor" line in this lab. CLS counts shifts after first paint, so any late font swap that reflows the top of the page counts against every page.
- Fix (theme, in the announcement bar rules in `assets/pegasus.css`, deployed version from `origin/main`):
  - Give `.announcement-bar__message` a fixed single-line height at mobile widths: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`, or reserve the two-line `min-height`.
  - Add a metric-matched fallback `@font-face` (`size-adjust`, `ascent-override`) for "Pegasus Sans" and "Pegasus Display" so the swap moves no text.
  - Fix PERF-03 so the font lands sooner.
- Depends on: PERF-03 (partly)
- Domain switch: auto
- How we'd know it failed: a mobile lab run of `/` still records a layout-shift entry with `announcement-bar__message` as a source, or CLS stays above 0.1.
- Leading indicator: Search Console "Core Web Vitals" CLS group for mobile once the domain is verified (at domain switch); until then repeat this Playwright run after the fix.

### PERF-03: Both preloaded fonts are downloaded twice, and an unused connection is opened
- Severity: Medium
- Evidence (Playwright, every one of the 6 loads; sizes from response bodies):
  - `pegasus-sans.woff2` was fetched twice (about 35 KB each) and `pegasus-display.woff2` twice (about 133 KB each).
  - The preload URL carries `?v=...` (`layout/theme.liquid` lines 292 and 293, `{{ 'pegasus-sans.woff2' | asset_url }}`). The CSS requests the bare name. Live `pegasus.css`: `src:url(pegasus-display.woff2)`, with no `?v=`. The two URLs differ, so the preload is not reused.
  - About 168 KB of duplicate font bytes on every page, competing with the hero image on a slow link.
  - `pegasus-display-italic.woff2` (64 KB) is not preloaded.
  - `<link rel="preconnect" href="https://fonts.shopifycdn.com">` is emitted (`theme.liquid` lines 16 to 18) though `pegasus_fonts` is on and nothing is fetched from that host.
  - A 65 KB `GTStandard-MMedium.woff2` from `shopify-assets.shopifycdn.com/.../static_uploads/shoplift/` also loads (and 3 GT Standard weights on the product page). The origin of that font was not determined: it is not a theme font.
- Why it matters: it wastes bandwidth during the critical window and delays the swap (PERF-02).
- Fix (theme): declare the `@font-face` rules in the `{% style %}` block in `layout/theme.liquid` using `{{ 'pegasus-display.woff2' | asset_url }}` (the same Liquid URL as the preload), and remove them from `pegasus.css`. Wrap the `fonts.shopifycdn.com` preconnect in `unless settings.pegasus_fonts`. Consider subsetting Pegasus Display (Latin only).
- Depends on: none
- Domain switch: auto
- How we'd know it failed: the Network panel still lists `pegasus-display.woff2` twice, or the console shows "preloaded but not used".
- Leading indicator: font bytes per page load (should drop by about 168 KB).

### PERF-04: Product page LCP is 4.9 s on mobile in the lab with no priority hint on the main photo
- Severity: Medium
- Evidence:
  - Playwright mobile `/products/date-seed-pen`: LCP 4,948 ms (FCP 1,172 ms), the first gallery image `date-seed-pen-front.png?width=990` (WebP about 38 KB on the wire, so the file is small). Desktop LCP 856 ms.
  - Live HTML: that `<img class="image-magnify-lightbox">` has no `loading` and no `fetchpriority` attribute. The only `<link rel=preload>` tags on the page are the two fonts. `sizes` is accurate.
  - 43 stylesheets and about 36 script tags load around it.
  - I did not capture resource timing, so I cannot say how the 3.8 s between FCP and LCP splits (load delay, load time or render delay). I did not read `snippets/product-thumbnail.liquid` (it differs locally from `origin/main`).
- Why it matters: the pen photo is the product's LCP element; indexed product pages are the commercial pages. A small file that paints late is a delay problem, not a size problem.
- Fix (theme): in the product gallery snippet, give the first image `fetchpriority="high"` and `loading="eager"` (`media.position == 1`), and the rest `lazy`.
- Depends on: PERF-03, PERF-08 (shared main-thread and bandwidth pressure)
- Domain switch: auto
- How we'd know it failed: lab mobile LCP of `/products/date-seed-pen` stays above 2.5 s.
- Leading indicator: Search Console LCP for product URLs at domain switch.

### PERF-05: Home HTML is 409 KB, and the review wall is not the cause
- Severity: Medium
- Evidence (static, `CRAWL/pages/home.html`, 409,490 B raw):
  - The review wall section (`template--...__quotes`) is **6,574 B (1.6 %)**. `repeat = 2400 / 400 / 3 + 1 = 3` copies of 3 reviews, in 2 tracks, so 18 `<li>`. The "24,000 px of cards" in the docs is not what Liquid produces. Not a performance finding.
  - The two product shelves are the weight: `fresh` 118,439 B and `gifts` 86,114 B = 204,553 B (50 % of the page), with 85 `<li>` and 42 imgs for 14 cards (3 photos per card). The `srcset` attributes alone are 30,607 B in `fresh`.
  - `<head>` is 75,458 B. Inline scripts total 57,081 B, mostly Shopify's (a 21.6 KB exit-interstitial script and a 12.5 KB analytics loader). There are 20 `<style>` tags (17,736 B).
  - Header 23.6 KB and footer 33 KB. DOM 2,322 element tags in the snapshot (2,404 in the rendered DOM, mobile lab), above the 1,500 guideline.
  - Transferred (compressed) size of the home document was not isolated.
- Why it matters: HTML is parsed on the main thread and large DOMs slow style recalculation, which feeds INP. It also stands between the user and first paint on a slow link.
- Fix (theme/section settings):
  - On the home shelves, turn `show_secondary_image` off (1 photo per card, about 28 fewer `<img>` tags).
  - Stop repeating the same 8 pens across tabs. Show 4 to 6 per tab, or load other tabs on demand.
  - Leave the review wall as it is.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: the next saved `home.html` is still over about 300 KB, or the `fresh` + `gifts` sections still add up to more than 150 KB.
- Leading indicator: DOM element count in Lighthouse's "Avoid an excessive DOM size" audit (under 1,500).

### PERF-06: Many render-blocking stylesheets, including some the page does not use
- Severity: Low
- Evidence (static, home): 41 unique stylesheets. 11 `<link>` tags in `<head>` (source about 127 KB: `base.css` 81 KB, `pegasus.css` 14 KB, `pegasus-chrome.css` 18 KB, cart drawer/cart/totals/price/discounts about 14 KB). Another 28 blocking `<link>` tags sit in `<body>` (about 115 KB of source), one per section. They carry no `media` trick. Live settings have `cart_type: "drawer"`, so the drawer CSS blocks first paint on every page, although `CLAUDE.md` says `notification` (stale doc). `quick-order-list.css` (12 KB) and `component-facets.css` (25.7 KB on collections) load on pages with no quick order list.
- Why it matters: Chrome treats a stylesheet link in `<body>` as blocking for the content after it. But on the wire this is small (39 KB for 41 files on mobile `/`), so this is Low.
- Fix (theme): load `component-cart-drawer.css` the same way as `component-cart-items.css` (`media="print" onload`). Stop `card-product` from loading `quick-order-list.css`. Merge the small `pegasus-*` section files if the count matters.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: the head still has more than 8 blocking stylesheet links.
- Leading indicator: Lighthouse "Eliminate render-blocking resources" savings.

### PERF-07: Main-thread cost on mobile and one unexplained long task on desktop
- Severity: Medium
- Evidence (Playwright):
  - Mobile `/`: long tasks at about 7.0 s of 226 ms, plus several of 57 to 60 ms. TBT-like 196 ms at load, 338 ms total. Mobile product: 306 ms, longest 210 ms. Mobile collection: 139 ms. All under 4x CPU throttling.
  - Click durations: mobile `/` menu icon 224 ms (processing 121 ms), search trigger 168 ms.
  - Desktop `/products/date-seed-pen`: during the scripted scroll and clicks there were 4 long tasks totalling 3,620 ms of excess time, with one of 2,703 ms. CLS also climbed from 0.0064 to 0.0999 in that phase. I did not isolate the cause, and it may be a headless/automation artifact. Only the first 4 layout-shift entries were inspected.
  - Static: `global.js` 47 KB is the largest theme script. Both `cart-drawer.js` and `cart-notification.js` load. `lenis.min.js` + `pegasus-smooth.js` (21 KB) load on every page and run a `requestAnimationFrame` loop (`autoRaf: true`). `pegasus.js` registers `window.addEventListener('resize', holdHeader)` without a debounce, and `holdHeader` forces a layout read on each event.
  - The Shopify-injected scripts (PERF-09) also add main-thread work. I did not attribute the long tasks to a script.
- Why it matters: INP is the interactivity metric. The lab shows the mobile menu click over 200 ms with CPU throttled, which is a warning sign, not a field result.
- Fix:
  - (theme) Load `cart-notification.js` only when `cart_type == 'notification'`. Debounce the `resize` handler. Load Lenis only on pages with pinned sections, or accept it as a brand choice.
  - (investigation) Record a Chrome Performance trace on the desktop product page and the mobile menu click to find the long tasks.
- Depends on: PERF-09
- Domain switch: auto
- How we'd know it failed: a lab run still shows a task over 200 ms at load, or an INP proxy over 200 ms on the menu button.
- Leading indicator: INP in Search Console (at domain switch) and the lab run repeated after changes.

### PERF-08: No speculation rules or prefetch for the most common next click
- Severity: Low
- Evidence: `preload_check.py /`: `speculation_rules.inline_blocks: 0`, `header_present: false`. Recommendation from the tool: add speculationrules.
- Why it matters: with 8 products and 5 collections, the next navigation is predictable, and prefetch/prerender makes it feel instant. This is not a ranking factor.
- Fix (theme, `layout/theme.liquid`): add `<script type="speculationrules">` with a `prefetch` of same-origin links at `moderate` eagerness, using relative `href_matches` patterns (`"/products/*"`, `"/collections/*"`). No host is written, so it follows a domain switch. Exclude `/cart`, `/checkout*`, `/account*`.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: Chrome DevTools "Speculative loads" shows no prefetches on a product link hover.
- Leading indicator: lower LCP on second page views in field data (later).

### PERF-09: Third-party code is all Shopify's, and about 114 script requests load on the home page
- Severity: Info
- Evidence (Playwright mobile `/`, response body sizes, one load):
  - `rjxgij-f1.myshopify.com` scripts: 33 files, about 234 KB. This includes theme files and Shopify's web-pixels loader `/cdn/wpm/...js` (88 KB), the perf-kit (27 KB), `shopify_pay/storefront` (21 KB) and `webmcp` (30 KB).
  - `cdn.shopify.com` scripts: 52 files, about 151 KB (shop-js chunks for Shop sign-in, the `account.js` web component and `login-form`).
  - `shopify-assets.shopifycdn.com` scripts: 28 files, about 75 KB (Shop Pay "vite-pay" chunks).
  - Also 14 telemetry `fetch` calls to `otlp-http-production.shopifysvc.com`.
  - Many are small chunks, but the count matters on a slow link. The origin of each (theme, Shopify default, installed app) was not attributed.
- Why it matters: this is the platform's baseline and the theme cannot remove most of it. It is the floor for TBT.
- Fix: nothing in the theme except not adding to it. Review Shopify admin, Online Store, Preferences, and Apps/customer accounts for features that load Shop sign-in on a store with no customer accounts in use. Do not add other third-party scripts.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: new third-party hosts appear in the Network panel.
- Leading indicator: script request count on `/` (about 114 today).

### PERF-10: Field data does not exist yet, and the baseline will restart at the domain switch
- Severity: Info
- Evidence: the store has been public 6 days. There is no CrUX key and no Search Console access. `lcp_subparts.py` needs CrUX. All results above are lab-only.
- Why it matters: Google judges the 75th percentile of real visits. The lab cannot say whether the site passes.
- Fix: at the domain switch, verify the new origin in Search Console, and check the CrUX/PSI field data for the new origin after about 28 days of traffic. CrUX is keyed by origin, so the myshopify.com history does not carry over.
- Depends on: none
- Domain switch: manual (at domain switch)
- How we'd know it failed: Search Console shows "no data" for CWV after 4 weeks of traffic on the new domain.
- Leading indicator: first CrUX entry for the origin.

## Images
Images score: 60/100. The delivery system is good (CDN formats, `srcset`, `sizes`, dimensions, lazy loading below the fold). The bundled theme images are the weak spot (LCP image and the emblem). Lab-only (Playwright), static HTML, and source file sizes from the repo. Alt text is covered by the content agent.

What works:
- Mobile `/` loaded 39 images (37 WebP, 1 AVIF, 1 JPEG); the largest was a bundled scene.
- Product photos: `srcset` from 246 to 1,946 px with correct `sizes`, `width` and `height` set, and only the first one eager. The gallery photo on mobile requested the 990 px candidate (about 38 KB WebP).
- Cards: `srcset` 165 to 1,122 px, `sizes` matching the grid, first card photo not lazy.
- Home: 92 of 95 `<img>` tags lazy. 0 of the 4 saved pages checked have images without dimensions.

### PERF-11: Bundled scene photos are served at full size without `srcset`
- Severity: Medium
- Evidence: `assets/pegasus-scene-*.jpg` source sizes are desk 254 KB, burl 224 KB, leather 217 KB, skyline 166 KB, stone 272 KB. All are 1086 to 1312 px wide, rendered at roughly 273 to 491 px (medallion) on `/` and the collection banners. They are used by `pegasus-scene.liquid` with no `srcset`. The mobile home lab load fetched stone (225,682 B WebP), desk (183,560 B), leather (162,488 B) and burl (144,402 B), the four largest images in that load. (The lab load included scrolling, so lazy slides were fetched.) `/pages/about` uses `pegasus-emblem-large.webp` (220 KB source) for the page hero.
- Why it matters: roughly 700 KB of images on the first home visit are above the size the layout needs. This is bandwidth that competes with the LCP image.
- Fix: same as PERF-01. Provide width variants or move the scenes to Files with `image_url`. Check the 220 KB emblem WebP on the About hero against its drawn size.
- Depends on: PERF-01
- Domain switch: auto
- How we'd know it failed: the 5 scene requests are still over about 100 KB each on mobile.
- Leading indicator: total image bytes for `/` (mobile lab load measured about 2.0 MB with scrolling; content-length based, so a floor).

### PERF-12: A 95 KB PNG emblem is drawn at about 52 px on every page
- Severity: Low
- Evidence: `assets/pegasus-emblem.png` is 95,230 B at source. It is the `.pg-wordmark__mark` img (`width="56" height="56"`, first `<img>` on every saved page) and the favicon fallback. Theme assets are not resized by the CDN. I did not measure the transferred size.
- Why it matters: a small, constant cost on every page, and it is above the fold.
- Fix: export a 112 px (2x) WebP or PNG for the wordmark (a few KB) and keep the large one for the favicon, using `{{ 'pegasus-emblem-112.png' | asset_url }}`.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: the emblem request is still over about 10 KB.
- Leading indicator: request size of the wordmark image in the Network panel.

### PERF-13: Four search-panel photos are in the HTML of every page
- Severity: Info
- Evidence: the first 4 `<img>` tags after the emblem on home, product, hardwood and `/collections/all` are "Popular pens" cut-outs (`width="300" height="400"`, `loading="lazy"`, `sizes="(min-width: 990px) 16vw, 45vw"`), inside the closed search panel. I did not verify whether the browser requests them before the panel opens. In the mobile lab they appear among the loaded images on the pages measured, with sizes of 30 to 33 KB each (WebP, width 600).
- Why it matters: they are 4 small images on every page, below the importance of PERF-01.
- Fix: keep `loading="lazy"` and confirm in the Network panel they are not fetched before the panel opens; if they are, render them only when the panel opens.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: the 4 requests appear before any interaction.
- Leading indicator: image request count on `/`.

## Compact header and CLS reservation (assessed)
`holdHeader()` in `assets/pegasus.js` (`origin/main`) sets `min-height` on `.section-header` from its measured height, re-measures on load, `fonts.ready`, `shopify:section:load` and resize, and skips while compact. In the lab the header produced no layout shift of its own (`NAV.header__inline-menu` shifts of 0.0001 on desktop, nothing from the sticky header after scroll apart from the PERF-02 shift). The shift in PERF-02 is above the header, in the announcement bar, so the reservation does not cover it.

## Not checked
- Lighthouse score, Lighthouse INP and TBT, PSI, CrUX and field data: no key, PSI rate-limited, `npx lighthouse` blocked by the permission system.
- LCP subparts (load delay, load time, render delay): the `getEntriesByType('largest-contentful-paint')` call used in my second script returned nothing, so there is no breakdown. The 9.7 s mobile home LCP is therefore not split into causes. Candidates are the 4x throttled link competing with about 0.7 MB of other images and 168 KB of duplicate fonts, and the medallion's opening animation. None of these was tested.
- The second run's desktop output (`/` desktop) in my script was not read; the desktop numbers come from the first run only.
- The cause of the 2.7 s long task on the desktop product page, and which layout shifts made up the 0.0999 CLS there.
- Which Shopify scripts account for the long tasks.
- The origin of the 65 KB GT Standard font.
- Transferred (compressed) size of the home HTML.
- Whether the search-panel images are fetched before the panel is opened.
- `snippets/product-thumbnail.liquid`, `snippets/pegasus-card-photo.liquid` live version and `pegasus.css` announcement rules were not opened in the repo; the evidence for them comes from the live HTML and the served CSS.
- JS byte counts from the first run (`content-length` is often missing on HTTP/2) were not used. The sizes quoted are source file sizes or response body sizes from the second run.
- One run per page and device only, so there is no variance data. Safari/WebKit was not measured.
