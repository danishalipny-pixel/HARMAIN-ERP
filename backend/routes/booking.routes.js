const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const FinancialEngine = require('../utils/financialEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('bookings'));

// GET /api/bookings
router.get('/', (req, res) => {
  const { search, paymentStatus, bookingStatus, packageType, branchId } = req.query;
  let items = storage.loadCollection('bookings');

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(b =>
      (b.bookingNumber && b.bookingNumber.toLowerCase().includes(q)) ||
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.customerPhone && b.customerPhone.includes(q)) ||
      (b.pnrCode && b.pnrCode.toLowerCase().includes(q)) ||
      (b.invoiceNumber && b.invoiceNumber.toLowerCase().includes(q))
    );
  }
  if (paymentStatus) items = items.filter(b => b.paymentStatus === paymentStatus);
  if (bookingStatus) items = items.filter(b => b.bookingStatus === bookingStatus);
  if (packageType) items = items.filter(b => b.packageType === packageType);
  if (branchId) items = items.filter(b => b.branchId === branchId);

  return res.json({ success: true, count: items.length, bookings: items });
});

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  const booking = storage.findById('bookings', req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const payments = storage.find('payments', { bookingId: booking.id });
  const pnr = booking.pnrCode ? storage.findOne('pnrs', { pnrCode: booking.pnrCode }) : null;
  const pkg = booking.packageId ? storage.findById('packages', booking.packageId) : null;
  const passengers = (booking.passengers || []).map(pax => {
    const plg = pax.pilgrimId ? storage.findById('pilgrims', pax.pilgrimId) : null;
    return { ...pax, profile: plg };
  });

  return res.json({
    success: true,
    booking: {
      ...booking,
      payments,
      pnrRecord: pnr,
      packageRecord: pkg,
      passengerDetails: passengers
    }
  });
});

// POST /api/bookings
router.post('/', (req, res) => {
  const settings = storage.loadCollection('settings')[0] || { exchangeRates: { SAR: 74.50, USD: 278.50 } };
  const bookingNumber = storage.getNextId('booking', 'BK');
  const invoiceNumber = storage.getNextId('invoice', 'HRM-INV');
  const voucherNumber = storage.getNextId('voucher', 'HRM-VCH');

  // Find linked package
  const pkg = req.body.packageId ? storage.findById('packages', req.body.packageId) : null;

  // Process passengers list
  const passengers = Array.isArray(req.body.passengers) ? req.body.passengers : [
    { name: req.body.customerName, passport: req.body.passportNumber || '', type: 'Adult' }
  ];
  const paxCount = passengers.length;

  // Calculate actual accounting financials
  const financials = FinancialEngine.computeBookingFinancials(
    {
      ...req.body,
      paxCount,
      totalPaid: parseFloat(req.body.advancePaid || 0)
    },
    pkg,
    settings.exchangeRates
  );

  const newBooking = {
    bookingNumber,
    invoiceNumber,
    bookingDate: req.body.bookingDate || new Date().toISOString().split('T')[0],
    travelDate: req.body.travelDate,
    returnDate: req.body.returnDate,
    customerName: req.body.customerName,
    customerPhone: req.body.customerPhone,
    customerEmail: req.body.customerEmail || '',
    branchId: req.body.branchId || 'BR-01',
    branchName: req.body.branchName || 'Islamabad Head Office',
    agentId: req.body.agentId || null,
    agentName: req.body.agentName || 'Direct Client',
    packageId: req.body.packageId || (pkg ? pkg.id : null),
    packageName: req.body.packageName || (pkg ? pkg.title : 'Custom Holy Journey Package'),
    packageType: req.body.packageType || (pkg ? pkg.type : 'Umrah'),
    paxCount,
    passengers,
    roomType: req.body.roomType || 'Double Sharing',
    makkahHotel: req.body.makkahHotel || (pkg ? pkg.makkahHotel : 'Fairmont Makkah Clock Royal Tower'),
    madinahHotel: req.body.madinahHotel || (pkg ? pkg.madinahHotel : 'The Oberoi Madinah'),
    pnrCode: (req.body.pnrCode || 'PNR' + Math.random().toString(36).substr(2, 4)).toUpperCase(),
    flightDetails: req.body.flightDetails || 'Saudi Arabian Airlines Direct',
    assignedVehicle: req.body.assignedVehicle || 'GMC Yukon XL / Coaster',
    financials,
    paymentStatus: financials.outstandingBalance <= 0 ? 'Fully Paid' : (financials.totalPaid > 0 ? 'Partially Paid' : 'Pending Payment'),
    bookingStatus: 'Confirmed',
    voucherNumber,
    voucherIssued: true,
    auditNotes: `Booking initiated via HARMAIN ERP. Created by ${req.user ? req.user.name : 'Consultant'}.`
  };

  const createdBooking = storage.insert('bookings', newBooking);

  // If advance payment was recorded at time of booking, create payment receipt record
  if (financials.totalPaid > 0) {
    const receiptNumber = storage.getNextId('receipt', 'HRM-RCT');
    storage.insert('payments', {
      id: receiptNumber,
      receiptNumber,
      bookingId: createdBooking.id,
      customerName: createdBooking.customerName,
      paymentDate: newBooking.bookingDate,
      amountPKR: financials.totalPaid,
      amountSAR: parseFloat((financials.totalPaid / settings.exchangeRates.SAR).toFixed(2)),
      currency: 'PKR',
      exchangeRate: 1,
      paymentMethod: req.body.advancePaymentMethod || 'Bank Transfer',
      bankReferenceNo: req.body.advanceBankRef || `REF-${Date.now().toString().slice(-6)}`,
      installmentStage: 'Advance Booking Deposit',
      notes: `Initial advance deposit for Booking ${bookingNumber}`,
      receivedBy: req.user ? req.user.name : 'Counter Sales',
      status: 'Verified & Cleared'
    });
  }

  // Auto-register or link pilgrims
  passengers.forEach((pax, idx) => {
    if (!pax.pilgrimId && pax.name) {
      const pilgrimCode = storage.getNextId('pilgrim', 'PLG');
      const plg = storage.insert('pilgrims', {
        pilgrimCode,
        fullName: pax.name,
        gender: pax.gender || 'Male',
        passportNumber: (pax.passport || `PASS${Date.now().toString().slice(-6)}${idx}`).toUpperCase(),
        phone: req.body.customerPhone || '',
        currentBookingId: createdBooking.id,
        packageId: newBooking.packageId,
        packageName: newBooking.packageName,
        makkahHotel: newBooking.makkahHotel,
        madinahHotel: newBooking.madinahHotel,
        pnrCode: newBooking.pnrCode,
        visaStatus: 'Application Created',
        qrCodeToken: `HRM-PLG-${Date.now()}-${idx}`,
        status: 'Confirmed'
      });
      pax.pilgrimId = plg.id;
    }
  });

  // Update booked seats on package
  if (pkg) {
    storage.update('packages', pkg.id, {
      bookedSeats: (pkg.bookedSeats || 0) + paxCount
    });
  }

  return res.status(201).json({ success: true, message: 'Booking confirmed with financials and manifest', booking: createdBooking });
});

// PUT /api/bookings/:id
router.put('/:id', (req, res) => {
  const existing = storage.findById('bookings', req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Booking not found' });

  const updated = storage.update('bookings', req.params.id, req.body);
  return res.json({ success: true, message: 'Booking updated', booking: updated });
});

// DELETE /api/bookings/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('bookings', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Booking not found' });
  return res.json({ success: true, message: 'Booking canceled' });
});

module.exports = router;
