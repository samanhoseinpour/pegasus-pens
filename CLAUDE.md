# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Shopify Online Store 2.0 theme: **Craft v16.1.0** (see `config/settings_schema.json`), a Dawn-derived theme. `AGENTS.md` is titled "Dawn theme instructions" and the JS comments still say "Dawn", but the theme is Craft. There is no build step, no `package.json` and no README. The code lives in the private GitHub repo `samanhoseinpour/pegasus-pens` (remote `origin`, default branch `main`).

Rules from `AGENTS.md`: follow OS 2.0 conventions; preserve existing section setting IDs and merchant configuration; prefer small reusable snippets over duplicated Liquid; keep changes theme-editor compatible.

The store is **Pegasus Pens**. The visual identity is a design layer on top of Craft (see "Pegasus design layer" below), inspired by the Wonder/"NOOK" reference in `docs/wonder-reference-discovery.md`. No Wonder code, imagery or icons are used.

## Pegasus design layer

Craft stays the engine. The identity comes from settings plus three files loaded after Craft's:

- **Palette lives in the color schemes** (`config/settings_data.json`, `scheme-1..5`): Foolscap `#F2F3EF` / Moonlight `#DDE3EA` / Teal ink `#0E5E5D` / Nocturne `#0D1329` / Garnet `#A3283D`; text ink `#111A32`. Nib gold `#B8975A` is used only for star glyphs and hairlines. Change colors there, not in CSS.
- `assets/pegasus.css` (loaded right after `base.css`): tokens, type scale, buttons, announcement bar, wordmark, footer wordmark, reveal classes. It uses Craft's `--font-*` and `--color-*` variables, never the font names directly, so turning the font setting off falls back cleanly.
- `assets/pegasus.js`: ink-wipe on large images, word-rise on headlines, `data-scrolled` on `<html>`. It does nothing under reduced motion, in the theme editor, or when `settings.pegasus_motion` is off. New sections opt in with `data-pg-wipe` / `data-pg-rise`; `window.Pegasus.init(scope)` re-runs it after a section re-render.
- `snippets/pegasus-wordmark.liquid`: the Great Square mark plus the shop name (first word upright, rest italic). Used by the header (when no logo image is set) and the footer.
- Settings added: `pegasus_fonts` (self-hosted Newsreader + Hanken Grotesk, OFL, licenses in `docs/font-licenses.md`; overrides the font pickers) and `pegasus_motion`; footer `show_wordmark`. New schema labels must be added to **every** `locales/*.schema.json` (theme-check fails `MatchingTranslations` otherwise).
- Craft's own `animations_reveal_on_scroll` is off in the saved settings because `pegasus.js` replaces it.
- Typography rules: sentence case for labels (no all-caps eyebrows), UI text tracking reset to `0.01em` (Craft tracks much wider), display headings use `font-optical-sizing: auto`.

There is no Shopify store linked to this project (the Shopify CLI config on this machine belongs to other projects), so `shopify theme dev` is not available yet. Visual checks were done with a throwaway local Liquid renderer (LiquidJS + mock pen catalog) driven by Playwright at 1440, 1024, 768 and 390 px. It is not in the repo.

## Home page

`templates/index.json` order: `pegasus-hero` → `rich-text` (statement) → `collection-list` (six kinds) → `pegasus-product-tabs` → `pegasus-constellation` → `image-with-text` (story) → `pegasus-collage` → `pegasus-marquee` (dark) → `pegasus-quotes` → `multicolumn` (promises). Header, newsletter and footer come from the section groups.

New sections (all with presets, so merchants can add them anywhere; schema labels are plain English, not `t:` keys, so no locale files are needed for them):

- `pegasus-hero`: night-sky (or image) hero. The headline is split into `.pg-w/.pg-wi` word spans in Liquid and animated with CSS keyframes only, so there is no flash and no JS dependency. The one load-in sequence also draws the Great Square.
- `pegasus-product-tabs`: `<pg-tabs>` (assets/pegasus-tabs.js) over `<pg-rail>` carousels (assets/pegasus-rail.js). Tab blocks pick a collection; empty collections show placeholder cards.
- `pegasus-constellation`: the signature pinned section, `<pg-constellation>` (assets/pegasus-constellation.js). Scroll progress drives `--seg-1..6` (line drawing), `.is-lit` / `.is-active` on stars and `.is-active` on panels. It pins **only** when motion is allowed (not reduced-motion, not theme editor, not `pegasus_motion` off); otherwise it renders statically with all four panels visible. Inactive panels use `visibility: hidden`, and the nav buttons jump to a star by scrolling.
- `pegasus-marquee`: slow looping text (the only continuous motion); two copies of the list, the second `aria-hidden`; stops under reduced motion.
- `pegasus-quotes`: one big quote at a time in a `<pg-rail>`; the track is focusable and named via a setting.
- `pegasus-collage`: 12-column composition (tall tile, wide tile, two small; stacks on phones; `max_blocks: 4`). Blocks are `tile` (image, title, link) or `product` (title, price and image come from the product). Each tile is one `<a>`. Tiles with no image use their color scheme plus a CSS star field that follows `--color-foreground`, so it reads on dark and light schemes. `caption_style: dark` swaps the dark scrim for a paper fade, for light product shots.
- Shared snippets: `pegasus-constellation` (the Great Square SVG, stars 1-4 are the square, 5-6 trail off) and `pegasus-rail-controls` (progress line + prev/next).

`<pg-rail>` cancels native `dragstart` (links and images otherwise swallow the pointer events and break drag-to-scroll) and snaps explicitly after a drag.

## Product page: sticky add-to-cart bar

`snippets/pegasus-sticky-atc.liquid` is rendered at the end of `sections/main-product.liquid` (inside `<product-info>`), behind the `sticky_bar` section setting (default on). `<pg-sticky-atc>` (assets/pegasus-sticky-atc.js) never submits anything: its button calls `.click()` on the real `#ProductSubmitButton-<section id>`, and a MutationObserver mirrors that button's label, `disabled`, `aria-disabled` and `loading` state, so errors, spinners and sold-out behave exactly like the page. The price is copied from `#price-<section id>` (Craft rewrites it on variant change); the variant title and thumbnail come from the `variantChange` pubsub event.

- Visibility uses a rAF-throttled scroll check on `.product-form__buttons`, **not** IntersectionObserver: an observer only reports state changes, so a jump straight past the buttons (restored scroll, anchor link) is never reported.
- Craft's "sticky product info" setting keeps the buy buttons in view while the product section is on screen, so on desktop the bar correctly appears only after the section has scrolled past; on stacked layouts (phones) it appears as soon as the buttons leave the top.
- While the bar is showing, `body:has(pg-sticky-atc.is-visible)` gets bottom padding so the footer is never covered. Hidden, it is `inert` and `visibility: hidden`.
- Craft's price markup contains block `<div>`s, so the price must not sit inside a `<p>`: the parser closes the paragraph and the price drops out of the layout.
- Craft hides empty elements globally (`div:empty { display: none }`); remember this when inserting spacer divs in tests.

## Commands

Everything goes through Shopify CLI (5.0.0 installed). There is no `shopify.theme.toml`, so pass `--store` yourself.

- Lint: `shopify theme check --path .` (`--fail-level error`, `-a` to auto-correct, `-j` for JSON)
- Preview / sync: `shopify theme dev --store <shop>.myshopify.com`, `shopify theme pull|push` (need store auth)
- Deploy: pushes to `main` are meant to update the Shopify theme through Shopify's GitHub integration (connected once in the Shopify admin: Online Store > Themes > Add theme > Connect from GitHub). That integration is two-way: edits made in the theme editor are committed back to the branch, so `git pull` before you push, and expect `config/settings_data.json` and `templates/*.json` to change under you.
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
