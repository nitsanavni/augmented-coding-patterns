---
authors: [lexler]
related_anti_patterns:
  - answer-injection
---

# Reverse Direction

## Problem

Monologue has inertia.
Once you’re telling AI what to do, you keep telling.
Once AI is asking you questions, it keeps asking.

That inertia makes you miss chances where switching to dialogue would surface better options.

## Pattern

Break the inertia — flip the direction at key moments:

* AI asks you to decide → *“What do you think would work better?”*
* You’re stuck telling → *“What questions do you have?”*
* You’re deciding alone → *“Show me a few approaches”*

The reversal turns a one-way monologue into a dialogue.
It surfaces options you wouldn’t have considered and makes preferences clearer by comparison.

## Example

AI: *“Should I use a class or functional approach here?”*
You reverse: *“What do you think would work better?”*
AI: *“Functional would be cleaner because…”* and explains its reasoning.

A small reversal at the decision point accessed AI’s reasoning and breadth exactly when it mattered.
