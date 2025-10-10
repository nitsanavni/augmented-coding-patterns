# Perfect Recall Fallacy (Anti-pattern)

## Problem
Expecting AI to perfectly remember all details from its training data.

## What Goes Wrong
Wasted time fighting AI's nature instead of working with it.

## Example
While building a chess app with chess.js, we needed to set up custom boards — like three pawns and a knight for each side, with no kings.

Claude confidently claimed it had implemented the feature, but when tested inside the app, nothing worked. Instead of chasing phantom fixes, we stopped and had it experiment directly with chess.js in a small playground. 

There it quickly discovered what was wrong: chess.js doesn’t allow boards without kings because it's enforcing chess rules on top that require kings to always be on the board. 

It might have seen chess.js in training data, but it wouldn't remember the details. Letting it play with the library helps discover assumptions it makes quickly. 

## Solution
- Ask AI to search/read library documentation
- Give it a playground folder to experiment and discover constraints
- Create reference docs for libraries you use
- Extract working patterns into reference docs for next time
