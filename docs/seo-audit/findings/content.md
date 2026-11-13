# Content Quality findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt; cited below by path only) · Date: 2026-11-13 · Agent: content
Category score: 52/100. The maker's story gives real first-hand experience, but trust is thin: four policies return 404, the shipping page says "coming soon", and the placeholder reviews make specific claims that are false. The product pages also leave out the specs a buyer needs.

Scores in this file:
- On-page (titles, descriptions, headings, anchors): **74/100**
- E-E-A-T (this skill's internal weights, not Google's): Experience 75, Expertise 55, Authoritativeness 30, Trustworthiness 35. Weighted total **47/100**.
- AI citation readiness: **50/100**

Method: all 23 saved pages that answer 200 were parsed from `CRAWL/pages/*.html` (stdlib parser, `<main id="MainContent">` only, `aria-hidden` subtrees left out of the "visible" counts). Metadata was checked with the bundled `metadata_template.py` on 23 title/description pairs. Readability was checked with a Flesch script on the product descriptions as rendered. Product descriptions, collection descriptions, page bodies, SEO titles and SEO descriptions are **store data in Shopify admin, not repo files**. The About page copy is the exception: it lives in the theme (`templates/page.about.json`).

## What works
- **Exactly one `<h1>` on every page checked** (23 of 23). Product pages: h1 = product title. About: "Where your pen comes from." Contact: "Write to the workshop." Policy and page h1s match their titles.
- **Titles are unique on all 23 pages.** All 8 product SEO titles and descriptions were written by hand and name the material: "A one-of-a-kind pen turned from a branch of our family's North Vancouver plum tree and inlaid by hand with Persian Khatam…". `metadata_template.py` result: `site_risk: low`, `templated_ratio: 0.0`, `templated_count: 0`, `shared_cta_phrases: {}`, no echo or brand-suffix flags.
- **Alt text coverage is complete.** No `<img>` lacks an `alt` attribute on any of the 23 pages: 130 alts are descriptive and 265 are deliberately empty. Every product photo has its own specific alt, e.g. "The pen blank in the workshop: trimmed date seeds glued upright around a brass tube, before turning" (`/products/date-seed-pen`). The empty ones are decorative or repeat a photo: the emblem, hero scenes, the card's second and third frames inside a single link, and search-panel thumbnails.
- **Strong first-hand experience on the About page** (`/pages/about`) and in the product copy. It names the maker (Mehdi), his age (75), his training (German-trained carpenter) and his output ("more than 150 individually handcrafted pens"). It gives a provenance ("a branch of a tree at our family home in North Vancouver"), hours of work ("about 5 to 30 hours") and two real workshop photos of the date-seed blank.
- **The theme's own copy is calm and specific, and keeps to what exists.** For example: "The lines across the barrel are the oak's own grain, never painted or printed."
- **No Review or AggregateRating markup on any page.** The review blocks are saved with `"rating": 0` (`templates/index.json:518,527,536`; `templates/product.json:199,208,217`), so no stars render. The known context mentions star ratings, but the live pages show none.
- Internal anchors are mostly descriptive: product names, "Shop hardwood", "Shop segmented wood", "Gift pens".

## On-page
On-page score: **74/100**. Titles, the single h1 and alt text are solid. Points are lost for six missing meta descriptions, a home title and description that are only the brand name and a 23-character phrase, three product titles longer than 70 characters, and product pages that link to almost no other pens in the raw HTML.

| Path | Title (chars) | Meta description (chars) |
|---|---|---|
| `/` | "Pegasus Pens" (12) | "Handcrafted luxury pens" (23) |
| `/collections` | "Collections – Pegasus Pens" (26) | same as home (23) |
| `/collections/all` | "Products – Pegasus Pens" (23) | **none** |
| `/collections/frontpage` | "Home page – Pegasus Pens" (24) | **none** |
| `/collections/hardwood` | 23 | 88 |
| `/collections/segmented-wood` | 29 | 95 |
| `/collections/leather` | 22 | 95 |
| `/collections/date-seed` | 24 | 89 |
| `/collections/gifts` | 20 | 60 |
| `/pages/about` | "About – Pegasus Pens" (20) | **none** |
| `/pages/contact` | "Contact – Pegasus Pens" (22) | **none** |
| `/pages/care` | 32 | 114 |
| `/pages/shipping-returns` | 35 | 103 ("…details are coming soon…") |
| `/blogs/news` | "News – Pegasus Pens" (19) | **none** |
| `/policies/privacy-policy` | 29 | **none** |
| 8 product pages | 55 to 77 (3 over 70: walnut 77, date seed 71, plum 70) | 141 to 151, all unique |

Title logic: `layout/theme.liquid:20-25` prints `page_title`, then " – " + `shop.name` unless the title already contains it. The meta description comes from `page_description` (`layout/theme.liquid:27-29`) and is left out when that value is empty. That is why the pages without an SEO description and without body text (About, Contact) have none.

### CONT-01: Home page title and description are only the brand name, and six pages have no meta description
- Severity: Medium
- Evidence: `/` has title "Pegasus Pens" (12 chars) and description "Handcrafted luxury pens" (23). `/collections` reuses the same description. There is no `<meta name="description">` on `/pages/about`, `/pages/contact`, `/collections/all`, `/blogs/news`, `/policies/privacy-policy` or `/collections/frontpage` (`metadata_template.py`: `missing-metadata` on those six). "Luxury" appears nowhere else on the site.
- Why it matters: the home page is the brand's main search result, and its title says nothing about what is sold. When a description is missing, Google writes its own snippet from page text, and here that text is menu labels, filter UI or "coming soon".
- Fix (Shopify admin):
  - Online Store > Preferences: set a home title, e.g. "Pegasus Pens · Hand-turned pens, one of a kind, from Vancouver". Set a meta description of about 140 to 155 chars, e.g. "Pens turned by hand in hardwood, leather and date seed by Mehdi, a German-trained carpenter in Vancouver, British Columbia. Each one is the only one."
  - Online Store > Pages > About and Contact > Search engine listing: write a description for each.
  - `/collections/all`: create a collection with the handle `all` (automated, condition: price greater than 0). Title it "All pens", give it a description, and it replaces Shopify's default "Products".
  - Privacy policy: optional.
  - Use no host anywhere; these are admin text fields.
- Depends on: CONT-11 (blog), CONT-12 (frontpage)
- Domain switch: auto
- How we'd know it failed: the saved HTML of `/`, `/pages/about` and `/collections/all` still has no `<meta name="description">`, or the title is still 12 chars.
- Leading indicator: view-source on the three paths after the admin edit. Later, the snippet shown in Search Console's URL inspection (at domain switch).

### CONT-02: Product titles run long, and the product metadata shares one shape (not templated)
- Severity: Low
- Evidence: walnut is 77 chars, date seed 71 and plum 70, against roughly 60 visible in a result. All 8 titles end in "…, Handcrafted/Handmade in Vancouver – Pegasus Pens". All 8 descriptions open "A one-of-a-kind…". `metadata_template.py` does not count this as templated (no stock CTA, no title echo).
- Why it matters: the end of a truncated title is the part that tells the pens apart. Eight results that read the same are harder to choose between on a brand query.
- Fix (Shopify admin, product > Search engine listing):
  - Shorten the three long titles, e.g. "Walnut, Rosewood, Maple & Acrylic Pen, Handmade" (theme adds " – Pegasus Pens").
  - Vary the description openings to lead with each pen's own fact: "Turned from a branch of our North Vancouver plum tree…", "About 30 hours of work in date seed…".
- Depends on: none
- Domain switch: auto
- How we'd know it failed: any product `<title>` is still over 70 chars after the edit.
- Leading indicator: title length in view-source.

### CONT-03: Headings: the home page h1 is the wordmark, collection h1s carry a hidden prefix, and product pages repeat the title in a hidden h2
- Severity: Low
- Evidence:
  - Home: the single h1 is the header wordmark "Pegasus Pens", from `sections/header.liquid:175-176` (origin/main, `request.page_type == 'index'`). The hero headlines are h2: "One pen, one story, never duplicated.", "From a branch of the family plum tree.", "Made to be given."
  - Collections: h1 = `<span class="visually-hidden">Collection: </span>Hardwood`, so `/collections/all` reads "Collection: Products".
  - Products: `sections/main-product.liquid:113-115` prints `<h1>` and then a quick-add `<h2 class="h1">` with the same title.
  - Every product card prints its title in two h3s. The cart drawer and search panel h2s ("Your cart is empty", "Popular pens", "Try searching for", "Browse") come before the h1 on every page.
- Why it matters: minor. The outline still has one h1 per page, and these are Craft/Dawn patterns. The home page h1 states the brand but not the subject (handmade pens).
- Fix (theme file, optional; `sections/header.liquid` currently has uncommitted local edits, so coordinate with the owner):
  - Home: keep the wordmark as h1 but add a visually hidden subject, e.g. "Pegasus Pens: hand-turned pens from Vancouver", through a new locale key in every `locales/*.json`.
  - `/collections/all`: renaming it through the admin collection (CONT-01) fixes "Products".
  - Leave the product h2 as it is.
- Depends on: CONT-01
- Domain switch: n/a
- How we'd know it failed: the home page h1 text is still exactly "Pegasus Pens".
- Leading indicator: the accessibility tree / heading list in a browser extension.

### CONT-04: Product pages barely link to other pens in the HTML, and pens and the maker story do not link to each other
- Severity: Medium
- Evidence:
  - `/products/date-seed-pen` raw HTML links to only four products, all from the search panel's "Popular pens" (Canadian Leather, Cross-Grain Oak, Date Seed, Maple). That set is the same on every page, so Olive, Plum & Khatam, Six Hardwoods and Walnut never receive those links.
  - The `related-products` section is a `<product-recommendations data-url="/recommendations/products?limit=4">` shell that fills by JS. It was still empty in the Playwright render (`CRAWL/render/products_date-seed-pen.json`).
  - The descriptions say "our dad" on 4 pens but no product page links to `/pages/about`. In main content the only links are the breadcrumb, "contact us" and itself.
  - `/pages/about` links only to `/collections/all`, `/collections/gifts` and `/collections/hardwood`, not to the plum pen whose branch it describes.
  - Home has three generic anchors to `/pages/about` ("Read our story" ×2, "Read his story"), plus "View pen" and "See the pen".
- Why it matters: with eight pens, every link between related items carries weight. The maker story is the site's strongest E-E-A-T asset, and no product page links to it.
- Fix:
  - Store content (admin): in each description, link the maker's name to `/pages/about` with a relative path, e.g. "turned by our father, Mehdi".
  - Theme editor: in `templates/page.about.json`, link the plum sentence (process step 1) to the pen with `shopify://products/plum-wood-persian-khatam-pen`.
  - Theme option: add a `pegasus-pills` section to `templates/product.json` linking the material collections, as `collection.json` already does. That puts the links in the raw HTML.
  - Anchor text: change "Read our story" to "Meet Mehdi, the maker" (theme editor, `templates/index.json`).
- Depends on: none
- Domain switch: auto (relative / `shopify://` links)
- How we'd know it failed: the raw HTML of any product page still contains no `href="/pages/about"` inside `<main>`.
- Leading indicator: Search Console > Links > Internal links count for `/pages/about` (at domain switch).

## Findings

### CONT-05: The placeholder reviews make specific claims that are false, and they are labelled "Customer reviews" on 9 pages
- Severity: High
- Evidence:
  - `templates/index.json:509-547` and `templates/product.json:199-228` hold three blocks: "Maya R., Vancouver", "Tomás A., Lisbon" ("It arrived in a gift box with a note about the wood. That is the whole reason I came back.") and "Priya S., Leeds". The region is labelled `"label": "Customer reviews"` and headed "Kind words".
  - They render on `/` and on all 8 product pages, six times each in the HTML, because the loop repeats the cards.
  - Each card conflicts with something on the site: the store ships only within Canada, but two reviewers are in Lisbon and Leeds; gift wrap is switched off and the docs mention only a dust bag, but one review praises a gift box; and the store opened 6 days ago with eight one-off pens, yet one reviewer "came back".
  - There is no Review/AggregateRating markup and no stars, so Google's review-snippet policy is not engaged.
- Why it matters: trust is the factor the QRG weighs most. Invented testimonials that a careful reader can disprove from the shipping region undercut the real story beside them. In Canada, the Competition Bureau treats fake or business-written reviews as possible false or misleading representations under the Competition Act (ss. 52 and 74.01). The owner chose to keep them for now; this is the factual risk.
- Fix (client decision; theme editor):
  - Turn off the `quotes` section in `templates/index.json` and the review wall in `templates/product.json` until real reviews arrive.
  - If the space should stay, fill it honestly in the brand's voice: one attributed line from the family or from Mehdi ("— Mehdi, in the workshop"), or the client's real Marketplace buyer words, used with permission.
  - Never add Review markup for these blocks.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: "Lisbon" or "Tomás A." is still in the HTML of `/` or any `/products/*`.
- Leading indicator: `curl` the home page and grep for "Customer reviews".

### CONT-06: Trust pages are missing: four policies return 404, and the shipping page is "coming soon" but linked from every product
- Severity: High
- Evidence:
  - `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-service` and `/policies/contact-information` all return 404 (only `/policies/privacy-policy` exists).
  - `/pages/shipping-returns` has 21 words: "Shipping and returns details are coming soon. If you have a question about an order, please contact us." Its meta description repeats this.
  - The same text is the "Shipping and returns" tab on all 8 product pages and is linked from the footer.
  - Contact (`/pages/contact`, 67 words) offers a form and `mailto:pegasuspens.co@gmail.com`. It gives no business name or address (no address is a deliberate choice).
- Why it matters: before paying $80 to $180 for an item that cannot be exchanged for another of the same, a buyer needs to know the return terms, shipping time and cost, and who the seller is. Raters look for exactly this. A missing return policy is also a common Merchant Center rejection.
- Fix (Shopify admin > Settings > Policies):
  - Write the refund, shipping, terms and contact-information policies. Then replace the `shipping-returns` page body with the actual terms, or point the footer menu item to the shipping policy.
  - Say plainly what happens with a one-of-a-kind pen (for example, whether a return is accepted within N days in original condition). These are client decisions; do not invent them.
  - Optional: a contact email on the store's own domain at domain switch.
- Depends on: none
- Domain switch: auto (Shopify serves `/policies/*` on any domain); the domain email is manual
- How we'd know it failed: any of the four `/policies/*` paths still returns 404, or "coming soon" is still in `/products/date-seed-pen`.
- Leading indicator: the footer "Shipping and returns" link opens actual terms.

### CONT-07: Product descriptions leave out the facts a buyer needs
- Severity: High
- Evidence (the "About this pen" text on each product page):

| Fact | Present on |
|---|---|
| Species / material | 8 of 8 (e.g. "ebony, maple, oak, padauk, teak and purpleheart") |
| Hours of work | 4 of 8 (date seed 30, olive 8, walnut 7, maple 5); missing on leather, oak, six hardwoods, plum |
| Hardware | 8 of 8, only "gold-tone" (no plating or metal stated) |
| What is in the box | 2 of 8 ("refill insert and a decorative dust bag": leather, date seed) |
| Dimensions (length, diameter) | 0 of 8 |
| Weight | 0 of 8 |
| Mechanism (twist) | 0 of 8 in the descriptions; the theme says "Twist action" on every product page (anatomy) |
| Refill type / size / ink colour | 0 of 8; the theme facts row says "Refillable" on every pen |
| Finish (oil, lacquer, CA) | 0 of 8 |

- Why it matters: a buyer comparing an $80 pen with a $180 one, or picking a gift, asks how long it is, how heavy, how it opens, and which refill fits when the ink runs out. Answer engines quote facts like these, and none are present. Adding them is also the best way to grow the pages toward the content floor (CONT-08).
- Fix (store content, Shopify admin, product description):
  - Add a short specs list under "Details" in each pen's own words: length, barrel diameter, weight, mechanism, refill (standard name, e.g. the cartridge type, once the owner confirms it), ink colour supplied, finish, what is in the box.
  - Theme option: product metafields (e.g. `custom.length_mm`), rendered by the existing `facts` block.
  - Keep the voice, e.g. "14 cm long, about 22 g in the hand. A twist of the barrel brings the tip out."
- Depends on: CONT-13
- Domain switch: n/a
- How we'd know it failed: `/products/date-seed-pen` still has no length or refill name in its HTML.
- Leading indicator: questions about size or refills arriving through the contact form.

### CONT-08: Pages fall below the content floors; actual counts below
- Severity: Medium
- Evidence: visible words in `<main>`, `aria-hidden` excluded. Floors are coverage checks, not ranking factors.

| Page | Floor | Unique copy | All visible text in main |
|---|---|---|---|
| `/` | 500 | about 700 editorial + cards | 938 (1,434 with hidden copies). **Pass** |
| `/pages/about` | 400 | 334 | 334. **Below** |
| Products (8) | 400 | description 161 (date seed) to 270 (plum); leather 215, oak 215, maple 195, olive 207, six 185, walnut 257 | 435 to 540, of which about 270 is shared on every pen (care, shipping placeholder, anatomy, placeholder reviews, facts). **Below** on unique copy |
| Collections (5 material/gift) | 400 | collection description 10 to 17 words (gifts 10, hardwood 17) | 234 to 348, mostly filter/sort UI and card names. **Below** |
| `/collections/all` | 400 | 0 | 338. **Below** |
| `/pages/contact` | n/a | 67 | 67 |
| `/pages/care` | n/a | 27 | 27 |
| `/pages/shipping-returns` | n/a | 21 | 21 |
| `/blogs/news` | n/a | 0 | 1 ("News") |

- Why it matters: collection pages are where material queries land ("olive wood pen", "date seed pen"). One sentence plus filter labels gives a search engine little to rank. The care page, at two sentences, is not yet a page.
- Fix (store content, Shopify admin > Collections > description):
  - Give each material collection 120 to 250 words on the material itself: what segmented wood is, how the leather is layered, where the date seeds come from. Write it in the brand's quiet voice, and use only facts the client confirms.
  - Product pages grow through CONT-07.
  - Care page: a few concrete lines per material, once the owner confirms the Care text.
  - About page: see CONT-09.
- Depends on: CONT-07, CONT-09
- Domain switch: n/a
- How we'd know it failed: the `collection-hero__description` on `/collections/hardwood` is still one sentence.
- Leading indicator: the word count of the collection description in admin.

### CONT-09: The About page's authority claims cannot be checked, and some of its time references will go stale
- Severity: Medium
- Evidence:
  - `templates/page.about.json:128` (theme file, not admin): "Mehdi has spent his career creating furniture and specialty pieces for royal residences, with his work represented in museums and palaces across England and the Middle East." It names no piece, place or year.
  - The same block says "Pegasus Pens Co." where the rest of the site says "Pegasus Pens".
  - "Over the past two years" and "At 75" have no date anchor.
  - There is no photo of Mehdi; the CLAUDE.md notes say none exists yet.
  - The page is 334 words.
- Why it matters: a large claim with no detail invites doubt and cannot be verified, which weighs on authoritativeness. One named, checkable example is worth more than "museums and palaces". The relative dates will be wrong within a year.
- Fix (client decision, then theme editor > About template > story text):
  - Name one or two verifiable commissions or institutions the family is comfortable naming. If none can be named, describe the work concretely instead: a type of piece, a technique.
  - Use "Pegasus Pens" throughout.
  - Replace "over the past two years" with "since 2024" (confirm the year).
  - Add a workshop portrait of Mehdi when one exists, with alt text.
  - Optional: a short "In his words" paragraph from Mehdi, which also brings the page past 400 words.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the "royal residences" sentence is still the only credential and names nothing.
- Leading indicator: brand searches that bring up an outside mention of Mehdi's work (none could be checked here).

### CONT-10: The same passages repeat across product descriptions, and they open with a sales question
- Severity: Medium
- Evidence:
  - Two closing sentences appear word for word on maple, olive, six hardwoods and walnut ("Whether you're shopping for family, friends, a partner, a colleague, a teacher, a client, or simply treating yourself…" and "More than an everyday writing instrument, it's a small piece of a lifelong craftsman's work, made to be used, appreciated and treasured."). That is 62 to 82 shared words per page.
  - 6 of 8 descriptions open "Looking for a … gift …?" (all but date seed and plum).
  - Generic modifiers recur: "beautiful", "elegant", "truly unique".
  - Readability is fine but uneven: Flesch 29.4 (walnut, grade 13.1) to 60.4 (oak, grade 7.6). The walnut "Details" list items run to about 20 words each.
  - Copy repeated on every product page: care, the shipping placeholder, anatomy, reviews.
- Why it matters: repeated blocks thin out what is unique on each page. A rhetorical opening question is the passage least likely to be quoted, and it reads more like a catalogue than the calm voice the theme uses.
- Fix (store content, Shopify admin): keep the client's facts and family voice.
  - Replace each opening question with a first sentence that says what this pen is, e.g. "This pen began as a branch of the plum tree at our family home in North Vancouver."
  - Keep one gift line per pen, written for that pen (for oak: a woodworker; for Khatam: someone who loves Persian art).
  - Split the long walnut list items.
- Depends on: CONT-07
- Domain switch: n/a
- How we'd know it failed: "Whether you're shopping for family" still appears on more than one product page.
- Leading indicator: grep the 8 product HTML files for the two shared sentences.

### CONT-11: An empty blog is linked from every page
- Severity: Medium
- Evidence: `/blogs/news` has an h1 "News", 1 visible word, no meta description and no posts. The main menu "Blog" item links to it 4 times per page (desktop nav, drawer, search "Browse", footer "Browse").
- Why it matters: a site-wide link to an empty page is a dead end for visitors and a thin page for crawlers. The blog is also where the site could earn topical depth (Khatam, date-seed turning, cross-grain cutting) that product pages cannot hold.
- Fix (Shopify admin > Navigation, `main-menu`):
  - Remove "Blog" until the first post is live.
  - Then publish posts from the client's material, in the brand voice: "What Persian Khatam is, and how a few pieces came to sit in a plum branch"; "Thirty hours: how a date seed pen is built"; "Why oak cut against the grain looks the way it does". Link each post to its pen with a relative path.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: the main menu still links `/blogs/news` while the blog has 0 articles.
- Leading indicator: the blog's article count in admin.

### CONT-12: The default "Home page" collection is public and shown as a tile
- Severity: Low
- Evidence: `/collections/frontpage` answers 200 with title "Home page – Pegasus Pens", h1 "Collection: Home page", 1 product (Date Seed Pen) and no description. `/collections` shows a "Home page" tile beside the material collections.
- Why it matters: a visitor sees a meaningless category name, and crawlers get a thin page that duplicates `/collections/date-seed`. The technical agent owns the indexing side; this covers the label and the thin content.
- Fix (Shopify admin > Collections > Home page): remove it from the Online Store sales channel, or delete it if no theme section uses it.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: "Home page" is still in the HTML of `/collections`.
- Leading indicator: the `/collections` tile count drops from 6 to 5.

### CONT-13: Claims the theme makes on every pen are not confirmed by the client's copy
- Severity: Low
- Evidence:
  - Every product page shows "Refillable" (facts row), "Twist action: Twist the barrel to bring the tip out" (anatomy) and "The refill: Swap the refill when the ink runs out". The home page's "Inside a Pegasus pen" repeats them.
  - The client's descriptions confirm a refill insert for 2 of 8 and never mention a twist mechanism.
  - The leather pen's description says "Produced in very limited quantities", while the facts row says "One of a kind, only one made".
  - The known context marks "twist" and "refillable" as awaiting the owner's confirmation.
- Why it matters: a factual error on every product page is the kind of inaccuracy the QRG counts against trust, and a buyer will check it the day the pen arrives.
- Fix (client decision): confirm the mechanism and refill for each pen. If any pen differs, move those facts from the shared theme blocks (`templates/product.json`, theme editor) into that pen's description or a metafield. Ask whether "very limited quantities" should read "one of a kind" (admin).
- Depends on: CONT-07
- Domain switch: n/a
- How we'd know it failed: a pen that is not a twist pen still shows "Twist action".
- Leading indicator: the owner's written confirmation for each of the 8 pens.

### CONT-14: Facts worth quoting exist, but they are not stated in a form an answer engine can lift
- Severity: Low
- Evidence:
  - Quotable facts already on the site: "more than 150 individually handcrafted pens", "German-trained carpenter", "approximately 30 hours" (date seed), "a branch of a tree at our family home in North Vancouver", "Khatam, a centuries-old traditional Persian decorative art…", "six hardwoods: ebony, maple, oak, padauk, teak and purpleheart".
  - What is missing: a self-contained first sentence per product (6 of 8 open with a question, see CONT-10), specs (CONT-07), any question-and-answer prose (refills, care, returns), and dates.
  - Organization JSON-LD `sameAs` lists only Instagram.
- Why it matters: AI answers quote short passages that stand on their own and contain a fact. "Looking for a gift that's genuinely one of a kind?" contains none.
- Fix (store content, admin):
  - Open each description with a fact-bearing sentence.
  - On the Care page and in policies, write plain one-paragraph answers to the questions buyers ask ("What refill does a Pegasus pen take?"). Plain prose only, no FAQPage markup.
  - Keep numbers in the text, not only in images.
- Depends on: CONT-07, CONT-10, CONT-06
- Domain switch: n/a
- How we'd know it failed: the first sentence of each product description still ends in "?".
- Leading indicator: AI search tools quoting product facts when asked about "date seed pen" (spot check, manual).

## Not checked
- External reputation for Authoritativeness: press, mentions of Mehdi's furniture work, Marketplace or Instagram reviews. No web search tool was available to this agent.
- Whether Googlebot's render fills the JS-loaded related products. The Playwright snapshot did not.
- `locales/en.default.json` was not read; the locale key behind the "Collection: " h1 prefix is not confirmed.
- The privacy policy's wording (2,259 words, Shopify's generated template; not reviewed for accuracy).
- `/search`, the cart and the Instagram profile.
- Why `render_page.py` reports `publication_date: 2026-08-25` for `/products/date-seed-pen` (the pen went in today).
- SEO fields directly in Shopify admin; everything here was inferred from the rendered HTML.
