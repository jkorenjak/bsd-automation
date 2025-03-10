import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './tests',
    outputDir: '.test-results',
    timeout: 30000,
    reporter: [
        ['html', {outputFolder: 'playwright-report'}],
        ['list']
    ],
    workers: 1,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        extraHTTPHeaders: {
            'Accept': 'application/json',
        },
    },
};

export default config;
