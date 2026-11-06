const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('expenses'));

// GET /api/expenses
router.get('/', (req, res) => {
  const { category, bookingId, search } = req.query;
  let items = storage.loadCollection('expenses');

  if (category) items = items.filter(e => e.category === category);
  if (bookingId) items = items.filter(e => e.bookingId === bookingId);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(e =>
      (e.supplierName && e.supplierName.toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.invoiceRef && e.invoiceRef.toLowerCase().includes(q))
    );
  }

  const totalExpensePKR = items.reduce((sum, e) => sum + (parseFloat(e.amountPKR) || 0), 0);
  return res.json({ success: true, count: items.length, totalExpensePKR, expenses: items });
});

// POST /api/expenses
router.post('/', (req, res) => {
  const settings = storage.loadCollection('settings')[0] || { exchangeRates: { SAR: 74.50, USD: 278.50 } };
  const currency = req.body.currency || 'PKR';
  let amountPKR = parseFloat(req.body.amountPKR || 0);

  if (currency === 'SAR' && !amountPKR && req.body.amountInCurrency) {
    amountPKR = Math.round(parseFloat(req.body.amountInCurrency) * settings.exchangeRates.SAR);
  } else if (currency === 'USD' && !amountPKR && req.body.amountInCurrency) {
    amountPKR = Math.round(parseFloat(req.body.amountInCurrency) * settings.exchangeRates.USD);
  }

  const newExpense = {
    expenseNumber: `EXP-${Date.now().toString().slice(-4)}`,
    category: req.body.category || 'General Operational',
    bookingId: req.body.bookingId || null,
    supplierName: req.body.supplierName || 'General Vendor',
    amountPKR,
    currency,
    amountInCurrency: req.body.amountInCurrency || amountPKR,
    exchangeRate: currency === 'SAR' ? settings.exchangeRates.SAR : (currency === 'USD' ? settings.exchangeRates.USD : 1),
    paymentDate: req.body.paymentDate || new Date().toISOString().split('T')[0],
    paymentMethod: req.body.paymentMethod || 'Bank Transfer',
    invoiceRef: req.body.invoiceRef || `INV-${Date.now().toString().slice(-6)}`,
    description: req.body.description || '',
    status: req.body.status || 'Paid'
  };

  const created = storage.insert('expenses', newExpense);
  return res.status(201).json({ success: true, message: 'Expense recorded', expense: created });
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('expenses', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Expense not found' });
  return res.json({ success: true, message: 'Expense deleted' });
});

module.exports = router;
