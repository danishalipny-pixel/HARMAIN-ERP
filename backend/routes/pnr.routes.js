const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('pnrs'));

// GET /api/pnrs
router.get('/', (req, res) => {
  const { search, airline, status } = req.query;
  let items = storage.loadCollection('pnrs');

  if (search) {
    const q = search.toLowerCase().trim();
    items = items.filter(p =>
      (p.pnrCode && p.pnrCode.toLowerCase().includes(q)) ||
      (p.passengers && p.passengers.some(pax => pax.toLowerCase().includes(q))) ||
      (p.bookingRef && p.bookingRef.toLowerCase().includes(q))
    );
  }
  if (airline) {
    items = items.filter(p => p.airline && p.airline.includes(airline));
  }
  if (status) {
    items = items.filter(p => p.status === status);
  }

  return res.json({ success: true, count: items.length, pnrs: items });
});

// POST /api/pnrs
router.post('/', (req, res) => {
  const purchase = parseFloat(req.body.purchasePricePKR || 0);
  const selling = parseFloat(req.body.sellingPricePKR || 0);
  const margin = selling - purchase;

  const newPnr = {
    pnrCode: (req.body.pnrCode || Math.random().toString(36).substr(2, 6)).toUpperCase(),
    airline: req.body.airline || 'Saudia (SV)',
    flightNumbers: Array.isArray(req.body.flightNumbers) ? req.body.flightNumbers : [req.body.flightNumbers || 'SV-739'],
    bookingRef: req.body.bookingRef || 'Direct PNR Issuance',
    passengerCount: parseInt(req.body.passengerCount || 1, 10),
    passengers: Array.isArray(req.body.passengers) ? req.body.passengers : [req.body.passengers || 'Passenger 1'],
    issueDate: req.body.issueDate || new Date().toISOString().split('T')[0],
    ticketNumbers: Array.isArray(req.body.ticketNumbers) ? req.body.ticketNumbers : [req.body.ticketNumbers || '065-TKT-' + Date.now().toString().slice(-6)],
    supplier: req.body.supplier || 'Saudia Direct Consolidator',
    purchasePricePKR: purchase,
    sellingPricePKR: selling,
    marginPKR: margin,
    status: req.body.status || 'Ticketed & Confirmed'
  };

  const created = storage.insert('pnrs', newPnr);
  return res.status(201).json({ success: true, message: 'PNR Ticket created', pnr: created });
});

// PUT /api/pnrs/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('pnrs', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'PNR not found' });
  return res.json({ success: true, message: 'PNR updated', pnr: updated });
});

// DELETE /api/pnrs/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('pnrs', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'PNR not found' });
  return res.json({ success: true, message: 'PNR deleted' });
});

module.exports = router;
