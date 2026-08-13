# Screen Tests

A lightweight visual regression testing tool that captures screenshots of configured pages at multiple viewport sizes, compares them against stored baseline images, and generates an HTML report of any differences.

## Overview

The workflow is:

```
Load config
    ↓
Launch Chromium
    ↓
Capture public (logged-out) screens
    ↓
Run login setup
    ↓
Capture authenticated screens
    ↓
Compare against .screens/baseline
    ↓
Generate & open HTML report
```

## Prerequisites

Install Playwright's Chromium browser (once per machine):

```bash
npx playwright install chromium
```

## Running the screen checks

From the **project root**:

```bash
npx tsx screen-tests/check-screens.ts
```

The script will:

1. Delete any previous `current` and `diff` images.
2. Capture every screen listed in `config.ts`.
3. Compare each screenshot against the baseline in `.screens/baseline/`.
4. Write an HTML report to `.screens/report/` and open it in your browser.

On the first run there are no baselines — every screen will be marked **new** and the report exit code is 0. Re-run after accepting baselines to detect regressions.

## Directory structure

```
screen-tests/
├── config.ts          # Main configuration — screens, viewports, tolerances
├── setup.ts           # Login automation (runs before authenticated screens)
├── loadenv.ts         # Loads .screen-auth/.env into process.env
├── capture.ts         # Launches Chromium and takes screenshots
├── compare.ts         # Pixel-level image diffing
├── report.ts          # Builds the HTML report data
├── server.ts          # Serves the report locally
├── discover.ts        # Auto-discovers routes from src/mobile/routing.js
├── paths.ts           # Shared path constants
└── types.ts           # TypeScript types

.screens/              # Generated output (gitignored)
├── baseline/          # Accepted reference screenshots
├── current/           # Screenshots from the latest run
├── diff/              # Highlighted difference images
└── report/            # HTML report assets

.screen-auth/          # Secret credentials (gitignored)
└── .env               # SCREEN_TEST_EMAIL and SCREEN_TEST_PASSWORD
```

## Configuring login

Authenticated screens (any screen in `config.ts` without `public: true`) are captured after the login step runs automatically.

### 1. Create the credentials file

Create the file `.screen-auth/.env` in the **project root** (this folder is gitignored — never commit credentials):

```
SCREEN_TEST_EMAIL=your-test-account@example.com
SCREEN_TEST_PASSWORD=your-password
```

### 2. How login works

`setup.ts` loads those credentials and drives the login form:

1. Navigates to `/#login`.
2. Fills `input[type="email"]` with `SCREEN_TEST_EMAIL`.
3. Fills `input[type="password"]` with `SCREEN_TEST_PASSWORD`.
4. Clicks `button[type="submit"]`.
5. Waits up to 10 seconds for the password field to disappear (confirming a successful login).

If the credentials are missing or invalid, the run fails with a descriptive error message.

### 3. Customising the login flow

If your app uses a different login UI, edit `setup.ts`. The function receives a Playwright `Page` object — you can use any Playwright API:

```ts
export const setup = async (page: Page): Promise<void> => {
  await page.goto(`${screenConfig.baseUrl}/#login`);
  // adapt selectors and steps to match your login form
  await page.fill('#email', process.env.SCREEN_TEST_EMAIL!);
  await page.fill('#password', process.env.SCREEN_TEST_PASSWORD!);
  await page.click('#login-button');
  await page.waitForURL('**/home');
};
```

## Adding and configuring screens

Edit `config.ts` to control which pages are captured.

### Screen definition

```ts
{ name: "home", path: "/" }
// or for a public (logged-out) screen:
{ name: "landing", path: "/#landing", public: true }
// or restricted to specific viewports:
{ name: "profile", path: "/#profile", viewports: ["phone", "desktop"] }
```

| Field       | Required | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| `name`      | yes      | Unique identifier; used as the filename prefix for screenshots.             |
| `path`      | yes      | URL path appended to `baseUrl` (e.g. `/`, `/#search`).                      |
| `public`    | no       | `true` → captured before login. Omit or `false` → captured after login.     |
| `viewports` | no       | Restrict to a named subset of viewports. Defaults to all configured ones.   |

### Viewports

Configured in the `viewports` block of `config.ts`:

```ts
viewports: {
  phone:   { width: 390,  height: 844  },
  tablet:  { width: 768,  height: 1024 },
  desktop: { width: 1440, height: 900  },
},
```

Add or remove entries to match the breakpoints you care about.

### Comparison tolerances

```ts
comparison: {
  pixelThreshold: 0.1,        // per-pixel colour distance (0–1)
  maxDifferencePercent: 0.5,  // max % of pixels allowed to differ
},
```

Increase `maxDifferencePercent` if anti-aliasing or fonts cause false positives.

## Auto-discovering routes

Instead of manually listing every screen, run the discovery helper to scan `src/mobile/routing.js` and append any missing routes to `config.ts`:

```bash
npx tsx screen-tests/discover.ts
```

After discovery, review the newly added entries and add `public: true` to any screens that should be captured before login.

## Accepting new baselines

When you intentionally change the appearance of a screen, the comparison will fail. The HTML report provides an **Accept** button for each changed screenshot — clicking it overwrites the baseline with the current screenshot.

You can also accept all baselines at once by copying the `current` images over `baseline`:

```bash
cp .screens/current/* .screens/baseline/
```

## Changing the base URL

The default `baseUrl` in `config.ts` is `http://localhost:3001` (the dev server). Change it if your app runs on a different port or if you want to run checks against a staging URL:

```ts
baseUrl: "http://localhost:3000",
```

The app must be running at that URL before you execute `check-screens.ts`.
