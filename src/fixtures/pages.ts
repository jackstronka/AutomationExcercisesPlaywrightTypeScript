import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

type Pages = {
  homePage: HomePage;
};

const adPattern = /doubleclick|googlesyndication|googleadservices|adsbygoogle|adservice|facebook\.com\/tr/i;

export const test = base.extend<Pages>({
  context: async ({ context }, use) => {
    await context.route('**/*', (route) => {
      if (adPattern.test(route.request().url())) route.abort();
      else route.continue();
    });
    await use(context);
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from '@playwright/test';
