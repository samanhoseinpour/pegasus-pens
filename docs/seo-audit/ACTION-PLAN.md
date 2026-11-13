# Action plan: Pegasus Pens SEO audit

Audited host: https://rjxgij-f1.myshopify.com · 2026-11-13 · SEO Health Score **66/100** · Full report: [`FULL-AUDIT-REPORT.md`](FULL-AUDIT-REPORT.md) · Evidence: [`findings/`](findings/)

That host is the only literal one in this plan. Every fix uses paths, `shopify://` links, Shopify admin settings or Liquid's dynamic objects (`request.origin`, `routes.*`, `canonical_url`, `asset_url`), so it keeps working when the custom domain becomes primary.

Each item says:
- **where** the work lives: **Theme** is this repo, **Admin** is Shopify admin (store data), **Client** means it needs the owner's facts or decision;
- which findings it **closes**;
- how we would know it **failed**;
- what to **watch** afterwards.

## Status (2026-11-13, after the first round of fixes)

| Item | State |
|---|---|
| A3 redirects | **Live**: all five return 301 to their targets. |
| A4 index cleanup | **Live**: the "Home page" collection is off the Online Store (404, out of the sitemap), and "Blog" is out of `main-menu`. **Open:** `/blogs/news` is still in the sitemap, because the blog is published; since the push it is `noindex` while it has no posts. Publish a first post, or hide or delete the blog. |
| A5 titles and descriptions, A6 pen names | **Live** (set through the Admin API, checked in the live HTML): SEO title and description on the 8 pens, the 5 collections and the About, Contact and Care pages. `/collections/all` is a real automated collection now, "All pens" (handle `all`, every pen with a price above 0 CAD, A to Z), with its own title, heading and description; it joins `sitemap_collections_1.xml` when Shopify next regenerates it. The date seed and leather pens now say "date palm seeds" and "layered leather". Titles are typed without the brand, because `layout/theme.liquid` adds " – Pegasus Pens" unless the title contains it. **Open:** the home page, by hand in Online Store > Preferences (no API for it): title "Pegasus Pens – Handmade One-of-a-Kind Pens from Vancouver", description "Handmade wooden, leather and date seed pens from Vancouver, Canada. Each is turned by hand by a German-trained carpenter, and no two are alike." A6's first sentences are still the client's copy. |
| A15 SKUs | **Live**: each pen's SKU is its handle, and it shows in the Product JSON-LD. |
| A10, A11, A13, A14, and A15's collection breadcrumbs | **Live** since the push of 2026-11-13 (`3d39e34` to `9ad7fdd`): every pushed theme file matches the live theme, and the live HTML shows each fix. |
| A12 | **Live** (same push): the duplicate font downloads, the unused preconnect, the hero photo's priority and `srcset` (every scene now has a `srcset`), the one-line announcement bar and the product photo priority (PERF-04). **Open:** the 95 KB emblem (PERF-12). |
| Everything else | **Open:** it needs the client's facts or decisions (A1, A2, A5–A9, A16, Part B), or it is a small theme item (AGT-09, VIS-04, VIS-07). |

## Part A: now (works on any host)

### Phase 1 · Trust floor (week 1)

The store's terms don't exist yet. Eight of the ten agents found this on their own, and it is the gap that gates the most other work.

**A1. Write the store's terms** · Client + Admin
- In Settings > Policies, write the Refund policy, the Shipping policy and the Terms of service. The Contact information policy needs a business address, which is the client's call.
- Replace the "coming soon" text of the `shipping-returns` page with a short summary that links to the policies. The product page's "Shipping and returns" tab reads that page.
- The client supplies the facts: the return window and conditions, who pays return shipping, the shipping rate or free-shipping rule, the handling and transit time within Canada, the carrier, and whether Lower Mainland pickup is offered.
- Closes TECH-01, CONT-06, ECOM-01, AGT-02, GEO-04, SXO-02 and MAP-02. Unblocks SCH-06 and B4.
- Failed if `/policies/refund-policy`, `/policies/shipping-policy` or `/policies/terms-of-service` still answers 404, or if a product page still says "coming soon".
- Watch for `/agents.md` to list the new policies. Shopify adds them on its own.

**A2. Decide what to do with the placeholder reviews** · Client + Theme editor
- The three cards are labelled "Customer reviews" and repeat on the home page and all 8 pens. They state things that are false for this store (`templates/index.json:524-535`):
  - the reviewers are in Lisbon and Leeds, but the store ships only within Canada;
  - one mentions a gift box, which is not sold;
  - one is a returning buyer, at a store that has been open six days.
- There is no review markup and no stars, so there is no Google rich-result risk. The risks are trust, answer engines quoting the cards as praise, and Canada's rules against deceptive marketing.
- The owner kept the cards on 2026-11-13, and these specifics may be new information. **Recommended:** switch off both review sections in the theme editor until real reviews exist (one reversible toggle each). The minimum is to remove the false specifics.
- Closes CONT-05, SXO-03, GEO-08, AGT-04 and ECOM-12.
- Failed if a reviewer name from the placeholder set is still in the raw HTML of `/` or of any product page.

**A3. Redirect the five deleted collections** · Admin
- Add them in Online Store > Navigation > URL redirects, with relative targets (Shopify's redirects are 301s):
  - `/collections/burl-wood` → `/collections/hardwood`;
  - `/collections/resin`, `/collections/bestsellers`, `/collections/new-runs` and `/collections/limited` → `/collections/all`.
- The mapping is the client's call. Never redirect to the home page.
- Closes TECH-02 and helps with GEO-03 (stale index entries).
- Failed if any of the five still answers 404.

**A4. Take the non-pages out of the index** · Admin
- Unpublish the default "Home page" collection from the Online Store channel (Products > Collections).
- Remove "Blog" from `main-menu` until the first post exists, or publish one.
- Closes TECH-03, TECH-04, MAP-01, MAP-03, CONT-11, CONT-12 and ECOM-09.
- Failed if `sitemap.xml` still lists `/collections/frontpage`, or still lists `/blogs/news` while it has no posts.

### Phase 2 · Say what we sell, in searchers' words (weeks 1–2)

**A5. Titles and meta descriptions** · Admin, plus one theme string
- **Home page** (Online Store > Preferences): the title and description should name the object, the place and the maker, in the brand's voice. For example "Pegasus Pens · One-of-a-kind pens, hand-turned in Vancouver" and "Pens turned by hand in Vancouver, British Columbia, by Mehdi, a German-trained carpenter." The final wording is the client's. Today the title is "Pegasus Pens" and the description is "Handcrafted luxury pens".
- **Other pages:** add meta descriptions to `/pages/about`, `/pages/contact`, the blog and the privacy policy. Give the collections SEO titles that contain "pens".
- **`/collections/all`** is titled "Products" and has no admin editor, so set its title through a locale string in `layout/theme.liquid`.
- Closes CONT-01, TECH-06, SXO-05 and SXO-06. Supports GEO-01.
- Failed if a re-run finds an indexable page without a meta description, or the home `<title>` is still the bare brand name.

**A6. Disambiguate two pen names** · Admin
- In search, "date seed pen" means a plantable seed-paper pen, and "leather pen" means a pen case.
- Keep the visible names. Put "date palm seeds" and "layered leather" in those two pens' SEO titles, meta descriptions and first sentences.
- Give these two pens, and the Khatam pen, the strongest internal links. Nobody else sells them (SXO-12).
- Closes SXO-01.
- Failed if, after the switch, Search Console shows "seed pen" or "plantable" impressions with about 0 % CTR and no "date palm" queries.

**A7. One content pass per pen** · Client facts + Admin
- Open with a sentence an engine can quote: what the pen is, the material, the maker, the place and the hours of work.
- Add a five-line spec list: length, weight, writing system and refill type, finish, and what comes with it.
- Rewrite the closing paragraph that four pens share.
- Link the maker's name to `/pages/about` with a relative path.
- Leave "twist" and "refillable" out until the owner confirms them.
- Closes CONT-07, CONT-10, CONT-13, ECOM-07, ECOM-13, GEO-05 and SXO-04. Supports CONT-04 and CONT-08.
- Failed if a re-run finds product pages without dimensions or a writing system.

**A8. Collection and gift copy** · Client + Admin
- Write 60–120 words for each material collection, in the client's words: the material and how the pens are made.
- Make `/collections/gifts` a short guide: who each pen suits, delivery dates and what comes with it. This needs A1.
- Closes ECOM-08, SXO-06 and SXO-07. Supports CONT-08.

**A9. Show the maker's proof** · Client
- Add one or two checkable specifics to `/pages/about`, such as where Mehdi trained, a named commission or a workshop photo of him. Otherwise, soften the claims to what can be shown.
- Closes CONT-09, GEO-06 and SXO-09.

### Phase 3 · Theme work (weeks 2–3, agency)

**A10. Crawlable links between pens, and a page for sold pens** · Theme
- "You may also like" loads from `/recommendations/products`, which `robots.txt` blocks, so a product page's HTML links to no other pen.
- Render those links in Liquid instead. Use Craft's `featured-collection` section in `templates/product.json`, or a small snippet over `collections[product.type | handleize].products`.
- On a sold pen, show a "Sold" note with the same links. Keep sold pens Active; never archive or delete them.
- Closes TECH-05, ECOM-06, CONT-04, TECH-07, ECOM-05, SXO-08 and SCH-08.
- Failed if the raw HTML of a product page links to fewer than two other `/products/` paths.
- Watch for the first sold pen's page to keep sending clicks to other pens.

**A11. Organization markup** · Theme (`sections/header.liquid`)
- Replace the block with the snippet in `findings/schema.md` (SCH-04). Apply it on top of the working copy, which holds unpushed edits. The new block:
  - builds `url` and `@id` from `request.origin | append: routes.root_url`;
  - takes `logo` from the emblem through `asset_url`;
  - builds `sameAs` from the non-blank social settings only (today it prints eight empty strings and Instagram);
  - uses an https `@context`.
- Closes SCH-02, SCH-03, SCH-04, SCH-11 and GEO-02.
- Failed if the Rich Results Test shows an empty `sameAs` entry, or a `url` that is not the root, on `/pages/about`.

**A12. Mobile speed and stability** · Theme
- **Hero image:** `snippets/pegasus-scene.liquid` drops `fetch_priority` today; pass it through. Ship the image in 2–3 widths with `srcset` and `sizes`. Do the same for the scene photos, and shrink the 95 KB emblem PNG.
- **Announcement bar:** fix its height on mobile (one line with an ellipsis, or a two-line `min-height`) and add metric-matched fallback fonts. The bar's late height change causes the mobile CLS of 0.318.
- **Fonts:** the preload URL (`asset_url`, with `?v=`) and the CSS URL (`url('pegasus-display.woff2')`, without it) differ, so each font downloads twice. Make them match, and drop the unused `fonts.shopifycdn.com` preconnect.
- **Product page:** give the first product photo `fetchpriority="high"`.
- Closes PERF-01, PERF-02, PERF-03, PERF-04, PERF-11 and PERF-12.
- Failed if a lab re-run shows a mobile CLS of 0.1 or more on `/`, or still fetches each font twice.
- Watch Search Console's Core Web Vitals report once the site has enough traffic.

**A13. Make the home page read whole in a tall render** · Theme
- Google's renderer expands the viewport instead of scrolling. At 375x12000 the home page grows from about 16,000 px to about 83,000 px, because the constellation (`scroll_length` 360%) and the parallax (`length` 240%) are sized in viewport units.
- As a result, the story, the gift shelf, the reviews and the promises land 47,800–81,300 px down, and three of the four constellation panels stay `visibility: hidden`.
- Cap both lengths in px (`min(…svh, …px)`). Treat very tall viewports as unpinned, as the theme already does below 620 px of height, so that all four panels show.
- Files: `sections/pegasus-constellation.liquid`, `assets/pegasus-constellation.js`, `sections/pegasus-parallax.liquid`.
- Closes VIS-01 and VIS-02.
- Failed if a 375x12000 render of `/` is still taller than about 25,000 px, or still hides constellation panels. After the switch, Search Console's URL Inspection screenshot confirms it.

**A14. One h1 that says what the home page is** · Theme
- The home page's only h1 is the header wordmark, and the hero headline is an h2 (`sections/header.liquid`, `snippets/pegasus-hero-slide.liquid`).
- On the home template, make the first slide's heading the h1 and render the wordmark as a non-heading. Other templates keep their own h1.
- Closes CONT-03 and VIS-03.

**A15. Small fixes** · Admin / Theme
- Give each pen a SKU, and leave the barcode empty (SCH-05, ECOM-04).
- Add breadcrumb markup to collection pages (SCH-09).
- Add accessible names to the gallery buttons and the product form (AGT-09).
- If the review section returns with real reviews, keep its repeated cards out of the raw HTML (AGT-04).
- On a 375x812 phone the "Shop all pens" button starts 15 px below the fold, so tighten the hero spacing on small phones (VIS-04). Bring tap targets up to 44 px (VIS-07).

**A16. AI crawler policy (optional)** · Client
- Today `robots.txt` is Shopify's default, which allows every crawler, training crawlers included, by omission.
- If the owner wants a different policy, add a `templates/robots.txt.liquid` that renders `robots.default_groups` and appends named groups.
- Closes AGT-03.

## Part B: at the domain switch (in order)

**B1. Choose the domain with the name collision in mind** · Client
- At least three other hand-turned pen makers use "Pegasus Pens": an Etsy shop of that name, UK Facebook pages, and a maker in California.
- `pegasuspens.com` sits on a domain-sale page, and its history belongs to another maker. Check whether the client already owns `pegasuspens.ca`.
- Choose a domain that carries no other maker's history; check it in the Wayback Machine.
- Closes GEO-01, together with A5.

**B2. Make it primary and confirm the switch** · Admin
- Connect the domain in Settings > Domains and set it as primary.
- Re-run `/seo audit`. The crawl starts from the store's permanent handle, so `host.txt` should now show the new host with `redirects_from_handle=1`.
- These follow the new host on their own; check that each one shows it: canonical tags, `og:url`, the JSON-LD, the sitemap, `robots.txt`, `/agents.md` and the UCP profile.
- Closes AGT-08 and ECOM-14 (verification items).

**B3. Search engines** · Admin + registrar
- **Search Console:** add a Domain property (DNS TXT record) for the new domain. It covers every protocol and subdomain, and it survives later changes. Submit `/sitemap.xml` and request indexing for the home page and the 8 pens.
- **Bing Webmaster Tools:** import the site from Search Console, submit the sitemap, and request a recrawl of the URLs from the placeholder era. Bing and Yahoo still show the old burl and resin copy.
- Closes TECH-12, MAP-06 and GEO-03.

**B4. Merchant Center and free listings** · Admin (needs A1)
- Claim the domain and connect the Google & YouTube channel.
- Set shipping and returns in Merchant Center, not in a second Product JSON-LD.
- Mark the pens as having no product identifier.
- Closes ECOM-02, ECOM-03 and the rest of SCH-06.

**B5. Off-site links** · Client
- Update the Instagram bio (the link plus "Vancouver, BC"), the Marketplace listings, and any directory or local-press listings from SXO-10.
- Closes GEO-09 and SXO-10.

**B6. Baselines** · Agency
- After B2 and B3: re-run the audit, capture a drift baseline on the new host, and run the backlink check (pointless on the handle).
- Re-run Lighthouse with a PageSpeed API key (AGT-01, PERF-10).

## What can run in parallel

- The client and admin content work (A1, A2, A5–A9) and the theme work (A10–A15) do not depend on each other.
- A8's gift guide waits for A1's delivery facts.
- B3 and B4 wait for B2, and B4 also waits for A1.
- Nothing in Part A waits for the domain, because every fix is host-independent.
