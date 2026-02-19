import { defineConfig, devices } from '@playwright/test';
import { resolveRunConfig } from './src/config/testRunConfig';

const run = resolveRunConfig(process.env);

// Only Chromium supports --start-maximized. Firefox and WebKit do not support
// window maximization/size in launch args – they work correctly without extra args.
export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: run.retries,
  workers: run.workers,
  reporter: [['html', { open: 'never' }]],
  grep: run.grep,
  grepInvert: run.grepInvert,
  use: {
    baseURL: run.baseURL,
    headless: run.headless,
    trace: run.trace,
    screenshot: run.screenshot,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: null,
        launchOptions: { args: ['--start-maximized'] },
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: null,
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: null,
      },
    },
  ],
});
