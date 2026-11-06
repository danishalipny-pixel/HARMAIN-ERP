const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('ziyarat'));

// GET /api/ziyarat
router.get('/', (req, res) => {
  const { city, status } = req.query;
  let items = storage.loadCollection('ziyarat');
  if (city) items = items.filter(z => z.city && z.city.toLowerCase().includes(city.toLowerCase()));
  if (status) items = items.filter(z => z.status === status);
  return res.json({ success: true, count: items.length, tours: items });
});

// POST /api/ziyarat
router.post('/', (req, res) => {
  const newZiyarat = {
    city: req.body.city || 'Makkah Al-Mukarramah',
    title: req.body.title,
    scheduleDate: req.body.scheduleDate,
    departureTime: req.body.departureTime || '07:00 AM',
    meetingPoint: req.body.meetingPoint || 'Hotel Lobby',
    guideName: req.body.guideName || 'Licensed Islamic Scholar',
    guideContact: req.body.guideContact || '',
    assignedVehicle: req.body.assignedVehicle || 'Coaster Luxury Bus',
    driverName: req.body.driverName || '',
    destinations: Array.isArray(req.body.destinations) ? req.body.destinations : [
      { name: req.body.primarySite || 'Holy Landmark', description: 'Historical Islamic Site' }
    ],
    durationHours: parseFloat(req.body.durationHours || 4),
    refreshmentsProvided: req.body.refreshmentsProvided || 'Zamzam & Dates',
    status: req.body.status || 'Scheduled'
  };

  const created = storage.insert('ziyarat', newZiyarat);
  return res.status(201).json({ success: true, message: 'Ziyarat tour scheduled', tour: created });
});

// PUT /api/ziyarat/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('ziyarat', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Tour not found' });
  return res.json({ success: true, message: 'Tour updated', tour: updated });
});

// DELETE /api/ziyarat/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('ziyarat', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Tour not found' });
  return res.json({ success: true, message: 'Tour deleted' });
});

module.exports = router;
