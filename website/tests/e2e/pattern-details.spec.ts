import { test, expect } from '@playwright/test';

test.describe('Pattern Details', () => {
  test.describe('Pattern Detail Page - Active Partner', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/patterns/active-partner/');
    });

    test('should load pattern detail page correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should display pattern title', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Active Partner');
    });

    test('should display pattern emoji if present', async ({ page }) => {
      const titleWrapper = page.locator('div').filter({ has: page.locator('h1') }).first();
      await expect(titleWrapper).toBeVisible();
    });

    test('should display category badge', async ({ page }) => {
      const categoryBadge = page.locator('span').filter({ hasText: 'Pattern' });
      await expect(categoryBadge).toBeVisible();
    });

    test('should display markdown content', async ({ page }) => {
      const article = page.locator('article');
      await expect(article).toBeVisible();
    });

    test('should render markdown headings correctly', async ({ page }) => {
      await expect(page.locator('h2').filter({ hasText: 'Problem' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Pattern' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Example' })).toBeVisible();
    });

    test('should render markdown paragraphs', async ({ page }) => {
      const article = page.locator('article');
      const paragraphs = article.locator('p');
      const count = await paragraphs.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should render code blocks if present', async ({ page }) => {
      const codeBlock = page.locator('pre');
      await expect(codeBlock).toBeVisible();
    });

    test('should display back button', async ({ page }) => {
      const backLink = page.locator('a').filter({ hasText: 'Back to Patterns' });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/patterns/');
    });

    test('should navigate back to patterns list when clicking back button', async ({ page }) => {
      await page.locator('a').filter({ hasText: 'Back to Patterns' }).click();
      await expect(page).toHaveURL('/patterns/');
      await expect(page.locator('h1')).toContainText('Patterns');
    });

    test('should render list items correctly', async ({ page }) => {
      const article = page.locator('article');
      const listItems = article.locator('li');
      const count = await listItems.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Anti-Pattern Detail Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/anti-patterns/');
      const firstAntiPattern = page.locator('a[href^="/anti-patterns/"]').first();
      await firstAntiPattern.click();
    });

    test('should load anti-pattern detail page correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should display category badge for anti-pattern', async ({ page }) => {
      const categoryBadge = page.locator('span').filter({ hasText: 'Anti-Pattern' });
      await expect(categoryBadge).toBeVisible();
    });

    test('should display markdown content', async ({ page }) => {
      const article = page.locator('article');
      await expect(article).toBeVisible();
    });

    test('should display back button to anti-patterns list', async ({ page }) => {
      const backLink = page.locator('a').filter({ hasText: 'Back to Anti-Patterns' });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/anti-patterns/');
    });

    test('should navigate back to anti-patterns list', async ({ page }) => {
      await page.locator('a').filter({ hasText: 'Back to Anti-Patterns' }).click();
      await expect(page).toHaveURL('/anti-patterns/');
      await expect(page.locator('h1')).toContainText('Anti-Patterns');
    });
  });

  test.describe('Obstacle Detail Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/obstacles/');
      const firstObstacle = page.locator('a[href^="/obstacles/"]').first();
      await firstObstacle.click();
    });

    test('should load obstacle detail page correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/Augmented Coding Patterns/);
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should display category badge for obstacle', async ({ page }) => {
      const categoryBadge = page.locator('span').filter({ hasText: 'Obstacle' });
      await expect(categoryBadge).toBeVisible();
    });

    test('should display markdown content', async ({ page }) => {
      const article = page.locator('article');
      await expect(article).toBeVisible();
    });

    test('should display back button to obstacles list', async ({ page }) => {
      const backLink = page.locator('a').filter({ hasText: 'Back to Obstacles' });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/obstacles/');
    });

    test('should navigate back to obstacles list', async ({ page }) => {
      await page.locator('a').filter({ hasText: 'Back to Obstacles' }).click();
      await expect(page).toHaveURL('/obstacles/');
      await expect(page.locator('h1')).toContainText('Obstacles');
    });
  });

  test.describe('Pattern Navigation Flow', () => {
    test('should navigate from home to pattern detail and back', async ({ page }) => {
      await page.goto('/');
      await page.locator('a[href="/patterns/"]').click();
      await expect(page).toHaveURL('/patterns/');

      const firstPattern = page.locator('a[href^="/patterns/"]').first();
      await firstPattern.click();

      await expect(page.locator('a').filter({ hasText: 'Back to Patterns' })).toBeVisible();

      await page.locator('a').filter({ hasText: 'Back to Patterns' }).click();
      await expect(page).toHaveURL('/patterns/');
    });
  });
});
