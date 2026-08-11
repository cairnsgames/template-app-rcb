import path from "node:path";
import { fileURLToPath } from "node:url";

export const screenTestsDir = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.join(screenTestsDir, "..");
export const screensDir = path.join(projectRoot, ".screens");
export const baselineDir = path.join(screensDir, "baseline");
export const currentDir = path.join(screensDir, "current");
export const diffDir = path.join(screensDir, "diff");
export const reportDir = path.join(screensDir, "report");
export const reportAssetsDir = path.join(screenTestsDir, "report");

export const shotFileName = (screen: string, viewport: string): string =>
  `${screen}--${viewport}.png`;
