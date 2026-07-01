import { test, expect } from '@fixtures/pages';
import { CartPage } from '@pages/CartPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { goToHomeReady } from '@utils/testHelpers';

const QUANTITY = 4;

test.describe('TC13 Verify Product quantity in Cart', () => {
  test('view product from home, set quantity to 4, add to cart, verify quantity in cart', {
    tag: ['@cart'],
  }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);

    await homePage.viewProductLink.click();
    await page.waitForURL(/\/product_details\/\d+/, { waitUntil: 'domcontentloaded' });
    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.expectLoaded();

    await productDetailPage.addToCartWithQuantity(QUANTITY);

    await expect(productDetailPage.viewCartButton).toBeVisible({ timeout: 5000 });
    await productDetailPage.viewCartButton.first().click();

    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    const cartPage = new CartPage(page);
    await expect(cartPage.cartRows).toHaveCount(1, { timeout: 10000 });
    await cartPage.expectCartItemDetails(0, String(QUANTITY));
  });
});
