import { test } from '@playwright/test';

test('app deve estar online', async ({ page }) => {
  await page.goto('http://localhost:8080');     
});

