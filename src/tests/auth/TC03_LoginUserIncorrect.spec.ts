import { test, expect } from '@fixtures/pages';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { goToHomeReady } from '@utils/testHelpers';

test.describe('TC03 Login User with incorrect email and password', () => {
  test('login with wrong credentials shows error message', {
    tag: ['@auth'],
  }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);

    await homePage.header.signupLogin.click();
    const signupLoginPage = new SignupLoginPage(page);
    await page.waitForURL(/\/login/, { waitUntil: 'domcontentloaded' });
    await signupLoginPage.expectLoaded();

    await signupLoginPage.login('wrong@example.com', 'wrongpassword');

    await expect(signupLoginPage.loginErrorMessage).toBeVisible();
  });
});
