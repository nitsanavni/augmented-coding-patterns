---
authors: [lada_kesseler]
---

# Semantic Zoom

## Problem
Code, logs, docs, books, and articles are frozen at a single written abstraction level. You can’t zoom out for overview or zoom in for details — you’re constrained to whatever resolution the author chose.

## Pattern
AI turns static text into an **elastic surface**: you can expand, collapse, and shift abstraction levels on demand.  
You control the level of detail by how you ask.

**Zoom Out** — ask for high-level synthesis
- "Give me the high-level architecture of this codebase"
- "Summarize the main components and how they interact"
- "Make this paragraph much shorter"

**Zoom In** — interrogate specifics interactively
- "How does authentication work here?"
- "Show me the implementation of this flow"
- "What edge cases does this function handle?"


## Example 1
Opening Kafka repository: First ask AI for high-level architecture overview with ASCII diagrams. Once oriented, zoom into specific areas: "How does the consumer group rebalancing work?" AI researches and explains the details.

## Example 2
With a scientific research paper you might start with a chapter-level summary, then zoom into one experiment’s methodology and ask questions when something is unclear.
