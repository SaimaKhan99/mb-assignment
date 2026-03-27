import { expect, type Locator, type Page } from '@playwright/test';

import { environment } from '../config/environment';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected buildUrl(path: string): string {
    return new URL(path, environment.baseUrl).toString();
  }

  protected async expectCaptchaGate(): Promise<void> {
    await expect(this.page.getByText('Slide to complete the puzzle')).toBeVisible();
  }

  protected async expectFormSubmitState(
    submitButton: Locator,
    expectedState: 'enabled' | 'disabled',
  ): Promise<void> {
    if (expectedState === 'enabled') {
      await expect(submitButton).toBeEnabled();
      return;
    }

    await expect(submitButton).toBeDisabled();
  }
}
