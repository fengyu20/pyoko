const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.spec.js',
  testIgnore: '**/private/**',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    serviceWorkers: 'block',
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: ['**/private/**', /\.webkit\.e2e\.spec\.js/],
      use: { browserName: 'chromium' },
    },
    {
      name: 'webkit-mobile',
      testMatch: /\.webkit\.e2e\.spec\.js/,
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 4173',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
