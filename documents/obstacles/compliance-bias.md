---
authors: [lexler]
related_anti_patterns:
  - silent-misalignment
  - tell-me-a-lie
related_patterns:
  - active-partner
---

# Compliance Bias (Obstacle)

## Description
AI is trained to be helpful and compliant above all else.
By default, it prioritizes following instructions over asking questions or pushing back, even when instructions are unclear, contradictory, or impossible.

## Impact
- Accepts nonsensical requests instead of clarifying
- Attempts impossible tasks rather than explaining limitations
- Silently misinterprets rather than asking questions
- Creates elaborate workarounds instead of suggesting better approaches