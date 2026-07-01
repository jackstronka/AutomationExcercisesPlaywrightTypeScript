import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderNav } from './components/HeaderNav';
import type { RegistrationData } from '@testdata/registration';

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

  async fillAccountDetails(data: RegistrationData): Promise<void> {
    if (data.title === 'Mr') await this.titleMr.check();
    else await this.titleMrs.check();
    await this.passwordInput.fill(data.password);
    await this.dayDropdown.selectOption(data.day);
    await this.monthDropdown.selectOption(data.month);
    await this.yearDropdown.selectOption(data.year);
    await this.setNewsletter(data.newsletter);
    await this.setSpecialOffers(data.specialOffers);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.companyInput.fill(data.company);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.countryDropdown.selectOption({ label: data.country });
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileInput.fill(data.mobile);
    await this.expectAccountDetailsFilled(data);
  }

  private async expectAccountDetailsFilled(data: RegistrationData): Promise<void> {
    if (data.title === 'Mr') await expect(this.titleMr).toBeChecked();
    else await expect(this.titleMrs).toBeChecked();
    await expect(this.passwordInput).toHaveValue(data.password);
    await expect(this.dayDropdown).toHaveValue(data.day);
    await expect(this.monthDropdown).toHaveValue(data.month);
    await expect(this.yearDropdown).toHaveValue(data.year);
    if (data.newsletter) await expect(this.newsletterCheckbox).toBeChecked();
    else await expect(this.newsletterCheckbox).not.toBeChecked();
    if (data.specialOffers) await expect(this.specialOffersCheckbox).toBeChecked();
    else await expect(this.specialOffersCheckbox).not.toBeChecked();
    await expect(this.firstNameInput).toHaveValue(data.firstName);
    await expect(this.lastNameInput).toHaveValue(data.lastName);
    await expect(this.companyInput).toHaveValue(data.company);
    await expect(this.address1Input).toHaveValue(data.address1);
    await expect(this.address2Input).toHaveValue(data.address2);
    await expect(this.stateInput).toHaveValue(data.state);
    await expect(this.cityInput).toHaveValue(data.city);
    await expect(this.zipcodeInput).toHaveValue(data.zipcode);
    await expect(this.mobileInput).toHaveValue(data.mobile);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.enterAccountInfoHeading).toBeVisible();
  }
}
