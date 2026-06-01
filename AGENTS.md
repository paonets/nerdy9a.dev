# Nerdy9a Garden — Agent Instructions

## Foundational Mandates

- **No Direct Pushing:** You MUST ask the user for explicit permission before running any command that pushes changes to a remote repository (e.g. `git push`).
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
3. Run the development server in this repository to preview changes.
4. Stage, commit, and push your changes to GitHub to trigger the Cloudflare Pages deploy runner.

---

## Customized Features

### Category Page Tag-Filtering

The main content page rendering component [ContentBody.tsx](file:///Users/pongsakorn/Projects/nerdy9a.dev/.quartz/plugins/content-page/src/components/ContentBody.tsx) has been customized to support dynamic tag-filtering via the `filter_tags` frontmatter attribute:

- If any published note (such as those under `content/Categories/` like `content/Categories/Tech.md`) specifies `filter_tags: ["tag1", "tag2"]` in its frontmatter, it will automatically render the note's text followed by a dynamic list of all notes in the garden matching _any_ of those tags (including sub-segments of nested tags).
- This allows category indexing to be completely decoupled from physical directory structures.
