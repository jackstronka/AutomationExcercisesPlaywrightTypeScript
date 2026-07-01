import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays } from '@pages/components/OverlayHelper';
import { AccountCreatedPage } from '@pages/AccountCreatedPage';
import { AccountDeletedPage } from '@pages/AccountDeletedPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage, type PaymentDetails } from '@pages/PaymentPage';
import { ProductsPage } from '@pages/ProductsPage';
import { SignupAccountInfoPage } from '@pages/SignupAccountInfoPage';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { defaultRegistrationData } from '@testdata/registration';
import { goToHomeReady } from '@utils/testHelpers';
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

    await goToHomeReady(page, homePage);

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
    const data = { ...defaultRegistrationData, name, email };
    await signupLoginPage.signup(name, email);

    const accountInfoPage = new SignupAccountInfoPage(page);
    await accountInfoPage.expectLoaded();
    await accountInfoPage.fillAccountDetails(data);
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

    await checkoutPage.placeOrder('Please deliver in the morning.');
    await page.waitForURL(/payment/, { waitUntil: 'domcontentloaded' });

    const paymentPage = new PaymentPage(page);
    await paymentPage.fillPaymentDetails(PAYMENT);
    await paymentPage.payAndConfirmButton.click();

    await paymentPage.expectOrderSuccess();

    await homePage.header.clickDeleteAccount();
    const accountDeletedPage = new AccountDeletedPage(page);
    await accountDeletedPage.expectLoaded();
    await accountDeletedPage.continueButton.click();
    await expect(page).toHaveURL(/\//);
  });
});
