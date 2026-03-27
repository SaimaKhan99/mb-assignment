import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '../core/base-page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordLink: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[placeholder="Email address"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
    this.submitButton = page.locator('button[type="submit"]').filter({ hasText: 'Log In' });
  }

  async goto(nextPath?: string): Promise<void> {
    const suffix = nextPath ? `?next=${encodeURIComponent(nextPath)}` : '';
    await this.page.goto(this.buildUrl(`/login${suffix}`), { waitUntil: 'domcontentloaded' });
  }

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectSubmitState(expectedState: 'enabled' | 'disabled'): Promise<void> {
    await this.expectFormSubmitState(this.submitButton, expectedState);
  }

  async expectCaptchaGateVisible(): Promise<void> {
    await this.expectCaptchaGate();
  }
}
