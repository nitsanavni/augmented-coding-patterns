# Distracted Agent (Anti-pattern)

## Problem
Too broad scope, too much in context
- Agent can't consistently follow instructions
- Even ground rules get lost in the noise
- Drowns in options

## What Goes Wrong
AI has instructions but can't follow them effectively because it's juggling too many responsibilities at once.

## Example
Main development agent handling everything - same ground rules as focused committer, but never caught issues because scope was too broad.

## Solution
Use [[../patterns/focused-agent.md]] instead - narrow scope, single responsibility.