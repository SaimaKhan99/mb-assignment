# Sample Test Summary

Verification date: March 26, 2026

Environment:

- base URL: `https://trade.mb.io`
- local timezone: `Asia/Calcutta`
- execution style: serialized per browser to avoid CAPTCHA/anti-bot instability on the live production target

Completed commands:

- `npm run lint`
- `npm run test:unit -- --project=chromium`
- `npm run test:ui -- --project=chromium`
- `npm run test:ui:smoke -- --project=firefox`

Results:

- lint: passed
- unit tests on Chromium: 4 passed in 1.1s
- full UI suite on Chromium: 14 passed in 43.5s
- smoke UI suite on Firefox: 7 passed in 27.6s

Artifacts in this folder:

- `latest-junit.xml`: JUnit report generated from the final Chromium UI run
- `chromium-login.png`
- `chromium-register-captcha.png`
- `firefox-forgot-password-captcha.png`
- `firefox-404.png`
