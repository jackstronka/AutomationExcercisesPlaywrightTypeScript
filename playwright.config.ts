import { defineConfig, type Project } from '@playwright/test';
import { resolveRunConfig, type BrowserProject } from './src/config/testRunConfig';

const run = resolveRunConfig(process.env, process.argv);

// Only Chromium supports --start-maximized. Firefox and WebKit do not support
// window maximization/size in launch args – they work correctly without extra args.
const browserProjects: Record<BrowserProject, Project> = {
  chromium: {
    name: 'chromium',
    use: {
      browserName: 'chromium',
      viewport: null,
      launchOptions: { args: ['--start-maximized'] },
    },
  },
  firefox: {
    name: 'firefox',
    use: {
      browserName: 'firefox',
      viewport: null,
    },
  },
  webkit: {
    name: 'webkit',
    use: {
      browserName: 'webkit',
      viewport: null,
    },
  },
};

export default defineConfig({
  testDir: './src/tests',
  timeout: 60_000,
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
    // Force English UI so the site (cookie consent) renders in English and Chrome does not
    // show a native "translate this page" bar (browser UI, not clickable via locators).
    locale: 'en-US',
    trace: run.trace,
    screenshot: run.screenshot,
    actionTimeout: 15000,
    navigationTimeout: 20000,
  },
  expect: { timeout: 10000 },
  projects: run.browsers.map((browser) => browserProjects[browser]),
});
