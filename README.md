# Automation Exercises – Playwright + TypeScript

Template project for E2E automation tests with **Playwright** and **TypeScript**. Can be used to test any website (default: [Automation Exercise](https://automationexercise.com)).

## Requirements

- Node.js 18+
- npm

## Installation

```bash
npm install
npx playwright install
```

Optional (system browsers only):

```bash
npx playwright install --with-deps
```

## Running tests

Common commands:

| Command | Description |
|---------|-------------|
| `npm run test` | All tests (all browsers) |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open HTML report |

Other scenarios (single test, tags like `@smoke`, `--grep`, `--project`, `--workers`, `TEST_ENV`/`RUN_PROFILE`) are described in `docs/RUNNING_TESTS.md`.

## Test scope (automationexercise.com)

- Strategy: `docs/TEST_STRATEGY.md`
- Coverage plan: `docs/TEST_PLAN.md`

## Project structure

```
├── .github/workflows/      # GitHub Actions (CI)
├── docs/                   # Project documentation
│   ├── CONFIGURATION.md    # What can be configured and how
│   ├── PROJECT_STATUS.md   # Status: done / to do
│   └── RUNNING_TESTS.md    # Running tests
├── src/
│   ├── config/            # Run config (env, profile, env vars)
│   ├── fixtures/           # Fixtures (e.g. page objects injected into tests)
│   ├── pages/              # Page Object Model (BasePage, HomePage, …)
│   └── tests/              # Test files (*.spec.ts)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Configuration

- **Full list of configurable options** (retries, workers, headless, base URL, grep, viewport, etc.) and **how to change them** – **`docs/CONFIGURATION.md`**.
- **Base URL**: default `https://automationexercise.com`. Override with `BASE_URL` env var.
- **Controlling runs**: `TEST_ENV`, `RUN_PROFILE`, `PW_GREP` and others – see `docs/RUNNING_TESTS.md` and `docs/CONFIGURATION.md`.
- **Browsers**: `playwright.config.ts` defines projects for Chromium, Firefox and WebKit (Desktop).
- **CI**: workflow in `.github/workflows/playwright.yml` runs tests on push/PR to `main` or `master` and saves the report as an artifact.

## Documentation and progress

- **README.md** (this file) – project overview and how to use it.
- **docs/CONFIGURATION.md** – what can be configured and how (env vars, config files).
- **docs/PROJECT_STATUS.md** – current status (done / to do). **Update it after larger code changes** so progress is tracked across sessions.
- **docs/GITHUB_PAGES.md** – GitHub Pages is not configured by default; this doc explains how to enable it if you want to publish docs or reports.

## License

MIT
