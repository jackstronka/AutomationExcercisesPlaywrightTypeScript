import { test, expect } from '@fixtures/pages';
import { goToHomeReady } from '@utils/testHelpers';

test.describe('Home page', () => {
  test('has signup/login link', { tag: ['@smoke'] }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);
    await expect(homePage.signupLoginLink).toBeVisible();
  });
});
