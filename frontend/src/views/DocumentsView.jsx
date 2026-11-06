import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import PrintableDocumentModal from '../components/common/PrintableDocumentModal';
import { FileText, Printer, Download, Sparkles, CheckCircle2, Search } from 'lucide-react';

export default function DocumentsView() {
  const [bookings, setBookings] = useState([]);
  const [pilgrims, setPilgrims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showDocModal, setShowDocModal] = useState(false);
  const [activeDocType, setActiveDocType] = useState('voucher');
  const [activeDocData, setActiveDocData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [bRes, pRes, pyRes, gRes] = await Promise.all([
          api.getBookings(),
          api.getPilgrims(),
          api.getPayments(),
          api.getGroups()
        ]);
        if (bRes.success) setBookings(bRes.bookings);
        if (pRes.success) setPilgrims(pRes.pilgrims);
        if (pyRes.success) setPayments(pyRes.payments);
        if (gRes.success) setGroups(gRes.groups);
      } catch (err) {
        console.error('Failed to load documents data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openVoucher = async (bookingId) => {
    try {
      const res = await api.getVoucherDoc(bookingId);
      if (res.success) {
        setActiveDocType('voucher');
        setActiveDocData(res.voucher);
        setShowDocModal(true);
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const openReceipt = async (paymentId) => {
    try {
      const res = await api.getReceipt(paymentId);
      if (res.success) {
        setActiveDocType('receipt');
        setActiveDocData(res.receiptData);
        setShowDocModal(true);
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const openPilgrimCard = async (pilgrimId) => {
    try {
      const res = await api.getPilgrimCard(pilgrimId);
      if (res.success) {
        setActiveDocType('idcard');
        setActiveDocData(res.cardData);
        setShowDocModal(true);
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const openItinerary = async (bookingId) => {
    try {
      const res = await api.getItineraryDoc(bookingId);
      if (res.success) {
        setActiveDocType('itinerary');
        setActiveDocData(res.itinerary);
        setShowDocModal(true);
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
          Document, PDF & Voucher Generation Hub
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Instant high-fidelity printing and PDF export of official pilgrimage vouchers, treasury payment receipts, pilgrim identity cards, and holy itineraries.
        </p>
      </div>

      {/* Grid of Document Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Official Booking Vouchers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Official Pilgrimage Vouchers</h3>
              <p className="text-[11px] text-gray-500">Service order vouchers with flights, hotels and QR authentication</p>
            </div>
            <span className="p-2 rounded-xl bg-emerald-50 text-[#0A4D3C]">
              <FileText className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-gray-900">{b.customerName}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{b.bookingNumber} • {b.paxCount} Pax</div>
                </div>
                <button
                  onClick={() => openVoucher(b.id)}
                  className="px-3 py-1 bg-[#0A4D3C] hover:bg-[#063A2D] text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Preview & Print</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Official Payment Receipts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Treasury Payment Receipts</h3>
              <p className="text-[11px] text-gray-500">Authorized receipts with Islamic watermark and balance reconciliation</p>
            </div>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <FileText className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-gray-900">{p.customerName}</div>
                  <div className="text-[10px] text-emerald-800 font-bold font-mono">
                    Rs. {Number(p.amountPKR).toLocaleString()} • {p.receiptNumber}
                  </div>
                </div>
                <button
                  onClick={() => openReceipt(p.id)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Pilgrim Digital Identity Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Pilgrim Identity Cards</h3>
              <p className="text-[11px] text-gray-500">Lanyard badges with photo, barcode, Makkah/Madinah rooms and Saudi hotlines</p>
            </div>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <FileText className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {pilgrims.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-gray-900">{p.fullName}</div>
                  <div className="text-[10px] text-gray-500 font-mono">Pass: {p.passportNumber} • {p.pilgrimCode}</div>
                </div>
                <button
                  onClick={() => openPilgrimCard(p.id)}
                  className="px-3 py-1 bg-[#0A4D3C] hover:bg-[#063A2D] text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Badge</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Day-by-Day Itineraries */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Day-by-Day Journey Itineraries</h3>
              <p className="text-[11px] text-gray-500">Comprehensive spiritual schedule, Ziyarat timings and Zamzam guidelines</p>
            </div>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <FileText className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-gray-900">{b.packageName}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{b.customerName} ({b.travelDate})</div>
                </div>
                <button
                  onClick={() => openItinerary(b.id)}
                  className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Itinerary</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRINT MODAL */}
      <PrintableDocumentModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        docType={activeDocType}
        data={activeDocData}
      />
    </div>
  );
}
