import { test, expect } from '@playwright/test';
import { E2E_USER, login } from './helpers.js';

test('user can log in and reach Discover', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: /pencinta kopi/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tambahkan Bean' })).toBeVisible();
});

test('a new user can register and lands on Discover, but hits the verification gate on write actions', async ({ page }) => {
    const email = `e2e-${Date.now()}@beansjourney.test`;

    await page.goto('/register');
    await page.getByLabel('Nama').fill('Pengguna Baru');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Kata Sandi', { exact: true }).fill('password123');
    await page.getByLabel('Konfirmasi Kata Sandi').fill('password123');
    await page.getByRole('button', { name: 'Buat Akun' }).click();

    await page.waitForURL('/');
    await expect(page.getByRole('heading', { name: /pencinta kopi/i })).toBeVisible();

    // Unverified accounts get redirected to the email verification prompt on gated routes.
    await page.goto('/beans/new');
    await expect(page.getByRole('heading', { name: /periksa kotak masukmu/i })).toBeVisible();
});

test('wrong password is rejected', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(E2E_USER.email);
    await page.getByLabel('Kata Sandi', { exact: true }).fill('salah-sandi');
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/login/);
});
