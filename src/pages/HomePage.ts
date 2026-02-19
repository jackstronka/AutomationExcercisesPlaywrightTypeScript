import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';

export class HomePage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/');
    this.header = new HeaderNav(page);
  }

  /** Asserts the home page is loaded (header nav visible). */
  async expectLoaded(): Promise<void> {
    await expect(this.header.products).toBeVisible();
  }

  get signupLoginLink() {
    return this.header.signupLogin;
  }

  get productsLink() {
    return this.header.products;
  }

  /** First 'View Product' link on home page (for any product). */
  get viewProductLink(): Locator {
    return this.page.getByRole('link', { name: /view product/i }).first();
  }

  /** Footer subscription section (scroll to footer to see it). */
  get subscriptionSection(): Locator {
    return this.page.locator('footer').or(this.page.getByText(/subscription/i).locator('..'));
  }

  get subscriptionHeading(): Locator {
    return this.page.getByText(/^subscription$/i);
  }

  get subscriptionEmailInput(): Locator {
    return this.page.locator('footer').getByPlaceholder(/email/i).or(this.page.getByText(/subscription/i).locator('..').getByPlaceholder(/email/i)).first();
  }

  /** Arrow button to submit subscription (icon button or submit in footer). */
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

  async openSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }
}
