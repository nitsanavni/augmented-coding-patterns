---
related_obstacles:
  - black-box-ai
---

# Context Markers

## Problem
AI context is invisible to me. Can't tell what context/rules AI is following and whether it sees or have read my default rules. 

## Pattern
Use visual markers (emojis) to signal active context:
- Start every response with a marker showing current mode
- Different markers for different contexts/roles
- Stack markers when multiple contexts active
- Special markers for specific actions (errors, re-reads)
- Can be impromptu one-offs for very important instructions

Makes the invisible context visible at a glance.

## Example
- 🍀 = default mode active
- 🔴/🌱/🌀 = TDD phase (red/green/refactor)
- ✅ = committer role active
- ❗️ = flagging an error
- ♻️ = rules just re-read
- ✨📂 = creating new repository

When you see "🍀 ✅" you know: base rules loaded + committer role active.
No guessing what context AI is operating under.