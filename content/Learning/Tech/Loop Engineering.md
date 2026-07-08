---
created: 2026-07-08 16:22
updated: 2026-07-08 18:47
tags:
  - learning
  - ai
  - software-engineering
  - synthesis
  - source/article
source: https://x.com/AndrewYNg/status/2071988145667928442
publish: true
---

# Loop Engineering

**Loop Engineering** is a software development paradigm that emerged in mid-2026. It marks a shift from manual, turn-by-turn prompt engineering to designing autonomous, self-correcting agentic systems where human developers design programmatic loops that guide AI agents toward goals.

Instead of a developer sitting at a chat interface typing prompts and copy-pasting code, loop engineering focuses on creating execution environments (or "harnesses") that allow AI agents to run iteratively, debug themselves, and verify their outputs against structured success criteria.

---

## 1. The Core Philosophy: "My Job is to Write Loops"

The term and paradigm gained viral traction on social media in mid-2026 following statements from key figures building state-of-the-art developer tools:

- **Boris Cherny** (Creator of [[How Claude Code Works in Large Codebases|Claude Code]] at Anthropic):
  > _"I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops."_
- **Peter Steinberger** (Creator of OpenClaw):
  > _"You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."_

Both creators advocate for shifting the developer's operational role. Instead of being the manual orchestrator ("babysitting" the AI), the developer acts as a systems architect who designs the loop, provides the agent with appropriate tools, and establishes rigorous verification checks.

### How Boris Cherny (Claude Code) Uses Loops

In his developer workflows, Boris Cherny implements loops to remove the latency of the "human turn" (waiting for responses):

- **Parallel Execution:** He runs multiple parallel instances of Claude Code (often 5+ terminal tabs) working on separate Git branches to handle parallel feature development.
- **Task Automations:** Uses lifecycle hooks, scheduled cron tasks, and GitHub Actions to run background triage, code reviews, and dependency upgrades.
- **Evaluator-Implementation Split (`/goal` command):** He invokes the `/goal` command, which uses an agentic loop under the hood. While one sub-agent implements the change, a separate verifier model evaluates the success criteria (e.g., "tests pass, linter is clean") to prevent the implementing model from "grading its own homework."

### How Peter Steinberger (OpenClaw) Uses Loops

Peter Steinberger implements loops in OpenClaw with a focus on simplicity, parallel terminals, and custom tooling:

- **Cron-triggered Maintenance Loops:** He sets OpenClaw to run on a regular schedule (e.g., waking up every 5 minutes) to discover issues, summarize bugs, and auto-review commits across multiple repositories.
- **Isolated Workspaces:** He avoids complex workspace setups by checking out repositories into separate folders, ensuring that parallel agents do not conflict.
- **Custom Meta-Tooling:** To make loops faster, he designs specialized tools like _Peekaboo_ (for UI screenshot parsing) and _Poltergeist_ (for hot-reloading code), streamlining the environment the agent runs inside.
- **Human Gatekeeping:** Rather than allowing loops to commit blindly, his loops are designed to gather evidence, propose fixes, and surface complex edge cases to a triage channel for human review.

---

## 2. Addy Osmani's Loop Architecture (The 5 Primitives + 1 State)

Practitioner **Addy Osmani** formalized the concept of loop engineering as a layer that sits "one floor above" the agent harness. He defined the paradigm as **"replacing yourself as the person who prompts the agent. You design the system that does it instead."**

Osmani outlines a framework consisting of **five core primitives** and **one state mechanism**:

| Primitive                 | Job in the Loop                                          | Claude Code Implementation                                       | OpenClaw / Codex Implementation                      |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| **1. Automations**        | Discover work and triage tasks on a schedule.            | `/loop` command, cron jobs, lifecycle hooks, GitHub Actions.     | Automations tab, scheduled prompts, `/goal` command. |
| **2. Worktrees**          | Isolate parallel features so agents do not collide.      | `git worktree`, `--worktree` flag, `isolation: worktree` config. | Built-in worktree per thread.                        |
| **3. Skills**             | Codify project-specific rules, guidelines, and context.  | `SKILL.md` folders containing instructions, scripts, and logs.   | `SKILL.md` references invoked by `$` or implicitly.  |
| **4. Plugins/Connectors** | Connect the loop to real developer tools.                | MCP servers, custom CLI tool hook-ups.                           | MCP connectors for Slack, Linear, Databases.         |
| **5. Sub-agents**         | Split the creator from the checker (adversarial review). | Subagents in `.claude/agents/`, task-specific agent teams.       | TOML-configured subagents in `.codex/agents/`.       |
| **6. State (Memory)**     | Track what is done outside the conversation context.     | Local Markdown files (`AGENTS.md`), Linear status boards.        | State files, persistent database hooks.              |

Using these primitives, development teams can construct different categories of loops depending on the predictability, trigger, and duration of the task.

---

## 3. Anthropic's Taxonomy of Agentic Loops (Claude Code)

Anthropic's Claude Code team defined a practical taxonomy for categorizing loops based on triggers, exit conditions, and target tasks:

| Loop Type      | Hand-Off Focus         | Trigger                                             | Stop Criteria                                                         | Best Used For                                                       |
| -------------- | ---------------------- | --------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Turn-based** | The verification check | Real-time user prompt.                              | Claude completes the task or asks for context.                        | Short-term, exploratory, or non-recurring tasks.                    |
| **Goal-based** | The stop condition     | Prompt in real-time.                                | Goal is achieved (verified by evaluator model) or turn cap hit.       | Tasks with clear, verifiable criteria (e.g. Lighthouse score).      |
| **Time-based** | The trigger            | Specified time interval (e.g., cron).               | Cancelled by user, or task queue is empty.                            | Recurring tasks (Slack summaries) or external events (checking CI). |
| **Proactive**  | The initial prompt     | Triggered by event or schedule, no real-time human. | Individual tasks stop when goals are met; schedule runs indefinitely. | Recurring streams of well-defined work (bug triage, migrations).    |

### Primitives & Composition in Claude Code

- **Goal-Based (`/goal` command)**: Runs-until-done. A separate evaluator model checks the specified success condition after each iteration so the implementing model does not "grade its own homework."
- **Time-Based (`/loop` & `/schedule` commands)**: `/loop` runs task cycles locally, while `/schedule` moves the loop to the cloud as a background routine.
- **Proactive Loops**: Composes `/schedule`, `/goal`, `skills`, _dynamic workflows_ (to parallelize work across separate branches), and _auto mode_ (running without asking for permissions).
  - _Example Prompt:_ `/schedule every hour: check #project-feedback for bug reports. /goal: don't stop until every report found this run is triaged, actioned, and responded to. When fixing a bug, use a workflow to explore three solutions in parallel worktrees and have a judge adversarially review them.`

### Anthropic's Loop Best Practices

- **Code Quality System**: Loops follow the codebase's existing patterns. Keep the codebase clean, provide clear documentation links, and encode definition of done in **skills** (`SKILL.md`).
- **Adversarial Review**: Always use a second agent/model (or the built-in `/code-review` skill) for code reviews to prevent bias.
- **Token Management**:
  - Pilot loops on a small slice of work before full runs (dynamic workflows can spawn hundreds of parallel agents).
  - Use deterministic scripts for trivial steps instead of letting Claude reason through step-by-step.
  - Monitor usage using `/usage`, `/goal` (without arguments), and `/workflows` to track token spend and turn counts.

---

## 4. The Three Nested Loops Framework (Andrew Ng)

To coordinate these different development rhythms, Andrew Ng outlines AI-native product development as a series of **three nested feedback loops** operating at different timescales:

![image](attachments/andrew_ng_loop_engineering.webp)

### I. Agentic Coding Loop (Minutes — Innermost Loop)

- **How it works:** The AI agent receives a specification and a definition of done (e.g., test suites). The agent autonomously writes code, executes tests, reads compilation errors, and refines the code in a recursive cycle until the test suite passes.
- **Key Advantage:** Rapid iteration without human latency. The model solves its own syntax errors and minor logic bugs.

### II. Developer Feedback Loop (Hours — Middle Loop)

- **How it works:** Once the innermost loop achieves green tests, a human developer steps in to review the architecture, UI flow, and overall quality. The developer provides corrective feedback, refines instructions, or edits the specifications, initiating another round of the agentic loop.
- **Key Advantage:** Combines AI execution speed with human direction.

### III. External Feedback Loop (Days/Weeks — Outermost Loop)

- **How it works:** The product is deployed to alpha/beta testers or production. Usage data, telemetry, and qualitative feedback are collected.
- **Key Advantage:** Guides long-term strategy. This loop ensures the agentic team is building the _right_ thing, not just building the wrong thing very fast.

### The "Context Advantage"

Andrew Ng emphasizes that human engineers maintain a **Context Advantage**. Humans have a deep understanding of user psychology, business objectives, organizational constraints, and "taste"—context that is not easily digitized or passed to a model. The engineer's role transitions from writing code to steering the inner loops based on this context, acting more like a product manager or director.

---

## 5. Key Design Patterns & Risks

### Goal-Oriented Verification (Definition of Done)

A loop must have a reliable stopping condition. Rather than asking the agent to implement a feature and decide on its correctness, the harness must enforce programmatic verification checks:

- Unit and integration test execution.
- Linter and formatter validation.
- Compiler output and status codes.

### State Persistence & Scratchpads

Because LLMs have limited context windows and forget conversation history between sessions, state must live on disk. This is typically achieved using:

- Memory or state files (e.g., standardizing tasks in files like `CLAUDE.md` or `SKILL.md`).
- Checkpoint files or local progress logs to prevent the agent from looping indefinitely in cyclical errors.

### Scaffolding vs. Raw Intelligence

As detailed in [[AI Engineering Principles from the Head of Claude Code]], rigid pipeline wrappers are fragile. Resilient loops:

- Keep helper code thin and let the model navigate.
- Provide high-utility tools (like ripgrep, file-editing, and terminal APIs) rather than hardcoded heuristics.
- Assume the model will determine what files it needs to read.

### Critical Risks in Loop Engineering

- **Token Costs:** Unbounded recursive loops can deplete token budgets if the exit criteria are loose or if the agent gets stuck in retry loops.
- **Comprehension Debt:** When agents write and commit code autonomously, the developer's understanding of the codebase decays unless they actively review what the agent shipped.
- **Cognitive Surrender:** The temptation to accept any working output, sacrificing architectural "taste" and code cleanliness for speed.

### Summary of the Paradigm Shift

Loop engineering represents the transition from **operating the machine** (typing manual prompts) to **building the factory** (designing loops). By investing upfront in programmatic verification, state persistence, and isolated worktrees, developers increase their leverage, shifting their focus from writing code to defining goals and taste.

---

## Sources & Citations

- **Andrew Ng's X Post (July 1, 2026):** [X Status 2071988145667928442](https://x.com/AndrewYNg/status/2071988145667928442)
- **Addy Osmani's Blog (June 7, 2026):** [Loop Engineering Blog Post](https://addyosmani.com/blog/loop-engineering/)
- **Claude Blog - Getting started with loops (June 30, 2026):** [Getting started with loops](https://claude.com/blog/getting-started-with-loops)
- **Peter Steinberger's X Post (June 2026):** [X Status 2063697162748260627](https://x.com/steipete/status/2063697162748260627)
- **Lenny's Podcast with Boris Cherny (June 2026):** [AI Engineering Principles from the Head of Claude Code](https://www.youtube.com/watch?v=We7BZVKbCVw)

---

## Related Notes

- [[AI Engineering Principles from the Head of Claude Code]] — Operating principles for agentic orchestrations from Boris Cherny.
- [[How Claude Code Works in Large Codebases]] — Explores the extension harness, MCP, and skill system of Claude Code.
- [[Lessons from Building Claude Code How We Use Skills]] — Practical guidelines for implementing agent skills.
- [[The Future of Software Engineering in the AI Era]] — Conceptual notes on the evolution of software engineering roles.
