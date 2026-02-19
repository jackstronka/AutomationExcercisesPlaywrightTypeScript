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

    await productsPage.header.searchInput.fill(SEARCH_TERM);
    const searchForm = page.locator('form').filter({ has: productsPage.header.searchInput });
    if ((await searchForm.count()) > 0) {
      await searchForm.first().evaluate((el: HTMLFormElement) => el.submit());
    } else {
      await page.goto(`/products?search=${encodeURIComponent(SEARCH_TERM)}`);
    }
    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await expect(productsPage.searchedResultItems.first()).toBeVisible();
    const count = await productsPage.searchedResultItems.count();
    expect(count).toBeGreaterThan(0);
  });
});
