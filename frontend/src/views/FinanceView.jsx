import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import PrintableDocumentModal from '../components/common/PrintableDocumentModal';
import { 
  Calculator, Receipt, CreditCard, Building2, Award, 
  Plus, Printer, TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, CheckCircle2, ShieldCheck 
} from 'lucide-react';

export default function FinanceView({ defaultSubTab = 'profit_loss' }) {
  const { formatMoney, currency, exchangeRates } = useCurrency();
  const [activeTab, setActiveTab] = useState(defaultSubTab);

  const [pnlData, setPnlData] = useState(null);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSupplierPayModal, setShowSupplierPayModal] = useState(false);
  const [showAgentPayoutModal, setShowAgentPayoutModal] = useState(false);
  const [showReceiptDocModal, setShowReceiptDocModal] = useState(false);
  const [receiptDocData, setReceiptDocData] = useState(null);

  // Selected for modals
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    category: 'Hotel Accommodation Booking',
    supplierName: '',
    amountPKR: 150000,
    currency: 'PKR',
    paymentMethod: 'Bank Transfer',
    description: '',
    bookingId: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    bookingId: '',
    customerName: '',
    amountPKR: 500000,
    paymentMethod: 'Bank Transfer (Meezan Bank)',
    bankReferenceNo: '',
    installmentStage: 'Second Installment',
    notes: ''
  });

  const [payoutForm, setPayoutForm] = useState({
    amountPKR: 50000,
    paymentMethod: 'Online Bank Transfer',
    notes: 'Ledger settlement'
  });

  const loadAllFinanceData = async () => {
    setLoading(true);
    try {
      const [pnlRes, coaRes, expRes, payRes, supRes, agtRes, bkgRes] = await Promise.all([
        api.getProfitAndLoss(),
        api.getChartOfAccounts(),
        api.getExpenses(),
        api.getPayments(),
        api.getSuppliers(),
        api.getAgents(),
        api.getBookings()
      ]);
      if (pnlRes.success) setPnlData(pnlRes.statement);
      if (coaRes.success) setChartOfAccounts(coaRes.accounts || []);
      if (expRes.success) setExpenses(expRes.expenses);
      if (payRes.success) setPayments(payRes.payments);
      if (supRes.success) setSuppliers(supRes.suppliers);
      if (agtRes.success) setAgents(agtRes.agents);
      if (bkgRes.success) setBookings(bkgRes.bookings);
    } catch (err) {
      console.error('Failed to load financial records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllFinanceData();
  }, []);

  useEffect(() => {
    setActiveTab(defaultSubTab);
  }, [defaultSubTab]);

  // Handle Expense Create
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createExpense(expenseForm);
      setShowExpenseModal(false);
      loadAllFinanceData();
      alert('Expense recorded in ledger!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  // Handle Payment Create
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPayment(paymentForm);
      setShowPaymentModal(false);
      loadAllFinanceData();
      alert('Customer payment recorded and receipt created!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  // Handle Supplier Pay
  const handleSupplierPaySubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      await api.paySupplier(selectedSupplier.id, payoutForm);
      setShowSupplierPayModal(false);
      loadAllFinanceData();
      alert('Supplier payout recorded successfully!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  // Handle Agent Payout
  const handleAgentPayoutSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;
    try {
      await api.payoutAgent(selectedAgent.id, payoutForm);
      setShowAgentPayoutModal(false);
      loadAllFinanceData();
      alert('Agent commission disbursed!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  // Handle Print Receipt
  const handlePrintReceipt = async (payment, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.getReceipt(payment.id);
      if (res.success) {
        setReceiptDocData(res.receiptData);
        setShowReceiptDocModal(true);
      }
    } catch (err) {
      alert('Failed to load receipt: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Pills */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Accounts, Financial Ledger & Treasury
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real dynamic accounting engine: Profit & Loss statements, customer payment receipts, supplier payables and agent commissions.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center bg-gray-200 p-1 rounded-xl gap-1">
          {[
            { id: 'profit_loss', label: 'P&L Statement', icon: Calculator },
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'payments', label: 'Customer Receipts', icon: CreditCard },
            { id: 'suppliers', label: 'Supplier Payables', icon: Building2 },
            { id: 'agents', label: 'Agent Commissions', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. PROFIT & LOSS STATEMENT TAB */}
      {activeTab === 'profit_loss' && pnlData && (
        <div className="space-y-6">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-[#0A4D3C] to-[#063A2D] text-white rounded-2xl shadow-xs">
              <span className="text-xs font-semibold uppercase text-emerald-200">Total Booking Revenue</span>
              <div className="text-2xl font-extrabold mt-1 text-[#D4AF37]">
                {formatMoney(pnlData.revenueBreakdown?.totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-200 mt-1">Umrah + Hajj Gross Bookings</div>
            </div>

            <div className="p-5 bg-gradient-to-br from-[#D4AF37] to-[#B38F24] text-[#063A2D] rounded-2xl shadow-xs">
              <span className="text-xs font-bold uppercase text-[#063A2D]/80">Gross Profit (Direct Margin)</span>
              <div className="text-2xl font-black mt-1">
                {formatMoney(pnlData.grossProfit)}
              </div>
              <div className="text-[11px] font-bold mt-1">Margin: {pnlData.grossProfitMargin}% of Sales</div>
            </div>

            <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold uppercase text-gray-500">Net Audited Profit</span>
              <div className="text-2xl font-extrabold text-[#0A4D3C] mt-1">
                {formatMoney(pnlData.netProfit)}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">After Salaries, Rent & Operational Overhead</div>
            </div>
          </div>

          {/* Detailed Statement Table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                  INCOME & EXPENDITURE STATEMENT (P&L)
                </h3>
                <p className="text-xs text-gray-500">{pnlData.period} • Audited Base Currency: PKR</p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A4D3C] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Statement</span>
              </button>
            </div>

            {/* Operating Revenue Section */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#0A4D3C] uppercase tracking-wider text-xs border-b border-emerald-100 pb-1">
                1. Operating Revenue
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Umrah Package Sales Revenue</span>
                <span className="font-semibold">{formatMoney(pnlData.revenueBreakdown?.umrahRevenue)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Hajj Quota Sales Revenue</span>
                <span className="font-semibold">{formatMoney(pnlData.revenueBreakdown?.hajjRevenue)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-gray-900 bg-gray-50 px-2 rounded">
                <span>Total Gross Sales Revenue</span>
                <span className="text-emerald-800">{formatMoney(pnlData.revenueBreakdown?.totalRevenue)}</span>
              </div>
            </div>

            {/* Direct Costs of Goods Sold (COGS) */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-rose-800 uppercase tracking-wider text-xs border-b border-rose-100 pb-1">
                2. Direct Costs of Services (Airlines, Hotels, Ground Transport, Visas)
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Airline Tickets & GDS Consolidator Fees</span>
                <span className="font-mono">{formatMoney(pnlData.directCosts?.flightsCost)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Makkah Hotel Room Accommodations</span>
                <span className="font-mono">{formatMoney(pnlData.directCosts?.makkahHotelCost)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Madinah Hotel Room Accommodations</span>
                <span className="font-mono">{formatMoney(pnlData.directCosts?.madinahHotelCost)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Saudi Ground Transport & VIP Chauffeurs</span>
                <span className="font-mono">{formatMoney(pnlData.directCosts?.saudiTransportCost)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Saudi MOFA Visas & Tawuniya Health Insurance</span>
                <span className="font-mono">{formatMoney(pnlData.directCosts?.visaFeesCost)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Ziyarat Tours, Catering & Zamzam Provisioning</span>
                <span className="font-mono">{formatMoney(pnlData.directCosts?.ziyaratAndCatering)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-700">
                <span>Sub-Agent Referral Commissions Disbursed</span>
                <span className="font-mono">{formatMoney(pnlData.directCosts?.agentCommissions)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-rose-800 bg-rose-50 px-2 rounded">
                <span>Total Direct Costs</span>
                <span>{formatMoney(pnlData.directCosts?.totalDirectCost)}</span>
              </div>
            </div>

            {/* Gross Profit Summary */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-sm font-extrabold text-[#0A4D3C]">
              <span>GROSS PROFIT MARGIN</span>
              <span>{formatMoney(pnlData.grossProfit)} ({pnlData.grossProfitMargin}%)</span>
            </div>

            {/* Operating Expenses */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-gray-700 uppercase tracking-wider text-xs border-b border-gray-200 pb-1">
                3. General & Administrative Operating Expenses
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Employee Salaries & Benefits</span>
                <span className="font-mono">{formatMoney(pnlData.operatingExpenses?.salaries)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Head Office & Branch Rents / Utilities</span>
                <span className="font-mono">{formatMoney(pnlData.operatingExpenses?.rentAndUtilities)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Marketing & Digital Campaigns</span>
                <span className="font-mono">{formatMoney(pnlData.operatingExpenses?.marketing)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-gray-800 bg-gray-50 px-2 rounded">
                <span>Total Operating Overhead</span>
                <span>{formatMoney(pnlData.operatingExpenses?.totalOperating)}</span>
              </div>
            </div>

            {/* Net Profit Final */}
            <div className="p-4 bg-gradient-to-r from-[#0A4D3C] to-[#063A2D] text-white rounded-xl flex justify-between items-center text-base font-black">
              <span className="text-[#D4AF37]">NET COMPREHENSIVE PROFIT</span>
              <span className="text-xl text-white">{formatMoney(pnlData.netProfit)} ({pnlData.netProfitMargin}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Record Expense</span>
            </button>
          </div>

          <DataTable
            columns={[
              { header: 'Ref #', accessor: 'expenseNumber', render: (r) => <span className="font-mono font-bold text-[#0A4D3C]">{r.expenseNumber}</span> },
              { header: 'Category', accessor: 'category', render: (r) => <span className="font-bold text-gray-900">{r.category}</span> },
              { header: 'Supplier / Payee', accessor: 'supplierName', render: (r) => <span className="text-gray-800">{r.supplierName}</span> },
              { header: 'Description', accessor: 'description', render: (r) => <span className="text-gray-600 truncate max-w-[200px] block">{r.description}</span> },
              { header: 'Amount (PKR)', accessor: 'amountPKR', render: (r) => <span className="font-bold text-gray-900">{formatMoney(r.amountPKR)}</span> },
              { header: 'Payment Date', accessor: 'paymentDate' },
              { header: 'Status', accessor: 'status', render: (r) => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{r.status}</span> }
            ]}
            data={expenses}
            searchPlaceholder="Search expenses by supplier or category..."
            exportFileName="harmain_expenses_ledger.csv"
          />
        </div>
      )}

      {/* 3. CUSTOMER PAYMENTS & RECEIPTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Record Payment Receipt</span>
            </button>
          </div>

          <DataTable
            columns={[
              { header: 'Receipt Ref', accessor: 'receiptNumber', render: (r) => <span className="font-mono font-bold text-[#0A4D3C]">{r.receiptNumber}</span> },
              { header: 'Pilgrim / Customer', accessor: 'customerName', render: (r) => <span className="font-bold text-gray-900">{r.customerName}</span> },
              { header: 'Stage', accessor: 'installmentStage', render: (r) => <span className="font-semibold text-gray-700">{r.installmentStage}</span> },
              { header: 'Payment Instrument', accessor: 'paymentMethod', render: (r) => <span className="text-gray-600 font-mono text-[11px]">{r.paymentMethod}</span> },
              { header: 'Amount Collected', accessor: 'amountPKR', render: (r) => <span className="font-extrabold text-emerald-800">{formatMoney(r.amountPKR)}</span> },
              { header: 'Date', accessor: 'paymentDate' },
              {
                header: 'Receipt Action',
                accessor: 'id',
                className: 'text-right',
                render: (r) => (
                  <button
                    onClick={(e) => handlePrintReceipt(r, e)}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-300 text-[#0A4D3C] hover:bg-[#0A4D3C] hover:text-white rounded-lg text-xs font-bold transition-all ml-auto"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                )
              }
            ]}
            data={payments}
            searchPlaceholder="Search payment receipts by receipt # or pilgrim..."
            exportFileName="harmain_customer_receipts.csv"
          />
        </div>
      )}

      {/* 4. SUPPLIER PAYABLES & BALANCES TAB */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <DataTable
            columns={[
              { header: 'Supplier Name', accessor: 'name', render: (r) => <span className="font-bold text-gray-900">{r.name}</span> },
              { header: 'Category', accessor: 'category' },
              { header: 'Total Orders', accessor: 'totalOrdersPKR', render: (r) => <span className="font-bold">{formatMoney(r.totalOrdersPKR)}</span> },
              { header: 'Total Disbursed', accessor: 'totalPaidPKR', render: (r) => <span className="text-emerald-700 font-bold">{formatMoney(r.totalPaidPKR)}</span> },
              {
                header: 'Outstanding Payable',
                accessor: 'balancePayablePKR',
                render: (r) => (
                  <span className={`font-black ${r.balancePayablePKR > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {formatMoney(r.balancePayablePKR)}
                  </span>
                )
              },
              { header: 'Payment Terms', accessor: 'paymentTerms' },
              {
                header: 'Disburse',
                accessor: 'id',
                className: 'text-right',
                render: (r) => (
                  <button
                    onClick={() => { setSelectedSupplier(r); setPayoutForm({ ...payoutForm, amountPKR: r.balancePayablePKR }); setShowSupplierPayModal(true); }}
                    disabled={r.balancePayablePKR <= 0}
                    className="px-3 py-1 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-lg shadow-2xs disabled:opacity-40 ml-auto"
                  >
                    Disburse Payment
                  </button>
                )
              }
            ]}
            data={suppliers}
            searchPlaceholder="Search suppliers by name or category..."
            exportFileName="harmain_supplier_balances.csv"
          />
        </div>
      )}

      {/* 5. AGENT COMMISSIONS TAB */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <DataTable
            columns={[
              { header: 'Sub-Agency Name', accessor: 'agencyName', render: (r) => <span className="font-bold text-gray-900">{r.agencyName}</span> },
              { header: 'Contact Person', accessor: 'contactPerson' },
              { header: 'City', accessor: 'city' },
              { header: 'Pilgrims Referred', accessor: 'totalPilgrimsReferred', render: (r) => <span className="font-bold">{r.totalPilgrimsReferred} Pax</span> },
              { header: 'Commission Earned', accessor: 'totalCommissionEarnedPKR', render: (r) => <span className="font-bold text-gray-900">{formatMoney(r.totalCommissionEarnedPKR)}</span> },
              { header: 'Disbursed', accessor: 'totalCommissionPaidPKR', render: (r) => <span className="text-emerald-700 font-semibold">{formatMoney(r.totalCommissionPaidPKR)}</span> },
              {
                header: 'Pending Payable',
                accessor: 'pendingCommissionPKR',
                render: (r) => (
                  <span className={`font-black ${r.pendingCommissionPKR > 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                    {formatMoney(r.pendingCommissionPKR)}
                  </span>
                )
              },
              {
                header: 'Payout',
                accessor: 'id',
                className: 'text-right',
                render: (r) => (
                  <button
                    onClick={() => { setSelectedAgent(r); setPayoutForm({ ...payoutForm, amountPKR: r.pendingCommissionPKR }); setShowAgentPayoutModal(true); }}
                    disabled={r.pendingCommissionPKR <= 0}
                    className="px-3 py-1 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-lg shadow-2xs disabled:opacity-40 ml-auto"
                  >
                    Pay Commission
                  </button>
                )
              }
            ]}
            data={agents}
            searchPlaceholder="Search sub-agents by agency or city..."
            exportFileName="harmain_agent_commissions.csv"
          />
        </div>
      )}

      {/* RECORD EXPENSE MODAL */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Record Expense Voucher"
        subtitle="Post direct booking expense or operational overhead to chart of accounts."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Expense Category</label>
            <select
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
            >
              <option value="Airline Seat Purchase">Airline Seat Purchase</option>
              <option value="Hotel Accommodation Booking">Hotel Accommodation Booking</option>
              <option value="Saudi Ground Transport">Saudi Ground Transport</option>
              <option value="Visa & Health Insurance Fees">Visa & Health Insurance Fees</option>
              <option value="Office Rent & Facilities">Office Rent & Facilities</option>
              <option value="Staff Salaries & Benefits">Staff Salaries & Benefits</option>
              <option value="Marketing & Digital Ads">Marketing & Digital Ads</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Supplier / Vendor Name</label>
              <input
                type="text"
                required
                value={expenseForm.supplierName}
                onChange={(e) => setExpenseForm({ ...expenseForm, supplierName: e.target.value })}
                placeholder="e.g. Swissôtel Makkah"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Amount (PKR) *</label>
              <input
                type="number"
                required
                value={expenseForm.amountPKR}
                onChange={(e) => setExpenseForm({ ...expenseForm, amountPKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Description / Notes</label>
            <input
              type="text"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              placeholder="e.g. 5 Nights block payment"
              className="w-full p-2.5 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowExpenseModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* RECORD CUSTOMER PAYMENT MODAL */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Customer Payment Receipt"
        subtitle="Collect installment and auto-update booking outstanding balance."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Select Booking File *</label>
            <select
              required
              value={paymentForm.bookingId}
              onChange={(e) => {
                const b = bookings.find(item => item.id === e.target.value);
                setPaymentForm({
                  ...paymentForm,
                  bookingId: e.target.value,
                  customerName: b ? b.customerName : ''
                });
              }}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
            >
              <option value="">-- Choose Booking --</option>
              {bookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.bookingNumber} - {b.customerName} (Due: Rs. {Number(b.financials?.outstandingBalance || 0).toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Amount Received (PKR) *</label>
              <input
                type="number"
                required
                value={paymentForm.amountPKR}
                onChange={(e) => setPaymentForm({ ...paymentForm, amountPKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Installment Stage</label>
              <select
                value={paymentForm.installmentStage}
                onChange={(e) => setPaymentForm({ ...paymentForm, installmentStage: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
              >
                <option value="Advance Booking Deposit">Advance Booking Deposit</option>
                <option value="Second Installment">Second Installment</option>
                <option value="Final Full Settlement">Final Full Settlement</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
              <input
                type="text"
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Bank Reference / Cheque #</label>
              <input
                type="text"
                value={paymentForm.bankReferenceNo}
                onChange={(e) => setPaymentForm({ ...paymentForm, bankReferenceNo: e.target.value })}
                placeholder="TRF-XXXXXXX"
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* DISBURSE SUPPLIER MODAL */}
      <Modal
        isOpen={showSupplierPayModal}
        onClose={() => setShowSupplierPayModal(false)}
        title={`Disburse Payment: ${selectedSupplier?.name}`}
        subtitle={`Current Payable Balance: Rs. ${Number(selectedSupplier?.balancePayablePKR || 0).toLocaleString()}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSupplierPaySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Payment Amount (PKR) *</label>
            <input
              type="number"
              required
              value={payoutForm.amountPKR}
              onChange={(e) => setPayoutForm({ ...payoutForm, amountPKR: parseFloat(e.target.value || 0) })}
              className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
            <input
              type="text"
              value={payoutForm.paymentMethod}
              onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-xl"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowSupplierPayModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm Disbursement
            </button>
          </div>
        </form>
      </Modal>

      {/* DISBURSE AGENT COMMISSION MODAL */}
      <Modal
        isOpen={showAgentPayoutModal}
        onClose={() => setShowAgentPayoutModal(false)}
        title={`Pay Agent Commission: ${selectedAgent?.agencyName}`}
        subtitle={`Pending Commission: Rs. ${Number(selectedAgent?.pendingCommissionPKR || 0).toLocaleString()}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAgentPayoutSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Payout Amount (PKR) *</label>
            <input
              type="number"
              required
              value={payoutForm.amountPKR}
              onChange={(e) => setPayoutForm({ ...payoutForm, amountPKR: parseFloat(e.target.value || 0) })}
              className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAgentPayoutModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Disburse Commission
            </button>
          </div>
        </form>
      </Modal>

      {/* OFFICIAL PAYMENT RECEIPT PREVIEW MODAL */}
      <PrintableDocumentModal
        isOpen={showReceiptDocModal}
        onClose={() => setShowReceiptDocModal(false)}
        docType="receipt"
        data={receiptDocData}
      />
    </div>
  );
}
