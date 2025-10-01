# Unvalidated Leaps (Anti-pattern)

## Problem
AI gets stuck because it's building on unverified assumptions about the code.
- Assumes functions return X when they return Y
- Misinterprets errors based on wrong mental model
- Each assumption becomes foundation for the next wrong step

## What Goes Wrong
While debugging a cleanup script, Claude kept piling on fixes — adjusting patterns, tweaking parsing, trimming whitespace — all based on one hidden assumption: that the AppleScript output it saw was the real session IDs.

But that assumption was wrong. AppleScript’s log doesn’t return values; it prints descriptions. The script needed return instead. Because Claude never validated that first step, every downstream fix was wasted effort — a cascade of unvalidated leaps.

Only when asked to “check each command step by step” did it isolate the AppleScript call, validate the output, and see the real problem. With the base assumption corrected, the fix was trivial. All the downstream fixes were pointless until the base assumption was checked.

## Solution
- When AI gets stuck, stop it and tell it to validate each step incrementally
- Use TDD to create automatic micro-feedback loops that catch drift early. Try Predictive TDD - AI predicts test outcomes, gets surprised when wrong (like humans do), immediately corrects its mental model

The key: frequent reality checks prevent assumption chains. Code's self-verifiable nature makes this possible in ways that wouldn't work for general facts.