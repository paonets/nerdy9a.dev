---
created: 2026-05-25 13:10
updated: 2026-06-01 09:50
tags: [claude-code, ai-tools, large-codebases, anthropic, ai, software-engineering, claude, source/article]
publish: true
source: "https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start"
---

## Summary & Key Takeaways

This article explores how Claude Code operates effectively within large-scale codebases. It emphasizes that the **harness** (the ecosystem surrounding the model) is just as critical as the underlying AI model itself.

### Key Concepts
- **Agentic Search over RAG:** Rather than relying on centralized, outdated Retrieval-Augmented Generation (RAG) indexes, Claude Code traverses files locally using agentic search (grep, directory navigation) for real-time accuracy.
- **The Claude Code Harness:** Claude is extended via `CLAUDE.md` files, hooks, skills, plugins, and MCP servers, supported by LSP integrations and subagents.
- **Navigability & Maintenance:** Successful adoption relies on keeping context lean, scoping commands locally, and actively pruning obsolete configurations as model intelligence evolves.
- **Governance:** Assigning a Directly Responsible Individual (DRI) or an agent manager team to govern plugins, security, and conventions.

---

## 1. How Claude Code Navigates Large Codebases

Instead of building and uploading an embedding index (which easily becomes stale in active codebases), Claude Code works like a developer:
- It runs locally on the developer's machine.
- It navigates the directory structure, searches via grep, and reads live file content.
- **Tradeoff:** It performs best with clear starting context. Without structured context files or symbol references, searching massive repositories can hit context window limits quickly.

---

## 2. The Extension Harness

The environment surrounding Claude Code (the harness) determines its overall performance. The harness is composed of five extension points and two support capabilities:

### The Extension Points
1. **`CLAUDE.md`**: Loaded automatically at session start. Best kept layered (root for high-level structure, subdirectories for localized conventions).
2. **Hooks**: Scripts run at specific event triggers (e.g., auto-formatting code, proposing `CLAUDE.md` updates at the end of a session, or loading contextual environment data at start).
3. **Skills**: Modular, on-demand instructions for specialized tasks (e.g., security audits or documentation updates) to keep the default context window clean.
4. **Plugins**: Standardized packages bundling skills, hooks, and MCP configurations to share and distribute working environments team-wide.
5. **MCP Servers**: Model Context Protocol servers connecting Claude to external resources, internal tools, search tools, APIs, and databases.

### Core Capabilities
- **Language Server Protocol (LSP) Integrations**: Connects Claude to local language servers for symbol-level navigation ("go to definition", "find references"). Crucial for avoiding text-match noise in typed/compiled languages (e.g., C, C++, Java).
- **Subagents**: Independent Claude instances with isolated context windows delegated to run specific tasks (like codebase mapping) and return results back to the main agent.

![image](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a04aaf1c37c6196e5ee19bb_fig1-the-claude-code-harness-v1%402x.png)

*Claude Code’s extension layer at a glance.*

### Harness Component Matrix

| Component | What it is | When it loads | Best for | Common confusion |
| --- | --- | --- | --- | --- |
| **`CLAUDE.md`** | Automatic context file | Every session | Project-specific conventions, codebase overview | Placing reusable skills/rules inside it |
| **Hooks** | Event-triggered scripts | Specific triggers | Automation (formatting), context capturing | Using prompts for things that should run automatically |
| **Skills** | Modular instructions | On demand | Specialized workflows (e.g., security, docs) | Overloading `CLAUDE.md` instead |
| **Plugins** | Packaged harness configs | When configured | Distributing standardized setups org-wide | Letting good setups stay tribal |
| **LSP** | Real-time code intelligence | When configured | Symbol-level navigation and error detection | Assuming symbol search is automatic |
| **MCP Servers** | External tool connections | When configured | Integrating APIs, databases, ticketing | Building integrations before basics work |
| **Subagents** | Isolated Claude instances | When invoked | Delegating exploration and parallelizing tasks | Mixing exploration and edits in one session |

---

## 3. Deployment & Configuration Patterns

Successful monorepo and legacy deployments follow three key configuration patterns:

### Pattern A: Legibility and Navigation
- **Layered `CLAUDE.md`:** A lean root file (pointers/gotchas only) combined with nested subdirectory files for local guidelines.
- **Local Initializations:** Running Claude from relevant subdirectories rather than the codebase root so it starts with a scoped directory perspective.
- **Scoped Tooling:** Configuring build, test, and lint commands at the subdirectory level to prevent unnecessary full-repo test runs.
- **Noise Reduction:** Adding generated/build files to `.ignore` or configuring `permissions.deny` in `.claude/settings.json`.
- **Codebase Maps:** Using light markdown index files to describe directory layouts where structural naming isn't standard.
- **LSP-driven Search:** Replacing expensive string-based grep with symbol-precision search using language servers.

### Pattern B: Continuous Configuration Pruning
- Model capabilities improve over time, making older prompt workarounds and instructions obsolete.
- Review and prune `CLAUDE.md` rules, hooks, and custom skills every **3–6 months** or after major model releases to eliminate unnecessary overhead.

### Pattern C: Ownership and Adoption
- **Dedicated Setup:** Appoint a team (e.g., Developer Experience) or a Directly Responsible Individual (DRI) / Agent Manager to curate plugins, maintain configurations, and evangelize best practices.
- **Governance:** Establish approved plugins/skills checklists and integrate AI-authored code changes into existing standard code review workflows.

![image](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a04e25f1984beb50dc5525b_fig2-phases-of-claude-code-rollout-v1%402x.png)

*Phases of Claude Code Rollout.*

---

## 4. Applying Patterns to Your Organization

While Claude Code assumes standard Git repos and conventional structures, custom setups (such as game engines with binary assets or custom version control) will require bespoke harness tuning. Early cross-functional collaboration between engineering, security, and governance teams is recommended for establishing rollouts.

![image](https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a04e2860abbe67418ca0f8b_fig3-getting-started-checklist-v2%402x.png)

*Getting started checklist.*

---
***Acknowledgements:*** *Special thanks to Alon Krifcher, Charmaine Lee, Chris developments, Chris Concannon, Harsh Patel, Henrique Savelli, Jason Schwartz, Jonah Dueck and Kirby Kohlmorgen from Anthropic’s Applied AI team for sharing their experience deploying Claude Code at scale, and to Amit Navindgi at Zoox for providing feedback on this article.*
