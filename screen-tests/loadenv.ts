import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const screenTestsDir = path.dirname(fileURLToPath(import.meta.url));

/** Loads `.screen-auth/.env` (project root, gitignored) into process.env, if present. */
export const loadScreenAuthEnv = (): void => {
  const envPath = path.join(screenTestsDir, "..", ".screen-auth", ".env");
  if (!fs.existsSync(envPath)) return;
  process.loadEnvFile(envPath);
};
