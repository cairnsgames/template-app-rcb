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
  const context = await browser.newContext();
  const page = await context.newPage();

  const captureScreen = async (screen: ScreenDef): Promise<void> => {
    const viewportNames = screen.viewports ?? Object.keys(config.viewports);

    for (const viewportName of viewportNames) {
      const viewport = config.viewports[viewportName];
      if (!viewport) {
        throw new Error(`Screen "${screen.name}" references unknown viewport "${viewportName}".`);
      }

      await page.setViewportSize(viewport);
      await page.goto(`${config.baseUrl}${screen.path}`, { waitUntil: "load" });

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

  for (const screen of publicScreens) {
    await captureScreen(screen);
  }

  if (setupFn) {
    await setupFn(page);
  }

  for (const screen of authScreens) {
    await captureScreen(screen);
  }

  await browser.close();

  return entries;
};
