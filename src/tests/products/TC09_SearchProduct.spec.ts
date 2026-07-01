import { test, expect } from '@fixtures/pages';
import { clickDismissingOverlays, dismissOverlays } from '@pages/components/OverlayHelper';
import { ProductsPage } from '@pages/ProductsPage';

const SEARCH_TERM = 'top';

test.describe('TC09 Search Product', () => {
  test('search product and verify SEARCHED PRODUCTS and related results', {
    tag: ['@products'],
  }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await homePage.expectLoaded();

    await clickDismissingOverlays(page, homePage.header.products);
    const productsPage = new ProductsPage(page);
    await page.waitForURL(/\/products/, { waitUntil: 'domcontentloaded' });
    await productsPage.expectLoaded();
    await expect(page).toHaveURL(/\/products/);

    await productsPage.search(SEARCH_TERM);
    await expect(productsPage.searchedResultItems.first()).toBeVisible();
    await expect(productsPage.searchedResultItems).not.toHaveCount(0);
  });
});
