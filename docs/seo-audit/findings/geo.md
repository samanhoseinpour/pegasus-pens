# AI Search Readiness (GEO) findings
Audited host: rjxgij-f1.myshopify.com (from host.txt) · Date: 2026-11-13 · Agent: geo
Category score: 56/100. Crawlers can reach every page and the text is server-rendered. But the brand name belongs to at least three other hand-turned pen makers, the index still holds the placeholder copy, and the store has no shipping or returns facts, so an answer engine cannot yet tell reliably who this maker is or what buying from them involves.

| Dimension | Weight | Score | Basis |
|---|---|---|---|
| Citability | 25% | 55 | Concrete facts exist (materials, hours, Vancouver, the maker), but most product descriptions open with a gift question instead of the defining fact |
| Structural readability | 20% | 60 | Clean H1/H2/H3, numbered process steps, open description tab; inline name+text spans run together in extracted text |
| Multi-modal | 15% | 55 | Several photos per pen and a drawn anatomy; no video anywhere (the strongest mention signal) |
| Authority & brand | 20% | 25 | Name collision, Instagram the only profile, uncorroborated maker claims, placeholder reviews, 8 empty `sameAs` entries |
| Technical accessibility | 20% | 85 | All AI crawlers allowed, SSR, sitemaps, old handles 301; policy URLs 404 |
| **Weighted** | | **56** | |

Platform estimates (inferred from what each one can retrieve today; no live answers were queried): Google AI Overviews 35 · ChatGPT Search 25 · Perplexity 30 · Bing Copilot 25. Bing's index (which ChatGPT Search and Copilot draw on) still shows the placeholder descriptions (GEO-03). Google has its own crawl and is likely less stale, but that was not verified.

## What works
- **Every AI crawler is allowed.** `/robots.txt` has only `User-agent: *` (`Allow: /`, Disallow on cart/checkout/account/filters) and an `adsbot-google` group. No group names GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended or Bingbot, so all of them get the `*` rules and may fetch every public product, collection, page and blog URL. Per capability:
  - Search and answer citation: OAI-SearchBot (ChatGPT Search), Claude-SearchBot (Claude search), PerplexityBot, Bingbot (Bing and Copilot) and Googlebot (Search and AI Overviews) are allowed.
  - Training and grounding: GPTBot, ClaudeBot, CCBot, Applebot-Extended (Apple Intelligence training only) and Google-Extended (Gemini/Vertex training and grounding; it has no effect on Search or AI Overviews inclusion) are allowed too. Blocking these is optional and a client decision, and it does not affect search citability.
- **Server-rendered text.** The full product descriptions, the About story and the five process steps are in the raw HTML (`CRAWL/pages/products_date-seed-pen.html`, `pages_about.html`), so no JavaScript is needed to read them.
- **Self-contained, specific facts already exist.** Per-pen meta descriptions state the material and the hours (e.g. `/products/six-hardwoods-pen`: "ebony, maple, oak, padauk, teak and purpleheart"; `/products/date-seed-pen`: "about 30 hours of work"; maple 5 h, walnut 7 h, olive 8 h). `/pages/about` says "Mehdi", "German-trained carpenter", "At 75", "more than 150 individually handcrafted pens", "Vancouver, British Columbia", and names the North Vancouver plum branch.
- **Product JSON-LD** carries `brand` "Pegasus Pens", `category` (the material), a CAD `Offer` and `InStock`, and the product pages have `BreadcrumbList`. No Review or AggregateRating markup exists (searched the product HTML for `aggregateRating`, `reviewRating`, `"Review"`: absent).
- **Old placeholder handles redirect.** Probed live on 2026-11-13: `/products/laminated-wood-pen` 301 to `/products/six-hardwoods-pen`, `/products/burl-hourglass-pen` 301 to `/products/plum-wood-persian-khatam-pen`.
- **No RSL licence line** in robots.txt, and none is needed.

## Findings

### GEO-01: "Pegasus Pens" is also the name of at least three other hand-turned pen makers
- Severity: High
- Evidence (Yahoo web search, which uses Bing's index, 2026-11-13):
  - facebook.com/p/Pegasus-Pens-100051669025976/: "My Hand turned pens and crafts My website www.pegasuspens.com", 560 to 587 likes, a 2021 post selling cufflinks in pounds.
  - facebook.com/PegasusPens/: "Pegasus Pens - Veteran's Workshop", regimental and military pens, 228 followers (Dec 2024).
  - Etsy shop `PegasusPens` (etsy.com/uk/shop/PegasusPens, /ie/, /ca-fr/): a veterans' woodworking workshop, "2 sales since 2020".
  - festivalnet.com/Pegasus-Pens/info: "Pegasus Pens, Irvine, CA", hand-crafted pens from domestic and exotic woods and acrylics.
  - The same name is also used by novelty "Pegasus" pens (Planet Pens, Lopenle on Amazon), an Etsy "Pegasus pen" category, a Myers Pen Co "Pegasus" resin blank and Pegasus Pins (Kentucky Derby). Unquoted "Pegasus" is dominated by Pegasus Airlines, NSO's spyware, Pegasus Spiele and Pegasus bikes.
  - `pegasuspens.com` answers 302 to a HugeDomains sale page (NameBright DNS): the UK maker's old domain is lapsed and for sale. `pegasuspens.ca` is registered (GoDaddy name servers; owner unknown).
  - On the site the identity is thin. The shop's description is "Handcrafted luxury pens": it is the home meta description and the `og:description` fallback on `/pages/about` and `/pages/contact`, with no place or maker. The `/pages/about` H1 "Where your pen comes from." does not name the brand. The About page and the Marketplace listing also say "Pegasus Pens Co.".
- Why it matters: answer engines resolve a name to one entity. With four same-name makers in the same niche (two of them UK, one in California), "Who makes Pegasus Pens?" can return the wrong maker or a mix of them. The site has to carry the disambiguators: Vancouver, British Columbia, Mehdi, one-of-a-kind, date seed and Persian Khatam.
- Fix:
  - Store content (Shopify admin > Online Store > Preferences): change the home meta description to one calm sentence that names the place and the maker, e.g. "One-of-a-kind pens turned by hand in Vancouver, British Columbia, by Mehdi, a German-trained carpenter." Also give `/pages/about` its own SEO description.
  - Store content: open the About lead with "Pegasus Pens is…" (the lead paragraph already nearly does). Write the name the same way everywhere ("Pegasus Pens", with "Pegasus Pens Co." declared as an alternate name in GEO-02).
  - Off-site (client): put "Vancouver, BC" and the site link in the Instagram bio and in every Marketplace listing.
  - At domain switch (client decision): pick a domain that carries no other maker's history. Check whether the client already owns `pegasuspens.ca`. `pegasuspens.com` is buyable, but its past (and any links to it) belongs to the UK maker.
- Depends on: GEO-02
- Domain switch: manual (the domain choice and the Instagram bio link)
- How we'd know it failed: 8 weeks after the domain switch, a search for "Pegasus Pens" pen with a Canadian locale, or the same question put to ChatGPT or Perplexity, still returns the UK or Irvine maker first, or describes no Vancouver maker.
- Leading indicator: the brand query in Search Console (after verification) shows impressions for "pegasus pens vancouver" or "pegasus pens"; AI-referral visits (chatgpt.com, perplexity.ai) appear in Shopify Analytics referrers.

### GEO-02: Organization JSON-LD has eight empty `sameAs` entries, a page-specific `url` and nothing that identifies the maker
- Severity: Medium
- Evidence: `sections/header.liquid:458-479` (origin/main). Lines 466-476 print all nine social settings, blank or not, so every page outputs `"sameAs": ["", "", "", "https://www.instagram.com/pegasus.pens/", "", "", "", "", ""]`. Line 477 is `"url": {{ request.origin | append: page.url | json }}`, so on `/pages/about`, `/pages/care`, `/pages/contact` and `/pages/shipping-returns` the Organization `url` is that page, not the home page. There is no `logo` (the store has no logo image; the header uses the wordmark snippet), no `@id`, no `description`, no `alternateName` and no location.
- Why it matters: the Organization node is the machine-readable claim "this site is this brand". Empty strings are invalid URLs, and a `url` that changes from page to page gives parsers several brand homes. Without a location or an alternate name, the node cannot separate this maker from GEO-01's namesakes.
- Fix (theme file `sections/header.liquid`, dynamic sources only):
  - `"@id": {{ request.origin | append: routes.root_url | append: '#organization' | json }}`
  - `"url": {{ request.origin | append: routes.root_url | json }}`
  - Print `sameAs` from a loop that outputs only non-blank links, comma-separated, without a `}` inside any `{{ }}` (see the Liquid trap in CLAUDE.md).
  - `"logo"`: fall back to `{{ 'pegasus-emblem-large.webp' | asset_url | prepend: 'https:' | json }}` when `settings.logo` is blank.
  - `"description": {{ shop.description | json }}` (fed by GEO-01's new meta description).
  - `"alternateName": "Pegasus Pens Co."`
  - `"foundingLocation"`: a `Place` with a `PostalAddress` holding only `addressLocality` Vancouver, `addressRegion` BC, `addressCountry` CA (no street, because none is published).
  - A `founder` Person ("Mehdi") only if the family agrees (client decision).
  - Validate with the Rich Results Test (enter the code, not a URL) before pushing.
- Depends on: none (GEO-01 supplies `shop.description`)
- Domain switch: auto (`request.origin` and `routes.root_url` follow the domain)
- How we'd know it failed: the JSON-LD on `/pages/about` still has `"url"` ending in `/pages/about`, or `sameAs` still contains `""`.
- Leading indicator: once Search Console is verified, it reports no structured-data errors for Organization, and a brand-panel or knowledge result for the store shows the emblem.

### GEO-03: Search indexes still describe the placeholder catalog (burl, laminated, resin, "twist action, refillable cartridge")
- Severity: Medium
- Evidence: Yahoo results on 2026-11-13 show:
  - `/products/burl-hourglass-pen` as "burl wood hourglass-shaped barrel… twist action, and a refillable cartridge".
  - `/products/laminated-wood-pen` as "laminated wood… twist action, and a refillable cartridge".
  - The home page as "Hand-turned wood and resin pens with gold hardware, made in British Columbia."

  The live home meta description is "Handcrafted luxury pens", and no resin, burl or laminated pen exists now. Both old handles 301 correctly (see What works). CLAUDE.md lists "twist" and "refillable" as still unconfirmed by the owner.
- Why it matters: ChatGPT Search and Copilot rely on Bing's index. Until it refreshes, they can cite materials and features the client never offered. That is a factual risk with one-of-a-kind items.
- Fix: keep the 301s; never reuse those handles. At domain switch, verify the domain in Bing Webmaster Tools, submit `/sitemap.xml` and request a recrawl of the redirected URLs and the home page. Until the owner confirms "twist" and "refillable", keep them out of new copy (they still appear in the anatomy section, see GEO-07).
- Depends on: GEO-01 (new home meta description)
- Domain switch: manual (Bing Webmaster verification and submission)
- How we'd know it failed: 4 weeks after the Bing submission, a Bing or Yahoo search for the store's brand still shows a burl, laminated or resin snippet.
- Leading indicator: Bing Webmaster Tools "URL inspection" shows the new title for the home page; fewer hits to the old handles in Shopify's redirect reports.

### GEO-04: No shipping, returns or terms facts anywhere, so answer engines and shopping agents cannot answer "can I buy this and send it back?"
- Severity: High
- Evidence: `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-service` and `/policies/contact-information` return 404. `/pages/shipping-returns` and the "Shipping and returns" tab on every product page read "Shipping and returns details are coming soon." `/agents.md` "Store Policies" lists only the privacy policy. `/.well-known/ucp` advertises `dev.ucp.common.ask` (agents can "ask questions about the store and its policies") with nothing to answer from.
- Why it matters: shipping region, cost and the return window are the questions AI shopping answers try to settle before recommending a store. For a $80 to $180 one-of-a-kind gift, an engine that finds "coming soon" either says so or leaves the store out.
- Fix: store content. In Shopify admin > Settings > Policies, write the refund, shipping and terms policies; the contact-information policy may require a business address (client decision). Then replace the `/pages/shipping-returns` text with a short factual summary that links to the policies. Shopify adds filled policies to `/agents.md` itself. No theme change is needed.
- Depends on: the policy findings in the technical and content reports (same root cause)
- Domain switch: auto
- How we'd know it failed: `/agents.md` still lists only the privacy policy, or `/policies/refund-policy` still returns 404.
- Leading indicator: `/agents.md` "Store Policies" shows four entries; fewer contact-form messages asking about shipping.

### GEO-05: Product descriptions open with a gift question, not the fact an engine would quote
- Severity: Medium
- Evidence: Product JSON-LD `description` (Shopify's description field):
  - `/products/canadian-leather-pen` opens "Looking for a gift they definitely won't already have?". `/products/cross-grain-oak-pen`, `/products/maple-wood-pen`, `/products/olive-wood-pen`, `/products/six-hardwoods-pen` and `/products/walnut-rosewood-maple-acrylic-pen` open with the same "Looking for a … gift" question.
  - `/products/date-seed-pen` opens "A truly unique handmade pen, crafted right here in Vancouver by our dad." "Our dad" is never named on any product page; "Mehdi" appears only on `/pages/about` and the home page.
  - The defining facts sit lower in a "Details" list, as bullets without the pen's name ("Approximately 30 hours of work goes into each pen").
- Why it matters: extractive answers favour the first sentence of a block, and that sentence should stand on its own. "Looking for a gift…?" carries no fact, and "our dad" means nothing outside the page.
- Fix: store content (Shopify admin, each product's description). Add one self-contained opening sentence in the brand's calm voice, e.g. "The Date Seed Pen is a one-of-a-kind pen made from date seeds, shaped and polished by hand in Vancouver, British Columbia, by Mehdi, a German-trained carpenter, over about 30 hours." Keep the gift paragraph after it. Use only facts already in the client's documents: hours where known (date seed 30, olive 8, walnut 7, maple 5), material, place, maker, gold-tone hardware, and the refill insert and dust bag where stated. Leave the hours out where the documents do not give them.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the first 50 words of a product's JSON-LD `description` still contain no material, no place or no maker.
- Leading indicator: Google or Bing snippets for product pages start with the pen's name and material instead of the question.

### GEO-06: The About page's strongest claims are unnamed and unsourced
- Severity: Medium
- Evidence: `/pages/about` (from `templates/page.about.json`, `sections/pegasus-page-hero.liquid`, `sections/pegasus-process.liquid`): "has spent his career creating furniture and specialty pieces for royal residences, with his work represented in museums and palaces across England and the Middle East". No residence, museum, workshop or training place is named. Title "About – Pegasus Pens"; no meta description (falls back to the shop's "Handcrafted luxury pens"). There is no photo of the maker (CLAUDE.md). "Created more than 150 individually handcrafted pens" sits beside 8 pens on the site, with no word on where the others went.
- Why it matters: engines weigh claims they can corroborate. An unnamed "royal residences" claim is either skipped or repeated without support, and it is the claim a sceptical reader would test. One named, checkable detail does more for E-E-A-T than the superlative.
- Fix: client decision on the copy. Add one or two checkable specifics the family is happy to publish, such as where and when he trained, one named commission or institution, or a workshop photo of Mehdi. Otherwise soften the sentence to what can be shown. A short line on the 150 pens ("most went to family, friends and commissions", if true) closes the gap. Add an SEO description for the page in the admin. Keep the voice as it is.
- Depends on: GEO-01
- Domain switch: n/a
- How we'd know it failed: the page still names no person, place or institution beyond "Mehdi", "Vancouver" and "England and the Middle East".
- Leading indicator: AI answers that describe the maker quote a named detail rather than "royal residences".

### GEO-07: Names and their text run together in extracted text (anatomy parts, review bylines)
- Severity: Low
- Evidence: `/products/date-seed-pen` raw HTML: `<strong class="pg-anat__name">Twist action</strong><span class="pg-anat__text">Twist the barrel…` with no whitespace between the tags, so text extraction yields "Twist actionTwist the barrel…", "ClipHolds the pen…" and "Turned barrelShaped by hand…". The review byline does the same: `<strong>Maya R.</strong><span>Vancouver</span>` becomes "Maya R.Vancouver".
- Why it matters: boilerplate-stripping extractors (the kind answer engines use) read the text, not the CSS layout, so each part definition becomes a garbled passage. The anatomy copy also states "twist" and "Refill… swap", which the owner has not confirmed (GEO-03).
- Fix: theme files `sections/pegasus-anatomy.liquid` and `sections/pegasus-review-wall.liquid`. Output a real separator between name and text: `{{ ' ' }}` (a bare space inside a whitespace-only branch is dropped, see CLAUDE.md), or mark the parts up as `<dl>` with `<dt>`/`<dd>`. Check on the real engine. Wording stays until the owner confirms it.
- Depends on: GEO-03 (wording confirmation)
- Domain switch: n/a
- How we'd know it failed: the extracted text of a product page still contains "Twist actionTwist".
- Leading indicator: none beyond re-running a text extraction on one product page.

### GEO-08: Placeholder reviews are machine-readable as customer sentiment
- Severity: High
- Evidence: `/products/date-seed-pen` repeats "Maya R." 6 times (Tomás A. and Priya S. likewise) in the review wall, and the home page has the same cards. The quotes describe things that cannot have happened: "It arrived in a gift box with a note about the wood" (gift options are off), "the whole reason I came back" (a 6-day-old store). There is no Review or AggregateRating markup.
- Why it matters: answer engines summarise on-page testimonials as "customers say…", which would put invented praise into their answers about this store. Invented reviews also fall under the Competition Act's deceptive-marketing rules. (The owner chose to keep them for now. This is stated once, as a risk.)
- Fix: client decision. Replace the three cards with real words from buyers when they exist, or switch the section off until then. Do not add review markup for them.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: an AI answer about the store quotes or paraphrases "made for my hand" or "arrived in a gift box".
- Leading indicator: the review blocks in `templates/index.json` and `templates/product.json` carry real names that match orders.

### GEO-09: Off-site brand signals are one Instagram account and Marketplace listings
- Severity: Medium
- Evidence:
  - The theme's only social setting is `https://www.instagram.com/pegasus.pens/` (display name "PEGASUS PENS 🪽"; bio and followers were not readable behind the login wall).
  - A Facebook Marketplace listing (facebook.com/marketplace/item/1783870212936180) is titled "One-of-a-Kind Wooden Pen | Exotic Hardwoods | Handcrafted in …" and calls the maker "Pegasus Pens Co., a small family business".
  - Reddit: `"pegasus pens" site:reddit.com` returns only Pegasus Pins threads. No YouTube channel or video was found, and there is no Wikipedia article ("Pegasus pen" has no match on English Wikipedia).
- Why it matters: YouTube, Reddit and Wikipedia mentions correlate with AI citation far more than backlinks do. Right now the namesakes in GEO-01 have more indexed mentions than this maker.
- Fix (client, off-site):
  - The client's notes already plan short YouTube clips of the workshop (in Farsi or German, per CLAUDE.md). Short clips with English titles that name the pen, the material and Vancouver are the cheapest strong signal. Then set `social_youtube_link` in the theme settings so the link reaches the footer and `sameAs`.
  - Mention the store name and place in every Marketplace listing.
  - Do not create a Wikipedia page: the brand does not meet notability, and a deleted article hurts. Independent coverage (a local paper, a craft fair or a woodturning club feature) comes first.
- Depends on: GEO-02 (so new profiles flow into `sameAs`)
- Domain switch: manual (profile bios and links must point at the new domain)
- How we'd know it failed: 3 months on, a search for "Pegasus Pens" Vancouver still returns only the store and Marketplace.
- Leading indicator: Instagram and YouTube referral sessions in Shopify Analytics; a brand query from Canada in Search Console.

### GEO-10: Shopify's robots.txt, `/agents.md` and `/.well-known/ucp` (platform files, assessed only)
- Severity: Info
- Evidence:
  - **robots.txt:** the comment header addressed to AI agents (a recommendation to install a Shop shopping skill, and the agent rules) is a comment, not a crawl directive, so no crawler's access changes.
  - **`/agents.md`** (`text/markdown`, listed in `/sitemap_agentic_discovery.xml`) is a generic Shopify template: the Shop skill, UCP/MCP and WebMCP instructions, read-only browsing via the sitemap, and only the privacy policy. It contains no description of the brand, the maker or the products, and reads "Pegasus Pens's online store".
  - **`/.well-known/ucp`** (also announced in a `Link: </.well-known/ucp>; rel="ucp"` header on every response) advertises:
    - an MCP endpoint at `/api/ucp/mcp`;
    - catalog search and lookup, cart, checkout, discount, fulfillment (shipping only), order, buyer consent, "ask" and Shop account identity linking;
    - a `/buy` permalink;
    - Google Pay (merchant name "Pegasus Pens", `merchant_origin` = the handle) and Shopify card handlers.

  Nothing in them is private beyond what every Shopify store publishes.
- Why it matters: these files let AI agents shop the store, which is a plus. Their only store-specific content is the policy list, which GEO-04 fixes.
- Fix: none in the theme. The theme has no `templates/robots.txt.liquid` (CLAUDE.md: `gift_card.liquid` is the only Liquid template), and adding one to strip Shopify's header is not recommended. Fill the policies (GEO-04) so `/agents.md` and the "ask" capability have answers.
- Depends on: GEO-04
- Domain switch: auto (Shopify generates the files; `merchant_origin` was not observed across a switch)
- How we'd know it failed: after the switch, `/.well-known/ucp` still names the handle as `merchant_origin`.
- Leading indicator: none needed.

### GEO-11: llms.txt
- Severity: Info
- Evidence: another audit agent confirmed that Shopify itself serves `/llms.txt` on this store. Its content was not reviewed for this file.
- Why it matters: little. llms.txt is optional, no major answer engine has committed to it, and Google ignores it (Search and AI Overviews follow Googlebot and the normal index). `/agents.md` and the UCP profile already cover agent discovery.
- Fix: none. If its content turns out to be editable, the only worthwhile addition is GEO-01's one-sentence identity (maker, Vancouver).
- Depends on: none
- Domain switch: auto
- How we'd know it failed: n/a
- Leading indicator: n/a

## What AI answer engines would say today (inferred, not queried)
No live ChatGPT, Perplexity, Gemini or Copilot answers were run (no DataForSEO tools in this session). From what their indexes can retrieve, a question like "Who is Pegasus Pens?" most likely gets one of three answers:
- the UK hand-turner on Facebook (veterans' workshop, Etsy `PegasusPens`);
- the Irvine, California maker;
- this store as "hand-turned wood and resin pens with gold hardware, made in British Columbia", with placeholder pens such as a burl hourglass or laminated wood pen.

A blend of these is also likely. Mehdi, date seeds, Persian Khatam and Vancouver will rarely appear until GEO-01 to GEO-05 are in place and the index refreshes.

## Not checked
- The content of `/llms.txt` (it was not in the snapshot).
- Live AI answers (ChatGPT, Perplexity, Gemini, Copilot, Google AI Overviews) and Google's own index: no `site:` query was run on Google.
- LinkedIn and a YouTube search for the brand.
- The Instagram bio, follower count and whether the bio links to the store (login wall).
- Who owns `pegasuspens.ca` (only DNS was checked; no whois).
- The real locations of the Facebook "Pegasus Pens" pages and the Etsy shop beyond their snippets.
- Whether `/agents.md` is editable by the merchant.
- Collection pages and `/pages/care` passage scoring; alt-text quality.
- Whether `merchant_origin` in the UCP profile follows a domain switch.
