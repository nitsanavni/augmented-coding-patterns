import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display header navigation with all links', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    const homeLink = nav.locator('a[href="/"]');
    const patternsLink = nav.locator('a[href="/patterns/"]');
    const antiPatternsLink = nav.locator('a[href="/anti-patterns/"]');
    const obstaclesLink = nav.locator('a[href="/obstacles/"]');

    await expect(homeLink).toBeVisible();
    await expect(patternsLink).toBeVisible();
    await expect(antiPatternsLink).toBeVisible();
    await expect(obstaclesLink).toBeVisible();
  });

  test('should navigate to home page from header', async ({ page }) => {
    await page.goto('/patterns');
    await page.locator('nav a[href="/"]').click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Augmented Coding Patterns');
  });

  test('should navigate to Patterns page from header', async ({ page }) => {
    await page.locator('nav a[href="/patterns/"]').click();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.locator('h1')).toContainText('Patterns');
  });

  test('should navigate to Anti-Patterns page from header', async ({ page }) => {
    await page.locator('nav a[href="/anti-patterns/"]').click();
    await expect(page).toHaveURL('/anti-patterns/');
    await expect(page.locator('h1')).toContainText('Anti-Patterns');
  });

  test('should navigate to Obstacles page from header', async ({ page }) => {
    await page.locator('nav a[href="/obstacles/"]').click();
    await expect(page).toHaveURL('/obstacles/');
    await expect(page.locator('h1')).toContainText('Obstacles');
  });

  test('should navigate between pages maintaining header', async ({ page }) => {
    await page.locator('nav a[href="/patterns/"]').click();
    await expect(page.locator('header')).toBeVisible();

    await page.locator('nav a[href="/anti-patterns/"]').click();
    await expect(page.locator('header')).toBeVisible();

    await page.locator('nav a[href="/obstacles/"]').click();
    await expect(page.locator('header')).toBeVisible();

    await page.locator('nav a[href="/"]').click();
    await expect(page.locator('header')).toBeVisible();
  });

  test('should navigate using browser back button', async ({ page }) => {
    await page.locator('a[href="/patterns/"]').first().click();
    await expect(page).toHaveURL('/patterns/');

    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Augmented Coding Patterns');
  });

  test('should navigate using browser forward button', async ({ page }) => {
    await page.locator('a[href="/patterns/"]').first().click();
    await expect(page).toHaveURL('/patterns/');

    await page.goBack();
    await expect(page).toHaveURL('/');

    await page.goForward();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.locator('h1')).toContainText('Patterns');
  });

  test('should display logo link in header', async ({ page }) => {
    const logo = page.locator('header a[href="/"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('Augmented Coding Patterns');
  });

  test('should navigate home when clicking logo', async ({ page }) => {
    await page.goto('/patterns');
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('should display footer with GitHub link', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const githubLink = footer.locator('a[href*="github.com"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
