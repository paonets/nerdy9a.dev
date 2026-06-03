---
tags: ["aws", "aws-summit", "conference"]
publish: true
created: 2026-05-28 11:21
updated: 2026-06-01 06:44
source: Apple Notes
---


# AI-Powered Threat Modeling

**Threat Technique Catalog for AWS:** [AWS Samples - Threat Technique Catalog](https://aws-samples.github.io/threat-technique-catalog-for-aws/)

Threat modeling should be integrated directly into the design phase of the Secure Software Development Lifecycle (SSDLC).

![image](attachments/AI-powered-Threat-Modeling-1.png)

## Where Threat Modeling Fits in the SSDLC
$$\text{Requirements} \longrightarrow \mathbf{\text{Design (Threat Modeling Happens Here)}} \longrightarrow \text{Development} \longrightarrow \text{Testing} \longrightarrow \text{Deploy} \longrightarrow \text{Monitor}$$

---

### SSDLC Threat Modeling Timeline

#### 1. Before Design
- Identify trust boundaries.
- Classify data sensitivity.
- Spec out security requirements.

#### 2. During Design (Core Threat Modeling)
- **Model System Architecture:** Map components and interactions.
- **AI-Assisted Threat Analysis:** Let LLMs help discover edge-case threats.
- **Map STRIDE per Component:** Group threats into the STRIDE categories:
  - **S**poofing identity
  - **T**ampering with data
  - **R**epudiation
  - **I**nformation disclosure
  - **D**enial of service
  - **E**levation of privilege
- **Define Mitigations Early:** Document counter-measures before code construction begins.

#### 3. After Design
- **Threats Become Test Cases:** Write automated security tests based on threats.
- **Integrate into PR Reviews:** Use threat models to guide pull request evaluations.
- **Feed into Penetration Testing:** Provide the threat catalog to penetration testers to focus their scope.

---

## Tooling: Threat Composer AI & Kiro
- **Threat Composer AI:** 
  - Powered by **Bedrock Claude 3.5 Sonnet** (or Sonnet 4) with pay-as-you-go token pricing (*Beware of the cost!*).
  - Uses **8 specialized agents** working in parallel.
  - Equipped with a CLI and an MCP (Model Context Protocol) server.
  - Automatically parses CloudFormation templates or Terraform code to produce architecture and dataflow diagrams.
- **Kiro CLI:**
  - If you have an existing architecture diagram, you can upload it to **Kiro** to perform visual threat modeling and analyze data flows.

> [!TIP]
> **Start Small:** A quick, 15-minute threat modeling session during design is infinitely better than no threat model at all. Don't let perfection be the enemy of security.

