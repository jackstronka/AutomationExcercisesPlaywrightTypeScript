import { test, expect } from '@fixtures/pages';
import { dismissOverlays } from '@pages/components/OverlayHelper';
import { TestCasesPage } from '@pages/TestCasesPage';

test.describe('TC07 Verify Test Cases Page', () => {
  test('navigate to Test Cases and verify page', { tag: ['@navigation'] }, async ({ page, homePage }) => {
    await homePage.goto();
    await dismissOverlays(page);
    await homePage.expectLoaded();

    await homePage.header.testCases.click();
    await page.waitForURL(/test_cases/, { waitUntil: 'domcontentloaded' });
    const testCasesPage = new TestCasesPage(page);
    await testCasesPage.expectLoaded();
    await expect(page).toHaveURL(/test_cases/);
  });
});
