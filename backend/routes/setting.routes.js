const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('settings'));

// GET /api/settings
router.get('/', (req, res) => {
  const settings = storage.loadCollection('settings')[0] || {};
  return res.json({ success: true, settings });
});

// PUT /api/settings
router.put('/', (req, res) => {
  const current = storage.loadCollection('settings')[0];
  if (!current) {
    const created = storage.insert('settings', req.body);
    return res.json({ success: true, message: 'Settings saved', settings: created });
  }
  const updated = storage.update('settings', current.id, req.body);
  return res.json({ success: true, message: 'Agency settings updated successfully', settings: updated });
});

module.exports = router;
