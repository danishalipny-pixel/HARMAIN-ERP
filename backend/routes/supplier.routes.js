const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('suppliers'));

// GET /api/suppliers
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let items = storage.loadCollection('suppliers');

  if (category) items = items.filter(s => s.category === category);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(s =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(q))
    );
  }

  const totalPayablesPKR = items.reduce((sum, s) => sum + (parseFloat(s.balancePayablePKR) || 0), 0);
  return res.json({ success: true, count: items.length, totalPayablesPKR, suppliers: items });
});

// POST /api/suppliers
router.post('/', (req, res) => {
  const totalOrders = parseFloat(req.body.totalOrdersPKR || 0);
  const totalPaid = parseFloat(req.body.totalPaidPKR || 0);
  const balance = Math.max(0, totalOrders - totalPaid);

  const newSupplier = {
    name: req.body.name,
    category: req.body.category || 'General Vendor',
    contactPerson: req.body.contactPerson || '',
    phone: req.body.phone || '',
    email: req.body.email || '',
    country: req.body.country || 'Saudi Arabia',
    totalOrdersPKR: totalOrders,
    totalPaidPKR: totalPaid,
    balancePayablePKR: balance,
    paymentTerms: req.body.paymentTerms || 'Standard Terms',
    status: 'Active'
  };

  const created = storage.insert('suppliers', newSupplier);
  return res.status(201).json({ success: true, message: 'Supplier registered', supplier: created });
});

// POST /api/suppliers/:id/pay
router.post('/:id/pay', (req, res) => {
  const supplier = storage.findById('suppliers', req.params.id);
  if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

  const paymentAmount = parseFloat(req.body.amountPKR || 0);
  const currentPaid = parseFloat(supplier.totalPaidPKR || 0);
  const newTotalPaid = currentPaid + paymentAmount;
  const newBalance = Math.max(0, (supplier.totalOrdersPKR || 0) - newTotalPaid);

  const updated = storage.update('suppliers', supplier.id, {
    totalPaidPKR: newTotalPaid,
    balancePayablePKR: newBalance
  });

  // Record an expense automatically
  storage.insert('expenses', {
    expenseNumber: `EXP-${Date.now().toString().slice(-4)}`,
    category: `Supplier Payment (${supplier.category})`,
    supplierName: supplier.name,
    amountPKR: paymentAmount,
    currency: req.body.currency || 'PKR',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: req.body.paymentMethod || 'Bank Wire',
    invoiceRef: `SUP-PAY-${supplier.id}`,
    description: `Disbursement to supplier ${supplier.name}. Ref: ${req.body.notes || 'Ledger Settlement'}`,
    status: 'Paid'
  });

  return res.json({ success: true, message: `Disbursed ${paymentAmount} PKR to ${supplier.name}`, supplier: updated });
});

// PUT /api/suppliers/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('suppliers', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Supplier not found' });
  return res.json({ success: true, message: 'Supplier updated', supplier: updated });
});

// DELETE /api/suppliers/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('suppliers', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Supplier not found' });
  return res.json({ success: true, message: 'Supplier removed' });
});

module.exports = router;
