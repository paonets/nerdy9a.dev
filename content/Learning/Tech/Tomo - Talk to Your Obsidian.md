---
title: "App Idea: Tomo — Talk to Your Obsidian"
publish: true
tags:
  - tech
  - ai
  - obsidian
  - mobile
  - apple-intelligence
  - project
created: 2026-06-09 17:35
updated: 2026-06-14 06:42
source: WisdomWell Original
---

# Tomo: Talk to Your Obsidian

> **Your notes, now with a voice.**
>
> _Tomo is a native SwiftUI companion app that bridges your personal Obsidian vault with real-time online intelligence, location telemetry, and Siri orchestration._

---

## ⚡ Two Ways to Interact

Tomo provides a dual-interface designed for both on-the-go quick actions and deep, focused thinking:

- **🎙️ Siri AI (Voice & On-the-Go):** Hands-free control via iOS App Intents. Perfect for quick lookups, dictating notes while walking, or invoking location-based commands in your AirPods.
- **💬 In-App Chat Console (Deep Work & Writing):** A dedicated, private chat panel next to a clean markdown editor. Perfect for deep research, writing articles, summarizing monthly journals, and typing detailed queries.

---

## 🍏 The Apple Intelligence Difference

Older integrations relied on rigid voice templates (e.g., Apple Shortcuts that could only run pre-defined scripts). Tomo leverages the next-generation Apple AI and App Intents frameworks to enable true context-aware intelligence:

| Capability            | Legacy Siri (Shortcuts)                                | Next-Gen Siri AI (Tomo + Apple AI)                                                                                                            |
| :-------------------- | :----------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search Method**     | Rigid, exact keyword matches.                          | **Semantic Search:** Understands concepts (e.g., matching _"Kyoto sights"_ to travel notes containing temples).                               |
| **App Orchestration** | Can only open apps or run static, hardcoded shortcuts. | **Dynamic Chaining:** Siri reasons across apps (e.g., reading a note, extracting tasks, and registering them in Reminders).                   |
| **Context Awareness** | None.                                                  | **On-Screen & Location Context:** Siri understands what you are reading in Safari or matches recommendations to your active GPS location.     |
| **Privacy & RAG**     | Required sending note text to cloud endpoints.         | **Local Neural Engine:** Semantic search and summaries are processed 100% on-device via Apple's CoreSpotlight AI — no data leaves your phone. |

---

## 📱 Siri + Second Brain in Action (Voice Scenarios)

Here is how Tomo combines the voice of Siri with the knowledge of your Second Brain:

### 🤝 1. Hands-Free Meeting Briefings (Personal CRM)

- **Scenario:** You're walking to a coffee shop to meet a contact.
- **Voice Command:** _"Siri, what did I discuss with Sarah last time and what projects is she working on?"_
- **Behind the Scenes:** Siri calls Tomo to search your meeting logs and project folders, summarizes the key takeaways, and reads them directly into your AirPods.

### 🗺️ 2. Personal Taste Matcher (Travel + Online Search)

- **Scenario:** You're exploring Kyoto and want a lunch recommendation.
- **Voice Command:** _"Siri, suggest a good lunch spot nearby."_
- **Behind the Scenes:** Siri fetches highly-rated restaurants online, filters them against the food preferences, allergies, and wishlists stored in your vault (e.g. _loves ramen, avoids spicy food_), and suggests the perfect spot.

### 📝 3. Seamless Life Logging (Project & Asset Trackers)

- **Scenario:** You just refueled your car or finished a study session.
- **Voice Command:** _"Siri, log a refuel of 800 THB to my Toyota Altis tracker."_
- **Behind the Scenes:** Siri finds the matching asset note in your vault, formats the date and value into a clean markdown table row, and appends it directly to the note.

### 📋 4. Auto-Sync Checklist (Notes to Reminders)

- **Scenario:** You want to sync your project checklists with your system reminders.
- **Voice Command:** _"Siri, find my house renovation note and add all incomplete tasks to my Reminders."_
- **Behind the Scenes:** Siri reads the note's markdown checkboxes and automatically creates individual task items in your iOS Reminders app.

---

## 💬 In-App Chat in Action (Deep Work & Writing)

For complex tasks that require writing, reviewing, and high cognitive load, the dedicated in-app chat console works directly alongside the local markdown editor:

### 📈 1. Weekly Reflection & Journal Analysis

- **Scenario:** You're doing a weekly review on Sunday evening.
- **Chat Prompt:** _"Analyze my daily logs from the past week. What were my top accomplishments, and what blocker patterns kept recurring?"_
- **Behind the Scenes:** Tomo retrieves the last 7 daily journal files directly from your vault, parses the text locally on-device, and drafts a structured summary highlighting your progress and time sinks.

### ✍️ 2. Knowledge Synthesis & Article Drafting

- **Scenario:** You want to write a blog post using your compiled research.
- **Chat Prompt:** _"Synthesize my notes on 'Y Combinator AI Startups' and draft a 500-word article about product-market fit."_
- **Behind the Scenes:** Tomo searches your vault semantically, retrieves the most relevant notes, uses a cloud model (like Claude) for advanced reasoning, and streams the draft article directly into the side-by-side markdown editor for you to polish.

### 🇯🇵 3. The Ultimate Language Tutor (Voice Speaking + Text Feedback)

- **Scenario:** You want to practice conversational Japanese using vocabulary you've actually studied.
- **Voice Practice:** Ask Siri: _"Practice Japanese with me."_ Using your vault's study notes (like `Learning/Japanese/`), Siri conducts a state-of-the-art back-and-forth spoken conversation, correcting your pronunciation in real-time.
- **In-App Feedback:** Later, open the Tomo app to find a written transcript of your spoken lesson. The chat console displays detailed grammar corrections, definitions, and spelling drills right next to your study sheets.

---

## 🔒 Privacy & API Cost Control

- **Free by Default:** On-device AI (Apple Neural Engine) and Apple's Private Cloud Compute run at zero cost — no API keys needed for most tasks once the app is on the App Store.
- **Your Own Keys (Optional):** For very large context tasks (200K+ tokens), bring your own API key for Claude (via Anthropic or OpenRouter), Gemini, OpenAI, DeepSeek, Groq, or a self-hosted Ollama server. Keys are stored securely in the iOS Keychain with zero subscription markup.
- **iCloud Native:** Accesses your vault safely using iOS document sandboxing and security-scoped bookmarks.
- **Private Index:** Your search index lives entirely on-device inside iOS CoreSpotlight and is never uploaded to any servers.

---

## 🖥️ macOS Desktop & Deep Linking

Tomo is designed as a companion app, not an editor replacement.

- **macOS Desktop Version**: A lightweight companion app (operating in the menu bar or running as a background daemon) will handle native CoreSpotlight indexing for your local vaults on macOS.
- **Deep-Link Redirection**: When you select a search result in Spotlight (indexed by Tomo) or click a note within Tomo, the app opens it directly in Obsidian. This is achieved by registering Spotlight searchable items and linking in-app actions to the native Obsidian URI scheme:
  - **Open Note**: `obsidian://open?vault=VaultName&file=Path/To/Note.md`
  - **Search**: `obsidian://search?vault=VaultName&query=SearchQuery`
    This workflow ensures you use Spotlight and Siri for rapid search and automation, but transition back to Obsidian's rich editing environment for focused writing.

---

## 🚀 How It Works (Under the Hood)

1.  **Select Your Vault:** Point the app to your Obsidian folder in iCloud Drive or local disk.
2.  **On-Device Indexing:** The app scans your vault and registers every note into iOS/macOS CoreSpotlight — Apple's on-device search engine. No external database, no custom embeddings.
3.  **Real-Time Sync:** It monitors your vault in the background, updating the search index incrementally whenever you write a note in Obsidian.
4.  **Hybrid Routing Engine:** Intelligently routes queries — local notes are searched on-device via Apple Intelligence, short tasks run on the Neural Engine, and complex reasoning escalates to Apple's Private Cloud Compute or your own cloud API keys.
