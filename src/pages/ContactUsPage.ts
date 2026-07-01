import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';

export class ContactUsPage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/contact_us');
    this.header = new HeaderNav(page);
  }

  get getInTouchHeading(): Locator {
    return this.page.getByRole('heading', { name: /get in touch/i });
  }

  get nameInput(): Locator {
    return this.page.getByPlaceholder(/name/i).or(this.page.getByLabel(/name/i));
  }

  get emailInput(): Locator {
    return this.page.getByPlaceholder(/email/i).or(this.page.getByLabel(/email/i));
  }

  get subjectInput(): Locator {
    return this.page.getByPlaceholder(/subject/i).or(this.page.getByLabel(/subject/i));
  }

  get messageInput(): Locator {
    return this.page.getByPlaceholder(/message/i).or(this.page.getByLabel(/message/i));
  }

  get fileInput(): Locator {
    return this.page.locator('input[type="file"]');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /submit/i });
  }

  get successMessage(): Locator {
    return this.page.locator('#contact-page').getByText(/success! your details have been submitted successfully/i);
  }

  /** Home link in contact section (e.g. after success); falls back to any Home link if needed */
  get homeLink(): Locator {
    return this.page.locator('#contact-page').getByRole('link', { name: /home/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.getInTouchHeading).toBeVisible();
  }

  async fillContactForm(data: { name: string; email: string; subject: string; message: string }): Promise<void> {
    await this.nameInput.first().fill(data.name);
    await this.emailInput.first().fill(data.email);
    await this.subjectInput.first().fill(data.subject);
    await this.messageInput.first().fill(data.message);
    await this.expectContactFormFilled(data);
  }

  private async expectContactFormFilled(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await expect(this.nameInput.first()).toHaveValue(data.name);
    await expect(this.emailInput.first()).toHaveValue(data.email);
    await expect(this.subjectInput.first()).toHaveValue(data.subject);
    await expect(this.messageInput.first()).toHaveValue(data.message);
  }

  async submitContactForm(
    data: { name: string; email: string; subject: string; message: string },
    filePath: string,
  ): Promise<void> {
    await this.fillContactForm(data);
    await this.fileInput.setInputFiles(filePath);
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }
}

