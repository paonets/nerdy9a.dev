---
created: 2026-06-01 09:20
updated: 2026-06-01 09:50
tags: ["learning", "ai", "html", "markdown", "claude", "source/article"]
source: "https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html"
publish: true
---

# HTML vs Markdown

## Summary

Markdown is simple and human-writable, but it becomes restrictive for complex, long-form AI outputs (over 100 lines). As AI agents shift from text writers to software builders, we use them to generate **HTML** instead. HTML allows for richer layouts (tabs, grids, code comparison panes, interactive charts, collapsibles), styling, and animations. Since the AI edits the files via prompting, the manual readability/editability advantage of Markdown is no longer critical.

## Key Takeaways

1. **Markdown's Limits**:
   - Hard to read when files grow beyond 100+ lines.
   - Limited to linear text layout and basic tables.
   - ASCII diagrams are clever but fragile and hard to scale.
2. **The HTML Advantage**:
   - **Rich layouts**: Tabs, sidebars, grids, collapsibles, side-by-side code diffs.
   - **Self-contained interactivity**: CSS and JS can be embedded directly for dynamic prototypes, filterable lists, or interactive flowcharts.
   - **Visual polish**: Uses colors, font pairings, and responsive styling to reduce cognitive load.
3. **The Role Shift**:
   - Traditional files were edited by hand (favoring Markdown).
   - Modern files are orchestrated and edited by AI agents via natural language goals, rendering the visual readability of HTML outputs much more valuable than raw markdown's manual editability.

## References

- [Using Claude Code: The unreasonable effectiveness of HTML](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html)
- [HTML effectiveness examples & templates](https://thariqs.github.io/html-effectiveness/#code-review)
