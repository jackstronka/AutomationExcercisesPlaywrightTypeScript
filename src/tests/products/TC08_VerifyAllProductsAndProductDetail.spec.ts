import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays } from '@pages/components/OverlayHelper';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { ProductsPage } from '@pages/ProductsPage';
import { goToHomeReady } from '@utils/testHelpers';

test.describe('TC08 Verify All Products and product detail page', () => {
  test('navigate to All Products, verify list, open first product and verify details', {
    tag: ['@products'],
  }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);

    await clickDismissingOverlays(page, homePage.header.products);
    const productsPage = new ProductsPage(page);
    await page.waitForURL(/\/products/, { waitUntil: 'domcontentloaded' });
    await productsPage.expectLoaded();
    await expect(page).toHaveURL(/\/products/);

    await expect(productsPage.viewProductLinks.first()).toBeVisible();

    await productsPage.viewProductFirst.click();
    await page.waitForURL(/\/product_details\/\d+/, { waitUntil: 'domcontentloaded' });
    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.expectLoaded();
  });
});
