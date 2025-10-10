# Parallel Implementations

## Problem
AI outputs are non-deterministic - repeated attempts yield different results. Without structure, failed runs waste effort and diverse outputs go unused.

_(See [[../obstacles/non-determinism.md]] for details)_

## Pattern
Run parallel implementations from a common checkpoint to turn non-determinism into an advantage:

1. Plan the feature and create checkpoint (save plan + git commit)
2. Create parallel working directories using git worktrees
3. Launch multiple AI implementation attempts simultaneously with the same plan
4. Each attempt produces different implementation due to non-determinism
5. Review all approaches

**Two complementary modes:**

### Failure Mitigation
When AI attempts often fail outright (broken code, hallucinations, wrong approach):
- Launch multiple implementation attempts in parallel
- Discard failed branches and keep the working one
- Saves time: instead of debugging sequential failures, at least one succeeds
- Trades tokens (cheap) for time (expensive)
- Non-determinism as **insurance** against failure

### Exploration of the Solution Space
When AI attempts succeed but diverge in style, design, or approach:
- Use parallel runs to explore the space of possibilities
- Compare variations to sharpen your understanding of the problem or solution
- Merge the best ideas into a richer result than any single attempt could provide
- Works especially well for creative domains: UIs, game mechanics, designs
- Non-determinism as **fuel** for exploration

## Example 1: Failure Mitigation
Implementing a complex feature with uncertain approach. Run several parallel implementations. Some fail, some succeed. You can move forward immediately instead of having to restart if you get a failure from one attempt. This is essentially a trade-off between saved time and tokens.

## Example 2: Exploration
Designing a UI from scratch:
- Launch several parallel UI implementations with same requirements
- One has great navigation layout
- Another has interesting color scheme and spacing
- Another has clever responsive breakpoints
- Combine best elements from multiple attempts into richer final design

## Example 3: Game Development
Generate multiple versions of a game mechanic. Each explores the idea differently. Combine the most engaging features into a richer final design than any single attempt.