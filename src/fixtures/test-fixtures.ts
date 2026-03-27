import { test as base } from '@playwright/test';

import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { LoginPage } from '../pages/login.page';
import { NotFoundPage } from '../pages/not-found.page';
import { RegisterPage } from '../pages/register.page';

type Pages = {
  forgotPasswordPage: ForgotPasswordPage;
  loginPage: LoginPage;
  notFoundPage: NotFoundPage;
  registerPage: RegisterPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  notFoundPage: async ({ page }, use) => {
    await use(new NotFoundPage(page));
  },
});

export { expect } from '@playwright/test';
