import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Augmented Coding Patterns/);
    await expect(page.locator('h1')).toContainText('Augmented Coding Patterns');
  });

  test('should display hero section', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    await expect(heroSection.locator('h1')).toContainText('Augmented Coding Patterns');
    await expect(heroSection.locator('p')).toContainText('comprehensive collection');
  });

  test('should display all three category cards', async ({ page }) => {
    await expect(page.locator('a[href="/patterns/"]')).toBeVisible();
    await expect(page.locator('a[href="/anti-patterns/"]')).toBeVisible();
    await expect(page.locator('a[href="/obstacles/"]')).toBeVisible();
  });

  test('should show Patterns card with correct emoji and details', async ({ page }) => {
    const patternsCard = page.locator('a[href="/patterns/"]');
    await expect(patternsCard).toBeVisible();
    await expect(patternsCard.locator('text=🧩')).toBeVisible();
    await expect(patternsCard.locator('h2')).toContainText('Patterns');
    await expect(patternsCard).toContainText('Proven strategies');
    await expect(patternsCard).toContainText('Patterns', { useInnerText: true });
  });

  test('should show Anti-Patterns card with correct emoji and details', async ({ page }) => {
    const antiPatternsCard = page.locator('a[href="/anti-patterns/"]');
    await expect(antiPatternsCard).toBeVisible();
    await expect(antiPatternsCard.locator('text=⚠️')).toBeVisible();
    await expect(antiPatternsCard.locator('h2')).toContainText('Anti-Patterns');
    await expect(antiPatternsCard).toContainText('Common mistakes');
    await expect(antiPatternsCard).toContainText('Anti-Patterns', { useInnerText: true });
  });

  test('should show Obstacles card with correct emoji and details', async ({ page }) => {
    const obstaclesCard = page.locator('a[href="/obstacles/"]');
    await expect(obstaclesCard).toBeVisible();
    await expect(obstaclesCard.locator('text=⛰️')).toBeVisible();
    await expect(obstaclesCard.locator('h2')).toContainText('Obstacles');
    await expect(obstaclesCard).toContainText('inherent limitations');
    await expect(obstaclesCard).toContainText('Obstacles', { useInnerText: true });
  });

  test('should display pattern counts', async ({ page }) => {
    const patternsCount = page.locator('a[href="/patterns/"]').locator('text=/\\d+ Patterns/');
    const antiPatternsCount = page.locator('a[href="/anti-patterns/"]').locator('text=/\\d+ Anti-Patterns/');
    const obstaclesCount = page.locator('a[href="/obstacles/"]').locator('text=/\\d+ Obstacles/');

    await expect(patternsCount).toBeVisible();
    await expect(antiPatternsCount).toBeVisible();
    await expect(obstaclesCount).toBeVisible();
  });

  test('should navigate to Patterns list when clicking Patterns card', async ({ page }) => {
    await page.locator('a[href="/patterns/"]').click();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.locator('h1')).toContainText('Patterns');
  });

  test('should navigate to Anti-Patterns list when clicking Anti-Patterns card', async ({ page }) => {
    await page.locator('a[href="/anti-patterns/"]').click();
    await expect(page).toHaveURL('/anti-patterns/');
    await expect(page.locator('h1')).toContainText('Anti-Patterns');
  });

  test('should navigate to Obstacles list when clicking Obstacles card', async ({ page }) => {
    await page.locator('a[href="/obstacles/"]').click();
    await expect(page).toHaveURL('/obstacles/');
    await expect(page.locator('h1')).toContainText('Obstacles');
  });
});
