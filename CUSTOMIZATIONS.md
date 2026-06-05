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
- **Dynamic MIME Type Detection:** Added dynamic detection of the site logo's MIME type (checking PNG vs JPEG magic bytes). Since `icon.png` in the static resources is actually a JPEG image renamed to PNG, declaring it with a hardcoded `data:image/png;base64` MIME type caused `librsvg` (within `sharp`) to fail silently during conversion, dropping the avatar from the generated social card. Correctly setting the MIME type dynamically allows the chibi boy logo to render beautifully on the generated cards.
- **Local Build Speed-up (Bypass):** Disabled for all local builds to reduce rebuild times from ~11 seconds to under 1 second.
  - **Mechanics:** In `quartz.ts`, we check `process.env.CF_PAGES === "1" || process.env.CI === "true" || process.env.CI === "1"`. If false, we dynamically filter out the `CustomOgImages` emitter.
  - **Testing locally:** Test image generation locally by running: `CF_PAGES=1 npx quartz build`.

### 5. Translation Callout Stripping (`custom-plugins/description`)

- **How it works:**
  1. Traverses the HTML AST in-place to automatically add `loading="lazy"` and `decoding="async"` attributes to all images in the post body (skipping the above-the-fold homepage logo).
  2. Clones the HAST (HTML AST) tree using `rfdc` and filters out all `blockquote` elements (which markdown callout boxes `> [!NOTE]` map to) before extracting the text description using `toString(tree)`.
- **Why it was done:**
  1. Default Quartz does not lazy-load post body images, causing significant bandwidth overhead and poor PageSpeed scores for travel journals with many photos.
  2. The note translator script automatically injects translation notices at the very beginning of the notes. Stripping blockquotes prevents these banners from leaking into `<meta name="description">` tags and the text of generated OG images, while keeping them perfectly visible on the actual rendered HTML page.

### 6. Date and Description Retention in JSON Index (`custom-plugins/content-index`)

- **How it works:** Modified `src/emitter.ts` to prevent deleting the `date` and `description` properties from the simplified JSON index (`public/static/contentIndex.json`).
- **Why it was done:** The homepage uses client-side JavaScript to render the "Recently Updated" section dynamically. Keeping dates in the index allows client-side sorting and relative time rendering without requiring additional file fetches or RSS XML parsing, leading to instant page loads.

### 7. Support for Obsidian Frontmatter Date Fields (`custom-plugins/created-modified-date`)

- **How it works:** Modified `src/transformer.ts` to check `date` as a fallback for created time, and `updated` as a fallback for modified time in the Markdown frontmatter (mapped to `dates.created` and `dates.modified` respectively).
- **Why it was done:** By default, the plugin only looks for `created` and `modified` in the frontmatter. Notes authored in the Obsidian vault use the standard keys `date` (for creation) and `updated` (for updates). Because the plugin did not recognize them, it fell back to Git commit timestamps or filesystem timestamps (which reset to "now" whenever the python publish/sync script runs), leading to incorrect modification dates for notes on the homepage.

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
