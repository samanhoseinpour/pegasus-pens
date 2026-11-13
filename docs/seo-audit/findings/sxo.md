# Search experience (SXO) findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt) · Date: 2026-11-13 · Agent: sxo
Category score: 58/100. The page types are right (product pages for material queries, collections for category queries), but two pen names mean something else in search, and every persona loses the most points on trust: no shipping or returns terms, placeholder reviews and unproven maker claims.

SXO Gap Score (kept separate from any SEO health score): product page 61, home 60, about 54, collection 52. Weighted toward product pages (0.40 product, 0.25 home, 0.20 collection, 0.15 about), that gives 58.

## What works
- **Product pages are the right page type for material queries.** "olive wood pen" (about 64 % product listings) and "Persian khatam pen" (about 50 % product listings) reward the exact template we have: price, Add to cart, several photos, a description with a Details list. `/products/olive-wood-pen` has 869 words, its price ($100.00) and Add to cart in the first block, and Product + Offer (CAD, InStock) + BreadcrumbList JSON-LD.
- **The product copy is rich, specific and in the brand voice.** It names the species, the source (the North Vancouver plum branch), the technique (oak cut against the grain, layered leather: "The leather becomes the pen."), the hours (about 5, 7, 8 or 30) and the maker. `/products/plum-wood-persian-khatam-pen` already explains what Khatam is, which answers the definition half of that SERP (Wikipedia ranks there).
- **The niches are open.** "handmade pen made from date palm seeds" shows no maker selling one. "khatam inlay wooden pen handmade" shows only vintage pen holders, desk sets and Esfahan pen holders, not a turned pen with khatam inlay. Both pens have almost no competition for their real meaning.
- **There is proof of the craft.** `/products/date-seed-pen` shows workshop photos with specific alt text (`date-seed-pen-blank-workshop.jpg`: "The pen blank in the workshop: trimmed date seeds glued upright around a brass tube…"). That kind of evidence is what craft buyers look for.
- **No review markup.** The review wall has `rating: 0` (`templates/index.json:518-536`, `templates/product.json:199-217`, `show_rating: false` at :248), the page shows no stars and the JSON-LD has no `Review`/`AggregateRating`. So the placeholders create no structured-data policy problem today (SXO-03 covers the trust side).
- **Related pens load.** `/recommendations/products?product_id=15514454032604&limit=4` answered 200 with four pens (one live request). The product page is not a dead end while pens are in stock.
- Product SEO titles already use buyer words ("Handmade Date Seed Pen, One of a Kind, Made in Vancouver"). "Made in Vancouver / Handcrafted in Vancouver, BC" appears in the hero, the facts row and the promises row. That serves the buy-Canadian searcher.

## SERP backwards analysis

Method: WebSearch results (not a live Google page), so no SERP features were visible (see "Not checked"). Each result is classified with the skill's 8-type taxonomy. That taxonomy has no "category" type, so collection and listing pages are counted as "Product (category)", and directories and listicles as "Comparison/editorial".

| Query | Results | Who wins (page types) | Consensus | Our best match | Mismatch |
|---|---|---|---|---|---|
| handmade wooden pen Canada | 16 | Etsy maker listings (5), retailer PDPs (Fendrihan ×2, Goldspot, stylo.ca, eBay, muscatinehistory), Made in Canada directory (×2), Walmart.ca category, penblanks.ca blog (×2) | Product 69 % | `/collections/all` ("Products"), `/collections/hardwood`, home | **MEDIUM**: right type, but our titles never say "wooden pen" or "Canada" (SXO-05, SXO-06). The directory ranks twice (SXO-10). |
| hand turned pen | 21 | Maker PDPs (goimagine ×2, Holtz ×2, Michaels MakerPlace, Galen, eBay, Walmart…), how-to guides (Woodcraft ×2, Rockler, stationery.wiki, WWGOA video, Core77), Etsy forum (×2), category (Tom's Studio, JetPens ×2) | Mixed: Product 48 %, informational 38 % | Product pages | **ALIGNED** for the buying half. The how-to half is hobbyists, not buyers: do not chase it. The About page's five steps already serve the curious. |
| date seed pen | 24 | Plantable "seed pens" (the large majority), date stamps (Midori, Sublo), date palm seeds, a farm-show article | Product ~65 %, **different object** | `/products/date-seed-pen`, `/collections/date-seed` | **HIGH (meaning mismatch)**: the term belongs to plantable seed pens (SXO-01). |
| handmade pen made from date palm seeds | 16 | Touine pen (date palm *fronds*), a date-palm-seed patent, plantable paper pens | none relevant | `/products/date-seed-pen` | Open niche: no seller makes this. Our page can define it. |
| Persian khatam pen | 18 | Vintage pen holders, cases and desk sets (1stdibs ×2, Chairish ×2, eBay ×3, Rockwell, finn.no), Persis Collection pens/holders, Wikipedia + mirrors (×6), World History | Product 50 %, informational 39 % | `/products/plum-wood-persian-khatam-pen` | **ALIGNED**. Our page covers both halves (sells the pen, explains Khatam). |
| khatam inlay wooden pen handmade | 15 | Same vintage/Esfahan listings, Make Magazine on Khatam, Maker Marketplace laser inlays | Product | same | ALIGNED, low competition |
| olive wood pen | 28 | Maker/retailer PDPs (Artemest ×2, Holtz ×2, Holy Land Olivewood ×2, St Patrick's Guild ×2, Folksy, CustomMade, madeit, soulpaper…), pen blanks (Rockler, woodartsupply ×2), pen holders (STL ×2, Galen ×2), forums/blog | Product 64 % | `/products/olive-wood-pen` | **ALIGNED**, but competing titles name the **writing system** ("ballpoint", "fountain", "executive", "slim twist") and the **wood's origin** ("Bethlehem"). Ours names neither (SXO-04). |
| leather pen | 20 | Leather pen cases, sleeves and pouches (Galen, Smythson, Goulet, Gentleman's Gazette, Hender Scheme sleeve…) | Product ~95 %, **different object** | `/products/canadian-leather-pen` | **HIGH (meaning mismatch)**: "leather pen" means a pen case (SXO-01). |
| stacked leather pen handmade | 19 | Still only cases, rolls and valets | Product, different object | same | The trade term does not rescue it. Use descriptive phrasing instead (SXO-01). |
| segmented wood pen handmade | 18 | Maker PDPs (CustomMade, goimagine ×3, Folksy, Reach, Pinkoi…), Udemy course, Fine Woodworking, penturners forum | Product ~65 % | `/collections/segmented-wood`, `/products/six-hardwoods-pen` | **ALIGNED**. Competing pages list the woods and the piece count, as ours do. |
| wooden pen gift for dad | 17 | Gift guides/blogs (Goldspot ×2, Pen Heaven, Treehut, Yanko Design, Dennehey, Gallery Leather ×2, Wordsworth & Black), engraved-pen PDPs (Etsy ×2, Ashton & Finch "…with Gift Pouch for Dad", Executive Gift Shoppe ×2), category (Caran d'Ache Father's Day, The Wood Reserve) | **Blog/gift guide 53 %** | `/collections/gifts` (one sentence) | **MEDIUM-HIGH**: SERP wants a guide, we offer a bare grid. Most winners are engraved or personalised (SXO-07). |
| handmade wooden pen Christmas gift Canada | 18 | Etsy Canadian makers (×5), Vita Magazine holiday gift guide (features an Ontario pen turner), Fendrihan PDP, Walmart.ca, Canadian Woodworking, Exotic Blanks Christmas guide | Product ~55 %, editorial ~30 % | `/collections/gifts` | MEDIUM: editorial gift guides are a way in (SXO-10). |
| handmade pen Vancouver | 19 | Local editorial and listicles (BC Living, Georgia Straight, BCBusiness, Pique, Yellow Pages, Glenn's Pens store guides ×2), local shop PDPs (Buchan's glass dip pens ×2, Hemlock & Oak, Opus ×2, itsumo), Walmart | **Editorial/local 42 %**, Product 37 % | home, `/pages/about` | **MEDIUM**: editorial, local and shop-led. We have no address, no GBP and no pickup, so the way in is off-site mentions, not a local page (SXO-10). |
| "Pegasus Pens" (brand) | 20 | festivalnet "Pegasus Pens" (Irvine, CA), Harrods "Sunday Afternoon Pegasus Ballpoint Pen", Pegasus rotacrylic pen blanks, unrelated pen pages | none ours | home | **Brand SERP not owned** (expected at 6 days old). The name collides with other Pegasus pens (SXO-05). |

**Overall verdict:** no page-type mismatch on our core templates. The main finding is a **meaning mismatch** on two of eight pen names (date seed, leather), plus a **guide-vs-grid mismatch** for gift queries. Ranking demand at page 1 is mostly held by marketplaces (Etsy, eBay, goimagine, CustomMade) and editorial lists, which a 6-day-old store will not displace soon.

## User stories (from the SERP signals above)
1. **Decision, gift buyer.** As someone buying a Christmas pen for my father, I want to know it arrives in time and can be exchanged, because a gift cannot be redone, but I'm blocked by "Shipping and returns details are coming soon" in the product tab and no refund policy. *(Signals: "wooden pen gift for dad", where Ashton & Finch sells "…with Gift Pouch for Dad" and Wordsworth & Black stress the gift case; the Christmas query surfaces Vita Magazine's holiday guide.)*
2. **Consideration, pen enthusiast.** As someone who will write with this pen every day, I want to know whether it is a ballpoint and which refill it takes, because I need to replace it, but I'm blocked by pages that never say "ballpoint" and never name the refill. *(Signals: "olive wood pen" titles such as "ballpoint pen in olive wood", "Executive Pen", "slim twist pen"; the Etsy title "Handcrafted Bocote Wood Twist Style Ballpoint Pen".)*
3. **Awareness, curious craft lover.** As someone who heard of a "date seed pen", I want to see how seeds become a barrel, because the material is the story, but I'm blocked by results full of plantable seed pens. *(Signals: "date seed pen" SERP; "made from date palm seeds" returns no maker.)*
4. **Consideration, Persian-heritage buyer.** As someone searching for Khatam, I want an authentic piece I can use rather than display, because vintage holders are all I find, but I'm blocked by not knowing where the Khatam pieces come from. *(Signals: Khatam SERP of 1stdibs/Chairish vintage holders, the Persis Collection "artisan based in Esfahan", Wikipedia.)*
5. **Consideration, buy-Canadian shopper.** As a Canadian who wants to buy from a local maker, I want proof it is made here and ships quickly within Canada, but I'm blocked because the site never says where it ships. *(Signals: Made in Canada directory ×2 and Etsy "Handcrafted in Canada" for the Canada query; BC Living, Georgia Straight and BCBusiness for Vancouver.)*

## Persona scores
Scored on `/` (home), `/products/date-seed-pen` (product), `/collections/hardwood` (collection; `/collections/gifts` uses the same template and differs only in its one-line intro) and `/pages/about`. Each cell is Relevance/Clarity/Trust/Action (25 each), then the total.

| Persona (SERP source) | Needs | Home | Product | Collection | About | Avg |
|---|---|---|---|---|---|---|
| **Pen enthusiast** (olive wood, hand turned, segmented SERPs) | writing system, refill type, length, weight, finish, real proof | 13/12/9/15 = **49** | 16/11/9/16 = **52** | 12/13/8/15 = **48** | 10/14/12/11 = **47** | **49** |
| **Gift buyer** (gift-for-dad, Christmas SERPs) | price, delivery date, shipping cost, returns, what is in the box, proof | 20/14/8/18 = **60** | 21/12/7/17 = **57** | 15/14/8/18 = **55** | 12/15/13/14 = **54** | **57** |
| **Buy-Canadian shopper** (Canada, Vancouver SERPs) | made here, ships within Canada, CAD, local press | 18/16/10/17 = **61** | 18/15/9/17 = **59** | 14/15/9/17 = **55** | 20/18/13/14 = **65** | **60** |
| **Wood and craft lover** (Khatam, segmented, date seed SERPs) | species, provenance, process, hours, maker, photos | 21/17/12/17 = **67** | 22/18/13/17 = **70** | 16/15/10/17 = **58** | 22/19/14/15 = **70** | **66** |

Evidence behind the scores:
- **Pen enthusiast (weakest, 49).** "ballpoint" or "rollerball" appears in none of the 43 saved pages. The only mention of a twist is the theme's generic anatomy section ("Twist the barrel to bring the tip out…"). The client's descriptions never say it, and CLAUDE.md lists "twist" and "refillable" as unconfirmed. There is no length, weight, diameter, refill model or finish. The collection filters offer only Availability and Price. Fix: SXO-04.
- **Gift buyer (57, highest commercial weight in November).** Prices are clear ($80 to $180). Delivery, shipping cost and returns are missing everywhere: the product tab prints "coming soon", and `/policies/refund-policy` and `/policies/shipping-policy` return 404. Only 2 of 8 pens say what comes with them ("a refill insert and a decorative dust bag" on the date seed and leather pens). The "Ready to give" shelf is the 11th home section, after two pinned scroll sections. Fix: SXO-02, SXO-03, SXO-07.
- **Buy-Canadian (60).** "Handcrafted in Vancouver, BC" is in the facts row and the hero. But "ships within Canada" is not stated anywhere (the only shipping line is "Taxes, discounts and shipping calculated at checkout"), and the contact address is a Gmail address. Fix: SXO-02, SXO-05, SXO-10.
- **Craft lover (66, best served).** The per-pen stories and the About page's five steps are strong. Points are lost to the claims nobody can check ("royal residences", "museums and palaces across England and the Middle East"), the missing photo of Mehdi and collection intros of one sentence. Fix: SXO-09, SXO-06.
- **Systemic issue: Trust** is the lowest dimension for every persona (7 to 14 of 25). Its causes are the same everywhere: placeholder reviews, no shipping or returns terms, and maker claims with no proof. Action is consistently decent (16 to 18): the buy path itself works.

## Gap analysis (SXO Gap Score, product page `/products/date-seed-pen`, 61/100)
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 12/15 | Product type matches the material SERPs. Meaning mismatch for "date seed pen" and "leather pen" (SXO-01). |
| Content depth | 10/15 | 822 words, story plus Details list. No specs, no writing system (SXO-04). |
| UX signals | 9/15 | Price and Add to cart first, facts row, tabs, breadcrumbs. Shipping tab "coming soon". The sold-out state has no path forward (SXO-08). |
| Schema | 9/15 | Product, Offer, BreadcrumbList. No shippingDetails or hasMerchantReturnPolicy, because the policies do not exist (SXO-02). |
| Media | 11/15 | 5 photos incl. workshop shots with specific alt text. No scale or in-hand shot, no video. |
| Authority | 4/15 | Placeholder reviews, no press, brand SERP not owned, unproven maker claims. |
| Freshness | 6/10 | Catalog went in today. Blog empty, shipping page placeholder. |

Home 60 (H1 is the logo, title and description are generic, 1,509 words, Organization schema with empty `sameAs` strings), collection 52 (one-line intro, no breadcrumbs section in `templates/collection.json`, Organization schema only), about 54 (402 words, no maker photo, no meta description).

## Findings
Ordered by persona impact: the weakest persona's fix first, then the systemic trust fixes.

### SXO-01: Two pen names mean something else in search ("date seed pen", "leather pen")
- Severity: High
- Evidence: "date seed pen" returns plantable seed pens, date stamps and date palm seeds. Not one of the 24 results is a pen made from date seeds. "leather pen" (20 results) and "stacked leather pen handmade" (19) return only pen cases, sleeves and valets. Our pages: `/products/date-seed-pen` title "Handmade Date Seed Pen, One of a Kind, Made in Vancouver" (the description says "crafted from date seeds", never "date palm"); `/products/canadian-leather-pen` title "Canadian Leather Pen, Handmade in Vancouver". `/collections/date-seed` and `/collections/leather` have the bare titles "Date seed" and "Leather".
- Why it matters: Google ranks by the meaning searchers intend. The bare terms are owned by other objects, so our pages would get neither the ranking nor the click, and someone who does click expecting a plantable pen or a case leaves at once.
- Fix (store content, Shopify admin > Products and Collections > SEO; keep the visible pen names, they are the brand's): put the disambiguating noun phrase in the SEO title, meta description and first sentence. For example "Date Seed Pen: a pen turned from date palm seeds, handmade in Vancouver", and in the opening line "…from the seeds (pits) of dates…". Leather: "Canadian Leather Pen: a pen body made of layered leather, not a leather case". The copy already has the line "It isn't simply a leather-covered pen. The leather becomes the pen."; move it to the meta description. Do the same for the two collection SEO titles ("Date seed pens: barrels made from date palm seeds").
- Depends on: none
- Domain switch: auto
- How we'd know it failed: at domain switch, Search Console > Performance for `/products/date-seed-pen` shows impressions for "seed pen"/"plantable" queries with near-0 % CTR, and none for "date palm" or "date pit" queries.
- Leading indicator: Search Console queries containing "date palm", "date pit" or "leather body" start appearing for these two paths.

### SXO-02: The gift buyer's deciding facts (delivery, shipping cost, returns) exist nowhere
- Severity: High
- Evidence: `/pages/shipping-returns` (80 words): "Shipping and returns details are coming soon." The same text is pulled into every product page by the "Shipping and returns" tab (`templates/product.json:92-97`, `"page": "shipping-returns"`). `/policies/refund-policy`, `/policies/shipping-policy` and `/policies/terms-of-service` return 404. The only shipping line on the site is the cart's "Taxes, discounts and shipping calculated at checkout". "Ships within Canada" is not stated on any page. Only 2 of 8 descriptions say what is in the box ("a refill insert and a decorative dust bag": date seed and leather).
- Why it matters: this is mid-November and the gift SERPs reward packaging and delivery promises. With one of each pen and no return terms, a careful buyer has no reason to commit. Merchant listings also take shipping and return terms from these policies.
- Fix (client decision first, then Shopify admin > Settings > Policies and > Shipping): the client decides the carrier, cost or free-shipping threshold, the delivery window within Canada, a holiday order-by date and the returns rule for one-of-a-kind pens. Then write the Refund and Shipping policies (Shopify links them in checkout), rewrite `/pages/shipping-returns` in the same calm voice, and state what comes with each pen in every description (if all pens ship with a refill insert and dust bag, say so on all eight). Once confirmed, add one line to the product facts row (the `facts` block in `templates/product.json:65-75` has three slots; change the unconfirmed "Refillable" slot or ask for a fourth). Also replace the home and collection promise "Made to be used" (`templates/index.json:638`, `templates/collection.json:121-125`) with the shipping promise. Use relative links (`/policies/refund-policy`) or `shopify://` links only.
- Depends on: none (other agents cover the policy and schema side)
- Domain switch: auto
- How we'd know it failed: `/policies/refund-policy` still returns 404, or the product tab still contains "coming soon".
- Leading indicator: contact-form messages that ask "when will it arrive?" or "can I return it?" (the Topic field shows "An order"/"A gift").

### SXO-03: The placeholder reviews contradict the store's own facts
- Severity: High
- Evidence: a "Kind words" wall on `/` and on every product page (`templates/index.json:509-546`, `templates/product.json:191-227`), three cards repeated in the HTML (18 `pg-review` items on the home page). "It arrived in a gift box with a note about the wood…" (Tomás A., **Lisbon**) and "I bought one as a gift…" (Priya S., **Leeds**). The store ships only within Canada, has been open 6 days, and its product pages promise a dust bag, not a gift box or a note. No stars and no Review markup are shown (`rating: 0`), so Google's review-snippet policy is not engaged. The section's own preset carries the same three (`sections/pegasus-review-wall.liquid:175-176`).
- Why it matters: Trust is the lowest score for every persona. A buyer who reads "Lisbon" on a Canada-only store, or a gift box the product page does not offer, discounts the whole page. Canada's Competition Bureau treats invented testimonials as deceptive marketing. The owner chose on 2026-11-13 to keep them; this is the risk, stated once.
- Fix (client decision; theme editor): disable the two review-wall sections (the section's "disabled" flag, so their settings are kept) until real reviews exist. Where the wall was, the brand voice can carry a short maker's note or an Instagram link (already in settings). When real reviews arrive, use them as given, with a first name and a Canadian city. If a reviews app adds stars later, keep only reviews from real customers.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: `grep -c "Tomás A." ` on the saved home and product HTML is still above 0 at the next crawl.
- Leading indicator: the first real customer review received (email or app).

### SXO-04: Pen enthusiasts can't find what the pen is: writing system, refill, size
- Severity: Medium
- Evidence: none of the 43 saved pages contains "ballpoint" or "rollerball". The descriptions never say "twist": the only mention is the theme's generic anatomy section (`templates/product.json:137-183`), which CLAUDE.md lists as "to confirm". There is no length, weight, diameter, refill model or finish (oil, wax, CA) on any pen. "Refillable" is in every facts row (`templates/product.json:71`), but only two pens say a refill insert is included. The leather pen says "Produced in very limited quantities", while the facts row says "only one made". Competing "olive wood pen" titles name the system: "…ballpoint pen in olive wood", "Executive Pen", "slim twist pen", "Twist Style Ballpoint Pen".
- Why it matters: the enthusiast is the weakest persona (49/100). "Which refill does it take?" decides whether the pen can be used for years, which the copy itself promises ("made to be used").
- Fix (client supplies the facts; store content): add three or four lines to each description's Details list (writing system, refill type, length and weight, finish). Or, to keep it in one place, add product metafields (writing system, refill, length, weight) and a "Specifications" collapsible tab whose content uses those dynamic sources. Change "Refillable" or "twist" only after the client confirms them. Once confirmed, add "ballpoint" (or the right term) to the SEO title of each pen where it fits.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: the saved product HTML still has 0 matches for the confirmed writing-system term and for "mm" or "g" near a measurement.
- Leading indicator: fewer "what refill" or "how big" questions through the contact form.

### SXO-05: The home page's title, description and H1 don't say what the store sells, and the brand name collides
- Severity: Medium
- Evidence: `/` has `<title>` "Pegasus Pens" and meta description "Handcrafted luxury pens". The H1 is the header logo (`<h1 class="header__heading">` wrapping "Pegasus *Pens*"). The real message ("One pen, one story, never duplicated." / "Handcrafted one at a time in Vancouver, British Columbia, by a German-trained carpenter.") is an h2 in the slider (`templates/index.json:20-21`). The brand SERP shows a "Pegasus Pens" listing in Irvine, CA, Harrods' "Pegasus Ballpoint Pen" and Pegasus rotacrylic pen blanks. Nothing of ours ranks yet. The name varies ("Pegasus Pens" vs "Pegasus Pens Co." on `/pages/about`), and the contact address is a Gmail address (`/pages/contact`).
- Why it matters: for the brand query and for "handmade pen Vancouver", the home title and snippet are what decide the click. "Handcrafted luxury pens" does not tell this store apart from the other Pegasus pens.
- Fix (Shopify admin > Online Store > Preferences): title along the lines of "Pegasus Pens: one-of-a-kind pens, hand-turned in Vancouver". Description from the hero copy: "Eight one-of-a-kind pens of hardwood, leather, date seed and Persian Khatam, each turned by hand in Vancouver by a German-trained carpenter." Settle on one brand name in visible copy. Theme option (header agent's call): on the home page only, let the first slide's heading be the H1 and the logo a non-heading. At domain switch: an address on the shop's own domain, and the Instagram bio link to the new domain.
- Depends on: none
- Domain switch: auto for the title and description; manual at domain switch for email, Instagram and Search Console brand tracking.
- How we'd know it failed: the saved home HTML `<title>` is still "Pegasus Pens" alone.
- Leading indicator: a search for "Pegasus Pens Vancouver" shows our home page with the new snippet.

### SXO-06: Collection titles don't contain "pens", the intros are one line, and "All pens" is titled "Products"
- Severity: Medium
- Evidence: titles "Hardwood – Pegasus Pens", "Segmented wood", "Leather", "Date seed", "Gifts". The H1 is the same bare word. Intros are one sentence (`/collections/hardwood`: "Oak, maple, olive and plum wood, each turned and polished by hand to show its own grain."). `/collections/all`, the target of the hero's "Shop all pens" button, has the title "Products – Pegasus Pens", no meta description, and is not in the sitemap. The "handmade wooden pen Canada" winners put "wooden pen" and "Handcrafted in Canada" in their titles.
- Why it matters: collections are our match for the category-level queries ("handmade wooden pen Canada", "segmented wood pen"), and a title that never says "pen" leaves that relevance unused. It also reads oddly in a results page next to competitors that say what they sell.
- Fix (store content, admin > Collections > SEO): SEO titles such as "Hardwood pens, hand-turned in Vancouver". The visible title can stay short. Add two or three sentences to each intro (what the material is, hours of work, how the pens write once SXO-04 is confirmed). For `/collections/all`: Shopify serves a collection with the handle `all` instead of its built-in one, so create it (condition: all products), titled "All pens", with an intro (verify in admin that the handle takes). The collection template has no breadcrumbs section, which the on-page/schema agents may pick up.
- Depends on: SXO-04 (for the "how it writes" line)
- Domain switch: auto
- How we'd know it failed: the saved `/collections/hardwood` `<title>` still has no "pen".
- Leading indicator: at domain switch, collection paths start getting impressions for "wooden pen"/"wood pens" queries.

### SXO-07: Gift queries want a guide, and we offer a bare grid
- Severity: Medium
- Evidence: "wooden pen gift for dad": 9 of 17 results are gift guides (Goldspot ×2, Pen Heaven, Treehut, Yanko Design, Dennehey, Gallery Leather ×2, Wordsworth & Black), and most product winners are engraved or personalised. Our answer is `/collections/gifts` (430 words, mostly filter UI) with the intro "One-of-a-kind pens for someone who seems to have everything." `/blogs/news` is the default "News" blog with 58 words and no posts. Engraving and gift options are off by the client's choice.
- Why it matters: a guide is the page type that ranks for gift intent and earns gift-guide links. The descriptions already contain the gift material ("A unique Christmas, birthday, anniversary or retirement gift…").
- Fix (store content): one article in the brand voice on the existing blog, for example "A pen for someone who has everything", with the eight pens grouped by who they suit (the reader of history: plum and Khatam; the woodworker: cross-grain oak; the one who has seen it all: date seed). Two lines and the price for each, what comes in the box and the delivery facts from SXO-02. Link each pen with a relative path. Expand the gifts collection intro the same way, more briefly. Engraving remains a client decision; note only that the gift SERP rewards it.
- Depends on: SXO-02
- Domain switch: auto
- How we'd know it failed: `/blogs/news` still has 0 articles at the next crawl.
- Leading indicator: sessions landing on the article, and clicks from it to `/products/*`.

### SXO-08: A sold pen's page has no path forward
- Severity: Medium
- Evidence: every pen is stocked at 1. When it sells, `snippets/buy-buttons.liquid:88-100` (identical on origin/main) turns the button into "Sold out" and nothing else changes. "You may also like" loads only on scroll, after the anatomy and review sections (it was not in the 3.2 s Playwright render; it does return four pens when requested). The newsletter "New pens, first" is only in the footer.
- Why it matters: a one-of-a-kind store sells out of each pen once, so after a while most product URLs will be sold. They hold the story, the photos and any links earned, so they should stay live (200, with Shopify switching the JSON-LD to OutOfStock on its own). The visitor needs a next step at the point where the button used to be.
- Fix (theme file, a small snippet rendered beside the buy buttons when the variant is unavailable): a line such as "This pen has found its owner." with a link to its material collection, using the breadcrumbs' own lookup (`collections[product.type | handleize].url`), and a link to the newsletter. Do not redirect sold pens, and do not unpublish them. Optional (client decision): a "Past pens" collection as a portfolio for craft lovers.
- Depends on: none
- Domain switch: auto
- How we'd know it failed: after the first sale, that product page shows "Sold out" and no link within the buy block.
- Leading indicator: on sold pens, clicks from the product page to a collection or the newsletter signup.

### SXO-09: The maker's credentials are stated but never shown
- Severity: Medium
- Evidence: `/pages/about`: "creating furniture and specialty pieces for royal residences, with his work represented in museums and palaces across England and the Middle East" and "more than 150 individually handcrafted pens". The home repeats "royal residences". No piece, museum or residence is named, there is no photo of Mehdi (CLAUDE.md confirms), and `/pages/about` has no meta description. The About page's only photo is `pegasus-workshop-date-seeds.jpg`.
- Why it matters: with no real reviews yet, the maker is the store's main source of trust. A claim the reader cannot check reads as marketing, and a checkable one reads as expertise. This is the gap holding the craft lover at 66 and the gift buyer's trust at 7 to 13.
- Fix (client decision; store content): name one or two pieces or places the client is comfortable naming, or soften the claim to what can be shown. Add a photo of Mehdi at the lathe (the image setting of the About story section), reuse the date-seed workshop photos, and write a meta description from the hero lead. A Person/founder entity is the schema agent's call.
- Depends on: SXO-03
- Domain switch: n/a
- How we'd know it failed: the About page still has no image showing the maker and the claim still names nothing.
- Leading indicator: time on `/pages/about` and clicks from its "Ready to choose?" pills.

### SXO-10: Page 1 is held by marketplaces, directories and local editors, so get listed there
- Severity: Medium
- Evidence: "handmade wooden pen Canada": Made in Canada directory ×2 (`/pens-made-in-canada`, a maker listing), Etsy makers ×5. "handmade pen Vancouver": BC Living, Georgia Straight, BCBusiness, Pique, Glenn's Pens store guides, Buchan's (which sells a local artisan's pens). The Christmas query: the Vita Magazine holiday gift guide features an Ontario pen turner.
- Why it matters: a 6-day-old domain will not outrank those soon, but a listing on them is clicked now and passes trust to the domain.
- Fix (client decision; off-site): submit to the Made in Canada directory; pitch the maker story (a 75-year-old German-trained carpenter, the family plum tree, Khatam) to Vancouver gift guides this season; consider consignment with a local stationer. Whether to open an Etsy shop is a business choice. Every listing should use the final domain, so do this at or after the domain switch, or update the links then.
- Depends on: SXO-02, SXO-05
- Domain switch: manual (listings carry the host)
- How we'd know it failed: no referral sessions from any directory or press domain within 60 days of the switch.
- Leading indicator: referral traffic and new referring domains in Shopify Analytics.

### SXO-11: The home spotlight cuts the description mid-word
- Severity: Low
- Evidence: `/` spotlight text ends "…This isn..." (`sections/pegasus-spotlight.liquid:25`, origin/main: `truncate: 220`). The section has a `text` setting ("Leave empty to use the start of the product description", :120-122) that is empty.
- Why it matters: it is the home page's featured pen, and the broken sentence works against the literary tone.
- Fix (theme editor, store content): fill the spotlight's `text` setting with one complete sentence. Alternatively, change the theme to `truncatewords`.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the home HTML still contains "This isn...".
- Leading indicator: n/a

### SXO-12: Khatam and date seed are the pens to lead with in search
- Severity: Info
- Evidence: for both, the SERPs show no competing maker for the real meaning (see the table).
- Why it matters: these are the queries where a new domain can rank first, because nobody else answers them.
- Fix: once SXO-01 is applied, give these two pens the strongest internal links (the spotlight already features the date seed pen; slide 2 features plum and Khatam). Say where the Khatam pieces come from, if the client knows.
- Depends on: SXO-01
- Domain switch: auto
- How we'd know it failed: at domain switch, neither path appears in the top 10 for its own descriptive query after 90 days.
- Leading indicator: Search Console position for "khatam pen" and "date palm seed pen".

## Not checked (limitations)
- **SERP features**: the search tool returns links, not a live Google page. People Also Ask, ads, the Shopping carousel, AI Overview, featured snippets and local packs were **not observed**, and no conclusion here relies on them. Result counts and type shares come from one search per query, US-based.
- **Our own rankings and impressions**: no Search Console, and the store is 6 days old. Whether any of our pages are indexed or ranking was not checked.
- **Mobile above-the-fold**: I worked from the saved HTML and the desktop Playwright renders. No phone viewport or screenshots (the visual agent's area). The UX scores for the motion layer (pinned sections, autoplay slider) come from the DOM order, not from measured scroll depth.
- **Sold-out behaviour**: inferred from `buy-buttons.liquid`. No pen has sold, so the live sold-out page was not seen.
- **Checkout**: shipping rates and destinations at checkout were not tested. "Ships within Canada" comes from the brief.
- **Wireframes**: not generated (not requested).
- The Competition Bureau's position is summarised, not quoted. Searches were limited to category terms and the brand name.

Generate a PDF report? Use `/seo google report`. Related deep dives: `/seo content` (E-E-A-T, SXO-03/09), `/seo schema` (shipping and return policy on Offer, Person), `/seo page` (collection pages).

## Sources (web searches, 2026-11-13)
- Canada / Christmas: [Made in Canada directory: pens](https://madeincanadadirectory.ca/pens-made-in-canada), [Drummond Pens listing](https://madeincanadadirectory.ca/item/drummond-pens), [Atelier du Bon Bouleau (Etsy)](https://atelierdubonbouleau.patternbyetsy.com/listing/710064673/canadian-maple-sugar-wood-pen), [Fendrihan e+m Move](https://www.fendrihan.ca/products/e-m-holzprodukte-move-wooden-ballpoint-pen), [Walmart.ca wooden pens](https://www.walmart.ca/en/c/kp/wooden-pens), [Vita Magazine](https://vitamagazine.com/?p=43282), [Pens by Bill (Etsy)](https://pensbybillstore.patternbyetsy.com/listing/784743063/handcrafted-bocote-wood-twist-style)
- Hand turned: [Woodcraft: the mighty pen](https://www.woodcraft.com/blogs/woodturning/the-mighty-pen), [Rockler pen turning basics](https://www.rockler.com/learn/pen-turning-basics), [goimagine walnut slimline](https://goimagine.com/hand-turned-walnut-slimline-twist-pen/), [Tom's Studio](https://tomsstudio.com/collections/studio-handmade-conversion-kit-siblings)
- Date seed: [Seed Pen (showyourlogo)](https://www.showyourlogo.com/product/seed-pen/), [seedballs seed pens](https://seedballs.in/collections/seed-pencils/seed-pen), [Touine pen (The National)](https://www.thenationalnews.com/lifestyle/luxury/2021/11/22/touine-the-homegrown-pen-paying-tribute-to-the-region), [USPTO patent gazette](https://patentsgazette.uspto.gov/week39/OG/html/1526-4/US12098506-20240924.html)
- Khatam: [1stdibs persian khatam](https://www.1stdibs.com/buy/persian-khatam), [Chairish khatam pen holder](https://www.chairish.com/product/3942760/vintage-persian-khatam-pen-holder), [Persis Collection khatam pen](https://www.persiscollection.com/product/khatam-pen), [Wikipedia: Khatam](https://en.wikipedia.org/wiki/Khatam), [Make: Khatam](https://makezine.com/article/craft/heirloom-tech-inlaid-micro-geometries-khatam/)
- Olive wood: [Artemest olive wood ballpoint](https://artemest.com/products/contemporanea-marbled-black-ballpoint-pen-in-olive-wood), [CustomMade executive pen](https://www.custommade.com/executive-pen-in-olive-wood-satin-finished-accents/by/repearson/), [Holtz Bethlehem olive](https://holtzleather.com/collections/hand-turned-pens/products/hand-turned-bethlehem-olive-wood-pen-pen-sleeve), [Monasterevin Bethlehem slim twist](https://www.monasterevmc.org/en-us/products/bethlehem-olive-wood-slim-twist-pen)
- Leather: [Galen Leather pen cases](https://www.galenleather.com/collections/leather-pen-cases/pen_sleeve), [Hender Scheme leather pen](https://www.shopneighbour.com/products/hender-scheme-leather-pen), [Smythson pen sleeve](https://www.smythson.com/products/navy-pen-sleeve-in-panama)
- Segmented: [CustomMade segmented pen](https://www.custommade.com/handmade-hand-crafted-segmented-wooden-pen-blue-or/by/woodenexpressions/), [goimagine segmented click pen](https://goimagine.com/segmented-wood-click-pen-paduak-wenge-yellowheart-mahogany)
- Gift for dad: [Goldspot Father's Day pen gifts](https://goldspot.com/blogs/magazine/best-fathers-day-pen-gifts), [Pen Heaven gift guide](https://www.penheaven.co.uk/blog/father-s-day-gift-guide-the-perfect-pen-to-match-your-dad-s-style), [Ashton & Finch](https://www.ashtonandfinch.com/products/best-father-always-pen), [Wordsworth & Black](https://wordsworthandblack.com/blogs/news/best-fountain-pen-gifts-for-fathers-day-2026-picks-at-every-budget), [Treehut](https://treehut.co/blogs/gifts/best-wooden-gifts-for-dad)
- Vancouver: [Buchan's glass dip pen](https://www.buchanst.com/products/copy-of-hand-made-color-glass-dip-pen-by-artisan-janelle-tyler-blue-and-white-with-5ml-waterproof-black-ink), [BC Living](https://www.bcliving.ca/vancouvers-finest-paper-and-stationery), [Pique](https://www.piquenewsmagazine.com/lifestyle/best-vancouver-stationery-stores-5428262), [BCBusiness](https://bcbusiness.ca/?p=36638), [Hemlock & Oak brass pen](https://hemlockandoak.com/products/brass-pen)
- Brand: [festivalnet "Pegasus Pens"](https://festivalnet.com/Pegasus-Pens), [Harrods Pegasus ballpoint](https://www.harrods.com/en-mc/p/harrods-sunday-afternoon-pegasus-ballpoint-pen-000000000007756349), [Exotic Blanks Pegasus rotacrylic](https://exoticblanks.com/products/pegasus-rotacrylic-pen-blanks-emerald-hi-lights)
