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
    await page.waitForURL(/\/products/, { waitUntil: 'load' });
    await expect(productsPage.allProductsHeading).toBeVisible({ timeout: 10000 });

    await productsPage.productCards.first().scrollIntoViewIfNeeded();
    await productsPage.productCards.first().hover();
    const firstAddToCart = productsPage.addToCartLinks.first();
    await firstAddToCart.click({ force: true });
    await expect(productsPage.continueShoppingButton).toBeVisible({ timeout: 5000 });
    await productsPage.continueShoppingButton.first().click();

    await productsPage.productCards.nth(1).hover();
    await productsPage.addToCartLinks.nth(2).click();
    await expect(productsPage.viewCartButton).toBeVisible({ timeout: 5000 });
    await productsPage.viewCartButton.first().click();

    await page.waitForURL(/view_cart/, { waitUntil: 'domcontentloaded' });
    const cartPage = new CartPage(page);
    await expect(cartPage.cartRows).toHaveCount(2, { timeout: 10000 });

    const rowCount = await cartPage.cartRows.count();
    expect(rowCount).toBe(2);

    const firstPrice = await cartPage.cartRows.nth(0).locator('.cart_price p').first().textContent();
    const secondPrice = await cartPage.cartRows.nth(1).locator('.cart_price p').first().textContent();
    expect(firstPrice).toBeTruthy();
    expect(secondPrice).toBeTruthy();

    const firstQuantity = await cartPage.cartRows.nth(0).locator('.cart_quantity').first().textContent();
    const secondQuantity = await cartPage.cartRows.nth(1).locator('.cart_quantity').first().textContent();
    expect(firstQuantity?.trim()).toBe('1');
    expect(secondQuantity?.trim()).toBe('1');

    const firstTotal = await cartPage.cartRows.nth(0).locator('.cart_total').first().textContent();
    const secondTotal = await cartPage.cartRows.nth(1).locator('.cart_total').first().textContent();
    expect(firstTotal).toBeTruthy();
    expect(secondTotal).toBeTruthy();
  });
});
