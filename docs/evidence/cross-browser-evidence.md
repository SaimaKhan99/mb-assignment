# Cross-Browser Evidence

Evidence date: March 26, 2026

Executed locally:

- Chromium
  Command: `npm run test:ui -- --project=chromium`
  Result: 14 UI tests passed in 43.5s
  Report reference: `latest-junit.xml`
  Screenshots: `chromium-login.png`, `chromium-register-captcha.png`

- Firefox
  Command: `npm run test:ui:smoke -- --project=firefox`
  Result: 7 smoke tests passed in 27.6s
  Screenshots: `firefox-forgot-password-captcha.png`, `firefox-404.png`

Configured in CI:

- WebKit
  The repository CI workflow includes a dedicated WebKit smoke job via `.github/workflows/ci.yml`.
  It was configured but not executed locally in this environment.
