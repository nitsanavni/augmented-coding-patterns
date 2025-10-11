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

  test('navigate to contributors page and verify contributor cards display', async ({ page }) => {
    await page.goto('/');

    await page.locator('nav a[href="/contributors/"]').click();
    await expect(page).toHaveURL('/contributors/');
    await expect(page.locator('h1')).toContainText('Contributors');

    const contributorCard = page.locator('[data-testid="contributor-card"]').first();
    await expect(contributorCard).toBeVisible();

    const contributorName = contributorCard.locator('h2, h3');
    await expect(contributorName).toBeVisible();

    const contributorAvatar = contributorCard.locator('img');
    await expect(contributorAvatar).toBeVisible();
  });
});

test.describe('Search Functionality', () => {
  test('search bar is visible with correct placeholder', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search patterns...');
    await expect(searchInput).toHaveAttribute('aria-label', 'Search patterns');
  });

  test('can type in search input and dropdown appears with results', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const results = dropdown.locator('a[href*="/patterns/"]');
    await expect(results.first()).toBeVisible();
  });

  test('clicking a search result navigates to correct pattern page', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active partner');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const activePartnerLink = dropdown.locator('a[href="/patterns/active-partner/"]');
    await expect(activePartnerLink).toBeVisible();
    await activePartnerLink.click();

    await expect(page).toHaveURL('/patterns/active-partner/');
    await expect(page.locator('h1')).toContainText('Active Partner');
  });

  test('search returns relevant results and is case-insensitive', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('ACTIVE');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const activePartnerLink = dropdown.locator('a[href="/patterns/active-partner/"]');
    await expect(activePartnerLink).toBeVisible();
  });

  test('no results found message appears for nonsense query', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('xyzabc123nonexistent');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const noResults = dropdown.locator('text=No results found');
    await expect(noResults).toBeVisible();
  });

  test('dropdown closes when clicking outside', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await page.locator('h1').click();
    await expect(dropdown).not.toBeVisible();
  });

  test('can navigate search results with arrow keys', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await searchInput.press('ArrowDown');
    const selectedResult = dropdown.locator('[class*="resultItemSelected"]');
    await expect(selectedResult).toBeVisible();

    await searchInput.press('ArrowDown');
    const selectedResults = dropdown.locator('[class*="resultItemSelected"]');
    await expect(selectedResults).toHaveCount(1);
  });

  test('enter key navigates to selected result', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active partner');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await searchInput.press('ArrowDown');
    const selectedResult = dropdown.locator('[class*="resultItemSelected"]');
    await expect(selectedResult).toBeVisible();

    await searchInput.press('Enter');
    await expect(page).toHaveURL(/\/patterns\/.*\//);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('escape key closes dropdown and clears search', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('active');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    await searchInput.press('Escape');
    await expect(dropdown).not.toBeVisible();
    await expect(searchInput).toHaveValue('');
  });

  test('search displays results grouped by category', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[role="search"]');
    await searchInput.fill('bias');

    const dropdown = page.locator('[class*="dropdown"]');
    await expect(dropdown).toBeVisible();

    const categoryGroups = dropdown.locator('[class*="categoryGroup"]');
    await expect(categoryGroups.first()).toBeVisible();

    const categoryLabel = dropdown.locator('[class*="categoryLabel"]');
    await expect(categoryLabel.first()).toBeVisible();
  });
});
