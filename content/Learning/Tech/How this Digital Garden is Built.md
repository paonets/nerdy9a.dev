---
title: How this Digital Garden is Built
publish: true
tags:
  - tech
  - software-engineering
  - obsidian
created: 2026-05-31 22:05
updated: 2026-06-06 06:32
source: "WisdomWell Original"
---

# How this Digital Garden is Built

This digital garden (**[nerdy9a.dev](https://nerdy9a.dev)**) is designed to publish public notes from a private Obsidian vault without leaking personal data or breaking link integrity.

## 📓 What is Obsidian?

If you aren't familiar with [Obsidian](https://obsidian.md/), it is a powerful, local-first note-taking app that acts as a "second brain." Notes are stored in standard Markdown (`.md`) files on your device, giving you complete ownership of your data. By using `wikilinks` to connect ideas, you build a web of interconnected knowledge that grows over time.

Because Obsidian stores everything in plain text, it is also highly compatible with AI models and agents. To see how to supercharge your setup, watch my YouTube guide on how to turn Obsidian into a personal AI assistant:
🎥 **[เปลี่ยนโน้ตให้เป็นเลขาอัจฉริยะด้วย Obsidian และ Claude AI (Obsidian AI 101)](https://www.youtube.com/@nerdy.mr.a)** on my channel **[Nerdy with Mr.A](https://www.youtube.com/@nerdy.mr.a)**.

---

## 🏗️ Architecture Blueprint

Instead of manual setup, you can easily build this website publishing pipeline using an AI coding assistant (like Claude, Gemini, or ChatGPT). Here is the architectural blueprint, the logic behind the technology choices, and how to prompt an AI to set it up for you.

The system splits note authoring from web hosting to keep your private notes safe and your local git repository clean of iCloud sync overhead:

```mermaid
graph TD
    subgraph iCloud ["iCloud Drive (Private Vault)"]
        Vault["Obsidian Vault: WisdomWell"]
        Script["Scripts/publish.py"]
    end

    subgraph Local ["Local Workspace (Public Code)"]
        Quartz["Quartz 5: ~/Projects/nerdy9a.dev"]
    end

    subgraph Cloud ["Production Cloud Hosting"]
        GitHub["GitHub Repository"]
        Cloudflare["Cloudflare Pages"]
    end

    Vault -->|"(1) Filter & Scan"| Script
    Script -->|"(2) Sanitize & Export"| Quartz
    Quartz -->|"(3) Push"| GitHub
    GitHub -->|"(4) Build Deploy"| Cloudflare
```

---

## 🧠 Why Quartz & Cloudflare?

### Why Quartz?

- **Obsidian-Native**: It natively understands Obsidian-flavored markdown, including `wikilinks`, tags, callouts, and frontmatter.
- **Fast and Local-First**: Built on top of Vite and TypeScript, compiling into flat, static HTML/JS files.
- **Highly Extensible**: Written in TypeScript/React, allowing you to easily customize page layouts, styling, and component behaviors if needed.

### Why Cloudflare Pages?

- **Speed & Global CDN**: Lightning-fast load times globally with zero configuration.
- **Zero Cost**: Excellent free tier with unlimited bandwidth and builds.
- **Git-Integrated CI/CD**: Automatically rebuilds and deploys the site within seconds whenever you push changes to GitHub.

---

## 🔐 The Privacy & Link Integrity Challenge

A raw Obsidian vault is highly interconnected. If you publish notes directly:

1. **Privacy leaks**: Private folders (journals, finance, projects) might accidentally get published.
2. **Broken Links (404s)**: If you exclude private files, any public note containing a `wikilink` to a private file will result in a broken link on the website.

To solve this, we use a custom local python script (`publish.py`) that acts as a gatekeeper. It copies over only the public files and **rewrites** any links to private files back to plain text (e.g., `Finance` is rewritten into plain text `Finance`).

---

## 🌐 Bilingual Translation (i18n)

Instead of manually translating notes, the script uses an **AI-powered translation pipeline** to generate bilingual versions (English & Thai):

1. **Trigger**: You tag a note property with `translate: th` or `translate: en`.
2. **AI Translation**: A script automatically finds these notes, sends them to an AI model (like Gemini or Claude) to translate the title and body, and saves the translations in a local cache file (so you only pay for translation once).
3. **Double Publishing**: The publisher creates two versions of the note on the website—one in the default folder and another in a language folder (like `/th/`). The website automatically adds a language switcher tab so visitors can toggle between them.

---

## 🎨 Customized Features & Optimizations

To make this digital garden both beautiful and extremely fast, it uses a modified version of Quartz 5 with several custom-built enhancements.

### 🌟 Key Customizations

- **Automatic Note Organization**: You can tag notes and have index pages automatically list them based on those tags without organizing them manually.
- **Enhanced Visuals**: Supports large header images (cover photos) with text overlays, plus custom cards for folders.
- **Reference & Source Links**: Easily displays external links (like YouTube source videos or article links) neatly inside the note metadata.
- **Supercharged Page Speed**: Combines files and defers non-critical elements so pages load up to 1.3 seconds faster, especially on mobile connections.
- **Multilingual Support (Thai)**: Previews shared on social media display Thai fonts perfectly, and translation boxes are automatically stripped from search engine previews to keep things looking clean.
- **Interactive Visual Connection Graph**: Visualizes note connections cleanly without draining mobile bandwidth.

---

## 🚀 How to Set Up Your Own Garden

Setting up this pipeline involves two main parts. You don't need to write any code yourself—you can let an AI assistant (like Claude, Gemini, or ChatGPT) do it for you.

### Part 1: The Obsidian Vault Script (The Gatekeeper)

To safely copy notes from your private Obsidian vault to your public website, ask an AI to write a Python script for you with this prompt:

> "Write a Python script that runs locally inside my Obsidian vault to publish notes. It should:
>
> 1. Scan the vault and only copy notes that have `publish: true` in their frontmatter.
> 2. Implement **link sanitization**: check all links (`wikilinks`) inside public notes. If a link points to a private note (not marked for publishing), rewrite the link to plain text so there are no broken links on the website.
> 3. Implement an **AI translation cache**: scan for notes containing `translate: th` or `translate: en`, call an AI API to translate the title/body, cache the result locally to save API costs, and write the translated files to separate language folders (like `/th/`)."

### Part 2: The Quartz Website (Choose Your Path)

To set up the actual website, you have two options depending on how much customization you want out of the box:

- **Option A: Official Quartz (From Scratch)**
  Initialize a clean, vanilla Quartz project by following the official [Quartz Setup Guide](https://quartz.jzhao.xyz/). This gives you the default Quartz theme and structure, which you can customize manually.

- **Option B: Pre-configured Blueprint (Cloning this repository)**
  Clone the public repository **[paonets/nerdy9a.dev](https://github.com/paonets/nerdy9a.dev)** to get all of my speed optimizations, bilingual layouts, custom font caching, and theme setups pre-installed.

  We recommend **cloning** rather than forking, as it gives you a clean history and keeps your personal garden completely separate. Copy the link to my repo and ask your AI assistant:

  > "I want to build a personal digital garden using the pre-optimized Quartz template at this GitHub repository: https://github.com/paonets/nerdy9a.dev.
  >
  > Can you guide me step-by-step on how to:
  >
  > 1. Clone this repository locally to my computer.
  > 2. Clean out the default content in the `content/` folder (leaving a blank `content/index.md` for my homepage).
  > 3. Update `quartz.config.yaml` with my own website name and details.
  > 4. Push this to my own GitHub account.
  > 5. Host it for free on Cloudflare Pages."

This setup works in tandem with the Public Digital Garden workflow, which manages the local script that pushes notes from your private Obsidian vault to your public website.
