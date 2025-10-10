---
authors: [lada_kesseler]
related_obstacles:
  - limited-focus
  - context-rot
related_anti_patterns:
  - distracted-agent
---

# Focused Agent

## Problem
LLMs have limited attention capacity. When LLM has too much context or competing instructions, its attention spreads thin and it becomes unreliable - even at following your core ground rules. This degradation happens well before hitting context window limits.

The more you ask an agent to handle, the worse it performs at everything.

_(See [[../obstacles/limited-focus.md]] for research and contributing factors)_

## Pattern
Single, narrow responsibility
- Gives AI cognitive space to do its job well
- Can actually follow your ground rules
- Like juggling 3 balls vs 50

**What makes this work:**
- Eliminates competing objectives (no "be helpful" vs "be safe" vs "be thorough" conflicts)
- No conflicting instructions to juggle (like "use JSON" in paragraph 1 but "be conversational" in paragraph 5)
- All attention goes to one task instead of being split across multiple concerns

## Example
Little committer - dedicated agent only for writing commit messages. Caught naming convention issues and accidental node_modules commits. Main development agent (same model, same instructions, broader scope) never caught these issues.

The committer agent's attention wasn't diluted across code writing, debugging, architecture decisions, etc. It could focus entirely on commit quality patterns.

## Anti-pattern
[[../anti-patterns/distracted-agent.md]]