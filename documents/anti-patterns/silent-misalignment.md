# Silent Misalignment (Anti-pattern)

## Problem
When user instructions don’t make sense within the AI’s model, the AI still tries to comply instead of stopping or asking questions.  
Misalignment grows silently as it builds on wrong interpretations.

## What Goes Wrong
- AI accepts impossible or contradictory instructions
- Produces plausible but wrong fixes
- Fails to say “this doesn’t make sense”
- Misalignment compounds until output becomes messy or useless

## Example
While fixing a Vue.js layout, I asked AI to align the top parts of two panels.  
To me, the misaligned panels were visually obvious — but to the AI, they were just nested divs.

Instead of asking clarifying questions, the AI started adding CSS to random divs, hoping one would match my intent.  
Each “fix” was a guess, because my instructions referenced concepts that didn’t exist in its perception.

The misalignment stayed silent because the AI kept patching instead of admitting: *“I don’t see what you mean.”*

## Solution
**Give AI Permission to Push Back**
- Add to ground rules: “Ask questions when unclear, flag contradictions”
- Explicitly allow: “Tell me if my instructions don’t make sense”

**Make Mental Models Explicit**
- Before changes: “Describe the structure you see”
- During work: Ask “Does this make sense?” or “What questions do you have?”
- Require a plan or outline before implementation
- When stuck, check explicitly for misalignment and surface the AI’s view
