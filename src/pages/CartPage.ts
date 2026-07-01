import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';

export class CartPage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/view_cart');
    this.header = new HeaderNav(page);
  }

  get shoppingCartHeading(): Locator {
    return this.page.getByRole('heading', { name: /shopping cart/i });
  }

  get cartEmptyMessage(): Locator {
    return this.page.getByText(/cart is empty/i);
  }

  get subscriptionHeading(): Locator {
    return this.page.getByText(/^subscription$/i);
  }

  get subscriptionEmailInput(): Locator {
    return this.page.locator('footer').getByPlaceholder(/email/i).or(this.page.getByText(/subscription/i).locator('..').getByPlaceholder(/email/i)).first();
  }

  get subscriptionArrowButton(): Locator {
    return this.page
      .locator('footer')
      .getByRole('button')
      .or(this.page.locator('footer').locator('input[type="submit"]'))
      .or(this.page.locator('footer').locator('button[type="submit"]'))
      .first();
  }

  get subscriptionSuccessMessage(): Locator {
    return this.page.getByText(/you have been successfully subscribed!/i);
  }

  get proceedToCheckoutButton(): Locator {
    return this.page.locator('a').filter({ hasText: /proceed to checkout/i }).or(this.page.getByRole('link', { name: /proceed to checkout/i }));
  }

  /** Cart item rows (table rows or .cart_item). */
  get cartRows(): Locator {
    return this.page.locator('#cart_info tbody tr').or(this.page.locator('.cart_item'));
  }

  /** Total price displayed (e.g. last row or total amount). */
  get cartTotalPrice(): Locator {
    return this.page.locator('.cart_total_price').or(this.page.getByText(/total/i).locator('..'));
  }

  cartRowPrice(rowIndex: number): Locator {
    return this.cartRows.nth(rowIndex).locator('.cart_price p').first();
  }

  cartRowQuantity(rowIndex: number): Locator {
    return this.cartRows.nth(rowIndex).locator('.cart_quantity').first();
  }

  cartRowTotal(rowIndex: number): Locator {
    return this.cartRows.nth(rowIndex).locator('.cart_total').first();
  }

  async expectCartItemDetails(rowIndex: number, quantity: string): Promise<void> {
    await expect(this.cartRowPrice(rowIndex)).not.toBeEmpty();
    await expect(this.cartRowQuantity(rowIndex)).toHaveText(quantity);
    await expect(this.cartRowTotal(rowIndex)).not.toBeEmpty();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.shoppingCartHeading.or(this.cartEmptyMessage)).toBeVisible();
  }
}

