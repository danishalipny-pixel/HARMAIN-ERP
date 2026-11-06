const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('payments'));

// GET /api/payments
router.get('/', (req, res) => {
  const { bookingId, search } = req.query;
  let items = storage.loadCollection('payments');

  if (bookingId) items = items.filter(p => p.bookingId === bookingId);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(p =>
      (p.receiptNumber && p.receiptNumber.toLowerCase().includes(q)) ||
      (p.customerName && p.customerName.toLowerCase().includes(q)) ||
      (p.bankReferenceNo && p.bankReferenceNo.toLowerCase().includes(q))
    );
  }

  const totalCollectedPKR = items.reduce((sum, p) => sum + (parseFloat(p.amountPKR) || 0), 0);
  return res.json({ success: true, count: items.length, totalCollectedPKR, payments: items });
});

// GET /api/payments/:id/receipt
router.get('/:id/receipt', (req, res) => {
  const payment = storage.findById('payments', req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Receipt not found' });

  const booking = payment.bookingId ? storage.findById('bookings', payment.bookingId) : null;
  const settings = storage.loadCollection('settings')[0] || {};

  return res.json({
    success: true,
    receiptData: {
      agencyName: settings.agencyName,
      tagline: settings.tagline,
      address: settings.address,
      phone: settings.phone,
      dtsLicense: settings.dtsLicense,
      receiptNumber: payment.receiptNumber || payment.id,
      paymentDate: payment.paymentDate,
      customerName: payment.customerName,
      amountPKR: payment.amountPKR,
      amountSAR: payment.amountSAR,
      paymentMethod: payment.paymentMethod,
      bankReferenceNo: payment.bankReferenceNo,
      installmentStage: payment.installmentStage,
      notes: payment.notes,
      receivedBy: payment.receivedBy,
      bookingRef: booking ? booking.bookingNumber : 'Direct',
      packageTitle: booking ? booking.packageName : '',
      totalBookingPrice: booking && booking.financials ? booking.financials.totalSellingPrice : payment.amountPKR,
      totalPaidSoFar: booking && booking.financials ? booking.financials.totalPaid : payment.amountPKR,
      remainingBalance: booking && booking.financials ? booking.financials.outstandingBalance : 0
    }
  });
});

// POST /api/payments
router.post('/', (req, res) => {
  const settings = storage.loadCollection('settings')[0] || { exchangeRates: { SAR: 74.50, USD: 278.50 } };
  const sarRate = settings.exchangeRates.SAR || 74.50;

  const receiptNumber = storage.getNextId('receipt', 'HRM-RCT');
  const amountPKR = parseFloat(req.body.amountPKR || 0);
  const amountSAR = parseFloat((amountPKR / sarRate).toFixed(2));

  const newPayment = {
    id: receiptNumber,
    receiptNumber,
    bookingId: req.body.bookingId,
    customerName: req.body.customerName,
    paymentDate: req.body.paymentDate || new Date().toISOString().split('T')[0],
    amountPKR,
    amountSAR,
    currency: req.body.currency || 'PKR',
    exchangeRate: 1,
    paymentMethod: req.body.paymentMethod || 'Bank Transfer',
    bankReferenceNo: req.body.bankReferenceNo || `REF-${Date.now().toString().slice(-6)}`,
    installmentStage: req.body.installmentStage || 'Payment Installment',
    notes: req.body.notes || '',
    receivedBy: req.body.receivedBy || 'Finance Desk',
    status: 'Verified & Cleared'
  };

  const created = storage.insert('payments', newPayment);

  // Update Booking balances
  if (req.body.bookingId) {
    const booking = storage.findById('bookings', req.body.bookingId);
    if (booking) {
      const currentPaid = parseFloat(booking.financials ? booking.financials.totalPaid : 0);
      const totalSelling = parseFloat(booking.financials ? booking.financials.totalSellingPrice : 0);
      const newPaid = currentPaid + amountPKR;
      const newOutstanding = Math.max(0, totalSelling - newPaid);

      let newStatus = 'Partially Paid';
      if (newOutstanding <= 0) {
        newStatus = 'Fully Paid';
      }

      const updatedFinancials = {
        ...(booking.financials || {}),
        totalPaid: newPaid,
        outstandingBalance: newOutstanding
      };

      storage.update('bookings', booking.id, {
        financials: updatedFinancials,
        paymentStatus: newStatus
      });
    }
  }

  return res.status(201).json({ success: true, message: 'Payment recorded and receipt generated', payment: created });
});

// DELETE /api/payments/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('payments', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Payment not found' });
  return res.json({ success: true, message: 'Payment receipt canceled' });
});

module.exports = router;
