# Project status and task list

This document is updated after larger code changes. It is used to track progress and continuity.

---

## Done

- [x] Playwright + TypeScript project setup (`package.json`, `tsconfig.json`, `playwright.config.ts`)
- [x] Config: `fullyParallel: true`, workers, retries in CI, use of `devices`
- [x] Central run config: `src/config/testRunConfig.ts` (env/profile, grep, headless)
- [x] Page Object Model: `BasePage`, `HomePage`, `HeaderNav`, `ProductsPage`, `CartPage`, `SignupLoginPage`, `ContactUsPage`
- [x] Fixtures: test extended with `homePage` in `src/fixtures/pages.ts`
- [x] Example test in `src/tests/example.spec.ts`
- [x] Navigation smoke tests: `src/tests/smoke/navigation.smoke.spec.ts` (`@smoke`)
- [x] Docs: `docs/TEST_STRATEGY.md`, `docs/TEST_PLAN.md`
- [x] GitHub Actions: workflow running tests on push/PR (main/master)
- [x] Documentation: README, PROJECT_STATUS (this file), `docs/RUNNING_TESTS.md`
- [x] TC01 Register User: full registration flow + account deletion (`src/tests/auth/TC01_RegisterUser.spec.ts`)
- [x] Overlays/ads: `OverlayHelper.ts` – `dismissOverlays(page)` (cookie consent + closing overlays with Close button); tests call it at start

---

## To do

- [ ] Install dependencies: `npm install` and browsers: `npx playwright install` (if not done yet)
- [ ] Run tests locally: `npm run test`
- [ ] Add more pages/apps to tests (e.g. Login, Products) as needed
- [ ] Optionally add env vars (e.g. `BASE_URL`) in CI and locally
- [ ] After first run: update this file with any issues and solutions

---

*Last updated: 2025-02-17*
