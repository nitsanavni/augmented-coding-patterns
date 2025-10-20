---
authors: [lada_kesseler]
---

# Context Markers

## Problem
AI context is invisible. Can't tell what rules AI is following, whether it read your ground rules, or if context has degraded.

## Pattern
Use visual markers (emojis) to signal active context:
- Start every response with a marker showing current mode
- Different markers for different contexts/roles
- Stack markers when multiple contexts active
- Special markers for specific actions (errors, re-reads)
- This can be impromptu one-offs for crucial instructions (when adding an important instruction in the middle of the conversation, ask it to be added to the emojis displayed on every response)

Makes the invisible parts of context visible at a glance.

## Example
- 🍀 = default mode active
- 🔴/🌱/🌀 = TDD phase (red/green/refactor)
- ✅ = committer role active
- ❗️ = flagging an error
- ♻️ = rules just re-read
- ✨📂 = creating new repository

When you see "🍀 ✅" you know: base rules loaded + committer role active.
No guessing what context AI is operating under.

