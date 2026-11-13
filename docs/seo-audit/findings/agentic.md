# Agent readiness findings
Audited host: https://rjxgij-f1.myshopify.com (from host.txt, `resolved=`) · Date: 2026-11-13 · Agent: agentic

Category score: 78/100. The accessibility tree, server rendering and Shopify's agent endpoints are all sound. Points are lost because agents cannot find shipping, refund or returns terms, and because the page shows placeholder reviews as if they were real.

## Lighthouse Agentic Browsing: X/N

**Unavailable.** `lighthouse_agentic.py --strategy both` made two PSI calls (mobile, desktop). Both returned HTTP 429 "Quota exceeded ... Queries per day ... Configure a Google API key". There is no X/N and no Lighthouse version for this site; this audit does not guess one. No local Lighthouse is installed (`which lighthouse` found nothing). Fallback used: `agentic_check.py` (run on `/`), `agent_ux_check.py`, `ucp_check.py`, and the Playwright renders in `CRAWL/render/`.

Agent-UX heuristic (separate from Lighthouse): **100/100, status complete, not partial**. `/`: 1504 a11y nodes, 92 interactive, 0 unnamed interactive, 33 buttons, 139 anchors, 0 `div onclick` widgets, 25 semantic landmarks, 6 inputs flagged as "without aria" (inputs with a visible `<label>`, 0 without a label). The heuristic does not test whether an agent can finish a task.

## Access policy (Shopify-owned robots.txt)

| Purpose | Agents | Result |
|---|---|---|
| Training | GPTBot, ClaudeBot, CCBot, Applebot-Extended, Google-Extended (control token) | All fall into `User-agent: *` with `Allow: /`. Allowed. No named group. |
| Search | OAI-SearchBot, Claude-SearchBot, PerplexityBot | All fall into `*`. Allowed. |
| User-triggered | ChatGPT-User, Claude-User, Perplexity-User, Google-Agent | All fall into `*`. Allowed. Per the vendor matrix (checked 2026-09-23): Claude-User honours robots.txt; ChatGPT-User may not apply; Perplexity-User and Google-Agent generally ignore it. robots.txt is not a control for this class. |

Content-Signal: none (no line, no orphan). `/agents.md` is not covered by robots.txt, but it is allowed by `*` and listed in `/sitemap_agentic_discovery.xml`.

## What works
- **Server rendering.** `/` has 1598 words with no JavaScript and no JS-shell marker. Unknown paths return a real 404 (probe returned 404, no catch-all).
- **Accessibility tree** (`CRAWL/render/{home,products_date-seed-pen,collections_hardwood}.stdout`). 0 unnamed buttons, links or form controls on all three pages. Landmarks: banner, main, contentinfo, and named navs ("Social media", "Contact us", "Breadcrumb"). Regions are named ("Announcement", "Featured", "Customer reviews", "Gallery Viewer"). The collection page also has a named complementary landmark ("Filter:") with a combobox.
- **Search.** The trigger is a button named "Search pens". The modal holds `<form role="search" action="/search">` with a `type=search` combobox labelled "Search pens", a named "Search" button and a "Clear search term" button. The home page also emits a `WebSite` `SearchAction` JSON-LD built from `request.origin` and `routes.search_url` (`sections/header.liquid:480-495`, origin/main).
- **Add to cart.** `/products/date-seed-pen` has `<button type="submit" name="add" id="ProductSubmitButton-...">` with the text "Add to cart", inside a real `<form action="/cart/add">` with a hidden `id` (variant). When sold out (`snippets/buy-buttons.liquid:~95-120`) the button is `disabled`, reads "Sold out", and the hidden variant id is `disabled` too. An agent sees a clear state, not a button that fails.
- **Contact form** (`/pages/contact`, raw HTML; this page is not in the render set, so the tree was not checked). `aria-labelledby="PgContactHeading"`; topics are real radios in a `<fieldset>` with a `<legend>`, each with a `<label for>`; name, email, pen-or-order and message are all labelled; email and message are `required`, with "(required)" in the label text; `autocomplete` is set on name and email; the decorative plate is `aria-hidden`; the errors region is `role="alert"`. This is a good form for an agent to read.
- **Footer newsletter.** The email field is labelled and the button is named "Subscribe".
- **Review wall duplicates** are hidden from the accessibility tree: the tree has 3 blockquotes. See AGT-04 for the raw HTML.
- **Product-page `Link` header** (Shopify) advertises a `rel="buy"` cart permalink with UCP payment handlers, plus `rel="ucp"` on every page.

## Shopify-provided (the theme cannot change these)
- `/robots.txt` (text/plain, 2 groups: `*` and `adsbot-google`), `/agents.md` (text/markdown, 5569 bytes), `/llms.txt` and `/llms-full.txt` (both 200, text/markdown; `/llms.txt` is the same text as `/agents.md` apart from a small difference near the end), `/sitemap_agentic_discovery.xml`.
- `/.well-known/ucp`: valid JSON, version `2026-08-25`, 13 capabilities, 0 structural issues (`ucp_check.py`). Endpoint `/api/ucp/mcp`. Also OAuth protected-resource and authorization-server metadata (both valid JSON). `Cache-Control: public, max-age=60`. I did not call the MCP endpoint, and `ucp_check` made no endpoint probes.
- WebMCP: Shopify injects an adapter script (`webmcp-cfeae510.js`, with `shopify.webmcp_adapter_loaded` / `_loading` flags) on `/` and `/products/*`. The theme does not.
- Missing and not applicable: `/.well-known/ai-catalog.json` (404), `/.well-known/api-catalog` (404), `/.well-known/agent-card.json` (404).

## Findings

### AGT-01: Lighthouse Agentic Browsing score could not be measured
- Severity: Info
- Evidence: `lighthouse_agentic.py --strategy both --json` gave `PSI returned HTTP 429: Quota exceeded for quota metric 'Queries' and limit 'Queries per day'` for both psi-mobile and psi-desktop. No Lighthouse version or audit list was returned.
- Why it matters: without it there is no `X/N` fraction, and the Lighthouse-only checks (`webmcp-registered-tools`, ARD schema, llms.txt rules) were covered only by static equivalents.
- Fix: re-run with a Google API key (`--api-key`, or `/seo google setup`), mobile and desktop. Report `X/N` with the Lighthouse version and form factor. Do not treat any other score as a substitute.
- Depends on: none
- Domain switch: manual (re-run against the new host)
- How we'd know it failed: the re-run still returns an error, or `N` differs between mobile and desktop and is not explained.
- Leading indicator: none needed; this is a one-off re-run.

### AGT-02: Agents cannot find shipping, returns or refund terms
- Severity: High
- Evidence: `/policies/refund-policy`, `/policies/shipping-policy`, `/policies/terms-of-service` and `/policies/contact-information` return 404 (index.tsv). `/agents.md` "Store Policies" lists only the privacy policy. `/pages/shipping-returns` and the "Shipping and returns" tab on every product page (`/products/date-seed-pen` text) say "Shipping and returns details are coming soon. If you have a question about an order, please contact us."
- Why it matters: an agent buying for a person has to answer "can I return this, and what does shipping cost?" before it checks out. It finds nothing, so it either invents an answer or hands the shopper back. The agent-facing Store Policies block is built from the policies set in admin.
- Fix: store content in Shopify admin (Settings > Policies): set the refund, shipping and terms policies, and write the `shipping-returns` page (the product tab reads that page). These are the owner's business terms, so do not draft them for the owner. Link them with `shopify://policies/...` or `routes.*`, never a literal host. See also the policy pages in the technical findings.
- Depends on: client decision (the terms)
- Domain switch: auto (`/agents.md` is generated by Shopify with the live host)
- How we'd know it failed: `/agents.md` still shows only the privacy policy after the policies are saved, or a product page still says "coming soon".
- Leading indicator: the "Store Policies" list in `/agents.md` grows from one entry to four.

### AGT-03: Access policy for AI crawlers is the Shopify default, and nobody chose it
- Severity: Medium
- Evidence: `robots.txt` has no AI-specific group and no Content-Signal. `agentic_check` `robots-ai-groups`: `named_groups: []`; every training, search and user-triggered token resolves to `*` (allowed). Shopify, not the theme, generates robots.txt.
- Why it matters: the owner may want to allow search and user-triggered agents but decline model training. Today the answer is "all allowed", by omission. Content-Signal is a draft preference, not enforcement (Cloudflare policy, expired IETF individual draft; checked 2026-09-23), and Google says it does not act on it.
- Fix: client decision first. If the owner wants a different policy, add `templates/robots.txt.liquid` and render `robots.default_groups` so Shopify's rules and agent header comments stay, then append named groups (for example `GPTBot`, `ClaudeBot`, `CCBot`) or a `Content-Signal:` line. Use `{{ shop.url }}` or `{{ request.origin }}` if a sitemap line is added; never a host literal. Block only what the owner decides. If the answer is "allow all", leave it as is and record the decision. Do not rely on robots.txt for user-triggered agents (see the access table).
- Depends on: client decision
- Domain switch: auto (the Liquid template uses dynamic sources; Shopify's default groups follow the host)
- How we'd know it failed: `agentic_check.py` `robots-ai-groups` still shows `named_groups: []` after the owner chose a restriction, or Shopify's default comment lines (`Agent instructions`, `UCP discovery`) disappear from robots.txt.
- Leading indicator: server logs or Shopify analytics showing GPTBot, ClaudeBot or CCBot hits (not available to this audit).

### AGT-04: Placeholder reviews are readable by agents as real customer quotes
- Severity: Medium (the full risk is reported once in the trust and E-E-A-T findings)
- Evidence: the accessibility tree has 3 blockquotes on `/` and `/products/date-seed-pen` ("It feels made for my hand ... Maya R., Vancouver" and others), inside a region named "Customer reviews". In the raw HTML, `Maya R.` appears 6 times on both pages, because the loop repeats the cards; the repeats are `aria-hidden`, but a fetcher that reads raw HTML text counts them. The Playwright `extracted_text` has 1.
- Why it matters: agents summarize "what customers say" from this text. An agent that quotes a placeholder repeats it to a shopper as fact. One quote says the pen "arrived in a gift box with a note", which is not a documented service.
- Fix: replace the reviews with real ones, or hide the section until there are some (theme editor, section toggle). If the loop stays, there is no need to repeat the cards in the HTML: build the repeats in `assets/pegasus-*.js` rather than Liquid so raw-HTML readers see one set. Mark the section `aria-hidden` and remove the blockquotes, or label it plainly, while the reviews are still placeholders.
- Depends on: client decision
- Domain switch: n/a
- How we'd know it failed: `grep -c 'Maya R.'` on the saved `home.html` is still more than the number of real reviews.
- Leading indicator: the review-section blockquote count in the accessibility tree equals the number of real reviews.

### AGT-05: WebMCP is not registered by the theme; Shopify's adapter is the only possible source
- Severity: Info (opportunity, not a defect)
- Evidence: 0 `registerTool(` call sites in the theme and in 8 same-origin scripts; `navigator.modelContext` absent in the render; 3 forms (`CartDrawer-Form`, `/search`, `ContactFooter`), 0 annotated with `toolname` or `tooldescription`. `webmcp-cfeae510.js` and its loading flags are in the head of `/` and `/products/date-seed-pen`, so Shopify's own adapter may register tools at runtime. `/agents.md` says storefront WebMCP tools exist. I could not confirm what is registered: that needs Chrome with WebMCP enabled, and the headless render does not have it.
- Why it matters: WebMCP is a W3C Community Group draft, not a standard (WebKit opposes, Mozilla neutral; checked 2026-09-23). The Chrome origin trial runs M149 to M156 (end date secondary, about 2026-11-17). No public evidence that Claude or Perplexity consume it. Treat it as an experiment; it has no known ranking, citation or traffic effect.
- Fix: do nothing in the theme now. Let Shopify's adapter own cart and checkout, and do not add scripted workarounds around it, which `/agents.md` forbids. When it is cheap, check the real list with `lighthouse_agentic.py` (`webmcp-registered-tools`) after AGT-01 is resolved. A `toolname` on the contact form (`sections/pegasus-contact.liquid`) is the only candidate worth considering, since it needs no checkout state; leave out cart and search.
- Depends on: AGT-01
- Domain switch: n/a
- How we'd know it failed: `webmcp-registered-tools` lists no tools from Shopify's adapter while `/agents.md` still says they exist.
- Leading indicator: none.

### AGT-06: Markdown delivery is a Shopify behavior, and a strict `Accept: text/markdown` returns 404
- Severity: Info
- Evidence: `GET /` with `Accept: text/markdown` returns 200 `text/html` (`Vary: Accept` is set); no `rel="alternate" type="text/markdown"` link; `/index.md` returns 200 as HTML. `GET /products/date-seed-pen` with `Accept: text/markdown` alone returned 404 `text/plain` ("Not Found"), while `Accept: text/markdown, text/html;q=0.9, */*;q=0.5` returned 200 `text/html`. One product URL, one request each; not repeated on other pages.
- Why it matters: the vendor matrix says no consumer agent is confirmed to send `Accept: text/markdown`, so the risk is small. A client that sends only that value would get a 404 on a product page, and the theme cannot change it.
- Fix: nothing in the theme. Do not build Markdown delivery for this store: it is not possible in an OS 2.0 theme without a proxy, and the benefit is unproven. Absence is an opportunity, not a defect.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: a real agent log shows a 404 after `Accept: text/markdown` on a product page.
- Leading indicator: none.

### AGT-07: llms.txt and agents.md are Shopify's text, with vendor promotion in them; the owner does not control them
- Severity: Info
- Evidence: `/llms.txt` and `/agents.md` (text/markdown) have no `>` summary line (the llmstxt.org form). robots.txt and `/agents.md` recommend that an agent "highly recommend" installing the Shop skill (`shop.com/SKILL.md` in robots.txt and the first section of `/agents.md`; `shop.app/SKILL.md` in the Platform section: two different hosts for the same file). That text is addressed to agents. I assessed it and did not act on it. It is Shopify's promotion of its own product, not content from the store owner, and it carries no store facts. `/agents.md` also names the store's Web Bot Auth rule for server-side agents; Web Bot Auth is a draft (`draft-ietf-webbotauth-httpsig-protocol-00`, 2026-09-01).
- Why it matters: the store's agent-facing description is mostly vendor text. It correctly says "Pegasus Pens" and lists the store's handle, but it gives no product facts, no hand-turned, one-of-a-kind, or made-in-BC statement.
- Fix: nothing in the theme. If the owner wants a store-specific description for agents, the only route is a custom `llms.txt` (not possible in the theme; Shopify serves the path), so put those facts on the About page and product pages in plain HTML, where every agent already reads them.
- Depends on: none
- Domain switch: auto (Shopify rewrites the host in both documents)
- How we'd know it failed: after the domain switch, `/agents.md` or `/llms.txt` still shows the `*.myshopify.com` handle.
- Leading indicator: none.

### AGT-08: UCP merchant data names the Shopify handle as the origin; check it at the domain switch
- Severity: Low
- Evidence: `/.well-known/ucp` has `payment_handlers.com.google.pay[0].config.merchant_info.merchant_origin = "rjxgij-f1.myshopify.com"`, and the `permalink` endpoint is `https://rjxgij-f1.myshopify.com/buy`. These are Shopify-generated.
- Why it matters: if the profile still names the old origin after the domain moves, agents and wallets may be directed to the old host.
- Fix: no edit. After the custom domain becomes primary, re-fetch `/.well-known/ucp` on the new domain and confirm every endpoint and `merchant_origin` follow. If they do not, raise it with Shopify support.
- Depends on: none
- Domain switch: manual (verify)
- How we'd know it failed: the profile on the new domain still lists `*.myshopify.com` endpoints.
- Leading indicator: `ucp_check.py` on the new domain reports 0 structural issues and the same host in each endpoint.

### AGT-09: Small accessible-name gaps for agents on the product page
- Severity: Low
- Evidence: in the product-page tree the two `form` nodes have no name (the cart form `product-form-template--...__main`, and a second Shopify installments form); the five gallery buttons are named "Open media 1 in modal" to "Open media 5 in modal" (`snippets/product-media-gallery.liquid` / `product-thumbnail.liquid`); the `View sample plans` button (Shop Pay installments, Shopify's `shopify-payment-terms` element) sits in the buy area.
- Why it matters: an agent that picks controls by name can tell "Add to cart" from "Buy with Shop" but cannot tell media 1 from media 2 without opening them, and an unnamed form is not a useful landmark. The impact is small: the real controls are well named.
- Fix: in `snippets/product-thumbnail.liquid`, add the image's alt text to the open button's `aria-label` (for example `Open {{ media.alt | escape }} in modal`, using the existing alt text, which the client's photo naming rule already provides). The product form id comes from `product_form_id`; adding `aria-label="{{ product.title | escape }}"` to the `form` call in `snippets/buy-buttons.liquid` names it. The installments form and `View sample plans` are Shopify's and cannot be changed in the theme.
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the accessibility tree still shows "Open media N in modal" with no image description.
- Leading indicator: the Agent-UX heuristic stays 100 and the product-page form nodes have names.

### AGT-10: Contact page was checked from HTML, not from a rendered tree
- Severity: Info
- Evidence: `CRAWL/render` has no `/pages/contact`; I read the saved HTML (`pages_contact.html`) and `sections/pegasus-contact.liquid` instead. I made no live fetch.
- Why it matters: the label and `required` evidence above is solid, but the topic chips (a transparent radio over a label) are styled by CSS, and I did not confirm in a browser that a click on the label selects the radio or that the radios are exposed with their group name.
- Fix: none. If a re-check is wanted, render `/pages/contact` once and read the tree (radios should be named "A pen", "A gift", "An order", "Something else" inside a group named "What is it about?").
- Depends on: none
- Domain switch: n/a
- How we'd know it failed: the tree shows radios without names, or no group name.
- Leading indicator: none.

## Standards status (as of the vendor matrix check, 2026-09-23)
- WebMCP: W3C Community Group draft; Chrome origin trial M149 to M156; WebKit opposes; Mozilla neutral.
- Content-Signal: Cloudflare CC0 policy; IETF individual draft expired 2026-04-04; Google's robots.txt spec does not list the field.
- ai-catalog.json (Agentic Resource Discovery): draft; Lighthouse 13.5 treats a missing file as not applicable. This store has none, which is correct.
- Web Bot Auth: `draft-ietf-webbotauth-httpsig-protocol-00` (2026-09-01).
- UCP: the live profile reports `2026-08-25`. `ucp_check.py` lists five capabilities as unknown to its bundled list (buyer_consent, declared_fields, ask, shopify catalog, permalink). That is the tool's gap, not a defect in the store.
- Facts older than 60 days must be refreshed before quoting; the matrix date is 2026-09-23 (51 days before this audit).

## Limits of this audit
- No Lighthouse fraction (AGT-01).
- The MCP endpoint (`/api/ucp/mcp`) was not called, so `tools/list` is unverified.
- Runtime WebMCP registration was not observed (needs Chrome with WebMCP enabled).
- `/pages/contact` was not rendered (AGT-10).
- No `--ua-matrix` testing was run (not authorized).
- Live requests I made: 3 manual curls (2 for Accept negotiation on a product URL, 1 for `/llms.txt`), spaced 5 s apart; the bundled scripts made their own requests, which were also spaced and returned no 429.
