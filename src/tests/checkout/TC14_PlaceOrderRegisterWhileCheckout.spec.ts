import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays, dismissOverlays } from '@pages/components/OverlayHelper';
import { AccountCreatedPage } from '@pages/AccountCreatedPage';
import { AccountDeletedPage } from '@pages/AccountDeletedPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage, type PaymentDetails } from '@pages/PaymentPage';
import { ProductsPage } from '@pages/ProductsPage';
import { SignupAccountInfoPage } from '@pages/SignupAccountInfoPage';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { defaultRegistrationData } from '@testdata/registration';
import { uniqueEmail, uniqueName } from '@utils/testData';

const PAYMENT: PaymentDetails = {
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
    await homePage.expectLoaded();

    await clickDismissingOverlays(page, homePage.header.products);
    const productsPage = new ProductsPage(page);
    await page.waitForURL(/\/products/, { waitUntil: 'domcontentloaded' });
    await expect(productsPage.productCards.first()).toBeVisible({ timeout: 15000 });
    await productsPage.addProductToCart(0);
    await expect(productsPage.viewCartButton).toBeVisible({ timeout: 5000 });
    await productsPage.viewCartButton.first().click();

    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    const cartPage = new CartPage(page);
    await expect(cartPage.cartRows.first()).toBeVisible({ timeout: 10000 });

    await cartPage.proceedToCheckoutButton.first().click();

    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.registerLoginLink.first()).toBeVisible({ timeout: 15000 });
    await checkoutPage.goToRegisterLogin();
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
    await paymentPage.fillPaymentDetails(PAYMENT);
    await paymentPage.payAndConfirmButton.click();

    await paymentPage.expectOrderSuccess();

    await homePage.header.deleteAccount.click();
    const accountDeletedPage = new AccountDeletedPage(page);
    await accountDeletedPage.expectLoaded();
    await accountDeletedPage.continueButton.click();
    await expect(page).toHaveURL(/\//);
  });
});
