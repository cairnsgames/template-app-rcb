import fs from "node:fs";
import { screenConfig } from "./config.ts";
import { capture } from "./capture.ts";
import { compareEntry } from "./compare.ts";
import { buildReport, writeReport } from "./report.ts";
import { currentDir, diffDir } from "./paths.ts";
import { startReportServer, openInBrowser } from "./server.ts";
import type { ScreenResult } from "./types.ts";

const logResults = (results: ScreenResult[]): void => {
  let lastScreen: string | null = null;
  for (const result of results) {
    if (result.screen !== lastScreen) {
      console.log(`\n${result.screen}`);
      lastScreen = result.screen;
    }
    if (result.status === "passed") {
      console.log(`  ✓ ${result.viewport.name}`);
    } else if (result.status === "new") {
      console.log(`  + ${result.viewport.name}    new baseline`);
    } else {
      console.log(`  ✗ ${result.viewport.name}    ${result.differencePercent.toFixed(2)}% difference`);
    }
  }
};

const main = async (): Promise<void> => {
  console.log("Screen Check");

  fs.rmSync(currentDir, { recursive: true, force: true });
  fs.rmSync(diffDir, { recursive: true, force: true });

  const entries = await capture(screenConfig);
  const results = entries.map((entry) => compareEntry(entry, screenConfig.comparison));

  logResults(results);

  const report = buildReport(results);
  writeReport(report);

  console.log(`\n${report.summary.total} screenshots checked`);
  console.log(`${report.summary.passed} passed`);
  console.log(`${report.summary.failed} changed`);
  if (report.summary.new > 0) {
    console.log(`${report.summary.new} new baseline`);
  }

  console.log("\nOpening report...");
  const { server, url } = await startReportServer();
  openInBrowser(url);
  console.log(`Report running at ${url} — press Ctrl+C to stop.`);

  const exitCode = report.summary.failed > 0 ? 1 : 0;
  process.on("SIGINT", () => {
    server.close(() => process.exit(exitCode));
  });
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 2;
});
