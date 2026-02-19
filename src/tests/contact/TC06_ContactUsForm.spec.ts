import path from 'node:path';
import { test, expect } from '@fixtures/pages';
import { dismissOverlays } from '@pages/components/OverlayHelper';
import { ContactUsPage } from '@pages/ContactUsPage';
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

    await homePage.goto();
    await dismissOverlays(page);
    await homePage.expectLoaded();

    await homePage.header.contactUs.click();
    const contactUsPage = new ContactUsPage(page);
    await page.waitForURL(/contact_us/, { waitUntil: 'domcontentloaded' });
    await expect(contactUsPage.getInTouchHeading).toBeVisible();

    await contactUsPage.nameInput.first().fill(name);
    await contactUsPage.emailInput.first().fill(email);
    await contactUsPage.subjectInput.first().fill(subject);
    await contactUsPage.messageInput.first().fill(message);
    await contactUsPage.fileInput.setInputFiles(UPLOAD_FILE_PATH);

    page.once('dialog', (dialog) => dialog.accept());

    await contactUsPage.submitButton.click();

    await expect(contactUsPage.successMessage).toBeVisible();

    await contactUsPage.homeLink.click();
    await expect(page).toHaveURL(/\/(\?.*)?$/);
    await homePage.expectLoaded();
  });
});
