import { test, expect } from '../../../src/fixtures/test-fixtures';

test.describe('Login', () => {
  test('@smoke exposes the public sign-in shell', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.expectReady();

    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('enables submission only after the required credentials are provided', async ({
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.expectReady();

    await loginPage.expectSubmitState('disabled');

    await loginPage.emailInput.fill('qa.candidate@example.com');
    await loginPage.expectSubmitState('disabled');

    await loginPage.passwordInput.fill('StrongPass1!');
    await loginPage.expectSubmitState('enabled');
  });

  test('@smoke blocks login behind the CAPTCHA challenge', async ({ loginPage }) => {
    await loginPage.goto('/wallet');
    await loginPage.expectReady();

    await loginPage.fillCredentials('qa.candidate@example.com', 'StrongPass1!');
    await loginPage.submit();

    await loginPage.expectCaptchaGateVisible();
  });
});
