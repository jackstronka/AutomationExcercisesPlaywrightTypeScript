import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays, dismissOverlays } from '@pages/components/OverlayHelper';
import { AccountCreatedPage } from '@pages/AccountCreatedPage';
import { AccountDeletedPage } from '@pages/AccountDeletedPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage } from '@pages/PaymentPage';
import { ProductsPage } from '@pages/ProductsPage';
import { SignupAccountInfoPage } from '@pages/SignupAccountInfoPage';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { defaultRegistrationData } from '@testdata/registration';
import { uniqueEmail, uniqueName } from '@utils/testData';

const PAYMENT = {
  nameOnCard: 'Test User',
  cardNumber: '4111111111111111',
  cvc: '123',
  expirationMonth: '12',
  expirationYear: '25',
};

test.describe('TC14 Place Order: Register while Checkout', () => {
  test('add product, checkout, register during checkout, place order, verify success, delete account', {
    tag: ['@checkout'],
  }, async ({ page, homePage }) => {
    const name = uniqueName();
    const email = uniqueEmail();

    await homePage.goto();
    await dismissOverlays(page);
    await expect(page.getByRole('heading', { name: /full-fledged practice website/i }).first()).toBeVisible();

    await clickDismissingOverlays(page, homePage.header.products);
    const productsPage = new ProductsPage(page);
    await page.waitForURL(/\/products/, { waitUntil: 'load' });
    await expect(productsPage.productCards.first()).toBeVisible({ timeout: 15000 });
    await productsPage.productCards.first().scrollIntoViewIfNeeded();
    await productsPage.productCards.first().hover();
    await productsPage.addToCartLinks.first().click({ force: true });
    await expect(productsPage.viewCartButton).toBeVisible({ timeout: 5000 });
    await productsPage.viewCartButton.first().click();

    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    const cartPage = new CartPage(page);
    await expect(cartPage.cartRows.first()).toBeVisible({ timeout: 10000 });

    await cartPage.proceedToCheckoutButton.first().click();

    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.registerLoginLink.first()).toBeVisible({ timeout: 15000 });
    const registerLogin = checkoutPage.registerLoginLink.first();
    await registerLogin.click();
    await page.waitForLoadState('load');
    if (!(await page.url().includes('/login'))) {
      await page.goto('/login');
    }
    const signupLoginPage = new SignupLoginPage(page);
    await signupLoginPage.expectLoaded();
    await signupLoginPage.signupNameInput.fill(name);
    await signupLoginPage.signupEmailInput.fill(email);
    await signupLoginPage.signupButton.click();

    const accountInfoPage = new SignupAccountInfoPage(page);
    await accountInfoPage.expectLoaded();
    const data = { ...defaultRegistrationData, name, email };
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

    await expect(homePage.header.loggedInAs).toBeVisible({ timeout: 10000 });
    await expect(homePage.header.loggedInAs).toContainText(name);

    await clickDismissingOverlays(page, homePage.header.cart);
    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    await cartPage.proceedToCheckoutButton.first().click();
    await page.waitForURL(/checkout/, { waitUntil: 'domcontentloaded' });

    await expect(checkoutPage.addressDetailsHeading.first()).toBeVisible({ timeout: 5000 });
    await expect(checkoutPage.reviewOrderHeading.first()).toBeVisible({ timeout: 5000 });

    await checkoutPage.commentTextarea.fill('Please deliver in the morning.');
    await checkoutPage.placeOrderButton.first().click();
    await page.waitForURL(/payment/, { waitUntil: 'domcontentloaded' });

    const paymentPage = new PaymentPage(page);
    const formInputs = page.locator('form').locator('input[type="text"]');
    const count = await formInputs.count();
    if (count >= 4) {
      await formInputs.nth(0).fill(PAYMENT.nameOnCard);
      await formInputs.nth(1).fill(PAYMENT.cardNumber);
      await formInputs.nth(2).fill(PAYMENT.cvc);
      await formInputs.nth(3).fill(PAYMENT.expirationMonth + PAYMENT.expirationYear);
    } else {
      await paymentPage.nameOnCardInput.first().fill(PAYMENT.nameOnCard);
      await paymentPage.cardNumberInput.first().fill(PAYMENT.cardNumber);
      await paymentPage.cvcInput.first().fill(PAYMENT.cvc);
      await paymentPage.expirationInput.first().fill(PAYMENT.expirationMonth + PAYMENT.expirationYear);
    }
    await paymentPage.payAndConfirmButton.click();
    await page.waitForLoadState('networkidle').catch(() => {});

    await paymentPage.expectOrderSuccess();

    await homePage.header.deleteAccount.click();
    const accountDeletedPage = new AccountDeletedPage(page);
    await accountDeletedPage.expectLoaded();
    await accountDeletedPage.continueButton.click();
    await expect(page).toHaveURL(/\//);
  });
});
