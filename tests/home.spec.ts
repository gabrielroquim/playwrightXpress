import { test } from '@playwright/test';

test('dweb app deve estar online', async ({ page }) => {
  await page.goto('http://localhost:8080');     
});

