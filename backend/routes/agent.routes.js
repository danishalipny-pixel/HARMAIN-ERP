const express = require('express');
const router = express.Router();
const storage = require('../db/storageEngine');
const auditLogger = require('../middleware/audit');

router.use(auditLogger('agents'));

// GET /api/agents
router.get('/', (req, res) => {
  const { search, status } = req.query;
  let items = storage.loadCollection('agents');

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(a =>
      (a.agencyName && a.agencyName.toLowerCase().includes(q)) ||
      (a.contactPerson && a.contactPerson.toLowerCase().includes(q)) ||
      (a.city && a.city.toLowerCase().includes(q))
    );
  }
  if (status) items = items.filter(a => a.status === status);

  const totalCommissionsPendingPKR = items.reduce((sum, a) => sum + (parseFloat(a.pendingCommissionPKR) || 0), 0);
  return res.json({ success: true, count: items.length, totalCommissionsPendingPKR, agents: items });
});

// POST /api/agents
router.post('/', (req, res) => {
  const newAgent = {
    agencyName: req.body.agencyName,
    contactPerson: req.body.contactPerson,
    phone: req.body.phone,
    email: req.body.email || '',
    city: req.body.city || 'Rawalpindi',
    commissionStructure: req.body.commissionStructure || 'Fixed 15,000 PKR per Pilgrim',
    totalPilgrimsReferred: 0,
    totalCommissionEarnedPKR: 0,
    totalCommissionPaidPKR: 0,
    pendingCommissionPKR: 0,
    status: 'Active'
  };

  const created = storage.insert('agents', newAgent);
  return res.status(201).json({ success: true, message: 'Sub-agent registered', agent: created });
});

// POST /api/agents/:id/payout
router.post('/:id/payout', (req, res) => {
  const agent = storage.findById('agents', req.params.id);
  if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

  const payoutAmount = parseFloat(req.body.amountPKR || 0);
  const currentPaid = parseFloat(agent.totalCommissionPaidPKR || 0);
  const newPaid = currentPaid + payoutAmount;
  const newPending = Math.max(0, (agent.totalCommissionEarnedPKR || 0) - newPaid);

  const updated = storage.update('agents', agent.id, {
    totalCommissionPaidPKR: newPaid,
    pendingCommissionPKR: newPending
  });

  // Record expense
  storage.insert('expenses', {
    expenseNumber: `EXP-${Date.now().toString().slice(-4)}`,
    category: 'Agent Commission Payout',
    supplierName: agent.agencyName,
    amountPKR: payoutAmount,
    currency: 'PKR',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: req.body.paymentMethod || 'Online Bank Transfer',
    invoiceRef: `COMM-PAY-${agent.id}`,
    description: `Commission disbursement to affiliate agent ${agent.agencyName}`,
    status: 'Paid'
  });

  return res.json({ success: true, message: `Disbursed ${payoutAmount} PKR commission to ${agent.agencyName}`, agent: updated });
});

// PUT /api/agents/:id
router.put('/:id', (req, res) => {
  const updated = storage.update('agents', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Agent not found' });
  return res.json({ success: true, message: 'Agent details updated', agent: updated });
});

// DELETE /api/agents/:id
router.delete('/:id', (req, res) => {
  const success = storage.delete('agents', req.params.id);
  if (!success) return res.status(404).json({ success: false, message: 'Agent not found' });
  return res.json({ success: true, message: 'Agent removed' });
});

module.exports = router;
