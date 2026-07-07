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

/**
 * Handles the cookie consent and any ad-like overlays.
 * The site UI is forced to English via `use.locale = 'en-US'` (playwright.config.ts),
 * so no language/translate bar appears and no language handling is needed here.
 */
export async function dismissOverlays(page: Page): Promise<void> {
  await dismissCookieConsentIfPresent(page);
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
