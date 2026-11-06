const storage = require('./storageEngine');
const initialData = require('../seed/initialData');

function initializeDatabase() {
  console.log('[HARMAIN ERP] Initializing Database & Verifying Collections...');

  for (const [collectionName, defaultItems] of Object.entries(initialData)) {
    const existing = storage.loadCollection(collectionName);
    if (!existing || existing.length === 0) {
      console.log(`[HARMAIN ERP] Seeding collection: ${collectionName} (${defaultItems.length} records)`);
      storage.cache.set(collectionName, [...defaultItems]);
      storage.persistCollection(collectionName);
    } else {
      console.log(`[HARMAIN ERP] Collection ${collectionName} already has ${existing.length} records.`);
    }
  }

  console.log('[HARMAIN ERP] Database ready with full persistence.');
}

module.exports = initializeDatabase;
