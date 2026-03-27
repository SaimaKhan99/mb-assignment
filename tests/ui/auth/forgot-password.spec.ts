import { test, expect } from '../../../src/fixtures/test-fixtures';

test.describe('Forgot Password', () => {
  test('@smoke is reachable from login and can navigate back', async ({
    loginPage,
    forgotPasswordPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();

    await forgotPasswordPage.expectReady();

    await forgotPasswordPage.backLink.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('enables reset initiation only after a valid email is entered', async ({
    forgotPasswordPage,
  }) => {
    await forgotPasswordPage.goto();
    await forgotPasswordPage.expectReady();

    await forgotPasswordPage.expectSubmitState('disabled');
    await forgotPasswordPage.fillEmail('qa.candidate@example.com');
    await forgotPasswordPage.expectSubmitState('enabled');
  });

  test('@smoke blocks password recovery behind the CAPTCHA challenge', async ({
    forgotPasswordPage,
  }) => {
    await forgotPasswordPage.goto();
    await forgotPasswordPage.fillEmail('qa.candidate@example.com');
    await forgotPasswordPage.submit();

    await forgotPasswordPage.expectCaptchaGateVisible();
  });
});
