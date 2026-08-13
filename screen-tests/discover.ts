import fs from "node:fs";
import path from "node:path";
import { projectRoot, screenTestsDir } from "./paths.ts";

const ROUTING_FILE = path.join(projectRoot, "src", "mobile", "routing.js");
const CONFIG_FILE = path.join(screenTestsDir, "config.ts");

const ROUTE_ATTR = /<Route\s+(?:is|startsWith)=(?:\{"([^"]+)"\}|"([^"]+)")/g;

type DiscoveredRoute = { name: string; path: string };

/**
 * Best-effort route scanner for this app's hash router (src/packages/router/router.js).
 * There's no file-based routing to walk (this isn't Next.js), so we regex-scan the
 * top-level <Route is="..."> / <Route startsWith="..."> declarations instead. Dynamic
 * segments ("orders/{id}") and routes only declared inside nested *routing.js files
 * (behind a startsWith handoff) are out of scope for this simple pass.
 */
export const discoverRoutes = (routingFilePath: string): DiscoveredRoute[] => {
  const source = fs.readFileSync(routingFilePath, "utf-8");
  const seen = new Set<string>();
  const routes: DiscoveredRoute[] = [];

  for (const match of source.matchAll(ROUTE_ATTR)) {
    const route = match[1] ?? match[2];
    if (!route || route.includes("{") || seen.has(route)) continue;
    seen.add(route);
    routes.push({ name: route.replace(/\//g, "-"), path: `/#${route}` });
  }

  return routes;
};

const existingScreenNames = (configSource: string): Set<string> =>
  new Set(Array.from(configSource.matchAll(/name:\s*"([^"]+)"/g), (m) => m[1]));

const insertScreens = (configSource: string, newRoutes: DiscoveredRoute[]): string => {
  const marker = /(\n  screens: \[\n)([\s\S]*?)(\n  \],\n\};)/;
  const match = configSource.match(marker);
  if (!match) {
    throw new Error("Could not find `screens: [ ... ]` in config.ts — leaving it untouched.");
  }

  const additions = newRoutes
    .map((r) => `    { name: "${r.name}", path: "${r.path}" }, // discovered — review public/viewports`)
    .join("\n");

  const [, open, body, close] = match;
  const updatedBody = `${body}\n${additions}`;
  return configSource.replace(marker, `${open}${updatedBody}${close}`);
};

const main = (): void => {
  if (!fs.existsSync(ROUTING_FILE)) {
    console.error(`Routing file not found: ${ROUTING_FILE}`);
    process.exitCode = 2;
    return;
  }

  const discovered = discoverRoutes(ROUTING_FILE);
  const configSource = fs.readFileSync(CONFIG_FILE, "utf-8");
  const known = existingScreenNames(configSource);
  const newRoutes = discovered.filter((r) => !known.has(r.name));

  console.log(`Discovered ${discovered.length} route(s) in ${path.relative(projectRoot, ROUTING_FILE)}`);

  if (newRoutes.length === 0) {
    console.log("No new routes to add — config.ts already covers everything discovered.");
    return;
  }

  console.log(`Adding ${newRoutes.length} new screen(s) to config.ts:`);
  for (const route of newRoutes) {
    console.log(`  + ${route.name} -> ${route.path}`);
  }

  fs.writeFileSync(CONFIG_FILE, insertScreens(configSource, newRoutes));
  console.log("\nReview config.ts — mark any logged-out screens with `public: true`.");
};

main();
