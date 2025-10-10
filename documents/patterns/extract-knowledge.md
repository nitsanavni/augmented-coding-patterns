---
related_obstacles:
  - cannot-learn
related_patterns:
  - knowledge-document
---

# Extract Knowledge

## Technique for
[[knowledge-document.md]]

## Problem
Valuable information - insights, corrections, preferences - emerges during conversations with AI, but it's ephemeral. Without capture, it disappears, forcing you to repeat yourself.

_(See [[../obstacles/cannot-learn.md]] - AI doesn't learn, so you must preserve your thinking)_

## Pattern
As you work with AI and figure things out, explicitly ask AI to save insights to files.
- Save as you go (don't wait until end)
- Review and edit the saved content (AI's first pass may need refinement)
- Creates reusable, restartable knowledge documents

## Example
While integrating the `uv` package manager, AI repeatedly uses incorrect uv syntax. You create `uv.md` documenting the correct commands and usage, so next session AI uses uv correctly from the start.
