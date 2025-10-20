---
authors: [ivett_ordog, lada_kesseler]
---

# Hooks

## Problem
Enforcing high coding standards without bloating AI's context with extensive style guides is challenging. Generic reminders either get forgotten as conversations progress or consume too much context when repeated constantly. You want AI to follow your specific coding practices, but explaining them repeatedly is inefficient and unreliable.

As Kent Beck said: "I'm not a great programmer, I'm a good programmer with great habits." The challenge is giving AI those same good habits.

## Pattern
A habit is an action taken in response to a trigger. Build automated quality checks (using Claude Code hooks or Git hooks) that detect specific code quality violations and inject targeted guidance exactly when needed:

1. **Set up automated detectors** for quality violations you care about (duplication, code smells, file size, linting issues, etc.)
2. **Create specific, actionable prompts** for each detector that tell AI exactly what to do
3. **Configure hooks to block AI from proceeding** until issues are addressed
4. **Allow snoozing violations per file** until the file changes again (useful when introducing new checks)
5. **Require human approval for disabling checks** to prevent AI from over-using snooze functionality

This approach reduces context bloat while improving compliance by providing precise, relevant guidance exactly when violations occur, rather than front-loading massive instructions that AI forgets or misapplies.

## Example

### Common Quality Checks and Their Prompts

**Duplication Detector**
- Trigger: Identical or near-identical code blocks detected
- Prompt: "Test code duplication detected. Extract common test utilities, fixture handling, or assertion patterns into shared helper functions."

**Feature Envy Check**
- Trigger: Method primarily uses data/methods from another class
- Prompt: "Consider moving these methods to the class they depend on most, or extract shared behavior."

**File Size**
- Trigger: File exceeds line count threshold
- Prompt: "Split these files into smaller, focused modules immediately."

**Function Size**
- Trigger: Function exceeds complexity threshold
- Prompt: "Analyze responsibilities first - what distinct concerns does this function handle? Consider: (1) Are these separate responsibilities that belong in different methods? (2) Should this become a class with multiple methods? (3) Can you group cohesive data into objects to reduce local variables? Avoid mechanical extraction - find true responsibility boundaries. If the code has many misplaced responsibilities you may need to first inline methods to see the whole picture and find a better way of redistributing functionality. Think of this when reducing line count seems particularly hard. Taking a step backwards may open up new, better possibilities."

**Git Diff Size**
- Trigger: Uncommitted changes exceed threshold
- Prompt: "Commit smaller incremental changes with passing tests to maintain code quality."

**Linter Errors**
- Trigger: Linting violations detected
- Prompt: "Run `npm run lint:fix` to automatically fix many of these issues. Manual fixes may be needed for logical errors."

**Single-Use Variable**
- Trigger: Variable declared and used only once
- Prompt: "Variable 'variableName' is declared and used only once - consider inlining."

**Dead Code Detector**
- Trigger: Unused methods/functions detected
- Prompt: "Remove these unused methods to maintain codebase clarity."
  
**User Reminders Hook**
- Trigger: On user prompt submit (every message)
- Prompt: Inject your most critical preferences automatically (for example, after every user message)
- Example of injected messages: "Be honest, not flattering. Tell me what I need to know even if I don't want to hear it" or "Exercise full agency to push back on mistakes, flag issues early, ask questions instead of choosing randomly"
- Note: Limit to 5 reminders maximum to avoid context rot

### Implementation Tips

AI can generally create these hooks with minimal prompting. The key is:
- **Specificity**: Each prompt should be actionable and specific to the violation
- **Context efficiency**: Inject guidance only when needed, not upfront
- **Escape hatch with oversight**: Allow snoozing, but require human approval to prevent abuse
- **Treat as user prompts**: Include guidance in your agent file to treat these prompts as user prompts

A hack that tends to work well is including a 🙂💬 emoji pair in the generated prompts, and mentioning their meaning in the agent file as CRITICAL.
