# GitHub Pages Deployment Guide

This document explains how to deploy the augmented-coding-patterns website to GitHub Pages.

## Configuration

The Next.js application is configured for static export with the following settings in `next.config.ts`:

- `output: 'export'` - Enables static HTML export
- `basePath: '/augmented-coding-patterns'` - Configured for GitHub Pages repo deployment at `username.github.io/augmented-coding-patterns`
- `images.unoptimized: true` - Required for static export (Next.js Image optimization is not available)
- `trailingSlash: true` - Adds trailing slashes to URLs for better GitHub Pages compatibility

### Alternative Configuration for Custom Domain

If deploying to a custom domain or a username.github.io repository (root deployment), modify `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '', // Empty basePath for root deployment
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

## Build Process

The static site is built using:

```bash
npm run build
```

This generates the static site in the `out/` directory with:
- All pages as static HTML files
- Client-side JavaScript bundles
- Public assets (images, SVGs, etc.)
- `.nojekyll` file (prevents Jekyll processing)
- `404.html` for GitHub Pages fallback routing

## Deployment Steps

### Option 1: Manual Deployment via GitHub UI

1. Build the site: `npm run build`
2. Navigate to the `out/` directory
3. Push the contents to the `gh-pages` branch
4. Enable GitHub Pages in repository settings (Settings > Pages)
5. Select the `gh-pages` branch as the source

### Option 2: GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json
      - name: Install dependencies
        run: cd website && npm ci
      - name: Build site
        run: cd website && npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: website/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Option 3: Direct Branch Push

```bash
# Build the site
npm run build

# Navigate to out directory
cd out

# Initialize git if needed
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git push -f git@github.com:USERNAME/augmented-coding-patterns.git main:gh-pages

# Return to project root
cd ..
```

## Accessing the Deployed Site

Once deployed, the site will be available at:
- `https://USERNAME.github.io/augmented-coding-patterns/`

Replace `USERNAME` with your GitHub username.

## Important Notes

1. **basePath in Links**: All internal links must account for the basePath. Next.js Link components automatically handle this.

2. **.nojekyll File**: This file is placed in the `public/` directory and copied to `out/` during build. It tells GitHub Pages not to process files with Jekyll, which is essential for Next.js files starting with underscores (like `_next/`).

3. **404 Handling**: The `404.html` file provides fallback routing for GitHub Pages. Client-side routing will still work for navigation within the app.

4. **No Server-Side Features**: Static export does not support:
   - Server-side rendering (SSR)
   - API routes
   - Dynamic routes without `generateStaticParams`
   - Image optimization (must use `unoptimized: true`)

5. **Build Output**: The build process generated 49 static pages including:
   - Home page
   - 25 pattern pages
   - 6 anti-pattern pages
   - 10 obstacle pages
   - List/index pages
   - 404 page

## Troubleshooting

### Pages Not Loading
- Verify `basePath` matches your GitHub Pages URL structure
- Check browser console for 404 errors on assets
- Ensure `.nojekyll` file exists in the `out/` directory

### Routing Issues
- Verify `trailingSlash: true` is set
- Check that all internal links use Next.js Link component
- Ensure `404.html` exists for fallback routing

### Assets Not Loading
- Check that `basePath` is correctly configured
- Verify public files are in the `public/` directory
- Ensure image paths are relative or use Next.js Image component

## Verification

After deployment, verify:
- [ ] Home page loads at the root URL
- [ ] Pattern pages load correctly
- [ ] Anti-pattern pages load correctly
- [ ] Obstacle pages load correctly
- [ ] Navigation between pages works
- [ ] Static assets (images, SVGs) load
- [ ] 404 page displays for invalid routes
- [ ] No console errors in browser developer tools
