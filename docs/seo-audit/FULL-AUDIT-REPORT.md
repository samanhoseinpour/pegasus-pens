# SEO audit: Pegasus Pens storefront

| | |
|---|---|
| Audited host | https://rjxgij-f1.myshopify.com. Resolved at run time from the store's permanent handle with 0 redirects, so there is no custom domain yet. |
| Date | 2026-11-13. The store went public on 2026-11-07; the real catalog went in today. |
| Theme measured | The live `origin/main`. Local `main` is 2 commits ahead (the cut-outs) and has uncommitted edits; neither was measured. |
| Method | One paced crawl of 43 URLs (no 429s) and 3 Playwright renders. Ten specialist agents read that saved snapshot plus the theme source. Performance is lab-only. There was no Search Console, CrUX or analytics access. |
| SEO Health Score | **66 / 100** |
| Business type | E-commerce: eight one-of-a-kind, hand-turned pens, priced in CAD, shipping within Canada. |

## Executive summary

**The theme is in good technical shape:**
- HTTPS and clean canonicals;
- server-rendered content;
- valid Product and Breadcrumb markup;
- a clean accessibility tree;
- **no hardcoded host anywhere**, so a custom domain will slot in without code changes.

**What holds the store back is not code:**
- The store's terms don't exist yet. The refund, shipping and terms policies all return 404, and every pen's "Shipping and returns" tab says "coming soon".
- The reviews are placeholders that make claims that are false for this store.
- The product pages leave out the facts that buyers and answer engines need.
- The brand name is shared with at least three other hand-turned pen makers, and the store is not yet on an address of its own.

### Top 5 issues

1. **No refund, shipping or terms policy** (High; found by 8 of the 10 agents). It blocks Merchant Center free listings, leaves gift buyers and shopping agents without answers, and is the weakest trust signal on the site. Fix: A1.
2. **Placeholder reviews with false specifics**, labelled "Customer reviews", on the home page and all 8 pens (High; found by 5 agents). There is no markup, so there is no rich-result penalty. The risks are trust, AI engines quoting the cards, and Canada's rules against deceptive marketing. Fix: A2.
3. **Product pages miss the facts buyers need** (High). No pen states its size, weight, writing system or refill type. Four pens share a closing paragraph, and the descriptions open with a sales question instead of a quotable fact. Fix: A7.
4. **Two pen names mean other things in search** (High). "Date seed pen" means a plantable seed-paper pen, and "leather pen" means a pen case. Fix: A6.
5. **Identity** (High). There is no custom domain yet. "Pegasus Pens" is also an Etsy shop, UK Facebook pages and a maker in California, and `pegasuspens.com` is on a domain-sale page. The home title is the bare brand name. Fix: A5, B1.

### Top 5 quick wins

Each takes under an hour once the facts are in.

1. Switch off the two review sections in the theme editor (A2).
2. Add five relative URL redirects for the deleted collections (A3).
3. Unpublish the default "Home page" collection, and take "Blog" out of the menu until there is a post (A4).
4. Give the home page a title and meta description that say what is sold, where and by whom (A5).
5. Give each pen a SKU (A15).

## Scores

| Category | Weight | Score | From |
|---|---|---|---|
| Technical SEO | 22 % | 77 | technical 74, sitemap 82, visual / mobile rendering 80 (weighted 60/20/20) |
| Content quality | 23 % | 55 | mean of content 52, e-commerce 55, search experience 58 |
| On-page SEO | 20 % | 70 | content's on-page score of 74, lowered for the missing crawlable links between pens (TECH-05, ECOM-06) |
| Schema / structured data | 10 % | 68 | schema |
| Performance (lab) | 10 % | 58 | performance: fine on desktop, poor on throttled mobile |
| AI search readiness | 10 % | 67 | mean of GEO 56 and agent readiness 78 |
| Images | 5 % | 60 | performance's image score; alt text is complete (content) |
| **SEO Health Score** | | **66** | 16.9 + 12.7 + 14.0 + 6.8 + 5.8 + 6.7 + 3.0 = 65.9 |

## Domain portability

**The theme is already host-independent:**
- No theme folder contains the store's host.
- The JSON-LD builds its URLs from `request.origin`, the OG tags use `canonical_url`, and the external-link script compares `location.hostname`.
- No menu, page body, product description, template or theme setting contains the host either (TECH, Domain portability (a)).
- The only absolute self-links in page bodies are Shopify's own, the cart login link (`routes.account_login_url`) and the product share field (`request.origin`). Both follow the domain.

| Follows the primary domain by itself | Needs a manual step at the switch | Wait for the switch |
|---|---|---|
| Canonical tags, `og:url`, JSON-LD | Choose a domain with no other maker's history (B1) | Drift baseline |
| `sitemap.xml` and every `<loc>` | Set it as primary, and check that the handle 301s to it (B2) | Backlink check |
| `robots.txt`, including its `Sitemap:` line | Search Console Domain property and sitemap (B3) | CrUX / field data |
| `/agents.md`, `/llms.txt`, the UCP profile | Bing Webmaster import and recrawl (B3) | Lighthouse with an API key |
| Shopify's 301 from the handle | Merchant Center claim and free listings (B4) | |
| Policies (`/policies/*`), redirects and menus, all path-based | Instagram bio, Marketplace listings, directories (B5) | |
| Product share field, cart login link | Re-check the UCP `merchant_origin` (B2) | |

Re-running this audit after the switch needs no edits. The crawl starts from the store's permanent handle, follows the redirect, and audits whatever host is primary.

## What works

- HTTPS with HSTS, and a 301 from `http://` to `https://`.
- Canonicals are correct on all 23 HTML pages, including `/collections/<c>/products/<p>`, `?variant=` and sort and filter URLs. `/search` is `noindex`.
- Content is server-rendered: the raw HTML and the rendered DOM match on the home page (9,178 characters, 0 words different).
- Product and Offer markup is valid on all 8 pens, and product pages carry a BreadcrumbList. The placeholder reviews have no review markup.
- Every page has one `<h1>` and every image has alt text. Metadata isn't templated (`templated_ratio` 0.0).
- The sitemap lists every pen and leaves out the draft pen and the deleted collections. Old product handles 301 correctly.
- The accessibility tree has 0 unnamed controls on the home, product and collection pages.
- There is no horizontal overflow at 375 px. The motion layer ends in its final state, and the hero is complete without JavaScript.
- Shopify's agent layer is present and valid: `/.well-known/ucp`, `/agents.md`, `/llms.txt` and the WebMCP adapter.

## Findings, connected

The ten agents logged 116 findings, and many are one root cause seen from different sides. Below are the root causes, each with the action-plan item that fixes it. The evidence for every ID is in `findings/`.

### 1. The store's terms don't exist (A1)

`/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-service` and `/policies/contact-information` return 404. `/pages/shipping-returns` says "coming soon", and it is the "Shipping and returns" tab on every pen.

That one root cause appears as:
- a trust gap (CONT-06);
- Merchant Center ineligibility (ECOM-01, ECOM-02, SCH-06);
- agents and answer engines that cannot answer "can I return it?" (AGT-02, GEO-04);
- missing deciding facts for the gift buyer (SXO-02);
- a placeholder page in the sitemap (MAP-02);
- a technical High (TECH-01).

The theme needs no change: Shopify links filled-in policies by itself.

### 2. Placeholder reviews (A2)

Three invented cards, "Maya R.", "Tomás A." and "Priya S.", are labelled "Customer reviews". Each repeats six times on the home page and on all 8 pens. They say things that are false for this store:
- the reviewers are in Lisbon and Leeds, but the store ships only within Canada;
- one mentions a gift box, which is not sold;
- one is a returning buyer, at a store that has been open six days.

The ratings are 0 and there is no markup, so no stars show and Google's review policy is not involved. The exposure is trust, AI engines repeating the cards as customer praise, and Canada's rules against deceptive marketing (CONT-05, SXO-03, GEO-08, AGT-04, ECOM-12; SCH-01 keeps markup off). The owner kept the cards on 2026-11-13; the specifics above are new information.

### 3. Identity and entity (A5, A11, B1)

These four together decide whether search engines and AI answers can tell this Pegasus Pens from the others:
- **No custom domain yet.**
- **The name is shared** (GEO-01): an Etsy shop `PegasusPens` run from a veterans' woodworking workshop, UK Facebook pages and a California maker. `pegasuspens.com` is for sale.
- **The home title and description** are the brand name and "Handcrafted luxury pens" (CONT-01, SXO-05).
- **The Organization markup** has eight empty `sameAs` strings and no logo, and its `url` becomes the page's own URL on `/pages/*` (SCH-02–04, GEO-02).

Meanwhile, Bing and Yahoo still show the placeholder catalog copy (GEO-03).

### 4. Product facts and query meaning (A6, A7, A8)

- Descriptions run 161–270 words, with no dimensions, weight, writing system or refill type (CONT-07, SXO-04).
- Four descriptions share a closing paragraph (CONT-10, ECOM-07).
- They open with a gift question rather than the fact an engine would lift (GEO-05).
- In search, "date seed pen" and "leather pen" belong to other objects (SXO-01).
- Collection pages have 10–17 words, and their titles don't say "pens" (ECOM-08, SXO-06).
- Gift queries want a guide (SXO-07).

The opportunity is real: nobody else sells a pen turned from date palm seeds, or one with Khatam inlay (SXO-12).

### 5. Links between pens, and the day a pen sells (A10)

"You may also like" is fetched by JavaScript from `/recommendations/products`, which `robots.txt` disallows, so product pages link to no other pen in their HTML (TECH-05, ECOM-06, CONT-04).

Every pen is stocked at 1, so after one sale its page leads nowhere (ECOM-05, SXO-08, TECH-07).

One server-rendered "more pens" block fixes both. Keep sold pages live: Shopify's markup already switches to OutOfStock (SCH-08).

### 6. Index hygiene (A3, A4)

- Five collections were deleted today after six days in public, and they now return 404 with no redirect (TECH-02).
- The default "Home page" collection (one pen, default title) and the empty `news` blog are in the sitemap and the menu (TECH-03, TECH-04, MAP-01, MAP-03, CONT-11, CONT-12, ECOM-09).

### 7. Mobile speed and stability (A12)

These are lab numbers from Chromium, one run each:
- **Desktop:** LCP 0.9–1.8 s.
- **Throttled mobile, home page:** LCP 9.7 s and CLS 0.318.
- **Throttled mobile, product page:** LCP 4.9 s.

The causes are in the theme:
- the hero image ignores its priority hint in `snippets/pegasus-scene.liquid`, and ships one 1145x1526 file for a circle about 400 px wide (PERF-01, PERF-11);
- the announcement bar changes height when the font arrives (PERF-02);
- both fonts download twice, because the preload URL and the CSS URL differ (PERF-03).

The 409 KB home HTML is mostly the two product shelves, not the review wall (PERF-05).

### 8. Tall-viewport rendering and the home h1 (A13, A14)

Google's renderer expands the viewport instead of scrolling. At 375x12000 the home page grows to about 83,000 px, because the constellation (360 % of the viewport height) and the parallax (240 %) are sized in viewport units.
- The story, the gift shelf, the reviews and the promises land 47,800–81,300 px down.
- Three of the four constellation panels stay hidden (VIS-01, VIS-02).
- The text stays in the DOM, so indexing is probably unaffected. How Google weighs it is unverified until URL Inspection is available.

Separately, the home page's only h1 is the header wordmark; the hero headline is an h2 (VIS-03, CONT-03).

### 9. Agent layer (A16)

- **Shopify's part is valid:** the UCP profile, `/agents.md`, `/llms.txt` and the WebMCP adapter.
- **The theme's part is clean:** 0 unnamed controls.
- **The AI crawler policy** is Shopify's default, which nobody chose (AGT-03).
- **Agent-addressed text:** Shopify's `robots.txt` and `/agents.md` contain text addressed to AI agents, including a promotion for a shopping skill. The audit assessed it as content and did not act on it (TECH-11, AGT-07).

## Assumptions to confirm

- The owner wants organic search and Google's free listings as channels, not only Instagram and Marketplace.
- The domain switch happens within weeks. If it is months away, verify the handle in Bing Webmaster now, to clear the stale placeholder entries sooner.
- Sold pens stay listed as sold pages (ECOM-05). If the family prefers to remove them, each one needs a 301 first.
- Copy recommendations keep the calm, literary voice. The examples in the findings are drafts for the client, not final text.

## What this audit could not measure

- **Google:** its index, queries and coverage (there is no Search Console property).
- **Field Core Web Vitals:** there is no traffic and no CrUX key.
- **Lighthouse scores and the agentic X/N:** PageSpeed Insights refused without a key, and there is no local Lighthouse.
- **Safari/WebKit:** the tests ran in Chromium only, but the owner browses in Safari.
- **A sold-out page:** all 8 pens are in stock.
- **Checkout shipping rates and Merchant Center.**
- **Live answers** from ChatGPT, Perplexity, Gemini or Copilot.
- **Who owns `pegasuspens.ca`.**

One more limit: the renderer's own raw fetch hit a 429 on the product and collection renders, so the `is_spa: true` on those two is a false positive (TECH-14).

## Next audit

Run `/seo audit` again after the domain switch; it resolves the new host by itself. Check:
- the handle 301s to the new domain;
- the three policies answer 200;
- no placeholder review text remains in the raw HTML;
- mobile CLS on `/` is under 0.1;
- Search Console covers the 8 pens;
- Bing's stale placeholder entries are gone.

Then capture a drift baseline on the new host, run the backlink check, and re-audit monthly while the catalog changes.

## Notes for the repo

- `CLAUDE.md` says `cart_type: "notification"`, but the deployed `config/settings_data.json` says `"drawer"` (a theme editor change).
- `markExternal()`, which `CLAUDE.md` describes under "Pegasus design layer", exists only in the uncommitted local `assets/pegasus.js`. It is not live (TECH-13).
- `CLAUDE.md` describes `pegasus-breadcrumbs` as serving collection pages, but `templates/collection.json` doesn't include it (SCH-09).

## Files

- `ACTION-PLAN.md`: the fixes in order, split into "now" and "at the domain switch".
- `findings/*.md`: the ten specialist reports, with evidence for every ID.
- `screenshots/`: desktop, mobile, first-paint and tall-viewport captures.
- `audit-data.json`: structured data for the PDF report.
