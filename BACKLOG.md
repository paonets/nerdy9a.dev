# Backlog

Ideas and pending work for the garden. Move an item to CUSTOMIZATIONS.md once it ships.

## AI-friendliness & AI search

- [ ] **`llms.txt`** — custom emitter that builds `/llms.txt` from the content index (about blurb + sections with links and one-line summaries).
- [ ] **Markdown copies of every note** — emit `<page>.md` beside each HTML page; add `<link rel="alternate" type="text/markdown">` in `Head.tsx`.
- [ ] **JSON-LD structured data** — `BlogPosting` (headline, dates, author, `inLanguage`, image) + `BreadcrumbList` in `Head.tsx`.
- [x] **Check Cloudflare AI crawler settings** — decided Nov 2026: **allow all AI bots** (search and training). `robots.txt` stays `Allow: /`; Cloudflare (Security → Settings → Bot traffic, checked 2026-11-19): "AI Crawler and Agent access policies" all Allow (Search, Training, Agents, personal agents), Bot Preference Sync off, Bot Fight Mode off, AI Labyrinth off. Spoofed-UA test on 2026-11-18 returned 200 for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, CCBot.
- [ ] **Quotable note structure (vault)** — summary up top, question-style headings, facts in tables.
- [ ] **Correct `lang` per note** — Thai vs English tagging.
- [ ] **Richer place hubs** — intro + trip links; decide whether to make them listed.
- [ ] **`/about` page + `Person` schema** — name, topics, `sameAs` LinkedIn + YouTube (helps AI search tie the garden to a real author). No private contact.
- [ ] **Full-content RSS**.

## Engagement

- [ ] **Anonymous ❤️ kudos button** — Cloudflare Pages Function + KV, as a custom plugin. Only if feedback is missed after removing giscus.
- [ ] **"Say hi on LinkedIn" line at the end of notes** — low-key replacement for comments using the public profile.
- [ ] **Remove giscus GitHub side** (optional) — turn off Discussions on `paonets/nerdy9a.dev`, uninstall the giscus app. Left on deliberately for now.

## Maintenance

- [ ] **Dependabot alerts** — 18 open on `v5` (9 moderate, 9 low) as of Nov 2026.
