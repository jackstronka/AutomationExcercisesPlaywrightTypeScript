import { test, expect } from '@fixtures/pages';
import { dismissOverlays } from '@pages/components/OverlayHelper';
import { SignupLoginPage } from '@pages/SignupLoginPage';

test.describe('TC03 Login User with incorrect email and password', () => {
  test('login with wrong credentials shows error message', {
    tag: ['@auth'],
  }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await homePage.expectLoaded();

    await homePage.header.signupLogin.click();
    const signupLoginPage = new SignupLoginPage(page);
    await page.waitForURL(/\/login/, { waitUntil: 'domcontentloaded' });
    await expect(signupLoginPage.loginToYourAccountHeading).toBeVisible();

    await signupLoginPage.loginEmailInput.fill('wrong@example.com');
    await signupLoginPage.loginPasswordInput.fill('wrongpassword');
    await signupLoginPage.loginButton.click();

    await expect(signupLoginPage.loginErrorMessage).toBeVisible();
  });
});
