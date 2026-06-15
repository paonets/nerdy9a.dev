---
created: 2025-05-25 21:56
updated: 2026-06-09 15:40
publish: true
tags: [synthesis, tech, ai, obsidian, mobile, architecture]
source: WisdomWell Original
---

# Obsidian Mobile and Remote AI Architecture

This note outlines the high-level architectures, UI strategies, data topologies, and setup configurations for running AI workflows (such as **Claude Code** and **Hermes**) with an Obsidian vault on mobile devices (iOS/Android).

---

## 🎯 Core Mobile Use Cases

1. **Travel & Consultation:** Contextual, low-latency chatting with large travel logs and itineraries while on the go.
2. **Frictionless Capture:** Rapid voice dictation or messy fleeting thought capture to be formatted, tagged, and indexed in the background.
3. **Remote Agent Execution:** Invoking powerful CLI agents on the remote vault directory to perform complex refactorings or compile the digital garden.

---

## 🏛️ Client-Side UI Interfaces

| UI Approach               | Mechanics                                                                                            | Pros                                                                                                                                      | Cons                                                                              |
| :------------------------ | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Custom Plugin**         | Runs inside Obsidian Mobile. Adapts to sidebars (e.g. BMO Chatbot) or works inline (Text Generator). | Native feel, direct vault API access, no sync conflicts.                                                                                  | Obsidian startup latency (2-3s), battery/RAM limits.                              |
| **Standalone PWA**        | Web app saved to home screen communicating with a remote server bridge.                              | Custom UI layouts, instant app launch, premium animations.                                                                                | Fragile; requires continuous SSH/tunnels to host Mac.                             |
| **iOS Shortcuts / Siri**  | Triggered via Action Button, lock screen, or Siri AI voice. Interacts via native **App Intents**.    | **Two-way context (new in iOS 27):** Siri AI/Shortcuts can query, search, and edit vault notes directly without opening the Obsidian app. | Limited to standard UI dialogs and templates.                                     |
| **Companion SwiftUI App** | Native iOS app built with SwiftUI reading the vault container directly on device.                    | Instant app launch, high-performance animations (Liquid Glass UI), access to native on-device AI models.                                  | Requires compiling/installing a custom Swift app (cannot run Javascript plugins). |

---

## ⚙️ Core Architectural Pathways

### 1. Pure On-Device Sandbox (Client-Side Only)

- **Mechanics:** All AI calls are made directly from the mobile browser sandbox to cloud APIs (Gemini/Claude).
- **Capabilities:** Reading/writing to the active note, executing inline edits, and performing simple keyword searches using Obsidian's in-memory metadata cache.
- **Mobile Constraints:** You cannot run standard stdio-based **MCP servers** (requires local subprocesses), compile local vector databases for semantic search, or run headless web scrapers.

### 2. Server-Side Host Gateway (Remote Agent Control)

- **Mechanics:** The mobile phone acts as a thin client (paired web console, chat window, or messenger) that remote-controls an always-on host machine (M1 Mac or VPS) containing the synced vault.
- **Capabilities:** Runs agentic coding assistants (like **Claude Code** inside a `tmux` session) with full access to local scripts, automated file structures, and advanced tools.
- **Outbound websockets:** Handled securely via outbound connections (using `claude remote-control`), meaning no incoming port forwarding or public tunnels are required.

---

## 🍏 Leveraging iOS 27 & WWDC 2026 AI Frameworks

With the announcements at [[WWDC 2026 Keynote]], iOS 27 and macOS 27 introduce native AI subsystems that bypass mobile CPU/battery constraints:

### 1. Siri AI Integration (App Intents)

By exposing Obsidian's filesystem or search features via **App Intents**, you integrate directly into iOS 27's revamped **Siri AI** (powered by Google Gemini):

- **Capabilities:** Ask Siri AI directly to summarize note directories, find itinerary details, or format a webpage clip and append it to your vault in the background without launching Obsidian.
- **Multi-App Tasks:** Siri AI can coordinate between Mail, Calendar, Safari, and Obsidian natively.

### 2. Companion SwiftUI App (Hybrid Swift Wrapper)

By wrapping your vault in a custom iOS SwiftUI shell utilizing Apple’s **Foundation Models framework**:

- **Local Processing:** Employs the local Apple on-device LLM to process embeddings, tags, and summary indexing on the iPhone's Neural Engine with minimal battery drain.
- **Cloud Hand-offs (Claude SDK):** If you ask a complex, RAG-heavy query about your whole vault, the app uses the unified `LanguageModel` protocol to securely hand off the task to **Claude** in the cloud (using Anthropic's native Swift SDK), returning structured, type-safe data (via `@Generable` annotations).
- **OS Version Note:** The Foundation Models framework launched in **iOS 26** for local model use, but the **multi-model cloud hand-off (Claude)**, multimodal support, and custom skills require **iOS 27**.
- **Sandbox File Access & Sync Limits:**
  - _iCloud Container (Seamless Background Sync):_ Reads/writes to the shared iCloud Drive folder (`iCloud~md~obsidian`). macOS/iOS background system processes (`bird`) handle syncing automatically in the background, even when both apps are closed.
  - _Document Picker (Obsidian Sync Vaults):_ Connects to Obsidian's private sandbox folder using `UIDocumentPickerViewController` to obtain persistent security-scoped folder access. **Critical Limitation:** Obsidian Sync only runs when the official Obsidian app is open in the foreground. If the Obsidian app is closed, new edits made on your Mac will not sync to the phone's disk, causing the SwiftUI companion app to read stale data until Obsidian is manually opened to trigger a sync pull.
  - _Custom WebSocket Sync:_ Bypasses local folder syncing entirely by connecting directly to the Mac server on startup via WebSockets, pulling/pushing vault modifications in real-time under 100ms.

---

## 🛠️ Remote Host Setup Options

### Option 1: Always-On Home Mac Server (iCloud Sync)

- **Mechanics:** Run the agent on a home Mac (e.g., M1 MacBook Air) that is natively synced with your iOS devices via iCloud.
- **Setup:** Start a persistent `tmux` session inside the vault folder on your Mac and run `claude remote-control`. Pair using the generated mobile pairing link.
- **Hardware Tuning:**
  - _Lid Position:_ Keep the lid open 1–2 inches to prevent heat buildup on fanless laptops. Turn display brightness to 0%.
  - _Battery Health:_ Use a utility like **AlDente** to cap the charge limit at **50%–60%** to prevent battery bloating.
  - _Wake Control:_ Use **Amphetamine** to prevent automatic sleep when the display is locked.

### Option 2: Linux VPS / Raspberry Pi Server (Obsidian Sync)

- **Mechanics:** Host the agent on a Virtual Private Server (VPS) or a local Raspberry Pi, keeping the notes synced using Obsidian's official sync service.
- **Setup:** Install Node.js on the server and use `obsidian-headless` to continuously sync your vault in the background. Run `tmux` and start the remote console: `claude remote-control`.
- **Hardware Note:** If using a local Raspberry Pi, the **8GB RAM model** is recommended to prevent memory constraints.

### Option 3: Hermes AI Bot Gateway (Telegram / Discord / Slack)

- **Mechanics:** Run a lightweight messenger gateway (e.g., **Hermes** or **OpenClaw**) on your home Mac or VPS. The gateway translates messaging app inputs (text or transcribed voice) into vault edits.
- **Setup:** Register a bot token with your chosen messaging platform and configure the gateway script on your server, pointing it to your synced vault folder. You then chat with the bot from your phone's native messaging app.
- **Pros:** Zero mobile battery impact, instant start, native voice-memo transcription, and runs completely in the background without needing browser consoles or opening the Obsidian app.

---

## ⚠️ Sync Safety Rules

### 1. The Double-Sync Trap

**Never** run Obsidian Sync on a vault folder that is also actively inside your iCloud Drive app container (`iCloud~md~obsidian`). Having two sync engines writing to the same folder creates sync loops, duplicate conflict files (e.g., `Note 2.md`), and high CPU drain.

- _iCloud Sync:_ Must stay in `/Users/username/Library/Mobile Documents/iCloud~md~obsidian/Documents/`.
- _Obsidian Sync:_ Vault can be moved anywhere outside the iCloud containers (e.g., `~/Documents/WisdomWell`).

### 2. Automated Git Backups

- **Auto-Commit:** To backup your vault, run the **Obsidian Git** plugin on the M1 Mac / VPS server _only_ (configured to commit and push to a private GitHub repo every 60 minutes).
- **Isolation:** Keep the Git plugin **disabled** on all mobile devices and workstations to prevent merge conflicts.

### 3. Alternative Sync Mechanisms

If looking to avoid proprietary services (Obsidian Sync) or iCloud latency:

- **Syncthing (via Möbius Sync / Synctrain):** Free and fully open-source. Syncs files between devices locally.
  - _iOS Constraints:_ iOS strictly limits persistent background execution, causing Syncthing to sync irregularly (5–15+ min delays) or require manual app launches to force sync. Hashing files in the background also increases battery consumption.
- **Custom WebSocket Sync (Best for Custom Companion Apps):** If you build a custom iOS app, you can write a tiny directory-watching Node.js server (using `chokidar`) on your Mac that listens on a secure WebSocket port. Your custom Swift app connects on startup, instantly pulls file diffs, and streams edits back. This provides sub-100ms real-time sync, zero background battery usage, and complete sandbox bypass.

---

## 🔒 Security Guidelines

1. **Outbound Tunnels Only:** Rely on outbound connections (like Claude Remote Control) to avoid open public ports on your home network.
2. **Launch Paths:** Always launch terminal agents from the root directory of your vault to prevent file traversal into other system folders.
3. **Interactive Approvals:** Keep CLI confirmation prompts enabled for remote sessions to verify file deletions or command executions.

---

## 📚 Related Projects & Reference

- **Client-Side Companion App:** Obsidian Mobile Apple Intelligence — Standalone native iOS companion app utilizing App Intents and local Foundation Models.
- **Server-Side Host Gateway:** Set Up Remote Claude Code (Archived) — Setup guide for hosting a remote agent gateway on a local Mac or VPS.
- **WWDC Event Context:** [[Learning/Tech/WWDC 2026 Keynote|WWDC 2026 Keynote]] — Apple Intelligence announcements, local models, and developer protocols.
