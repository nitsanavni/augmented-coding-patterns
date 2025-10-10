import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Critical User Journeys', () => {
  test('home page loads with correct title and main heading', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Augmented Coding Patterns/);
    await expect(page.locator('h1')).toContainText('Augmented Coding Patterns');
  });

  test('navigate from home to patterns list page', async ({ page }) => {
    await page.goto('/');

    await page.locator('a[href="/patterns/"]').first().click();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.locator('h1')).toContainText('Patterns');
  });

  test('navigate from patterns list to pattern detail page and verify content displays', async ({ page }) => {
    await page.goto('/patterns/');

    const firstPatternLink = page.locator('a[href^="/patterns/"][href$="/"]').nth(1);
    await firstPatternLink.click();

    await expect(page).toHaveURL(/\/patterns\/[a-z-]+\//);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article')).toBeVisible();
  });

  test('use back button to return to patterns list', async ({ page }) => {
    await page.goto('/patterns/');

    const firstPatternLink = page.locator('a[href^="/patterns/"][href$="/"]').nth(1);
    await firstPatternLink.click();
    await expect(page).toHaveURL(/\/patterns\/[a-z-]+\//);

    await page.goBack();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.locator('h1')).toContainText('Patterns');
  });

  test('header navigation works across pages', async ({ page }) => {
    await page.goto('/');

    await page.locator('nav a[href="/obstacles/"]').click();
    await expect(page).toHaveURL('/obstacles/');
    await expect(page.locator('h1')).toContainText('Obstacles');

    await page.locator('nav a[href="/anti-patterns/"]').click();
    await expect(page).toHaveURL('/anti-patterns/');
    await expect(page.locator('h1')).toContainText('Anti-Patterns');

    await page.locator('nav a[href="/patterns/"]').click();
    await expect(page).toHaveURL('/patterns/');
    await expect(page.locator('h1')).toContainText('Patterns');

    await page.locator('nav a[href="/"]').click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Augmented Coding Patterns');
  });

  test('can navigate via related links', async ({ page }) => {
    await page.goto('/patterns/active-partner/');

    const relatedSection = page.locator('aside h2').filter({ hasText: 'Related' });
    await expect(relatedSection).toBeVisible();

    const obstaclesHeading = page.locator('h3').filter({ hasText: 'Obstacles' });
    await expect(obstaclesHeading).toBeVisible();

    const complianceBiasLink = page.locator('a[href="/obstacles/compliance-bias/"]');
    await expect(complianceBiasLink).toBeVisible();
    await complianceBiasLink.click();

    await expect(page).toHaveURL('/obstacles/compliance-bias/');
    await expect(page.locator('h1')).toContainText('Compliance Bias');
    await expect(page.locator('article')).toBeVisible();
  });
});
