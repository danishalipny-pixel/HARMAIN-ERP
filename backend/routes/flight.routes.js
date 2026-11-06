const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('flights'));

// GET /api/flights
router.get('/', (req, res) => {
  const { airlineCode, status } = req.query;
  let items = storage.loadCollection('flights');

  if (airlineCode) {
    items = items.filter(f => f.airlineCode === airlineCode);
  }
  if (status) {
    items = items.filter(f => f.status === status);
  }

  return res.json({ success: true, count: items.length, flights: items });
});

// POST /api/flights
router.post('/', (req, res) => {
  const cost = parseFloat(req.body.costPricePerSeatPKR || 0);
  const sell = parseFloat(req.body.sellingPricePerSeatPKR || 0);
  const total = parseInt(req.body.totalBlockSeats || 50, 10);
  const confirmed = parseInt(req.body.confirmedSeats || 0, 10);

  const newFlight = {
    airlineCode: req.body.airlineCode || 'SV',
    airlineName: req.body.airlineName || 'Saudi Arabian Airlines',
    flightNumber: req.body.flightNumber,
    aircraft: req.body.aircraft || 'Boeing 777-300ER',
    originAirport: req.body.originAirport,
    destinationAirport: req.body.destinationAirport,
    departureDateTime: req.body.departureDateTime,
    arrivalDateTime: req.body.arrivalDateTime,
    transit: req.body.transit || 'Direct',
    baggageAllowance: req.body.baggageAllowance || '2 x 23 KG + 7 KG Hand + 5L Zamzam',
    totalBlockSeats: total,
    confirmedSeats: confirmed,
    availableSeats: Math.max(0, total - confirmed),
    costPricePerSeatPKR: cost,
    sellingPricePerSeatPKR: sell,
    status: req.body.status || 'Scheduled'
  };

  const created = storage.insert('flights', newFlight);
  return res.status(201).json({ success: true, message: 'Flight schedule created', flight: created });
});

// PUT /api/flights/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('flights', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Flight not found' });
  return res.json({ success: true, message: 'Flight schedule updated', flight: updated });
});

// DELETE /api/flights/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('flights', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Flight not found' });
  return res.json({ success: true, message: 'Flight schedule deleted' });
});

module.exports = router;
