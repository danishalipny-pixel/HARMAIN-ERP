const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const FinancialEngine = require('../utils/financialEngine');

// GET /api/reports/sales
router.get('/sales', (req, res) => {
  const bookings = storage.loadCollection('bookings');
  const packages = storage.loadCollection('packages');

  const packagePerformance = packages.map(pkg => {
    const pkgBookings = bookings.filter(b => b.packageId === pkg.id);
    const revenue = pkgBookings.reduce((sum, b) => sum + (parseFloat(b.financials ? b.financials.totalSellingPrice : 0) || 0), 0);
    const grossProfit = pkgBookings.reduce((sum, b) => sum + (parseFloat(b.financials ? b.financials.grossProfitPKR : 0) || 0), 0);
    const pilgrims = pkgBookings.reduce((sum, b) => sum + (parseInt(b.paxCount || 1, 10)), 0);

    return {
      packageId: pkg.id,
      title: pkg.title,
      type: pkg.type,
      category: pkg.category,
      bookingsCount: pkgBookings.length,
      pilgrimCount: pilgrims,
      totalRevenuePKR: revenue,
      totalGrossProfitPKR: grossProfit,
      marginPercent: revenue > 0 ? parseFloat(((grossProfit / revenue) * 100).toFixed(2)) : 0
    };
  });

  return res.json({ success: true, packagePerformance });
});

// GET /api/reports/receivables
router.get('/receivables', (req, res) => {
  const bookings = storage.loadCollection('bookings');
  const pending = bookings
    .filter(b => b.financials && b.financials.outstandingBalance > 0)
    .map(b => ({
      bookingId: b.id,
      bookingNumber: b.bookingNumber,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      travelDate: b.travelDate,
      totalAmount: b.financials.totalSellingPrice,
      paidAmount: b.financials.totalPaid,
      outstandingBalance: b.financials.outstandingBalance,
      status: b.paymentStatus
    }));

  const totalOutstanding = pending.reduce((sum, p) => sum + p.outstandingBalance, 0);
  return res.json({ success: true, totalOutstanding, count: pending.length, receivables: pending });
});

// GET /api/reports/payables
router.get('/payables', (req, res) => {
  const suppliers = storage.loadCollection('suppliers');
  const payables = suppliers
    .filter(s => s.balancePayablePKR > 0)
    .map(s => ({
      supplierId: s.id,
      name: s.name,
      category: s.category,
      contactPerson: s.contactPerson,
      phone: s.phone,
      totalOrders: s.totalOrdersPKR,
      totalPaid: s.totalPaidPKR,
      balancePayable: s.balancePayablePKR,
      terms: s.paymentTerms
    }));

  const totalPayables = payables.reduce((sum, p) => sum + p.balancePayable, 0);
  return res.json({ success: true, totalPayables, count: payables.length, payables });
});

module.exports = router;
