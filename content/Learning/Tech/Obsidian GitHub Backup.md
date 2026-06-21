---
title: Obsidian GitHub Backup
publish: true
tags:
  - tech
  - obsidian
  - git
created: 2026-06-21 06:50
updated: 2026-06-21 07:08
source: "WisdomWell Original"
---

# Obsidian GitHub Backup

Setting up a GitHub backup for an Obsidian vault that is synced via iCloud requires a decoupled configuration to prevent repository corruption and sync conflicts.

This document outlines the architecture of your current backup setup, which combines the **Obsidian Git plugin (for human and mobile edits)** with **AI Agent auto-push rules**.

---

## 🏗️ The Architecture (Decoupled `.git`)

Because iCloud frequently syncs files in the background, keeping the hidden `.git/` metadata folder directly inside iCloud can corrupt the Git index.

To prevent this, the setup uses a **decoupled Git directory**:

- **Notes & Markdown Files:** Located in iCloud (`WisdomWell/`) so they sync normally to mobile.
- **Git Metadata (`.git/` folder):** Located outside of iCloud at `~/.obsidian-git/WisdomWell/` on your Mac.
- **The Pointer File:** A plain-text `.git` file inside your vault that points Git to the external metadata folder.

```text
WisdomWell/ (.git file) ──► points to ──► ~/.obsidian-git/WisdomWell/ (.git/ metadata)
```

---

## ⚙️ How Backup Automation Works

### 1. For Your Edits (Desktop & Mobile)

Your human edits are automated on your Mac using the **Obsidian Git** community plugin:

- **Periodic Saves:** The plugin automatically commits and pushes updates to GitHub at regular intervals (e.g., every 30-60 minutes) to avoid commit bloat.
- **On Startup:** The plugin pulls the latest changes and pushes any local ones when Obsidian opens.
- **Mobile Edits:** Changes you make on mobile are synced to your Mac via iCloud. When Obsidian desktop is open, it automatically commits and pushes those edits to GitHub.

### 2. For AI Agent Edits

AI coding assistants (like Antigravity or Claude) follow mandates configured in your AGENTS.md file:

- **Immediate Commits:** Agents commit their changes immediately with descriptive messages of the task they completed.
- **Auto-Push:** Agents push changes to the remote repository `paonets/WisdomWell-Backup` automatically upon completing a file edit task, without prompting you for permission.

## 🤖 AI Agent Auto-Backup Decisions

Unlike human-triggered edits where auto-backup on change is disabled (to avoid commit bloat), AI coding agents are instructed to commit and push immediately after their runs.

This behavior is configured in the vault root's AGENTS.md mandates:

1. **Auto-Commit Agent Edits:** The agent commits its changes with a specific descriptive message detailing the task performed, keeping history clean and attribution clear.
2. **Auto-Push Agent Edits:** The agent runs `git push` automatically without prompting you, keeping remote backups current without causing push approval fatigue.

> [!NOTE]
> **Design Decision: instructions (`AGENTS.md`) vs. Native hooks (`hooks.json`)**
> We initially explored using Antigravity's native `hooks.json` (running shell commands on lifecycle events like `on_file_save`). However, we decided to use instruction-based rules in `AGENTS.md` instead. Instructions allow the agent to:
>
> - Generate context-aware, detailed commit messages rather than static ones.
> - Respond to Git errors (like merge conflicts or lock file issues) dynamically.
>
> We deleted the template `hooks.json` for now and will re-explore native hooks later if needed.

---

## 🔌 Obsidian Git Plugin Setup (On Desktop)

To automate the backups of your human edits while you work on your Mac, you must configure the **Obsidian Git** plugin settings:

1. Open Obsidian on your Mac, go to **Settings > Community plugins > Browse**.
2. Search for **Obsidian Git** and click **Install**, then **Enable**.
3. Open the plugin settings and configure the following parameters:
   - **Vault backup interval (minutes):** Set to `30` or `60` (or `0` to disable automatic backups if you prefer manual commits). This commits work at regular intervals rather than continuously.
   - **Auto backup after file change:** Set to `False` (generally not recommended, see warning below).
   - **Backup on start:** Set to `True` (pulls latest changes and pushes any local ones when you open the vault on your Mac).
   - **Commit message template:** Leave as default (e.g., `backup: {{date}}`).
   - **Push on backup:** Set to `True` (automatically pushes commits to GitHub).

> [!WARNING]
> **Why avoid "Auto backup after file change"?**
>
> - **Commit Bloat:** Obsidian autosaves notes continuously as you type. If Git commits on every single file change, your Git history will be cluttered with hundreds of tiny, meaningless commits per day (e.g., `backup: 2026-06-21 06:52:05`).
> - **Performance Lag:** Running Git commands (`add`, `commit`, and `push`) continuously consumes CPU and disk IO, which can make Obsidian feel sluggish while writing.
> - **iCloud Race Conditions:** Frequent Git operations increase the chance of race conditions between iCloud trying to upload a file and Git trying to lock/index it.

---

## 📱 Troubleshooting & Best Practices

- **Keep Vault Downloaded:** Ensure that "Optimize Mac Storage" is disabled for your vault in iCloud settings, or right-click your vault folder and select **"Keep Downloaded"** to prevent iCloud from offloading files.
- **Avoid Dual-Edits:** Try not to edit the same file on desktop and mobile simultaneously to prevent iCloud sync conflict files.

## 🔗 Related Setup Notes

- Public Digital Garden — Shares a similar git/sync philosophy where we separate authoring from publishing.
- [[Learning/Tech/How this Digital Garden is Built|How this Digital Garden is Built]] — More details on publishing scripts and folder-sync methods.
