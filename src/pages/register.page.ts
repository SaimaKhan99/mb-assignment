import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '../core/base-page';

export class RegisterPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly loginLink: Locator;
  readonly termsSwitch: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[placeholder="Email address"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.nextButton = page.locator('button[type="submit"]').filter({ hasText: 'Next' });
    this.loginLink = page.getByRole('link', { name: 'Log In', exact: true }).last();
    this.termsSwitch = page.locator('[role="switch"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.buildUrl('/register'), { waitUntil: 'domcontentloaded' });
  }

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/register$/);
    await expect(this.page.getByText('Create account')).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(
      this.page.getByText('I certify that I am 18 years of age or older'),
    ).toBeVisible();
  }

  async fillStepOne(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async toggleTerms(): Promise<void> {
    await this.termsSwitch.click();
  }

  async expectStrongPasswordIndicator(): Promise<void> {
    await expect(this.page.getByText('Strong')).toBeVisible();
  }

  async expectSubmitState(expectedState: 'enabled' | 'disabled'): Promise<void> {
    await this.expectFormSubmitState(this.nextButton, expectedState);
  }

  async expectTermsState(expectedState: 'true' | 'false'): Promise<void> {
    await expect(this.termsSwitch).toHaveAttribute('aria-checked', expectedState);
  }

  async submit(): Promise<void> {
    await this.nextButton.click();
  }

  async expectCaptchaGateVisible(): Promise<void> {
    await this.expectCaptchaGate();
  }
}
