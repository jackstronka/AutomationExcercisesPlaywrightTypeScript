import { test, expect } from '@fixtures/pages';
import { CartPage } from '@pages/CartPage';
import { ContactUsPage } from '@pages/ContactUsPage';
import { ProductsPage } from '@pages/ProductsPage';
import { SignupLoginPage } from '@pages/SignupLoginPage';
import { goToHomeReady } from '@utils/testHelpers';

test.describe('Smoke: navigation', () => {
  test('key pages are reachable (direct URL)', { tag: ['@smoke'] }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);

    await page.goto('/products');
    await new ProductsPage(page).expectLoaded();

    await page.goto('/view_cart');
    await new CartPage(page).expectLoaded();

    await page.goto('/login');
    await new SignupLoginPage(page).expectLoaded();

    await page.goto('/contact_us');
    await new ContactUsPage(page).expectLoaded();

    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
  });
});
