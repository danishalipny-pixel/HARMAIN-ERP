const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('transport'));

// VEHICLES
// GET /api/transport/vehicles
router.get('/vehicles', (req, res) => {
  const { status, type } = req.query;
  let items = storage.loadCollection('vehicles');
  if (status) items = items.filter(v => v.status === status);
  if (type) items = items.filter(v => v.type && v.type.toLowerCase().includes(type.toLowerCase()));
  return res.json({ success: true, count: items.length, vehicles: items });
});

// POST /api/transport/vehicles
router.post('/vehicles', (req, res) => {
  const newVehicle = {
    vehicleName: req.body.vehicleName,
    type: req.body.type || 'VIP Luxury SUV',
    registrationPlate: req.body.registrationPlate,
    seatingCapacity: parseInt(req.body.seatingCapacity || 7, 10),
    luggageCapacity: req.body.luggageCapacity || '6 Large Bags',
    supplier: req.body.supplier || 'Harmain Executive Fleet KSA',
    dailyRateSAR: parseFloat(req.body.dailyRateSAR || 1200),
    amenities: req.body.amenities || ['Leather Interior', 'Complimentary WiFi', 'Chilled Zamzam'],
    status: req.body.status || 'Available',
    currentDriver: req.body.currentDriver || ''
  };
  const created = storage.insert('vehicles', newVehicle);
  return res.status(201).json({ success: true, message: 'Vehicle added to fleet', vehicle: created });
});

// PUT /api/transport/vehicles/:id
router.put('/vehicles/:id', (req, res) => {
  const updated = storage.update('vehicles', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  return res.json({ success: true, message: 'Vehicle updated', vehicle: updated });
});

// DELETE /api/transport/vehicles/:id
router.delete('/vehicles/:id', (req, res) => {
  const success = storage.delete('vehicles', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  return res.json({ success: true, message: 'Vehicle deleted' });
});

// DRIVERS
// GET /api/transport/drivers
router.get('/drivers', (req, res) => {
  const { status } = req.query;
  let items = storage.loadCollection('drivers');
  if (status) items = items.filter(d => d.status === status);
  return res.json({ success: true, count: items.length, drivers: items });
});

// POST /api/transport/drivers
router.post('/drivers', (req, res) => {
  const newDriver = {
    fullName: req.body.fullName,
    nationality: req.body.nationality || 'Saudi Arabian',
    iqamaNumber: req.body.iqamaNumber || '',
    licenseNumber: req.body.licenseNumber || '',
    mobileNumber: req.body.mobileNumber,
    whatsapp: req.body.whatsapp || req.body.mobileNumber,
    languages: Array.isArray(req.body.languages) ? req.body.languages : ['Arabic', 'Urdu'],
    assignedVehicleId: req.body.assignedVehicleId || '',
    assignedVehicleName: req.body.assignedVehicleName || '',
    rating: parseFloat(req.body.rating || 4.9),
    status: 'Active'
  };
  const created = storage.insert('drivers', newDriver);
  return res.status(201).json({ success: true, message: 'Driver registered', driver: created });
});

// PUT /api/transport/drivers/:id
router.put('/drivers/:id', (req, res) => {
  const updated = storage.update('drivers', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Driver not found' });
  return res.json({ success: true, message: 'Driver updated', driver: updated });
});

// DELETE /api/transport/drivers/:id
router.delete('/drivers/:id', (req, res) => {
  const success = storage.delete('drivers', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Driver not found' });
  return res.json({ success: true, message: 'Driver deleted' });
});

module.exports = router;
