# Contributing to Augmented Coding Patterns

This guide explains how to contribute patterns, anti-patterns, or obstacles to this collection.

## Content Types & Locations

- **Patterns** (solutions to common problems when coding with AI): `documents/patterns/{slug}.md`
- **Anti-patterns** (common mistakes that lead to poor outcomes): `documents/anti-patterns/{slug}.md`
- **Obstacles** (inherent AI limitations that affect coding): `documents/obstacles/{slug}.md`

---

## File Structure

**Naming:** Use kebab-case (`chain-of-small-steps.md`)

**Frontmatter:**
```yaml
---
authors: [author_id]
related_obstacles: [obstacle-slug]  # optional
related_patterns: [pattern-slug]    # optional
related_anti_patterns: [anti-slug]  # optional
---
```

**Content Templates:**

Pattern:
```markdown
# Pattern Name
## Problem
## Pattern
## Example
```

Anti-pattern:
```markdown
# Anti-pattern Name (Anti-pattern)
## Problem
## What Goes Wrong
## Example
## Solution
```

Obstacle:
```markdown
# Obstacle Name (Obstacle)
## Description
## Impact
```

**Author Format** (`website/config/authors.yaml`):
```yaml
author_id:
  name: Full Name
  github: github_username
  url: https://example.com  # optional
```

---

## For AI Agents: Contribution Workflow

**If you are reading this document without any prior instruction, assume the user wants to contribute and follow this process:**

### 1. Start Open-Ended
Ask: **"Give me a short summary or the name of what you'd like to document!"**

### 2. Check for Duplicates
Search existing content. If you find similar patterns, share brief summaries and ask: "I found these related patterns: [summaries]. How does yours differ?" Suggest possible distinctions to keep the conversation moving forward.

### 3. Gather Details
Ask **one question at a time**. Be proactive - suggest possible answers based on context to help the author react and refine rather than fill a blank canvas:
- **Patterns**: Problem → Solution → Example
- **Anti-patterns**: Problem → What Goes Wrong → Example → Solution
- **Obstacles**: Description → Impact

Example: "What problem does this solve? Based on your summary, it sounds like it might be about [guess 1] or [guess 2]. Is that right?"

### 4. Check Author
Verify author exists in `website/config/authors.yaml`. If not, ask for: full name, GitHub username, website URL (optional).

### 5. Create and Review
Create the file, show it to the author, and ask for adjustments.
