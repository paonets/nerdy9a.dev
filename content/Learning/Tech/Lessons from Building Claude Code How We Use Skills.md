---
created: 2026-06-08 10:16
updated: 2026-06-08 10:16
tags: [learning, tech, ai, software-engineering, source/article]
source: https://claude.com/blog/lessons-from-building-claude-code-how-we-use-skills
publish: true
---


# Lessons from Building Claude Code: How We Use Skills

**URL:** https://claude.com/blog/lessons-from-building-claude-code-how-we-use-skills

## Summary
At Anthropic, "skills" are folders containing instructions, scripts, and resources that help Claude Code work more efficiently and accurately. Rather than just raw text/markdown, skills are rich extension points featuring dynamic hooks, scaffolding, code, and persisted data. This article categorizes their 9 main internal skill types (ranging from library reference and verification drivers to runbooks and infra ops) and shares practical design patterns—such as gotchas sections, progressive disclosure, on-demand hooks, and memory files—for building high-quality agent extensions.

---

## Details

### 1. What are Agent Skills?
- **Beyond Text:** A common misconception is that skills are "just markdown files." They are actually **directory-based packages** containing scripts, assets, data, and configuration options (like dynamic hooks) that the agent can discover, explore, and run.
- **Context Engineering:** Allows progressive disclosure, ensuring the model only pulls in information (like API references or migration templates) when it actually needs it, rather than bloating the main system prompt.

### 2. Nine Categories of Internal Skills at Anthropic
1. **Library and API Reference:** Explains how to use internal libraries, CLIs, or SDKs correctly, focusing on gotchas and reference snippets (e.g., `billing-lib`, `internal-platform-cli`).
2. **Product Verification:** Automates testing and verification (e.g., driving Playwright, TMUX, or Stripe test runs and recording videos of output). *This has the most measurable impact on output quality; dedicating engineering time to verification skills pays off immensely.*
3. **Data Fetching and Analysis:** Connects the agent to monitoring and data warehouses, specifying query schemas, database IDs, and metrics definitions (e.g., `funnel-query`, `cohort-compare`).
4. **Business Process and Team Automation:** Streamlines multi-step workflows like standup compilation, ticketing schema enforcement, and weekly recaps.
5. **Code Scaffolding and Templates:** Scaffolds new workflows, files, or configurations when natural language parameters are too complex for static templates (e.g., `new-migration`, `create-app`).
6. **Code Quality and Review:** Critiques code from a fresh perspective or enforces lint styles (e.g., `adversarial-review` which spawns a critique subagent).
7. **CI/CD and Deployment:** Manages building, smoke-testing, progressive traffic rollouts, and automatic rollbacks (e.g., `babysit-pr`, `deploy-<service>`).
8. **Runbooks:** Maps symptoms (e.g., alert payloads, errors) to troubleshooting paths and compiles debug reports.
9. **Infrastructure Operations:** Routine and destructive tasks that benefit from interactive approval prompts and guardrails (e.g., cleaning up orphaned resources).

### 3. Key Design Patterns & Tips for Building Skills
- **Avoid Stating the Obvious:** Claude already knows standard syntax and basic algorithms. Focus on gotchas, custom org rules, and design philosophies (e.g., avoiding generic fonts/color palettes).
- **Prioritize the "Gotchas" Section:** This is the highest-signal content in any skill. Document subtle bugs, append-only assumptions, and trace ID naming variances across systems.
- **Use Progressive Disclosure:** Keep the entry `SKILL.md` clean and tell Claude about subfolders (e.g., `references/api.md` or templates in `assets/`). The agent will inspect them dynamically when needed.
- **Do Not Railroad:** Avoid instructions that are too rigid. Let the agent adapt to edge cases.
- **Build Clean Setup Flows:** If a skill requires user variables (e.g., Slack channels), store configurations in a local `config.json` and prompt the user to initialize them using the `AskUserQuestion` tool if missing.
- **Optimize for Model Triggers:** Write skill descriptions specifically for the model's router to scan, using clear action-oriented keywords ("use when you want to...").
- **Stateful Memory:** Help the agent learn or persist history by writing to an append-only log file or local SQLite DB within `${CLAUDE_PLUGIN_DATA}`.
- **Empower with Code/Scripts:** Rather than having Claude write code from scratch, supply pre-written script libraries so it only needs to coordinate and run commands.
- **On-Demand Hooks:** Implement temporary hooks (e.g., `careful` blocks force-pushes or DB drops, `freeze` restricts file writes outside target directories) that only apply to the current session.

### 4. Composition and Distribution
- **Local vs. Marketplace:** Small teams can check skills directly into git (`./.claude/skills`). Larger teams use internal marketplaces, allowing individual devs to opt-in to plugins without bloating every session's context.
- **Composition:** Skills can refer to other skills by name; the agent will automatically chain them if they are installed.
- **Measurement:** Hook into `PreToolUse` events to log skill execution metrics, helping identify under-triggered or popular skills.

## Related Notes
- [[How Claude Code Works in Large Codebases]] - Context on how Claude Code parses repositories.
- [[How Anthropic Enables Self-Service Data Analytics with Claude]] - Case study on data analytics skills and verification.
