import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '../core/base-page';

export class NotFoundPage extends BasePage {
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('searchbox', { name: 'Search' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.buildUrl('/404'), { waitUntil: 'domcontentloaded' });
  }

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/404$/);
    await expect(this.page.getByText('Page Not Found')).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Explore' })).toBeVisible();
  }
}
