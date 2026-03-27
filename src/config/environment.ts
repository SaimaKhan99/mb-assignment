import 'dotenv/config';

const readNumber = (name: string, fallback: number): number => {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

export const environment = {
  baseUrl: process.env.BASE_URL ?? 'https://trade.mb.io',
  locale: process.env.LOCALE ?? 'en',
  defaultTimeoutMs: readNumber('DEFAULT_TIMEOUT_MS', 10_000),
  expectTimeoutMs: readNumber('EXPECT_TIMEOUT_MS', 10_000),
};
