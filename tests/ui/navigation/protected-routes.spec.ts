import { test, expect } from '../../../src/fixtures/test-fixtures';

const protectedRoutes = [
  { target: '/', expectedNext: '/' },
  { target: '/explore', expectedNext: '/explore' },
  { target: '/wallet', expectedNext: '/wallet' },
  { target: '/price/LTC', expectedNext: '/price/LTC' },
];

test.describe('Protected routes', () => {
  for (const route of protectedRoutes) {
    test(`redirects ${route.target} to login with the original target preserved`, async ({
      page,
    }) => {
      await page.goto(route.target, { waitUntil: 'domcontentloaded' });

      await expect(page).toHaveURL(/\/login/);

      const redirectedUrl = new URL(page.url());
      expect(redirectedUrl.pathname).toBe('/login');
      expect(redirectedUrl.searchParams.get('next')).toBe(route.expectedNext);
    });
  }
});
