---
authors: [lada_kesseler]
related_patterns:
  - knowledge-checkpoint
  - offload-deterministic
  - parallel-implementations
  - take-all-paths
---

# Non-Determinism (Obstacle)

## Description
AI outputs are non-deterministic. The same input may yield different results across runs.  
Responses can vary in quality: sometimes worse, sometimes better.

## Impact
Unlike deterministic systems where same input always produces same output:
- Results are not guaranteed to be repeatable.
- Reliability is unpredictable — retries may diverge significantly.
- Makes it difficult to fully trust or lock in a single outcome without validation.
