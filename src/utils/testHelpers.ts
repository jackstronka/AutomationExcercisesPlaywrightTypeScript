import type { Page } from '@playwright/test';
import type { HomePage } from '@pages/HomePage';
import { dismissOverlays } from '@pages/components/OverlayHelper';

/**
 * Opens home page, dismisses overlays (cookie/language/ads), and asserts home is loaded.
 * Use at the start of tests that begin from the home page to avoid repeating the same three steps.
 */
export async function goToHomeReady(page: Page, homePage: HomePage): Promise<void> {
  await homePage.goto();
  await dismissOverlays(page);
  await homePage.expectLoaded();
}
