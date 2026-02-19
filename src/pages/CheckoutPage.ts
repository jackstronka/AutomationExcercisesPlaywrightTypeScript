import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page, '/checkout');
  }

  get registerLoginLink(): Locator {
    return this.page.getByRole('link', { name: /register\s*\/\s*login/i }).or(this.page.getByText(/register\s*\/\s*login/i));
  }

  get addressDetailsHeading(): Locator {
    return this.page.getByRole('heading', { name: /address details/i }).or(this.page.getByText(/address details/i));
  }

  get reviewOrderHeading(): Locator {
    return this.page.getByRole('heading', { name: /review your order/i }).or(this.page.getByText(/review your order/i));
  }

  get commentTextarea(): Locator {
    return this.page.getByPlaceholder(/comment|message/i).or(this.page.locator('textarea[name="message"]'));
  }

  get placeOrderButton(): Locator {
    return this.page.getByRole('link', { name: /place order/i }).or(this.page.getByRole('button', { name: /place order/i }));
  }
}
