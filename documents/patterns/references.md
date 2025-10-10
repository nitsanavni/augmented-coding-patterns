---
authors: [lexler]
related_obstacles:
  - limited-focus
  - context-rot
related_anti_patterns:
  - distracted-agent
related_patterns:
  - knowledge-document
---

# References

## Child of
[[knowledge-document.md]]

## Problem
Context bloat → AI loses focus, effectiveness degrades
Too much always-loaded information drowns out what matters for the current task

## Pattern
On-demand knowledge documents
- Either you ask AI to pull them or AI searches and pulls when needed
- Not always loaded
- Granular control over what's in context

## Example
`bash.md` - load only when writing bash scripts
`tdd.process.md` - load only when doing TDD
`project.md` - load only when need architecture context

Keep context small, maintain focus.