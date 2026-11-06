const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('packages'));

// GET /api/packages
router.get('/', (req, res) => {
  const { type, category, status } = req.query;
  let items = storage.loadCollection('packages');

  if (type) {
    items = items.filter(p => p.type && p.type.toLowerCase() === type.toLowerCase());
  }
  if (category) {
    items = items.filter(p => p.category && p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (status) {
    items = items.filter(p => p.status === status);
  }

  return res.json({ success: true, count: items.length, packages: items });
});

// GET /api/packages/:id
router.get('/:id', (req, res) => {
  const pkg = storage.findById('packages', req.params.id);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
  return res.json({ success: true, package: pkg });
});

// POST /api/packages
router.post('/', (req, res) => {
  const settings = storage.loadCollection('settings')[0] || { exchangeRates: { SAR: 74.50, USD: 278.50 } };
  const sarRate = settings.exchangeRates.SAR || 74.50;
  const usdRate = settings.exchangeRates.USD || 278.50;

  const sellingPricePKR = parseFloat(req.body.sellingPricePKR || 0);
  const costPricePKR = parseFloat(req.body.costPricePKR || 0);

  const newPackage = {
    code: req.body.code || (req.body.type === 'Hajj' ? `HAJ-${Date.now().toString().slice(-4)}` : `UMR-${Date.now().toString().slice(-4)}`),
    title: req.body.title,
    type: req.body.type || 'Umrah',
    year: req.body.year || 2026,
    category: req.body.category || '4-Star',
    shiftingType: req.body.shiftingType || 'Non-Shifting',
    durationDays: parseInt(req.body.durationDays || 14, 10),
    makkahHotel: req.body.makkahHotel || '',
    makkahNights: parseInt(req.body.makkahNights || 7, 10),
    madinahHotel: req.body.madinahHotel || '',
    madinahNights: parseInt(req.body.madinahNights || 7, 10),
    maktabNumber: req.body.maktabNumber || 'N/A',
    minaTentType: req.body.minaTentType || 'N/A',
    arafatFacility: req.body.arafatFacility || 'N/A',
    transportType: req.body.transportType || 'Luxury Bus',
    foodBoard: req.body.foodBoard || 'Breakfast Included',
    qurbaniIncluded: Boolean(req.body.qurbaniIncluded),
    ziyaratIncluded: req.body.ziyaratIncluded !== undefined ? Boolean(req.body.ziyaratIncluded) : true,
    zamzamProvided: req.body.zamzamProvided !== undefined ? Boolean(req.body.zamzamProvided) : true,
    totalSeats: parseInt(req.body.totalSeats || 50, 10),
    bookedSeats: 0,
    costPricePKR,
    sellingPricePKR,
    costPriceSAR: parseFloat((costPricePKR / sarRate).toFixed(2)),
    sellingPriceSAR: parseFloat((sellingPricePKR / sarRate).toFixed(2)),
    sellingPriceUSD: parseFloat((sellingPricePKR / usdRate).toFixed(2)),
    sharingTiers: req.body.sharingTiers || {
      double: Math.round(sellingPricePKR * 1.15),
      triple: sellingPricePKR,
      quad: Math.round(sellingPricePKR * 0.9)
    },
    status: 'Available',
    description: req.body.description || ''
  };

  const created = storage.insert('packages', newPackage);
  return res.status(201).json({ success: true, message: 'Package created successfully', package: created });
});

// PUT /api/packages/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('packages', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Package not found' });
  return res.json({ success: true, message: 'Package updated', package: updated });
});

// DELETE /api/packages/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('packages', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Package not found' });
  return res.json({ success: true, message: 'Package deleted' });
});

module.exports = router;
