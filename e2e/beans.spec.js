import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test('verified user can add a new bean to the catalog', async ({ page }) => {
    await login(page);
    await page.goto('/beans/new');

    const beanName = `E2E Test Bean ${Date.now()}`;

    await page.getByLabel('Roastery').fill('E2E Seed Roastery');
    await page.getByRole('option', { name: 'E2E Seed Roastery' }).click();
    await page.getByLabel('Nama bean').fill(beanName);
    await page.getByRole('button', { name: 'Tambahkan Bean ke Katalog' }).click();

    await page.waitForURL(/\/beans\/\d+/);
    await expect(page.getByRole('heading', { name: beanName })).toBeVisible();
});
