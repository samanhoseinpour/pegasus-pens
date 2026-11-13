# Sitemap findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt) · Date: 2026-11-13 · Agent: sitemap

Category score: 82/100. The index and all five children are valid and complete for the 8 pens, and the draft is absent. Points are lost for three listed pages that should not be (the default `frontpage` collection, the empty `news` blog, the "coming soon" shipping page) and for sitemap details Shopify controls.

## What works
- `/sitemap.xml` is a valid `sitemapindex` (`application/xml; charset=utf-8`, 200) with 5 children, all 200 and well-formed. `&` is correctly escaped (`from=...&amp;to=...`). Every `<loc>` is absolute https on the resolved host, so all of it follows a domain switch on its own.
- Products child: the 8 pens plus `/`. Pages child: `/pages/{contact,about,shipping-returns,care}`. Collections child: `frontpage`, `hardwood`, `segmented-wood`, `gifts`, `leather`, `date-seed`. Blogs child: `/blogs/news`. Counts are far below the 50,000 URL / 50 MB limits.
- Every pen in the crawl is listed, and nothing 404s. The five deleted collections (`burl-wood`, `resin`, `bestsellers`, `new-runs`, `limited`) and the draft `/products/rose-resin-pen` are absent, and they return 404.
- Image entries (products only): one per pen, with `image:title` = product title and `image:caption` = the photo's alt text (the descriptive alt text written on 2026-11-13). The file is the same one as the page's `og:image` (`<handle>-front.png`).
- `robots.txt` has `Sitemap: https://rjxgij-f1.myshopify.com/sitemap.xml` (line 122), absolute, and no rule blocks `/products/`, `/collections/` or `/pages/`. The theme has no `robots.txt.liquid` override, so Shopify's default applies and follows the domain.
- Not in the sitemap, and rightly so: `/collections/all`, `/collections` and `/policies/*`. Shopify never lists them, and this is not a gap. `/collections/all` is 200 with a self-canonical.

## Findings
### MAP-01: The default "Home page" collection (`/collections/frontpage`) is listed
- Severity: Medium
- Evidence: `sitemap_collections_1.xml` lists `/collections/frontpage` (lastmod 2026-11-12). The page is 200 with a self-canonical, `<title>Home page – Pegasus Pens</title>`, and one product (`In stock (1 product)`). Only the home page links to the real collections; nothing links to `frontpage`.
- Why it matters: it is a thin, one-pen duplicate of `/collections/all`, and it is a leftover default title. It spends crawl attention and could appear in results under a meaningless name.
- Fix: Shopify admin, Products > Collections > "Home page" > Sales channels and apps > remove Online Store (or delete the collection if nothing needs it). It leaves the sitemap on the next regeneration and the URL answers 404. If you want it kept but unlisted, add the `seo.hidden` metafield (Settings > Custom data > Collections > Add definition: namespace and key `seo.hidden`, type integer) and set it to 1. This drops it from the sitemap and from Shopify's own search. Check the page head afterwards for a noindex tag and do not assume one is added.
- Depends on: none
- Domain switch: n/a (the setting moves with the store)
- How we'd know it failed: `/sitemap_collections_1.xml` still contains `/collections/frontpage` after 24 hours, or the page still answers 200.
- Leading indicator: in Search Console at domain switch, Pages report > "Crawled, currently not indexed" listing `/collections/frontpage`.

### MAP-02: `/pages/shipping-returns` ("coming soon") is listed
- Severity: Medium
- Evidence: `sitemap_pages_1.xml` lists it (lastmod 2026-11-07). The page is 200, self-canonical, and its text says "...coming soon. If you have a question about an order, please contact us." The home page links to it (`home-links.txt` line 13).
- Why it matters: a placeholder page is a thin, soft-404 candidate and it will probably show as an empty search result. The page that shoppers need before buying is the shipping page, and Merchant Center also asks for shipping and return information.
- Fix: preferred, write the real shipping and returns text in Shopify admin, Online Store > Pages > "Shipping and returns" (a client decision: it needs facts the owner has not given). Until then either set Visibility to Hidden (the page leaves the sitemap and 404s; the product-page "Shipping and returns" tab disappears on its own, because the theme leaves out a tab with no content) and remove it from the `footer` menu and from the home link in Online Store > Navigation, or set `seo.hidden` = 1 on the page and keep it linked.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: `/pages/shipping-returns` still appears in `sitemap_pages_1.xml` after being hidden, or a menu link to it returns 404.
- Leading indicator: a click on the footer "Shipping and returns" link, then the sitemap's pages child.

### MAP-03: The empty `news` blog is listed
- Severity: Low
- Evidence: `sitemap_blogs_1.xml` lists `/blogs/news` (lastmod 2026-10-23, the store's creation date, not a post date). The blog has no articles. The home page links to it (4 hrefs).
- Why it matters: an empty listing is a near-empty page indexed under the store's name, and its lastmod says nothing real. Shopify has no "unpublish" switch for a blog, only for articles.
- Fix: if a first post is planned soon, leave it. Otherwise remove the Blog item from `main-menu` and the home links (Online Store > Navigation, and the theme editor for the home sections) and add the `seo.hidden` = 1 metafield on the blog (Settings > Custom data > Blogs, if the admin offers it; I could not verify that blogs accept `seo.hidden`, so confirm in the admin). Remove the metafield when the first article is published.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: `/blogs/news` still in `sitemap_blogs_1.xml` after the change.
- Leading indicator: the blogs child stays one URL with no article entries.

### MAP-04: `lastmod` is identical on all 8 pens, and unreliable on some pages
- Severity: Low
- Evidence: all 8 products carry `2026-11-13T03:33:37-08:00` (the catalog import); `/pages/contact` and `/blogs/news` carry `2026-10-23T10:38:50-07:00` (store creation). The home page `/` has no `lastmod`. Format is valid W3C datetime.
- Why it matters: Google uses lastmod only when it has proven accurate. The identical stamp is honest for today (one batch edit), but any bulk edit (metafield, tag, inventory) will bump every pen at once.
- Fix: none in the theme. Shopify sets this value from the resource's `updated_at`, and it cannot be edited by hand. Avoid bulk saves of products when nothing changed in the content. It resolves itself as pens are edited one by one.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: after a real edit to one pen, its `lastmod` does not change while the others stay put (the reverse is acceptable).
- Leading indicator: spread of `lastmod` values in `sitemap_products_1.xml`.

### MAP-05: Shopify adds `changefreq` to every entry, and a non-page `agents.md` child
- Severity: Info
- Evidence: every `<url>` has `<changefreq>` (daily/weekly), which Google ignores. `sitemap_agentic_discovery.xml` holds one URL, `/agents.md` (`text/markdown`, no lastmod). Its text tells AI agents to recommend a third-party shopping skill (page content, assessed only, not acted on).
- Why it matters: neither one blocks indexing. Google needs HTML and will not index a markdown file for search. The file also asks agents to route shoppers to a third-party service, which is a brand and traffic matter, not a search one.
- Fix: nothing in the theme; the sitemap cannot be hand-edited. If the owner does not want the agentic discovery file, look for the agentic or AI storefront setting in Shopify admin (Settings > Apps and sales channels). I could not confirm where it is or that it can be turned off.
- Depends on: none
- Domain switch: auto (the `<loc>` follows the domain)
- How we'd know it failed: n/a
- Leading indicator: n/a

### MAP-06: Sitemap submission and image/collection coverage need follow-up at the domain switch
- Severity: Info
- Evidence: the `Sitemap:` line in robots.txt is dynamic. The collections and pages children have no `image:image` entries (the collections have no uploaded image; page entries never carry any). The pens carry one image each in the sitemap although the product pages hold more photos (I did not verify which Shopify includes).
- Why it matters: Google finds the sitemap through robots.txt, but Search Console shows its status only after the property exists.
- Fix: at domain switch, add the new property in Search Console (domain property, needs a DNS TXT record, manual) and submit `sitemap.xml` as the path (relative to the new host, no literal host in the theme). Keep the `myshopify.com` property for the 301 period. Uploading an image to each collection (Products > Collections) would add it to the sitemap; this is optional.
- Depends on: MAP-01
- Domain switch: manual
- How we'd know it failed: Search Console Sitemaps shows "Couldn't fetch" or discovered URLs are not 14 once MAP-01 to MAP-03 are done (8 pens, `/`, 4 collections, 3 or 4 pages).
- Leading indicator: Sitemaps report > Discovered pages vs the 8 pens plus the pages listed above.

## Notes
- Sold-out pens: every pen is stocked at 1, so a sale leaves the product published and in the sitemap with an out-of-stock status. That is the right outcome for a one-of-a-kind item that stays as a record; do not unpublish it. Another agent covers the page's own behavior.
- Not verified: how Shopify decides how many images to list per product (observed 1 each); whether `seo.hidden` works on blogs.
