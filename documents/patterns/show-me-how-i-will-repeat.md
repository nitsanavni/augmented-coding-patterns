---
authors: [ivett_ordog]
related_patterns:
  - extract-knowledge
---

# Show Me How, I Will Repeat

## Problem
AI's non-deterministic nature means it interprets the same task differently each time. Without codified knowledge, you waste time explaining the same mistakes repeatedly, especially for tasks that require multiple iterations (like migrations, refactoring patterns, or complex chores).

## Pattern
Turn collaborative work into reusable knowledge through iterative refinement:

1. **Identify** a task that will be repeated multiple times
2. **First iteration**: Work through it together with the AI
3. **Document**: Ask the AI to "Document how we [task description] as a process file in [filename.md]. Focus on things you wish you had known before starting the task. The audience is future AI agents working on similar tasks."
4. **Second iteration**: AI attempts the task using the documentation while you correct mistakes
5. **Refine**: Ask the AI to "Refine the document based on things you wish you'd known when starting"
6. **Repeat** refinement cycles until AI can work independently

The documentation becomes a living knowledge base that captures effective patterns, common gotchas, and context-specific constraints.

## Example
**Task**: Migrating legacy MongoDB application to SQL in a messy codebase where one-shot prompting consistently failed.

**Process**:
- First migration done collaboratively, discovering test writing patterns, preferred migration tools, and typical oversights from poor code quality
- Created purpose-built testing and migration infrastructure together
- Documented the complete process including tool usage, test examples, and gotchas
- Second migration attempted by AI with corrections
- Documentation refined based on lessons learned
- Result: AI completed all subsequent migrations independently except the first two

**Generic task descriptions for documentation**:
- "migrated this MongoDB collection to a Postgres database"
- "refactored this part of the system to hexagonal architecture"
- "extracted this legacy component into a microservice"
