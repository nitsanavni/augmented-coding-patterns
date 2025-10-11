---
authors: [lada_kesseler]
---

# Check Alignment

## Problem
Misalignment between human and AI understanding only reveals itself after implementation, wasting time on wrong solutions.

## Pattern
Before letting AI implement, make it show its understanding:
- "Tell me what you're going to do before you do it"
- "Show me your plan" or "Draw an architecture diagram"
- "What questions do you have?" (not "ask me 3 questions" - let it surface real confusion)
- "What are you trying to achieve?"

Also force it to very succint to make what it tells you very scannable.
 
Catch misunderstandings early, before wasted implementation. 

## Example
Before refactoring: "Show me how you understand the current architecture and what you plan to change, succinctly"
AI draws diagram, reveals it misunderstood service boundaries.
Corrected before any code was written - saved an hour of going in a rong direction.
