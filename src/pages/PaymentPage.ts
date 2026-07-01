import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expirationMonth: string;
  expirationYear: string;
};

export class PaymentPage extends BasePage {
  constructor(page: Page) {
    super(page, '/payment');
  }

  get nameOnCardInput(): Locator {
    return this.page.getByPlaceholder(/name on card/i).or(this.page.getByLabel(/name on card/i)).or(this.page.locator('input[name="name_on_card"]'));
  }

  get cardNumberInput(): Locator {
    return this.page.getByPlaceholder(/card number/i).or(this.page.getByLabel(/card number/i)).or(this.page.locator('input[name="card_number"]'));
  }

  get cvcInput(): Locator {
    return this.page.getByPlaceholder(/cvc|cvv/i).or(this.page.getByLabel(/cvc|cvv/i)).or(this.page.locator('input[name="cvc"]'));
  }

  get expirationMonthInput(): Locator {
    return this.page.getByPlaceholder(/expiration|month|mm/i).or(this.page.getByLabel(/month/i)).or(this.page.locator('input[name="expiry_month"]'));
  }

  get expirationYearInput(): Locator {
    return this.page.getByPlaceholder(/year|yy|yyyy/i).or(this.page.getByLabel(/year/i)).or(this.page.locator('input[name="expiry_year"]'));
  }

  /** Single expiration field (MM/YY) if the site uses one input. */
  get expirationInput(): Locator {
    return this.expirationMonthInput.or(this.page.locator('input[name="expiry"]'));
  }

  get payAndConfirmButton(): Locator {
    return this.page.getByRole('button', { name: /pay and confirm order/i }).or(this.page.getByRole('link', { name: /pay and confirm order/i }));
  }

  get orderSuccessMessage(): Locator {
    return this.page.getByText(/your order has been placed successfully!/i);
  }

  async fillPaymentDetails(payment: PaymentDetails): Promise<void> {
    const expiration = payment.expirationMonth + payment.expirationYear;
    const formInputs = this.page.locator('form').locator('input[type="text"]');
    if ((await formInputs.count()) >= 4) {
      await formInputs.nth(0).fill(payment.nameOnCard);
      await formInputs.nth(1).fill(payment.cardNumber);
      await formInputs.nth(2).fill(payment.cvc);
      await formInputs.nth(3).fill(expiration);
      await this.expectPaymentFormInputsFilled(formInputs, payment, expiration);
      return;
    }

    await this.nameOnCardInput.first().fill(payment.nameOnCard);
    await this.cardNumberInput.first().fill(payment.cardNumber);
    await this.cvcInput.first().fill(payment.cvc);
    await this.expirationInput.first().fill(expiration);
    await this.expectPaymentDetailsFilled(payment, expiration);
  }

  private async expectPaymentFormInputsFilled(
    formInputs: Locator,
    payment: PaymentDetails,
    expiration: string,
  ): Promise<void> {
    await expect(formInputs.nth(0)).toHaveValue(payment.nameOnCard);
    await expect(formInputs.nth(1)).toHaveValue(payment.cardNumber);
    await expect(formInputs.nth(2)).toHaveValue(payment.cvc);
    await expect(formInputs.nth(3)).toHaveValue(expiration);
  }

  private async expectPaymentDetailsFilled(payment: PaymentDetails, expiration: string): Promise<void> {
    await expect(this.nameOnCardInput.first()).toHaveValue(payment.nameOnCard);
    await expect(this.cardNumberInput.first()).toHaveValue(payment.cardNumber);
    await expect(this.cvcInput.first()).toHaveValue(payment.cvc);
    await expect(this.expirationInput.first()).toHaveValue(expiration);
  }

  /** Success message - assert text is present in page (element may be in DOM before visible). */
  async expectOrderSuccess(): Promise<void> {
    await expect(this.page.locator('body')).toContainText(/your order has been placed successfully!/i, { timeout: 15000 });
  }
}
