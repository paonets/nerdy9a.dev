---
created: 2026-06-01 09:25
updated: 2026-06-01 09:50
tags: [learning, ai, LLM, product-development, claude, source/video]
source: "https://www.youtube.com/watch?v=We7BZVKbCVw"
publish: true
---

![image](attachments/ai_engineering_principles_sketchnote.png)

## Summary

In this episode of _Lenny's Podcast_, Boris Cherny (Head of Claude Code at Anthropic) shares operating principles for building and leading in an AI-first engineering world. He discusses the shift from writing code manually to orchestrating agents, emphasizing that constraints on models are counterproductive and that builders should always design for the models of the future.

## Key Principles

### 1. Don't Box the Model In (Goal-Oriented Agentic Workflows)

- **Core Principle:** Don't try to put the model into a box or enforce strict, linear workflows. Instead, give it clear goals and powerful tools, letting it figure out the execution path and what context it needs.
- Rigid step-by-step pipelines limit the reasoning capabilities of state-of-the-art models.

### 2. General Models Outperform Specific/Fine-Tuned Models

- **Core Principle:** General models always outperform specific, fine-tuned models. Avoid trying to fine-tune small, narrow models for tasks that general models can do naturally.
- Frontier general-purpose models (like Claude 3.5 Sonnet) consistently show superior reasoning, instruction following, and tool-use capabilities.

### 3. Avoid Ephemeral Scaffolding

- **Core Principle:** Heavy scaffolding and custom wrappers might help a bit at the beginning, but they are quickly wiped out or made obsolete when the next model version is released.
- Keep helper code thin and rely on the model's raw intelligence.

### 4. Build for the Future Model (6 Months Out)

- **Core Principle:** When building new AI applications, always build for the capabilities of the model 6 months from now rather than designing around today's limitations.
- Design applications with the assumption that future models will be faster, cheaper, and vastly more capable.

### 5. Follow Latent Demand (Observe Emergent Behaviors)

- **Core Principle:** Pay close attention to how users (and AI agents) interact with your product, especially in ways you didn't plan for or expect.
- Instead of forcing users into strict predefined workflows, observe where they encounter friction or try to stretch the product's capabilities. Building features around these emergent, unarticulated needs is the key to successful AI product design.

---

## Additional Insights from Boris Cherny (Lenny's Podcast)

- **Coding is Solved**: Cherny relies completely on AI agents (shipping 10-30 PRs a day) without writing manual code since November 2025.
- **The Role of the Engineer**: The title is shifting from "Software Engineer" to "Builder" or "Generalist" who orchestrates agents.
- **Under-Resource and Over-Token**: Intentionally keep human teams small to force reliance on AI. Provide engineers with unlimited tokens to encourage free-form experimentation.
