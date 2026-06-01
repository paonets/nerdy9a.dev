# Nerdy9a Garden — Agent Instructions

## Foundational Mandates

- **No Direct Pushing:** You MUST ask the user for explicit permission before running any command that pushes changes to a remote repository (e.g. `git push`).
- **Branch Strategy:** Do NOT merge changes directly into `v5`. Always open a Pull Request (PR) and get user approval before merging into the `v5` branch.
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

### 🔀 Creating a Pull Request

Always create a feature branch, commit your changes, and open a Pull Request when modifying code or configuration files. Because this repository is a fork, ensure GitHub CLI (`gh`) is configured to target your repository by default:

```bash
# Set the default repository for gh command line
gh repo set-default paonets/nerdy9a.dev

# Create a PR targeting v5
gh pr create --title "Your PR Title" --body "Your PR Description" --base v5 --head your-feature-branch
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
