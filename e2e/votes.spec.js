import { test, expect } from '@playwright/test';
import { login, gotoSeedBean } from './helpers.js';

test('verified user can upvote a review and a recipe', async ({ page }) => {
    await login(page);
    await gotoSeedBean(page);

    // Write a fresh review, then upvote it — self-contained, doesn't depend on other specs.
    await page.getByRole('tab', { name: /Ulasan/ }).click();
    await page.getByLabel('Ulasanmu').fill(`Ulasan untuk pengujian tombol dukungan — ${Date.now()}.`);
    await page.getByRole('button', { name: 'Kirim Ulasan' }).click();

    const reviewVote = page.getByRole('button', { name: 'Dukung' }).first();
    await expect(reviewVote).toBeVisible();
    await reviewVote.click();
    await expect(page.getByRole('button', { name: 'Batalkan dukungan' }).first()).toBeVisible();

    // Same for a fresh recipe. Submitting redirects to the recipe's own thread
    // page (a single, unambiguous vote button) — wait for it explicitly so we
    // don't race the still-mounted recipes-list page from before the submit.
    await page.getByRole('tab', { name: /Resep/ }).click();
    await page.getByLabel('Dosis / rasio').fill('1:16');
    await page.getByRole('button', { name: 'Bagikan Resep' }).click();
    await page.waitForURL(/\/recipes\/\d+/);

    const recipeVote = page.getByRole('button', { name: 'Dukung' });
    await expect(recipeVote).toBeVisible();
    await recipeVote.click();
    await expect(page.getByRole('button', { name: 'Batalkan dukungan' })).toBeVisible();
});
