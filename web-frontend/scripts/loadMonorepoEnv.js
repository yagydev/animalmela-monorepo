/**
 * Load env for Node seed scripts: web-frontend/.env* then monorepo root .env* (override).
 * Ensures Atlas DATABASE_URL / MONGODB_URI win over stale localhost in web-frontend.
 */
const fs = require('fs');
const path = require('path');

function parseEnvLines(raw, { overrideAll = false } = {}) {
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (overrideAll || !process.env[key]) process.env[key] = val;
  }
}

function loadEnvFile(relFromWebFrontendRoot) {
  try {
    const p = path.join(__dirname, '..', relFromWebFrontendRoot);
    parseEnvLines(fs.readFileSync(p, 'utf8'));
  } catch {
    /* missing */
  }
}

function loadMonorepoRootEnv() {
  try {
    parseEnvLines(fs.readFileSync(path.join(__dirname, '..', '..', '.env'), 'utf8'), {
      overrideAll: true,
    });
  } catch {
    /* missing */
  }
  try {
    parseEnvLines(fs.readFileSync(path.join(__dirname, '..', '..', '.env.local'), 'utf8'), {
      overrideAll: true,
    });
  } catch {
    /* missing */
  }
}

function loadAllSeedEnv() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');
  loadMonorepoRootEnv();
}

function resolveMongoUri() {
  loadAllSeedEnv();
  const uri =
    process.env.MONGODB_URI?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    'mongodb://localhost:27017/kisaanmela';
  if (!uri.startsWith('mongodb')) {
    throw new Error(
      'Set MONGODB_URI or DATABASE_URL to a mongodb:// or mongodb+srv:// string (see monorepo .env)',
    );
  }
  return uri;
}

module.exports = { loadAllSeedEnv, resolveMongoUri, loadMonorepoRootEnv };
