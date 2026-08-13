import type { Page } from "@playwright/test";
import { loadScreenAuthEnv } from "./loadenv.ts";
import { screenConfig } from "./config.ts";

loadScreenAuthEnv();

export const setup = async (page: Page): Promise<void> => {
  const email = process.env.SCREEN_TEST_EMAIL;
  const password = process.env.SCREEN_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing SCREEN_TEST_EMAIL / SCREEN_TEST_PASSWORD. Set them in .screen-auth/.env before running check-screens."
    );
  }

  await page.goto(`${screenConfig.baseUrl}/#login`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  try {
    await page.waitForSelector('input[type="password"]', { state: "detached", timeout: 10_000 });
  } catch {
    throw new Error(
      "Login did not complete within 10s — check SCREEN_TEST_EMAIL / SCREEN_TEST_PASSWORD in .screen-auth/.env are valid credentials for this app."
    );
  }
};

export default setup;
