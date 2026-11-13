# Technical SEO findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt) · Date: 2026-11-13 · Agent: seo-technical
Category score: 74/100. The platform basics are sound (HTTPS, canonicals, robots, sitemap, server-rendered content, no noindex mistakes). The points lost are specific to this store: four policy pages missing, deleted collections without redirects, a thin "Home page" collection and an empty blog that are both submitted in the sitemap, related-pen links that depend on a JS call to a robots-blocked endpoint, and no Search Console property.

Scope note: all evidence comes from the saved crawl (`CRAWL/index.tsv`, `pages/`, `render/`) and the theme. I made 4 extra live requests (4 s apart, no 429): `/collections/hardwood/products/olive-wood-pen`, `/products/olive-wood-pen?variant=...&utm_source=x`, `/collections/hardwood?sort_by=price-ascending`, `/search?q=Leather`. I did not run `sitemap_discovery.py` (it would re-crawl); I read the saved sitemap files directly.

## What works
- **HTTPS and redirects.** `http://` answers one 301 to `https://` (`pages/http-check.headers`). All 23 live HTML pages answer 200 with no redirect hop (21 as `103>200`; `/collections/frontpage` and `/policies/privacy-policy` as a plain 200), per index.tsv.
- **Canonicals are correct and self-referencing on all 23 saved 200 pages** (`layout/theme.liquid:8`, `{{ canonical_url }}`). Verified live: `/collections/hardwood/products/olive-wood-pen` canonicalizes to `/products/olive-wood-pen`; `?variant=...&utm_source=x` canonicalizes to the clean product path; `/collections/hardwood?sort_by=price-ascending` canonicalizes to `/collections/hardwood`. Card links on every saved page already use `/products/<handle>` (no `/collections/<c>/products/<p>` links exist in the HTML), so the duplicate path is only reachable by hand.
- **No accidental noindex.** No `<meta name="robots">` on any saved page, and no `X-Robots-Tag` on any saved response. The one live exception is correct: `/search?q=` answers `X-Robots-Tag: noindex, nofollow` (Shopify, platform). The theme links three `/search?q=` URLs from every page, so this header is what keeps them out of the index.
- **robots.txt** (Shopify-generated, `User-agent: *` / `Allow: /`) blocks only cart, checkout, account, orders, `sort_by`, multi-filter and `+` tag combinations, AJAX endpoints and preview parameters. It does not block CSS, JS, images or any AI crawler token, and it declares `Sitemap: <origin>/sitemap.xml`.
- **Sitemap** is valid and complete for what exists: `sitemap.xml` index with products (8 pens + `/`), collections (6), pages (4), blogs (1) and an agentic-discovery file. The deleted collections and the draft pen are correctly absent. Sitemap and robots both emit the current host, so they follow the domain.
- **Raw vs rendered parity is complete.** Home: 9,178 text characters in both the raw HTML and the Playwright DOM, 0 words that differ, 1 h1 and 23 h2 in both, 95 img and 139 a in both. Collection `/collections/hardwood`: 3,005 characters in both, 0 differing words. Product `/products/date-seed-pen`: 5,283 raw vs 5,314 rendered characters, the 4 extra words are cart-UI strings ("More", "options", "payment", "Infinity"). The pens, prices, descriptions, JSON-LD and nav are all in the raw HTML. Nothing important needs JavaScript, with one exception (TECH-05).
- **Viewport** is `width=device-width,initial-scale=1` (`layout/theme.liquid:6`), with no `user-scalable=no` or `maximum-scale`. One h1 per page.
- **Header-level security** is good for a Shopify store: HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, CSP with `upgrade-insecure-requests` (see TECH-10).
- **404 handling** is correct: real 404 status (not soft 404) for the deleted collections, the draft `/products/rose-resin-pen` and the probe, each with a `/404` canonical and a "Continue shopping" link to `/collections/all`.
- **Anchor text is descriptive** in menus and on the home page ("Hardwood", "Shop leather", "Read our story"); no "click here" pattern. Every saved HTML page reaches every pen within one click from the home page.

## Findings

### TECH-01: Four policy pages return 404 and the shipping page is still a placeholder
- Severity: High
- Evidence: `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-service`, `/policies/contact-information` all `404` (index.tsv). Only `/policies/privacy-policy` is `200` and linked (footer, 34 of 34 HTML pages). `/pages/shipping-returns` is `200`, in the sitemap, and its meta description reads "Shipping and returns details are coming soon." The theme hides the product page's "Shipping and returns" tab until that page has content (CLAUDE.md), so product pages also carry no shipping or return information.
- Why it matters: shoppers of a CAD 80 to 180 one-of-a-kind item look for returns and shipping before buying, and Google Merchant Center / the Google and YouTube channel needs shipping and return policies before products can be listed. A "coming soon" page in the sitemap also indexes a thin page under your name.
- Fix: Shopify admin > Settings > Policies: create Refund policy, Shipping policy, Terms of service and Contact information (Shopify has a "Create from template" button). They are linked automatically in the checkout footer, and `{{ shop.refund_policy.url }}` / `{{ shop.shipping_policy.url }}` can be added to the `footer` menu as relative links. Replace the "coming soon" body of `/pages/shipping-returns` with the owner's real terms (client decision: the owner must supply them; I will not invent returns terms or shipping times). Until then, unpublish the page (it leaves the sitemap) or accept that a placeholder is indexable; the product page's tab already hides itself without content, but the `/pages/shipping-returns` URL stays public.
- Depends on: none (needs a client decision)
- Domain switch: auto (policies are store content; Merchant Center use is TECH-12 / Domain portability)
- How we'd know it failed: any of the four policy paths still returns 404, or `/pages/shipping-returns` still contains "coming soon".
- Leading indicator: the footer menu shows a refund and a shipping link; Merchant Center (after the switch) reports no "missing return / shipping policy" warning.

### TECH-02: Five deleted collection handles return 404 with no redirect
- Severity: Medium
- Evidence: `/collections/bestsellers`, `/collections/burl-wood`, `/collections/limited`, `/collections/new-runs`, `/collections/resin` all `404` with no redirect hop (index.tsv). They were public from 2026-11-07 to 2026-11-13, so any link shared on Instagram, Facebook Marketplace, email, or typed into a bio during those six days now dead-ends. No theme file links to them any more (grepped `templates/*.json`, `sections/*-group.json`, `config/settings_data.json`: all `shopify://collections/...` references resolve to existing collections). Section defaults in the theme still mention "burl", "resin" and "Shop resin" as copy (`sections/pegasus-collage.liquid:264`, `sections/pegasus-constellation.liquid:162`), but only when a merchant adds a new section with defaults; they do not render on the saved pages.
- Why it matters: a 404 for a URL that people already have loses that visitor and any link signal. With six days of life and a brand-new site, the index loss is small, so this is cheap hygiene, not an emergency. I cannot verify whether Google already crawled these (no Search Console).
- Fix: Shopify admin > Online Store > Navigation > View URL redirects > Create URL redirect (or Import a CSV with "Redirect from" and "Redirect to" columns). Use **relative** targets only; Shopify redirects are always 301:

  | Redirect from | Redirect to |
  |---|---|
  | `/collections/burl-wood` | `/collections/hardwood` |
  | `/collections/resin` | `/collections/all` |
  | `/collections/bestsellers` | `/collections/all` |
  | `/collections/new-runs` | `/collections/all` |
  | `/collections/limited` | `/collections/all` |

  The mapping is a client decision: the only page that matches "burl" is the plum wood / Persian Khatam pen, which is in Hardwood; no resin pen is public (the pink resin pen is a draft), and every pen is one of a kind, so "limited", "new runs" and "bestsellers" have no equal. If the owner prefers, point them all at `/collections/all`. Do not redirect to the home page (Google treats that as a soft 404).
- Depends on: none
- Domain switch: auto (redirect rules are path based and belong to the store; they move with the primary domain)
- How we'd know it failed: `curl -sI <origin>/collections/resin` still returns `404`, or returns a chain longer than one hop.
- Leading indicator: Shopify admin > Analytics > Reports > "Sessions by landing page" shows no landing on the five paths; later, the Search Console "Not found (404)" list is empty.

### TECH-03: `/collections/frontpage` is a thin "Home page" collection, submitted in the sitemap
- Severity: Medium
- Evidence: `/collections/frontpage` is `200`, title "Home page – Pegasus Pens", h1 "Home page", **no meta description**, and holds **one** pen (`/products/date-seed-pen`). It is listed in `sitemap_collections_1.xml` (with `lastmod` 2026-11-12) and linked only from `/collections` (itself an orphan, see TECH-08). Meanwhile `/collections/all` ("Products": 8 pens, canonical to itself) is the real full listing, linked from every page, but is **not** in the sitemap. The home page `/` is its own canonical and is in `sitemap_products_1.xml` as the first entry (a Shopify quirk, harmless).
- Why it matters: the platform default collection is not content: its title is meaningless to a searcher, it has one product, and it competes for the same "all pens" intent as `/collections/all`. It costs crawl attention for nothing and may be shown in results with a poor title.
- Fix: Shopify admin > Products > Collections > "Home page" > Sales channels: remove Online Store (the sitemap drops it, the page 404s). Do **not** delete the collection if anything on the home page still draws from it (the home page in `templates/index.json` uses `shopify://` collection links, none to `frontpage`, so unpublishing is safe). Add a redirect `/collections/frontpage` to `/collections/all` as in TECH-02 so any shared link still lands. For `/collections/all`: its "Products" title and missing description cannot be edited in the admin (see TECH-06 for the theme override).
- Depends on: TECH-02 (same redirect screen)
- Domain switch: auto
- How we'd know it failed: `/collections/frontpage` still appears in `sitemap_collections_1.xml` or still answers `200`.
- Leading indicator: the collections sitemap lists exactly five collections (hardwood, segmented-wood, gifts, leather, date-seed).

### TECH-04: `/blogs/news` is empty but is in the main menu and the sitemap
- Severity: Medium
- Evidence: `/blogs/news` is `200`, title "News – Pegasus Pens", **no meta description**, and its main content is just the heading "News" with no articles. It is in `sitemap_blogs_1.xml` (lastmod 2026-10-23, the store-creation date), and the main menu item "Blog" links to it from every one of the 34 HTML pages (`/blogs/news`, anchor "Blog").
- Why it matters: an empty indexable page behind a nav link is a thin page and a weak signal about the site's quality. It also gives visitors a dead end in the header.
- Fix: either publish a first article (Shopify admin > Online Store > Blog posts) and give the blog a meta description, or remove "Blog" from `main-menu` (Online Store > Navigation) until there are posts. If the blog stays empty and indexable, add a `noindex` for it in the `layout/theme.liquid` head: `{% if request.page_type == 'blog' and blog.articles_count == 0 %}<meta name="robots" content="noindex">{% endif %}` (no host involved; it lifts itself once an article exists). The empty blog stays listed in the sitemap either way.
- Depends on: client decision (blog plan)
- Domain switch: auto
- How we'd know it failed: the header "Blog" link still leads to a page with zero articles and no `noindex`.
- Leading indicator: `/blogs/news` shows at least one article card, or "Blog" is gone from `main-menu`.

### TECH-05: "You may also like" pens are loaded by JavaScript from a URL that robots.txt blocks
- Severity: Medium
- Evidence: on every product page the related section is an empty shell in the raw HTML: `<product-recommendations data-url="/recommendations/products?limit=4" ...>` with no children (`pages/products_olive-wood-pen.html:2217`). The rendered DOM also has none (62 vs 61 anchors on `/products/date-seed-pen`; its only `/products/` link is itself), and `robots.txt` has `Disallow: /recommendations/products`. Result: product pages link to no other pens in HTML. Four pens (`canadian-leather-pen`, `cross-grain-oak-pen`, `date-seed-pen`, `maple-wood-pen`) are linked from every page through the search panel's "Popular pens"; the other four (`olive-wood-pen`, `plum-wood-persian-khatam-pen`, `six-hardwoods-pen`, `walnut-rosewood-maple-acrylic-pen`) are linked only from the home page and the collection pages (5 pages each).
- Why it matters: Googlebot honours robots.txt for the XHR that fills the section, so crawlers never see it; internal links from pen to pen carry relevance and help discovery. It is an eight-page catalog so the loss is modest, but sold-out pens (TECH-07) will rely on those links to hand visitors on.
- Fix: in `templates/product.json`, replace the `related-products` section with Craft's existing server-rendered `featured-collection` section (`type: "featured-collection"`, `collection: "shopify://collections/all"`, `products_to_show: 4`, heading "You may also like"), keeping the same padding and colour scheme. It renders the cards in the raw HTML with `/products/<handle>` links and uses a `shopify://` reference, so no host is involved. It will include the current pen among the cards; with eight pens that is acceptable, or set 8 to show the rest. Keep section setting IDs for the other sections unchanged.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: `curl -s <origin>/products/olive-wood-pen | grep -c 'href="/products/'` shows only the one self-link plus the four search-panel pens.
- Leading indicator: all eight `/products/<handle>` paths appear in the raw HTML of each product page.

### TECH-06: Missing meta descriptions on six indexable pages, and a generic title on `/collections/all`
- Severity: Medium
- Evidence: no `<meta name="description">` on `/pages/about`, `/pages/contact`, `/blogs/news`, `/collections/all`, `/collections/frontpage`, `/policies/privacy-policy` (saved HTML). `layout/theme.liquid:27` prints the tag only when `page_description` exists. `/collections/all` is titled "Products – Pegasus Pens" with h1 "Collection: Products" (Shopify's built-in name). The home page description is the shop-level "Handcrafted luxury pens". All five material collections and all eight pens have their own description.
- Why it matters: without a description Google writes its own snippet from the page, which on `/pages/about` (the E-E-A-T page: the maker's story) is a lost chance to state the maker and place. A title of "Products" is unspecific for the page that lists every pen.
- Fix: for `/pages/about`, `/pages/contact`, the blog and the privacy policy page: Shopify admin > Online Store > Pages > Search engine listing > Edit (store content). For `/collections/all`, which has no admin editor, override in `layout/theme.liquid` using a locale string rather than a literal: `{% if collection.handle == 'all' %}` use a translatable "All pens" title and description for `<title>` and the description tag. The on-page agent owns the wording; this finding is only that the fields are empty.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: any of the six paths still returns HTML without `<meta name="description"`.
- Leading indicator: each page's raw HTML contains a description of 120 to 160 characters, and `/collections/all` has a descriptive `<title>`.

### TECH-07: Sold-out pens: keep the URL live (policy decision before the first sale)
- Severity: Medium
- Evidence: every pen is stocked at 1 with overselling denied (brief). A product page of an active product with 0 stock stays `200` and Shopify sets the JSON-LD Offer to `OutOfStock` (today `InStock`: `"availability":"http:\/\/schema.org\/InStock"` on `/products/date-seed-pen`). If instead a sold pen is set to Draft or Archived, the URL turns into a 404, losing its history, any backlinks and the proof of work.
- Why it matters: one-of-a-kind items sell once, so by design each product URL will go "sold" soon. The page can still rank for its materials and still hold the maker's story and photos; a 404 would throw that away.
- Fix: keep sold pens Active. Do not archive. In the product template, show a clear "Sold" state and, in the same area, the server-rendered other pens from TECH-05 so a visitor has somewhere to go. If a pen must ever be removed, add a 301 (Online Store > Navigation > URL redirects, relative target such as `/collections/leather`) before archiving. Client decision.
- Depends on: TECH-05
- Domain switch: auto
- How we'd know it failed: a sold pen returns 404 or shows no buy/sold message and no link to other pens.
- Leading indicator: after the first sale, `/products/<handle>` is still `200` with `OutOfStock` in its JSON-LD.

### TECH-08: Orphan and weak internal paths: `/collections`, the home page's missing og:image
- Severity: Low
- Evidence: `/collections` (the collection index) is `200`, indexable, canonical to itself, and linked from no navigation, home page or footer; its only inbound link source in the crawl is none (not in `home-links.txt`, not in any saved body). It is not in the sitemap. `og:image` is **absent** on the home page, `/collections*`, `/pages/*`, `/blogs/news` and the privacy page, and present only on product pages (`snippets/meta-tags.liquid`: `{%- if page_image -%}`), where it is written `http:{{ page_image | image_url }}` while `og:image:secure_url` carries `https:`. The theme has no share-image setting to fall back to.
- Why it matters: `/collections` duplicates the intent of `/collections/all` with no inbound links; either use it or let it be. Social shares of the home page get no image, which weakens link previews (the social agent owns this; listed because it is in `meta-tags.liquid`).
- Fix: leave `/collections` unlinked (acceptable) or add it to the footer menu as "All collections". For og:image, in `snippets/meta-tags.liquid` add a fallback to a bundled image through `asset_url` (for example `assets/pegasus-emblem-large.webp`, already in the theme) when `page_image` is blank: `<meta property="og:image" content="https:{{ 'pegasus-emblem-large.webp' | asset_img_url: '1080x' }}">`, and change the first tag's `http:` to `https:`. All dynamic, no host.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: `curl -s <origin>/ | grep -c 'og:image'` is 0.
- Leading indicator: a pasted home page link shows an image in a link-preview tool.

### TECH-09: Cosmetic head details: empty `theme-color`, `lang="en"` vs `en-CA`
- Severity: Low
- Evidence: `layout/theme.liquid:7` (and `layout/password.liquid:7`), identical to origin/main: `<meta name="theme-color" content="">`, an empty value browsers ignore. `layout/theme.liquid:2` sets `lang="{{ request.locale.iso_code }}"` which renders `en`, while the response header says `content-language: en-CA`.
- Why it matters: neither affects ranking. An empty `theme-color` is invalid markup, and `en-CA` would match the Canadian audience; Google mostly ignores the `lang` attribute for targeting.
- Fix: in `layout/theme.liquid`, fill `theme-color` from the colour scheme (`{{ settings.color_schemes['scheme-1'].settings.background }}`) or delete the line; optionally add the region with `lang="{{ request.locale.iso_code }}-CA"` only if the store stays Canada-only (`localization.country` is also available). Not required.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the empty tag is still in the head.
- Leading indicator: view-source of any page.

### TECH-10: Security headers: what Shopify sets, and what nobody can change
- Severity: Info
- Evidence (home response headers): `strict-transport-security: max-age=7889238` (about 91 days, no `includeSubDomains`, no `preload`); `x-frame-options: DENY`; `x-content-type-options: nosniff`; `content-security-policy: block-all-mixed-content; frame-ancestors 'none'; upgrade-insecure-requests;`; `x-xss-protection: 1; mode=block`; `x-permitted-cross-domain-policies: none`. **Not present:** `Referrer-Policy`, `Permissions-Policy`, a script-src CSP, COOP. Cookies are `Secure; SameSite=Lax`, with the Shopify essential, analytics and marketing cookies set on first request (`_shopify_essential`, `_shopify_analytics`, `_shopify_marketing`).
- Why it matters: all of these are emitted at Shopify's edge and cannot be edited by the theme or in the admin. They do not affect rankings. The only theme-level lever is `<meta name="referrer" ...>`, and adding it brings no SEO benefit.
- Fix: none needed. Do not spend time on header hardening; do not recommend `X-Robots-Tag`, HSTS, or CSP changes to the owner because the platform does not allow them.
- Depends on: none
- Domain switch: auto (Shopify issues the certificate and headers for the new primary domain)
- How we'd know it failed: n/a.
- Leading indicator: n/a.

### TECH-11: Agent-addressed text in `robots.txt` and `/agents.md` is Shopify platform content
- Severity: Info
- Evidence: `robots.txt` comments and `/agents.md` (in `sitemap_agentic_discovery.xml`) address AI shopping agents and recommend installing a third-party "Shop" skill; the `Link` header advertises `rel="ucp"` for `/.well-known/ucp`. The rules for crawlers themselves are plain `Allow: /` for all agents with the usual private-path blocks, so AI search crawlers are not blocked.
- Why it matters: this is assessed, not acted on. It is generated by Shopify, not by the theme, and cannot be edited short of adding a custom `robots.txt.liquid`, which is not recommended. Nothing in it harms SEO; `/agents.md` being listed in the sitemap is harmless.
- Fix: none. If the owner wants to opt out of agent features, that is a Shopify admin / channel decision, not a theme change.
- Depends on: none
- Domain switch: auto (the file emits the current host)
- How we'd know it failed: n/a.
- Leading indicator: n/a.

### TECH-12: No Search Console or Bing Webmaster property exists
- Severity: Medium
- Evidence: the brief states there is no Search Console, PageSpeed, CrUX or analytics access; the theme has no verification meta tag (`layout/theme.liquid`, `snippets/meta-tags.liquid`) and none appears in the saved heads. So indexing status, the five 404 handles (TECH-02) and the `frontpage` / `blogs/news` pages (TECH-03, TECH-04) cannot be monitored today.
- Why it matters: for a six-day-old store, Search Console is the only source of truth on what Google has indexed, which queries show impressions and whether the sitemap is read.
- Fix: **at domain switch**, add a Domain property (DNS TXT record at the registrar), not a URL-prefix property for the Shopify handle, so all history lives on the real domain and covers http, https, www and subdomains at once. Then submit `sitemap.xml` (relative; Search Console resolves it against the property). Then import the property into Bing Webmaster Tools. Do not add a verification meta tag with a hard-coded token for the handle; it would be lost at the switch and does not add value. Until then, rely on the "site:" check and Shopify analytics.
- Depends on: the custom domain purchase
- Domain switch: manual
- How we'd know it failed: no property exists 7 days after the switch.
- Leading indicator: Search Console > Pages lists the sitemap's URLs as indexed (8 pens, the remaining collections and the pages), with no "Not found (404)" entries.

### TECH-13: Pegasus `markExternal()` is not in the deployed theme
- Severity: Info
- Evidence: `git show origin/main:assets/pegasus.js` contains no `markExternal` (the function is in the local working copy at `assets/pegasus.js:150`, an unpushed change). On the live pages the Instagram links are plain anchors: `<a href="https://www.instagram.com/pegasus.pens/" class="link list-social__link">` with no `target`, `rel` or `aria-describedby` in both the raw HTML and the rendered DOM. CLAUDE.md describes the behaviour as live.
- Why it matters: no SEO effect (outbound links to a social profile need no `nofollow`, `noopener` is a security and UX matter). It matters here for the domain switch: when this ships, it compares links with `location.hostname`, so a new primary domain needs no edit.
- Fix: none for SEO; when the local changes are pushed it starts working. Keep `location.hostname` as the comparison and never add a literal host.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: after the push, the Instagram anchors still have no `target="_blank"`.
- Leading indicator: view-source after deploy.

### TECH-14: The saved renderer's `is_spa: true` for products and collections is a false positive
- Severity: Info
- Evidence: `render/products_date-seed-pen.stdout` and `render/collections_hardwood.stdout` report `is_spa: True` with a `raw_content` of only 1,568 characters. That body is Shopify's "Too many requests" page (HTTP 429) the tool's raw fetch received; the rendered DOM and the separately saved `pages/*.html` (about 210 KB) are the full pages. Home (`is_spa: False`) is the only render whose raw fetch succeeded.
- Why it matters: it would otherwise suggest client-side rendering; the real parity numbers are in "What works". The store is server-rendered Liquid.
- Fix: none.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: n/a
- Leading indicator: n/a

## Duplicate paths: `/collections/frontpage` vs `/collections/all` vs home
| Path | Status | Canonical | In sitemap | Listing | Verdict |
|---|---|---|---|---|---|
| `/` | 200 | `/` | yes (in the products sitemap) | home page sections | the entry page |
| `/collections/all` | 200 | itself | **no** | all 8 pens, linked from every page | keep; the real "all pens" hub |
| `/collections/frontpage` | 200 | itself | **yes** | 1 pen, "Home page", no description | unpublish and redirect (TECH-03) |
| `/collections` | 200 | itself | no | index of collections | orphan, leave (TECH-08) |
No canonical conflicts exist among them; the issue is a thin page that is submitted and a real hub that is not.

## Domain portability

### (a) Absolute links to the resolved host in body content
Scanned every saved HTML page (34: the 23 live pages plus 11 that return 404) for the resolved host in anchors, forms, inputs, images and scripts, **excluding** Shopify-generated tags (canonical, og:url, oembed alternates, JSON-LD, `Link` headers, preload links, sitemap and robots).

Result: **no absolute host link comes from a menu, a page body, a product description or a theme setting.** The only occurrences in body content, each traced:

| Occurrence | Pages | Source | Verdict |
|---|---|---|---|
| `<a href="<origin>/customer_authentication/redirect?locale=en&region_country=CA">` inside `.cart__login-paragraph` | all 34 HTML pages | `snippets/cart-drawer.liquid:54` and `sections/main-cart-items.liquid:49`, `routes.account_login_url` (Shopify route object, not a literal) | auto |
| `<input id="ShareUrl-...">` `value="<origin>/products/<handle>"` | 8 product pages | `sections/main-product.liquid:512`: `product.url \| prepend: request.origin`; `snippets/share-button.liquid:30` prints it | auto |
| Inline script values (`window.shopUrl`, `storefrontBaseUrl`, `monorailEndpoint`, `data-shs-beacon-endpoint`, `shopify-store store-domain`, `storefrontUrl`), JSON-LD `url` and `item` fields, og:image | all | Shopify-generated or built from `request.origin` / `canonical_url` (`sections/header.liquid`, `sections/pegasus-breadcrumbs.liquid`, `snippets/meta-tags.liquid`) | auto |

Evidence that the stored content is clean: `grep` for the `myshopify` domain and the store handle over the theme (excluding `docs/` and `product-images/`) returns no hit; `templates/*.json`, `sections/header-group.json` and `sections/footer-group.json` contain no `http` strings (every link is a `shopify://` reference or empty); `config/settings_data.json` contains exactly one external URL, `social_instagram_link` (Instagram, not the store); the menus `main-menu` and `footer` render as relative paths (`/collections/hardwood`, `/pages/about`, ...) in the saved HTML; the page bodies of `/pages/about`, `/pages/care`, `/pages/contact`, `/pages/shipping-returns` and the product descriptions contain no host. The `Link` response headers use protocol-relative asset URLs (`//<host>/cdn/shop/...`), which follow the requested host.
Residual risk: `assets/pegasus.js` `markExternal()` (local copy only, TECH-13) compares with `location.hostname`, so it follows any new domain.

### (b) What follows the primary domain automatically versus what needs a manual step
| Item | Follows automatically? | Manual step at the switch |
|---|---|---|
| `<link rel="canonical">`, og:url, JSON-LD (`request.origin`), breadcrumbs, share URL, sitemap, robots.txt `Sitemap:` line, `Link` headers, menus, `shopify://` links | **auto** | none; re-check one page with view-source after the switch |
| HTTPS certificate, HSTS and the other platform headers | **auto** (Shopify issues them) | confirm the certificate shows as active in Settings > Domains |
| Checkout and customer-account URLs | **auto** | none |
| URL redirects added in admin (TECH-02, TECH-03) | **auto** (path-based) | none |
| Search Console | **manual** | Create a **Domain** property (DNS TXT at the registrar) after the domain resolves; submit `sitemap.xml`; import into Bing Webmaster Tools (TECH-12) |
| Sitemap submission | **manual** | Submit `sitemap.xml` (relative) in Search Console and Bing once the property exists |
| Merchant Center / Google and YouTube channel | **manual** | Connect only after the switch, so the website is claimed and verified on the real domain (not the Shopify handle); needs the policies of TECH-01 first |
| Instagram bio link | **manual** | Update the bio link to the new domain (the profile URL in `social_instagram_link` is unaffected) |
| Facebook Marketplace listings that point at the store | **manual** | Edit each listing's link to the new domain, since old links will only work as long as the handle redirect does |
| Handle to primary-domain redirect | **platform, verify** | Shopify should 301 every handle URL to the same path on the primary domain. Verify after the switch: `curl -sI <handle-origin>/products/date-seed-pen` must return a single `301` to `<new-origin>/products/date-seed-pen` (one hop, `https`, same path), and the same for `/` and `/collections/all`; a 302 or a two-hop chain is a fault to raise with Shopify support. Also confirm `http://<new-domain>` 301s to `https://`. Currently `redirects_from_handle=0` (no custom domain), so the handle is today's canonical host. |
| Google Analytics, ad pixels or other third-party tags with the handle in their settings | **unknown** | none are in the saved HTML; if added later, set them with the new domain |

### (c) Postpone until after the switch
- Search Console (Domain property, sitemap), Bing Webmaster import: create once, on the real domain (TECH-12).
- Merchant Center and the Google and YouTube channel connection.
- Any backlink, brand-mention or outreach baseline; CrUX and PageSpeed field baselines (the store is too new for field data, and the handle host has no history worth comparing).
- Instagram bio, Marketplace listing links and any printed or shared links: update once.
- Citations and directory listings (none apply as this is not a local business).
- Do **not** postpone: TECH-01 (policies), TECH-02 and TECH-03 (redirects and the `frontpage` unpublish), TECH-04, TECH-05, TECH-06. They are store content or theme changes with no host in them and they move with the domain.

## Summary (5 lines)
1. Technical score 74/100: HTTPS, canonicals (also `/collections/<c>/products/<p>`, variants and sort URLs), robots, sitemap and raw-vs-rendered parity are all correct.
2. Top 3: TECH-01 four policy pages 404 and shipping is "coming soon" (High); TECH-02 five deleted collections 404 with no redirect (Medium, add relative 301s); TECH-03 thin `/collections/frontpage` "Home page" is in the sitemap while `/collections/all` is not (Medium).
3. Also: empty `/blogs/news` in the menu and sitemap (TECH-04), related pens loaded from a robots-blocked endpoint so product pages link to no other pen in HTML (TECH-05), six pages without meta descriptions (TECH-06), no Search Console property (TECH-12, at domain switch).
4. Domain portability: no menu, page body, product description or theme setting contains the host; the only host links are Shopify's login link and the product share field, both dynamic. `markExternal()` is not in origin/main yet (TECH-13).
5. Could not check: Search Console, whether Google crawled the deleted handles, the handle-to-new-domain 301 (no custom domain yet), `sitemap_discovery.py` (not run, to protect the fetch budget), or HTTP status of `/search` result pages beyond one live sample.
