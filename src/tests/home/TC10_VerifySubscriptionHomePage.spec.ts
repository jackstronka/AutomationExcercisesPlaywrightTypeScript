import { test, expect } from '@fixtures/pages';
import { goToHomeReady } from '@utils/testHelpers';
import { uniqueEmail } from '@utils/testData';

test.describe('TC10 Verify Subscription in home page', () => {
  test('scroll to footer, verify SUBSCRIPTION, subscribe and verify success message', {
    tag: ['@home'],
  }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);

    const email = uniqueEmail('subscribe');
    await homePage.subscribe(email);

    await expect(homePage.subscriptionSuccessMessage).toBeVisible();
  });
});
