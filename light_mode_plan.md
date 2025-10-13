# Light Mode Implementation Plan

## Executive Summary

Add a manual theme toggle to the website that allows users to switch between light and dark modes, with persistence across sessions and smooth transitions. Each theme will have its own color palette optimized for its background, with a simple and clean light theme designed specifically for white backgrounds. The implementation will follow TDD principles and integrate seamlessly with the existing CSS architecture.

## Current State

### Architecture Overview
- **Static Site**: Next.js 15 with static export (`output: 'export'`)
- **Styling**: CSS Modules with global CSS custom properties
- **Dark Mode**: Automatic via `@media (prefers-color-scheme: dark)`
- **No Manual Control**: Users cannot override their OS preference

### How Current Dark Mode Works
1. CSS custom properties defined in `:root` (light theme by default)
2. Media query overrides properties when OS is in dark mode
3. All components use these CSS variables via `var(--color-*)`
4. Automatic and instant, but no user control

### Affected Files
- **Global styles**: `app/globals.css` (contains theme variables)
- **Layout styles**: `app/layout.module.css` (header styling)
- **All CSS modules**: Use theme variables that will respond to theme changes
- **RelationshipGraph component**: `app/components/RelationshipGraph.tsx` (hardcoded colors need theme-aware alternatives)

## Future State

### User Experience
1. **Initial Visit**: Theme matches system preference
2. **Manual Toggle**: User can click button to switch themes
3. **Persistence**: Choice remembered across sessions
4. **No Flash**: Correct theme applied before page renders
5. **Smooth Transitions**: Theme changes animate gracefully

### Technical Architecture

#### Theme Application Strategy
- **Class-based**: `<html class="light">` or `<html class="dark">`
- **CSS Structure**: Classes override media query, media query provides fallback
- **Priority**: Manual selection > System preference

#### Storage Strategy
- **localStorage**: Stores user's manual theme selection
- **Blocking Script**: Small inline script in `<head>` prevents flash
- **Fallback**: System preference when no stored value

#### Component Architecture
- **ThemeToggle Component**: React component for UI control
- **Theme Hook**: Custom hook for theme state management
- **Icon Button**: Sun/moon icons indicating current state

## Implementation Approach

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           Browser Storage               │
│         localStorage['theme']           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Blocking Script (<head>)        │
│   - Read localStorage or system pref    │
│   - Apply class to <html>               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            CSS Architecture             │
│   .light { /* overrides */ }            │
│   .dark { /* overrides */ }             │
│   @media (prefers-color-scheme) fallback│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         React Theme System              │
│   - ThemeToggle component               │
│   - useTheme hook                       │
│   - Updates localStorage & DOM          │
└─────────────────────────────────────────┘
```

### CSS Strategy

#### Variable Override Hierarchy
1. **Base variables**: Default light theme in `:root`
2. **Media query**: Dark theme for system preference (current)
3. **Class overrides**: `.light` and `.dark` classes (new)
4. **Specificity**: Classes beat media query, allowing manual control

#### Color Palette Strategy
- **Independent palettes**: Each theme has its own color set optimized for its background
- **Light theme**: Clean, simple colors designed for white backgrounds (no contrast calculations needed)
- **Dark theme**: Keep existing vibrant colors as-is
- **Category highlights**: Keep the same accent colors (green/orange/red bars) in both themes - these are part of the visual identity
- **RelationshipGraph colors**: Separate color constants for each theme, selected based on active theme

#### Light Theme Colors (Decided)
```css
/* Base colors */
--color-background: #ffffff;
--color-text: #1a1a1a;        /* Dark gray, not pure black */
--color-text-secondary: #666666;
--color-border: #e5e5e5;
--color-surface: #f9f9f9;     /* Very light gray for cards */

/* Category accents (unchanged) */
--color-pattern: #0ca678;      /* Green - same as dark theme */
--color-antipattern: #f76707;  /* Orange - same as dark theme */
--color-obstacle: #e03131;     /* Red - same as dark theme */

/* RelationshipGraph node colors (darker for white background) */
--graph-pattern: #059669;
--graph-antipattern: #ea580c;
--graph-obstacle: #dc2626;
--graph-text: #ffffff;         /* White text on colored nodes */
```

#### Transition Approach
- Add CSS transitions to smooth theme changes
- Exclude transition on initial load to prevent flash
- Use CSS custom property for transition control

### Component Strategy

#### ThemeToggle Component
- **Location**: Header, right side next to Contributors
- **Visual**: Emoji button (☀️ for light mode / 🌙 for dark mode)
- **State**: Managed via custom hook
- **Accessibility**: ARIA labels, keyboard support
- **Implementation**: Simple button with emoji, no external icon dependencies

#### Theme Management Hook (useTheme)
- **Responsibilities**:
  - Read initial theme from localStorage/system
  - Update DOM class
  - Persist to localStorage
  - Provide theme state to components
- **Used by**:
  - ThemeToggle component (to show current state and toggle)
  - RelationshipGraph component (to select appropriate color palette)
- **Returns**: `{ theme: 'light' | 'dark', toggleTheme: () => void }`

### Testing Strategy (TDD)

#### Test Categories

1. **Theme Detection Tests**
   - System preference detection
   - localStorage reading
   - Fallback behavior

2. **Theme Toggle Component Tests**
   - Renders with correct initial state
   - Click changes theme
   - Keyboard accessibility
   - Icon changes appropriately

3. **Theme Application Tests**
   - Class applied to HTML element
   - localStorage updated
   - No unnecessary re-renders

4. **Theme Hook Tests**
   - Returns current theme
   - Toggle function works
   - Handles edge cases

5. **RelationshipGraph Theme Tests**
   - Correct color palette loaded for each theme
   - Node text remains readable in both themes
   - Legend updates with theme-appropriate colors

#### Test Implementation Approach
- Mock localStorage in tests
- Mock matchMedia for system preference
- Test behavior, not implementation
- Use React Testing Library
- Follow given-when-then format

## Implementation Steps

### Phase 1: Foundation
1. Create theme management system (hook and utilities)
2. Add blocking script to prevent flash
3. Update CSS with class-based overrides
4. Define light theme color palette in CSS variables

### Phase 2: Component Updates
1. Build ThemeToggle component
2. Integrate into header layout
3. Add emoji button styling
4. Update RelationshipGraph with dual color palettes:
   - Create LIGHT_CATEGORY_COLORS and DARK_CATEGORY_COLORS objects
   - Use useTheme hook to select appropriate palette
   - Keep text white on colored nodes in both themes

### Phase 3: Polish
1. Add smooth transitions
2. Ensure accessibility
3. Test readability of all color combinations
4. Test across browsers

### Phase 4: Testing
1. Write comprehensive test suite
2. Test edge cases
3. Verify no flash on load
4. Validate color choices in both themes

## Success Criteria

### Functional Requirements
- Users can manually toggle between light and dark themes
- Theme preference persists across sessions
- No flash of incorrect theme on page load
- System preference used as default for new users

### Non-Functional Requirements
- Smooth transitions between themes
- Accessible via keyboard
- Works without JavaScript (falls back to system preference)
- No impact on initial page load performance

## Risks and Mitigations

### Risk: Flash of Unstyled Content
**Mitigation**: Blocking script in `<head>` runs before render

### Risk: JavaScript Disabled
**Mitigation**: CSS media query provides fallback behavior

### Risk: localStorage Unavailable
**Mitigation**: Graceful degradation to system preference

### Risk: Color Palette Inconsistency
**Mitigation**: Define clear, separate palettes for each theme from the start

## Future Enhancements (Not in Current Scope)

- Three-way toggle (light/dark/auto)
- Theme preference sync across tabs
- Custom color themes beyond light/dark
- Transition preference settings
- Theme preview on hover

## Implementation Decisions Made

### Key Choices
1. **useTheme Hook**: Components will use a React hook for theme state rather than reading DOM directly
2. **Emoji Icons**: Using ☀️/🌙 emoji instead of SVG icons for simplicity
3. **Dual Palettes**: Completely separate color sets for each theme, no dynamic contrast calculations
4. **Category Accents**: Green/orange/red highlight bars remain the same in both themes (visual identity)
5. **Light Theme Style**: Clean documentation-style with grays on white, similar to GitHub/Notion
6. **RelationshipGraph**: Will have darker node colors in light mode with white text, using useTheme to switch palettes

### Testing Approach
- Test color selection logic, not canvas rendering
- Mock localStorage and matchMedia in tests
- Visual verification of RelationshipGraph will be manual

## Summary

This plan provides a robust, user-friendly theme toggle system that:
- Respects user preferences
- Provides manual control
- Prevents visual flash
- Follows TDD principles
- Integrates cleanly with existing architecture
- Uses simple, maintainable solutions (emoji icons, dual palettes)

The implementation prioritizes user experience while maintaining code simplicity and testability.