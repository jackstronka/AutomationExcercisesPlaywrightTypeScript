# E2E test strategy – automationexercise.com

Goal: a stable, cross-browser E2E test suite in Playwright + TypeScript, usable as a template for other sites.

## Sources of truth (no trial and error)

- **Browser configuration and options** are based **only on Playwright’s official documentation**. We do not add launch arguments or settings “by feel” or copy them from Chromium to Firefox/WebKit.
- **When something is not supported** (e.g. window maximization in Firefox/WebKit), **we document that limitation** in `docs/CONFIGURATION.md` and do not add workarounds that may break runs (e.g. undocumented flags).
- **Official docs:** [Playwright – Configuration](https://playwright.dev/docs/test-configuration), [BrowserType.launch](https://playwright.dev/docs/api/class-browsertype#browser-type-launch). Changes to `playwright.config.ts` and `launchOptions` – verify against these sources.

## Rules from Playwright’s official docs

The following points are taken directly from [Writing tests](https://playwright.dev/docs/writing-tests), [Locators](https://playwright.dev/docs/locators), [Test assertions](https://playwright.dev/docs/test-assertions), [Test fixtures](https://playwright.dev/docs/test-fixtures), [POM](https://playwright.dev/docs/pom) and [TypeScript](https://playwright.dev/docs/test-typescript). We apply them together with the project principles above.

- **Locators:** Docs recommend **user-facing** and explicit contracts first: `getByRole`, then `getByLabel`, `getByText`, `getByPlaceholder`, `getByAltText`, `getByTitle`; `getByTestId` only when needed. Avoid long CSS/XPath chains – they are brittle when the DOM changes. The same locator can be used multiple times (e.g. hover, then click) – on each action the element is resolved again.
- **Assertions:** Prefer **auto-retrying** (e.g. `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveValue()`) – they wait until the condition is met. **Non-retrying** assertions (e.g. `expect(value).toBeTruthy()`) do not wait – on async content they lead to flaky tests. For complex cases use `expect.poll()` or `expect().toPass()`. Use **Playwright’s** `expect` from `@playwright/test`, not Jest’s.
- **TypeScript:** Playwright **does not type-check** – it only transpiles. Officially recommended: run `npx tsc --noEmit` alongside tests (e.g. in CI or before `npm run test`) to catch type errors. See `docs/PLAYWRIGHT_DOCS_READING.md`. In this project: `npm run typecheck` (`tsc --noEmit`).
- **Fixtures:** Use fixtures for setup/teardown instead of only `beforeEach`/`afterEach`; custom fixtures via `test.extend()` (e.g. POM with automatic `goto()`). Built-in: `page`, `context`, `browser`, `browserName`, `request`.
- **POM (official pattern):** Class takes `page` in constructor; locators as properties (e.g. `readonly`); methods describe flow (e.g. `goto()`, `submitForm()`). In test: `new MyPage(page)` and call methods.

## Principles

- Tests must run on `chromium`, `firefox`, `webkit`.
- Locators prefer `getByRole`, `getByLabel`, `getByText`.
- Web-first assertions (`expect(locator)...`), no manual waiting and no hard-coded timeouts.
- Page Object Model: pages in `src/pages/`, shared components in `src/pages/components/`. Rules for obtaining and using POM and navigation – see “Page objects and navigation” below.
- Retries disabled (0): when a test fails, we do not rerun it – we find the cause and fix it (see `docs/RUNNING_TESTS.md` – debugging section).
- Parallelism: tests run in parallel by default; stateful tests are isolated by data or marked as serial.
- Each test should have its own data (e.g. unique email) so it is safe under parallel runs.
- On automationexercise.com there are many ads and overlays (cookie consent, banners) that can cover elements. At the start of a test (after opening the page) we call **`dismissOverlays(page)`** from `src/pages/components/OverlayHelper.ts`. This closes cookie consent and tries to close overlays with “Close”/“×” in typical containers (overlay, modal, ad). If a step still fails (element covered), call `dismissOverlays(page)` again right before that step. Ads in iframes (e.g. from external networks) cannot be closed from the page – if needed, consider blocking ad domains in the browser context (Playwright: `route` / request blocking).

## Test levels and tags

- `@smoke`: fast, critical paths (navigation, key pages available)
- `@regression`: broad feature coverage
- `@auth`: login/registration
- `@cart`: cart
- `@checkout`: checkout and orders
- `@contact`: contact form
- `@flaky`: unstable (temporarily excludable via `--grep-invert`)

## Coverage priorities

1. Navigation and page availability: Home, Products, Cart, Signup/Login, Contact us.
2. Auth: new user registration, login, logout, failed login.
3. Products: list, product detail, search, filtering.
4. Cart: add, change quantity, remove, session persistence.
5. Checkout: registered and guest flow, completion, confirmation.
6. Contact us: submit form and validations.

## Page objects and navigation

### Where we get page objects

- **From fixture** – only those registered in `src/fixtures/pages.ts`. Currently: `homePage`. Test receives them as an argument: `async ({ page, homePage }) => { ... }`.
- **Manually in test** – all other POMs are created where used, passing the same `page`:  
  `const signupLoginPage = new SignupLoginPage(page);`  
  One test = one `page` instance; all POMs in that test use the same `page`.

### Usage rules

- **Locators and actions** – interact with the page only through POM methods and getters (e.g. `signupLoginPage.signupButton.click()`), not via `page.locator(...)` in the test (except for things like cookie consent).
- **Navigation – two allowed ways (do not mix in one step):**
  1. **Via UI (links, menu)** – e.g. `homePage.header.products.click()`. After that **do not** call `productsPage.goto()`; create the POM and assert the page loaded (e.g. `new ProductsPage(page); await productsPage.expectLoaded()`).
  2. **Direct URL** – when we intentionally go straight to a page: `await homePage.goto()` or `const p = new SomePage(page); await p.goto()`. Use at test start (e.g. home) or in setup (e.g. going straight to /products).
- **“Page ready” assertion** – after each navigation (UI or URL) use a method like `expectLoaded()` on that POM instead of arbitrary `expect` on multiple elements.
- **Shared fragments (e.g. header)** – live in components (e.g. `HeaderNav`); pages inject them (`readonly header: HeaderNav`) and the test uses e.g. `homePage.header.signupLogin`.

## Test data

- **`src/utils/testData.ts`** – functions that generate **unique** values for tests (e.g. `uniqueEmail()`, `uniqueName()`). Used for isolation under parallel runs (so tests don’t conflict on one account/email). Use them where the app requires uniqueness (registration, login).
- **`src/testdata/`** – **domain** data for tests: types (e.g. `RegistrationData`) and value sets (e.g. `defaultRegistrationData`). Here we keep constants or default form data, choice options, and optionally file-based data (JSON/CSV) if needed later. Convention: one file (or folder) per area/domain (e.g. `registration.ts`, later `checkout.ts`, `contact.ts`).

Summary: on-the-fly generators → `utils/testData.ts`; domain data sets and types → `testdata/`.
