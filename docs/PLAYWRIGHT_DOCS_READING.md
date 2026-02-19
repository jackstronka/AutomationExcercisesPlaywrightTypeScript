# Playwright and TypeScript official docs – what to read

Below are links to **official** Playwright documentation. Reading in this order gives a solid base instead of guessing.

---

## Main entry

| Page | URL | Purpose |
|------|-----|---------|
| **Intro / installation** | https://playwright.dev/docs/intro | Where to start, what’s in the project, `npx playwright test`, HTML report, UI mode. |

---

## TypeScript

| Page | URL | Purpose |
|------|-----|---------|
| **TypeScript** | https://playwright.dev/docs/test-typescript | How Playwright handles TS (transform without type-check), `tsconfig.json`, path mapping, optional manual compile. **Important:** officially recommended to run `npx tsc --noEmit` alongside tests (e.g. in CI), because Playwright does not type-check. |

---

## Writing tests

| Page | URL | Purpose |
|------|-----|---------|
| **Writing tests** | https://playwright.dev/docs/writing-tests | First test, actions (goto, click, fill…), assertions (expect), test isolation, hooks (`beforeEach`, `describe`). |
| **Locators** | https://playwright.dev/docs/locators | **Key.** Recommended locators: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`, `getByTestId` etc. Prefer roles and text over `page.locator('.class')`. Auto-waiting and retry. |
| **Test assertions** | https://playwright.dev/docs/test-assertions | `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveValue()` etc. Web-first assertions with auto-wait. |
| **Test fixtures** | https://playwright.dev/docs/test-fixtures | Where `{ page }` comes from, built-in fixtures (`page`, `context`, `browser`). Custom fixtures via `test.extend()`, POM in fixtures, worker-scoped, override `page`. |

---

## Configuration and running

| Page | URL | Purpose |
|------|-----|---------|
| **Configuration** | https://playwright.dev/docs/test-configuration | `playwright.config.ts`: `testDir`, `projects`, `use` (baseURL, trace), `retries`, `workers`, `timeout`, `expect`, test filtering. **Source of truth for config** (per `TEST_STRATEGY.md`). |
| **Running tests** | https://playwright.dev/docs/running-tests | Filtering (grep, project), headed, single file, sharding, retries. |
| **API: TestConfig** | https://playwright.dev/docs/api/class-testconfig | Full list of config options. |
| **API: BrowserType.launch** | https://playwright.dev/docs/api/class-browsertype#browser-type-launch | Browser launch options – **check here what is officially supported** (e.g. `args` for a given browser). |

---

## Optional (when needed)

| Page | URL | Purpose |
|------|-----|---------|
| **Page Object Model** | https://playwright.dev/docs/pom | Official POM pattern in Playwright. |
| **Trace Viewer** | https://playwright.dev/docs/trace-viewer-intro | Analysing failures, steps, network, snapshot. |
| **Codegen** | https://playwright.dev/docs/codegen-intro | Generating tests from the browser. |
| **CI (GitHub Actions)** | https://playwright.dev/docs/ci-intro | Running tests in CI. |

---

## TypeScript (language) – separate docs

| Page | URL | Purpose |
|------|-----|---------|
| **TypeScript Handbook** | https://www.typescriptlang.org/docs/handbook/intro.html | Types, interfaces, generics – when you want to go deeper in TS, not just “tests in .ts”. |

---

**Summary:** Start with **Intro** and **Writing tests**, then **Locators** and **Test fixtures**. Always verify configuration in **Configuration** and the API (TestConfig, BrowserType.launch), so you don’t rely on undocumented flags – in line with the principles in `docs/TEST_STRATEGY.md`.
