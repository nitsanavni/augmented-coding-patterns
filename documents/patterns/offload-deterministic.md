---
authors: [lexler]
related_obstacles:
  - non-determinism
---

# Offload Deterministic

## Problem
AI is non-deterministic, so trying to use it for deterministic work — counting, parsing, transforming, repeating exact operations — produces unreliable outcomes. Every time you ask AI to do deterministic work, there's a chance it does it wrong.

_(See [[../obstacles/non-determinism.md]] for details)_

## Pattern
**AI is bad at determinism. Code is good at it. Offload deterministic work to code.**

Two ways to apply this:

### 1. Obvious deterministic tasks - use the right tool for the job
Skip AI entirely — just write code.
- Counting things? Don't ask AI. Write code.
- Parsing structured data? Don't ask AI. Write code.
- Repeating exact operations? Don't ask AI. Write code.

### 2. When the "how" isn't obvious
Use AI to explore once, then harden the solution into code:
1. Use AI interactively to solve the problem once
2. Once it works, write code (or have AI generate it), then test and tweak to your liking
3. Run the code for all future executions

Key insight: Use AI to explore. Use code to repeat. Each plays to its strengths.

## Example 1 — Skip AI entirely
Counting Rs in "strawberry" or counting lines in command output.
AI is notoriously bad at counting — it's deterministic work, so use tools or code instead. 
AI excells at using bash, so you could ask it to use bash instead: `echo "strawberry" | grep -o "r" | wc -l`. 
For bigger tasks, have AI write a script.

## Example 2 — Explore then write code
Converting Mermaid diagrams to DrawIO
- Gave AI a Mermaid diagram and example DrawIO XML. AI figured out the conversion.
- Wrote code that does the conversion, adjusted to how I like it using colors and formatting.
Every time I need an update, I can now get it quickly and reliably

## Example 3 — Explore edge cases then write code
Capturing app screenshots at iPhone dimensions
- Asked AI how to capture at iPhone 12 dimensions (390x844). AI suggested Puppeteer. Found edge case: what if Puppeteer isn't installed? AI added Safari fallback.
- Created `capture_screenshot.sh` with exact dimensions, fallback strategies, error handling, cleanup.
Next time we need to update the screenshot, all of that is already figured out.
