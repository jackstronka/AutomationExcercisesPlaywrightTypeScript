import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';

export class AccountDeletedPage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/delete_account');
    this.header = new HeaderNav(page);
  }

  get accountDeletedHeading(): Locator {
    return this.page.getByRole('heading', { name: /account deleted!/i });
  }

  get continueButton(): Locator {
    return this.page.getByRole('link', { name: /continue/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.accountDeletedHeading).toBeVisible();
  }
}
