const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const { authenticate } = require('../middleware/auth');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('pilgrims'));

// GET /api/pilgrims
router.get('/', (req, res) => {
  const { search, status, gender, packageId, groupId } = req.query;
  let items = storage.loadCollection('pilgrims');

  if (search) {
    const q = search.toLowerCase().trim();
    items = items.filter(p =>
      (p.fullName && p.fullName.toLowerCase().includes(q)) ||
      (p.passportNumber && p.passportNumber.toLowerCase().includes(q)) ||
      (p.cnicOrNationalId && p.cnicOrNationalId.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q)) ||
      (p.pilgrimCode && p.pilgrimCode.toLowerCase().includes(q))
    );
  }
  if (status) {
    items = items.filter(p => p.status === status);
  }
  if (gender) {
    items = items.filter(p => p.gender === gender);
  }
  if (packageId) {
    items = items.filter(p => p.packageId === packageId);
  }
  if (groupId) {
    items = items.filter(p => p.assignedGroupId === groupId);
  }

  return res.json({ success: true, count: items.length, pilgrims: items });
});

// GET /api/pilgrims/:id
router.get('/:id', (req, res) => {
  const pilgrim = storage.findById('pilgrims', req.params.id);
  if (!pilgrim) {
    return res.status(404).json({ success: false, message: 'Pilgrim not found' });
  }

  // Enrich with booking, visa, payment, and room details if available
  const booking = pilgrim.currentBookingId ? storage.findById('bookings', pilgrim.currentBookingId) : null;
  const visa = storage.findOne('visas', { pilgrimId: pilgrim.id }) || storage.findOne('visas', { passportNumber: pilgrim.passportNumber });
  const payments = pilgrim.currentBookingId ? storage.find('payments', { bookingId: pilgrim.currentBookingId }) : [];
  const group = pilgrim.assignedGroupId ? storage.findById('groups', pilgrim.assignedGroupId) : null;

  return res.json({
    success: true,
    pilgrim: {
      ...pilgrim,
      booking,
      visaRecord: visa,
      paymentsHistory: payments,
      groupDetails: group
    }
  });
});

// POST /api/pilgrims
router.post('/', (req, res) => {
  const pilgrimCode = storage.getNextId('pilgrim', 'PLG');
  const qrCodeToken = `HRM-PLG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const newPilgrim = {
    pilgrimCode,
    fullName: req.body.fullName,
    arabicName: req.body.arabicName || '',
    gender: req.body.gender || 'Male',
    dateOfBirth: req.body.dateOfBirth || '',
    age: req.body.age || '',
    bloodGroup: req.body.bloodGroup || 'Unknown',
    cnicOrNationalId: req.body.cnicOrNationalId || '',
    passportNumber: (req.body.passportNumber || '').toUpperCase().trim(),
    passportIssueDate: req.body.passportIssueDate || '',
    passportExpiryDate: req.body.passportExpiryDate || '',
    passportIssuingCountry: req.body.passportIssuingCountry || 'Pakistan',
    phone: req.body.phone || '',
    whatsapp: req.body.whatsapp || req.body.phone || '',
    email: req.body.email || '',
    city: req.body.city || '',
    country: req.body.country || 'Pakistan',
    address: req.body.address || '',
    emergencyContactName: req.body.emergencyContactName || '',
    emergencyContactPhone: req.body.emergencyContactPhone || '',
    relationshipWithMahram: req.body.relationshipWithMahram || 'Self',
    mahramId: req.body.mahramId || null,
    mahramName: req.body.mahramName || '',
    isMahram: req.body.isMahram !== undefined ? req.body.isMahram : true,
    currentBookingId: req.body.currentBookingId || null,
    packageId: req.body.packageId || null,
    packageName: req.body.packageName || '',
    visaNumber: req.body.visaNumber || 'Pending',
    visaStatus: req.body.visaStatus || 'Application Created',
    pnrCode: req.body.pnrCode || '',
    flightNumber: req.body.flightNumber || '',
    makkahHotel: req.body.makkahHotel || '',
    makkahRoomNo: req.body.makkahRoomNo || '',
    madinahHotel: req.body.madinahHotel || '',
    madinahRoomNo: req.body.madinahRoomNo || '',
    assignedGroupId: req.body.assignedGroupId || '',
    assignedGroupName: req.body.assignedGroupName || '',
    medicalNotes: req.body.medicalNotes || '',
    qrCodeToken,
    photoUrl: req.body.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    status: req.body.status || 'Active',
    totalTripsWithAgency: 1
  };

  const created = storage.insert('pilgrims', newPilgrim);
  return res.status(201).json({ success: true, message: 'Pilgrim registered successfully', pilgrim: created });
});

// PUT /api/pilgrims/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('pilgrims', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Pilgrim not found' });
  }
  return res.json({ success: true, message: 'Pilgrim profile updated', pilgrim: updated });
});

// DELETE /api/pilgrims/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('pilgrims', req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Pilgrim not found' });
  }
  return res.json({ success: true, message: 'Pilgrim profile removed' });
});

// GET /api/pilgrims/:id/card (Data for Pilgrim ID Card)
router.get('/:id/card', (req, res) => {
  const pilgrim = storage.findById('pilgrims', req.params.id);
  if (!pilgrim) return res.status(404).json({ success: false, message: 'Pilgrim not found' });
  const settings = storage.loadCollection('settings')[0] || {};
  return res.json({
    success: true,
    cardData: {
      agencyName: settings.agencyName,
      dtsLicense: settings.dtsLicense,
      agencyEmergencyPhone: settings.phone,
      saudiOfficeContact: settings.whatsapp,
      pilgrim: {
        id: pilgrim.id,
        code: pilgrim.pilgrimCode,
        fullName: pilgrim.fullName,
        arabicName: pilgrim.arabicName,
        photoUrl: pilgrim.photoUrl,
        passportNumber: pilgrim.passportNumber,
        bloodGroup: pilgrim.bloodGroup,
        emergencyContactName: pilgrim.emergencyContactName,
        emergencyContactPhone: pilgrim.emergencyContactPhone,
        makkahHotel: pilgrim.makkahHotel,
        makkahRoomNo: pilgrim.makkahRoomNo,
        madinahHotel: pilgrim.madinahHotel,
        madinahRoomNo: pilgrim.madinahRoomNo,
        groupName: pilgrim.assignedGroupName,
        qrToken: pilgrim.qrCodeToken
      }
    }
  });
});

module.exports = router;
