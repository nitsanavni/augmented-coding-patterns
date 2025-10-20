# Pattern Catalog Plan

## Layout Concept

```
┌────────────────────────────── Catalog Layout ──────────────────────────────┐
│ Sidebar (fixed width)        │ Main Panel (fills rest)                     │
│ ┌──────────────────────────┐ │ ┌────────────────────────────────────────┐ │
│ │ Filters                  │ │ │ Pattern Detail                        │ │
│ │ • Type                   │ │ │ [Title with type badge + author]      │ │
│ │   ▫ All ◉ Patterns ◯ ... │ │ │ [Metadata chips: category, tags]      │ │
│ │ • Author                 │ │ │ [Body markdown rendered inline]       │ │
│ │   ▫ All ▼                │ │ │                                        │ │
│ │                          │ │ │                                        │ │
│ ├──────────────────────────┤ │ │                                        │ │
│ │ Results (scrollable)     │ │ │                                        │ │
│ │  PATTERNS (count)        │ │ │                                        │ │
│ │   • 🔹 Pattern A         │ │ │                                        │ │
│ │   • 🔹 Pattern B         │ │ │                                        │ │
│ │  ANTI-PATTERNS (count)   │ │ │                                        │ │
│ │   • ⚠️ Anti-Pattern C    │ │ │                                        │ │
│ │  OBSTACLES (count)       │ │ │                                        │ │
│ │   • ⛰️ Obstacle D        │ │ │                                        │ │
│ └──────────────────────────┘ │ └────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

## Implementation Roadmap

1. Lay out the shell with sidebar + detail placeholders.
2. Add sidebar filters skeleton (static controls, stubbed list).
3. Load real catalog data and group by type.
4. Implement selection flow to show chosen item details.
5. Wire filtering logic for type/author.
6. UX polish: icons, responsive tweaks, empty states, keyboard focus.
