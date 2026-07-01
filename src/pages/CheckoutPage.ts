import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { clickDismissingOverlays } from './components/OverlayHelper';

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

  async goToRegisterLogin(): Promise<void> {
    await clickDismissingOverlays(this.page, this.registerLoginLink.first());
    const reachedLogin = await this.page
      .waitForURL(/\/login/, { timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (!reachedLogin) {
      await this.page.goto('/login');
    }
    await expect(this.page).toHaveURL(/\/login/);
  }

  async placeOrder(comment?: string): Promise<void> {
    if (comment) {
      await this.commentTextarea.fill(comment);
      await expect(this.commentTextarea).toHaveValue(comment);
    }
    await this.placeOrderButton.first().click();
  }
}
