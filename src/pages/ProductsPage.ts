import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { clickDismissingOverlays, dismissOverlays } from './components/OverlayHelper';
import { HeaderNav } from './components/HeaderNav';

export class ProductsPage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/products');
    this.header = new HeaderNav(page);
  }

  get allProductsHeading(): Locator {
    return this.page.getByRole('heading', { name: /all products/i });
  }

  get viewProductLinks(): Locator {
    return this.page.getByRole('link', { name: /view product/i });
  }

  get viewProductFirst(): Locator {
    return this.viewProductLinks.first();
  }

  /** Products list visibility: use viewProductLinks.first() or allProductsHeading. */
  get productsList(): Locator {
    return this.viewProductLinks;
  }

  get searchedProductsHeading(): Locator {
    return this.page.getByRole('heading', { name: /searched products/i });
  }

  /** Product cards/links shown after search (same as viewProductLinks when on search results). */
  get searchedResultItems(): Locator {
    return this.viewProductLinks;
  }

  /** Product card containers (for hover + add to cart). First product = nth(0), second = nth(1). */
  get productCards(): Locator {
    return this.page.locator('.single-products');
  }

  get addToCartLinks(): Locator {
    return this.page.locator('a').filter({ hasText: /add to cart/i });
  }

  get continueShoppingButton(): Locator {
    return this.page.getByRole('button', { name: /continue shopping/i }).or(this.page.getByRole('link', { name: /continue shopping/i }));
  }

  get viewCartButton(): Locator {
    return this.page.getByRole('link', { name: /view cart/i }).or(this.page.getByRole('button', { name: /view cart/i }));
  }

  addToCartLinkInCard(productIndex: number): Locator {
    return this.productCards.nth(productIndex).locator('a').filter({ hasText: /add to cart/i }).first();
  }

  async addProductToCart(productIndex: number): Promise<void> {
    const card = this.productCards.nth(productIndex);
    await card.scrollIntoViewIfNeeded();
    await dismissOverlays(this.page);
    await card.hover();
    const addLink = this.addToCartLinkInCard(productIndex);
    await expect(addLink).toBeVisible({ timeout: 10000 });
    await clickDismissingOverlays(this.page, addLink, { timeout: 5000 });
  }

  async search(term: string): Promise<void> {
    await this.header.searchInput.fill(term);
    const searchForm = this.page.locator('form').filter({ has: this.header.searchInput });
    if ((await searchForm.count()) > 0) {
      await searchForm.first().evaluate((el: HTMLFormElement) => el.submit());
    } else {
      await this.page.goto(`/products?search=${encodeURIComponent(term)}`);
    }
    await expect(this.searchedProductsHeading).toBeVisible();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
  }
}

