import { test, expect } from '@playwright/test';
import { login, gotoSeedBean } from './helpers.js';

test('verified user can write a review for a bean', async ({ page }) => {
    await login(page);
    await gotoSeedBean(page);

    await page.getByRole('tab', { name: /Ulasan/ }).click();

    const body = `Rasanya enak, ada nuansa cokelat dan karamel — pengujian e2e ${Date.now()}.`;
    await page.getByLabel('Ulasanmu').fill(body);
    await page.getByRole('button', { name: 'Kirim Ulasan' }).click();

    await expect(page.getByText(body)).toBeVisible();
});
