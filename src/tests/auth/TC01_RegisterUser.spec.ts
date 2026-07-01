import { test, expect } from '@fixtures/pages';
import { AccountCreatedPage } from '@pages/AccountCreatedPage';
import { AccountDeletedPage } from '@pages/AccountDeletedPage';
import { SignupAccountInfoPage } from '@pages/SignupAccountInfoPage';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { defaultRegistrationData } from '@testdata/registration';
import { goToHomeReady } from '@utils/testHelpers';
import { uniqueEmail, uniqueName } from '@utils/testData';

test.describe('TC01 Register User', () => {
  test('full registration flow: signup, fill details, account created, delete account', {
    tag: ['@auth'],
  }, async ({ page, homePage }) => {
    const name = uniqueName();
    const email = uniqueEmail();
    const data = { ...defaultRegistrationData, name, email };

    await goToHomeReady(page, homePage);

    await homePage.header.signupLogin.click();
    const signupLoginPage = new SignupLoginPage(page);
    await page.waitForURL(/\/login/, { waitUntil: 'domcontentloaded' });
    await signupLoginPage.expectLoaded();

    await signupLoginPage.signupNameInput.fill(name);
    await signupLoginPage.signupEmailInput.fill(email);
    await signupLoginPage.signupButton.click();

    const accountInfoPage = new SignupAccountInfoPage(page);
    await accountInfoPage.expectLoaded();

    await accountInfoPage.titleMr.check();
    await accountInfoPage.passwordInput.fill(data.password);
    await accountInfoPage.dayDropdown.selectOption(data.day);
    await accountInfoPage.monthDropdown.selectOption(data.month);
    await accountInfoPage.yearDropdown.selectOption(data.year);
    await accountInfoPage.setNewsletter(data.newsletter);
    await accountInfoPage.setSpecialOffers(data.specialOffers);

    await accountInfoPage.firstNameInput.fill(data.firstName);
    await accountInfoPage.lastNameInput.fill(data.lastName);
    await accountInfoPage.companyInput.fill(data.company);
    await accountInfoPage.address1Input.fill(data.address1);
    await accountInfoPage.address2Input.fill(data.address2);
    await accountInfoPage.countryDropdown.selectOption({ label: data.country });
    await accountInfoPage.stateInput.fill(data.state);
    await accountInfoPage.cityInput.fill(data.city);
    await accountInfoPage.zipcodeInput.fill(data.zipcode);
    await accountInfoPage.mobileInput.fill(data.mobile);

    await accountInfoPage.createAccountButton.click();

    const accountCreatedPage = new AccountCreatedPage(page);
    await accountCreatedPage.expectLoaded();
    await accountCreatedPage.continueButton.click();

    await expect(homePage.header.loggedInAs).toBeVisible();
    await expect(homePage.header.loggedInAs).toContainText(name);

    await homePage.header.deleteAccount.click();

    const accountDeletedPage = new AccountDeletedPage(page);
    await accountDeletedPage.expectLoaded();
    await accountDeletedPage.continueButton.click();

    await expect(page).toHaveURL(/\//);
  });
});
