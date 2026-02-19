import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
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

  async expectLoaded(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
  }
}

