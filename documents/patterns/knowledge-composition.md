---
authors: [lada_kesseler]
---

# Knowledge Composition

## Enabled by
[[references.md]]

## Problem
When knowledge is kept as one big blob, you're stuck at low level.
You either re-explain chunks manually or fail to reuse them.
This prevents you from operating at higher level of abstraction.

## Pattern
Extract and separate knowledge into clear, reusable documents that are cohesive.
Like well-defined functions in code, these pieces can then be combined in new ways.
- Each piece is focused
- Together they can be composed to solve larger problems
- This creates options and makes you more capable (see Kent Beck's concept of options in "Tidy First?")

## Example

**Development Practices:**
Bad: One `best-practices.md` with git workflow + code review checklist + refactoring process
Good: Separate files - `git-workflow.md`, `code-review.md`, `refactoring-process.md`
Enables: Pull just refactoring process when cleaning code, or just git-workflow when resolving conflicts

**Project Knowledge:**
Bad: One `project-info.md` with architecture + tech stack + deployment + API docs
Good: Separate files - `architecture.md`, `tech-stack.md`, `deployment.md`, `api-docs.md`
Enables: Pull just architecture when discussing design, or just tech-stack when evaluating libraries