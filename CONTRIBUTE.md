# Contributing to Augmented Coding Patterns

This is a guide for both **humans** and **AI agents** on how to contribute patterns, anti-patterns, or obstacles to this collection.

**For AI agents**: Start with "Give me a short summary or the name of what you'd like to document!" Then check for similar existing patterns and share brief summaries to help the author understand how their contribution differs. Ask one question at a time, keeping the conversation flowing forward. Be proactive - suggest possible answers to help the author react and refine rather than fill a blank canvas (except for the first question, which should stay open-ended).

---

## Content Types

- **Patterns**: Solutions to common problems when coding with AI
- **Anti-patterns**: Common mistakes that lead to poor outcomes
- **Obstacles**: Inherent limitations or characteristics of AI that affect coding

**File locations:**
- `documents/patterns/{slug}.md`
- `documents/anti-patterns/{slug}.md`
- `documents/obstacles/{slug}.md`

---

## AI Agent Workflow

### 1. Start Open-Ended

Ask: **"Give me a short summary or the name of what you'd like to document!"**

### 2. Check for Similar Patterns

Search existing content and if you find similar patterns:
- Share brief summaries of related patterns
- Ask: "I found these related patterns: [summaries]. How does yours differ?"
- Suggest possible distinctions to help them respond
- Help the conversation move forward rather than blocking

### 3. Gather Details

Ask follow-up questions one at a time, suggesting possible answers based on context:
- **Patterns**: Problem → Solution → Example
- **Anti-patterns**: Problem → What Goes Wrong → Solution
- **Obstacles**: Description → Impact

Example: "What problem does this solve? Based on your summary, it sounds like it might be about [guess 1] or [guess 2]. Is that right?"

### 4. Add Author (if needed)

Check if author exists in `website/config/authors.yaml`. If not, ask for:
- Full name
- GitHub username
- Website URL (optional)

### 5. Create and Review

Create the file, show it to the author, and ask for any adjustments.

---

## File Structure

### File Naming
Use kebab-case: `chain-of-small-steps.md`, `tell-me-a-lie.md`

### Frontmatter (required)

```yaml
---
authors: [author_id]
related_obstacles:
  - obstacle-slug
related_patterns:
  - pattern-slug
related_anti_patterns:
  - anti-pattern-slug
---
```

Only include relationship fields that apply.

### Content Structure

**Pattern:**
```markdown
# Pattern Name

## Problem
[What challenge does this address?]

## Pattern
[What's the solution or approach?]

## Example
[Real-world usage from your experience]
```

**Anti-pattern:**
```markdown
# Anti-pattern Name (Anti-pattern)

## Problem
[What goes wrong?]

## What Goes Wrong
[Impact and consequences]

## Example
[Real-world instance]

## Solution
[How to avoid or fix it]
```

**Obstacle:**
```markdown
# Obstacle Name (Obstacle)

## Description
[The inherent AI limitation]

## Impact
[How it affects coding workflows]
```

---

## Author Format

In `website/config/authors.yaml`:

```yaml
author_id:
  name: Full Name
  github: github_username
  url: https://example.com  # optional
```

---

## Tips

- Use concrete examples from real experience
- Keep it concise
- Link to related patterns/obstacles
- Write clearly for a broad audience
