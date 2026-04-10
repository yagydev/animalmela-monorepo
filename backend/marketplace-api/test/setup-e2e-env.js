/**
 * Runs inside the Jest test process (unlike globalSetup). Ensures Prisma sees PostgreSQL DATABASE_URL.
 */
const { applyResolvedDatabaseUrl } = require('./e2e-env-utils');

applyResolvedDatabaseUrl();
