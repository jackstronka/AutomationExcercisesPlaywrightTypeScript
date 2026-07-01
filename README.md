# Automation Exercises – Playwright + TypeScript

Template project for E2E automation tests with **Playwright** and **TypeScript**. Can be used to test any website (default: [Automation Exercise](https://automationexercise.com)).

## Requirements

- Node.js 22+ (CI uses 22; 18+ may work locally)
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
| `npm run test` | All tests (locally: Chromium only, 1 worker – see [Samouczek](#samouczek)) |
| `npm run test:headed` | Tests with visible browser window |
| `npm run test:chromium` | Chromium only |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open HTML report (local) |

**Test reports (CI):** Latest HTML report is published to GitHub Pages after each run: **[https://jackstronka.github.io/AutomationExcercisesPlaywrightTypeScript/](https://jackstronka.github.io/AutomationExcercisesPlaywrightTypeScript/)**. One-time setup: **Settings → Pages → Source: GitHub Actions**.

More scenarios (tags, workers, env vars): **[Samouczek](#samouczek)** below, or `docs/RUNNING_TESTS.md` and `docs/CONFIGURATION.md`.

---

## Samouczek

Krótki przewodnik po narzędziach i uruchamianiu testów w tym projekcie – żeby łatwo wrócić do podstaw bez szukania w historii czatu.

### Node.js, npm i npx

| Narzędzie | Co to jest | Gdzie jest |
|-----------|------------|------------|
| **Node.js** | Środowisko uruchomieniowe JavaScript (poza przeglądarką) | Program w systemie – [nodejs.org](https://nodejs.org) |
| **npm** | *Node Package Manager* – instaluje paczki i uruchamia skrypty z `package.json` | Dołączony do Node.js (nie ma go w `package.json`) |
| **npx** | *Node Package eXecute* – uruchamia programy z paczek w `node_modules` | Też dołączony do Node.js |

```
Node.js
 ├── npm   →  npm install, npm run test
 └── npx   →  npx playwright test
```

Sprawdzenie wersji:

```powershell
node -v
npm -v
```

### Co jest w `package.json`

Plik **nie zawiera** słowa „npm” – to instrukcja **dla** npm.

**1. Skrypty (`scripts`)** – aliasy wywoływane przez `npm run <nazwa>`:

```json
"test": "playwright test",
"test:headed": "playwright test --headed",
"lint": "eslint src/",
"typecheck": "tsc --noEmit"
```

Przykład: `npm run test` uruchamia `playwright test`.  
**Nie** pisz `npm run 'playwright test'` – `npm run` oczekuje **nazwy skryptu** (`test`), nie całego polecenia.

**2. Zależności (`devDependencies`)** – paczki tylko do **rozwoju i testów** (nie deployujesz ich jako aplikację). Pobierane przez `npm install` do `node_modules/`:

```
Testy E2E          →  @playwright/test
TypeScript         →  typescript, @types/node
Jakość kodu (lint) →  eslint, @eslint/js, typescript-eslint, eslint-plugin-playwright
```

| Paczka | Uruchamiasz ręcznie? | Do czego | Gdzie w projekcie |
|--------|----------------------|----------|-------------------|
| `@playwright/test` | ✅ `playwright` | Testy E2E w przeglądarce | `src/tests/`, `playwright.config.ts`, `src/fixtures/` |
| `typescript` | ✅ `tsc` | Język TypeScript, sprawdzanie typów | cały `src/`, `tsconfig.json` |
| `@types/node` | ❌ | Typy dla Node.js (`process.env`, moduły) | `testRunConfig.ts`, `playwright.config.ts` |
| `eslint` | ✅ `eslint` | Lint – analiza jakości kodu | `eslint.config.js`, `npm run lint` |
| `@eslint/js` | ❌ | Podstawowe reguły ESLint | `eslint.config.js` → `js.configs.recommended` |
| `typescript-eslint` | ❌ | Lint plików `.ts` (nie tylko `.js`) | `eslint.config.js` → `tseslint.configs.recommended` |
| `eslint-plugin-playwright` | ❌ | Reguły dla testów Playwright | `eslint.config.js` – tylko `src/tests/**/*.ts` |

Lista zainstalowanych paczek:

```powershell
npm ls --depth=0
```

Programy dostępne przez `npx` (z `node_modules/.bin/`): `playwright`, `tsc`, `eslint`.

### Typecheck, lint i testy – trzy różne kontrole

W `package.json` masz **trzy osobne skrypty** – każdy robi coś innego:

| Skrypt | Komenda | Co sprawdza |
|--------|---------|-------------|
| `npm run typecheck` | `tsc --noEmit` | Czy kod TypeScript ma **poprawne typy** (literówki w metodach, złe argumenty) |
| `npm run lint` | `eslint src/` | Czy kod spełnia **reguły jakości** (styl, antywzorce w testach) |
| `npm run test` | `playwright test` | Czy testy **działają w przeglądarce** (klik, formularz, asercje) |

**Playwright nie robi pełnego type-checku** – uruchamia testy, ale nie zastępuje `tsc`. Możesz mieć błąd typu, a test i tak wystartuje (albo poleci dopiero w trakcie).

**Przykład:**

```ts
await homePage.gotoo();  // literówka – powinno być goto()
```

| Narzędzie | Efekt |
|-----------|-------|
| `npm run typecheck` | Od razu: *Property 'gotoo' does not exist* |
| `npm run test` | Błąd dopiero w teście: *gotoo is not a function* |

**Co znaczy `tsc --noEmit`?**

- `tsc` = kompilator TypeScript
- `--noEmit` = sprawdź typy, ale **nie twórz** plików `.js`

W tym projekcie Playwright czyta `.ts` bezpośrednio – nie potrzebujesz budować JavaScriptu. W `tsconfig.json` jest też `"noEmit": true`.

**Jak uruchomić typecheck:**

```powershell
npm run typecheck
# lub
npx tsc --noEmit
```

- Brak błędów → cisza, sukces
- Są błędy → lista w terminalu z plikiem i numerem linii

**Kiedy używać:**

| Kiedy | Dlaczego |
|-------|----------|
| Po większej zmianie w kodzie | Szybko łapiesz błędy typów bez odpalania przeglądarki |
| Przed commitem / pushem | Pewność, że kod jest poprawny typowo |
| Gdy test jest wolny | Typecheck trwa sekundy, testy – minuty |

Edytor (Cursor) często pokazuje te same błędy na bieżąco – `npm run typecheck` to **pełne sprawdzenie całego projektu** naraz.

**Typowy workflow:**

```
1. piszesz / zmieniasz kod
2. npm run typecheck   ← szybko: czy typy OK?
3. npm run lint        ← czy reguły ESLint OK?
4. npm run test        ← czy testy przechodzą w przeglądarce?
```

Nie musisz robić wszystkiego po każdej linijce – ale przed pushem warto przejść całą sekwencję.

### npm run vs npx – kiedy czego używać

| Chcesz… | Użyj |
|---------|------|
| Skrót z `package.json` | `npm run test`, `npm run lint` |
| Polecenie z własnymi flagami | `npx playwright test --grep "@smoke" --headed` |
| To samo co `npm run test` | `npx playwright test` |

**Zasada:** `npm run` = nazwa skryptu z `package.json`. `npx` = bezpośrednie polecenie programu z paczki.

### Uruchamianie testów

```powershell
# wszystkie testy (profil local: Chromium, 1 worker)
npm run test

# to samo, bez npm
npx playwright test

# jeden plik
npx playwright test src/tests/auth/TC01_RegisterUser.spec.ts

# tylko Chromium (nadpisuje domyślny zestaw przeglądarek)
npm run test:chromium
npx playwright test --project=chromium
```

### Przeglądarka widoczna (headed)

Domyślnie testy lecą **headless** (bez okna).

```powershell
npm run test:headed
npx playwright test --headed
npx playwright test --project=chromium --headed

# albo przez zmienną środowiskową
$env:HEADLESS="false"
npm run test
```

### Równoległość – workers i przeglądarki

Konfiguracja jest w **dwóch plikach**:

| Plik | Odpowiada za |
|------|----------------|
| `src/config/testRunConfig.ts` | **ile** równolegle (`workers`), **które** przeglądarki (`browsers`), profil `local` / `ci` |
| `playwright.config.ts` | ustawienia techniczne przeglądarek, timeouty, reporter |

**Domyślne profile:**

| Profil | Kiedy | Workers | Przeglądarki |
|--------|-------|---------|--------------|
| `local` | lokalnie (bez `CI=true`) | `1` (po kolei, jedno okno) | tylko `chromium` |
| `ci` | GitHub Actions (`CI=true`) | `4` | `chromium`, `firefox`, `webkit` |

Maksymalna równoległość ≈ **workers × liczba aktywnych przeglądarek** (w CI: 4 × 3 ≈ 12 procesów).

**Priorytet wyboru przeglądarek:** `--project` (CLI) → `PW_PROJECTS` / `BROWSERS` (env) → profil w `testRunConfig.ts`.

```powershell
# więcej równoległości lokalnie
$env:PW_WORKERS="2"
npm run test

# więcej przeglądarek lokalnie
$env:PW_PROJECTS="chromium,firefox"
npm run test

# sekwencyjnie, jeden test naraz
npx playwright test --workers=1

# stała zmiana: edytuj obiekt profiles w src/config/testRunConfig.ts
```

Playwright **nie obsługuje** różnej liczby workerów per przeglądarka w jednym poleceniu. Żeby „tylko Chromium, po kolei” – wystarczy domyślny profil `local`.

### Tagi testów

Tagi są w plikach `.spec.ts`:

```ts
test('full registration flow...', { tag: ['@auth'] }, async ({ ... }) => {
```

**Tagi w projekcie:**

| Tag | Obszar |
|-----|--------|
| `@smoke` | szybka weryfikacja (nawigacja, link login) |
| `@auth` | TC01–TC05 |
| `@products` | TC08, TC09 |
| `@cart` | TC11–TC13 |
| `@checkout` | TC14 |
| `@contact` | TC06 |
| `@navigation` | TC07 |
| `@home` | TC10 |

**Filtrowanie – najwygodniej przez `npx`:**

```powershell
npx playwright test --grep "@smoke"
npx playwright test --grep "@auth"
npx playwright test --grep "@smoke" --headed --project=chromium
npx playwright test --grep-invert "@checkout"
npx playwright test --grep "(@auth|@cart)"
```

**Albo przez zmienną + `npm run`:**

```powershell
$env:PW_GREP="@smoke"
npm run test
```

Opcjonalnie możesz dodać skróty w `package.json`, np. `"test:smoke": "playwright test --grep @smoke"`, wtedy: `npm run test:smoke`.

### Szybka ściągawka (PowerShell)

```powershell
# instalacja (raz na początku)
npm install
npx playwright install

# codzienna praca (kolejność przy większych zmianach)
npm run typecheck                   # 1. typy TypeScript (szybkie, bez przeglądarki)
npm run lint                          # 2. reguły ESLint
npm run test                          # 3. testy E2E, local: Chromium, 1 worker
npx playwright test --headed          # testy z widoczną przeglądarką
npx playwright test --grep "@smoke"   # tylko smoke
npm run test:chromium                 # tylko Chromium
npm run report                        # raport HTML po uruchomieniu testów
```

### Gdzie szukać więcej

| Temat | Plik |
|-------|------|
| Wszystkie opcje configu | `docs/CONFIGURATION.md` |
| Uruchamianie, grep, workers | `docs/RUNNING_TESTS.md` |
| Strategia testów, POM | `docs/TEST_STRATEGY.md` |
| Status projektu | `docs/PROJECT_STATUS.md` |

---

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
- **Browsers and parallelism**: `src/config/testRunConfig.ts` (profiles, workers, which browsers) + `playwright.config.ts` (browser launch options). See [Samouczek](#samouczek).
- **CI**: workflow in `.github/workflows/playwright.yml` runs tests on push/PR to `main` or `master`, saves the report as an artifact, and **deploys the HTML report to GitHub Pages** (stable URL). One-time setup: **Settings → Pages → Source: GitHub Actions**.

## Documentation and progress

- **README.md** (this file) – project overview, **[Samouczek](#samouczek)** (npm/npx, paczki, typecheck/lint/test, uruchamianie, tagi, równoległość).
- **docs/CONFIGURATION.md** – what can be configured and how (env vars, config files).
- **docs/PROJECT_STATUS.md** – current status (done / to do). **Update it after larger code changes** so progress is tracked across sessions.
- **docs/GITHUB_PAGES.md** – Playwright report is deployed to GitHub Pages; one-time setup (Settings → Pages → Source: GitHub Actions) and report URL.

## License

MIT
