---
tags: ["aws", "aws-summit", "conference"]
publish: true
created: 2026-05-28 16:19
updated: 2026-06-01 06:44
source: Apple Notes
---


# AI Guardrails: Gateway Architecture

This architecture outlines a unified entry point ("One endpoint. Seven guardrails. Three write paths. Every call.") designed to run on top of LLM clients to block attacks, manage permissions, and govern costs.

![image](attachments/AI-guardrails-1.png)

## Core Request Flow
The client sends a request to the main API endpoint:
`POST /v1/infer` $\rightarrow$ **Orchestrator** $\rightarrow$ **7 Sequential Guardrails** $\rightarrow$ **Bedrock Converse** (Haiku, Sonnet, Nova) $\rightarrow$ Outputs routed to **CloudWatch Logs** and a **unified_log** database.

---

## The 7 Guardrails (Sequential Execution)

1. **Identity**
   - Validates user identity, permissions, and context. Checks who is making the call.
2. **Prompt**
   - Resolves and fetches the prompt manager's rules. Prompts are stored in the database.
3. **Tools**
   - Resolves tool registrations. Implements a security boundary: *not all prompts/users can query all tools or MCP servers*.
4. **Skills**
   - Loads post-processing and formatting extensions (e.g., a "Humanize" skill to format model replies to sound natural).
5. **Log**
   - Unified call logger capturing request metadata.
6. **Cost**
   - Real-time token counter and cost calculation to prevent abuse or budget overruns.
7. **Bedrock Guardrails**
   - Final safety layer checking the request/response for content moderation, toxic language, and PII leaks.

---

## Database & Write Paths
The orchestrator reads prompt templates, tool schemas, and routing logic from **DynamoDB** (storing Prompts, Tools, Skills, and Routing). To minimize latency, there is a **30-second TTL cache** between DynamoDB and the Orchestrator.

Changes to this database come from **three distinct write paths**:
1. **Platform Team:** Monthly deployments (stable infrastructure & core schemas).
2. **Product Team:** Weekly Pull Requests (application-specific prompt/tool updates).
3. **Business/Ops:** Daily direct DynamoDB writes (hot-fixes, copy tweaks, operational variables).

