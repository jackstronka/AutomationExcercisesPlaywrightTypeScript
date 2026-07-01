# Running and managing test runs

Run configuration is controlled by:

- `playwright.config.ts` – Playwright Test config
- `src/config/testRunConfig.ts` – central, typed run config (env/profile) and env var handling

**Full list of what can be configured (retries, workers, headless, viewport, grep, etc.) and how to change it** – **`docs/CONFIGURATION.md`**.

## Quick start

```bash
npm install
npx playwright install
npm run test
```

## Central config file (`src/config/testRunConfig.ts`)

Configuration is chosen based on environment variables:

- `TEST_ENV`: `default | local | staging | prod`
- `RUN_PROFILE`: `local | ci`
- `BASE_URL`: overrides `baseURL` from `TEST_ENV`
- `HEADLESS`: `true` / `false` or `1` / `0` (optional) – whether the browser runs in the background (headless) or with a window (GUI). See “Headless vs GUI” below.
- `PW_WORKERS` (or `WORKERS`): number of workers (processes) per project
- `PW_RETRIES` (or `RETRIES`): number of retries
- `PW_GREP`: regex to run only matching tests (e.g. `@smoke`)
- `PW_GREP_INVERT`: regex to exclude tests

> By default, when `CI=true`, the profile switches to `ci`.

## Retries disabled – when a test fails, find the cause

Retries are set to **0** (including in CI). If a test fails, we do not rerun it – **find out what went wrong** and fix it. After a failure:

- **HTML report**: `npm run report` – test list, stack trace, screenshot and trace (step by step).
- **Screenshot**: on failure, saved in `test-results/` and in the report.
- **Trace**: in CI on failure a trace is saved (`retain-on-failure`), to replay in Playwright Trace Viewer.
- **Locally with window**: `npx playwright test --headed` or `npx playwright test --debug` – you’ll see at which step and page state the test failed.

## Headless vs GUI (browser window)

- **Headless (no GUI)** – default: `npx playwright test`. Browser runs in the background, no window.
- **Headed (GUI)** – visible browser window:
  - from command line: **`npx playwright test --headed`** (overrides config);
  - env var: `HEADLESS=false` or `HEADLESS=0`, then `npm run test`.

## Examples (PowerShell)

### Running one or a few tests

#### Single test file

```powershell
npx playwright test src/tests/example.spec.ts
```

#### Single test by line number

```powershell
npx playwright test src/tests/example.spec.ts:4
```

#### By test name (grep)

```powershell
npx playwright test --grep "has signup/login link"
```

#### Two or more tests (regex)

```powershell
npx playwright test --grep "(login link|other test name)"
```

#### Changing environment / baseURL

```powershell
$env:TEST_ENV="local"
npm run test
```

```powershell
$env:BASE_URL="https://example.com"
npm run test
```

#### Running only selected tests (grep)

```powershell
$env:PW_GREP="@smoke"
npm run test
```

## Tagging tests (e.g. @smoke)

Using the built-in `tag` is recommended:

```ts
test('user can login', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
  // ...
});
```

Run only tests with a tag:

```powershell
npx playwright test --grep "@smoke"
```

Exclude a tag:

```powershell
npx playwright test --grep-invert "@flaky"
```

### Running on a specific project (browser)

```powershell
npx playwright test --project=chromium
```

### Parallelism / workers

```powershell
npx playwright test --workers=4
```

Or via env var:

```powershell
$env:PW_WORKERS="4"
npm run test
```

## How parallelism works in Playwright

- **Workers** are separate **Node.js processes** running tests in parallel.
- In this repo tests run on **3 projects (browsers)**: `chromium`, `firefox`, `webkit`.
- `workers` is the limit **per project**, so total parallelism in a run is roughly:
  - workers × number_of_projects

Example: `PW_WORKERS=2` and 3 browsers → up to ~6 parallel test processes.

## Limiting parallelism when tests are “stateful”

- **Entire run**: `--workers=1` (serial)
- **Selected tests/suites**: set serial mode in that `describe`:

```ts
test.describe.configure({ mode: 'serial' });
```

## Common ways to “manage runs”

## Speed and performance

- **CI**: profile uses **4 workers** per project for faster runs; override with `PW_WORKERS` if needed.
- **Quick local run**: `npx playwright test --project=chromium` (one browser only).
- **Subset**: `--grep "@smoke"` or a single spec file to shorten feedback.
- **Navigation**: tests use `waitUntil: 'domcontentloaded'` where possible (faster than `load`).
- **Global timeouts**: `actionTimeout` 15s, `expect` 10s in config; override in a test only when necessary.
- **Startup**: use `goToHomeReady(page, homePage)` from `@utils/testHelpers` at test start instead of repeating goto + dismissOverlays + expectLoaded.

## Common ways to "manage runs"

- **Selection**: `--project`, `--grep`, `--grep-invert`, `--list`
- **Parallelism**: `--workers`, `fullyParallel: true` (in config)
- **Stability in CI**: `retries` and `trace: on-first-retry` (in `ci` profile)
- **Reporting**: HTML reporter (artifact in GitHub Actions)
