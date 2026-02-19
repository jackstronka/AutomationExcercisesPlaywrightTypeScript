export type TestEnv = 'default' | 'local' | 'staging' | 'prod';
export type RunProfile = 'local' | 'ci';

export type ResolvedRunConfig = Readonly<{
  env: TestEnv;
  profile: RunProfile;
  baseURL: string;
  retries: number;
  workers?: number;
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

const profiles: Record<RunProfile, Pick<ResolvedRunConfig, 'retries' | 'workers' | 'trace' | 'screenshot'>> = {
  local: { retries: 0, workers: undefined, trace: 'on-first-retry', screenshot: 'only-on-failure' },
  ci: { retries: 0, workers: 2, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
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

export function resolveRunConfig(processEnv: NodeJS.ProcessEnv): ResolvedRunConfig {
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
  };
}

