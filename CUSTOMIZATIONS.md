# Nerdy9a Garden — Customizations and Plugins

This document tracks all customized features and custom plugins developed for the Nerdy9a Garden codebase. All custom plugins are stored in the `custom-plugins/` directory and referenced in `quartz.config.yaml` using local paths.

---

## Custom Plugins Detail

### 1. Tag-Filtered Category Pages (`custom-plugins/content-page`)

The main content page rendering component [ContentBody.tsx](file:///Users/pongsakorn/Projects/nerdy9a.dev/custom-plugins/content-page/src/components/ContentBody.tsx) has been customized to support dynamic tag-filtering via YAML frontmatter:

- **How it works:** If a note (such as category index notes under `content/Categories/`) specifies `filter_tags: ["tag1", "tag2"]`, the plugin automatically appends a list of all notes matching _any_ of those tags (including sub-segments of nested tags).
- **Tag Exclusion:** Supports `exclude_tags: ["tag3"]` to hide specific pages from category listings even if they match the filter tags. This is used to keep unlisted pages or draft trip logs from cluttering category indices.
- **Optimized Cover Image Loading:** Added `fetchpriority="high"` to the page-cover-banner image tag to prioritize above-the-fold hero image loading and improve LCP.
- **Hub Grouping:** A matching note whose folder contains its own `index.md` (an event, course or trip hub, e.g. `Learning/Events/Conferences/KBTG Techtopia 2026/`) is folded into that hub instead of being listed on its own. The hub appears once, with a collapsible `<details class="hub-children" open>` list (expanded by default) of the matching notes (ordered by created date), or a `.hub-count` line in cover-card mode. Only the note's immediate parent folder counts, so top-level folders never swallow notes. The hub is placed under the first `topics` entry that matches the union of the hub's and its notes' tags. Styles live under `.page-listing` in `quartz/styles/custom.scss`. Rebuild `dist/` with `npm ci && npm run build` inside the plugin folder after editing the source.

### 2. Enhanced Folder Index Pages (`custom-plugins/folder-page`)

- **Cover Photo Title Overlay:** Renders folder index cover images with custom title overlay styling and rounded corners.
- **Trip Logs Section Header:** Automatically inserts a section header (`Trip Logs` or `Travel Logs`) before the list of sub-pages/day logs at the bottom of folder index pages (specifically in the Travel Journal).
- **Title Logic Refactoring:** Implements robust title matching using frontmatter and page tags.
- **Optimized Cover Image Loading:** Added `fetchpriority="high"` to the page-cover-banner image tag on folder index pages to improve LCP loading speeds.

### 3. Source Link Integrations (`custom-plugins/content-meta` & `custom-plugins/note-properties`)

- **Custom Source Display:** Parses and displays a `source` YAML property (e.g. YouTube videos, external articles, or speaker profiles) as a clickable link on a new line within the metadata block.
- **Styling Adjustments:** Wraps properties cleanly and resolves tag-list styling issues.

### 4. Custom Open Graph Social Images (`custom-plugins/og-image`)

Generates social media link previews using `satori` and `sharp` during deployments.

- **Thai Typography Support:** Modified `emitter.tsx` to dynamically fetch and register Google's `Noto Sans Thai` (regular 400 and bold 700 weights) into Satori's font engine, setting it as a fallback in the JSX CSS. This allows pages containing Thai text to render preview cards with perfect typography.
- **Dynamic MIME Type Detection:** Added dynamic detection of the site logo's MIME type (checking PNG vs JPEG magic bytes). Since `icon.png` in the static resources is actually a JPEG image renamed to PNG, declaring it with a hardcoded `data:image/png;base64` MIME type caused `librsvg` (within `sharp`) to fail silently during conversion, dropping the avatar from the generated social card. Correctly setting the MIME type dynamically allows the chibi boy logo to render beautifully on the generated cards.
- **Local Build Speed-up (Bypass):** Disabled for all local builds to reduce rebuild times from ~11 seconds to under 1 second.
  - **Mechanics:** In `quartz.ts`, we check `process.env.CF_PAGES === "1" || process.env.CI === "true" || process.env.CI === "1"`. If false, we dynamically filter out the `CustomOgImages` emitter.
  - **Testing locally:** Test image generation locally by running: `CF_PAGES=1 npx quartz build`.
- **satori 0.63 (not bundled):** `satori` is external in `tsup.config.ts` and installed as a root dependency, like `sharp`. Bundling 0.63 fails (fflate and the banner both declare `createRequire`), and its harfbuzz/layout `.wasm` files must sit beside satori's own `dist/`. The root and the plugin override satori's pinned `fflate` 0.7.3 to 0.7.5 (ZIP64 advisory).
  - **Layout fixes for 0.63's layout engine:** the card root sets `boxSizing: "border-box"` (0.63 treats `width/height: 100%` as content-box, so the padding pushed text off the right edge and the footer off the bottom), and the description wrapper sets `minHeight: 0` + `overflow: "hidden"` so long descriptions shrink instead of pushing the footer down. Output matches 0.12 apart from minor line-wrap differences.

### 5. Translation Callout Stripping (`custom-plugins/description`)

- **How it works:**
  1. Traverses the HTML AST in-place to automatically add `loading="lazy"` and `decoding="async"` attributes to all images in the post body (skipping the above-the-fold homepage logo).
  2. Clones the HAST (HTML AST) tree using `rfdc` and filters out all `blockquote` elements (which markdown callout boxes `> [!NOTE]` map to) before extracting the text description using `toString(tree)`.
- **Why it was done:**
  1. Default Quartz does not lazy-load post body images, causing significant bandwidth overhead and poor PageSpeed scores for travel journals with many photos.
  2. The note translator script automatically injects translation notices at the very beginning of the notes. Stripping blockquotes prevents these banners from leaking into `<meta name="description">` tags and the text of generated OG images, while keeping them perfectly visible on the actual rendered HTML page.

### 6. `pageDate` in the Content Index (`custom-plugins/created-modified-date`, `content/index.md`)

- **How it works:** Since Quartz 5.1 the content index is built in (`configuration.contentIndex`), and it still drops `date` from `public/static/contentIndex.json`; extensions can't override that core field. The forked `custom-plugins/content-index` was removed. Instead, `custom-plugins/created-modified-date` defines an `extendContentIndex` hook that adds `pageDate` (the note's default date, ISO string). Virtual pages (folder and tag listings) have no dates, so they get no `pageDate`. The homepage script in `content/index.md` reads `item.pageDate || item.date` and skips entries without one.
- **Why it was done:** The homepage "Recently Updated" section sorts notes client-side by date and renders relative times without extra fetches or RSS parsing.

### 7. Support for Obsidian Frontmatter Date Fields (`custom-plugins/created-modified-date`)

- **How it works:** Modified `src/transformer.ts` to check `date` as a fallback for created time, and `updated` as a fallback for modified time in the Markdown frontmatter (mapped to `dates.created` and `dates.modified` respectively).
- **Why it was done:** By default, the plugin only looks for `created` and `modified` in the frontmatter. Notes authored in the Obsidian vault use the standard keys `date` (for creation) and `updated` (for updates). Because the plugin did not recognize them, it fell back to Git commit timestamps or filesystem timestamps (which reset to "now" whenever the python publish/sync script runs), leading to incorrect modification dates for notes on the homepage.

- **Content index hook:** The same plugin adds `pageDate` to `contentIndex.json` (see section 6). Rebuild `dist/` with `npm ci && npm run build` inside the plugin folder after editing the source, then delete its `node_modules` (Quartz warns when a plugin has its own copy of `preact`).

### 8. Customized Theme Toggle Script Deferral (`custom-plugins/darkmode`)

- **How it works:** Extracted the theme setup/event listeners from the render-blocking pre-script phase and shifted them to run asynchronously after the DOM has fully loaded (`afterDOMLoaded`).
- **Why it was done:** By separating the setup logic from the early theme checking (which is now inlined in `<head>`), the script no longer blocks the initial rendering of the webpage, improving First Contentful Paint (FCP).

### 9. Lazy-Loaded Graph Component Scripts (`custom-plugins/graph`)

- **How it works:** Replaced the eager loading of D3.js and PixiJS scripts on initial load with a conditional check. The scripts are only requested when a `.graph-container` is actually visible on the page (width/height > 0), or if the user clicks the global graph toggle button.
- **Why it was done:** Since the note connection graph is hidden inside the right sidebar on mobile devices, eagerly fetching the libraries resulted in over 1MB of unused JavaScript being downloaded and parsed on mobile page views. Lazy-loading them completely removes this overhead for mobile devices, significantly boosting mobile PageSpeed performance.

---

## Core Framework Customizations

### 1. Monolithic Component CSS Bundling (`quartz/plugins/emitters/componentResources.ts`)

- **How it works:** Modifies the built-in `ComponentResources` emitter to merge all styles in `componentResources.componentCssStrings` directly into the main compiled `index.css` stylesheet. It resets `ctx.componentCssMap` to an empty map so that no separate component stylesheets are written to disk or linked in the `<head>` of HTML pages.
- **Why it was done:** Default Quartz emits a separate CSS stylesheet for every enabled component (Search, Backlinks, Dark Mode, etc.), resulting in 20+ render-blocking network requests that delay rendering by ~1.3s on mobile connections. Bundling them into the single main `index.css` stylesheet (~75 KB uncompressed, ~15 KB compressed) allows the browser to fetch all styles in a single HTTP request and cache them instantly for subsequent navigation.

### 2. Elimination of Render-blocking `prescript.js` & Inlined Critical Theme Setup (`quartz/components/Head.tsx`, `quartz/plugins/emitters/componentResources.ts`, `quartz/components/renderPage.tsx`)

- **How it works:**
  1. Inlines the essential theme-detection snippet directly within `<head>` inside `Head.tsx`, completely avoiding network overhead.
  2. Modifies `componentResources.ts` to check if `prescript` has any non-whitespace content. If empty (since the darkmode plugin now leverages `afterDOMLoaded`), it bypasses writing and hashing the file.
  3. Modifies `renderPage.tsx` to conditionally exclude the external `prescript.js` `<script>` link if it is empty/undefined.
- **Why it was done:** Eliminates a completely render-blocking external HTTP network request for `prescript.js` (which was ~1.1 KB), shortening the critical rendering path and decreasing time-to-first-render.

### 3. Local Google Font Bundling (`quartz.config.yaml`)

- **How it works:** Configured `cdnCaching: false` under theme options.
- **Why it was done:** Instructs the build system to fetch Google Fonts stylesheets, download the font files during build time, and host them locally under the site's own domain, merging the `@font-face` definitions directly inside the monolithic `index.css`. This removes two render-blocking external domain requests (`fonts.googleapis.com` and `fonts.gstatic.com`), saving costly DNS lookup, TCP connect, and SSL negotiation times on mobile connections.

### 4. Size-Threshold-Based Plugin Resource Inlining (`quartz/plugins/emitters/componentResources.ts`)

- **How it works:** Modifies the inline resource extraction loop in `componentResources.ts`. If an inline CSS or JS resource returned by a plugin is smaller than 4KB after minification, it is kept inlined (with minified contents) in the page's HTML `<head>` rather than being written to disk and injected as an external render-blocking network request.
- **Why it was done:** Eliminates extra render-blocking network requests for tiny stylesheets/scripts (e.g. 0.8KB and 1.2KB syntax highlighting clipboard styles), saving round-trip connection times (~450ms per request) and boosting FCP/LCP scores on PageSpeed.

### 5. Increased Bold Text Prominence (`quartz/styles/base.scss`)

- **How it works:** Increased global font weight of `strong` tags from `$semiBoldWeight` (600) to `$boldWeight` (700) and set global color to `var(--dark)`.
- **Why it was done:** In dark mode, the contrast between the body text color (`#d6d3d1`) and headings/bold color (`#fafaf9`) is subtle. Setting `strong` tags to a higher font weight (700) and ensuring `var(--dark)` color applies globally (instead of just inside paragraphs `p > strong`) makes bold text significantly more prominent and easier to read across lists, callouts, blockquotes, and other elements.

### 6. Readability-Enhanced Heading Styling (`quartz/styles/custom.scss`)

- **How it works:** Styles headings (`h1` through `h6`) in the note content (`.markdown-rendered`) with the primary brand emerald/mint color (`var(--secondary)`). Uses `color-mix()` to gradually shade heading levels from primary green (H1/H2) to darker tones closer to body text (H3-H6), maintaining structure and hierarchy.
- **Why it was done:** By default, headings used the same near-black/near-white color as the body text, making it harder to distinguish note sections when scanning long articles. Applying theme-consistent green coloring enhances readability and mimics the structural layout of standard note-taking apps like Obsidian.

### 7. Self-Hosted Thai Typography Fallback (`quartz/util/theme.ts`, `quartz/styles/custom.scss`)

- **How it works:**
  1. Modifies the Google Fonts fetch compiler in `theme.ts` to automatically request Google Fonts' `Sarabun` (regular and bold) and `Bai Jamjuree` (regular, medium, and bold) when fetching theme fonts. Since `cdnCaching: false` is set in the configuration, the site builder downloads the `.woff2` font files at compile time and self-hosts them locally under the site's own domain.
  2. Overrides the custom property definitions for `--bodyFont`, `--headerFont`, `--titleFont`, and `--codeFont` in the `:root` section of `custom.scss` to append `"Sarabun"` (for body text and code fallbacks) and `"Bai Jamjuree"` (for headings and titles fallbacks) after the default English fonts.
- **Why it was done:** The default English fonts (`Inter`, `Plus Jakarta Sans`, and `JetBrains Mono`) do not include Thai glyphs, causing browsers to fall back to generic system Thai fonts (which vary heavily and look inconsistent across Mac, Windows, iOS, and Android). Adding this paired looped font fallback ensures beautiful, highly readable Thai typography (stylish slab-serif `Bai Jamjuree` for headers, clean standard `Sarabun` for long body text), while keeping all font assets fully self-hosted for maximum loading speeds and privacy.

### 8. Full-Width Last Homepage Card (`quartz/styles/custom.scss`)

- **How it works:** `.content-grid > .content-card:last-child:nth-child(odd)` spans the whole grid row.
- **Why it was done:** The homepage grid shows two cards per row. Adding the 📚 Book Summaries card made the count odd (7), which left the last card (Travel) alone at half width.

---

## Quartz 5.1 Upgrade Notes (Nov 2026)

Merged upstream `jackyzha0/quartz` v5 (5.1.0) into our fork. What changed on our side:

- **First-party plugins come from npm.** `quartz.config.yaml` uses `"@quartz-community/<name>"` sources instead of `github:quartz-community/<name>`; versions are pinned by `package.json` / `package-lock.json` (upstream lists them as dependencies). Only the local forks in `custom-plugins/` remain, so `quartz.lock.json` only holds machine-specific local paths and is gitignored.
- **Built-ins replace plugins.** `crawl-links` and `remove-draft` moved to `configuration.links` / `configuration.drafts` (`npx quartz plugin doctor --fix`); the content-index fork became `configuration.contentIndex` (see section 6). The deprecated `hard-line-breaks` entry was removed.
- **Line breaks:** Kept 5.1's default: a single line break renders as `<br>`, as in Obsidian (about 24 notes gained 1–6 breaks). `strictLineBreaks` is not set.
- **Markdown order:** GitHubFlavoredMarkdown runs before ObsidianFlavoredMarkdown (orders 30 and 40), as 5.1 requires.
- **Forked plugins:** All forks still declare `quartzVersion: ">=5.0.0"`, which 5.1 accepts (CI builds fail on incompatible or broken plugins). They are based on the 0.1.0 community plugins; the upstream 1.x releases mostly add capability manifests, shared Preact and utils 1.1.
- **Core merge conflicts:** `componentResources.ts` keeps our monolithic CSS bundle, empty-prescript skip and 4KB inline threshold, plus upstream's plugin static assets (`emitStaticAssets`). `handlers.js` keeps our watcher ignores and upstream's config-file watching. `install-plugins.ts` takes upstream's version.
- **Plugin dependency bumps:** note-properties bundles `toml` 5 (security fix). og-image was later moved to `satori` 0.63 (see section 4).
- **`npm test`:** the forked plugins' vitest suites under `custom-plugins/*/test` are picked up by the root `tsx --test` run and fail without vitest installed; core tests pass.
