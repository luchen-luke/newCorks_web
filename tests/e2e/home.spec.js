const { test, expect } = require('@playwright/test')

test('home page shows Corks', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/Corks|Corks —/)
})
