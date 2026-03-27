# MultiBank QA Automation Take-Home

This repository contains a production-style Playwright framework for the MultiBank trading platform take-home, plus a standalone coding exercise for Task 2.

The live application under test is `https://trade.mb.io` (the legacy `https://trade.multibank.io` URL now redirects there as of March 26, 2026).

## Scope

Because the assessment email did not include the actual challenge document URL or any reusable test credentials, the suite targets critical flows that are both real and safely executable against the public production surface:

- login form readiness, gating, and CAPTCHA boundary
- registration step-one validation, terms acceptance, and CAPTCHA boundary
- forgot-password entry and CAPTCHA boundary
- protected-route redirects that preserve the original intended destination
- public 404 shell availability

For Task 2, I implemented a small order-matching engine in `src/challenge/order-matching.ts`. It is domain-relevant to a trading platform and demonstrates core programming fundamentals: validation, sorting, price-time priority, partial fills, and deterministic unit tests.

## Stack

- Playwright Test
- TypeScript
- Page Object Model with custom fixtures
- HTML + JUnit reporting
- GitHub Actions CI for linting, unit coverage, and cross-browser smoke execution

## Project Structure

```text
src/
  challenge/      Coding exercise implementation
  config/         Environment and runtime configuration
  core/           Shared page abstractions
  fixtures/       Playwright fixture extensions
  pages/          Page objects for auth and public shell routes
  utils/          Test data helpers
tests/
  ui/             Browser E2E coverage
  unit/           Task 2 unit coverage
docs/evidence/    Sample reports, screenshots, and browser-run evidence
```

## Design Decisions

- Stable selectors first: the tests favor placeholders, roles, and visible text over CSS-class selectors.
- No fixed waits in assertions: interaction steps wait on visible state or enabled-state transitions. The few short waits used during exploration are not part of the committed suite.
- Production-safe coverage: no account takeover attempts, destructive actions, or assumptions about internal data.
- Browser matrix in CI: smoke coverage is designed to run across Chromium, Firefox, and WebKit in GitHub Actions with Playwright-managed dependencies.
- CAPTCHA treated as a system boundary: the suite verifies that sensitive auth flows correctly hand off to the challenge rather than trying to bypass it.

## Setup

1. Install dependencies:

```bash
npm ci
```

2. Copy the example environment file if you want to override defaults:

```bash
cp .env.example .env
```

3. Install the Playwright browsers:

```bash
npx playwright install
```

If your local machine is missing system libraries, use:

```bash
npx playwright install --with-deps
```

## Running the Tests

Run all checks:

```bash
npm test
```

Run only the UI suite:

```bash
npm run test:ui
```

Run only smoke coverage:

```bash
npm run test:ui:smoke
```

Run only the coding exercise:

```bash
npm run test:unit -- --project=chromium
```

Open the HTML report:

```bash
npm run report:open
```

## Sample Evidence

Sample execution evidence is stored under `docs/evidence/`:

- `sample-test-summary.md`
- `cross-browser-evidence.md`
- `latest-junit.xml` after a local run
- screenshots captured during the evidence run

## Assumptions and Trade-offs

- The platform currently protects most market routes behind login redirects, so the highest-value public coverage is around auth, recovery, and route protection.
- The CAPTCHA challenge is intentionally not automated around or mocked because the assignment explicitly asks for production-grade thinking.
- The Task 2 prompt was missing from the email body, so the included coding exercise is an explicit assumption rather than a claim of exact prompt parity.
