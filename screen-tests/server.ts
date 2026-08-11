import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { baselineDir, currentDir, reportDir, screensDir, shotFileName } from "./paths.ts";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

/** Resolves `relativePath` under `baseDir`, rejecting attempts to escape it. */
const safeJoin = (baseDir: string, relativePath: string): string | undefined => {
  const resolved = path.join(baseDir, relativePath);
  const normalizedBase = path.normalize(baseDir + path.sep);
  if (!path.normalize(resolved).startsWith(normalizedBase)) return undefined;
  return resolved;
};

const serveFile = (res: http.ServerResponse, filePath: string): void => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
    res.end(data);
  });
};

const readBody = (req: http.IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const handleAcceptBaseline = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> => {
  try {
    const { screen, viewport } = JSON.parse(await readBody(req));
    if (typeof screen !== "string" || typeof viewport !== "string") {
      throw new Error("Expected { screen, viewport } strings in request body.");
    }

    const fileName = shotFileName(screen, viewport);
    const currentPath = path.join(currentDir, fileName);
    const baselinePath = path.join(baselineDir, fileName);

    if (!fs.existsSync(currentPath)) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Current screenshot not found." }));
      return;
    }

    fs.mkdirSync(baselineDir, { recursive: true });
    fs.copyFileSync(currentPath, baselinePath);

    const resultsPath = path.join(reportDir, "results.json");
    const report = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));
    const entry = report.results.find(
      (r: { screen: string; viewport: { name: string } }) =>
        r.screen === screen && r.viewport.name === viewport
    );
    if (entry) {
      entry.status = "passed";
      entry.differencePercent = 0;
      delete entry.diffImage;
      delete entry.dimensionMismatch;
      report.summary.failed = report.results.filter(
        (r: { status: string }) => r.status === "failed"
      ).length;
      report.summary.passed = report.results.filter(
        (r: { status: string }) => r.status === "passed"
      ).length;
      fs.writeFileSync(resultsPath, JSON.stringify(report, null, 2));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
  }
};

export const startReportServer = (
  port = 41789
): Promise<{ server: http.Server; url: string }> =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${port}`);

      if (req.method === "POST" && url.pathname === "/baseline/accept") {
        void handleAcceptBaseline(req, res);
        return;
      }

      if (req.method !== "GET") {
        res.writeHead(405);
        res.end();
        return;
      }

      if (url.pathname === "/report.json") {
        serveFile(res, path.join(reportDir, "results.json"));
        return;
      }

      if (url.pathname.startsWith("/screens/")) {
        const rel = decodeURIComponent(url.pathname.slice("/screens/".length));
        const filePath = safeJoin(screensDir, rel);
        if (!filePath) {
          res.writeHead(400);
          res.end();
          return;
        }
        serveFile(res, filePath);
        return;
      }

      const rel = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
      const filePath = safeJoin(reportDir, decodeURIComponent(rel));
      if (!filePath) {
        res.writeHead(400);
        res.end();
        return;
      }
      serveFile(res, filePath);
    });

    server.listen(port, () => {
      resolve({ server, url: `http://localhost:${port}` });
    });
  });

export const openInBrowser = (url: string): void => {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
};
