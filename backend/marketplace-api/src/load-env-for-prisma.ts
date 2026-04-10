import * as fs from 'fs';
import * as path from 'path';

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function isPostgresUrl(url: string | undefined): boolean {
  return typeof url === 'string' && /^postgres(ql)?:\/\//i.test(url);
}

/**
 * Load api/.env then repo root .env so monorepo works; use AGRI_DATABASE_URL when DATABASE_URL is MongoDB.
 * Call before NestFactory so Prisma sees the correct URL.
 */
export function loadEnvForPrisma(): void {
  const cwd = process.cwd();
  loadEnvFile(path.join(cwd, '.env'));
  loadEnvFile(path.join(cwd, '..', '.env'));

  const primary = process.env.DATABASE_URL;
  const agri = process.env.AGRI_DATABASE_URL;
  if (!isPostgresUrl(primary) && isPostgresUrl(agri)) {
    process.env.DATABASE_URL = agri;
  }
}
