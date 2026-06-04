# Nerdy9a Garden — Customizations and Plugins

This document tracks all customized features and custom plugins developed for the Nerdy9a Garden codebase. All custom plugins are stored in the `custom-plugins/` directory and referenced in `quartz.config.yaml` using local paths.

---

## Custom Plugins Detail

### 1. Tag-Filtered Category Pages (`custom-plugins/content-page`)

The main content page rendering component [ContentBody.tsx](file:///Users/pongsakorn/Projects/nerdy9a.dev/custom-plugins/content-page/src/components/ContentBody.tsx) has been customized to support dynamic tag-filtering via YAML frontmatter:

- **How it works:** If a note (such as category index notes under `content/Categories/`) specifies `filter_tags: ["tag1", "tag2"]`, the plugin automatically appends a list of all notes matching _any_ of those tags (including sub-segments of nested tags).
- **Tag Exclusion:** Supports `exclude_tags: ["tag3"]` to hide specific pages from category listings even if they match the filter tags. This is used to keep unlisted pages or draft trip logs from cluttering category indices.

### 2. Enhanced Folder Index Pages (`custom-plugins/folder-page`)

- **Cover Photo Title Overlay:** Renders folder index cover images with custom title overlay styling and rounded corners.
- **Trip Logs Section Header:** Automatically inserts a section header (`Trip Logs` or `Travel Logs`) before the list of sub-pages/day logs at the bottom of folder index pages (specifically in the Travel Journal).
- **Title Logic Refactoring:** Implements robust title matching using frontmatter and page tags.

### 3. Source Link Integrations (`custom-plugins/content-meta` & `custom-plugins/note-properties`)

- **Custom Source Display:** Parses and displays a `source` YAML property (e.g. YouTube videos, external articles, or speaker profiles) as a clickable link on a new line within the metadata block.
- **Styling Adjustments:** Wraps properties cleanly and resolves tag-list styling issues.

### 4. Custom Open Graph Social Images (`custom-plugins/og-image`)

Generates social media link previews using `satori` and `sharp` during deployments.

- **Thai Typography Support:** Modified `emitter.tsx` to dynamically fetch and register Google's `Noto Sans Thai` (regular 400 and bold 700 weights) into Satori's font engine, setting it as a fallback in the JSX CSS. This allows pages containing Thai text to render preview cards with perfect typography.
- **Local Build Speed-up (Bypass):** Disabled for all local builds to reduce rebuild times from ~11 seconds to under 1 second.
  - **Mechanics:** In `quartz.ts`, we check `process.env.CF_PAGES === "1" || process.env.CI === "true" || process.env.CI === "1"`. If false, we dynamically filter out the `CustomOgImages` emitter.
  - **Testing locally:** Test image generation locally by running: `CF_PAGES=1 npx quartz build`.

### 5. Translation Callout Stripping (`custom-plugins/description`)

- **How it works:** Clones the HAST (HTML AST) tree using `rfdc` and filters out all `blockquote` elements (which markdown callout boxes `> [!NOTE]` map to) before extracting the text description using `toString(tree)`.
- **Why it was done:** The note translator script automatically injects translation notices at the very beginning of the notes. Stripping blockquotes prevents these banners from leaking into `<meta name="description">` tags and the text of generated OG images, while keeping them perfectly visible on the actual rendered HTML page.
