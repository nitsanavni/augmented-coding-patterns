---
related_obstacles:
  - context-rot
---

# Reminders

## Problem
AI forgets your priorities. Ground rules get ignored in long conversations. Important steps get skipped. Your critical requirements drift out of focus as AI works.

Reminders work because they make compliance structural, not optional. Whether automated (hooks) or manual (checklists), they force AI to keep your priorities in view.

## Pattern
Force attention on what matters through repetition and structure. Three types:

### User Reminders
Inject critical rules into every message. Trade tokens for compliance.
- Hook automation: Inject automatically via webhooks in Claude Code
- Manual: Copy-paste your most important rules repeatedly
- Example: "Give me honest feedback even if I don't want to hear it"

### TODOs
Turn complex work into explicit checkboxes. AI checks off each step.
```markdown
- [ ] Run linter
- [ ] Fix errors
- [ ] Add tests
- [ ] Update docs
```
Simple structure → reliable execution.
Todos is a lightweight way to keep the agent following instructions much more reliably

### Instruction Sandwich
Builds on TODOs. Add the specific instructions you really care about as individual steps in places they need to be done.
Instead of "Remember to test!" → add "Run tests" as an individual step in todo, repeating it in all the key points it's necessary for it to run tests (hence the sandwitch)
```markdown
- [ ] Run tests. Ensure they are green 
- [ ] Implement feature A. Follow TDD
- [ ] Run tests. Ensure they are green
```

