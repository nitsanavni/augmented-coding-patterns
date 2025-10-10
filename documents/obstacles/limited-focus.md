---
authors: [lexler]
related_anti_patterns:
  - distracted-agent
related_patterns:
  - chain-of-small-steps
  - focused-agent
  - references
---

# Limited Focus (Obstacle)

## Description
LLMs have limited attention capacity. When you load too much context at once, attention gets diluted across everything or fixates on the wrong parts.

## Impact
Too much loaded simultaneously = worse performance on everything. Even ground rules stop being followed reliably.

## Details

**Competing objectives:**
Example: Give an LLM these instructions:
- "Be helpful and answer all questions"
- "Be safe and avoid harmful content"
- "Be concise"
- "Be thorough"

When asked about something potentially risky, the model must balance: Should I answer fully? (objectives 1 & 4) Should I refuse? (objective 2) Should I keep it brief? (objective 3)

These objectives compete for what the model should do. With more context containing different instructions, the model gets worse at following any single one reliably.

**Interference between multiple instruction sets:**
Example: You have:
- Paragraph 1: "Format all responses as JSON"
- Paragraph 5: "Write conversationally"
- Paragraph 10: "Use bullet points for lists"

The model must juggle all these formatting instructions. They interfere with each other - the model might produce weird hybrids or inconsistently follow different instructions at different times.

**Result:** The more diverse the context, the more the model hedges between different possible behaviors.

---

## Evidence
- Specialized models consistently outperform general ones (Mixture of Experts research)
  - Validates that narrow scope improves performance even with same model

Empirical observation: narrow agents follow the same ground rules instructions much more often than generalists
