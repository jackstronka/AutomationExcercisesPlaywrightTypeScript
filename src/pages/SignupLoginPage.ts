import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';

export class SignupLoginPage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/login');
    this.header = new HeaderNav(page);
  }

  get loginToYourAccountHeading(): Locator {
    return this.page.getByRole('heading', { name: /login to your account/i });
  }

  get newUserSignupHeading(): Locator {
    return this.page.getByRole('heading', { name: /new user signup/i });
  }

  private get signupForm(): Locator {
    return this.page.locator('form').filter({ hasText: /new user signup|signup/i });
  }

  get signupNameInput(): Locator {
    return this.signupForm.getByPlaceholder(/^name$/i);
  }

  get signupEmailInput(): Locator {
    return this.signupForm.getByPlaceholder(/email address/i);
  }

  get signupButton(): Locator {
    return this.page.getByRole('button', { name: /^signup$/i });
  }

  /** Login form (form with Login button, not Signup). */
  private get loginForm(): Locator {
    return this.page.locator('form').filter({ has: this.page.getByRole('button', { name: /^login$/i }) });
  }

  get loginEmailInput(): Locator {
    return this.loginForm.getByPlaceholder(/email|email address/i);
  }

  get loginPasswordInput(): Locator {
    return this.loginForm.getByPlaceholder(/password/i);
  }

  get loginButton(): Locator {
    return this.loginForm.getByRole('button', { name: /^login$/i });
  }

  get loginErrorMessage(): Locator {
    return this.page.getByText(/your email or password is incorrect/i);
  }

  get signupEmailAlreadyExistsError(): Locator {
    return this.page.getByText(/email address already exist/i);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.loginToYourAccountHeading.or(this.newUserSignupHeading).first()).toBeVisible();
  }

  async signup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.expectSignupFormFilled(name, email);
    await this.signupButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.expectLoginFormFilled(email, password);
    await this.loginButton.click();
  }

  private async expectSignupFormFilled(name: string, email: string): Promise<void> {
    await expect(this.signupNameInput).toHaveValue(name);
    await expect(this.signupEmailInput).toHaveValue(email);
  }

  private async expectLoginFormFilled(email: string, password: string): Promise<void> {
    await expect(this.loginEmailInput).toHaveValue(email);
    await expect(this.loginPasswordInput).toHaveValue(password);
  }
}

