import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestCasesPage extends BasePage {
  constructor(page: Page) {
    super(page, '/test_cases');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /test cases/i }).first()).toBeVisible();
  }
}
