# Visual findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt) · Date: 2026-11-13 · Agent: visual
Category score: 80/100. Content renders fully and identically on mobile and desktop with no horizontal overflow. The deductions are the pinned home sections that balloon under a tall (expanded) viewport, the hero headline not being the h1, and a primary action that sits 15 px below the fold on a 375 x 812 phone.

Method: Playwright (chromium 1.63) driven by my own script, because the bundled `capture_screenshot.py` waits for `networkidle` and timed out (30 s) on `/`, `/collections/hardwood` and `/pages/about` (see VIS-08). Pages loaded live at least 5 s apart, no 429. Screenshots are in `/Users/saman/Desktop/pegasus-pens/docs/seo-audit/screenshots/`: `{home,pdp,collection,about}-{desktop,mobile}.png` (desktop 1920x1080, mobile 375x812 at 2x, taken 5 s after DOMContentLoaded, no scrolling), `*-mobile-firstpaint.png` (about 1 s), `home-mobile-earliest.png` (about 100 ms after the hero heading exists), `home-mobile-nojs.png`, `home-tallviewport-top.png`, `home-tallviewport-constellation.png`. Each was opened and looked at before it was described. Raw numbers: `/private/tmp/claude-501/-Users-saman-Desktop-pegasus-pens/91d7cfa4-b8d4-4083-a526-10494d406183/scratchpad/vis/*.json`.

## What works
- No horizontal scroll at 375 px on any of the four pages: `documentElement.scrollWidth == clientWidth == 375` on `/`, `/products/date-seed-pen`, `/collections/hardwood`, `/pages/about`. Elements that poke past 375 (carousel slides, the closed filter drawer, a 6 px image bleed on `/pages/about`) are clipped or off-canvas.
- Mobile and desktop show the same content. Diffing the visible headings, paragraphs, links and images (after a slow scroll) found no desktop-only link, image or product on any of the four pages. JSON-LD block counts are identical (home 2, product 3, collection 1, about 1). The only desktop-only text is one intro paragraph of the constellation section on `/` (VIS-06).
- Mobile first screen (375 x 812, no scroll) on `/`: announcement bar, header, search, the medallion photo, the headline "One pen, one story, never duplicated." and the sub-line "Handcrafted one at a time in Vancouver, British Columbia, by a German-trained carpenter." are all visible. No entrance animation left anything invisible by the 1 s mark.
- The word-rise headlines are CSS keyframes (no JS), so with JavaScript disabled the hero is complete (`home-mobile-nojs.png`): medallion open, headline fully readable.
- Every ink-wipe image and word-rise heading ends in the finished state when the viewport is tall: all 5 `[data-pg-wipe]` elements carry `pg-in`, their children have `clip-path: inset(0px)` and no image has leftover opacity or clip, and all 5 `[data-pg-rise]` headings carry `pg-in`. The scrub statement words are all opacity 1 (no text with a scroll-driven opacity stayed faint).
- Product page on mobile: h1 "Date Seed Pen" and the price are visible at first paint; on desktop h1, price and Add to cart are all above the fold (`pdp-desktop.png`). Collection page: h1, intro text and the pens are visible on desktop; on mobile the first two pens and their prices show (`collection-mobile.png`). The collection h1 reads "Collection: Hardwood" to a crawler (the first word is visually hidden), which is fine.
- Text is 16 px or larger on mobile and the touch targets that matter (Add to cart 345x48, hero button 157x48, slider dots 40x44, cart/search/menu icons) are at or near 44 to 48 px.

## Findings

### VIS-01: Pinned home sections balloon when the viewport is as tall as the page (Google-style render)
- Severity: Medium
- Evidence: Rendered `/` at 375 x 12000 (mobile) and 1366 x 12000 (desktop), no scrolling, 9 to 10 s. Document height was 83,582 px (mobile) and 83,058 px (desktop), against 16,259 px at 375 x 812. Cause: `#shopify-section-...great_square` (the constellation) is 43,200 px tall and `...drift` (the parallax pens) is 28,800 px, because their lengths are viewport-relative: `--pg-const-length: 360svh` (`sections/pegasus-constellation.liquid:8`, origin/main) and `height: var(--pg-par-length, 300vh)` with `--pg-par-length: {{ section.settings.length }}vh` (`assets/pegasus-parallax.css:64`, `sections/pegasus-parallax.liquid:6`, origin/main). In the clipped capture `home-tallviewport-constellation.png` the dark constellation section has roughly 5,000 px of empty dark space above its heading "Four materials, one workshop.". Everything else on the page (hero, statement, material list, tabs, spotlight, story, collage, gifts, anatomy, quotes, pills, promises) renders correctly, only pushed down to 47,800 to 81,300 px.
- Why it matters: Google's renderer does not scroll; it makes the viewport roughly as tall as the content. Any section whose height is a multiple of the viewport height then grows with it, and a snapshot taken there is mostly empty space with the real content far below. The DOM text is intact, so indexing of text is not blocked. The risk is a poor rendered snapshot and, if the renderer caps height, content past the cap (story, gifts, quotes, promises) not being seen. I could not confirm Google's exact height cap or behaviour from here, so this is an emulation, not a measurement.
- Fix: theme files. Cap the pinned lengths in absolute terms so they cannot exceed a normal desktop scroll: `--pg-const-length: min({{ scroll_length }}svh, 3600px)` and `--pg-par-length: min({{ length }}vh, 2600px)` (and the matching `height` fallback). Preferably also treat a very tall viewport as "do not pin", like the existing short-window rule: in `assets/pegasus-constellation.js` the `(max-height: 619px)` media query (line 47) gets a sibling `(min-height: 1500px)`, and `assets/pegasus-parallax.js` / `.css` do the same, so a tall viewport gets the static layout (all four panels visible, pens in a row). No host involved.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: render `/` at 375 x 12000 and read `document.documentElement.scrollHeight`; it should stay near 20,000 px or less, and `getComputedStyle` of the constellation section should be at most 3,600 px tall. Also run the URL Inspection "View tested page" screenshot in Search Console once it exists (at domain switch) and check the story section is in it.
- Leading indicator: Search Console URL Inspection, rendered HTML and screenshot of `/` (at domain switch); a screenshot with a large empty dark block means it is still happening.

### VIS-02: Three of the four constellation panels are `visibility: hidden` in the default (pinned, scroll position 0) state
- Evidence: At the tall viewport the section has class `is-pinned` and `--seg-1..6: 0.000`. Panel "Markab / Hardwood" is `visibility: visible`; "Scheat / Segmented wood", "Algenib / Leather" and "Alpheratz / Date seed" are `visibility: hidden`, `opacity: 0` (CSS, not `inert`). Only the Hardwood "Shop hardwood" link is visible. Per `CLAUDE.md` the section shows all panels only when unpinned (reduced motion, theme editor, motion off, window shorter than 620 px).
- Why it matters: an unscrolled render, which is what a crawler produces, sees one panel of four. The text is still in the HTML, but hidden text can be weighted down. The same descriptions exist on the collection pages and the home page links to every collection, so the loss is small.
- Fix: the unpinned rule from VIS-01 (tall viewport = static layout) also fixes this. Nothing else needed.
- Depends on: VIS-01
- Domain switch: n/a
- How we'd know it failed: in a 375 x 12000 render, count `.pg-const` panels with `visibility: hidden`; it should be 0.
- Leading indicator: URL Inspection "View crawled page" HTML still contains the four panel texts, and the screenshot shows them.

### VIS-03: The home page's only h1 is the header wordmark; the visible hero headline is an h2
- Severity: Medium
- Evidence: `/` has exactly one `<h1 class="header__heading">` whose text is "Pegasus Pens" (from `sections/header.liquid:176` and `:226`, origin/main). The three hero headlines ("One pen, one story, never duplicated.", "From a branch of the family plum tree.", "Made to be given.") are `<h2 class="pg-hero__heading" aria-label="...">` (`snippets/pegasus-hero-slide.liquid:123`, origin/main) with each word in an `aria-hidden` span. On the product and collection pages the h1 is the right thing ("Date Seed Pen", "Collection: Hardwood"), so this is a home-page issue only.
- Why it matters: the h1 is the page's strongest on-page topic signal, and on a one-of-a-kind pen store the brand-only h1 says nothing about what is sold. The big hero line is what the visitor reads as the page title.
- Fix: theme files. On the home template, render the header wordmark in a `<p>`/`<div class="header__heading">` instead of `<h1>` (condition on `template.name == 'index'`), and let the first slide's heading be the h1 (add a `heading_tag` parameter to `snippets/pegasus-hero-slide.liquid`, passed as `h1` for `forloop.first` in `sections/pegasus-slider.liquid`, `h2` for the other slides and for the standalone `pegasus-hero`). Keep one h1 only. A keyword-bearing line (for example "Hand-turned one-of-a-kind pens, made in British Columbia") in the first slide gives the h1 a topic; that is a copy decision for the owner. The on-page SEO agent may raise the same point; treat that finding as the owner of the wording.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: parse `/` and count `<h1>`: it must be 1 and its text must be the hero headline, not "Pegasus Pens".
- Leading indicator: Search Console Performance, queries for "handmade pens canada" style terms to `/` (at domain switch); in the rendered HTML check the h1 text.

### VIS-04: The primary action is 15 px below the fold on a 375 x 812 phone
- Severity: Low
- Evidence: Mobile `/`: "Shop all pens" button top 827 px, height 48 (`diff.json`), viewport 812. The announcement bar (57 px), header (wordmark row) and the full-width search row use the top 183 px; the medallion is about 285 px tall; then the headline and sub-line. At first paint the user sees the value proposition but no button (`home-mobile.png`). On 390 x 844 and taller phones the button is partly or fully visible. Desktop is fine (button at 890 of 1080).
- Why it matters: engagement and Core Web Vitals interactions are not affected, but a visible first action on the smallest common phone helps conversion; this is a visual nicety, not an indexing issue.
- Fix: theme CSS in `assets/pegasus.css` (hero section): on narrow screens cap the medallion, for example `width: min(66vw, 34svh)` for the `.pg-hero__media` circle, so the button rises about 60 to 90 px. Do not shorten the hero text.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: at 375 x 812, `getBoundingClientRect().bottom` of the first "Shop all pens" button should be at most 812.
- Leading indicator: click-through from the home page to `/collections/all` in analytics (once connected, at domain switch).

### VIS-05: Entrance animations are visible at about 1 s, but not before; they replay on every slide change
- Severity: Info
- Evidence: At about 100 ms after the hero heading exists (`home-mobile-earliest.png`) the words are mid-rise (clipped line fragments), the medallion is an empty dim disc and only the first arc of the rim is drawn; by about 900 ms (`home-mobile-firstpaint.png`) the medallion is open and the text is complete, and the later shots are identical. The slider autoplays: in the 7.5 s desktop shot (`home-desktop.png`) slide 2 had just become active and its headline was again mid-rise ("From ..." with clipped lines). Inactive slides are `visibility: hidden` and `inert`, which is why the full text of all three slides is in the DOM but only one is visible at a time (at 10 s in the tall render slide 2 was active).
- Why it matters: a screenshot taken in the first half second, or at a slide change, shows partial text. A crawler that waits for network idle or a few seconds will see settled content. Nothing is permanently hidden. Note that Largest Contentful Paint candidates (the hero photo or headline) are delayed by the animation; the performance agent should confirm.
- Fix: none required. If the LCP is the hero heading, consider making the first slide's heading render without the rise animation (static), which also helps the LCP. Theme CSS only.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: a 375 x 812 screenshot at 500 ms after load still shows clipped text; or the LCP element in the lab report is the animated heading with a time above 2.5 s.
- Leading indicator: LCP in the PageSpeed field data once the store has traffic (at domain switch).

### VIS-06: One constellation paragraph is shown on desktop and hidden on mobile
- Severity: Low
- Evidence: The visible text "Pegasus is a constellation of four bright stars. Ours are four materia..." (constellation intro on `/`) is displayed at 1920 px and not displayed at 375 px (diff of visible text blocks; everything else matched). Mobile-first indexing uses the mobile rendering.
- Why it matters: a short, brand-story paragraph is lost from the mobile-first view. Hidden-on-mobile text can be given less weight. It is minor, but it is the only difference between the two layouts.
- Fix: theme CSS in `assets/pegasus-constellation.css`: show it at all widths, or drop it if it is only decoration. Confirm which rule hides it (`display: none` below 990 px is my assumption; I did not trace it).
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the same diff at 375 and 1920 px lists the paragraph as desktop-only.
- Leading indicator: none.

### VIS-07: Tap targets below 44 to 48 px on mobile (cards, breadcrumbs, footer, small links)
- Severity: Low
- Evidence at 375 px: product and collection card title links are 23 px tall (`full-unstyled-link`, 169 or 262 wide); footer menu links 37 px; breadcrumb links 18 px (`pg-crumbs__link`, "Home" 34x18, "Date seed" 58x18); the hero "Read our story" link 35 px; "View all" links 25 px; "Powered by Shopify" 14 px and "Privacy policy" 31 px; the sort select 45 px tall. The ten empty "A" entries in the raw list are off-canvas drawer links, not visible targets. WCAG 2.2's 24 px minimum is met by all except the 18 px breadcrumb links and the 14 px credit link (the inline and spacing exceptions may apply); Google's older 48 px guidance is not met by many.
- Why it matters: Google retired the Mobile Usability report, so this is not a ranking factor; it is a usability item. The card photo above each title is also part of the same link, so the practical target is large.
- Fix: theme CSS: add `min-height: 44px; display: inline-flex; align-items: center` to `.pg-crumbs__link` and footer `.list-menu__item--link`, and padding to `.pg-tabs__all` / `.pg-hero__link`. Low priority.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: re-run the tap-target measurement at 375 px; breadcrumb links must be 44 px tall.
- Leading indicator: none.

### VIS-08: The home page keeps requesting scripts for as long as you wait, so it never goes network-idle
- Severity: Low
- Evidence: On `/` at 375 px, 341 requests in 18 s and about 8 requests per second continued past the 8 s mark; all are Shopify's own `/cdn/shopifycloud/checkout-web/assets/c1/*.js` files (about 80 within 10 seconds after load, 2.66 MB transferred in total). The bundled screenshot tool, which waits for `networkidle`, timed out at 30 s on `/`, `/collections/hardwood` (desktop) and `/pages/about` (several attempts); `/products/date-seed-pen` completed. Page `load` fired at 3.3 s. This looks like the platform's checkout prefetch (not theme code), but I did not trace which app or setting triggers it.
- Why it matters: a renderer that waits for quiet network may wait longer or time out; it also costs the visitor bandwidth. `load` is quick, so a normal render is fine.
- Fix: not in the theme as far as I can see. The performance agent should confirm the source; check Online Store > Preferences and installed apps or pixels in the Shopify admin (store settings, manual).
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: a Playwright `waitUntil: 'networkidle'` load of `/` still times out.
- Leading indicator: the request count and transfer size in the PageSpeed report.

### VIS-09: Lazy images in the horizontal product rails never load in an unscrolled render
- Severity: Low
- Evidence: In the 12000 px render, lazy images in the "Fresh from the workshop" and "Ready to give" rails that sit beyond the first screen width of the rail (for example `walnut-rosewood-maple-acrylic-pen-front.png` and `date-seed-pen-front.png` on `/`) stayed `complete == false`; extra card photos (second and third frames) are at opacity 0 by design. A browser only lazy-loads what is near the viewport, and the rail overflows sideways.
- Why it matters: image discovery for those pens from the home page is weaker; the same photos are on each product page and in its image data, so the impact is small.
- Fix: theme: in `snippets/pegasus-card-photo.liquid` give the first photo of the first 6 cards of a rail `loading: eager`, or leave it, since `/collections/all` and the product pages carry the images.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the tall render still lists the same images as not loaded.
- Leading indicator: Search Console image search impressions (at domain switch).

## Could not check
- Google's real renderer: I emulated a tall viewport (12,000 px) only; the actual height cap and timing are not verifiable here. A Search Console URL Inspection of `/` after the domain switch would settle VIS-01 and VIS-02.
- Whether the slider text of the two inactive slides (`visibility: hidden`) is given less weight; documented behaviour is not definitive.
- Real-device Safari rendering; the audit used Chromium only.
