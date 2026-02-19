import { type Locator, type Page } from '@playwright/test';

const OVERLAY_SELECTOR =
  '[class*="fc-"], [class*="overlay"], [class*="modal"], [class*="popup"], [class*="ad-container"], [id*="ad-"]';
const CLOSE_BUTTON_NAMES = /close|dismiss|×|✕|ok|accept|got it|zamknij/i;

/** Short timeout – if there is no consent, we continue (e.g. to language bar). */
const CONSENT_TRY_MS = 800;

export async function dismissCookieConsentIfPresent(page: Page): Promise<void> {
  const consentRoot = page.locator('.fc-consent-root, [class*="consent"]');
  const acceptByRole = page.getByRole('button', { name: /accept|agree|consent|ok|allow|got it/i });
  const acceptInRoot = consentRoot.getByRole('button', { name: CLOSE_BUTTON_NAMES });
  const anyConsentButton = consentRoot.getByRole('button').first();
  try {
    await acceptByRole.click({ timeout: CONSENT_TRY_MS });
  } catch {
    try {
      await acceptInRoot.click({ timeout: CONSENT_TRY_MS });
    } catch {
      await anyConsentButton.click({ timeout: CONSENT_TRY_MS }).catch(() => {});
    }
  }
}

const AD_OVERLAY_TRY_MS = 600;

export async function dismissAdLikeOverlays(page: Page, maxAttempts = 5): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const overlay = page.locator(OVERLAY_SELECTOR).first();
    const visible = await overlay.isVisible({ timeout: AD_OVERLAY_TRY_MS }).catch(() => false);
    if (!visible) break;
    const closeBtn = overlay.getByRole('button', { name: CLOSE_BUTTON_NAMES }).first();
    const closeLink = overlay.getByRole('link', { name: CLOSE_BUTTON_NAMES }).first();
    try {
      await closeBtn.click({ timeout: 800 });
    } catch {
      try {
        await closeLink.click({ timeout: 800 });
      } catch {
        break;
      }
    }
  }
}

const LANGUAGE_BAR_SELECTORS = [
  '[class*="language"], [class*="locale"], [id*="language"], [id*="locale"]',
  '[class*="gtranslate"], [class*="translate"], [id*="translate"]',
  '[class*="weglot"], [class*="wpml"], [class*="lang-switch"]',
  '[class*="language-bar"], [class*="language-selector"]',
];

/** Short timeout – if element is visible, click in ~400 ms; if not, we give up quickly. */
const LANG_TRY_MS = 400;
/** Max time for first wave (4 attempts in parallel) – then optional loop over LANGUAGE_BAR. */
const LANG_TOTAL_MS = 900;

export async function dismissLanguageSelectorIfPresent(page: Page): Promise<void> {
  const tryAngielski = () => page.getByText('angielski', { exact: true }).or(page.getByRole('link', { name: /angielski/i })).first().click({ timeout: LANG_TRY_MS });
  const inGoogTe = page.locator('[class*="goog-te"], [class*="skiptranslate"]').filter({ has: page.getByText(/angielski|polski/i) });
  const tryGoogTe = () => inGoogTe.getByText('angielski').or(inGoogTe.getByRole('link', { name: /angielski/i })).first().click({ timeout: LANG_TRY_MS });
  const tryFrame = () => page.frameLocator('iframe[class*="goog-te"], iframe[title*="Translate"]').getByText('angielski').first().click({ timeout: LANG_TRY_MS });
  const englishLink = page.getByRole('link', { name: /english|angielski/i }).or(page.getByRole('button', { name: /english|angielski/i })).or(page.getByText(/^English$|^angielski$/i));
  const tryEnglish = () => englishLink.first().click({ timeout: LANG_TRY_MS });

  const firstSuccess = await Promise.race([
    tryAngielski().then(() => true).catch(() => false),
    tryGoogTe().then(() => true).catch(() => false),
    tryFrame().then(() => true).catch(() => false),
    tryEnglish().then(() => true).catch(() => false),
    new Promise<false>((resolve) => setTimeout(() => resolve(false), LANG_TOTAL_MS)),
  ]);
  if (firstSuccess === true) return;

  for (const selector of LANGUAGE_BAR_SELECTORS) {
    const bar = page.locator(selector).filter({ has: page.getByText(/polski|english/i) }).first();
    try {
      await bar.getByRole('button', { name: CLOSE_BUTTON_NAMES }).or(bar.locator('[aria-label*="close" i], [title*="close" i], [class*="close"]')).first().click({ timeout: LANG_TRY_MS });
      return;
    } catch {
      //
    }
    try {
      await bar.getByRole('link', { name: /english/i }).or(bar.getByText('English').first()).first().click({ timeout: LANG_TRY_MS });
      return;
    } catch {
      //
    }
  }
}

/** We don't know what appears first (cookie vs language bar) – handle both in parallel. */
export async function dismissOverlays(page: Page): Promise<void> {
  await Promise.all([
    dismissCookieConsentIfPresent(page),
    dismissLanguageSelectorIfPresent(page),
  ]);
  await dismissAdLikeOverlays(page);
}

export async function clickDismissingOverlays(
  page: Page,
  locator: Locator,
  options?: { retries?: number; timeout?: number }
): Promise<void> {
  const retries = options?.retries ?? 3;
  const timeout = options?.timeout ?? 10000;
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      await locator.scrollIntoViewIfNeeded({ timeout });
      await locator.click({ timeout });
      return;
    } catch (e) {
      lastError = e as Error;
      if (page.isClosed()) throw lastError;
      await dismissOverlays(page);
    }
  }
  if (page.isClosed()) throw lastError;
  await locator.scrollIntoViewIfNeeded({ timeout });
  await locator.click({ timeout });
}
