---
authors: [lada_kesseler]
related_patterns:
  - reverse-direction
---

# Answer Injection (Anti-pattern)

## Problem
Putting solutions in your questions, limiting AI to your preconceived approach instead of leveraging its breadth of knowledge.
Note: this one can be very subtle.

## What Goes Wrong
AI has read about countless approaches you haven't considered. By injecting your solution into the question, you:
- Miss creative alternatives
- Get confirmation of your idea instead of exploration
- Waste AI's breadth of knowledge
- Often get suboptimal solutions

## Example
**Email Processing**: Hackathon needed to process emails. Friend asked "how to connect to email servers?"
Got complex server setup suggestions. Real need: just automate locally on her computer. No servers needed. Asking for simpler solution lead to combination of local email extraction solution + some python to process data from files.

**Arbitrary Limits**: "Give me 3 questions to understand this." Why 3? Maybe AI has 1 crucial question or 5.
If it has 1, it will make the rest up and waste your time.
If it has more, the 4th might be the key one that you're going to miss.

**Surfacing Unknown Unknowns**:
Asked "Can Claude Code communicate with another Claude Code?" Got "no" - Claude checked its official features.
Later, had Claude Code launch a second instance in iTerm. When it tried to launch again (already running), the command appeared as text in the second instance's prompt - accidental messaging!
The question limited AI to Claude's features. The real answer involved terminal capabilities, not Claude itself.

Follow-up: Asked broader "How can I send commands between terminal instances?" Discovered AppleScript - everything on Mac can talk to each other! Didn't even know this existed. AI's breadth revealed a whole automation layer I'd never encountered. 

## Solution
Present the problem, not your solution:
- State what you're trying to achieve, not how
- Go as far back from the solution as possible, very broad
- Remove arbitrary constraints (numbers, specific tech)
- Let AI's breadth reveal unknown unknowns
- AI is incredibly well-read - use that breadth