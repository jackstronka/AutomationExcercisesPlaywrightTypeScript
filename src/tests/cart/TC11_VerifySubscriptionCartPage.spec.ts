import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays, dismissOverlays } from '@pages/components/OverlayHelper';
import { CartPage } from '@pages/CartPage';
import { uniqueEmail } from '@utils/testData';

test.describe('TC11 Verify Subscription in Cart page', () => {
  test('open Cart, scroll to footer, verify SUBSCRIPTION, subscribe and verify success message', {
    tag: ['@cart'],
  }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await homePage.expectLoaded();

    await clickDismissingOverlays(page, homePage.header.cart);
    const cartPage = new CartPage(page);
    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    await cartPage.expectLoaded();

    await cartPage.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(cartPage.subscriptionHeading).toBeVisible();

    const email = uniqueEmail('subscribe');
    await cartPage.subscriptionEmailInput.fill(email);
    await cartPage.subscriptionArrowButton.click();

    await expect(cartPage.subscriptionSuccessMessage).toBeVisible();
  });
});
