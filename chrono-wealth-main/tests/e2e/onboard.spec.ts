import { test, expect } from '@playwright/test'

test('sign-up → plaid connect → dashboard loads', async ({ page }) => {
  await page.goto('https://flowsightfi.com')
  await page.click('text=Get Started')
  // … rest of flow …
  await expect(page.locator('text=Liquidity Runway')).toBeVisible()
})
