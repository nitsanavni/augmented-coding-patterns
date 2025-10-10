import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test.describe(`${name} viewport (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
      });

      test('should display home page without horizontal scroll', async ({ page }) => {
        await page.goto('/');
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.viewportSize();
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth!.width);
      });

      test('should display header navigation usably', async ({ page }) => {
        await page.goto('/');
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();

        const homeLink = nav.locator('a[href="/"]');
        await expect(homeLink).toBeVisible();
      });

      test('should display home page hero section', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('h1')).toContainText('Augmented Coding Patterns');
      });

      test('should display category cards', async ({ page }) => {
        await page.goto('/');
        const patternsCard = page.locator('a[href="/patterns/"]');
        await expect(patternsCard).toBeVisible();
        await expect(patternsCard.locator('h2')).toBeVisible();
      });

      test('should make category cards clickable', async ({ page }) => {
        await page.goto('/');
        const patternsCard = page.locator('a[href="/patterns/"]');
        await patternsCard.click();
        await expect(page).toHaveURL('/patterns/');
      });

      test('should display patterns list page without horizontal scroll', async ({ page }) => {
        await page.goto('/patterns/');
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.viewportSize();
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth!.width);
      });

      test('should display patterns list readably', async ({ page }) => {
        await page.goto('/patterns/');
        await expect(page.locator('h1')).toBeVisible();
        const firstPattern = page.locator('a[href^="/patterns/"]').first();
        await expect(firstPattern).toBeVisible();
      });

      test('should display pattern detail page without horizontal scroll', async ({ page }) => {
        await page.goto('/patterns/active-partner/');
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.viewportSize();
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth!.width);
      });

      test('should display pattern content readably', async ({ page }) => {
        await page.goto('/patterns/active-partner/');
        await expect(page.locator('h1')).toBeVisible();
        const article = page.locator('article');
        await expect(article).toBeVisible();
      });

      test('should display back button usably', async ({ page }) => {
        await page.goto('/patterns/active-partner/');
        const backLink = page.locator('a').filter({ hasText: 'Back to Patterns' });
        await expect(backLink).toBeVisible();
        await backLink.click();
        await expect(page).toHaveURL('/patterns/');
      });

      test('should keep footer visible and readable', async ({ page }) => {
        await page.goto('/');
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
      });

      test('should maintain text readability', async ({ page }) => {
        await page.goto('/');
        const mainHeading = page.locator('h1');
        const fontSize = await mainHeading.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });
        const fontSizeNum = parseFloat(fontSize);
        expect(fontSizeNum).toBeGreaterThan(10);
      });

      test('should allow navigation links to be tapped/clicked', async ({ page }) => {
        await page.goto('/');
        const navLinks = page.locator('nav a');
        const count = await navLinks.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < Math.min(count, 4); i++) {
          const link = navLinks.nth(i);
          await expect(link).toBeVisible();
        }
      });
    });
  });

  test.describe('Responsive Layout Changes', () => {
    test('should adapt layout between mobile and desktop', async ({ page }) => {
      await page.goto('/');

      // Check mobile layout
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('h1')).toBeVisible();

      // Check desktop layout
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('h1')).toBeVisible();

      // Both should display the same content
      await expect(page.locator('a[href="/patterns/"]')).toBeVisible();
      await expect(page.locator('a[href="/anti-patterns/"]')).toBeVisible();
      await expect(page.locator('a[href="/obstacles/"]')).toBeVisible();
    });

    test('should handle viewport resize gracefully', async ({ page }) => {
      await page.goto('/');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('h1')).toBeVisible();

      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('h1')).toBeVisible();

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
    });
  });
});
