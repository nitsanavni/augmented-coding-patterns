# Noise Cancellation

## Problem
AI is verbose by default, creating poor signal-to-noise ratio. Responses contain more detail than you need, and documents accumulate bloat over time (document rot) - making both hard to scan and work with.

## Pattern
Explicitly ask AI to be more succinct - strip filler, compress to essence.

**For responses:** "Much more succinct please", "give me a TLDR", "make it shorter", "give me architecture on a high level", "higher level of abstraction"

**For documents:** Periodically compress knowledge documents - remove outdated info and noise, keep them scannable
Over-compression might strip nuance, but Git preserves history if you need it back, and you can always zoom in for details when needed.

## Example 1: Response control
Just started learning Rust and asked about Cargo.toml purpose in Rust. AI gave overwhelming detail. Asked "much more succinct please" - got answer at the level I actually cared about.

## Example 2: Document maintenance
Ground rules document grew bloated with AI additions. Asked AI to make it succinct - removed dead information, kept it scannable and manageable.