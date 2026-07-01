# What can be configured

Full list of configurable options: where they are set, what values they accept, and **how to change them** (environment variables or config file).

**Principle:** Browser options (e.g. `launchOptions`) are based on [Playwright’s official documentation](https://playwright.dev/docs/test-configuration). We do not use undocumented arguments or “workarounds” – we document limitations instead of trying random flags. See also `docs/TEST_STRATEGY.md` → “Sources of truth”.

**Path aliases (tsconfig.json):** In tests and code we use aliases instead of relative `../`: `@fixtures/pages`, `@pages/HomePage`, `@pages/components/OverlayHelper`, `@testdata/registration`, `@utils/testData`. Playwright resolves them via `tsconfig.json` → `compilerOptions.paths`.

---

## Where things are set

| Source | Description |
|--------|-------------|
| **`playwright.config.ts`** | Test directory, reporter, projects (browsers), part of `use` (e.g. viewport). Values from `run.*` come from `testRunConfig`. |
| **`src/config/testRunConfig.ts`** | Logic for choosing config: profiles (local/ci), env (default/local/staging/prod), reading env vars and overrides. |
| **Environment variables** | Override defaults from `testRunConfig` (e.g. `BASE_URL`, `PW_RETRIES`). |

---

## Options from `testRunConfig` (controlled by env vars)

### Environment and site URL

| Option | Env variable | Values / default | How to set |
|--------|--------------|-------------------|------------|
| **Environment (env)** | `TEST_ENV` | `default`, `local`, `staging`, `prod`. Default: `default`. | `$env:TEST_ENV="local"` (PowerShell) |
| **Run profile** | `RUN_PROFILE` | `local`, `ci`. When `CI=true`, `ci` is used anyway. | `$env:RUN_PROFILE="ci"` |
| **Base URL** | `BASE_URL` | Any URL. Default from chosen env (e.g. `https://automationexercise.com` for `default`). | `$env:BASE_URL="https://example.com"` |

### Browser

| Option | Env variable | Values / default | How to set |
|--------|--------------|-------------------|------------|
| **Headless** | `HEADLESS` | `true` / `1` = no window, `false` / `0` = with window. Unset = Playwright default. | `$env:HEADLESS="false"` or `npx playwright test --headed` |

### Retries and parallelism

| Option | Env variable | Values / default | How to set |
|--------|--------------|-------------------|------------|
| **Retries** | `PW_RETRIES` or `RETRIES` | Integer. In this project: **0** (local and ci) – we do not rerun a test after failure. | `$env:PW_RETRIES="2"` – enables 2 retries (if you want them). |
| **Workers** | `PW_WORKERS` or `WORKERS` | Parallel test processes (global for the run). **Local: 1**. **CI: 4**. | `$env:PW_WORKERS="4"` or `npx playwright test --workers=4` |
| **Browsers (projects)** | `PW_PROJECTS` or `BROWSERS` | Comma-separated: `chromium`, `firefox`, `webkit`. **Local default: `chromium`**. **CI default: all three**. CLI `--project` overrides profile/env for that run. | `$env:PW_PROJECTS="chromium,firefox"` or `npx playwright test --project=firefox` |

**Priority (browsers):** `--project` (CLI) → `PW_PROJECTS` / `BROWSERS` (env) → profile default in `testRunConfig.ts`.

**Note:** Playwright does not support different `workers` per browser in one command. Max parallelism ≈ `workers × active browsers`. To run one browser sequentially: profile `local` (workers `1`, chromium only) or `--project=chromium --workers=1`.

### Which tests to run

| Option | Env variable | Values / default | How to set |
|--------|--------------|-------------------|------------|
| **Grep (include)** | `PW_GREP` | Regex string. E.g. `@smoke` runs tests with tag `@smoke`. | `$env:PW_GREP="@smoke"` or `npx playwright test --grep "@smoke"` |
| **Grep invert (exclude)** | `PW_GREP_INVERT` | Regex. Tests **not** matching are run. | `$env:PW_GREP_INVERT="@flaky"` or `npx playwright test --grep-invert "@flaky"` |

### Trace and screenshot (in `testRunConfig` / profiles)

- **Trace**: local = `on-first-retry`, ci = `retain-on-failure` (trace saved on failure). Not overridable by env – only in code in `src/config/testRunConfig.ts` (profiles).
- **Screenshot**: `only-on-failure` – screenshot on failure. Also only in code (profiles).

---

## Options only in `playwright.config.ts`

These are set **only in** `playwright.config.ts` (no env vars for them in this project):

| Option | Current value | Meaning |
|--------|----------------|---------|
| **viewport** | `null` | Viewport matches window. Projects are defined **without** `devices` (only `browserName`, `viewport: null`, `launchOptions`) to avoid conflict of `deviceScaleFactor` with `viewport: null`. |
| **launchOptions** | Chromium only | **Chromium:** `args: ['--start-maximized']` – window starts maximized. **Firefox and WebKit:** no `launchOptions` – these browsers do not support window size/maximization args in Playwright; they use default window size. |
| **testDir** | `./src/tests` | Directory containing test files. |
| **fullyParallel** | `true` | Tests in one file can run in parallel. |
| **actionTimeout** | `15000` | Max time for a single action (click, fill, etc.). |
| **navigationTimeout** | `20000` | Max time for navigation. |
| **expect.timeout** | `10000` | Default timeout for assertions; override per test if needed. |
| **reporter** | `[['html', { open: 'never' }]]` | HTML report, no auto-open. |
| **projects** | from `run.browsers` | Active browsers (`chromium`, `firefox`, `webkit`). Defined in `browserProjects` map; filtered by `testRunConfig`. |

---

## Quick reference: env vars (PowerShell)

```powershell
$env:TEST_ENV="local"
$env:BASE_URL="https://my-site.test"
$env:HEADLESS="false"
$env:PW_RETRIES="0"
$env:PW_WORKERS="4"
$env:PW_GREP="@smoke"
$env:PW_GREP_INVERT="@flaky"
npm run test
```

---

## Changing default values permanently

- **Retries, workers, browsers, trace, screenshot** – edit the `profiles` object in **`src/config/testRunConfig.ts`** (e.g. change `ci.workers` or `local.browsers`).
- **Viewport, reporter, projects** – edit **`playwright.config.ts`**.
- **Base URL per env (default, local, …)** – edit the `envs` object in **`src/config/testRunConfig.ts`**.

---

## Other options (good to know)

### Test timeout

- **Default**: 30 s per test (Playwright).
- **Where to change**: in `playwright.config.ts` – add `timeout: 60_000` (ms). Or in a single test: `test.setTimeout(60_000)` at the start of the callback.
- No env variable in this project – only in config or in the test.

### forbidOnly (CI)

- In **`playwright.config.ts`**: `forbidOnly: !!process.env.CI` – when running in CI, leaving `test.only()` will cause a failure (tests will not skip the rest). Edit only in file.

### Blocking requests (ads)

- In **`src/fixtures/pages.ts`** there is an **`adPattern`** regex – URLs matching it are blocked (fewer overlays on the page).
- Default patterns: `doubleclick`, `googlesyndication`, `googleadservices`, `adsbygoogle`, `adservice`, `facebook.com/tr`.
- **How to change**: edit `adPattern` in `src/fixtures/pages.ts` (add/remove domains).

### Default base URL per environment (TEST_ENV)

| `TEST_ENV` value | Default base URL (when `BASE_URL` is not set) |
|------------------|-----------------------------------------------|
| `default` | `https://automationexercise.com` |
| `local` | `http://localhost:3000` |
| `staging` | `https://staging.example.com` |
| `prod` | `https://example.com` |

Edit: **`envs`** object in **`src/config/testRunConfig.ts`**.

### ESLint

- **Config**: `eslint.config.js` (flat config). Used: `@eslint/js` (recommended), `typescript-eslint` (TypeScript), `eslint-plugin-playwright` (only for files in `src/tests/**` and `**/*.spec.ts`).
- **Run**: `npm run lint` (lints `src/`). Playwright rules discourage conditionals in tests (`no-conditional-in-test`), require assertions (`expect-expect`), etc. Rule list: [eslint-plugin-playwright](https://github.com/mskelton/eslint-plugin-playwright#rules).
- **Changing rules**: edit `eslint.config.js` (e.g. disable a rule in the `rules` block).

### npm scripts (`package.json`)

| Script | Equivalent / description |
|--------|---------------------------|
| `npm run test` | `playwright test` |
| `npm run test:headed` | With visible browser |
| `npm run test:ui` | Playwright UI mode |
| `npm run test:debug` | Debug mode |
| `npm run test:chromium` / `test:firefox` / `test:webkit` | Single browser only |
| `npm run report` | Opens last HTML report |
| `npm run lint` | ESLint on `src/` (TypeScript + Playwright rules for tests) |
| `npm run typecheck` | TypeScript type check without emitting (`tsc --noEmit`); recommended by Playwright docs because the runner does not type-check. |

New scripts or changes to existing ones: edit **`scripts`** in **`package.json`**.
