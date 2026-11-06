const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('transfers'));

// GET /api/transfers
router.get('/', (req, res) => {
  const { status, transferType } = req.query;
  let items = storage.loadCollection('transfers');
  if (status) items = items.filter(t => t.status === status);
  if (transferType) items = items.filter(t => t.transferType === transferType);
  return res.json({ success: true, count: items.length, transfers: items });
});

// POST /api/transfers
router.post('/', (req, res) => {
  const newTransfer = {
    bookingId: req.body.bookingId || '',
    groupOrLeadName: req.body.groupOrLeadName || 'Guest Pilgrim',
    transferType: req.body.transferType || 'Airport Arrival Pickup',
    pickupLocation: req.body.pickupLocation,
    dropoffLocation: req.body.dropoffLocation,
    flightNumber: req.body.flightNumber || '',
    estimatedArrival: req.body.estimatedArrival,
    assignedVehicle: req.body.assignedVehicle || 'GMC Yukon XL',
    assignedDriver: req.body.assignedDriver || '',
    driverPhone: req.body.driverPhone || '',
    bannerSignText: req.body.bannerSignText || `HARMAIN ERP: ${req.body.groupOrLeadName || 'GUEST'}`,
    passengerCount: parseInt(req.body.passengerCount || 1, 10),
    luggageCount: parseInt(req.body.luggageCount || 2, 10),
    status: req.body.status || 'Scheduled',
    notes: req.body.notes || ''
  };

  const created = storage.insert('transfers', newTransfer);
  return res.status(201).json({ success: true, message: 'Airport transfer scheduled', transfer: created });
});

// PUT /api/transfers/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('transfers', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Transfer not found' });
  return res.json({ success: true, message: 'Transfer schedule updated', transfer: updated });
});

// DELETE /api/transfers/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('transfers', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Transfer not found' });
  return res.json({ success: true, message: 'Transfer canceled' });
});

module.exports = router;
