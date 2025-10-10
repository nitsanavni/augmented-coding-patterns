---
authors: [lada_kesseler]
related_anti_patterns:
  - perfect-recall-fallacy
related_patterns:
  - knowledge-document
  - extract-knowledge
  - ground-rules
  - context-management
---

# Cannot Learn (Obstacle)

## Description
LLM cannot learn from user interactions
- Stateless: no memory between sessions
- Fixed model weights: cannot be trained on your code/preferences

## Impact
You must re-explain context, preferences, and project details in every session