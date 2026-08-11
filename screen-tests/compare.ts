import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import type { ComparisonConfig, ScreenResult } from "./types.ts";
import type { CaptureEntry } from "./capture.ts";
import { baselineDir, diffDir, shotFileName } from "./paths.ts";

const relativeToScreens = (kind: "baseline" | "current" | "diff", fileName: string): string =>
  `${kind}/${fileName}`;

export const compareEntry = (
  entry: CaptureEntry,
  comparison: ComparisonConfig
): ScreenResult => {
  const fileName = shotFileName(entry.screen.name, entry.viewport.name);
  const baselinePath = path.join(baselineDir, fileName);

  const base: Omit<ScreenResult, "status" | "differencePercent"> = {
    screen: entry.screen.name,
    path: entry.screen.path,
    viewport: entry.viewport,
    baselineImage: relativeToScreens("baseline", fileName),
    currentImage: relativeToScreens("current", fileName),
  };

  if (!fs.existsSync(baselinePath)) {
    fs.mkdirSync(baselineDir, { recursive: true });
    fs.copyFileSync(entry.currentImagePath, baselinePath);
    return { ...base, status: "new", differencePercent: 0 };
  }

  const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
  const currentImg = PNG.sync.read(fs.readFileSync(entry.currentImagePath));

  if (baselineImg.width !== currentImg.width || baselineImg.height !== currentImg.height) {
    return {
      ...base,
      status: "failed",
      differencePercent: 100,
      dimensionMismatch: true,
    };
  }

  const { width, height } = baselineImg;
  const diff = new PNG({ width, height });
  const changedPixels = pixelmatch(
    baselineImg.data,
    currentImg.data,
    diff.data,
    width,
    height,
    { threshold: comparison.pixelThreshold }
  );
  const differencePercent = (changedPixels / (width * height)) * 100;

  if (differencePercent <= comparison.maxDifferencePercent) {
    return { ...base, status: "passed", differencePercent };
  }

  fs.mkdirSync(diffDir, { recursive: true });
  const diffPath = path.join(diffDir, fileName);
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return {
    ...base,
    status: "failed",
    differencePercent,
    diffImage: relativeToScreens("diff", fileName),
  };
};
