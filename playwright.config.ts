import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './tests',
    timeout: 30000,
    reporter: 'html',
    workers: 1,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        extraHTTPHeaders: {
            'Accept': 'application/json',
        },
    },
};

export default config;
