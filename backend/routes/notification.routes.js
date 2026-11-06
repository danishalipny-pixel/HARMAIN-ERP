const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');

// GET /api/notifications
router.get('/', (req, res) => {
  const notifications = storage.loadCollection('notifications');
  const unreadCount = notifications.filter(n => !n.read).length;
  return res.json({ success: true, count: notifications.length, unreadCount, notifications });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', (req, res) => {
  const updated = storage.update('notifications', req.params.id, { read: true });
  if (!updated) return res.status(404).json({ success: false, message: 'Notification not found' });
  return res.json({ success: true, notification: updated });
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', (req, res) => {
  const notifications = storage.loadCollection('notifications');
  notifications.forEach(n => { n.read = true; });
  storage.persistCollection('notifications');
  return res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = router;
