---
authors: [lada_kesseler]
---

# Limited Context Window (Obstacle)

## Description
LLMs can only process a fixed maximum number of tokens (the context window) in one pass. Anything beyond that is truncated. 
Tools work around statelessness by concatenating conversation history, but once the window is full, older messages must be dropped or compressed.

## Impact
Even with workarounds for statelessness, conversations eventually lose early turns, large files can’t be ingested whole, and comprehensive documentation must be chunked and stitched together.

## Details
Conversation state is rebuilt each turn by concatenating prior messages. This concatenated text must fit within the context window. Once the limit is reached, older content is dropped or summarized to make room for new input.
