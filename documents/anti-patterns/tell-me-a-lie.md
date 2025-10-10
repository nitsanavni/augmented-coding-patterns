---
authors: [llewellyn_falco]
related_obstacles:
  - compliance-bias
related_patterns:
  - active-partner
---

# Tell Me a Lie (Anti-pattern)

## Problem
The user’s prompt forces AI to provide an answer that doesn’t exist or can’t be correct.
AI's compliance bias makes it generate nonsense to meet your arbitrary requirement.

## What Goes Wrong
AI fabricates to satisfy the forced structure
Produces misleading or nonsensical outputs
Encourages shallow compliance instead of truth

## Example
**Forcing counts that don't exist**: "What's 2+2? Give me 5 options."
Answer from Gemini:
```
Here are 5 options for 2 + 2:

a) 3
b) 4
c) 5
d) 22
e) 0
```

**Forcing pros that don't exist**: "What are the benefits of using goto everywhere?"
AI might invent benefits even when they don't exist.

**Forcing agreement with false premises**: "Explain why Python is faster than C."
AI might comply and explain something that's fundamentally untrue.

## Solution
- Look out for false premises in questions. Frame questions to allow truth.
Instead of "Why is Python faster than C?" ask if it is or ask to compare performance.
- Ask explicitly "Does my question make sense?"
