const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');

// GET /api/audit
router.get('/', (req, res) => {
  const { module: mod, search } = req.query;
  let items = storage.loadCollection('auditLogs');

  if (mod) {
    items = items.filter(l => l.module === mod);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(l =>
      (l.action && l.action.toLowerCase().includes(q)) ||
      (l.performedBy && l.performedBy.toLowerCase().includes(q)) ||
      (l.details && l.details.toLowerCase().includes(q))
    );
  }

  return res.json({ success: true, count: items.length, logs: items });
});

// GET /api/audit/backup (Export complete ERP database)
router.get('/backup', (req, res) => {
  try {
    const backup = storage.createBackup();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="HARMAIN_ERP_BACKUP_${new Date().toISOString().replace(/:/g, '-')}.json"`);
    return res.send(JSON.stringify(backup, null, 2));
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Backup generation failed', error: err.message });
  }
});

// POST /api/audit/restore (Restore database from uploaded JSON)
router.post('/restore', (req, res) => {
  try {
    const backupData = req.body;
    if (!backupData || !backupData.data) {
      return res.status(400).json({ success: false, message: 'Invalid backup file structure' });
    }
    storage.restoreBackup(backupData);
    return res.json({ success: true, message: 'HARMAIN ERP database successfully restored from backup' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Restore failed', error: err.message });
  }
});

module.exports = router;
