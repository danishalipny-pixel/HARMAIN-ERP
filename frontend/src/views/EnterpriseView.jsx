import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { 
  GitBranch, UserPlus, BarChart3, Bell, Settings, 
  ShieldAlert, Download, Upload, CheckCircle2, DollarSign, 
  Building, RefreshCw, Key, FileCheck, ArrowUpRight
} from 'lucide-react';

export default function EnterpriseView({ defaultSubTab = 'branches' }) {
  const { formatMoney, exchangeRates } = useCurrency();
  const [activeTab, setActiveTab] = useState(defaultSubTab);

  const [branches, setBranches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState(null);
  const [salesReport, setSalesReport] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    agencyName: 'HARMAIN ERP',
    tagline: 'ONE PLATFORM. EVERY JOURNEY.',
    dtsLicense: 'DTS-ISB-2024-8849',
    iataCode: 'PK-2749102',
    munazzamId: 'MNZ-77192',
    phone: '+92 51 8849200',
    whatsapp: '+966 50 123 4567',
    email: 'operations@harmainerp.com',
    address: 'Harmain Tower, Blue Area, Islamabad / Makkah KSA',
    exchangeRates: {
      SAR: 74.50,
      USD: 278.50
    }
  });

  const loadAllEnterpriseData = async () => {
    setLoading(true);
    try {
      const [brRes, stRes, noRes, auRes, seRes, saRes, reRes] = await Promise.all([
        api.getBranches(),
        api.getStaff(),
        api.getNotifications(),
        api.getAuditLogs(),
        api.getSettings(),
        api.getReportsSales(),
        api.getReportsReceivables()
      ]);
      if (brRes.success) setBranches(brRes.branches);
      if (stRes.success) setStaff(stRes.staff);
      if (noRes.success) setNotifications(noRes.notifications);
      if (auRes.success) setAuditLogs(auRes.logs);
      if (seRes.success && seRes.settings) {
        setSettings(seRes.settings);
        setSettingsForm(seRes.settings);
      }
      if (saRes.success) setSalesReport(saRes.packagePerformance || []);
      if (reRes.success) setReceivables(reRes.receivables || []);
    } catch (err) {
      console.error('Failed to load enterprise data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEnterpriseData();
  }, []);

  useEffect(() => {
    setActiveTab(defaultSubTab);
  }, [defaultSubTab]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(settingsForm);
      alert('Agency settings and exchange rates updated successfully!');
      loadAllEnterpriseData();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleBackupDownload = () => {
    window.open(api.downloadBackupUrl, '_blank');
  };

  const handleRestoreFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const res = await api.restoreBackup(json);
        if (res.success) {
          alert('Database restored successfully from backup!');
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid backup JSON file or restore failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Pills */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Enterprise Management & Systems
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure multi-branch locations, HR directory, business reports, notifications, DTS licenses, and database backups.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center bg-gray-200 p-1 rounded-xl gap-1">
          {[
            { id: 'branches', label: 'Branches', icon: GitBranch },
            { id: 'staff', label: 'Staff & Team', icon: UserPlus },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'notifications', label: 'Alerts', icon: Bell },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'audit', label: 'Audit & Backup', icon: ShieldAlert }
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

      {/* 1. BRANCHES TAB */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#0A4D3C] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {b.code}
                    </span>
                    {b.isHeadOffice && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        Head Office
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900">{b.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{b.address}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-700">
                    <div>Manager: <strong>{b.manager}</strong></div>
                    <div>Phone: <span className="font-mono">{b.phone}</span></div>
                    <div>Staff: <strong>{b.staffCount} Officers</strong></div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Total Bookings:</span>
                  <span className="font-bold text-[#0A4D3C]">{b.bookingCount || 0} Files</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. STAFF & HR TAB */}
      {activeTab === 'staff' && (
        <DataTable
          columns={[
            { header: 'Employee Name', accessor: 'name', render: (r) => <span className="font-bold text-gray-900">{r.name}</span> },
            { header: 'Designation', accessor: 'designation', render: (r) => <span className="font-medium text-gray-800">{r.designation}</span> },
            { header: 'Department', accessor: 'department' },
            { header: 'Assigned Branch', accessor: 'branch' },
            { header: 'Contact', accessor: 'phone', render: (r) => <span className="font-mono">{r.phone}</span> },
            { header: 'Monthly Salary', accessor: 'salaryPKR', render: (r) => <span className="font-bold text-gray-900">{formatMoney(r.salaryPKR)}</span> },
            { header: 'Status', accessor: 'status', render: (r) => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{r.status}</span> }
          ]}
          data={staff}
          searchPlaceholder="Search employees by name, designation or branch..."
          exportFileName="harmain_staff_roster.csv"
        />
      )}

      {/* 3. REPORTS & BUSINESS INTELLIGENCE TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              Package Profitability & Revenue Performance
            </h3>
            <DataTable
              columns={[
                { header: 'Package Name', accessor: 'title', render: (r) => <span className="font-bold text-gray-900">{r.title}</span> },
                { header: 'Type', accessor: 'type' },
                { header: 'Bookings', accessor: 'bookingsCount', render: (r) => <span className="font-bold">{r.bookingsCount}</span> },
                { header: 'Pilgrims', accessor: 'pilgrimCount', render: (r) => <span className="font-bold">{r.pilgrimCount} Pax</span> },
                { header: 'Total Revenue', accessor: 'totalRevenuePKR', render: (r) => <span className="font-extrabold text-gray-900">{formatMoney(r.totalRevenuePKR)}</span> },
                { header: 'Gross Profit', accessor: 'totalGrossProfitPKR', render: (r) => <span className="font-extrabold text-emerald-700">{formatMoney(r.totalGrossProfitPKR)}</span> },
                { header: 'Profit Margin', accessor: 'marginPercent', render: (r) => <span className="font-bold text-[#0A4D3C]">{r.marginPercent}%</span> }
              ]}
              data={salesReport}
              searchPlaceholder="Filter packages performance..."
              exportFileName="harmain_sales_report.csv"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              Outstanding Customer Receivables Ledger
            </h3>
            <DataTable
              columns={[
                { header: 'Booking Ref', accessor: 'bookingNumber', render: (r) => <span className="font-mono font-bold text-[#0A4D3C]">{r.bookingNumber}</span> },
                { header: 'Customer Name', accessor: 'customerName', render: (r) => <span className="font-bold text-gray-900">{r.customerName}</span> },
                { header: 'Phone', accessor: 'customerPhone', render: (r) => <span className="font-mono">{r.customerPhone}</span> },
                { header: 'Total Price', accessor: 'totalAmount', render: (r) => <span className="font-bold">{formatMoney(r.totalAmount)}</span> },
                { header: 'Paid Amount', accessor: 'paidAmount', render: (r) => <span className="text-emerald-700 font-bold">{formatMoney(r.paidAmount)}</span> },
                { header: 'Outstanding Due', accessor: 'outstandingBalance', render: (r) => <span className="text-rose-600 font-black">{formatMoney(r.outstandingBalance)}</span> },
                { header: 'Status', accessor: 'status', render: (r) => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">{r.status}</span> }
              ]}
              data={receivables}
              searchPlaceholder="Search outstanding debtors..."
              exportFileName="harmain_receivables_report.csv"
            />
          </div>
        </div>
      )}

      {/* 4. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-base text-gray-900">Operational Reminders & Alerts</h3>
            <button
              onClick={async () => { await api.markAllNotificationsRead(); loadAllEnterpriseData(); }}
              className="px-3 py-1 bg-emerald-50 text-[#0A4D3C] hover:bg-emerald-100 text-xs font-bold rounded-lg transition-all"
            >
              Mark All as Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map(n => (
              <div 
                key={n.id}
                className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-4 transition-all ${
                  n.read ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50/50 border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                      n.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {n.priority}
                    </span>
                    <strong className="text-gray-900 text-sm">{n.title}</strong>
                  </div>
                  <p className="text-gray-600 mt-1">{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block font-mono">{n.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AGENCY SETTINGS & EXCHANGE RATES TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSettingsSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-base font-extrabold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              Agency Profile & Statutory Licenses
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Government Department of Tourist Services, IATA and Saudi Munazzam credentials</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Brand Name</label>
              <input
                type="text"
                value={settingsForm.agencyName}
                onChange={(e) => setSettingsForm({ ...settingsForm, agencyName: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Brand Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">DTS License Number</label>
              <input
                type="text"
                value={settingsForm.dtsLicense}
                onChange={(e) => setSettingsForm({ ...settingsForm, dtsLicense: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">IATA Accredited Code</label>
              <input
                type="text"
                value={settingsForm.iataCode}
                onChange={(e) => setSettingsForm({ ...settingsForm, iataCode: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Saudi Munazzam ID</label>
              <input
                type="text"
                value={settingsForm.munazzamId}
                onChange={(e) => setSettingsForm({ ...settingsForm, munazzamId: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          {/* Real Live Exchange Rates */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#0A4D3C]" />
              <h4 className="font-bold text-sm text-[#0A4D3C]">Live Currency Conversion Rates</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">1 Saudi Riyal (SAR) in PKR</label>
                <input
                  type="number"
                  step="0.01"
                  value={settingsForm.exchangeRates?.SAR || 74.50}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    exchangeRates: { ...settingsForm.exchangeRates, SAR: parseFloat(e.target.value || 0) }
                  })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">1 US Dollar (USD) in PKR</label>
                <input
                  type="number"
                  step="0.01"
                  value={settingsForm.exchangeRates?.USD || 278.50}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    exchangeRates: { ...settingsForm.exchangeRates, USD: parseFloat(e.target.value || 0) }
                  })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              Save System Settings
            </button>
          </div>
        </form>
      )}

      {/* 6. AUDIT LOGS & BACKUP TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Backup / Restore Controls */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-gray-900">Database Backup & Disaster Recovery</h3>
              <p className="text-xs text-gray-500 mt-0.5">Download full JSON snapshot of all 28 ERP modules or restore previous state.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBackupDownload}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Export Full Backup (.JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Restore Backup</span>
                <input type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
              </label>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              Immutable System Activity Audit Trail
            </h3>
            <DataTable
              columns={[
                { header: 'Action', accessor: 'action', render: (r) => <span className="font-mono font-bold text-xs text-[#0A4D3C]">{r.action}</span> },
                { header: 'Module', accessor: 'module', render: (r) => <span className="px-2 py-0.5 rounded bg-gray-100 font-bold text-[10px]">{r.module}</span> },
                { header: 'Performed By', accessor: 'performedBy', render: (r) => <span className="font-semibold text-gray-800">{r.performedBy}</span> },
                { header: 'Details', accessor: 'details', render: (r) => <span className="text-gray-600 truncate max-w-[280px] block">{r.details}</span> },
                { header: 'IP / Terminal', accessor: 'ipAddress', render: (r) => <span className="font-mono text-[10px] text-gray-500">{r.ipAddress}</span> },
                { header: 'Timestamp', accessor: 'timestamp', render: (r) => <span className="font-mono text-[10px] text-gray-400">{r.timestamp}</span> }
              ]}
              data={auditLogs}
              searchPlaceholder="Search audit trail by user, action or module..."
              exportFileName="harmain_audit_logs.csv"
            />
          </div>
        </div>
      )}
    </div>
  );
}
