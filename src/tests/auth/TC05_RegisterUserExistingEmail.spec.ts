import { test, expect } from '@fixtures/pages';
import { dismissOverlays } from '@pages/components/OverlayHelper';
import { AccountCreatedPage } from '@pages/AccountCreatedPage';
import { SignupAccountInfoPage } from '@pages/SignupAccountInfoPage';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { defaultRegistrationData } from '@testdata/registration';
import { uniqueEmail, uniqueName } from '@utils/testData';

test.describe('TC05 Register User with existing email', () => {
  test('signup with already registered email shows error', {
    tag: ['@auth'],
  }, async ({ page, homePage }) => {
    const name = uniqueName();
    const email = uniqueEmail();
    const data = { ...defaultRegistrationData, name, email };

    await homePage.goto();
    await dismissOverlays(page);
    await expect(page.getByRole('heading', { name: /full-fledged practice website/i })).toBeVisible();

    await homePage.header.signupLogin.click();
    let signupLoginPage = new SignupLoginPage(page);
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

    await homePage.header.logout.click();
    await page.waitForURL(/\/(login)?$|\//, { waitUntil: 'domcontentloaded' });

    await homePage.goto();
    await dismissOverlays(page);
    await expect(page.getByRole('heading', { name: /full-fledged practice website/i })).toBeVisible();

    await homePage.header.signupLogin.click();
    signupLoginPage = new SignupLoginPage(page);
    await page.waitForURL(/\/login/, { waitUntil: 'domcontentloaded' });
    await expect(signupLoginPage.newUserSignupHeading).toBeVisible();

    await signupLoginPage.signupNameInput.fill(name);
    await signupLoginPage.signupEmailInput.fill(email);
    await signupLoginPage.signupButton.click();

    await expect(signupLoginPage.signupEmailAlreadyExistsError).toBeVisible();
  });
});
