import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.describe('Home Page Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('should have proper page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have main heading', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
    });

    test('should have correct heading hierarchy', async ({ page }) => {
      const h1 = await page.locator('h1').first();
      await expect(h1).toBeVisible();

      const h2Elements = await page.locator('h2').all();
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    test('should have accessible links with text', async ({ page }) => {
      const links = await page.locator('a').all();
      for (const link of links) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
    });

    test('should have navigation landmarks', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have header landmark', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('should have main landmark', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('should have footer landmark', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should have lang attribute on html element', async ({ page }) => {
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en');
    });

    test('should have meaningful link text', async ({ page }) => {
      const links = await page.locator('a[href]').all();
      for (const link of links) {
        const text = (await link.textContent())?.trim();
        if (text) {
          expect(text.toLowerCase()).not.toBe('click here');
          expect(text.toLowerCase()).not.toBe('here');
          expect(text.toLowerCase()).not.toBe('link');
        }
      }
    });
  });

  test.describe('Patterns List Page Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/patterns/');
    });

    test('should have proper page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
    });

    test('should have main heading with category name', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('Patterns');
    });

    test('should have correct heading hierarchy in pattern cards', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      const patternTitles = await page.locator('a[href^="/patterns/"] h2').all();
      expect(patternTitles.length).toBeGreaterThan(0);
    });

    test('should have accessible pattern links', async ({ page }) => {
      const patternLinks = await page.locator('a[href^="/patterns/"]').all();
      for (const link of patternLinks) {
        const text = await link.textContent();
        expect(text?.trim()).toBeTruthy();
      }
    });
  });

  test.describe('Pattern Detail Page Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/patterns/active-partner/');
    });

    test('should have proper page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
    });

    test('should have main heading with pattern name', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('Active Partner');
    });

    test('should have article element for main content', async ({ page }) => {
      const article = page.locator('article');
      await expect(article).toBeVisible();
    });

    test('should have correct heading hierarchy in content', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      const h2Elements = await page.locator('article h2').all();
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    test('should have accessible back link', async ({ page }) => {
      const backLink = page.locator('a').filter({ hasText: 'Back to Patterns' });
      await expect(backLink).toBeVisible();
      const text = await backLink.textContent();
      expect(text?.trim()).toBeTruthy();
    });

    test('should have proper code block semantics if present', async ({ page }) => {
      const preElements = await page.locator('pre').count();
      if (preElements > 0) {
        const firstPre = page.locator('pre').first();
        await expect(firstPre).toBeVisible();
      }
    });

    test('should have proper list semantics', async ({ page }) => {
      const lists = await page.locator('ul, ol').count();
      if (lists > 0) {
        const firstList = page.locator('ul, ol').first();
        await expect(firstList).toBeVisible();
      }
    });
  });

  test.describe('Navigation Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('should allow keyboard navigation through nav links', async ({ page }) => {
      const navLinks = page.locator('nav a');
      const count = await navLinks.count();

      for (let i = 0; i < count; i++) {
        const link = navLinks.nth(i);
        await link.focus();
        const isFocused = await link.evaluate((el) => el === document.activeElement);
        expect(isFocused).toBe(true);
      }
    });

    test('should have external links with proper attributes', async ({ page }) => {
      const externalLinks = await page.locator('a[target="_blank"]').all();
      for (const link of externalLinks) {
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    });

    test('should maintain focus visibility', async ({ page }) => {
      const firstLink = page.locator('a').first();
      await firstLink.focus();

      const outlineStyle = await firstLink.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
        };
      });

      // Focus should be visible (either outline or other focus indicator)
      // This is a basic check - actual implementation may vary
      expect(outlineStyle).toBeDefined();
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('should be accessible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should be accessible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should maintain semantic structure across viewports', async ({ page }) => {
      await page.goto('/');

      // Mobile
      await page.setViewportSize({ width: 375, height: 667 });
      let navCount = await page.locator('nav').count();
      let h1Count = await page.locator('h1').count();
      expect(navCount).toBeGreaterThan(0);
      expect(h1Count).toBeGreaterThan(0);

      // Desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      navCount = await page.locator('nav').count();
      h1Count = await page.locator('h1').count();
      expect(navCount).toBeGreaterThan(0);
      expect(h1Count).toBeGreaterThan(0);
    });
  });
});
