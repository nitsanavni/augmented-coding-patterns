---
authors: [lexler]
---

# Text Native

## Problem
Text became so powerful with AI. We underuse text as a thinking and planning medium.
We reach for specialized tools when text would be more powerful. Tool switching and format conversion slow us down.

## Pattern
Staying in text can make you more powerful. Use ASCII for lightweight diagrams, architecture, UI mockups, planning.
Text is AI's native medium - it thinks in text, responds in text.
When you stay in text, you stay in AI's strongest modality.

ASCII creates a shared workspace - both human and AI can edit.
No tool switching, no format conversion, instant iteration. Text is fast.

## Example

**Hack4Good UI Redesign:**
Speech therapy app needed UI changes. Instead of building immediately:

1. **Paper sketches** - Designer drew new modal design
2. **AI converts to ASCII** - Showed sketches to AI, got ASCII mockup
3. **Human edits ASCII** - Changed button text, refined layout in text
4. **ASCII to markdown spec** - Documented the design decisions
5. **Spec to todo list** - Clear implementation steps
6. **Todos to code** - Each step verifiable

Interesting aspect: Editing the ASCII mockup directly.
AI produced it, human refined it, gave it back to AI.
Both working in the same text medium.

**Architecture diagrams:**
```
User → Load Balancer → [Server Pool] → Database
           ↓                ↓
        Cache Layer    Message Queue
```

**State machines, flowcharts, UI mockups** - all in ASCII.
Edit, version, share, transform - all without leaving text.

**Understanding new codebases:**
"Explain architecture for this code base on a high level. Use ASCII if it's helpful"
