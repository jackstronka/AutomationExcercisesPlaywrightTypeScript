export type TestEnv = 'default' | 'local' | 'staging' | 'prod';
export type RunProfile = 'local' | 'ci';
export type BrowserProject = 'chromium' | 'firefox' | 'webkit';

export const ALL_BROWSER_PROJECTS: readonly BrowserProject[] = [
  'chromium',
  'firefox',
  'webkit',
] as const;

export type ResolvedRunConfig = Readonly<{
  env: TestEnv;
  profile: RunProfile;
  baseURL: string;
  retries: number;
  /** Parallel worker processes (global for the run; Playwright does not support per-browser workers). */
  workers?: number;
  /** Browsers included in this run (before any CLI `--project` filter). */
  browsers: readonly BrowserProject[];
  trace: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
  screenshot: 'off' | 'on' | 'only-on-failure';
  headless?: boolean;
  grep?: RegExp;
  grepInvert?: RegExp;
}>;

const envs: Record<TestEnv, { baseURL: string }> = {
  default: { baseURL: 'https://automationexercise.com' },
  local: { baseURL: 'http://localhost:3000' },
  staging: { baseURL: 'https://staging.example.com' },
  prod: { baseURL: 'https://example.com' },
};

/**
 * Run profiles: workers + browsers in one place.
 * - workers: max parallel test processes (shared across active browsers).
 * - browsers: which Playwright projects are enabled.
 *
 * Per-browser parallelism in a single command is not supported by Playwright.
 * To tune one browser, set `browsers` to that browser (or use `--project`) and adjust `workers`.
 */
const profiles: Record<
  RunProfile,
  Pick<ResolvedRunConfig, 'retries' | 'workers' | 'browsers' | 'trace' | 'screenshot'>
> = {
  local: {
    retries: 0,
    workers: 1,
    browsers: ['chromium'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  ci: {
    retries: 0,
    workers: 4,
    browsers: [...ALL_BROWSER_PROJECTS],
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
};

function parseRegex(input: string | undefined): RegExp | undefined {
  if (!input) return undefined;
  return new RegExp(input);
}

function parseIntFromEnv(input: string | undefined): number | undefined {
  if (!input) return undefined;
  const n = Number.parseInt(input, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseEnv(input: string | undefined): TestEnv {
  if (input === 'default' || input === 'local' || input === 'staging' || input === 'prod') return input;
  return 'default';
}

function parseProfile(input: string | undefined, isCI: boolean): RunProfile {
  if (input === 'local' || input === 'ci') return input;
  return isCI ? 'ci' : 'local';
}

function parseBrowsers(input: string | undefined): BrowserProject[] | undefined {
  if (!input?.trim()) return undefined;

  const selected = input
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter((name): name is BrowserProject => ALL_BROWSER_PROJECTS.includes(name as BrowserProject));

  return selected.length > 0 ? selected : undefined;
}

function parseBrowsersFromArgv(argv: string[]): BrowserProject[] | undefined {
  const selected: BrowserProject[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--project') {
      const value = argv[i + 1];
      if (value) selected.push(...(parseBrowsers(value) ?? []));
      continue;
    }
    if (arg.startsWith('--project=')) {
      selected.push(...(parseBrowsers(arg.slice('--project='.length)) ?? []));
    }
  }

  const unique = [...new Set(selected)];
  return unique.length > 0 ? unique : undefined;
}

export function resolveRunConfig(
  processEnv: NodeJS.ProcessEnv,
  argv: readonly string[] = process.argv,
): ResolvedRunConfig {
  const isCI = processEnv.CI === 'true' || processEnv.CI === '1';
  const env = parseEnv(processEnv.TEST_ENV);
  const profile = parseProfile(processEnv.RUN_PROFILE, isCI);

  const baseURL = processEnv.BASE_URL ?? envs[env].baseURL;
  const headlessRaw = processEnv.HEADLESS;
  const headless =
    headlessRaw === 'false' || headlessRaw === '0'
      ? false
      : headlessRaw === 'true' || headlessRaw === '1'
        ? true
        : undefined;

  const grep = parseRegex(processEnv.PW_GREP);
  const grepInvert = parseRegex(processEnv.PW_GREP_INVERT);

  const workersOverride = parseIntFromEnv(processEnv.PW_WORKERS ?? processEnv.WORKERS);
  const retriesOverride = parseIntFromEnv(processEnv.PW_RETRIES ?? processEnv.RETRIES);
  const browsersOverride = parseBrowsers(processEnv.PW_PROJECTS ?? processEnv.BROWSERS);
  const browsersFromCli = parseBrowsersFromArgv([...argv]);

  const baseProfile = profiles[profile];

  return {
    env,
    profile,
    baseURL,
    headless,
    grep,
    grepInvert,
    ...baseProfile,
    workers: workersOverride ?? baseProfile.workers,
    retries: retriesOverride ?? baseProfile.retries,
    browsers: browsersFromCli ?? browsersOverride ?? baseProfile.browsers,
  };
}
