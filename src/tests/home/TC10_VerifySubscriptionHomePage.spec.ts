import { test, expect } from '@fixtures/pages';
import { dismissOverlays } from '@pages/components/OverlayHelper';
import { uniqueEmail } from '@utils/testData';

test.describe('TC10 Verify Subscription in home page', () => {
  test('scroll to footer, verify SUBSCRIPTION, subscribe and verify success message', {
    tag: ['@home'],
  }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await expect(page.getByRole('heading', { name: /full-fledged practice website/i }).first()).toBeVisible();

    await homePage.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(homePage.subscriptionHeading).toBeVisible();

    const email = uniqueEmail('subscribe');
    await homePage.subscriptionEmailInput.fill(email);
    await homePage.subscriptionArrowButton.click();

    await expect(homePage.subscriptionSuccessMessage).toBeVisible();
  });
});
