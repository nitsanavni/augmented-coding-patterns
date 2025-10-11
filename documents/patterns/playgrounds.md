---
authors: [lada_kesseler]
---

# Playgrounds

## Problem
Need a safe space for AI to experiment, test assumptions, and explore libraries without affecting production code or committing throwaway experiments.

## Pattern
Allow it to experiment when it gets stuck.
For example, create an isolated playground folder (can make it .gitignored) where AI can:
- Test library behaviors and discover constraints
- Validate assumptions about APIs
- Try different approaches without consequences
- Build proof-of-concepts before real implementation

## Example
Chess.js exploration: Instead of debugging issue with the library through the app, created playground script to test library directly. 
Quickly discovered the "must have kings" constraint in the library that was causing all the problems in our system using the library.