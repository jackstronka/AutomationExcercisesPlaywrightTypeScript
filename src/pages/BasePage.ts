import { type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page, protected readonly path = '') {}

  get url(): string {
    return this.path;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
