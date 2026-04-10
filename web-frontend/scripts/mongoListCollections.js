/**
 * List MongoDB database name + collections + doc counts (verify Atlas / Compass).
 * Run: node scripts/mongoListCollections.js   (from web-frontend; uses monorepo root .env)
 */
const mongoose = require('mongoose');
const { resolveMongoUri } = require('./loadMonorepoEnv');

(async () => {
  try {
    const uri = resolveMongoUri();
    console.log('Connecting:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const name = db.databaseName;
    console.log('\n✅ Database:', name);
    console.log('(In Compass: open this database in the left sidebar — not "admin" or "local")\n');

    const cols = await db.listCollections().toArray();
    if (cols.length === 0) {
      console.log('No collections yet. Run: npm run seed:all');
    } else {
      for (const c of cols.sort((a, b) => a.name.localeCompare(b.name))) {
        const n = await db.collection(c.name).countDocuments();
        console.log(`  • ${c.name}: ${n} documents`);
      }
    }
  } catch (e) {
    console.error('❌', e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
