import fs from "node:fs";
import path from "node:path";
import type { ScreenReport, ScreenResult } from "./types.ts";
import { reportAssetsDir, reportDir } from "./paths.ts";

export const buildReport = (results: ScreenResult[]): ScreenReport => {
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === "passed").length,
    failed: results.filter((r) => r.status === "failed").length,
    new: results.filter((r) => r.status === "new").length,
  };

  return {
    generatedAt: new Date().toISOString(),
    summary,
    results,
  };
};

export const writeReport = (report: ScreenReport): void => {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, "results.json"), JSON.stringify(report, null, 2));

  for (const fileName of ["index.html", "report.js", "report.css"]) {
    fs.copyFileSync(path.join(reportAssetsDir, fileName), path.join(reportDir, fileName));
  }
};
