const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('hotels'));

// GET /api/hotels
router.get('/', (req, res) => {
  const { city, starRating } = req.query;
  let items = storage.loadCollection('hotels');

  if (city) {
    items = items.filter(h => h.city && h.city.toLowerCase() === city.toLowerCase());
  }
  if (starRating) {
    items = items.filter(h => h.starRating === parseInt(starRating, 10));
  }

  return res.json({ success: true, count: items.length, hotels: items });
});

// GET /api/hotels/:id
router.get('/:id', (req, res) => {
  const hotel = storage.findById('hotels', req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
  const rooms = storage.find('rooms', { hotelId: hotel.id });
  return res.json({ success: true, hotel: { ...hotel, rooms } });
});

// POST /api/hotels
router.post('/', (req, res) => {
  const newHotel = {
    name: req.body.name,
    city: req.body.city || 'Makkah',
    starRating: parseInt(req.body.starRating || 5, 10),
    courtyardDistanceMeters: parseInt(req.body.courtyardDistanceMeters || 0, 10),
    locationDescription: req.body.locationDescription || '',
    contactPerson: req.body.contactPerson || '',
    phone: req.body.phone || '',
    email: req.body.email || '',
    contractType: req.body.contractType || 'Master Allotment',
    totalContractedRooms: parseInt(req.body.totalContractedRooms || 20, 10),
    allocatedRooms: 0,
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : ['WiFi', 'Courtyard Access', 'Elevators'],
    rates: req.body.rates || {
      standardSAR: 800,
      haramViewSAR: 1200,
      ramadanSAR: 2500
    },
    status: 'Active'
  };

  const created = storage.insert('hotels', newHotel);
  return res.status(201).json({ success: true, message: 'Hotel added', hotel: created });
});

// PUT /api/hotels/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('hotels', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Hotel not found' });
  return res.json({ success: true, message: 'Hotel updated', hotel: updated });
});

// DELETE /api/hotels/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('hotels', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Hotel not found' });
  return res.json({ success: true, message: 'Hotel removed' });
});

module.exports = router;
