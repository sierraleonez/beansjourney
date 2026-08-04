import { test, expect } from '@playwright/test';
import { login, gotoSeedBean } from './helpers.js';

test('verified user can share a recipe for a bean', async ({ page }) => {
    await login(page);
    await gotoSeedBean(page);

    await page.getByRole('tab', { name: /Resep/ }).click();

    await page.getByLabel('Dosis / rasio').fill('1:15');
    await page.getByLabel('Suhu air').fill('92');
    await page.getByRole('button', { name: 'Bagikan Resep' }).click();

    // Submitting redirects to the recipe's own thread page.
    await page.waitForURL(/\/recipes\/\d+/);
    await expect(page.getByText('Dosis 1:15')).toBeVisible();
    // Water temp pill text is "92" or "Suhu 92°C" depending on label copy — match loosely.
    await expect(page.getByText('92', { exact: false })).toBeVisible();
});
