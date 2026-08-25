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

  const loginPath = process.env.SCREEN_TEST_LOGIN_PATH ?? "/#login";
  const loginUrl = `${screenConfig.baseUrl}${loginPath}`;

  console.log(`  login setup: navigating to ${loginUrl} (currently at ${page.url()})`);
  await page.goto(loginUrl, { waitUntil: "load" });
  console.log(`  login setup: landed at ${page.url()}`);
  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  console.log(`  login setup: localStorage = ${storage}`);

  // Snapshot of the login page before any interaction — saved to .screens/ for debugging
  await page.screenshot({ path: ".screens/screen-login.png", fullPage: true });

  await page.fill('input[type="email"]', email, { timeout: 10_000 });
  await page.fill('input[type="password"]', password, { timeout: 10_000 });
  await page.click('button[type="submit"]');

  // Snapshot after submit — shows success redirect or error message
  await page.screenshot({ path: ".screens/screen-login-result.png", fullPage: true });

  try {
    await page.waitForSelector('input[type="password"]', { state: "detached", timeout: 10_000 });
  } catch {
    throw new Error(
      "Login did not complete within 10s — check SCREEN_TEST_EMAIL / SCREEN_TEST_PASSWORD in .screen-auth/.env are valid credentials for this app."
    );
  }
};

export default setup;
