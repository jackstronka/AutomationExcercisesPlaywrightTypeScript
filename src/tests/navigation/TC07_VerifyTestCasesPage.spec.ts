import { test, expect } from '@fixtures/pages';
import { TestCasesPage } from '@pages/TestCasesPage';
import { goToHomeReady } from '@utils/testHelpers';

test.describe('TC07 Verify Test Cases Page', () => {
  test('navigate to Test Cases and verify page', { tag: ['@navigation'] }, async ({ page, homePage }) => {
    await goToHomeReady(page, homePage);

    await homePage.header.testCases.click();
    await page.waitForURL(/test_cases/, { waitUntil: 'domcontentloaded' });
    const testCasesPage = new TestCasesPage(page);
    await testCasesPage.expectLoaded();
    await expect(page).toHaveURL(/test_cases/);
  });
});
