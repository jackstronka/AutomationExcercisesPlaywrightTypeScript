import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays } from '@pages/components/OverlayHelper';
import { CartPage } from '@pages/CartPage';
import { goToHomeReady } from '@utils/testHelpers';
import { uniqueEmail } from '@utils/testData';

test.describe('TC11 Verify Subscription in Cart page', () => {
  test('open Cart, scroll to footer, verify SUBSCRIPTION, subscribe and verify success message', {
    tag: ['@cart'],
  }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);

    await clickDismissingOverlays(page, homePage.header.cart);
    const cartPage = new CartPage(page);
    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    await cartPage.expectLoaded();

    const email = uniqueEmail('subscribe');
    await cartPage.subscribe(email);

    await expect(cartPage.subscriptionSuccessMessage).toBeVisible();
  });
});
