import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import PrintableDocumentModal from '../components/common/PrintableDocumentModal';
import { 
  CalendarDays, Plus, Printer, Eye, CreditCard, Hotel, 
  Plane, Car, Users, CheckCircle2, AlertCircle, DollarSign, 
  Trash2, FileText, ChevronRight
} from 'lucide-react';

export default function BookingsView() {
  const { formatMoney, currency, exchangeRates } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherData, setVoucherData] = useState(null);

  // New Booking Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    packageId: '',
    packageName: '',
    packageType: 'Umrah',
    travelDate: '2026-11-20',
    returnDate: '2026-12-04',
    paxCount: 2,
    roomType: 'Double Sharing (2 Beds)',
    makkahHotel: 'Fairmont Makkah Clock Royal Tower',
    madinahHotel: 'The Oberoi Madinah',
    pnrCode: 'SV79KX',
    flightDetails: 'Saudia SV-739 (Direct)',
    assignedVehicle: 'GMC Yukon XL Denali 2025',
    sellingPricePerPax: 1150000,
    advancePaid: 500000,
    passengers: [
      { name: '', passport: '', type: 'Adult', gender: 'Male' },
      { name: '', passport: '', type: 'Adult', gender: 'Female' }
    ]
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes, hRes, fRes] = await Promise.all([
        api.getBookings(),
        api.getPackages(),
        api.getHotels(),
        api.getFlights()
      ]);
      if (bRes.success) setBookings(bRes.bookings);
      if (pRes.success) setPackages(pRes.packages);
      if (hRes.success) setHotels(hRes.hotels);
      if (fRes.success) setFlights(fRes.flights);
    } catch (err) {
      console.error('Failed to load bookings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePaxCountChange = (newCount) => {
    const count = parseInt(newCount, 10) || 1;
    const current = [...formData.passengers];
    while (current.length < count) {
      current.push({ name: '', passport: '', type: 'Adult', gender: 'Male' });
    }
    setFormData({
      ...formData,
      paxCount: count,
      passengers: current.slice(0, count)
    });
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...formData.passengers];
    updated[index][field] = value;
    setFormData({ ...formData, passengers: updated });
  };

  const handlePackageSelect = (pkgId) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (pkg) {
      setFormData({
        ...formData,
        packageId: pkg.id,
        packageName: pkg.title,
        packageType: pkg.type,
        makkahHotel: pkg.makkahHotel,
        madinahHotel: pkg.madinahHotel,
        sellingPricePerPax: pkg.sellingPricePKR || 1150000
      });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createBooking(formData);
      if (res.success) {
        setShowNewBookingModal(false);
        loadData();
        alert('Booking successfully created with automated accounting ledger!');
      }
    } catch (err) {
      alert('Booking creation failed: ' + err.message);
    }
  };

  const handlePrintVoucher = async (booking, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.getVoucherDoc(booking.id);
      if (res.success) {
        setVoucherData(res.voucher);
        setShowVoucherModal(true);
      }
    } catch (err) {
      alert('Failed to load voucher: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Booking Ref',
      accessor: 'bookingNumber',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-[#0A4D3C]">{row.bookingNumber}</div>
          <div className="text-[10px] text-gray-500 font-mono">{row.invoiceNumber}</div>
        </div>
      )
    },
    {
      header: 'Lead Customer',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.customerName}</div>
          <div className="text-[10px] text-gray-500">{row.customerPhone}</div>
        </div>
      )
    },
    {
      header: 'Package & Dates',
      accessor: 'packageName',
      render: (row) => (
        <div className="max-w-[200px] truncate">
          <div className="font-semibold text-gray-900 truncate">{row.packageName}</div>
          <div className="text-[10px] text-gray-500">
            {row.travelDate} ➔ {row.returnDate}
          </div>
        </div>
      )
    },
    {
      header: 'Pax / Room',
      accessor: 'paxCount',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-800">{row.paxCount} Pax</div>
          <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{row.roomType}</div>
        </div>
      )
    },
    {
      header: 'Total Price',
      accessor: (row) => row.financials?.totalSellingPrice,
      render: (row) => (
        <div>
          <div className="font-extrabold text-gray-900">
            {formatMoney(row.financials?.totalSellingPrice || 0)}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            Profit: {formatMoney(row.financials?.grossProfitPKR || 0)} ({row.financials?.grossProfitMarginPercent || 0}%)
          </div>
        </div>
      )
    },
    {
      header: 'Payment Status',
      accessor: 'paymentStatus',
      render: (row) => (
        <div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            row.paymentStatus === 'Fully Paid'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {row.paymentStatus}
          </span>
          {row.financials?.outstandingBalance > 0 && (
            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
              Due: {formatMoney(row.financials.outstandingBalance)}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedBooking(row)}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#0A4D3C] hover:text-white transition-all shadow-2xs"
            title="View Booking File"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handlePrintVoucher(row, e)}
            className="p-1.5 rounded-lg border border-emerald-300 text-[#0A4D3C] bg-emerald-50 hover:bg-emerald-100 transition-all shadow-2xs"
            title="Generate & Print Official Voucher"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Bookings & Pilgrimage Sales
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            End-to-end multi-passenger reservation engine, hotel and flight block allocations, real-time cost calculation and official voucher generation.
          </p>
        </div>
        <button
          onClick={() => setShowNewBookingModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Bookings Table */}
      <DataTable
        columns={columns}
        data={bookings}
        searchPlaceholder="Search by Booking #, Customer, PNR or Invoice..."
        filterField="paymentStatus"
        filterOptions={['Fully Paid', 'Partially Paid', 'Pending Payment']}
        onRowClick={(row) => setSelectedBooking(row)}
        exportFileName="harmain_bookings_ledger.csv"
      />

      {/* NEW BOOKING WIZARD MODAL */}
      <Modal
        isOpen={showNewBookingModal}
        onClose={() => setShowNewBookingModal(false)}
        title="Create Pilgrimage Booking File"
        subtitle="Step-by-step multi-passenger reservation with automatic cost, gross profit, and invoice generation."
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-6 text-xs">
          {/* Section 1: Customer & Package */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
            <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider">
              1. Lead Pilgrim & Package Selection
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Lead Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Haji Abdul Qayyum"
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0A4D3C]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+92 300 XXXXXXX"
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0A4D3C]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="customer@gmail.com"
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0A4D3C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Holy Package *</label>
                <select
                  required
                  value={formData.packageId}
                  onChange={(e) => handlePackageSelect(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0A4D3C]"
                >
                  <option value="">-- Choose Package --</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.type}] {p.title} (Rs. {Number(p.sellingPricePKR).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Number of Passengers (Pax) *</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.paxCount}
                  onChange={(e) => handlePaxCountChange(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-bold text-center focus:ring-2 focus:ring-[#0A4D3C]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Selling Price Per Pax (PKR)</label>
                <input
                  type="number"
                  value={formData.sellingPricePerPax}
                  onChange={(e) => setFormData({ ...formData, sellingPricePerPax: parseFloat(e.target.value || 0) })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-bold focus:ring-2 focus:ring-[#0A4D3C]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Passengers List */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
            <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider">
              2. Passenger Details ({formData.passengers.length} Total)
            </h4>
            <div className="space-y-2">
              {formData.passengers.map((pax, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder={`Passenger ${idx + 1} Full Name`}
                      value={pax.name}
                      onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      required={idx === 0}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Passport Number"
                      value={pax.passport}
                      onChange={(e) => handlePassengerChange(idx, 'passport', e.target.value.toUpperCase())}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <select
                      value={pax.gender}
                      onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Allocations & Advance Payment */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
            <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider">
              3. Accommodation, Flights & Financial Terms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Makkah Hotel</label>
                <input
                  type="text"
                  value={formData.makkahHotel}
                  onChange={(e) => setFormData({ ...formData, makkahHotel: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Madinah Hotel</label>
                <input
                  type="text"
                  value={formData.madinahHotel}
                  onChange={(e) => setFormData({ ...formData, madinahHotel: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Flight Routing / PNR</label>
                <input
                  type="text"
                  value={formData.flightDetails}
                  onChange={(e) => setFormData({ ...formData, flightDetails: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Ground Fleet</label>
                <input
                  type="text"
                  value={formData.assignedVehicle}
                  onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Advance Deposit Received (PKR)</label>
                <input
                  type="number"
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: parseFloat(e.target.value || 0) })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-bold text-emerald-800"
                />
              </div>
            </div>

            {/* Visual Sanctuaries & Fleet Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl overflow-hidden border border-emerald-200 bg-white shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400"
                  alt="Makkah Hotel"
                  className="w-full h-18 object-cover"
                />
                <div className="p-2 text-[10px]">
                  <div className="font-bold text-[#0A4D3C]">Makkah Sanctuary</div>
                  <div className="text-gray-600 truncate">{formData.makkahHotel}</div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-amber-200 bg-white shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=400"
                  alt="Madinah Hotel"
                  className="w-full h-18 object-cover"
                />
                <div className="p-2 text-[10px]">
                  <div className="font-bold text-amber-800">Madinah Sanctuary</div>
                  <div className="text-gray-600 truncate">{formData.madinahHotel}</div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400"
                  alt="Ground Fleet"
                  className="w-full h-18 object-cover"
                />
                <div className="p-2 text-[10px]">
                  <div className="font-bold text-gray-800">Assigned Ground Fleet</div>
                  <div className="text-gray-600 truncate">{formData.assignedVehicle}</div>
                </div>
              </div>
            </div>

            {/* Live Financial Calculation Box */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Total Booking Amount</span>
                <div className="text-xl font-black text-[#0A4D3C]">
                  {formatMoney(formData.sellingPricePerPax * formData.paxCount)}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Advance Paid</span>
                <div className="text-xl font-bold text-emerald-700">
                  {formatMoney(formData.advancePaid)}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Outstanding Balance</span>
                <div className="text-xl font-black text-rose-700">
                  {formatMoney(Math.max(0, formData.sellingPricePerPax * formData.paxCount - formData.advancePaid))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowNewBookingModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Confirm & Issue Booking File</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* BOOKING DETAILS MODAL */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Booking File: ${selectedBooking?.bookingNumber}`}
        subtitle={`Invoice: ${selectedBooking?.invoiceNumber} • Customer: ${selectedBooking?.customerName}`}
        maxWidth="max-w-4xl"
      >
        {selectedBooking && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-gray-900">{selectedBooking.packageName}</h3>
                <p className="text-gray-500">Travel Window: {selectedBooking.travelDate} to {selectedBooking.returnDate} • {selectedBooking.paxCount} Pax</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePrintVoucher(selectedBooking, e)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
              <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider">
                Audited Accounting & Profit Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-gray-500">Selling Price:</span>
                  <div className="text-base font-bold text-gray-900">{formatMoney(selectedBooking.financials?.totalSellingPrice)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Direct Cost:</span>
                  <div className="text-base font-bold text-gray-700">{formatMoney(selectedBooking.financials?.totalDirectCost)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Gross Profit:</span>
                  <div className="text-base font-bold text-emerald-700">{formatMoney(selectedBooking.financials?.grossProfitPKR)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Outstanding Balance:</span>
                  <div className="text-base font-bold text-rose-600">{formatMoney(selectedBooking.financials?.outstandingBalance)}</div>
                </div>
              </div>
            </div>

            {/* Sanctuaries & Ground Transportation Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-emerald-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400" className="w-full h-24 object-cover" alt="Makkah Hotel" />
                <div className="p-3">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Makkah Hotel</span>
                  <div className="font-bold text-gray-900 mt-0.5 truncate">{selectedBooking.makkahHotel}</div>
                  <div className="text-[10px] text-gray-500">Room: {selectedBooking.roomType}</div>
                </div>
              </div>

              <div className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <img src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=400" className="w-full h-24 object-cover" alt="Madinah Hotel" />
                <div className="p-3">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Madinah Hotel</span>
                  <div className="font-bold text-gray-900 mt-0.5 truncate">{selectedBooking.madinahHotel}</div>
                  <div className="text-[10px] text-gray-500">Courtyard Front Accommodation</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400" className="w-full h-24 object-cover" alt="Ground Fleet" />
                <div className="p-3">
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Assigned Fleet</span>
                  <div className="font-bold text-gray-900 mt-0.5 truncate">{selectedBooking.assignedVehicle}</div>
                  <div className="text-[10px] text-gray-500">Flight PNR: {selectedBooking.pnrCode}</div>
                </div>
              </div>
            </div>

            {/* Passengers Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-gray-100 font-bold text-gray-700">Passenger Manifest</div>
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Passport</th>
                    <th className="p-2.5">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(selectedBooking.passengers || []).map((pax, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-gray-900">{pax.name}</td>
                      <td className="p-2.5 font-mono">{pax.passport || 'On File'}</td>
                      <td className="p-2.5">{pax.type || 'Adult'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* OFFICIAL VOUCHER PRINT MODAL */}
      <PrintableDocumentModal
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        docType="voucher"
        data={voucherData}
      />
    </div>
  );
}
