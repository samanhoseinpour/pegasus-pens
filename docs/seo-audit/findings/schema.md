# Structured data findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt) · Date: 2026-11-13 · Agent: schema
Category score: 68/100. The Product and Breadcrumb markup is valid and the placeholder review wall emits no review markup, but Organization is sloppy, Product has no identifiers or shipping and return data, and collections and content pages carry nothing but Organization.

Method: all 43 saved pages were parsed for JSON-LD, Microdata and RDFa. There are 0 Microdata or RDFa items anywhere. Every JSON-LD block parsed as valid JSON. Cited theme code is `origin/main`. The Liquid snippets below were written against Shopify's documented filters and have **not** been run on the real engine: render them with `shopify theme dev` and check with the Rich Results Test before pushing.

## What works
- **No Review or AggregateRating markup anywhere** (0 matches for `aggregateRating`, `Review`, `reviewRating`, `ratingValue`, `itemprop` across all saved pages). The review wall (`sections/pegasus-review-wall.liquid`) renders stars as plain `<p role="img" aria-label="N / 5">` and emits no JSON-LD. The placeholder reviews (Maya R., Tomás A., Priya S.) are therefore **not** a structured-data policy problem today. See SCH-01 for the guard that keeps it that way.
- All 8 live product pages (`/products/*`) carry a valid `Product` + `Offer` block from Shopify's `product | structured_data` (`sections/main-product.liquid:786`): `name`, `description`, `image`, `brand`, `offers.price` (e.g. `"180.00"` on `/products/date-seed-pen`), `priceCurrency: "CAD"`, `availability: InStock`, an absolute offer `url`. This meets Google's product snippet minimum (name plus offer with price and currency).
- `BreadcrumbList` on all 8 product pages (`sections/pegasus-breadcrumbs.liquid:57`): Home, collection, pen. It uses `request.origin` and `routes.root_url`, and the last item has no URL, which Google allows. Collection names resolve correctly (e.g. Hardwood, Segmented wood).
- Organization and WebSite are built from `shop.name`, `request.origin` and the `settings.social_*` links. No literal host in theme code.
- No duplicate Product blocks (`featured-product.liquid:498` also prints one, but that section is not on any template today).
- The draft `/products/rose-resin-pen` and the 404 probes carry no Product markup, only the generic Organization block.

## Findings

### SCH-01: Keep review markup off until real reviews exist
- Severity: Info
- Evidence: `grep` of all 43 saved pages finds no `aggregateRating`, `Review` or `ratingValue`. `sections/pegasus-review-wall.liquid:51-53` prints stars only as `role="img" aria-label`. Shopify's `structured_data` filter adds `aggregateRating` only when the `reviews.rating` product metafield is set; none is set (not in the Product blocks).
- Why it matters: Review or AggregateRating markup built on invented testimonials breaks Google's review snippet policies (self-serving and fabricated reviews; manual action risk) and Canadian deceptive-marketing rules. Today there is no such markup, so nothing is flagged.
- Fix: do not add any. Guard rails for later: (1) never fill the `reviews.rating` / `reviews.rating_count` metafields from the placeholders; (2) if a reviews app is installed, check that it does not emit `aggregateRating` for the 3 placeholders; (3) markup only for reviews real customers wrote on that product. Report the trust and E-E-A-T risk of the placeholders themselves in the content findings, not here.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: Rich Results Test on `/products/date-seed-pen` shows a "Review snippets" or `aggregateRating` item, or `view-source` contains `"ratingValue"`.
- Leading indicator: Search Console, Enhancements, "Review snippets" appears (it should never exist while reviews are placeholders).

### SCH-02: Organization `sameAs` contains 8 empty strings
- Severity: Medium
- Evidence: every page, e.g. `/` and `/products/date-seed-pen`: `"sameAs": ["","","","https://www.instagram.com/pegasus.pens/","","","","",""]`. Source `sections/header.liquid:471-490` (origin/main) prints all nine `settings.social_*_link` values, blank or not.
- Why it matters: empty strings are invalid `sameAs` URLs. Google ignores them but validators warn, and it is the one field that ties the brand to its Instagram profile.
- Fix: build the array from non-blank links only (snippet under SCH-04, which replaces the whole block). Theme file `sections/header.liquid`.
- Depends on: SCH-04 (same block)
- Domain switch: n/a (Instagram URL is a theme setting, not host-bound)
- How we'd know it failed: `view-source` JSON-LD still shows `""` entries; Rich Results Test or validator.schema.org warns on `sameAs`.
- Leading indicator: validator.schema.org shows 0 warnings for the home page.

### SCH-03: Organization `url` changes per page and points at content pages
- Severity: Medium
- Evidence: Organization `url` is `https://rjxgij-f1.myshopify.com` on `/`, `/collections/*`, `/products/*` and `/blogs/news`, but `https://rjxgij-f1.myshopify.com/pages/about` on `/pages/about` (also `/pages/care`, `/pages/contact`, `/pages/shipping-returns`). Source: `"url": {{ request.origin | append: page.url | json }}` in `sections/header.liquid:488`. `page.url` is empty outside page templates and the page's own path on them. WebSite uses the same expression (`:501`).
- Why it matters: the Organization entity should have one stable identifier and URL. Four different "company home pages" make entity consolidation harder and are wrong on their face.
- Fix: use the root and an `@id` (snippet under SCH-04). `request.origin | append: routes.root_url` follows the domain switch on its own.
- Depends on: SCH-04
- Domain switch: auto
- How we'd know it failed: the Organization `url` on `/pages/about` is not equal to the one on `/`.
- Leading indicator: one Organization `@id` across all pages in a validator crawl.

### SCH-04: Organization has no `logo` (the wordmark's emblem is not exposed)
- Severity: Medium
- Evidence: no page has `"logo"`. The block only prints it `{% if settings.logo %}` (`sections/header.liquid:476`); `settings.logo` is empty because the header uses `snippets/pegasus-wordmark.liquid` with `assets/pegasus-emblem.png` instead. Same on every page.
- Why it matters: Google's logo guideline needs a crawlable image of at least 112 x 112 px; without it the brand cannot show a logo in results or the knowledge panel. The emblem exists as a theme asset, so this costs nothing.
- Fix: replace the two blocks in `sections/header.liquid` (origin/main lines 471-505; apply the edit on top of the unpushed working copy, do not copy the file) with the following. `split: '//' | last | prepend: 'https://'` makes the image URL absolute whether Shopify returns a protocol-relative or an https URL.

```liquid
{%- liquid
  assign pg_root = request.origin | append: routes.root_url
  if settings.logo != blank
    assign pg_logo = settings.logo | image_url: width: 500
  else
    assign pg_logo = 'pegasus-emblem.png' | asset_url
  endif
  assign pg_logo = pg_logo | split: '//' | last | prepend: 'https://'

  assign pg_raw = settings.social_twitter_link | append: '|' | append: settings.social_facebook_link | append: '|' | append: settings.social_pinterest_link | append: '|' | append: settings.social_instagram_link | append: '|' | append: settings.social_tiktok_link | append: '|' | append: settings.social_tumblr_link | append: '|' | append: settings.social_snapchat_link | append: '|' | append: settings.social_youtube_link | append: '|' | append: settings.social_vimeo_link
  assign pg_kept = ''
  for pg_link in pg_raw | split: '|'
    if pg_link != blank
      assign pg_kept = pg_kept | append: pg_link | append: '|'
    endif
  endfor
  assign pg_same_as = pg_kept | split: '|'
  assign pg_search_target = request.origin | append: routes.search_url | append: '?q={search_term_string}'
-%}
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": {{ pg_root | append: '#organization' | json }},
    "name": {{ shop.name | json }},
    "url": {{ pg_root | json }},
    "logo": {{ pg_logo | json }}
    {%- if pg_same_as.size > 0 -%}
    ,"sameAs": {{ pg_same_as | json }}
    {%- endif -%}
  }
</script>

{%- if request.page_type == 'index' -%}
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": {{ pg_root | append: '#website' | json }},
      "name": {{ shop.name | json }},
      "url": {{ pg_root | json }},
      "publisher": { "@id": {{ pg_root | append: '#organization' | json }} },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {{ pg_search_target | json }},
        "query-input": "required name=search_term_string"
      }
    }
  </script>
{%- endif -%}
```
  The search target is assigned inside the `{% liquid %}` tag first because a `}` inside a `{{ }}` output breaks Shopify's import (CLAUDE.md).
- Depends on: none
- Domain switch: auto (`request.origin`, `routes.*`, `asset_url`)
- How we'd know it failed: Rich Results Test, "Logo" item missing or the image URL returns non-200; `"url"` not equal on `/` and `/pages/about`.
- Leading indicator: validator.schema.org shows Organization with `logo` and a single `@id`.

### SCH-05: Product has no `sku`, `mpn` or `gtin`
- Severity: Medium
- Evidence: the Product block on every product page (e.g. `/products/date-seed-pen`) has keys `@id, @type, brand, category, description, image, name, offers, url` only. Shopify's filter emits `sku` only when the variant has one; the variants have none.
- Why it matters: Google merchant listings recommend an identifier (GTIN, MPN or SKU) to match the item; hand-made pens have no GTIN, but a SKU is free and also needed for Merchant Center and order handling.
- Fix: store content, Shopify admin: set a SKU on each of the 8 variants (for example the handle). No theme change is needed; the filter and the SCH-08 snippet both print it.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: Product JSON-LD still has no `"sku"` key.
- Leading indicator: Search Console, Merchant listings, "Missing field: sku/gtin" count (after domain switch and property setup).

### SCH-06: Product has no shipping or return data, and the policies do not exist yet
- Severity: Medium
- Evidence: no `shippingDetails` or `hasMerchantReturnPolicy` in any Offer. `/policies/refund-policy` and `/policies/shipping-policy` return 404 (`index.tsv`), and `/pages/shipping-returns` still says "coming soon".
- Why it matters: Google's merchant listing experience reads these properties (or the Merchant Center feed) to show shipping cost and return terms; they also reassure buyers on a brand-new store. Writing them before the terms exist would be inventing facts.
- Fix: client decision first: shipping cost and handling and transit time inside Canada, return window and who pays. Then set the policies in Shopify admin (Settings, Policies) and the page. Add `shippingDetails` and `hasMerchantReturnPolicy` to the Offer (extend the SCH-08 snippet) with the client's real numbers, or supply them in Google Merchant Center instead (a manual step at domain switch, because the site URL is claimed there). Do not invent values.
- Depends on: SCH-08 (if done in markup); client decision
- Domain switch: manual (Merchant Center site claim)
- How we'd know it failed: Rich Results Test, Merchant listings tab, shows "shippingDetails" and "hasMerchantReturnPolicy" as recommended-missing after the policies are live.
- Leading indicator: `/policies/shipping-policy` and `/policies/refund-policy` answer 200.

### SCH-07: Product markup: only one image, no `itemCondition`, relative `@id`
- Severity: Low
- Evidence: `/products/date-seed-pen`: `"image": "https://rjxgij-f1.myshopify.com/cdn/shop/files/date-seed-pen-front.png?v=...&width=1920"` (a single string; the page has several photos). `"@id": "/products/date-seed-pen#product"` is a relative IRI, and the Offer `@id` is `/products/date-seed-pen?variant=...#offer`. No `itemCondition`. `@context` is `http://schema.org/` (Shopify's filter output).
- Why it matters: Google recommends several images in different ratios; `itemCondition` is recommended for merchant listings. A relative `@id` resolves against the page and is valid but needless. None of this blocks eligibility.
- Fix: optional. If the owner wants it, replace line 786-788 of `sections/main-product.liquid` with the snippet below, kept in a new `snippets/pegasus-product-jsonld.liquid` (that file sits near theme-check's LiquidComplexity limit, per CLAUDE.md, so do not inline it). It handles the single-variant pens; if variants are ever added, loop `product.variants` into an `offers` array.

```liquid
{%- liquid
  assign pg_v = product.selected_or_first_available_variant
  assign pg_url = request.origin | append: product.url
  assign pg_root = request.origin | append: routes.root_url
-%}
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": {{ pg_url | append: '#product' | json }},
    "url": {{ pg_url | json }},
    "name": {{ product.title | json }},
    "description": {{ product.description | strip_html | strip_newlines | truncate: 5000 | json }},
    "image": [
      {%- for image in product.images limit: 6 -%}
        {{ image | image_url: width: 1920 | split: '//' | last | prepend: 'https://' | json }}{% unless forloop.last %},{% endunless %}
      {%- endfor -%}
    ],
    {%- if pg_v.sku != blank -%}"sku": {{ pg_v.sku | json }},{%- endif -%}
    {%- if product.type != blank -%}"category": {{ product.type | json }},{%- endif -%}
    "brand": { "@type": "Brand", "name": {{ product.vendor | default: shop.name | json }} },
    "itemCondition": "https://schema.org/NewCondition",
    "offers": {
      "@type": "Offer",
      "@id": {{ pg_url | append: '?variant=' | append: pg_v.id | append: '#offer' | json }},
      "url": {{ pg_url | append: '?variant=' | append: pg_v.id | json }},
      "price": {{ pg_v.price | divided_by: 100.0 | json }},
      "priceCurrency": {{ cart.currency.iso_code | json }},
      "itemCondition": "https://schema.org/NewCondition",
      "availability": {% if pg_v.available %}"https://schema.org/InStock"{% else %}"https://schema.org/OutOfStock"{% endif %},
      "seller": { "@id": {{ pg_root | append: '#organization' | json }} }
    }
  }
</script>
```
  The `seller` reference needs the SCH-04 Organization `@id` to exist on the same page (it does, the header prints it). The snippet is untested on Shopify's engine; verify `price` prints a number such as `180.0`. If the owner would rather not maintain custom markup, leave the filter in place: it is valid today and Shopify keeps it current.
- Depends on: SCH-04, SCH-05
- Domain switch: auto
- How we'd know it failed: Rich Results Test shows `Product` with a single image, or a parse error after the swap; two Product blocks on one page (duplicate).
- Leading indicator: Rich Results Test, "Merchant listings" detected with 0 critical and 0 recommended-missing for `image`, `itemCondition`.

### SCH-08: Every pen goes OutOfStock after one sale; the markup must follow, the URL must stay 200
- Severity: Info
- Evidence: every pen is stocked at 1 with overselling denied (brief). The `structured_data` filter derives `availability` from the variant, so it switches to `OutOfStock` by itself; the snippet in SCH-07 does the same with `pg_v.available`.
- Why it matters: a sold-out pen that returns 404 or a soft error loses the page and its links, while one-of-a-kind items can keep their URL as a record of work ("sold") and a lead for similar pens. Wrong in-stock markup on a sold item is a merchant listing violation.
- Fix: keep sold pens at 200 with `OutOfStock` (no code change needed); do not delete sold products, archive nothing. Wording of the sold state and "similar pens" belong to the content and technical agents.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: after a test purchase, the product's Offer still shows `InStock`, or the page returns non-200.
- Leading indicator: Search Console "Merchant listings: invalid items" for availability.

### SCH-09: Collection pages carry no BreadcrumbList or CollectionPage markup
- Severity: Low
- Evidence: `/collections/hardwood` has exactly one JSON-LD block (the generic Organization). `templates/collection.json` (origin/main) has no `pegasus-breadcrumbs` section, although `CLAUDE.md` says the breadcrumbs serve product and collection pages; only `templates/product.json` uses it.
- Why it matters: collections are the category pages the home page and the sitemap lead with; a breadcrumb gives Google the Home / category trail, and `CollectionPage` states the page type. No rich result is promised for either on a store this small.
- Fix: add a JSON-LD-only block to `sections/main-collection-product-grid.liquid` (no visible change, so the design needs no decision). Skip `ItemList` of products: it has no supported rich result.

```liquid
{%- liquid
  assign pg_root = request.origin | append: routes.root_url
  assign pg_coll_url = request.origin | append: collection.url
-%}
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": {{ pg_coll_url | append: '#collection' | json }},
        "url": {{ pg_coll_url | json }},
        "name": {{ collection.title | json }},
        {%- if collection.description != blank -%}
        "description": {{ collection.description | strip_html | strip_newlines | truncate: 300 | json }},
        {%- endif -%}
        "isPartOf": { "@id": {{ pg_root | append: '#website' | json }} }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": {{ pg_root | json }} },
          { "@type": "ListItem", "position": 2, "name": {{ collection.title | json }} }
        ]
      }
    ]
  }
</script>
```
  The WebSite `@id` it references is printed only on the home page (SCH-04), so either drop `isPartOf` or print the WebSite block on every page; dropping it is the lazy option. The word "Home" duplicates the `pegasus-breadcrumbs` setting default; if the owner renames it there, change it here too.
- Depends on: SCH-04 (only if `isPartOf` is kept)
- Domain switch: auto
- How we'd know it failed: Rich Results Test on `/collections/hardwood` finds no Breadcrumbs item.
- Leading indicator: Search Console, Enhancements, "Breadcrumbs" valid-item count rises by the number of collections (5 plus `all`).

### SCH-10: Content pages and the blog have no page-level markup; no founder or contact data is exposed
- Severity: Low
- Evidence: `/pages/about`, `/pages/care`, `/pages/contact`, `/pages/shipping-returns` and `/blogs/news` each carry only the Organization block. The blog is empty (no articles), so `sections/main-article.liquid:291` (`{{ article | structured_data }}`, valid Shopify Article markup) has not run yet.
- Why it matters: `AboutPage`/`ContactPage` earn no rich result; the real gain would be Person/`founder` for E-E-A-T, which needs facts only the client has (the carpenter's name and credentials; CLAUDE.md says there is no photo of him yet). Inventing them is worse than leaving them out.
- Fix: nothing to ship now. Client decision: confirm the maker's name and whether to name him; then add `"founder": { "@type": "Person", "name": ... }` to the Organization block (SCH-04), and publish the first blog post so the Article block is exercised (check `author`, `datePublished`, `image` in the Rich Results Test). Optionally set `"email": {{ shop.email | json }}` on Organization if the owner is happy for the contact email to be public (the contact page already shows it).
- Depends on: SCH-04; client decision
- Domain switch: n/a
- How we'd know it failed: n/a until content exists; after the first post, Rich Results Test on the article URL shows missing `author` or `image`.
- Leading indicator: first blog post published.

### SCH-11: `@context` is `http://schema.org` on Organization, WebSite and Product
- Severity: Low
- Evidence: Organization and WebSite in `sections/header.liquid:473` and `:495`; the Product block from Shopify's filter (`"@context": "http://schema.org/"`). Only BreadcrumbList uses `https`.
- Why it matters: Google accepts both, so this is a consistency matter, not an error.
- Fix: the SCH-04 snippet already uses `https://schema.org` for Organization and WebSite; the Product filter's output cannot be changed unless the SCH-07 custom snippet is adopted.
- Depends on: SCH-04, SCH-07
- Domain switch: n/a
- How we'd know it failed: n/a (cosmetic)
- Leading indicator: none needed.

### SCH-12: WebSite `SearchAction` gives no Google benefit
- Severity: Info
- Evidence: the WebSite block on `/` has `potentialAction.SearchAction` targeting `/search?q={search_term_string}`.
- Why it matters: Google retired the sitelinks search box feature in November 2024, so the property earns nothing in results. It is harmless and may be read by other consumers, so it is kept in the SCH-04 snippet.
- Fix: none required; remove it only if the owner wants a smaller block.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: n/a
- Leading indicator: none.

## Not checked
- Whether the 3 reviews on product pages are fed by any app, beyond the saved HTML (no app scripts in the snapshot).
- Search Console and Merchant Center reports (no access; the store is also 6 days old).
- The Article block on a real post (the blog has no posts).
- The sold-out behaviour of the filter, which was not observed on a sold item (all 8 are in stock).
- Liquid snippets above: not executed on Shopify's engine.
