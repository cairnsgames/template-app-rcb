import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Page } from "@playwright/test";
import type { ScreenConfig, ScreenDef } from "./types.ts";
import { currentDir, screenTestsDir, shotFileName } from "./paths.ts";

export type CaptureEntry = {
  screen: ScreenDef;
  viewport: { name: string; width: number; height: number };
  currentImagePath: string;
};

type SetupModule = {
  setup?: (page: Page) => Promise<void>;
  default?: (page: Page) => Promise<void>;
};

const resolveSetup = async (
  config: ScreenConfig
): Promise<((page: Page) => Promise<void>) | undefined> => {
  if (!config.setup) return undefined;
  const setupPath = path.resolve(screenTestsDir, config.setup);
  const mod: SetupModule = await import(pathToFileURL(setupPath).href);
  const fn = mod.setup ?? mod.default;
  if (!fn) {
    throw new Error(`Setup module at ${config.setup} does not export a setup(page) function.`);
  }
  return fn;
};

export const capture = async (config: ScreenConfig): Promise<CaptureEntry[]> => {
  fs.mkdirSync(currentDir, { recursive: true });

  const entries: CaptureEntry[] = [];
  const setupFn = await resolveSetup(config);

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    const captureScreen = async (screen: ScreenDef): Promise<void> => {
      const viewportNames = screen.viewports ?? Object.keys(config.viewports);

      for (const viewportName of viewportNames) {
        const viewport = config.viewports[viewportName];
        if (!viewport) {
          throw new Error(`Screen "${screen.name}" references unknown viewport "${viewportName}".`);
        }

        console.log(`  capturing ${screen.name} @ ${viewportName}`);
        await page.setViewportSize(viewport);
        // Navigate via about:blank to force a full React remount on every screen
        await page.goto("about:blank");
        await page.goto(`${config.baseUrl}${screen.path}`, { waitUntil: "load" });
        if (screen.delay) {
          await page.waitForTimeout(screen.delay);
        }

        const currentImagePath = path.join(currentDir, shotFileName(screen.name, viewportName));
        await page.screenshot({ path: currentImagePath, fullPage: true });

        entries.push({
          screen,
          viewport: { name: viewportName, ...viewport },
          currentImagePath,
        });
      }
    };

    const publicScreens = config.screens.filter((s) => s.public);
    const authScreens = config.screens.filter((s) => !s.public);

    // Clear any persisted session so public screens are always captured logged-out
    await context.clearCookies();
    await page.goto(config.baseUrl);
    await page.evaluate(() => localStorage.clear());
    const storageAfterClear = await page.evaluate(() => JSON.stringify(localStorage));
    console.log(`  localStorage after clear: ${storageAfterClear}`);

    for (const screen of publicScreens) {
      await captureScreen(screen);
    }

    let loginOk = true;
    if (setupFn) {
      console.log("  running login setup...");
      try {
        await setupFn(page);
        console.log("  login setup complete");
      } catch (err) {
        loginOk = false;
        console.warn(`  login setup failed — skipping ${authScreens.length} authenticated screen(s): ${(err as Error).message}`);
      }
    }

    if (loginOk) {
      for (const screen of authScreens) {
        await captureScreen(screen);
      }
    }
  } finally {
    await browser.close();
  }

  return entries;
};
