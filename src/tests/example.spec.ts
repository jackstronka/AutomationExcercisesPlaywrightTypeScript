import { test, expect } from '@fixtures/pages';
import { dismissOverlays } from '@pages/components/OverlayHelper';

test.describe('Home page', () => {
  test('has signup/login link', { tag: ['@smoke'] }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await expect(homePage.signupLoginLink).toBeVisible();
  });
});
