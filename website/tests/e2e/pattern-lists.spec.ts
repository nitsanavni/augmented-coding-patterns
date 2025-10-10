import { test, expect } from '@playwright/test';

test.describe('Pattern Lists', () => {
  test.describe('Patterns List Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/patterns/');
    });

    test('should load correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toContainText('Patterns');
    });

    test('should display category header with correct emoji', async ({ page }) => {
      const header = page.locator('header').first();
      await expect(header.locator('text=🧩')).toBeVisible();
      await expect(header.locator('h1')).toContainText('Patterns');
    });

    test('should display category description', async ({ page }) => {
      await expect(page.locator('p')).toContainText('Proven strategies');
    });

    test('should display pattern count', async ({ page }) => {
      const countText = page.locator('text=/\\d+ patterns available/');
      await expect(countText).toBeVisible();
    });

    test('should display list of patterns', async ({ page }) => {
      const patternLinks = page.locator('a[href^="/patterns/"]');
      const count = await patternLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display patterns with titles', async ({ page }) => {
      const firstPattern = page.locator('a[href^="/patterns/"]').first();
      await expect(firstPattern.locator('h2')).toBeVisible();
    });

    test('should display patterns with emojis', async ({ page }) => {
      const firstPattern = page.locator('a[href^="/patterns/"]').first();
      const patternContent = await firstPattern.textContent();
      expect(patternContent).toBeTruthy();
    });

    test('should match pattern count with actual number of patterns', async ({ page }) => {
      const countText = await page.locator('text=/\\d+ patterns available/').textContent();
      const count = parseInt(countText?.match(/\d+/)?.[0] || '0');

      const patternLinks = page.locator('a[href^="/patterns/"]');
      const actualCount = await patternLinks.count();

      expect(actualCount).toBe(count);
    });

    test('should navigate to pattern detail when clicking a pattern', async ({ page }) => {
      const firstPattern = page.locator('a[href^="/patterns/"]').first();
      const href = await firstPattern.getAttribute('href');

      await firstPattern.click();
      await expect(page).toHaveURL(href!);
      await expect(page.locator('a').filter({ hasText: 'Back to Patterns' })).toBeVisible();
    });
  });

  test.describe('Anti-Patterns List Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/anti-patterns/');
    });

    test('should load correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toContainText('Anti-Patterns');
    });

    test('should display category header with correct emoji', async ({ page }) => {
      const header = page.locator('header').first();
      await expect(header.locator('text=⚠️')).toBeVisible();
      await expect(header.locator('h1')).toContainText('Anti-Patterns');
    });

    test('should display category description', async ({ page }) => {
      await expect(page.locator('p')).toContainText('Common mistakes');
    });

    test('should display pattern count', async ({ page }) => {
      const countText = page.locator('text=/\\d+ anti-patterns available/');
      await expect(countText).toBeVisible();
    });

    test('should display list of anti-patterns', async ({ page }) => {
      const antiPatternLinks = page.locator('a[href^="/anti-patterns/"]');
      const count = await antiPatternLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should match pattern count with actual number of anti-patterns', async ({ page }) => {
      const countText = await page.locator('text=/\\d+ anti-patterns available/').textContent();
      const count = parseInt(countText?.match(/\d+/)?.[0] || '0');

      const antiPatternLinks = page.locator('a[href^="/anti-patterns/"]');
      const actualCount = await antiPatternLinks.count();

      expect(actualCount).toBe(count);
    });

    test('should navigate to anti-pattern detail when clicking', async ({ page }) => {
      const firstAntiPattern = page.locator('a[href^="/anti-patterns/"]').first();
      const href = await firstAntiPattern.getAttribute('href');

      await firstAntiPattern.click();
      await expect(page).toHaveURL(href!);
      await expect(page.locator('a').filter({ hasText: 'Back to Anti-Patterns' })).toBeVisible();
    });
  });

  test.describe('Obstacles List Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/obstacles/');
    });

    test('should load correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toContainText('Obstacles');
    });

    test('should display category header with correct emoji', async ({ page }) => {
      const header = page.locator('header').first();
      await expect(header.locator('text=⛰️')).toBeVisible();
      await expect(header.locator('h1')).toContainText('Obstacles');
    });

    test('should display category description', async ({ page }) => {
      await expect(page.locator('p')).toContainText('inherent limitations');
    });

    test('should display pattern count', async ({ page }) => {
      const countText = page.locator('text=/\\d+ obstacles available/');
      await expect(countText).toBeVisible();
    });

    test('should display list of obstacles', async ({ page }) => {
      const obstacleLinks = page.locator('a[href^="/obstacles/"]');
      const count = await obstacleLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should match pattern count with actual number of obstacles', async ({ page }) => {
      const countText = await page.locator('text=/\\d+ obstacles available/').textContent();
      const count = parseInt(countText?.match(/\d+/)?.[0] || '0');

      const obstacleLinks = page.locator('a[href^="/obstacles/"]');
      const actualCount = await obstacleLinks.count();

      expect(actualCount).toBe(count);
    });

    test('should navigate to obstacle detail when clicking', async ({ page }) => {
      const firstObstacle = page.locator('a[href^="/obstacles/"]').first();
      const href = await firstObstacle.getAttribute('href');

      await firstObstacle.click();
      await expect(page).toHaveURL(href!);
      await expect(page.locator('a').filter({ hasText: 'Back to Obstacles' })).toBeVisible();
    });
  });
});
