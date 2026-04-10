/**
 * Waits for Postgres TCP before e2e (same URL resolution as setup-e2e-env.js).
 */
const net = require('net');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { API_ROOT, applyResolvedDatabaseUrl } = require('./e2e-env-utils');

function parseHostPort(databaseUrl) {
  try {
    const u = new URL(databaseUrl);
    return { host: u.hostname, port: u.port ? parseInt(u.port, 10) : 5432 };
  } catch {
    return null;
  }
}

function dockerCliWorks() {
  try {
    execSync('docker info', { stdio: 'ignore', timeout: 8000 });
    return true;
  } catch {
    return false;
  }
}

function dockerSocketExists() {
  if (process.env.DOCKER_HOST) return true;
  const candidates = [
    process.platform === 'darwin' && process.env.HOME
      ? path.join(process.env.HOME, '.docker/run/docker.sock')
      : null,
    '/var/run/docker.sock',
  ].filter(Boolean);
  return candidates.some((p) => fs.existsSync(p));
}

function waitForPostgres(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const attempt = () => {
      const socket = net.createConnection({ host, port }, () => {
        socket.end();
        resolve();
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - start >= timeoutMs) {
          const lines = [
            `E2E: Postgres is not reachable at ${host}:${port} after ${timeoutMs}ms.`,
            '',
            'Typical fix (Docker Postgres on port 5433):',
            `  cd ${API_ROOT}`,
            '  # Start Docker Desktop first (macOS/Windows), then:',
            '  npm run db:up              # postgres container only',
            '  npx prisma migrate deploy',
            '',
            'Or install Postgres locally and set DATABASE_URL / AGRI_DATABASE_URL.',
          ];

          if (!dockerCliWorks()) {
            lines.push(
              '',
              'Docker: `docker info` failed — the Docker daemon is not running.',
              '  macOS: open Docker Desktop and wait until it is idle, then retry.',
            );
          } else if (!dockerSocketExists()) {
            lines.push('', 'Docker socket not found; start Docker Desktop and retry.');
          }

          reject(new Error(lines.join('\n')));
          return;
        }
        setTimeout(attempt, 400);
      });
    };

    attempt();
  });
}

module.exports = async function globalSetup() {
  const databaseUrl = applyResolvedDatabaseUrl();
  const hp = parseHostPort(databaseUrl);
  if (!hp || !hp.host) {
    throw new Error('E2E: Could not parse host/port from DATABASE_URL');
  }

  const timeout = parseInt(process.env.E2E_DB_WAIT_MS || '30000', 10);
  await waitForPostgres(hp.host, hp.port, timeout);
};
