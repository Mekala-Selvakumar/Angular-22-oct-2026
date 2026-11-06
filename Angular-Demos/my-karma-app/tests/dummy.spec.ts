import { test, expect } from '@playwright/test';

test('basic configuration test', async ({ page }) => {
  await page.goto('https://angular.dev');
  await expect(page).toHaveTitle(/Angular/);
});
