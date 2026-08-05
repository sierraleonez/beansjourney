import { defineConfig } from '@playwright/test';

const PORT = 8010;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
    testDir: './e2e',
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    reporter: 'list',

    use: {
        baseURL,
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'bash e2e/serve.sh',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
