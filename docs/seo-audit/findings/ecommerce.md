# E-commerce findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt, `resolved=`) · Date: 2026-11-13 · Agent: ecommerce
Category score: 55/100. The product pages themselves are well made (unique titles and descriptions, alt text on every photo, valid minimal Product markup, clean canonicals). The score is held down by what is not there yet: shipping, return and refund policies, a Merchant Center path, product identifiers, a plan for the moment a pen sells, and crawlable links between pens.

Data sources: "On-page analysis (static)" from the saved crawl, plus 3 live requests (two filter URLs and one `?variant=` URL, all answered 200) and 1 image HEAD. "Web search" is Bing results fetched during this run. DataForSEO Merchant is not connected, so there is no marketplace price or seller-count data, and no pricing recommendation is made anywhere in this file.

Paths are cited, never hosts. Every fix below uses store data, relative paths or Shopify dynamic sources.

## What works
- All 8 pens answer 200 at `/products/<handle>`, each with its own canonical (`/products/date-seed-pen`, etc.). `?variant=` and collection filter and sort URLs canonicalize to the clean path (checked live).
- Titles and meta descriptions are set per pen and are unique. Example: `/products/date-seed-pen` is "Handmade Date Seed Pen, One of a Kind, Made in Vancouver", with a 160-character description built from facts on the page. One `<h1>` per page, equal to the product title.
- Descriptions are the maker's own words, 161 to 270 words each. No manufacturer copy-paste. Each lists material, hours of work and hardware.
- Image sets are 3 to 5 photos per pen (front, side, a scene, workshop shots), all with descriptive alt text and descriptive file names (`date-seed-pen-front.png`). The first image is a front shot that works for Merchant Center and og:image.
- Product JSON-LD (Shopify's `structured_data`, `sections/main-product.liquid:786-787`) has name, description, image, brand ("Pegasus Pens"), category, and an Offer with price, `priceCurrency: CAD`, availability and url. Price and currency match the visible page (for example `/products/date-seed-pen`: 180.00 CAD).
- BreadcrumbList JSON-LD on product pages (Home / type collection / pen), built from `request.origin`.
- Product cards on collection pages link to `/products/<handle>`, not the collection-scoped path, so there are no duplicate product URLs.
- No Review or AggregateRating markup anywhere: the placeholder reviews do not feed rich results (see ECOM-12).
- `robots.txt` already blocks `sort_by` URLs and multi-value filter combinations.

## Findings

### ECOM-01: Shipping, return and refund policies do not exist, and the shipping tab on every pen says "coming soon"
- Severity: High
- Evidence: `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-service` and `/policies/contact-information` all return 404 (index.tsv). Only `/policies/privacy-policy` is 200, and it is the only policy `/agents.md` lists under "Store Policies". `/pages/shipping-returns` is in the sitemap and says "Shipping and returns details are coming soon." The same sentence prints inside the "Shipping and returns" tab on each product page (rendered text of `/products/date-seed-pen`). `templates/product.json` (`shipping` block, `page: shipping-returns`) is the source.
- Why it matters: A buyer of a one-of-a-kind pen cannot learn the shipping cost or return terms before paying. Google's merchant listings and Shopify's Google and YouTube app expect shipping and return information (see ECOM-02). A visible "coming soon" on every product page also reads as unfinished. Shopify's own agent layer (`/agents.md`, UCP) answers policy questions from these policies, so it has nothing to say.
- Fix: Store content and a client decision. Create the refund, shipping, terms and contact-information policies in Shopify admin (Settings, Policies; the templates are a starting point). The client must supply the real facts: return window, who pays return shipping, shipping rate or free-shipping rule, handling time, and carriers. Do not invent them. Then fill `/pages/shipping-returns` with the same facts, or point the product tab at the policy. The theme already prints the policy links once they exist: the footer loops over `shop.policies` (`sections/footer.liquid:320`), and `main-product.liquid:134-144` links `shop.shipping_policy.url`. No theme change is needed.
- Depends on: none
- Domain switch: auto (policies are store data, linked by relative path)
- How we'd know it failed: `/policies/refund-policy` and `/policies/shipping-policy` still return 404, or the string "coming soon" is still in `/products/date-seed-pen`.
- Leading indicator: the footer policy list shows more than "Privacy policy". The Merchant Center "shipping and returns" checks (ECOM-02) turn green.

### ECOM-02: Google free listings / Merchant Center readiness: nothing is set up, and part of it can only happen at the domain switch
- Severity: High
- Evidence: Nothing on the storefront shows a Merchant Center link (not verifiable from the crawl: the account itself is out of reach). The root causes visible in the snapshot are ECOM-01 (no policies), ECOM-04 (no SKU or barcode), `category` in the JSON-LD is the free-text product type ("Date seed", "Hardwood") and not a Google category, and the host is the `*.myshopify.com` handle.
- Why it matters: Free product listings are a discovery channel that does not depend on ranking a brand-new site by text. It needs a verified and claimed domain, shipping and return settings, and a valid feed.
- Fix: Mostly manual, mostly at domain switch.
  1. At domain switch: add the custom domain as primary in Shopify, then connect Merchant Center through the Shopify Google and YouTube app, which handles feed sync, site verification and claiming for the primary domain. I could not verify against Google's current docs that a `myshopify.com` host cannot be claimed; check this when you do it. Until then there is nothing to submit.
  2. Before that, in Shopify admin: set each pen's Standard product category to the pens category in Shopify's taxonomy (store content, per pen), so the feed maps it to Google's. Make sure the product type and vendor are consistent (vendor is "Pegasus Pens" in the markup).
  3. Set shipping rates and a Canada-only shipping profile accurately in Shopify (the app reads them). Add the return policy in the Merchant Center settings once ECOM-01 is decided.
  4. Do not add shipping or return markup to the product template by hand. See ECOM-03.
  5. Handmade and one-of-a-kind goods do not need a GTIN. Use brand plus the "no unique identifier" route (see ECOM-04).
  6. Whether Merchant Center will ask for a business address or phone number for this store (the audit brief says there is none) is not verified. If it does, that is a client decision.
- Depends on: ECOM-01, ECOM-04
- Domain switch: manual (verification, claim, feed submission and the Search Console link all bind to the domain)
- How we'd know it failed: after the switch, Merchant Center shows the 8 products as "Disapproved" or "Not submitted" in Diagnostics, or the domain is "Not claimed".
- Leading indicator: Merchant Center, Products, Diagnostics shows 8 approved items and the "Free listings" program is "Active". The Search Console "Merchant listings" report appears.

### ECOM-03: Product JSON-LD is valid and minimal. The validator's three Medium results are really two settings, not markup work
- Severity: Medium
- Evidence: `schema_ecommerce_validate.py` run on the Product block saved from each of the 8 product pages (extracted from the crawl): PASS on all 8, 0 critical, 0 high, 3 medium and 1 info each, identical across pens: `missing-return-policy`, `missing-shipping-details`, `missing-member-program`, `no-product-group`. The block has `image` as a single URL (first photo only, 1920 px), no `sku`, no `gtin`/`mpn`, no `itemCondition`, no `priceValidUntil`. Availability is `http://schema.org/InStock` (Shopify's format).
- Why it matters: The block is what Google reads for the price and availability snippet and for merchant listing eligibility. The required fields are present. The missing recommended ones come from policy and settings (ECOM-01, ECOM-02, ECOM-04), not from the template.
- Fix: Do not add a second `Product` JSON-LD in the theme. Two Product blocks on one page conflict and Shopify's `structured_data` cannot be extended from Liquid. Fix the sources instead:
  - `missing-member-program` and `no-product-group`: not applicable. There is no loyalty program, and each pen has a single "Default Title" variant (no colour or size variants). Ignore.
  - `missing-return-policy` and `missing-shipping-details`: configure them in Merchant Center (ECOM-02). Google accepts account-level settings in place of per-product markup. Whether Shopify's block starts emitting `hasMerchantReturnPolicy` once a refund policy exists is not verified; re-run the validator after ECOM-01.
  - Optional, later, after the client's return terms exist: a `MerchantReturnPolicy` on the Organization block in `sections/header.liquid` (around line 471), built from `shop.refund_policy.url` and `request.origin`. It must state only the client's real terms.
  - Missing `sku`: see ECOM-04.
- Depends on: ECOM-01, ECOM-04
- Domain switch: auto (all URLs in the block come from Shopify's own filter)
- How we'd know it failed: re-run `schema_ecommerce_validate.py` on a saved product page after ECOM-01 and it still reports the same medium findings. Or the Rich Results Test or Search Console reports "Missing field" on Merchant listings for any pen.
- Leading indicator: Search Console, Enhancements, Merchant listings shows 8 valid items and 0 with warnings.

### ECOM-04: No SKU or barcode on any pen. Brand is set. The identifier route for handmade goods needs a deliberate choice
- Severity: Medium
- Evidence: The Product block on all 8 pens has `brand: {"@type":"Brand","name":"Pegasus Pens"}` and no `sku`, `gtin` or `mpn`. The product page's variant data has no SKU (the SKU block of `main-product.liquid` is hidden when empty, lines 234-240).
- Why it matters: Google wants either a GTIN, or brand plus MPN, or an explicit "no identifier" for custom-made products. Without a SKU the feed has no stable item id of its own, and a sold pen's record is hard to tell apart from a new one later.
- Fix: Store content. In Shopify admin, give each pen a short unique SKU (for example one derived from the handle). Leave the barcode empty, because these are handmade pieces that have no GTIN. In the Google and YouTube app, mark the products as having no unique product identifier, so the feed sends `identifier_exists = no`. Keep the vendor as "Pegasus Pens" on all 8: that is the brand Google reads. Do not invent a GTIN or buy one for one-off pens.
- Depends on: none
- Domain switch: auto (SKU is product data)
- How we'd know it failed: Merchant Center Diagnostics lists "Missing value [gtin]" or "Missing identifier" warnings for the pens, or the JSON-LD still has no `sku` after the change.
- Leading indicator: the Product block shows `"sku"` in a saved copy of any product page.

### ECOM-05: Sold-out lifecycle: each pen is stock 1 with overselling denied, and nothing is planned for the day it sells
- Severity: High
- Evidence: Per the brief and `CLAUDE.md`, every pen is stocked at 1 with overselling denied. In the theme, sold state is only Craft's default: a disabled "Sold out" button (`buy-buttons.liquid`), a "Sold out" badge on cards (`snippets/card-product.liquid` on origin/main, lines 136-142), and Shopify's own `availability` flipping to OutOfStock in the JSON-LD. There is no explanatory text, no link to similar pens, and no commission or contact prompt on a sold pen. The product page's related products are client-side only (ECOM-06). All 8 products are in `/sitemap_products_1.xml`, and Shopify keeps unavailable products in the sitemap. I could not observe a sold-out page because every pen is in stock now; this is derived from the theme code and from how Shopify behaves.
- Why it matters: All 8 URLs will reach this state, one by one, and the pen cannot be restocked: it is a different object each time. The decision decides whether the page earns or wastes what it has collected (links, indexing, a Merchant listing).
- Fix: Recommended: **keep each sold pen live as a sold page and make it useful.** Reasoning for each option:

| Option | What happens | When it is right | Why not as the default |
|---|---|---|---|
| Keep live, mark sold (recommended) | 200, Shopify emits `OutOfStock`, the page keeps its index entry, links and images. Google treats out-of-stock product pages as valid pages when the markup says so. | A page that has real content (maker's 160 to 270 words, 3 to 5 photos), which a sold handmade piece does. It works as a portfolio and as proof of craft, and it can lead to the next pen or a commission. | It will become dead weight if the catalog grows to dozens of sold pens with no sibling links. That is the review trigger, see below. |
| 301 redirect to the closest collection | The URL disappears from search once Google recrawls it; link signals pass on. | Only when the target is a close topical match with stock. Here a collection like Date seed has 1 pen, so it would be empty or a soft 404 right after the redirect. Never redirect to the home page. | Hides the one thing that proves the pen existed, and a buyer arriving from an old link or a Merchant listing lands somewhere else. |
| Remove (draft, archive or delete: 404) | Shopify cannot return 410; the URL is a 404 and signals are lost. | Test or duplicate products only (like `rose-resin-pen`, already a 404). | Loses a page with unique content and any links to it. |

  Do the following (theme work, only for pens that are sold):
  1. A new snippet `snippets/pegasus-sold-note.liquid`, rendered from `sections/main-product.liquid` only when `product.available` is false. It must live in a snippet because `main-product.liquid` is at theme-check's LiquidComplexity limit of 120 (see `CLAUDE.md`). It shows a plain sentence ("This pen has found its owner" or similar, wording is the client's), the pens still available in the same type, and a link to the contact page. Build the links with `routes`, not typed paths:

```liquid
{%- liquid
  assign kin = collections[product.type | handleize]
-%}
{%- for p in kin.products limit: 8 -%}
  {%- if p.available and p.id != product.id -%}
    <a href="{{ p.url }}">{{ p.title | escape }}</a>
  {%- endif -%}
{%- endfor -%}
<a href="{{ routes.all_products_collection_url }}">{{ 'products.sold_note.see_all' | t }}</a>
```

  (A new `t:` key must be added to every `locales/*.json`, per `CLAUDE.md`; the contact link can be a `shopify://pages/contact` setting.) The same type-collection lookup is already used by `sections/pegasus-breadcrumbs.liquid`, so the pattern is known to work in this theme.
  2. Keep the pen indexable. Do not add `noindex`. Keep it in collections but move sold pens to the end: set the collection sort to show out-of-stock products last (in the Search & Discovery app settings; the exact label is not verified here).
  3. Review point, a decision for the owner: when sold pens outnumber available ones, or a sold page has had no impressions for a long period (measure in Search Console after the domain switch), redirect that URL (Shopify admin, Navigation, URL redirects, relative path to relative path, so it survives the domain switch) to the closest collection that still has stock. Do not delete.
  4. A "make me one like it" or commission invitation is only a copy and business decision for the client. The theme has no support for it today.
- Depends on: ECOM-06 (similar-pen links must be server-rendered)
- Domain switch: auto for the markup, the redirect and the sitemap (all relative or dynamic). Merchant Center item status is manual, after ECOM-02.
- How we'd know it failed: After the first sale, `/products/<handle>` returns anything but 200, or the saved page has no link to another pen in its raw HTML, or its JSON-LD still says `InStock`, or it shows "Add to cart" as clickable.
- Leading indicator: Search Console, Pages: a sold pen stays "Indexed" and not "Soft 404" or "Crawled, not indexed". Impressions for that URL do not drop to zero within a few weeks of the sale.

### ECOM-06: "You may also like" is loaded by JavaScript from a URL that robots.txt blocks, so there are no pen-to-pen links in the crawlable HTML of a product page
- Severity: Medium
- Evidence: Raw HTML of `/products/date-seed-pen`: `<product-recommendations ... data-url="/recommendations/products?limit=4" ...>` is empty. `robots.txt` has `Disallow: /recommendations/products`. The section is configured in `templates/product.json` (`related-products`, `products_to_show: 4`). The Playwright render shows pens in a browser, but a crawler that obeys robots.txt cannot fetch the fragment.
- Why it matters: Product pages are linked only from the home page, the collections, the sitemap and the search panel. Sibling links on each pen page help discovery and let link signals flow between pens, and they become essential once a pen is sold (ECOM-05).
- Fix: Theme. Render the sibling links in Liquid at request time, using the type collection as in ECOM-05 (`collections[product.type | handleize].products`), either in the same new snippet or as a server-rendered block before the client-side one. Keep the existing recommendations section if wanted, but do not rely on it. Note that Shopify's own recommendation algorithm may also show sold pens; check once a pen has sold.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: `curl` the raw HTML of any `/products/<handle>` and count `href="/products/` occurrences outside the header and search panel: there should be links to at least 3 other pens.
- Leading indicator: Search Console, Links, Internal links: each product page has a count above 1 from other product pages.

### ECOM-07: Closing paragraphs of the descriptions repeat across pens
- Severity: Medium
- Evidence: Compared sentence by sentence across the 8 descriptions in the JSON-LD. The same sentence appears on 4 pens (maple, olive, six hardwoods, walnut): "Whether you're shopping for family, friends, a partner, a colleague, a teacher, a client, or simply treating yourself, this pen is a meaningful gift..." and the same "More than an everyday writing instrument, it's a small piece of a lifelong craftsman's work, made to be used, appreciated and treasured." "One-of-a-kind creation, with only one available" is on 3. The openers "Looking for a gift that is genuinely one of a kind?" and "...that's genuinely one of a kind?" start 4 pens. The opening and detail sections are otherwise unique (this is the strength; the repetition is only the tail).
- Why it matters: Near-duplicate blocks across sibling pages weaken each page's distinct signal, and in a catalog of eight they make the pages feel templated. In shopping surfaces, a description that differs per item matters more than length.
- Fix: Store content, a client task. Rewrite the shared closing paragraph per pen, using that pen's own story (the plum branch pen already does this). Keep the facts that differ: materials, hours, hardware. Do not add claims the client has not confirmed. Related keyword note: in Bing results for "date pit pen" and "pen made from date seeds", sellers use both "date pit" and "date seed". Using "date pit" once in the date seed pen's text would match the other phrase. Treat it as an optional wording choice, since only the client knows which term is right.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: a sentence-level comparison of descriptions still finds the same 20-word sentence on 3 or more pens.
- Leading indicator: Search Console, Performance: each pen collects its own distinct queries and no two pens compete for the same query.

### ECOM-08: Collection pages: thin, near-duplicate, with generic titles
- Severity: Medium
- Evidence:
  - `/collections/leather` and `/collections/date-seed` each hold 1 pen, so each page is the product page plus a one-line description (collection descriptions are one sentence: "Layers of genuine Canadian leather, compressed and shaped by hand. The leather becomes the pen.").
  - `/collections/gifts` holds the same 8 pens as `/collections/all` (all 8 are tagged `gift`).
  - `/collections/hardwood` (4 pens) and `/collections/segmented-wood` (2) are sensible groupings.
  - Titles are the bare collection name plus the shop name ("Hardwood – Pegasus Pens", "Leather – Pegasus Pens"). The visible `<h1>` reads "Collection: Hardwood" (`sections/main-collection-banner.liquid:33`, the "Collection: " prefix is `visually-hidden`, so sighted users see only the name).
  - `/collections/all`: title "Products – Pegasus Pens", no meta description, H1 "Collection: Products".
  - `/collections` (index) and the home page share the meta description "Handcrafted luxury pens".
  - `/collections/frontpage`: title "Home page", no description, in the sitemap, 1 pen. See ECOM-09.
- Why it matters: Category pages are where "wooden pen" or "leather pen" queries land. With one pen per page, the page offers no more than the product page does and the two compete for the same query. Generic titles throw away the keyword that a category page can carry.
- Fix: Store content (Shopify admin, Collections, each collection's "Search engine listing" and description). Give each material collection an SEO title that says what it is, for example "Handmade Hardwood Pens, Made in Vancouver", and 60 to 120 words of description about the material and how the pens are made (the client's own words, from the pen documents). For `leather` and `date-seed`, either write enough unique material text to be worth a page, or, if that is not wanted, set the collection to be hidden from search engines through the theme and keep the product page as the target. For `/collections/all`, the title and description cannot be edited as a normal collection in the admin. Verify whether creating a collection with the handle `all` overrides it; otherwise set a fallback in `layout/theme.liquid` (the `<title>` and description at lines 20-29) for `collection.handle == 'all'`, with the text as a `t:` string. "Luxury" in the shared description is a claim the client should confirm.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: a saved `/collections/hardwood` still has `<title>` equal to the collection name plus the shop name, or `/collections/all` still has no meta description.
- Leading indicator: Search Console: collection URLs appear for queries such as "handmade wooden pen" rather than only for the brand name.

### ECOM-09: `/collections/frontpage` ("Home page") is public, in the sitemap and has no purpose
- Severity: Low
- Evidence: `/collections/frontpage` returns 200, is listed in `/sitemap_collections_1.xml`, has the title "Home page", no meta description, and 1 pen (the brief confirms it is Shopify's default collection, still published).
- Why it matters: It is a crawlable duplicate-ish page with a name that matches nothing a buyer searches for, and it dilutes the sitemap.
- Fix: Store content. In Shopify admin, Collections, unpublish "Home page" (or delete it) after confirming no section reads it (`templates/index.json` uses the four material collections and `gifts`, not `frontpage`). Unpublishing returns a 404 and drops it from the sitemap. The 404-without-redirect handling for the five deleted collections is covered by the technical agent.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: `/collections/frontpage` still returns 200 after the change, or is still in `/sitemap_collections_1.xml`.
- Leading indicator: the sitemap's collection list shows 5 entries (hardwood, segmented-wood, leather, date-seed, gifts).

### ECOM-10: Filter and sort parameters are handled correctly (Info)
- Severity: Info
- Evidence: Live requests: `/collections/hardwood?filter.v.availability=1&sort_by=price-ascending` and `/collections/hardwood?filter.v.price.gte=90` both answer 200 with `<link rel="canonical">` pointing to `/collections/hardwood`, and no robots meta. `robots.txt` disallows `/collections/*sort_by*` and `/collections/*filter*&*filter*`. A single filter URL is crawlable but canonicalized (`snippets/meta-tags.liquid` uses `canonical_url`). Filters available are Availability and Price only; with 1 to 4 pens per collection they have little use.
- Why it matters: Faceted URLs are the usual source of duplicate and wasted crawl. Here they are already contained.
- Fix: None. When the catalog grows past about 30 pens (per `CLAUDE.md`), add Material and Ink colour filters in the Search & Discovery app and re-check that the canonical stays clean.
- Depends on: none
- Domain switch: auto (`canonical_url`)
- How we'd know it failed: a filtered URL returns a canonical that includes its parameters, or a Search Console "Duplicate, Google chose different canonical" entry appears for filtered URLs.
- Leading indicator: Search Console, Pages: no URL with `filter.` or `sort_by` in the indexed list.

### ECOM-11: Image details: one photo in each machine-readable surface, a 1 MB PNG as the lead image, and an `http:` og:image
- Severity: Low
- Evidence: The Product JSON-LD `image` is one URL (the front photo at `&width=1920`; `HEAD` of `/cdn/shop/files/date-seed-pen-front.png?...&width=1920` returned `content-type: image/png`, `content-length: 1053680`, `vary: Accept`). `/sitemap_products_1.xml` lists only the first image per product. `snippets/meta-tags.liquid:29` writes `<meta property="og:image" content="http:{{ page_image | image_url }}">` (with `secure_url` on the next line). `/products/plum-wood-persian-khatam-pen` has 3 photos where the other 7 have 4 or 5 (no side view). In the gallery all images carry alt text 46 to 118 characters long.
- Why it matters: Shopify serves WebP to browsers that accept it, so the PNG size matters only to a client that does not send an Accept header with WebP. Google gets multiple images through the Merchant Center feed, so the single image in markup is not a problem. The `http:` og:image is harmless (a `secure_url` follows) but untidy.
- Fix: Optional and low priority. The performance agent covers image weight. If the og:image line is touched, change `http:` to `https:` in `snippets/meta-tags.liquid:29`, which keeps the host dynamic. Ask the client for a side photo of the plum pen when convenient.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: `og:image` on a product page does not start with `https://`, or Merchant Center reports "Image too small" or "Image link broken" for any pen.
- Leading indicator: Merchant Center Diagnostics shows no image warnings.

### ECOM-12: Placeholder reviews on every product page (risk reported once, factually)
- Severity: Medium
- Evidence: `/products/date-seed-pen` renders three reviews by "Maya R., Vancouver", "Tomás A., Lisbon" and "Priya S., Leeds" under "Kind words" (`templates/product.json`, `reviews` section; the home page has the same). Their `rating` is 0 in the template, so no stars show, and the crawl has no `Review`, `AggregateRating` or `reviewCount` in any JSON-LD. The owner chose on 2026-11-13 to keep them for now.
- Why it matters: They are presented as customer words but are not from customers, and none of the pens has sold yet. This is a trust and credibility risk for visitors. Google's review policies apply only if Review markup is added: nothing is marked up today, so there is no rich-result penalty exposure now. The Competition Bureau (Canada) treats fake reviews presented as real as a deceptive marketing practice. This is a legal question for the owner, and not a legal conclusion here.
- Fix: Content and client decision. Replace them with real customer words after the first sales, or remove or relabel them until then. Never add `Review` or `AggregateRating` markup for them.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the names "Maya R.", "Tomás A." or "Priya S." are still in the HTML after the first real order, or any `Review` JSON-LD appears that cites them.
- Leading indicator: the review section lists only people who bought.

### ECOM-13: Unconfirmed claims on every product page: "Refillable"
- Severity: Low
- Evidence: The `facts` block in `templates/product.json` prints "Refillable" on all 8 pens, and the anatomy section says "Swap the refill when the ink runs out." The pen documents only say that two pens (date seed and leather) come with "a refill insert and a decorative dust bag". Per `CLAUDE.md`, "twist" and "refillable" were read from the photos and still need the owner's confirmation. The Care text is also unconfirmed.
- Why it matters: A statement about the product that is wrong is a trust and returns problem, and Merchant Center can disapprove a listing whose page contradicts the feed.
- Fix: Client decision. Confirm that all 8 pens are refillable, then keep the text. Otherwise change the `facts` block text in the theme editor (it is a setting in `templates/product.json`, so it follows the merchant).
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the client names a pen that is not refillable while the page still says "Refillable".
- Leading indicator: the client's sign-off on the copy list.

### ECOM-14: Shopify's agentic commerce layer: it reads the same product data, so it has the same gaps (Info)
- Severity: Info
- Evidence: `/.well-known/ucp` (200) advertises a UCP profile with `catalog.search`, `catalog.lookup`, cart, checkout, order and fulfillment capabilities, an MCP endpoint at `/api/ucp/mcp`, and Google Pay, Shopify card and Shop Pay handlers. `/agents.md` (200, in `/sitemap_agentic_discovery.xml`) tells agents to use that endpoint, to read `/products/{handle}`, `/collections/{handle}` and `/sitemap.xml`, and lists the store policies: only the privacy policy. `robots.txt` repeats the pointers and also asks an agent acting for a user to recommend installing a Shop skill. That is page content addressed to AI agents and is not acted on; it is mentioned here only because it is part of the surface. It is not something the owner or this audit should install.
- Why it matters: This layer only affects product discovery as far as agents and AI shopping assistants search the catalog. They draw from the same title, description, price, availability, images, variants and policies as the storefront, so everything in ECOM-01 (no policies), ECOM-04 (no SKU) and ECOM-07 (repeated copy) applies to them too. An agent asked "does this ship to Ontario and can I return it" has no policy to quote. A sold pen reports as unavailable through the same data, which fits ECOM-05.
- Fix: No theme change. Fix the product and policy data first. Check in the Shopify admin (sales channels or the agentic storefronts and Shop settings) whether the store's catalog is opted in or out of agent surfaces, and decide deliberately; whether it is on by default for this store is not verifiable from the crawl.
- Depends on: ECOM-01, ECOM-04
- Domain switch: auto (all endpoints are on the store's own host as written by Shopify; the Google Pay `merchant_origin` follows the store host; confirm after the switch that `/.well-known/ucp` shows the new host)
- How we'd know it failed: after the policies exist, `/agents.md` still lists only the privacy policy, or `/.well-known/ucp` still shows the handle host after the domain switch.
- Leading indicator: `/agents.md` "Store Policies" lists refund and shipping policies.

### ECOM-15: Marketplace context from web search (Info)
- Severity: Info
- Evidence (web search, Bing, 2026-11-13; not personalised, and results vary by day):
  - "handmade wooden pen Canada": Amazon.ca, Etsy Canada category pages, and independent Canadian pen makers' own sites (theartisanpensmith.ca, aerowoodcraft.ca, turningshop.ca), plus a Canadian gift retailer (boutiqueboreale.com).
  - "handmade segmented wood pen": Etsy category pages, independent maker sites (mikeswoodwork.net, woodworksbytim.com), YouTube how-to videos and Amazon.ca.
  - "persian khatam pen": Persian-art retailers (persiscollection.com, persianarthouse.com, shopiranart.com), Etsy, 1stDibs, eBay, and Wikipedia's Khatam article.
  - "date seed pen handmade": results are dominated by **plantable seed-paper pens** (a different product), Facebook Marketplace and Etsy. The query "date pit pen handmade" returns Etsy category pages (`date_pen`, `date_pit`), eBay, an Instagram account, and the same independent site theartisanpensmith.ca.
- Why it matters: Etsy category pages and Amazon take most first-page space for the generic queries. For the specific materials (date pit, Khatam inlay, layered leather) the competition is thin, and it is a mix of marketplaces, Persian-art retailers and a handful of independent makers. The name "date seed pen" collides with the seed-paper pen category, so that title attracts the wrong intent without a qualifier such as "handmade" or "wood-like". The title on `/products/date-seed-pen` already has "Handmade" and "One of a Kind".
- Fix: No pricing recommendation (none is made). Content direction only: lean on the specific, hard-to-copy details already in the descriptions (Khatam inlay, the North Vancouver plum branch, 30 hours of work). DataForSEO Merchant, which would give real seller and price data, is not connected; this section is anecdotal and cannot be checked further here.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: n/a (context only)
- Leading indicator: Search Console queries for "persian khatam pen" or "handmade leather pen canada" begin to show impressions.

## Not checked
- A sold-out page was not observed (all 8 pens are in stock); ECOM-05 is derived from the theme and Shopify behaviour.
- Merchant Center, the Google and YouTube app and the Shopify admin settings (shipping profiles, category, agentic storefront opt-in) are not reachable from the crawl.
- DataForSEO is not connected: no marketplace price, seller count or keyword volume.
- Home page JSON-LD `Organization.sameAs` contains empty strings (seen in the saved pages); it belongs to the schema agent and is noted here only as a hand-off.
