const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('staff'));

// GET /api/staff
router.get('/', (req, res) => {
  const { department, branch, status } = req.query;
  let items = storage.loadCollection('staff');
  if (department) items = items.filter(s => s.department === department);
  if (branch) items = items.filter(s => s.branch === branch);
  if (status) items = items.filter(s => s.status === status);
  return res.json({ success: true, count: items.length, staff: items });
});

// POST /api/staff
router.post('/', (req, res) => {
  const newStaff = {
    name: req.body.name,
    designation: req.body.designation || 'Officer',
    department: req.body.department || 'Operations',
    branch: req.body.branch || 'Islamabad Head Office',
    email: req.body.email,
    phone: req.body.phone,
    salaryPKR: parseFloat(req.body.salaryPKR || 80000),
    joiningDate: req.body.joiningDate || new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  const created = storage.insert('staff', newStaff);
  return res.status(201).json({ success: true, message: 'Employee added to team', staff: created });
});

// PUT /api/staff/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('staff', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Staff record not found' });
  return res.json({ success: true, message: 'Staff record updated', staff: updated });
});

// DELETE /api/staff/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('staff', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Staff record not found' });
  return res.json({ success: true, message: 'Staff record removed' });
});

module.exports = router;
