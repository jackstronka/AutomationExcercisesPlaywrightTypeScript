import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

type Pages = {
  homePage: HomePage;
};

const adPattern = /doubleclick|googlesyndication|googleadservices|adsbygoogle|adservice|facebook\.com\/tr/i;

export const test = base.extend<Pages>({
  context: async ({ context }, use) => {
    // Opt out of Chrome's native "translate this page" bar. Chromium removed the ability to
    // disable it via launch flags (--disable-features=Translate no longer works), so we use the
    // documented HTML opt-out (translate="no" / meta notranslate), injected on every page.
    // See https://github.com/microsoft/playwright/issues/36699
    await context.addInitScript(() => {
      const optOut = () => {
        document.documentElement?.setAttribute('translate', 'no');
        if (document.head && !document.head.querySelector('meta[name="google"][content="notranslate"]')) {
          const meta = document.createElement('meta');
          meta.name = 'google';
          meta.content = 'notranslate';
          document.head.appendChild(meta);
        }
      };
      optOut();
      document.addEventListener('DOMContentLoaded', optOut);
    });
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
