export const E2E_USER = {
    email: 'e2e@beansjourney.test',
    password: 'password',
};

export async function login(page, { email = E2E_USER.email, password = E2E_USER.password } = {}) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Kata Sandi', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Masuk' }).click();
    await page.waitForURL('/');
}

/** Navigates to the fixed E2ESeeder bean via Discover search, so tests never hardcode an id. */
export async function gotoSeedBean(page) {
    await page.goto('/?q=E2E+Seed+Bean');
    await page.getByRole('link', { name: /E2E Seed Bean/ }).first().click();
    await page.waitForURL(/\/beans\/\d+/);
}
