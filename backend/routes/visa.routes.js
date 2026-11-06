const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('visas'));

// GET /api/visas
router.get('/', (req, res) => {
  const { stage, status, search } = req.query;
  let items = storage.loadCollection('visas');

  if (search) {
    const q = search.toLowerCase().trim();
    items = items.filter(v =>
      (v.pilgrimName && v.pilgrimName.toLowerCase().includes(q)) ||
      (v.passportNumber && v.passportNumber.toLowerCase().includes(q)) ||
      (v.mofaNumber && v.mofaNumber.toLowerCase().includes(q)) ||
      (v.visaNumber && v.visaNumber.toLowerCase().includes(q)) ||
      (v.id && v.id.toLowerCase().includes(q))
    );
  }
  if (stage) {
    items = items.filter(v => v.stage === stage);
  }
  if (status) {
    items = items.filter(v => v.status === status);
  }

  return res.json({ success: true, count: items.length, visas: items });
});

// POST /api/visas
router.post('/', (req, res) => {
  const settings = storage.loadCollection('settings')[0] || { exchangeRates: { SAR: 74.50 } };
  const sarRate = settings.exchangeRates.SAR || 74.50;

  const agencyFeeSAR = parseFloat(req.body.agencyFeeSAR || 450);
  const costFeeSAR = parseFloat(req.body.costFeeSAR || 380);
  const agencyFeePKR = Math.round(agencyFeeSAR * sarRate);
  const costFeePKR = Math.round(costFeeSAR * sarRate);
  const profitPKR = agencyFeePKR - costFeePKR;

  const visaId = storage.getNextId('visa', 'HRM-VSA');

  const newVisa = {
    id: visaId,
    pilgrimId: req.body.pilgrimId || '',
    pilgrimName: req.body.pilgrimName,
    passportNumber: (req.body.passportNumber || '').toUpperCase().trim(),
    visaType: req.body.visaType || 'Umrah E-Visa (KSA Single Entry 90 Days)',
    mofaNumber: req.body.mofaNumber || '',
    visaNumber: req.body.visaNumber || '',
    submissionDate: req.body.submissionDate || new Date().toISOString().split('T')[0],
    issueDate: req.body.issueDate || '',
    expiryDate: req.body.expiryDate || '',
    insurancePolicyNo: req.body.insurancePolicyNo || '',
    stage: req.body.stage || 'Documents Received',
    agencyFeeSAR,
    agencyFeePKR,
    costFeeSAR,
    costFeePKR,
    profitPKR,
    tasheerStatus: req.body.tasheerStatus || 'Biometrics Scheduled',
    status: req.body.status || 'In Process',
    notes: req.body.notes || ''
  };

  const created = storage.insert('visas', newVisa);

  // Sync back to pilgrim profile if pilgrimId is provided
  if (req.body.pilgrimId) {
    storage.update('pilgrims', req.body.pilgrimId, {
      visaStatus: newVisa.stage,
      visaNumber: newVisa.visaNumber || 'In Process'
    });
  }

  return res.status(201).json({ success: true, message: 'Visa application recorded', visa: created });
});

// PUT /api/visas/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('visas', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Visa record not found' });

  // Sync to pilgrim profile
  if (updated.pilgrimId) {
    storage.update('pilgrims', updated.pilgrimId, {
      visaStatus: updated.stage,
      visaNumber: updated.visaNumber || 'Pending'
    });
  }

  return res.json({ success: true, message: 'Visa status updated', visa: updated });
});

// DELETE /api/visas/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('visas', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Visa record not found' });
  return res.json({ success: true, message: 'Visa record deleted' });
});

module.exports = router;
