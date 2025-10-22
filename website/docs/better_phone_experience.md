# Better Phone Experience Plan

## Architecture

```
Mobile View
┌──────────────────────────────────────┐
│ Complete Catalog                     │
│ ┌──────────────────────────────────┐ │
│ │ Search ─────┐  Filters Button ──┘ │
│ └──────────────────────────────────┘ │
│ Accordion List (one group open)      │
│ ┌─────────────┐ ┌─────────────┐      │
│ │ Obstacles ▾ │ │ Anti-P ↕   │      │
│ │ • Item      │ │             │      │
│ │ • Item      │ │             │      │
│ └─────────────┘ └─────────────┘      │
│ Bottom Sheet Detail (on select)      │
│ ┌──────────────────────────────────┐ │
│ │  Title + Badge + Close (×)       │ │
│ │  Markdown guidance               │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘

Filter Overlay (invoked from button)
┌──────────────────────────────────────┐
│ Filters                              │
│ ┌──────────────────────────────────┐ │
│ │ Type buttons                     │ │
│ ├──────────────────────────────────┤ │
│ │ Author avatars                   │ │
│ └──────────────────────────────────┘ │
│ Close: backdrop tap or ×            │
└──────────────────────────────────────┘
```

## TODO

- [x] Audit existing mobile breakpoints to capture the current filter, list, and detail pain points (filters dominate header, list + detail stack awkwardly).
- [x] Shape the responsive layout: single-column flow, accordion category list, and filter overlay entry point beneath search.
- [x] Implement the filter overlay with full wiring while keeping desktop layout intact.
- [x] Build the pattern detail bottom sheet with backdrop tap and explicit close control.
- [x] Run `./test.sh` and perform responsive spot checks to confirm the experience holds up. 
