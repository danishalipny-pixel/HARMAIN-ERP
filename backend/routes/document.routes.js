const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');

// GET /api/documents/voucher/:bookingId
router.get('/voucher/:bookingId', (req, res) => {
  const booking = storage.findById('bookings', req.params.bookingId);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const settings = storage.loadCollection('settings')[0] || {};
  const payments = storage.find('payments', { bookingId: booking.id });

  const voucherData = {
    agency: {
      name: settings.agencyName,
      tagline: settings.tagline,
      dtsLicense: settings.dtsLicense,
      iataCode: settings.iataCode,
      munazzamId: settings.munazzamId,
      email: settings.email,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      address: settings.address
    },
    voucherNumber: booking.voucherNumber || `HRM-VCH-${booking.id}`,
    invoiceNumber: booking.invoiceNumber,
    issueDate: new Date().toISOString().split('T')[0],
    leadPilgrim: {
      name: booking.customerName,
      phone: booking.customerPhone,
      email: booking.customerEmail
    },
    passengers: booking.passengers || [],
    package: {
      name: booking.packageName,
      type: booking.packageType,
      travelDate: booking.travelDate,
      returnDate: booking.returnDate,
      pnr: booking.pnrCode,
      flights: booking.flightDetails
    },
    accommodations: {
      makkah: {
        hotel: booking.makkahHotel,
        roomType: booking.roomType
      },
      madinah: {
        hotel: booking.madinahHotel,
        roomType: booking.roomType
      }
    },
    transport: {
      assignedVehicle: booking.assignedVehicle,
      pickupNote: 'Representative will be at airport arrival gate holding HARMAIN ERP signboard'
    },
    financialSummary: {
      totalSellingPrice: booking.financials ? booking.financials.totalSellingPrice : 0,
      totalPaid: booking.financials ? booking.financials.totalPaid : 0,
      outstandingBalance: booking.financials ? booking.financials.outstandingBalance : 0,
      paymentStatus: booking.paymentStatus
    },
    paymentsList: payments
  };

  return res.json({ success: true, voucher: voucherData });
});

// GET /api/documents/pilgrim-card/:pilgrimId
router.get('/pilgrim-card/:pilgrimId', (req, res) => {
  const pilgrim = storage.findById('pilgrims', req.params.pilgrimId);
  if (!pilgrim) return res.status(404).json({ success: false, message: 'Pilgrim not found' });
  const settings = storage.loadCollection('settings')[0] || {};

  return res.json({
    success: true,
    card: {
      agencyName: settings.agencyName,
      dtsLicense: settings.dtsLicense,
      emergencyPhonePKR: settings.phone,
      emergencyPhoneKSA: settings.whatsapp,
      pilgrim: {
        id: pilgrim.id,
        code: pilgrim.pilgrimCode,
        fullName: pilgrim.fullName,
        arabicName: pilgrim.arabicName,
        photoUrl: pilgrim.photoUrl,
        gender: pilgrim.gender,
        bloodGroup: pilgrim.bloodGroup,
        passportNumber: pilgrim.passportNumber,
        visaNumber: pilgrim.visaNumber,
        makkahHotel: pilgrim.makkahHotel,
        makkahRoomNo: pilgrim.makkahRoomNo,
        madinahHotel: pilgrim.madinahHotel,
        madinahRoomNo: pilgrim.madinahRoomNo,
        groupName: pilgrim.assignedGroupName,
        emergencyContact: `${pilgrim.emergencyContactName} (${pilgrim.emergencyContactPhone})`,
        qrToken: pilgrim.qrCodeToken
      }
    }
  });
});

// GET /api/documents/itinerary/:bookingId
router.get('/itinerary/:bookingId', (req, res) => {
  const booking = storage.findById('bookings', req.params.bookingId);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  const settings = storage.loadCollection('settings')[0] || {};

  const itinerary = {
    agencyName: settings.agencyName,
    bookingRef: booking.bookingNumber,
    customerName: booking.customerName,
    packageName: booking.packageName,
    travelDates: `${booking.travelDate} to ${booking.returnDate}`,
    schedule: [
      { day: 1, title: 'Departure & Sacred Arrival in Jeddah', desc: 'Depart via airline. VIP Meet & Assist at King Abdulaziz Airport Terminal 1. Transfer via private luxury GMC to Makkah hotel. Check-in and perform Umrah.' },
      { day: 2, title: 'Ibadah & Rest in Makkah', desc: 'Free day for prayers and Tawaf in Masjid al-Haram. Spiritual lecture by caravan leader.' },
      { day: 3, title: 'Grand Makkah Holy Ziyarat', desc: '06:30 AM Post-Fajr tour of Cave of Hira (Jabal al-Nour), Jabal Thawr, Mina, Muzdalifah, and Plain of Arafat.' },
      { day: 4, title: 'Ibadah & Friday Jummah Prayer', desc: 'Perform Jummah prayer in Mataf courtyard. Exclusive evening Dua session.' },
      { day: 5, title: 'Second Umrah from Masjid Aisha (Taneem)', desc: 'Optional visit to Miqat Masjid Aisha for second Umrah.' },
      { day: 9, title: 'Farewell Tawaf (Tawaf al-Wada) & Transfer to Madinah', desc: 'Perform Tawaf al-Wada. Board Haramain High Speed Bullet Train First Class VIP to Madinah. Check-in at hotel.' },
      { day: 10, title: 'Salam at Rawdah Rasool (PBUH) & Riyad-ul-Jannah', desc: 'Guided entry for Salam at the Prophet’s Mosque and prayers in the Garden of Paradise.' },
      { day: 11, title: 'Historical Madinah Ziyarat', desc: 'Visit Masjid Quba (first mosque), Mount Uhud & Martyrs Cemetery, and the historical Saba Masajid.' },
      { day: 14, title: 'Zamzam Packaging & Return Flight', desc: 'Hotel check-out, collect verified 5L Zamzam canisters, private transfer to Madinah / Jeddah airport for return flight.' }
    ]
  };

  return res.json({ success: true, itinerary });
});

module.exports = router;
