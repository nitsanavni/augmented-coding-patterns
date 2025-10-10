---
authors: [lada_kesseler]
related_obstacles:
  - cannot-learn
  - context-rot
  - limited-context-window
related_patterns:
  - ground-rules
  - references
  - knowledge-document
  - extract-knowledge
  - knowledge-checkpoint
  - focused-agent
---

# Context Management

## Problem
AI has no persistent memory and context degrades over time. You must actively manage what's loaded and when to reset.

## Pattern
Treat context as a scarce, degrading resource that requires active management.

**What to load:**
- Ground Rules - always loaded essentials
- References - pulled in on-demand when needed
- Knowledge Documents - saved insights from past sessions

**When to restart:**
- Extract knowledge before context rots
- Checkpoint your work before implementing
- Reset when you slip from green → yellow zones

**How to keep it clean:**
- Remove what's not needed
- Keep documents succinct
- Focus agents on narrow tasks

## Example
Start new session → load ground rules (always on) → pull in relevant reference when needed → work in focus zone → extract key insights to file → checkpoint → reset with clean context.
