const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('groups'));

// GET /api/groups
router.get('/', (req, res) => {
  const { status, type } = req.query;
  let items = storage.loadCollection('groups');
  if (status) items = items.filter(g => g.status === status);
  if (type) items = items.filter(g => g.type && g.type.includes(type));
  return res.json({ success: true, count: items.length, groups: items });
});

// GET /api/groups/:id
router.get('/:id', (req, res) => {
  const group = storage.findById('groups', req.params.id);
  if (!group) return res.status(404).json({ success: false, message: 'Group caravan not found' });
  const pilgrims = storage.find('pilgrims', { assignedGroupId: group.id });
  return res.json({ success: true, group: { ...group, pilgrims } });
});

// GET /api/groups/:id/manifest (Passenger Manifest for Airlines, Hotels, Moallim)
router.get('/:id/manifest', (req, res) => {
  const group = storage.findById('groups', req.params.id);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

  const pilgrims = storage.find('pilgrims', { assignedGroupId: group.id });
  const settings = storage.loadCollection('settings')[0] || {};

  const manifest = {
    agencyName: settings.agencyName,
    munazzamId: settings.munazzamId,
    dtsLicense: settings.dtsLicense,
    groupCode: group.groupCode,
    groupName: group.name,
    leaderName: group.caravanLeaderName,
    leaderPhone: group.caravanLeaderPhone,
    departureDate: group.departureDate,
    returnDate: group.returnDate,
    flight: group.assignedFlightCode,
    makkahHotel: group.makkahHotel,
    madinahHotel: group.madinahHotel,
    passengerCount: pilgrims.length,
    passengers: pilgrims.map((p, idx) => ({
      serial: idx + 1,
      name: p.fullName,
      arabicName: p.arabicName,
      gender: p.gender,
      passport: p.passportNumber,
      expiry: p.passportExpiryDate,
      visaNumber: p.visaNumber,
      pnr: p.pnrCode,
      makkahRoom: p.makkahRoomNo,
      madinahRoom: p.madinahRoomNo,
      phone: p.phone,
      emergencyContact: p.emergencyContactName + ' (' + p.emergencyContactPhone + ')'
    }))
  };

  return res.json({ success: true, manifest });
});

// POST /api/groups
router.post('/', (req, res) => {
  const groupId = storage.getNextId('group', 'HRM-GRP');
  const newGroup = {
    id: groupId,
    groupCode: req.body.groupCode || `GRP-${Date.now().toString().slice(-4)}`,
    name: req.body.name,
    type: req.body.type || 'Umrah',
    caravanLeaderName: req.body.caravanLeaderName,
    caravanLeaderPhone: req.body.caravanLeaderPhone,
    departureDate: req.body.departureDate,
    returnDate: req.body.returnDate,
    originCity: req.body.originCity || 'Islamabad',
    targetPilgrims: parseInt(req.body.targetPilgrims || 40, 10),
    confirmedPilgrims: 0,
    assignedFlightCode: req.body.assignedFlightCode || '',
    makkahHotel: req.body.makkahHotel || '',
    madinahHotel: req.body.madinahHotel || '',
    busLeader: req.body.busLeader || '',
    status: req.body.status || 'Forming',
    notes: req.body.notes || ''
  };

  const created = storage.insert('groups', newGroup);
  return res.status(201).json({ success: true, message: 'Group caravan created', group: created });
});

// PUT /api/groups/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('groups', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Group not found' });
  return res.json({ success: true, message: 'Group updated', group: updated });
});

// DELETE /api/groups/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('groups', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Group not found' });
  return res.json({ success: true, message: 'Group removed' });
});

module.exports = router;
