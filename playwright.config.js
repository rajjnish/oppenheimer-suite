// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    testDir: './tests',
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],
    /* Shared settings for all the projects */
    use: {
        baseURL: 'http://localhost:9997',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: 'test-results/'
});