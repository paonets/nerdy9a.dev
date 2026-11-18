# Backlog

Ideas and pending work for the garden. Move an item to CUSTOMIZATIONS.md once it ships.

## AI-friendliness & AI search

- [ ] **`llms.txt`** — custom emitter that builds `/llms.txt` from the content index (about blurb + sections with links and one-line summaries).
- [ ] **Markdown copies of every note** — emit `<page>.md` beside each HTML page; add `<link rel="alternate" type="text/markdown">` in `Head.tsx`.
- [ ] **JSON-LD structured data** — `BlogPosting` (headline, dates, author, `inLanguage`, image) + `BreadcrumbList` in `Head.tsx`.
- [ ] **Check Cloudflare AI crawler settings** — make sure "Block AI bots" / AI Crawl Control isn't 403-ing GPTBot, ClaudeBot, PerplexityBot; decide which bots to allow.
- [ ] **Quotable note structure (vault)** — summary up top, question-style headings, facts in tables.
- [ ] **Correct `lang` per note** — Thai vs English tagging.
- [ ] **Richer place hubs** — intro + trip links; decide whether to make them listed.
- [ ] **`/about` page + `Person` schema** — handle and topics only, no personal contact.
- [ ] **Full-content RSS**.

## Engagement

- [ ] **Anonymous ❤️ kudos button** — Cloudflare Pages Function + KV, as a custom plugin. Only if feedback is missed after removing giscus.
- [ ] **Remove giscus GitHub side** (optional) — turn off Discussions on `paonets/nerdy9a.dev`, uninstall the giscus app. Left on deliberately for now.

## Maintenance

- [ ] **Dependabot alerts** — 18 open on `v5` (9 moderate, 9 low) as of Nov 2026.
