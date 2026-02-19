import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page, '/product_details');
  }

  private get productInfo(): Locator {
    return this.page.locator('.product-information').or(this.page.locator('#product-details'));
  }

  get productName(): Locator {
    return this.productInfo.locator('h2').first();
  }

  get category(): Locator {
    return this.page.getByText(/category:/i).first();
  }

  get price(): Locator {
    return this.productInfo.getByText(/rs\.\s*[\d,]+/i).first();
  }

  get availability(): Locator {
    return this.page.getByText(/availability:/i).first();
  }

  get condition(): Locator {
    return this.page.getByText(/condition:/i).first();
  }

  get brand(): Locator {
    return this.page.getByText(/brand:/i).first();
  }

  get quantityInput(): Locator {
    return this.productInfo.locator('input#quantity').or(this.page.locator('input[name="quantity"]'));
  }

  get addToCartButton(): Locator {
    return this.productInfo.getByRole('button', { name: /add to cart/i }).or(this.productInfo.locator('a').filter({ hasText: /add to cart/i }));
  }

  get viewCartButton(): Locator {
    return this.page.getByRole('link', { name: /view cart/i }).or(this.page.getByRole('button', { name: /view cart/i }));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/product_details\/\d+/);
    await expect(this.productName).toBeVisible();
    await expect(this.category).toBeVisible();
    await expect(this.price).toBeVisible();
    await expect(this.availability).toBeVisible();
    await expect(this.condition).toBeVisible();
    await expect(this.brand).toBeVisible();
  }
}
