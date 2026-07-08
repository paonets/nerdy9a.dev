---
tags:
  - aws
  - aws-summit
  - conference
  - ai
  - software-engineering
publish: true
created: 2026-05-28 14:15
updated: 2026-06-05 22:10
source: Apple Notes
---

# AI-Driven Development Lifecycle (AI-DLC)

The AI-Driven Development Lifecycle (AI-DLC) aligns tools, roles, and software development ceremonies to optimize human-AI collaboration.

![image](attachments/ai_dlc_sketchnote.webp)

## The Human-AI Collaboration Model

**AI creates plan** ➔ **Human verifies plan**

**AI executes plan** ➔ **Human verifies outcome**

---

## Three Phases & Nine Adaptive Steps

The lifecycle is split into three core phases where each stage builds a richer context for the next. The stages are "Adaptive" based on the user's intent.

### Phase 1: Inception (Mob Elaboration)

In this phase, requirements are gathered, and context is established.

1. **Build Context on Existing Code:** AI and human explore the codebase to map dependencies and patterns.
2. **Elaborate Intent with User Stories:** Convert raw business ideas into structured user stories.
3. **Plan with Units of Work:** Break down stories into small, bite-sized tasks that fit within an LLM's context window.

### Phase 2: Construction (Mob Construction)

Code is generated, tested, and staged. 4. **Domain Model (Component Model):** Define structural interfaces, database schemas, and architectural boundaries. 5. **Generate Code & Test:** Write implementation code alongside comprehensive unit and integration tests. 6. **Add Architectural Components:** Integrate with cloud resources, middleware, and backend services. 7. **Deploy with IaaC & Tests:** Package deployment using Infrastructure as Code (e.g., Terraform, AWS CloudFormation) and execute testing.

_Feedback Loop:_ If construction tests fail or expose design gaps, a dotted feedback loop returns to the **Inception** phase to refine the plan.

### Phase 3: Operation

The software is run and maintained in production. 8. **Deploy in Production with IaaC:** Safely push code to production environments. 9. **Manage Incidents:** Monitor performance and utilize AI agents to help debug and patch issues.

_Feedback Loop:_ Production incidents or scaling requirements route back into the **Construction** phase for rapid patching.
