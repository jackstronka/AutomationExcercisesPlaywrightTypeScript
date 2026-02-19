import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';

export class AccountCreatedPage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/account_created');
    this.header = new HeaderNav(page);
  }

  get accountCreatedHeading(): Locator {
    return this.page.getByRole('heading', { name: /account created!/i });
  }

  get continueButton(): Locator {
    return this.page.getByRole('link', { name: /continue/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible();
  }
}
