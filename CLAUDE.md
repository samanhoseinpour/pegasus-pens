# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Shopify Online Store 2.0 theme: **Craft v16.1.0** (see `config/settings_schema.json`), a Dawn-derived theme. `AGENTS.md` is titled "Dawn theme instructions" and the JS comments still say "Dawn", but the theme is Craft. There is no build step, no `package.json` and no README. The code lives in the private GitHub repo `samanhoseinpour/pegasus-pens` (remote `origin`, default branch `main`).

Rules from `AGENTS.md`: follow OS 2.0 conventions; preserve existing section setting IDs and merchant configuration; prefer small reusable snippets over duplicated Liquid; keep changes theme-editor compatible.

The store is **Pegasus Pens**. The visual identity is a design layer on top of Craft (see "Pegasus design layer" below), inspired by the Wonder/"NOOK" reference in `docs/wonder-reference-discovery.md`. No Wonder code, imagery or icons are used.

## Pegasus design layer

Craft stays the engine. The identity comes from settings plus a few files loaded after Craft's. The brand is the emblem in `docs/brand/` (gold and bronze on parchment, espresso lettering, one maple-leaf red); `docs/brand/README.md` has the palette, the contrast rule and the photo inventory.

- **Palette lives in the color schemes** (`config/settings_data.json`, `scheme-1..5`): Parchment `#F6ECD8` / Sand `#E9CDA9` / Bronze `#7D5027` / Espresso `#22110A` (gold buttons) / Maple `#8E221C`; text ink `#2A1508`. Change surfaces there. `assets/pegasus.css` `:root` holds the brand constants (`--pg-gold`, `--pg-espresso-rgb`, ...), and no section CSS may hardcode a color. **Gold is for dark surfaces only**: on parchment it is 1.9:1.
- `assets/pegasus.css` (loaded right after `base.css`): tokens, type scale, buttons, announcement bar, wordmark, footer wordmark, reveal classes. It uses Craft's `--font-*` and `--color-*` variables, never the font names directly, so turning the font setting off falls back cleanly. Focus rings use `rgb(var(--color-foreground))` so they work on every scheme.
- `assets/pegasus.js`: ink-wipe on large images, word-rise on headlines, `data-scrolled` on `<html>`. It does nothing under reduced motion, in the theme editor, or when `settings.pegasus_motion` is off. New sections opt in with `data-pg-wipe` / `data-pg-rise`; `window.Pegasus.init(scope)` re-runs it after a section re-render. **The clip-path of a wipe goes on the element's children, never on the observed element**: the browser counts an element's own clip-path when judging visibility, so a fully clipped target is never revealed (this once left every wipe image blank). A reveal also waits for the images inside to load (capped at 2.5 s) and switches lazy ones to eager first, because a fully clipped image never counts as near the viewport and would not start loading; without that the wipe played over an empty box on slow connections.
- `snippets/pegasus-wordmark.liquid`: `assets/pegasus-emblem.png` plus the shop name (first word upright, rest italic). Used by the header (when no logo image is set) and the footer; the emblem is also the favicon fallback. The wordmark shrinks at 749, 389 and 339 px so the header never overflows; below 340 px the text becomes screen-reader-only.
- `snippets/pegasus-scene.liquid` + `assets/pegasus-scene-*.jpg`: bundled lifestyle photos used as default images (hero medallion, story section, collage tiles) until the merchant chooses their own. Product shots are not bundled; they belong to the products.
- Cards: Craft's "portrait" ratio is changed from 4:5 to **3:4** in `card-product` and `card-collection`, because the photographs are 3:4 (4:5 crops the pen clips).
- Card extras (in `snippets/card-product.liquid`, both badge blocks: the visible one for the standard card style is the first, inside `card__inner`): product tags `limited` and `new-run` show a "Limited" (espresso) or "New run" (bronze) badge, after sold out and sale, which win. `snippets/pegasus-swatch-dots.liquid` shows up to five dots from the first option whose values have **swatches** (set in the Shopify admin), and nothing otherwise. The second image on hover is the existing `show_secondary_image` setting (now on for the collection page). Quick add is deliberately left off: it would bypass the engraving and gift options on the product page. New storefront keys must also be added to every `locales/*.json` (English text), or theme-check fails `MatchingTranslations`.
- Settings added: `pegasus_fonts` (self-hosted Newsreader + Hanken Grotesk, OFL, licenses in `docs/font-licenses.md`; overrides the font pickers) and `pegasus_motion`; footer `show_wordmark`. New schema labels in *theme settings* must be added to **every** `locales/*.schema.json` (theme-check fails `MatchingTranslations` otherwise); section-schema labels for the Pegasus sections are plain English.
- Craft's own `animations_reveal_on_scroll` is off in the saved settings because `pegasus.js` replaces it.
- Typography rules: sentence case for labels (no all-caps eyebrows), UI text tracking reset to `0.01em` (Craft tracks much wider), display headings use `font-optical-sizing: auto`.

There is no Shopify store linked to this project (the Shopify CLI config on this machine belongs to other projects), so `shopify theme dev` is not available yet. Visual checks were done with a throwaway local Liquid renderer (LiquidJS + a mock catalog built from the real photos in `docs/brand/products/`) driven by Playwright at 320 to 1440 px. It is not in the repo.

## Home page

`templates/index.json` order: `pegasus-hero` → `rich-text` (statement) → `collection-list` (six kinds) → `pegasus-product-tabs` → `pegasus-constellation` → `image-with-text` (story) → `pegasus-collage` → `pegasus-engrave` → `pegasus-photo-cards` → `pegasus-marquee` (dark) → `pegasus-quotes` → `pegasus-pills` → `multicolumn` (promises). The announcement bar, header and footer come from the section groups (the newsletter lives inside the footer).

New sections (all with presets, so merchants can add them anywhere; schema labels are plain English, not `t:` keys, so no locale files are needed for them):

- `pegasus-hero`: espresso hero. The photo (or a bundled scene) sits in a circular **medallion** with a double gold rim, echoing the emblem; the rim draws itself and the circle opens on load. `image_style: background` gives a full-width photo (with a star-field fallback), and `show_constellation` draws the Great Square (off by default). The headline is split into `.pg-w/.pg-wi` word spans in Liquid and animated with CSS keyframes only, so there is no flash and no JS dependency.
- `pegasus-product-tabs`: `<pg-tabs>` (assets/pegasus-tabs.js) over `<pg-rail>` carousels (assets/pegasus-rail.js). Tab blocks pick a collection; empty collections show placeholder cards.
- `pegasus-constellation`: the signature pinned section, `<pg-constellation>` (assets/pegasus-constellation.js). Scroll progress drives `--seg-1..6` (line drawing), `.is-lit` / `.is-active` on stars and `.is-active` on panels. It pins **only** when motion is allowed (not reduced-motion, not theme editor, not `pegasus_motion` off); otherwise it renders statically with all four panels visible. Inactive panels use `visibility: hidden`, and the nav buttons jump to a star by scrolling.
- `pegasus-marquee`: slow looping text (the only continuous motion); two copies of the list, the second `aria-hidden`; stops under reduced motion.
- `pegasus-quotes`: one big quote at a time in a `<pg-rail>`; the track is focusable and named via a setting.
- `pegasus-collage`: 12-column composition (tall tile, wide tile, two small; stacks on phones; `max_blocks: 4`). Blocks are `tile` (image, title, link) or `product` (title, price and image come from the product). Each tile is one `<a>`. A `product` tile is a clean card (photo on white, caption beneath, nothing over the pen). Tiles with no image use a `scene` photo, or their color scheme plus a CSS star field that follows `--color-foreground`, so it reads on dark and light schemes. `caption_style: dark` swaps the dark scrim for a paper fade, for light product shots.
- `pegasus-engrave`: a full-width espresso **plate** that shows what the visitor types, character by character (`<pg-engrave>`, assets/pegasus-engrave.js). The first time it is 60% in view it types the sample text once as a demo (not under reduced motion, in the theme editor, or with motion off); after that the plate is user-driven, and an empty field shows the sample faintly. Each new character is appended alone (earlier ones are never re-rendered, so their animation is not restarted) and is added as a text node, never as markup. The button is a plain GET `<form>` to the chosen product (`?engrave=<text>`), so it works without JS, and `pegasus-personalize.js` reads `?engrave=` on the product page to open the engraving panel pre-filled. Its character limit is its own setting and should match the product block's.
- `pegasus-pills`: "Where would you like to start?" quick links as large italic serif outlines that fill on hover (blocks: label + link, max 10). The collection handles in `templates/index.json` (`new-runs`, `gifts`, `limited`, `bestsellers`, `all`) are placeholders and must exist in the store.
- `pegasus-photo-cards`: "Inside a Pegasus pen": a full-bleed photo (image setting, or a bundled `pegasus-scene`; `focus` picks which band of a tall photo stays in view) under a dim layer, with up to four frosted cards (`backdrop-filter`, ink text set explicitly because the scheme's heading color would be cream on parchment). Cards stagger upward on wide screens only. It is not a sequence, so no numbering. Copy sticks to facts already on the product pages (turned barrel, twist action, refillable cartridge).
- Shared snippets: `pegasus-constellation` (the Great Square SVG, stars 1-4 are the square, 5-6 trail off) and `pegasus-rail-controls` (progress line + prev/next).

`<pg-rail>` cancels native `dragstart` (links and images otherwise swallow the pointer events and break drag-to-scroll) and snaps explicitly after a drag.

## Header search

`assets/pegasus-chrome.css` (loaded after `pegasus.css`) restyles Craft's search modal instead of replacing it, so the predictive search JS, the Section Rendering API calls and the focus handling stay Craft's.

- The `summary` of the single `header-search` is a field-shaped trigger: in the left slot on 990 px and wider, a full-width second row below that, and an icon beside the menu button in the compact header. Its visible text is the header setting `search_label`, and the same text is the `aria-label` (label in name). `header.liquid` renders the search **once** (`render_search_left`); Craft rendered it twice and hid one with CSS, which left duplicate IDs. The mobile grid areas use `!important` because Craft sets them with several stacked `:not()` selectors.
- Opening it shows a wide parchment panel (dimmed, blurred page behind). Before there are results it shows `.pg-search-start`: four pens from the `search_collection` setting, "Try searching for" lines from `search_terms` (one per line) and the main menu as "Browse". It sits inside `<predictive-search>`, so `predictive-search[open]`/`[loading]` hide it when results arrive. Results reuse Craft's markup (`sections/predictive-search.liquid`), re-laid-out with CSS only: products left, suggestions right.
- axe reports `aria-required-children` and `nested-interactive` on Craft's own results markup (a listbox holding groups); they are not from this layer, and the test disables those two rules.
- Strings are `general.search.popular_pens`, `try_searching` and `browse`; new keys go in every `locales/*.json`.

## Footer, announcement bar, back to top

All in `assets/pegasus-chrome.css` plus a few lines in `sections/footer.liquid`, `sections/announcement-bar.liquid`, `layout/theme.liquid` and `assets/pegasus.js`.

- **Footer** is Craft's footer section, configured and restyled, not replaced: a `brand_information` block (the emblem when no brand image is set, plus the theme setting `brand_description`, plus social icons), two `link_list` blocks ("Shop" = `main-menu`, "Help" = the `footer` menu) and the footer's own newsletter (`newsletter_heading`, new `newsletter_text`). Four columns from 990 px, three plus the newsletter below on tablets, brand row then two link columns then newsletter on phones. The old separate newsletter band is gone from `sections/footer-group.json`. The bottom row has copyright on the left and localization/payment icons on the right; the giant wordmark stays (decorative, `aria-hidden`). The social icons only appear once links are set in the theme settings, and payment icons come from the store's enabled payment types.
- **Specificity trap:** `section-footer.css` is loaded by the footer section itself, after `pegasus-chrome.css`, so equal-specificity rules lose. Every footer rule in `pegasus-chrome.css` starts with `.footer`. Header-section CSS that is loaded the same way (search, menu drawer) has the same trap, which is why the search rules are descendant selectors.
- **Announcement bar** has optional side links (`left_label`/`left_link`, `right_label`/`right_link`), shown from 990 px, in the grid areas Craft already defines (`social-icons`, `language-currency`); the left one is hidden while social icons are on and the right one while a country/language selector is on. In Liquid, `and`/`or` have no precedence (right to left), so the grid-class condition starts with `left_link or right_link or ...` to keep Craft's own condition intact.
- **Back to top** (`[data-pg-top]` in `layout/theme.liquid`, behaviour in `pegasus.js`): shows after 1.2 screens of scrolling, scrolls to the top (instantly under reduced motion) and moves focus to the logo, and sits above the sticky add-to-cart bar when that is showing. Its focus ring is ink with a parchment halo so it reads on both the light page and the dark footer.

## Compact header

On screens 990 px and wider, once the header has been scrolled past and comes back (scroll up, with `sticky_header_type: on-scroll-up`), Craft adds `scrolled-past-header` to `.section-header`. `assets/pegasus.css` ("Compact header") then collapses the two-row header to one row: the hidden `header-drawer` menu button is shown in the `left-icons` slot (the nav row is hidden and stays reachable through that drawer), the wordmark shrinks, padding drops. With sticky type "None" Craft never adds the class, so nothing changes. Phones and tablets are untouched.

- **Do not remove the height reservation in `pegasus.js` (`holdHeader`).** Shrinking an in-flow sticky header moves the page up by the difference; Chrome and Firefox compensate with scroll anchoring but Safari does not (the test turns `overflow-anchor` off to prove it). The script keeps the full height as `min-height` on `.section-header` (re-measured on load, resize, fonts, section re-render and only while not compact); the empty strip below the compact bar is `pointer-events: none` so it never blocks clicks.

## Product page: sticky add-to-cart bar

`snippets/pegasus-sticky-atc.liquid` is rendered at the end of `sections/main-product.liquid` (inside `<product-info>`), behind the `sticky_bar` section setting (default on). `<pg-sticky-atc>` (assets/pegasus-sticky-atc.js) never submits anything: its button calls `.click()` on the real `#ProductSubmitButton-<section id>`, and a MutationObserver mirrors that button's label, `disabled`, `aria-disabled` and `loading` state, so errors, spinners and sold-out behave exactly like the page. The price is copied from `#price-<section id>` (Craft rewrites it on variant change); the variant title and thumbnail come from the `variantChange` pubsub event.

- Visibility uses a rAF-throttled scroll check on `.product-form__buttons`, **not** IntersectionObserver: an observer only reports state changes, so a jump straight past the buttons (restored scroll, anchor link) is never reported.
- Craft's "sticky product info" setting keeps the buy buttons in view while the product section is on screen, so on desktop the bar correctly appears only after the section has scrolled past; on stacked layouts (phones) it appears as soon as the buttons leave the top.
- While the bar is showing, `body:has(pg-sticky-atc.is-visible)` gets bottom padding so the footer is never covered. Hidden, it is `inert` and `visibility: hidden`.
- Craft's price markup contains block `<div>`s, so the price must not sit inside a `<p>`: the parser closes the paragraph and the price drops out of the layout.
- Craft hides empty elements globally (`div:empty { display: none }`); remember this when inserting spacer divs in tests.

## Product page: engraving and gift options

The `personalize` block of `sections/main-product.liquid` (limit 1, placed before `buy_buttons` in `templates/product.json`) renders `snippets/pegasus-personalize.liquid`. `<pg-personalize>` (assets/pegasus-personalize.js) drives two switches, **Engraving** and **Gift options**, each opening a panel of fields. It adds no add-to-cart code: every field carries `form="<product_form_id>"` and a `properties[Name]` name, so Craft's own add-to-cart request sends them as line item properties, and the cart, cart drawer, notification and order already print `item.properties`.

- Fields are `disabled` until their switch is on, so nothing is sent by accident (a disabled field is left out of the form data). The gift switch itself is a named checkbox, so `Gift: Yes` is sent only when it is on. The wrap box is pre-checked, which is why it must stay disabled while the switch is off. `pg-personalize:not(:defined)` is hidden: without JavaScript the block does not appear.
- Validation lives in a **capture-phase `submit` listener on `document`**, so it runs before Craft's handler, survives the form being re-rendered, and also covers the sticky bar (its button clicks the real submit button). It blocks an empty engraving, shows the error in a `role="alert"` slot, and trims every text field so a whitespace-only value is never saved. Dynamic checkout buttons (Shop Pay, etc.) skip this check.
- Compare the form with `getAttribute('id')`, not `.id`: the product form has a field named `id` (the variant), and `form.id` returns that field instead of the string.
- Every label, limit and **property name** is a block setting (plain English, defaults in the schema), so the merchant can reword or translate. Changing a property name does not rename it on existing orders. The engraving preview plate uses the espresso/gold tokens, so gold stays on a dark surface.
- Quantity above 1 shows a note, because one engraving applies to the whole line. Copy must stay free of prices and conditions (the merchant decides those).

## Commands

Everything goes through Shopify CLI (5.0.0 installed). There is no `shopify.theme.toml`, so pass `--store` yourself.

- Lint: `shopify theme check --path .` (`--fail-level error`, `-a` to auto-correct, `-j` for JSON)
- Preview / sync: `shopify theme dev --store <shop>.myshopify.com`, `shopify theme pull|push` (need store auth)
- Deploy: pushes to `main` are meant to update the Shopify theme through Shopify's GitHub integration (connected once in the Shopify admin: Online Store > Themes > Add theme > Connect from GitHub). That integration is two-way: edits made in the theme editor are committed back to the branch, so `git pull` before you push, and expect `config/settings_data.json` and `templates/*.json` to change under you.
- Commits carry **no `Co-Authored-By` trailer and no mention of Claude** (the owner asked for this; GitHub otherwise lists "claude" as a co-author). Do not add attribution lines to commit messages or PR bodies.
- There is no test suite.

Lint baseline is **not clean**: 2 errors and 9 warnings. Both errors are `UnknownFilter: applicable_disclosures` in `snippets/cart-disclosure-indicator.liquid` and `snippets/product-disclosures.liquid`. That is probably a Shopify filter newer than the bundled theme-check. Compare against this baseline instead of expecting zero.

## Architecture

**Standard OS 2.0 layout.** `templates/*.json` list sections; `sections/header-group.json` and `footer-group.json` are section groups rendered by `layout/theme.liquid` via `{% sections %}`. `templates/gift_card.liquid` is the only Liquid template, and `layout/password.liquid` is the alternate layout.

**Auto-generated JSON is not valid JSON.** `config/settings_data.json`, `templates/*.json` and `sections/*-group.json` start with a `/* ... */` warning comment, so `json.load` fails on them. The theme editor rewrites these files, so hand edits can be overwritten. Keep setting IDs and block IDs stable: they are the merchant's saved configuration. `settings_data.json` currently has `cart_type: "notification"`, so the cart-drawer code path is inactive in the shipped config.

**No bundler; shared global scope.** `assets/*.js` are plain scripts loaded with `defer`. They share globals (`PUB_SUB_EVENTS`, `publish`/`subscribe`, `fetchConfig`, `debounce`, `routes`, ...), so order matters: `constants.js` → `pubsub.js` → `global.js` in `theme.liquid`. `theme.liquid` loads only `base.css`, a few cart stylesheets and the global JS; each section or snippet loads its own `component-*.css`/`*.js` itself (`{{ 'x.css' | asset_url | stylesheet_tag }}`). A new section must load its own assets. `card-product` has a `skip_styles` param to avoid loading CSS twice. Some loads in `theme.liquid` are conditional on settings (`cart_type == 'drawer'`, `predictive_search_enabled`, `animations_reveal_on_scroll`, localization).

**Behavior lives in custom elements.** Liquid emits a tag (`<product-info>`, `<cart-items>`, `<variant-selects>`, ...) and the matching `customElements.define` is in `assets/`. Components coordinate through the pubsub bus in `pubsub.js`, with event names in `constants.js` (`cart-update`, `variant-change`, ...).

**Server-rendered partial updates (Section Rendering API).** JS fetches `?section_id=<id>` or `sections=` and swaps in HTML. The schema-less sections (`cart-drawer`, `cart-icon-bubble`, `cart-notification-*`, `cart-live-region-text`, `pickup-availability`, `predictive-search`) are fragment renderers only. Their section IDs and DOM selectors are hard-coded in each element's `getSectionsToRender()` (`cart.js`, `cart-drawer.js`, `cart-notification.js`) and in JS fetches. Renaming a section, ID or selector breaks the JS without any lint error.

**`standard-actions-override.js`** bridges Shopify's Standard Actions bundle (`Shopify.actions.updateCart`/`openCart`) to the pubsub bus. It hard-codes the cart element tags (`DAWN_CART_TAGS`) and which sections the pubsub subscribers already refresh (`DAWN_PUBSUB_REFRESHED_SECTIONS`). Update both if you add or rename a cart element or section.

**External CDN dependency.** `theme.liquid` imports `https://cdn.shopify.com/storefront/standard-events.js` as a module, sets `window.StandardEvents`, and defines `collection-component` and `product-component`. `cart.js` does `class CartItems extends window.StandardEvents.createViewEventElement(...)` with no fallback, so cart code throws if that module fails to load. Other call sites guard with `window.StandardEvents || {}`.

**Theme-editor compatibility.** Per-section styles use `{%- style -%}` scoped by `section.id`. `theme-editor.js` (loaded only by the slideshow, main-product, featured-product and announcement-bar sections) handles `shopify:section:*` and `shopify:block:*` events. Any JS that holds state across a section re-render needs the same treatment.

**Snippets.** Public params are documented in `{% doc %}` blocks (24 of 39 snippets so far; sections have none). Match that format when adding or changing a snippet's params.

**i18n.** All visible strings go through `t:` keys. `locales/en.default.json` holds storefront strings and `en.default.schema.json` holds theme-editor labels. Add new keys to both English defaults; other locales fall back. Strings needed by JS are not read from locale files directly. `theme.liquid` injects them as `window.cartStrings`, `window.variantStrings`, `window.quickOrderListStrings` and `window.accessibilityStrings`, so add new JS-facing strings there.
