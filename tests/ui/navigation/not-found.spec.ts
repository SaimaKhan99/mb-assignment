import { test } from '../../../src/fixtures/test-fixtures';

test.describe('Public fallback route', () => {
  test('@smoke keeps the 404 shell functional', async ({ notFoundPage }) => {
    await notFoundPage.goto();
    await notFoundPage.expectReady();
  });
});
