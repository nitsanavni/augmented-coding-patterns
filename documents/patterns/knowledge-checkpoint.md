---
authors: [lada_kesseler]
---

# Knowledge Checkpoint

## Problem
AI implementation attempts are non-deterministic: they may hallucinate, fail, or veer off course. Without protection, a failed run wipes out both the implementation and the planning context, forcing you to repeat valuable planning work.

_(See [[../obstacles/non-determinism.md]] for details)_

## Pattern
Before attempting implementation, checkpoint the plan:

1. Plan the feature (with AI)
2. Extract planning knowledge to a document (feature_todo.md, project.md, etc.)
3. Git commit = checkpoint
4. Attempt implementation
5. If fails → git reset, retry without redoing planning

**Value asymmetry**: Planning is expensive (human time), implementation is cheap to retry (AI attempts). Protect the expensive part.

- Protects human time investment in planning
- Decouples deterministic planning from non-deterministic execution
- Enables cheap retries

## Example
You spend 30 minutes with AI outlining a feature architecture. You extract it into `project.md` and git commit. When AI's implementation fails, you reset in <1 minute and try again — your planning is preserved. You can course correct if necessary, but you'll be starting from a known good state, or the state that can be easily adjusted.
