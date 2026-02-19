import { test, expect } from '@fixtures/pages';
import { dismissOverlays } from '@pages/components/OverlayHelper';
import { CartPage } from '@pages/CartPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';

const QUANTITY = 4;

test.describe('TC13 Verify Product quantity in Cart', () => {
  test('view product from home, set quantity to 4, add to cart, verify quantity in cart', {
    tag: ['@cart'],
  }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await expect(page.getByRole('heading', { name: /full-fledged practice website/i }).first()).toBeVisible();

    await homePage.viewProductLink.click();
    await page.waitForURL(/\/product_details\/\d+/, { waitUntil: 'domcontentloaded' });
    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.expectLoaded();

    await productDetailPage.quantityInput.fill(String(QUANTITY));
    await productDetailPage.addToCartButton.click();

    await expect(productDetailPage.viewCartButton).toBeVisible({ timeout: 5000 });
    await productDetailPage.viewCartButton.first().click();

    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    const cartPage = new CartPage(page);
    await expect(cartPage.cartRows).toHaveCount(1, { timeout: 10000 });

    const quantityText = await cartPage.cartRows.nth(0).locator('.cart_quantity').first().textContent();
    expect(quantityText?.trim()).toBe(String(QUANTITY));
  });
});
