---
tags:
  - aws
  - aws-summit
  - conference
publish: true
created: 2026-05-28 11:08
updated: 2026-06-01 06:44
source: Apple Notes
---

# Multi-Region Deployment Challenges

![image](attachments/multi_region_deployment_challenges_sketchnote.png)

**Speaker:** Dr. Vit (DailiTech)

## Core Architectural Philosophies
- **Not Just Cloning:** Multi-region deployment is not about copying Region A resources to Region B. It requires *multi-region by design*.
- **No Manual Failover:** The system should dynamically handle failovers without human intervention.
- **Consistency vs. Cost:** Design for **eventual consistency** by default. Introduce **strong consistency** only where money or life safety is involved.
- **Latency Realities:** Intra-region latency is extremely fast ($\sim 1\text{ ms}$), but cross-region latency (e.g., Thailand to Singapore) introduces a physical limit ($\sim 30\text{ ms}$).

![image](attachments/Multi-region-deployment-challenges-1.png)

---

## Architectural Layers & Consistency Patterns

### 1. Code / Application Layer (Stateless)
- **Pattern:** Deploy active-active stateless application nodes behind Load Balancers in both regions (Region A and Region B) managed by Route 53 DNS routing.
- **State:** Keep application servers stateless to make regional scaling trivial.

### 2. Session Layer (DynamoDB Global Tables)
- **Problem:** Users logged into Region A must stay logged in if routed to Region B.
- **Pattern:** Store sessions, permissions, JWT revocation lists, and refresh tokens in **DynamoDB (Session)**.
- **Technology:** Leverage **DynamoDB Global Tables** for automatic, bidirectional active-active replication with sub-second latency.

### 3. File Layer (S3 CRR + DynamoDB Status Tracker)
- **Problem:** Writing files to S3 in Region A takes time to replicate to Region B via S3 Cross-Region Replication (CRR), which guarantees 15-minute replication but often completes faster.
- **Technology:** S3 CRR replicates files across regions (typically takes $\approx 15\text{ seconds}$).
- **Fallback Pattern:** 
  1. A file is uploaded in Region A $\rightarrow$ Lambda writes metadata to **DynamoDB (File)** and marks the file as `local_only`.
  2. DynamoDB (File) replicates instantly to Region B via Global Tables.
  3. A user in Region B requests the file. The local Lambda checks **DynamoDB (File)**.
  4. If the record says `local_only` (not yet replicated to Region B S3), the Region B Lambda falls back and pulls the file directly from Region A's S3 bucket.
  5. Once S3 CRR completes, the replication status is updated, and Region B serves it locally.

### 4. Database Layer (Aurora Global Database)
- **Technology:** Use **Aurora Global Database** with RDS (Primary) in Region A and read-only RDS (Secondary) in Region B.
- **Replication Speed:** 
  - Intra-region replication (Primary $\rightarrow$ Secondary in Region A): $\sim 1\text{ ms}$.
  - Cross-region replication (Region A $\rightarrow$ Region B): $\sim 30\text{ ms}$.
- **Consistency Modes:** 
  - **Eventual:** High performance, read-replicas may lag slightly.
  - **Session:** Guarantees a user reads their own writes.
  - **Global:** Strong consistency across all regions, but increases latency because write operations wait for cross-region ACKs.

