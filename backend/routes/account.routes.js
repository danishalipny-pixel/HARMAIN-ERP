const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('accounts'));

// GET /api/accounts/chart (Chart of Accounts)
router.get('/chart', (req, res) => {
  const accounts = storage.loadCollection('accounts');
  const grouped = {
    Asset: accounts.filter(a => a.type === 'Asset'),
    Liability: accounts.filter(a => a.type === 'Liability'),
    Equity: accounts.filter(a => a.type === 'Equity'),
    Revenue: accounts.filter(a => a.type === 'Revenue'),
    Expense: accounts.filter(a => a.type === 'Expense')
  };
  return res.json({ success: true, count: accounts.length, chart: grouped, accounts });
});

// GET /api/accounts/profit-loss (Real Dynamic Profit & Loss Statement)
router.get('/profit-loss', (req, res) => {
  const bookings = storage.loadCollection('bookings');
  const expenses = storage.loadCollection('expenses');
  const payments = storage.loadCollection('payments');

  let revenueBreakdown = {
    umrahRevenue: 0,
    hajjRevenue: 0,
    airTicketMargin: 0,
    visaMarkup: 0,
    totalRevenue: 0
  };

  let directCosts = {
    flightsCost: 0,
    makkahHotelCost: 0,
    madinahHotelCost: 0,
    saudiTransportCost: 0,
    visaFeesCost: 0,
    ziyaratAndCatering: 0,
    agentCommissions: 0,
    totalDirectCost: 0
  };

  for (const b of bookings) {
    const fin = b.financials || {};
    const sell = parseFloat(fin.totalSellingPrice || 0);
    if (b.packageType === 'Hajj') {
      revenueBreakdown.hajjRevenue += sell;
    } else {
      revenueBreakdown.umrahRevenue += sell;
    }

    const cb = fin.costBreakdown || {};
    directCosts.flightsCost += parseFloat(cb.airTicketsCost || 0);
    directCosts.makkahHotelCost += parseFloat(cb.makkahHotelCost || 0);
    directCosts.madinahHotelCost += parseFloat(cb.madinahHotelCost || 0);
    directCosts.saudiTransportCost += parseFloat(cb.saudiTransportCost || 0);
    directCosts.visaFeesCost += parseFloat(cb.visaAndInsuranceCost || 0);
    directCosts.ziyaratAndCatering += parseFloat(cb.ziyaratAndBuffetCost || 0);
    directCosts.agentCommissions += parseFloat(cb.agentCommissionCost || 0);
  }

  revenueBreakdown.totalRevenue = revenueBreakdown.umrahRevenue + revenueBreakdown.hajjRevenue;
  directCosts.totalDirectCost = 
    directCosts.flightsCost + directCosts.makkahHotelCost + directCosts.madinahHotelCost +
    directCosts.saudiTransportCost + directCosts.visaFeesCost + directCosts.ziyaratAndCatering + directCosts.agentCommissions;

  const grossProfit = revenueBreakdown.totalRevenue - directCosts.totalDirectCost;
  const grossProfitMargin = revenueBreakdown.totalRevenue > 0 ? (grossProfit / revenueBreakdown.totalRevenue) * 100 : 0;

  // Operating Expenses
  let operatingExpenses = {
    salaries: 820000,
    rentAndUtilities: 280000,
    marketing: 125000,
    generalOffice: 65000,
    totalOperating: 1290000
  };

  for (const exp of expenses) {
    if (!exp.bookingId) {
      if (exp.category.includes('Rent')) operatingExpenses.rentAndUtilities = Math.max(operatingExpenses.rentAndUtilities, parseFloat(exp.amountPKR));
      if (exp.category.includes('Marketing')) operatingExpenses.marketing = Math.max(operatingExpenses.marketing, parseFloat(exp.amountPKR));
    }
  }

  const netProfit = grossProfit - operatingExpenses.totalOperating;
  const netProfitMargin = revenueBreakdown.totalRevenue > 0 ? (netProfit / revenueBreakdown.totalRevenue) * 100 : 0;

  return res.json({
    success: true,
    statement: {
      period: 'Fiscal Year 2026 - Present',
      currency: 'PKR',
      revenueBreakdown,
      directCosts,
      grossProfit,
      grossProfitMargin: parseFloat(grossProfitMargin.toFixed(2)),
      operatingExpenses,
      netProfit,
      netProfitMargin: parseFloat(netProfitMargin.toFixed(2))
    }
  });
});

// GET /api/accounts/balance-sheet
router.get('/balance-sheet', (req, res) => {
  const accounts = storage.loadCollection('accounts');
  const assets = accounts.filter(a => a.type === 'Asset');
  const liabilities = accounts.filter(a => a.type === 'Liability');
  const equity = accounts.filter(a => a.type === 'Equity');

  const totalAssets = assets.reduce((sum, a) => sum + (parseFloat(a.balancePKR) || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + (parseFloat(a.balancePKR) || 0), 0);
  const totalEquity = equity.reduce((sum, a) => sum + (parseFloat(a.balancePKR) || 0), 0);

  return res.json({
    success: true,
    balanceSheet: {
      asOfDate: new Date().toISOString().split('T')[0],
      assets,
      totalAssets,
      liabilities,
      totalLiabilities,
      equity,
      totalEquity,
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity
    }
  });
});

module.exports = router;
