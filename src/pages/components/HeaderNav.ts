import { type Locator, type Page } from '@playwright/test';

export class HeaderNav {
  constructor(private readonly page: Page) {}

  get home(): Locator {
    return this.page.getByRole('link', { name: /^home$/i });
  }

  get products(): Locator {
    return this.page.locator('header').getByRole('link', { name: /products/i }).first();
  }

  get cart(): Locator {
    return this.page.locator('header').getByRole('link', { name: /cart/i }).first();
  }

  get signupLogin(): Locator {
    return this.page.getByRole('link', { name: /signup\s*\/\s*login/i });
  }

  get contactUs(): Locator {
    return this.page.getByRole('link', { name: /contact\s*us/i });
  }

  get testCases(): Locator {
    return this.page.getByRole('link', { name: /test\s*cases/i }).first();
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i).or(this.page.getByRole('searchbox'));
  }

  get searchButton(): Locator {
    const inHeader = this.page.locator('header');
    return inHeader
      .getByRole('button', { name: /search/i })
      .or(inHeader.locator('button[type="submit"], input[type="submit"]'))
      .first();
  }

  get loggedInAs(): Locator {
    return this.page.getByText(/logged in as /i);
  }

  get deleteAccount(): Locator {
    return this.page.getByRole('link', { name: /delete account/i });
  }

  get logout(): Locator {
    return this.page.getByRole('link', { name: /logout/i });
  }
}

