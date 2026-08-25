# Local Screen Comparison System — Design Document

## 1. Purpose

The Local Screen Comparison System is a lightweight visual regression testing tool intended to run inside an existing web project.

Its purpose is to detect unintended visual changes by:

1. Opening a configured set of local web pages.
2. Capturing screenshots at several viewport sizes.
3. Comparing those screenshots against stored baseline images.
4. Generating a local HTML report showing the results.
5. Allowing individual changed screenshots to be accepted as the new baseline.

The system is intended primarily for local development rather than CI/CD.

It should be simple enough that it can be copied into another project without requiring a separate npm package or external service.

A typical workflow should be:

```bash
npm run check-screens
```

The command should:

```text
Load screen configuration
       ↓
Launch Chromium
       ↓
Capture each configured page
       ↓
Compare against .screens baselines
       ↓
Generate report
       ↓
Open report in browser
```

If every screenshot matches its baseline within the configured tolerances, the report should simply show that all screens are correct.

If differences exist, the report should show the baseline, current screenshot and visual difference for every failing screen.

---

# 2. Core Principles

The system should remain deliberately small.

It is not intended to replace Playwright's full testing framework or provide complex browser workflow testing.

The focus is:

```text
URL
 ↓
Screenshot
 ↓
Compare
 ↓
Review
```

The implementation should favour configuration over complex test files.

Most projects should only need to define their URLs.

---

# 3. Installation Structure

The complete visual testing system should live inside a project folder.

Recommended structure:

```text
project/
│
├── package.json
│
├── src/
│
├── public/
│
│
├── screen-tests/
│   ├── config.ts
│   ├── check-screens.ts
│   ├── capture.ts
│   ├── compare.ts
│   ├── report.ts
│   ├── server.ts
│   └── discover.ts
│
├── .screens/
│   ├── baseline/
│   ├── current/
│   ├── diff/
│   └── report/
│
└── .screen-auth/
```

The `screen-tests` directory contains the reusable tool.

To install the system into another project, this directory can simply be copied.

The `.screens` directory contains generated test assets.

---

# 4. NPM Commands

The main project should expose commands such as:

```json
{
  "scripts": {
    "check-screens": "tsx screen-tests/check-screens.ts",
    "discover-screens": "tsx screen-tests/discover.ts"
  }
}
```

The primary command is:

```bash
npm run check-screens
```

The optional discovery command is:

```bash
npm run discover-screens
```

There should not initially be a separate bulk baseline update command.

Baseline changes are accepted through the report.

---

# 5. Dependencies

The system should use:

```text
Playwright
pixelmatch
pngjs
tsx
```

Playwright should use Chromium only.

Example development dependencies:

```json
{
  "devDependencies": {
    "@playwright/test": "...",
    "pixelmatch": "...",
    "pngjs": "...",
    "tsx": "..."
  }
}
```

The exact implementation may use Playwright directly rather than its test runner.

This keeps the visual comparison tool independent from any existing Playwright test suite in the project.

---

# 6. Screen Configuration

Screens should primarily be explicitly configured.

Example:

```ts
export const screenConfig = {
  baseUrl: 'http://localhost:3000',

  screens: [
    {
      name: 'home',
      path: '/',
    },
    {
      name: 'products',
      path: '/products',
    },
    {
      name: 'contact',
      path: '/contact',
    },
  ],
};
```

The screen name becomes the stable identifier used for baseline images.

For example:

```text
home
products
contact
```

A screen name should therefore remain unchanged even if the URL changes.

---

# 7. Route Discovery

Although configuration is the authoritative source, the tool should include an optional route discovery mechanism.

The purpose of discovery is not to dynamically test every application route.

Instead:

```bash
npm run discover-screens
```

should inspect the application and generate or update the screen configuration.

For example, a Next.js project might contain:

```text
app/
  page.tsx
  products/
    page.tsx
  contact/
    page.tsx
```

Discovery could identify:

```text
/
/products
/contact
```

It could then generate configuration similar to:

```ts
screens: [
  {
    name: 'home',
    path: '/',
  },
  {
    name: 'products',
    path: '/products',
  },
  {
    name: 'contact',
    path: '/contact',
  },
]
```

The developer can then edit that configuration manually.

Discovery should therefore be considered a convenience tool rather than part of the actual comparison process.

The system should initially support Next.js route discovery if required.

Other frameworks can later add their own route discovery adapters.

---

# 8. Viewports

Every configured page should by default be captured at three viewport sizes:

```text
Phone
Tablet
Desktop
```

Recommended defaults:

```ts
const defaultViewports = {
  phone: {
    width: 390,
    height: 844,
  },

  tablet: {
    width: 768,
    height: 1024,
  },

  desktop: {
    width: 1440,
    height: 900,
  },
};
```

These values should live in configuration and therefore be easily changed.

Example:

```ts
export const screenConfig = {
  viewports: {
    phone: {
      width: 390,
      height: 844,
    },

    tablet: {
      width: 820,
      height: 1180,
    },

    desktop: {
      width: 1440,
      height: 900,
    },
  },
};
```

If viewports are not provided, the built-in defaults are used.

---

# 9. Per-Screen Viewports

Although the default behaviour should capture all three standard sizes, individual screens should be able to override them.

Example:

```ts
{
  name: 'desktop-dashboard',
  path: '/admin/dashboard',

  viewports: ['desktop']
}
```

Or:

```ts
{
  name: 'checkout',
  path: '/checkout',

  viewports: [
    'phone',
    'desktop'
  ]
}
```

This avoids unnecessary captures for screens that only exist at particular sizes.

---

# 10. Baseline Storage

Baseline screenshots should be stored under:

```text
.screens/baseline/
```

Recommended naming convention:

```text
<screen-name>--<viewport>.png
```

For example:

```text
.screens/
  baseline/
    home--phone.png
    home--tablet.png
    home--desktop.png

    products--phone.png
    products--tablet.png
    products--desktop.png
```

This creates a predictable mapping between configuration and screenshots.

---

# 11. First Run

If no baseline exists for a screenshot, the captured image should automatically become the initial baseline.

For example:

```text
Baseline not found:

home--desktop.png

Creating baseline.
```

This prevents the first execution from reporting every screen as a failure.

The report should distinguish this state from a normal pass.

Possible status:

```text
NEW BASELINE
```

---

# 12. Screenshot Capture

Playwright should launch Chromium.

For each screen and viewport:

```text
Create browser context
      ↓
Set viewport
      ↓
Navigate to URL
      ↓
Capture screenshot
      ↓
Store screenshot
```

The resulting screenshots should be placed in:

```text
.screens/current/
```

Example:

```text
.screens/current/home--desktop.png
```

The current directory can be cleared at the beginning of every run.

---

# 13. Screenshot Scope

Screenshots should capture the full page.

Example Playwright call:

```ts
await page.screenshot({
  path: screenshotPath,
  fullPage: true,
});
```

This allows visual changes below the initial viewport to also be detected.

The viewport still controls responsive layout.

---

# 14. Authentication

The system should support authenticated pages through a setup script.

It should not depend on stored Playwright auth-state files.

Configuration could contain:

```ts
export const screenConfig = {
  setup: './screen-tests/setup.ts',

  screens: [...]
};
```

The setup script receives the Playwright page or browser context.

Example:

```ts
export async function setup(page) {
  await page.goto('http://localhost:3000/login');

  await page.fill(
    '[name=email]',
    'screen-test@example.com'
  );

  await page.fill(
    '[name=password]',
    'password'
  );

  await page.click(
    'button[type=submit]'
  );
}
```

Authentication should occur before screenshots are captured.

The same authenticated browser context can then be reused across the configured screens.

---

# 15. Dynamic Content

The first version should not attempt to manipulate dynamic content.

There should be no special DSL for:

```text
waiting for selectors
hiding components
mocking data
clicking dialogs
masking timestamps
freezing dates
```

The screenshot should simply represent what the application displays.

This keeps the first implementation intentionally simple.

If dynamic content later becomes a problem, deterministic setup can be added as a separate capability.

---

# 16. Comparison Algorithm

The tool should not require an exact pixel match.

Minor rendering differences should be tolerated.

There should be two controls:

```text
pixel tolerance
overall difference percentage
```

For example:

```ts
comparison: {
  pixelThreshold: 0.1,
  maxDifferencePercent: 0.5,
}
```

The pixel threshold handles small anti-aliasing and colour rendering differences.

The overall threshold determines how much of the screen may differ before the test fails.

Conceptually:

```text
Baseline image
      +
Current image
      ↓
Pixel comparison
      ↓
Number of changed pixels
      ↓
Difference percentage
```

Calculation:

```text
differencePercent =
    changedPixels
    /
    totalPixels
    ×
    100
```

If:

```text
differencePercent <= maxDifferencePercent
```

the screen passes.

Otherwise it fails.

---

# 17. Different Image Dimensions

If the baseline and current screenshots have different dimensions, the screen should automatically fail.

For example:

```text
Baseline: 1440 × 2380
Current:  1440 × 2465
```

This likely represents a meaningful layout/content change.

The comparison system should still generate a useful diff where possible.

---

# 18. Diff Images

For failed comparisons, a difference image should be created under:

```text
.screens/diff/
```

Example:

```text
.screens/diff/home--desktop.png
```

The diff image should visually emphasise changed pixels.

Unchanged content can be faded or shown in grayscale.

The exact presentation can use the default behaviour provided by `pixelmatch`.

---

# 19. Result Model

Internally each screenshot comparison should produce a result similar to:

```ts
type ScreenResult = {
  screen: string;

  path: string;

  viewport: {
    name: string;
    width: number;
    height: number;
  };

  status:
    | 'passed'
    | 'failed'
    | 'new';

  differencePercent: number;

  baselineImage: string;
  currentImage: string;
  diffImage?: string;
};
```

The complete execution produces:

```ts
type ScreenReport = {
  generatedAt: string;

  summary: {
    total: number;
    passed: number;
    failed: number;
    new: number;
  };

  results: ScreenResult[];
};
```

---

# 20. HTML Report

After all comparisons are complete, the system should generate a local HTML report.

Example:

```text
.screens/report/index.html
```

The report should then automatically open in the developer's browser.

The top of the report should show an overall status.

Example:

```text
SCREEN CHECK

18 Screens Checked

17 Passed
1 Changed
```

If everything passes:

```text
SCREEN CHECK

✓ All 18 screens are correct
```

---

# 21. Report Layout

Results should be grouped by screen.

Example:

```text
Home

Phone       ✓ Correct
Tablet      ✓ Correct
Desktop     ✗ Changed
```

Only changed screens need to display the full comparison images by default.

Passing screens can simply display their status.

---

# 22. Failed Screen Display

A changed screen should show three images side by side:

```text
BASELINE          CURRENT          DIFFERENCE

┌──────────┐      ┌──────────┐     ┌──────────┐
│          │      │          │     │          │
│ baseline │      │ current  │     │   diff   │
│          │      │          │     │          │
└──────────┘      └──────────┘     └──────────┘
```

Below the images:

```text
Difference: 2.14%

[ Accept Current as Baseline ]
```

The report does not initially require overlays, sliders or advanced visualisation.

---

# 23. Accepting New Baselines

Baseline updates should happen from the report.

Each changed screenshot should have:

```text
Accept Current as Baseline
```

When clicked:

```text
.screens/current/home--desktop.png
```

should replace:

```text
.screens/baseline/home--desktop.png
```

The comparison should then be recalculated or the report should update that entry to:

```text
✓ Baseline Updated
```

This action should only affect that particular screen and viewport.

This prevents accidental approval of unrelated visual changes.

---

# 24. Local Report Server

Because the report needs to modify files when a baseline is accepted, it cannot be a completely static HTML file opened using `file://`.

The screen checker should start a tiny local HTTP server.

For example:

```text
http://localhost:41789
```

Endpoints might include:

```text
GET /
GET /report.json
POST /baseline/accept
```

Example acceptance request:

```json
{
  "screen": "home",
  "viewport": "desktop"
}
```

The server then copies:

```text
current/home--desktop.png
```

to:

```text
baseline/home--desktop.png
```

---

# 25. Generated Report Data

The comparison process should write:

```text
.screens/report/results.json
```

The report frontend reads this file or obtains it through the local report server.

This keeps the capture/comparison engine separate from the presentation layer.

---

# 26. Configuration Model

A complete configuration could look like:

```ts
export default {
  baseUrl: 'http://localhost:3000',

  viewports: {
    phone: {
      width: 390,
      height: 844,
    },

    tablet: {
      width: 768,
      height: 1024,
    },

    desktop: {
      width: 1440,
      height: 900,
    },
  },

  comparison: {
    pixelThreshold: 0.1,
    maxDifferencePercent: 0.5,
  },

  setup: './setup.ts',

  screens: [
    {
      name: 'home',
      path: '/',
    },

    {
      name: 'products',
      path: '/products',
    },

    {
      name: 'admin-dashboard',
      path: '/admin',
      viewports: ['desktop'],
    },
  ],
};
```

---

# 27. Processing Workflow

The primary command:

```bash
npm run check-screens
```

should execute the following workflow.

```text
1. Load configuration

2. Validate configuration

3. Clear:
      .screens/current
      .screens/diff

4. Launch Chromium

5. Run optional setup script

6. For each configured screen

       For each configured viewport

           Open URL

           Capture full-page screenshot

           Save current screenshot

           Locate baseline

           If baseline does not exist
               create baseline
               mark NEW

           Otherwise
               compare images

           If difference exceeds tolerance
               generate diff
               mark FAILED

           Otherwise
               mark PASSED

7. Close Chromium

8. Generate results.json

9. Generate report

10. Start report server

11. Open report in default browser
```

---

# 28. Console Output

The CLI should remain readable.

Example successful run:

```text
Screen Check

Home
  ✓ phone
  ✓ tablet
  ✓ desktop

Products
  ✓ phone
  ✓ tablet
  ✓ desktop

Admin Dashboard
  ✓ desktop

7 screenshots checked
7 passed
0 changed

Opening report...
```

A failed run might display:

```text
Screen Check

Home
  ✓ phone
  ✓ tablet
  ✗ desktop    2.31% difference

Products
  ✓ phone
  ✗ tablet     1.17% difference
  ✓ desktop

6 screenshots checked
4 passed
2 changed

Opening report...
```

---

# 29. Exit Codes

The command should use meaningful exit codes.

```text
0 = all comparisons passed

1 = one or more screenshots changed

2 = system/configuration/runtime failure
```

This also makes the tool compatible with future CI usage without designing specifically for CI now.

---

# 30. `.gitignore`

The baseline images should normally be committed to Git.

Therefore:

```text
.screens/baseline/
```

should NOT be ignored.

Temporary files should be ignored:

```gitignore
.screens/current/
.screens/diff/
.screens/report/
```

This means the repository contains only the approved visual state.

A pull request containing an intentional UI change would therefore include updated baseline PNG files.

---

# 31. Recommended Repository Structure

A complete project might therefore contain:

```text
project/
│
├── package.json
│
├── src/
│
├── app/
│
├── public/
│
├── screen-tests/
│   │
│   ├── config.ts
│   ├── check-screens.ts
│   ├── capture.ts
│   ├── compare.ts
│   ├── report.ts
│   ├── server.ts
│   ├── discover.ts
│   ├── setup.ts
│   │
│   └── report/
│       ├── index.html
│       ├── report.js
│       └── report.css
│
└── .screens/
    │
    ├── baseline/
    │   ├── home--phone.png
    │   ├── home--tablet.png
    │   └── home--desktop.png
    │
    ├── current/
    │
    ├── diff/
    │
    └── report/
```

---

# 32. Responsibilities

The internal implementation should be split into a few small responsibilities.

## `config.ts`

Defines:

```text
base URL
screens
viewports
comparison tolerance
setup script
```

## `check-screens.ts`

Acts as the application coordinator.

It should contain very little implementation logic itself.

## `capture.ts`

Responsible for:

```text
Playwright
Chromium
navigation
viewport configuration
screenshots
```

## `compare.ts`

Responsible for:

```text
PNG loading
pixel comparison
difference percentage
diff image generation
```

## `report.ts`

Responsible for:

```text
results.json
HTML report generation
```

## `server.ts`

Responsible for:

```text
serving report
accepting baseline changes
opening browser
```

## `discover.ts`

Responsible for:

```text
route discovery
generating/updating screen config
```

---

# 33. Portability Between Projects

The tool should avoid importing anything from the host application's source code.

The only interface between the application and screen checker should normally be:

```text
HTTP
```

For example:

```text
http://localhost:3000/products
```

This means the same `screen-tests` directory can be copied between:

```text
Next.js
React/Vite
Vue
Svelte
Angular
plain web applications
```

Only route discovery may require framework-specific implementations.

---

# 34. Application Startup

The initial version should assume that the application is already running.

For example:

```bash
npm run dev
```

in one terminal, followed by:

```bash
npm run check-screens
```

in another.

This keeps the screen checker independent from how the host project starts its development server.

A future enhancement could allow:

```ts
server: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
}
```

but this is not necessary for the first version.

---

# 35. What the First Version Should Not Include

To keep the system small, version one should deliberately exclude:

```text
Firefox testing
Safari/WebKit testing
cloud screenshot storage
CI dashboards
historical screenshot versions
automatic baseline replacement
AI visual analysis
DOM comparison
component-level screenshots
interactive setup workflows
automatic dynamic-content masking
animation control
network mocking
visual test scripting DSL
```

These can be added later if there is a demonstrated need.

---

# 36. Minimum Viable Version

The first useful implementation only requires six capabilities:

```text
1. Read screen configuration.

2. Capture configured URLs with Playwright Chromium.

3. Capture phone, tablet and desktop screenshots.

4. Compare screenshots against .screens/baseline.

5. Generate baseline/current/diff comparison report.

6. Allow individual changed screenshots to become the new baseline.
```

Everything else should be considered secondary.

---

# 37. Example Developer Workflow

A developer changes the application's CSS.

They run:

```bash
npm run check-screens
```

The tool reports:

```text
22 screenshots checked
20 correct
2 changed
```

The browser opens automatically.

The report shows:

```text
Product Page — Desktop

BASELINE | CURRENT | DIFFERENCE

Difference: 3.27%

[Accept Current as Baseline]
```

The developer determines that the change was intentional and clicks:

```text
Accept Current as Baseline
```

The tool replaces:

```text
.screens/baseline/products--desktop.png
```

with the current screenshot.

The developer can then commit the updated baseline alongside their source-code changes.

---

# 38. Overall Architecture

The architecture should remain:

```text
                screen config
                     │
                     ▼
              check-screens.ts
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      Playwright             setup.ts
      Chromium              optional auth
          │
          ▼
       capture
          │
          ▼
 .screens/current
          │
          ▼
       compare
          │
     ┌────┴────┐
     │         │
     ▼         ▼
 baseline     diff
     │         │
     └────┬────┘
          ▼
      results.json
          │
          ▼
     local report
          │
          ▼
   developer review
          │
          ▼
 Accept new baseline
```

The important design decision is that `.screens/baseline` is the source of truth.

Everything else in `.screens` is disposable and can be regenerated by running:

```bash
npm run check-screens
```

This results in a small, understandable visual regression system that can live directly inside any of your existing projects without introducing another service, framework or package to maintain.
