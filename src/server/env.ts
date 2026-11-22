import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

let envLoaded = false;

/**
 * Loads `.env.local` and `.env` into `process.env` without overwriting variables
 * already provided by the host environment (e.g. Vercel / shell).
 * Precedence: existing process.env > .env.local > .env
 */
export function loadServerEnv(force = false): void {
  if (envLoaded && !force) return;
  envLoaded = true;

  const cwd = process.cwd();
  for (const filename of ['.env.local', '.env']) {
    const filePath = path.resolve(cwd, filename);
    try {
      if (fs.existsSync(filePath)) {
        dotenv.config({ path: filePath, override: false, quiet: true });
      }
    } catch {
      // Ignore unreadable env files safely
    }
  }
}

loadServerEnv();
