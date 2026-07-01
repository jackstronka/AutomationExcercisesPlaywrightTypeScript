import { test, expect } from '@fixtures/pages';
import { AccountCreatedPage } from '@pages/AccountCreatedPage';
import { SignupAccountInfoPage } from '@pages/SignupAccountInfoPage';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { defaultRegistrationData } from '@testdata/registration';
import { goToHomeReady } from '@utils/testHelpers';
import { uniqueEmail, uniqueName } from '@utils/testData';

test.describe('TC05 Register User with existing email', () => {
  test('signup with already registered email shows error', {
    tag: ['@auth'],
  }, async ({ page, homePage }) => {
    const name = uniqueName();
    const email = uniqueEmail();
    const data = { ...defaultRegistrationData, name, email };

    await goToHomeReady(page, homePage);

    await homePage.header.signupLogin.click();
    let signupLoginPage = new SignupLoginPage(page);
    await page.waitForURL(/\/login/, { waitUntil: 'domcontentloaded' });
    await signupLoginPage.expectLoaded();
    await signupLoginPage.signup(name, email);

    const accountInfoPage = new SignupAccountInfoPage(page);
    await accountInfoPage.expectLoaded();
    await accountInfoPage.fillAccountDetails(data);
    await accountInfoPage.createAccountButton.click();

    const accountCreatedPage = new AccountCreatedPage(page);
    await accountCreatedPage.expectLoaded();
    await accountCreatedPage.continueButton.click();

    await expect(homePage.header.loggedInAs).toBeVisible();

    await homePage.header.clickLogout();
    await page.waitForURL(/\/(login)?$|\//, { waitUntil: 'domcontentloaded' });

    await goToHomeReady(page, homePage);

    await homePage.header.signupLogin.click();
    signupLoginPage = new SignupLoginPage(page);
    await page.waitForURL(/\/login/, { waitUntil: 'domcontentloaded' });
    await expect(signupLoginPage.newUserSignupHeading).toBeVisible();

    await signupLoginPage.signup(name, email);

    await expect(signupLoginPage.signupEmailAlreadyExistsError).toBeVisible();
  });
});
