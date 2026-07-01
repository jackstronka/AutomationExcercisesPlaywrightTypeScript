import path from 'node:path';
import { test, expect } from '@fixtures/pages';
import { ContactUsPage } from '@pages/ContactUsPage';
import { goToHomeReady } from '@utils/testHelpers';
import { uniqueEmail, uniqueName } from '@utils/testData';

const UPLOAD_FILE_PATH = path.join(process.cwd(), 'src/testdata/upload.txt');

test.describe('TC06 Contact Us Form', () => {
  test('submit contact form with file upload, verify success, return home', {
    tag: ['@contact'],
  }, async ({ page, homePage }) => {
    const name = uniqueName('Contact');
    const email = uniqueEmail('contact');
    const subject = 'Test subject';
    const message = 'Test message for contact form.';

    await goToHomeReady(page, homePage);

    await homePage.header.contactUs.click();
    const contactUsPage = new ContactUsPage(page);
    await page.waitForURL(/contact_us/, { waitUntil: 'domcontentloaded' });
    await contactUsPage.expectLoaded();

    await contactUsPage.submitContactForm({ name, email, subject, message }, UPLOAD_FILE_PATH);

    await expect(contactUsPage.successMessage).toBeVisible();

    await contactUsPage.homeLink.click();
    await expect(page).toHaveURL(/\/(\?.*)?$/);
    await homePage.expectLoaded();
  });
});
