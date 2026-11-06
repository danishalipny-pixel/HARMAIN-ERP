const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');

// GET /api/portal/lookup?query=... (Lookup by booking ref BK-XXXX or passport number)
router.get('/lookup', (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ success: false, message: 'Please enter Booking Number or Passport Number' });

  const q = query.trim().toUpperCase();

  // Search in Bookings
  let booking = storage.findOne('bookings', { bookingNumber: q });
  if (!booking) {
    const allBookings = storage.loadCollection('bookings');
    booking = allBookings.find(b =>
      b.bookingNumber.toUpperCase() === q ||
      (b.passengers && b.passengers.some(p => p.passport && p.passport.toUpperCase() === q)) ||
      (b.pnrCode && b.pnrCode.toUpperCase() === q)
    );
  }

  // Search in Pilgrims
  let pilgrim = storage.findOne('pilgrims', { passportNumber: q }) || storage.findOne('pilgrims', { pilgrimCode: q });

  if (!booking && pilgrim && pilgrim.currentBookingId) {
    booking = storage.findById('bookings', pilgrim.currentBookingId);
  }

  if (!booking && !pilgrim) {
    return res.status(404).json({ success: false, message: 'No pilgrimage record found for the provided reference or passport.' });
  }

  const payments = booking ? storage.find('payments', { bookingId: booking.id }) : [];
  const visa = pilgrim ? storage.findOne('visas', { passportNumber: pilgrim.passportNumber }) : null;
  const group = (booking && booking.assignedGroupId) ? storage.findById('groups', booking.assignedGroupId) : null;
  const settings = storage.loadCollection('settings')[0] || {};

  return res.json({
    success: true,
    portalData: {
      agency: {
        name: settings.agencyName,
        phone: settings.phone,
        whatsapp: settings.whatsapp
      },
      booking,
      pilgrim,
      payments,
      visa,
      group
    }
  });
});

module.exports = router;
