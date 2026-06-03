# Nerdy9a Garden — Agent Instructions

## Foundational Mandates

- **Git Workflow:** Commit directly on `v5`. No feature branches or PRs needed. Always ask the user for confirmation before running `git push`.
- **Batch Before Pushing:** For iterative changes (CSS tweaks, copy edits, visual adjustments), make all edits locally and verify in the browser first. Once the result looks good, squash into a single descriptive commit and push — do NOT push after every small change.
- **Customized Plugins Strategy:** All customized Quartz plugins (such as `content-page`, `folder-page`, `content-meta`, `note-properties`) MUST be stored in the `custom-plugins/` directory and referenced in `quartz.config.yaml` using local paths (e.g. `source: ./custom-plugins/plugin-name`). Do NOT edit files inside `.quartz/plugins/` directly, as `.quartz/` is gitignored and your changes will be lost upon deployment.
- **Vault-to-Quartz Pipeline:** Do NOT write or edit Markdown files directly inside the `content/` directory (except for `index.md` which serves as the homepage). All digital garden notes must be authored in the master Obsidian vault (`WisdomWell`) and published using the sanitization script.
- **Single Source of Truth:** This file (`AGENTS.md`) is the master instruction set for all AI agents working in this repository. `CLAUDE.md` and `ANTIGRAVITY.md` are symlinked to this file. **Always edit `AGENTS.md` directly** — edits through the symlinks will fail.

---

## About this Repository

This repository (`nerdy9a.dev`) is the codebase for the **Nerdy9a Garden** digital garden, built using **Quartz 5** and hosted on Cloudflare Pages.

### Master Directories

- `content/` — Notes published from the vault (overwritten during publish).
- `quartz/` — Core Quartz framework code, components, layout engine, and styling.
- `quartz/styles/custom.scss` — Custom styles (e.g. homepage card grid configurations).
- `quartz.config.yaml` — Global site configurations (title, colors, analytics, plugins).

---

## Standard Commands

### 🔍 Development & Preview

To run the local development server with hot-reloading:

```bash
npx quartz build --serve
```

If the port is already in use (e.g. port 8080 or websocket port 3001), check for existing running Quartz processes, kill them, and then start the new one:

```bash
# Check if Quartz is running on port 8080
lsof -i :8080
# Kill process using port 8080
kill -9 $(lsof -t -i :8080)
```

### 🔨 Build Production Site

To build the optimized static site (output folder is `public/`):

```bash
npx quartz build
```

### 💅 Code Quality & Formatting

Before committing, verify that formatting and TypeScript compile correctly:

```bash
# Run compiler checks and Prettier formatting checks
npm run check

# Auto-format all code and markdown files
npm run format
```

---

## Sync Workflow (From Obsidian Vault)

To pull updates from your Obsidian vault and sync them to this Quartz repo:

1. Open a terminal inside the master Obsidian vault directory:
   `/Users/pongsakorn/Library/Mobile Documents/iCloud~md~obsidian/Documents/WisdomWell`
2. Run the sanitization & translation publisher script:
   ```bash
   python3 Scripts/publish.py
   ```
   **Note on Translation Workflow:** When asked to translate/publish notes, use the internal LLM translation workflow to avoid interactive CLI deadlocks:
   - Run `python3 Scripts/pre_translate.py` to identify missing translations.
   - Translate the items inside `Scripts/.missing_translations.json` and write a JSON dict mapping `{ "key": "translated_text" }` to `Scripts/.translated_import.json` (ensuring both titles and body text are translated cleanly into the target language without adding suffixes like `(ภาษาไทย)`).
   - Run `python3 Scripts/pre_translate.py --import-file Scripts/.translated_import.json` to merge into the cache.
   - Run `python3 Scripts/publish.py` to compile and publish to the garden.
3. Run the development server in this repository to preview changes.
4. Stage, commit, and push your changes to GitHub to trigger the Cloudflare Pages deploy runner.

---

## Customized Features

### Category Page Tag-Filtering

The main content page rendering component [ContentBody.tsx](file:///Users/pongsakorn/Projects/nerdy9a.dev/.quartz/plugins/content-page/src/components/ContentBody.tsx) has been customized to support dynamic tag-filtering via the `filter_tags` frontmatter attribute:

- If any published note (such as those under `content/Categories/` like `content/Categories/Tech.md`) specifies `filter_tags: ["tag1", "tag2"]` in its frontmatter, it will automatically render the note's text followed by a dynamic list of all notes in the garden matching _any_ of those tags (including sub-segments of nested tags).
- This allows category indexing to be completely decoupled from physical directory structures.

### Local Build Speed-up (OG Image Generation Bypass)

To speed up local development and test builds, the custom Open Graph (OG) image generator (`CustomOgImages` emitter) is disabled for all local runs (reducing rebuild times from ~11 seconds to under 1 second).

- **How it works:** In `quartz.ts`, we check if the environment variable `CF_PAGES` is set to `"1"`. If it is not, we filter out the `CustomOgImages` emitter dynamically before building.
- **Production builds:** Cloudflare Pages automatically injects `CF_PAGES=1` during build runs, so custom OG images are generated during standard deployments without requiring any manual settings.
- **Testing OG image generation locally:** If you need to test or build the custom OG images locally, run the build with the environment variable set:
  ```bash
  CF_PAGES=1 npx quartz build
  ```

---

## Design, Theme & Styling Direction

The website is designed with a **cute, warm chibi avatar theme** combined with a clean, professional typography and layout system.

### 🎨 Color Palette & Typography

- **Light Mode Background:** `#faf9f6` (Warm ivory/cream)
- **Dark Mode Background:** `#141615` (Charcoal / soft near-black)
- **Primary Accent / Secondary Color:** `#10b981` (emerald green in Light Mode) / `#34d399` (in Dark Mode)
- **Secondary Accent / Tertiary Color:** `#f43f5e` (rose pink in Light Mode) / `#fb7185` (in Dark Mode)
- **Fonts:**
  - _Title & Code:_ `JetBrains Mono`
  - _Headers:_ `Plus Jakarta Sans`
  - _Body Text:_ `Inter`

### 🖼️ Logo & Avatar Guidelines

All avatars are hand-drawn vector chibi illustrations using clean dark brown outlines, simple flat colors, and soft lighting/shading.

- **Main Logo (`quartz/static/garden_logo.png`):** Features the chibi boy avatar holding a small green tree seedling with both hands. The background color is a solid `#faf9f6` color block matching the website background perfectly to ensure it blends seamlessly with the page layout.
- **Backup Logo (`quartz/static/garden_logo_no_object.png`):** The same chibi boy avatar, but holding nothing (hands folded/resting in front).
- **Favicon (`quartz/static/icon.png`):** A close-up crop of the chibi boy's head with a **transparent background** to render cleanly on browser tabs.

### 💅 Key Styling Elements (`quartz/styles/custom.scss`)

- **Homepage Logo Card:** Uses `.homepage-logo` with `border-radius: 32px`, a soft shadow, and a smooth hover-scale transition (`scale(1.04)`).
- **Interactive Welcome Section:** Styled as a glassmorphic gradient container (`.welcome-message`) featuring a custom language switcher (`.lang-tab`), interactive contact chips (`.welcome-connect`), and custom hand-drawn highlighter effects (`.highlight-link`) for key links.
- **Category Navigation Cards:** Styled as `.content-card` grid components with clean border-radius, soft shadows, and dynamic green borders on hover.
- **Table Formatting:** Markdown tables (`.table-container`) are styled with horizontal borders, custom green hover states, and standard minimal padding to support detailed/wide data layout.

---

## 🗺️ Travel Journal & Place Hubs

The digital garden features a public travel journal located under `content/Travel Journal/`.

### Naming Conventions:

- **Long Trips (Multi-page):**
  - **Directory:** `YYYY-MM Destination` (e.g. `2025-04 Japan Spring/`)
  - **Hub Page:** `index.md` inside the trip directory (e.g., `2025-04 Japan Spring/index.md`)
  - **Sub-pages:** Title Case with spaces representing segments or days (e.g., `2025-04 Japan Spring/Expo 2025.md` or `2025-04 Japan Spring/Osaka.md`)
- **Short Trips (Single-page):**
  - **Note file name:** `YYYY-MM Destination.md` at the root of `Travel Journal/` (e.g., `2026-05 Da Nang.md`)
- **Geographical Place Hubs:**
  - **Note file name:** Title Case (e.g., `Osaka.md`, `Kii-Katsuura.md`) inside `Travel Journal/Places/`
- **Slug/URL Translation:** All folders and files with spaces automatically get translated to clean kebab-case URLs with hyphens on the Quartz website (e.g., `/travel-journal/2025-04-japan-spring/expo-2025/`).

- **Index/Hub Pages:** Main trip pages are named `index.md` inside their trip subfolder (e.g., `content/Travel Journal/2025-04 Japan Spring/index.md`).
- **Sub-pages:** Specific day logs or topic pages (e.g., `Osaka.md`) must be unlisted (`unlisted: true` in the frontmatter) to avoid cluttering the main lists, making them accessible only via the main Hub page.
- **Geographical Place Hubs:** Central entity nodes for major destinations are stored in `content/Travel Journal/Places/` (e.g., `Osaka.md`, `Nagoya.md`, `Ise.md`, `Kii-Katsuura.md`). They are marked as `publish: true` and `unlisted: true` so they resolve links without showing up in main listings or search.
