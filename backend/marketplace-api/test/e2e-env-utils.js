/**
 * Shared env loading for e2e (Jest globalSetup runs in a different process than tests).
 */
const fs = require('fs');
const path = require('path');

const API_ROOT = path.join(__dirname, '..');

function loadEnvFile(filePath) {
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

function isPostgresUrl(url) {
  return typeof url === 'string' && /^postgres(ql)?:\/\//i.test(url);
}

function loadStandardEnvFiles() {
  loadEnvFile(path.join(API_ROOT, '.env'));
  if (!process.env.DATABASE_URL || !isPostgresUrl(process.env.DATABASE_URL)) {
    loadEnvFile(path.join(API_ROOT, '..', '.env'));
  }
}

function resolvePostgresDatabaseUrl() {
  loadStandardEnvFiles();

  const primary = process.env.DATABASE_URL;
  const agri = process.env.AGRI_DATABASE_URL;

  if (isPostgresUrl(primary)) return primary;
  if (isPostgresUrl(agri)) return agri;

  if (primary && !isPostgresUrl(primary)) {
    throw new Error(
      [
        'E2E: DATABASE_URL is not PostgreSQL (e.g. MongoDB at monorepo root).',
        '',
        'Set AGRI_DATABASE_URL in repo root .env or use backend/marketplace-api/.env — see .env.example',
      ].join('\n'),
    );
  }

  throw new Error(
    `E2E: No PostgreSQL URL. Set DATABASE_URL or AGRI_DATABASE_URL. See ${path.join(API_ROOT, '.env.example')}`,
  );
}

function applyResolvedDatabaseUrl() {
  const url = resolvePostgresDatabaseUrl();
  process.env.DATABASE_URL = url;
  return url;
}

module.exports = {
  API_ROOT,
  loadEnvFile,
  loadStandardEnvFiles,
  isPostgresUrl,
  resolvePostgresDatabaseUrl,
  applyResolvedDatabaseUrl,
};
