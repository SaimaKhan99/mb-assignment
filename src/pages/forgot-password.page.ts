import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '../core/base-page';

export class ForgotPasswordPage extends BasePage {
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[placeholder="example@mail.com"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.backLink = page.getByRole('link', { name: 'Back' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.buildUrl('/forgot-password'), {
      waitUntil: 'domcontentloaded',
    });
  }

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/forgot-password$/);
    await expect(
      this.page.getByRole('heading', { name: 'Forgot Password' }),
    ).toBeVisible();
    await expect(this.page.getByText('we’ll send an email')).toBeVisible();
    await expect(this.emailInput).toBeVisible();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async submit(): Promise<void> {
    await this.continueButton.click();
  }

  async expectSubmitState(expectedState: 'enabled' | 'disabled'): Promise<void> {
    await this.expectFormSubmitState(this.continueButton, expectedState);
  }

  async expectCaptchaGateVisible(): Promise<void> {
    await this.expectCaptchaGate();
  }
}
