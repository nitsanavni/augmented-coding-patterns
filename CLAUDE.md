# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 static documentation website that presents an evolving collection of patterns, anti-patterns, and obstacles for developing software with LLMs. The site is deployed to GitHub Pages at https://lexler.github.io/augmented-coding-patterns/

## Architecture

The project has a two-layer structure:
- **Content layer** (`/documents/`): Markdown source files for patterns, anti-patterns, and obstacles
- **Application layer** (`/website/`): Next.js application that reads and renders the content

All development work happens in the `/website/` directory.

## Commands

From the `/website/` directory:

```bash
# Development
npm run dev                    # Start dev server on port 3000 with Turbopack

# Testing
npm test                       # Run all Jest unit tests
npm run test:watch            # Jest in watch mode
npm run test:e2e              # Run Playwright smoke tests
npx jest path/to/test.test.ts # Run single Jest test file
npx playwright test path/to/test.spec.ts # Run single Playwright test

# Quality Checks
npm run lint                  # Must have 0 errors, 0 warnings
npm run validate              # Validate relationships graph

# Build
npm run build                 # Create static site in out/ directory
npm start                     # Serve production build locally
```

## Key Implementation Details

### Category Configuration System

Never hardcode category-specific logic. Always use the centralized configuration in `app/lib/category-config.ts`:
- `getCategoryConfig(category)` - Get config for a category
- `isValidCategory(category)` - Validate category string

### Content Processing

The markdown processing pipeline (`lib/markdown.ts`):
1. Reads markdown files from `../documents/{category}/`
2. Extracts first H1 as title (including emoji if present)
3. Removes category suffix from title (e.g., "(Anti-pattern)")
4. Strips the first H1 from content (displayed separately in page header)

### Static Site Generation

This is a static export (`output: 'export'`) for GitHub Pages:
- Uses `basePath: '/augmented-coding-patterns'` for GitHub Pages subpath
- All pages must use `generateStaticParams()` for static generation
- Cannot use server-side features, API routes, or dynamic image optimization
- Always use Next.js `Link` component for internal navigation (handles basePath)

### Important Patterns

1. **Path validation required**: Always validate slugs with `validateSlug()` to prevent path traversal
2. **Trailing slashes**: Required for GitHub Pages compatibility
3. **One H1 per page**: First H1 is extracted and displayed as page title
4. **Test patterns**: Use `.nth(1)` to skip breadcrumb links when selecting pattern cards in tests

### Adding Content

To add a new pattern, anti-pattern, or obstacle:
1. Create `documents/{category}/{slug}.md`
2. Include frontmatter with `authors: [author_id]`
3. Start with an H1 title (can include emoji)
4. Add content sections (Problem, Solution, Example, etc.)
5. Update `documents/relationships.mmd` to define relationships
6. The content will automatically appear on the site after rebuild

### Testing Strategy

- **Unit tests** (`npm test`): Comprehensive coverage of components and utilities
- **E2E tests** (`npm run test:e2e`): Minimal smoke tests for critical paths only

## Project Structure

```
website/
├── app/                      # Next.js App Router pages and components
│   ├── [category]/          # Dynamic category pages
│   │   └── [slug]/          # Pattern detail pages
│   ├── components/          # React components
│   ├── lib/                 # Category config and types
│   └── talk/                # Talk-specific pages
├── lib/                     # Shared utilities
│   ├── markdown.ts          # Content processing
│   ├── relationships.ts     # Graph parsing
│   └── types.ts            # TypeScript interfaces
├── tests/                   # Jest and Playwright tests
├── public/                  # Static assets
└── config/                  # Author configuration
```

## Existing Documentation

- `/website/CLAUDE.md` - Detailed developer guide (6.9KB) with comprehensive instructions
- `/CONTRIBUTE.md` - Contribution workflow for adding content
- `/interactive-map.md` - Interactive map feature documentation
