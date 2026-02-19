import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';

export class SignupAccountInfoPage extends BasePage {
  readonly header: HeaderNav;

  constructor(page: Page) {
    super(page, '/signup');
    this.header = new HeaderNav(page);
  }

  get enterAccountInfoHeading(): Locator {
    return this.page.getByRole('heading', { name: /enter account information/i });
  }

  get titleMr(): Locator {
    return this.page.getByRole('radio', { name: /^mr\.?$/i });
  }

  get titleMrs(): Locator {
    return this.page.getByRole('radio', { name: /^mrs\.?$/i });
  }

  get passwordInput(): Locator {
    return this.page.locator('input#password');
  }

  get dayDropdown(): Locator {
    return this.page.locator('select#days');
  }

  get monthDropdown(): Locator {
    return this.page.locator('select#months');
  }

  get yearDropdown(): Locator {
    return this.page.locator('select#years');
  }

  get newsletterCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: /sign up for our newsletter/i });
  }

  get specialOffersCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: /receive special offers from our partners/i });
  }

  get firstNameInput(): Locator {
    return this.page.locator('input#first_name');
  }

  get lastNameInput(): Locator {
    return this.page.locator('input#last_name');
  }

  get companyInput(): Locator {
    return this.page.locator('input#company');
  }

  get address1Input(): Locator {
    return this.page.locator('input#address1');
  }

  get address2Input(): Locator {
    return this.page.locator('input#address2');
  }

  get countryDropdown(): Locator {
    return this.page.locator('select#country');
  }

  get stateInput(): Locator {
    return this.page.locator('input#state');
  }

  get cityInput(): Locator {
    return this.page.locator('input#city');
  }

  get zipcodeInput(): Locator {
    return this.page.locator('input#zipcode');
  }

  get mobileInput(): Locator {
    return this.page.locator('input#mobile_number');
  }

  get createAccountButton(): Locator {
    return this.page.getByRole('button', { name: /create account/i });
  }

  async setNewsletter(checked: boolean): Promise<void> {
    if (checked) await this.newsletterCheckbox.check();
    else await this.newsletterCheckbox.uncheck();
  }

  async setSpecialOffers(checked: boolean): Promise<void> {
    if (checked) await this.specialOffersCheckbox.check();
    else await this.specialOffersCheckbox.uncheck();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.enterAccountInfoHeading).toBeVisible();
  }
}
