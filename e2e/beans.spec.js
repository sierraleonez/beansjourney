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

test('roastery detail fields only show up for a brand-new roastery name', async ({ page }) => {
    await login(page);
    await page.goto('/beans/new');

    await expect(page.getByLabel('Lokasi')).not.toBeVisible();

    // Picking an existing roastery from the dropdown keeps the detail fields hidden.
    await page.getByLabel('Roastery').fill('E2E Seed Roastery');
    await page.getByRole('option', { name: 'E2E Seed Roastery' }).click();
    await expect(page.getByLabel('Lokasi')).not.toBeVisible();

    // Typing a name that matches an existing roastery case-insensitively also hides them.
    await page.getByLabel('Roastery').fill('e2e seed roastery');
    await page.getByLabel('Roastery').blur();
    await expect(page.getByLabel('Lokasi')).not.toBeVisible();

    // A genuinely new name reveals the detail fields.
    await page.getByLabel('Roastery').fill(`Brand New Roastery ${Date.now()}`);
    await page.getByLabel('Roastery').blur();
    await expect(page.getByLabel('Lokasi')).toBeVisible();
});
