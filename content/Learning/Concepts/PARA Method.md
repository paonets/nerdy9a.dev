---
created: 2026-05-27 05:55
updated: 2026-05-31 21:32
tags: [synthesis, obsidian, pkm]
---

The **PARA Method** is a productivity and knowledge-management framework designed by Tiago Forte (author of _Building a Second Brain_). It organizes digital information based on its level of **actionability** rather than its subject or category.

## Core Philosophy

The acronym **PARA** stands for the four top-level categories of information:

1. **Projects:** A series of tasks linked to a goal, with a deadline (e.g., _Publish a website_, _Finish a home renovation project_).
2. **Areas:** Sphere of activity with a standard to be maintained over time, with no end date (e.g., _Health_and_Fitness_, _Finance_, _Teaching_).
3. **Resources:** Topics or themes of ongoing interest or reference (e.g., _AI_, _Japanese language_, _travel ideas_).
4. **Archives:** Inactive items from the other three categories (e.g., _Completed projects_, _past interests_).

---

## Vault Implementation

In the `WisdomWell` vault, we use a customized, **"soft" adaptation** of the PARA method. Rather than strictly segregating everything into separate nested directories, we combine a lightweight folder structure with a **Map of Content (MOC) Dataview** dashboard anchored by the Home Dashboard at the vault root.

### 1. Projects (P)

- **Definition:** Short-term efforts with a specific goal, active status, and deadline.
- **Location:** Stored under the `Projects/` folder (e.g., LLM Wiki Project (archived), Obsidian AI Enhancements).
- **Implementation:** Custom status-tracking using YAML frontmatter:
  - `status: active` for currently active projects.
  - `status: someday` for projects currently on hold.
- **Dynamic Surfacing:** The Home Dashboard queries these files automatically using Dataview:
  ```dataview
  TABLE status, updated
  WHERE status = "active"
  SORT updated DESC
  ```

### 2. Areas (A)

- **Definition:** Long-term responsibilities and habits.
- **Folders:**
  - `Finance/` (banking, taxes, etc.)
  - `Habits/` (identity-based habit tracking, habit logging)
  - `Health_and_Fitness/` (workouts, plans)
  - `Investments/` (portfolio management, strategies, logs)
  - `Teaching/` (Nerdy with Mr.A channel prep, structures)
  - `Toastmasters/` (speech drafts, agendas)
- **Implementation:** Linked manually on Home Dashboard under "Areas of Responsibility" to serve as direct entry points to these systems.

### 3. Resources (R)

- **Definition:** Knowledge, references, and learning materials.
- **Folders:**
  - `Books/` (Kindle highlight imports, summaries)
  - `Learning/` (Tech notes, Japanese studies, Events summaries)
  - `Travel/` (Itineraries, trip logs, preferences)
- **Dynamic Surfacing:** Tracked on the Home Dashboard via a Dataview query displaying recently updated files in these folders:
  ```dataview
  TABLE status, rating
  FROM "Books" OR "Learning" OR "Travel"
  SORT updated DESC
  LIMIT 5
  ```

### 4. Archives (A)

- **Definition:** Inactive or completed notes.
- **Folder:** `Archives/`
- **Convention:** When a project is finished, its frontmatter status is updated to `status: completed` and the note (and any related folders/files) is moved to `Archives/Projects/` to keep root directories clean.

---

## Benefits of our Setup

- **Action-Oriented Dashboard:** The Home Dashboard displays only what is active and needs attention, minimizing cognitive overload.
- **Automatic Organization:** The vault stays clean because inactive projects are archived, and resources are queried dynamically rather than sorted manually.
- **Proactive Interlinking:** The [[LLM Wiki]] system works in tandem with the PARA structure by turning messy raw inputs in `Fleeting/` into evergreen concept pages in `Learning/Concepts/` (part of Resources), ensuring the knowledge base remains clean, synthesized, and actionable.

---

## Related Notes

- Home Dashboard
- [[LLM Wiki]]
