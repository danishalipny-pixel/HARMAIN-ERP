const express = require('express');
const router = express.Router();
const FinancialEngine = require('../utils/financialEngine');
const storage = require('../db/storageEngine');

// GET /api/dashboard
router.get('/', (req, res) => {
  try {
    const data = FinancialEngine.getAgencyDashboardMetrics();
    const recentBookings = storage.loadCollection('bookings').slice(0, 5);
    const notifications = storage.loadCollection('notifications').slice(0, 5);
    const flights = storage.loadCollection('flights').slice(0, 4);
    const groups = storage.loadCollection('groups').slice(0, 3);
    const hotels = storage.loadCollection('hotels');

    // Room stats
    let totalContractedRooms = 0;
    let totalAllocatedRooms = 0;
    for (const h of hotels) {
      totalContractedRooms += h.totalContractedRooms || 0;
      totalAllocatedRooms += h.allocatedRooms || 0;
    }

    const roomOccupancyRate = totalContractedRooms > 0 
      ? Math.round((totalAllocatedRooms / totalContractedRooms) * 100)
      : 0;

    return res.json({
      success: true,
      ...data,
      roomStats: {
        totalContractedRooms,
        totalAllocatedRooms,
        roomOccupancyRate
      },
      recentBookings,
      notifications,
      upcomingFlights: flights,
      activeGroups: groups
    });
  } catch (err) {
    console.error('Dashboard calculation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to aggregate dashboard metrics' });
  }
});

// GET /api/dashboard/rates
router.get('/rates', (req, res) => {
  const settings = storage.loadCollection('settings')[0] || {};
  return res.json({
    success: true,
    baseCurrency: settings.baseCurrency || 'PKR',
    exchangeRates: settings.exchangeRates || { SAR: 74.50, USD: 278.50, EUR: 302.00 }
  });
});

module.exports = router;
