import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays, dismissOverlays } from '@pages/components/OverlayHelper';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { ProductsPage } from '@pages/ProductsPage';

test.describe('TC08 Verify All Products and product detail page', () => {
  test('navigate to All Products, verify list, open first product and verify details', {
    tag: ['@products'],
  }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await expect(page.getByRole('heading', { name: /full-fledged practice website/i }).first()).toBeVisible();

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
