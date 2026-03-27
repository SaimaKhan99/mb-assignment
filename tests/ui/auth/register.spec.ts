import { test, expect } from '../../../src/fixtures/test-fixtures';
import { createUniqueEmail } from '../../../src/utils/test-data';

test.describe('Registration', () => {
  test('@smoke shows the first-step registration form and return path to login', async ({
    registerPage,
    page,
  }) => {
    await registerPage.goto();
    await registerPage.expectReady();

    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('keeps the Next action disabled until valid credentials and terms acceptance are present', async ({
    registerPage,
  }) => {
    await registerPage.goto();
    await registerPage.expectReady();

    await registerPage.expectSubmitState('disabled');
    await registerPage.fillStepOne('qa.candidate@example.com', 'StrongPass1!');
    await registerPage.expectStrongPasswordIndicator();
    await registerPage.expectTermsState('false');
    await registerPage.expectSubmitState('disabled');

    await registerPage.toggleTerms();

    await registerPage.expectTermsState('true');
    await registerPage.expectSubmitState('enabled');
  });

  test('@smoke gates registration continuation behind the CAPTCHA challenge', async ({
    registerPage,
  }) => {
    await registerPage.goto();
    await registerPage.fillStepOne(createUniqueEmail(), 'StrongPass1!');
    await registerPage.toggleTerms();
    await registerPage.expectSubmitState('enabled');

    await registerPage.submit();

    await registerPage.expectCaptchaGateVisible();
  });
});
