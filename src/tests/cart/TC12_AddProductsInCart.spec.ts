import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays, dismissOverlays } from '@pages/components/OverlayHelper';
import { CartPage } from '@pages/CartPage';
import { ProductsPage } from '@pages/ProductsPage';

test.describe('TC12 Add Products in Cart', () => {
  test('add two products to cart, continue shopping, then view cart and verify items and total', {
    tag: ['@cart'],
  }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await homePage.expectLoaded();

    await clickDismissingOverlays(page, homePage.header.products);
    const productsPage = new ProductsPage(page);
    await page.waitForURL(/\/products/, { waitUntil: 'domcontentloaded' });
    await expect(productsPage.allProductsHeading).toBeVisible({ timeout: 10000 });

    await productsPage.addProductToCart(0);
    await expect(productsPage.continueShoppingButton).toBeVisible({ timeout: 5000 });
    await productsPage.continueShoppingButton.first().click();

    await productsPage.addProductToCart(1);
    await expect(productsPage.viewCartButton).toBeVisible({ timeout: 5000 });
    await productsPage.viewCartButton.first().click();

    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    const cartPage = new CartPage(page);
    await expect(cartPage.cartRows).toHaveCount(2, { timeout: 10000 });

    await cartPage.expectCartItemDetails(0, '1');
    await cartPage.expectCartItemDetails(1, '1');
  });
});
