# Screen Tests

A lightweight visual regression testing tool that captures screenshots of configured app pages, compares them against stored baselines, and generates an HTML diff report.

---

## How it works

```
Load config.ts
      ↓
Launch Chromium (Playwright)
      ↓
Capture public screens (logged-out)
      ↓
Run setup.ts login step
      ↓
Capture authenticated screens
      ↓
Compare against .screens/baseline/
      ↓
Generate report → open in browser
```

Screenshots are stored under `.screens/` in the project root (gitignored). On first run any missing baseline images are created automatically and marked as **new**.

---

## Prerequisites

The app must already be running locally before you execute the screen tests.

```bash
# In the project root
npm start
```

The default base URL is `http://localhost:3001`. Change `baseUrl` in `config.ts` if your dev server runs on a different port.

---

## Running

From the **project root**:

```bash
npm run check-screens
```

The script opens the HTML report automatically when it finishes. Press **Ctrl+C** to stop the report server.

To discover and add new routes from the app's routing file to `config.ts`:

```bash
npm run discover-screens
```

Exit codes: `0` = all passed, `1` = one or more screenshots changed, `2` = fatal error.

---

## Configuring screens (`config.ts`)

`config.ts` is the single file you need to edit for most changes.

```ts
export const screenConfig: ScreenConfig = {
  baseUrl: "http://localhost:3001",

  viewports: {
    phone:   { width: 390,  height: 844  },
    tablet:  { width: 768,  height: 1024 },
    desktop: { width: 1440, height: 900  },
  },

  comparison: {
    pixelThreshold: 0.1,        // per-pixel sensitivity (0–1)
    maxDifferencePercent: 0.5,  // max % of pixels that may differ before failing
  },

  setup: "./setup.ts",  // login step — see section below

  screens: [
    // Captured before login
    { name: "landing",  path: "/#landing",  public: true },
    { name: "register", path: "/#register", public: true },

    // Captured after login
    { name: "home",     path: "/" },
    { name: "profile",  path: "/#profile" },
  ],
};
```

### Screen options

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Unique identifier used for file names |
| `path` | `string` | Hash route appended to `baseUrl` |
| `public` | `boolean` | When `true`, captured **before** the login step. Defaults to `false`. |
| `viewports` | `string[]` | Restrict to a subset of the configured viewports. Defaults to all. |

Example — capture a screen at phone size only:

```ts
{ name: "splash", path: "/#splash", public: true, viewports: ["phone"] }
```

---


## Configuring the login step (`setup.ts`)

Authenticated screens (those without `public: true`) require a logged-in browser session. The login step is performed by the function exported from the file pointed to by `config.setup` (defaults to `./setup.ts`).

`setup.ts` receives a Playwright `Page` that is already open in the browser and must leave it in a fully logged-in state before returning.

### Credentials — `.screen-auth/.env`

Credentials are kept **outside** the repository in `.screen-auth/.env` at the project root. This file is gitignored and must never be committed.

Create it manually:

```
# .screen-auth/.env
SCREEN_TEST_EMAIL=your@email.com
SCREEN_TEST_PASSWORD=yourpassword
SCREEN_TEST_LOGIN_PATH="/#login"
```

> **Note:** `#` is a comment character in `.env` files. Any path containing `#` **must** be wrapped in double quotes.

`loadenv.ts` loads this file into `process.env` at startup. If the file is missing the environment variables are simply not set; `setup.ts` will then throw a clear error when it tries to log in.

### How `setup.ts` works

```ts
import type { Page } from "@playwright/test";
import { loadScreenAuthEnv } from "./loadenv.ts";
import { screenConfig } from "./config.ts";

loadScreenAuthEnv();

export const setup = async (page: Page): Promise<void> => {
  await page.goto(`${screenConfig.baseUrl}/#login`);
  await page.fill('input[type="email"]',    process.env.SCREEN_TEST_EMAIL!);
  await page.fill('input[type="password"]', process.env.SCREEN_TEST_PASSWORD!);
  await page.click('button[type="submit"]');

  // Wait until the password field disappears — indicates the login page has gone
  await page.waitForSelector('input[type="password"]', { state: "detached", timeout: 10_000 });
};
```

### Customising the login flow

If the app's login selectors or flow change, edit `setup.ts` directly. Common adjustments:

- **Different selectors** — replace `input[type="email"]` / `button[type="submit"]` with whatever the login form actually uses.
- **Multi-step login** — chain additional `page.fill` / `page.click` / `page.waitForSelector` calls.
- **Token injection** — instead of filling a form, call `page.evaluate(() => localStorage.setItem('token', '...'))` then reload.
- **Success detection** — change the `waitForSelector` call to wait for an element that only appears once the user is logged in (e.g. a nav avatar or a dashboard heading).

You can point `config.setup` at a different file entirely if you want to keep multiple login strategies:

```ts
setup: "./setup-admin.ts",
```

---

## Accepting changed screenshots as new baselines

When a screenshot fails because the UI intentionally changed, copy the current screenshot over the baseline:

```bash
# Single screen + viewport
cp .screens/current/home--phone.png .screens/baseline/home--phone.png

# Accept all current screenshots as the new baseline
cp .screens/current/*.png .screens/baseline/
```

Then re-run `check-screens` to confirm everything passes.

---

## Folder structure

```
.screens/           ← gitignored, lives in the project root
  baseline/         ← committed reference images (or kept locally)
  current/          ← freshly captured images (wiped each run)
  diff/             ← pixel-diff images for failing screens
  report/           ← generated HTML report

screen-tests/
  config.ts         ← screens, viewports, thresholds
  setup.ts          ← login step
  loadenv.ts        ← loads .screen-auth/.env
  check-screens.ts  ← main entry point
  capture.ts        ← Playwright screenshot logic
  compare.ts        ← pixelmatch diff logic
  report.ts         ← HTML report builder
  discover.ts       ← route discovery helper
  paths.ts          ← shared path constants
  types.ts          ← shared TypeScript types
  server.ts         ← local HTTP server for the report

.screen-auth/       ← gitignored, lives in the project root
  .env              ← SCREEN_TEST_EMAIL / SCREEN_TEST_PASSWORD
```

Add both `.screens/` and `.screen-auth/` to `.gitignore`.
