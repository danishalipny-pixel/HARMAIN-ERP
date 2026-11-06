const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('branches'));

// GET /api/branches
router.get('/', (req, res) => {
  const branches = storage.loadCollection('branches');
  const bookings = storage.loadCollection('bookings');

  // Calculate revenue & active bookings per branch dynamically
  const enriched = branches.map(b => {
    const branchBookings = bookings.filter(bk => bk.branchId === b.id || bk.branchName === b.name);
    const revenue = branchBookings.reduce((sum, bk) => sum + (parseFloat(bk.financials ? bk.financials.totalSellingPrice : 0) || 0), 0);
    return {
      ...b,
      bookingCount: branchBookings.length,
      revenuePKR: revenue
    };
  });

  return res.json({ success: true, count: enriched.length, branches: enriched });
});

// POST /api/branches
router.post('/', (req, res) => {
  const newBranch = {
    code: req.body.code || `BR-${Date.now().toString().slice(-3)}`,
    name: req.body.name,
    city: req.body.city,
    country: req.body.country || 'Pakistan',
    address: req.body.address || '',
    phone: req.body.phone || '',
    manager: req.body.manager || '',
    isHeadOffice: Boolean(req.body.isHeadOffice),
    staffCount: parseInt(req.body.staffCount || 5, 10),
    status: 'Active'
  };

  const created = storage.insert('branches', newBranch);
  return res.status(201).json({ success: true, message: 'Branch registered', branch: created });
});

// PUT /api/branches/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('branches', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Branch not found' });
  return res.json({ success: true, message: 'Branch updated', branch: updated });
});

// DELETE /api/branches/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('branches', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Branch not found' });
  return res.json({ success: true, message: 'Branch removed' });
});

module.exports = router;
