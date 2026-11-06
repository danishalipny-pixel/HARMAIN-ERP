import React, { useState } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import PrintableDocumentModal from '../components/common/PrintableDocumentModal';
import Logo from '../components/common/Logo';
import { 
  Search, Plane, Hotel, FileCheck, CreditCard, Sparkles, 
  MapPin, Clock, Phone, Printer, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';

export default function CustomerPortalView({ onBackToErp }) {
  const { formatMoney } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('BK-2026-0001');
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal for printable documents
  const [showDocModal, setShowDocModal] = useState(false);
  const [docType, setDocType] = useState('voucher');
  const [docData, setDocData] = useState(null);

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.portalLookup(searchQuery.trim());
      if (res.success) {
        setPortalData(res.portalData);
      }
    } catch (err) {
      setError(err.message || 'No active pilgrimage found for the given reference.');
      setPortalData(null);
    } finally {
      setLoading(false);
    }
  };

  const openVoucher = async () => {
    if (!portalData?.booking?.id) return;
    try {
      const res = await api.getVoucherDoc(portalData.booking.id);
      if (res.success) {
        setDocType('voucher');
        setDocData(res.voucher);
        setShowDocModal(true);
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const openItinerary = async () => {
    if (!portalData?.booking?.id) return;
    try {
      const res = await api.getItineraryDoc(portalData.booking.id);
      if (res.success) {
        setDocType('itinerary');
        setDocData(res.itinerary);
        setShowDocModal(true);
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Portal Banner */}
      <div className="bg-gradient-to-r from-[#063A2D] via-[#0A4D3C] to-[#0E624E] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Official Pilgrim Self-Service Portal
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "'Cinzel', serif" }}>
            Track Your Sacred Journey
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl leading-relaxed">
            Verify flight PNRs, live Saudi MOFA visa progress, Makkah & Madinah hotel allocations, and download your verified travel vouchers.
          </p>
        </div>

        {/* Quick Search Box */}
        <form onSubmit={handleLookup} className="w-full md:w-96 flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
          <input
            type="text"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Booking # or Passport #"
            className="w-full px-3 py-2 text-xs bg-white text-gray-900 rounded-xl focus:outline-none placeholder-gray-400 font-bold"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B38F24] text-[#063A2D] text-xs font-black rounded-xl shadow transition-all shrink-0 cursor-pointer"
          >
            {loading ? 'Locating...' : 'Track'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PORTAL RESULT DETAILS */}
      {portalData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Status Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Confirmed Pilgrimage File</span>
              <h3 className="text-lg font-black text-gray-900 mt-0.5">{portalData.booking?.packageName || 'Sacred Journey'}</h3>
              <div className="text-xs text-gray-600 mt-0.5">
                Lead Pilgrim: <strong className="text-gray-900">{portalData.booking?.customerName}</strong> • Ref: <span className="font-mono font-bold text-[#0A4D3C]">{portalData.booking?.bookingNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openVoucher}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download Voucher</span>
              </button>
              <button
                onClick={openItinerary}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Full Itinerary</span>
              </button>
            </div>
          </div>

          {/* Visa Tracker Progress Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#0A4D3C]" />
                <h4 className="font-bold text-sm text-gray-900">Saudi MOFA Visa Progress</h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Visa Status: {portalData.visa?.stage || 'Active & Confirmed'}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-xs">
              {[
                { title: '1. Documents Received', done: true },
                { title: '2. Biometrics Done', done: true },
                { title: '3. MOFA Generated', done: true },
                { title: '4. Visa Stamped & Active', done: portalData.visa?.status === 'Delivered' || !portalData.visa }
              ].map((step, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                    step.done ? 'bg-emerald-50/70 border-emerald-300 text-[#0A4D3C] font-bold' : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${step.done ? 'text-[#0A4D3C]' : 'text-gray-300'}`} />
                  <span className="truncate">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Makkah Hotel Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-3">
              <div className="relative aspect-16/9 bg-gray-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800"
                  alt="Makkah Hotel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-[#0A4D3C]">
                  Makkah Al-Mukarramah
                </span>
                <span className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow">
                  0m Courtyard Front • Luxury 5-Star
                </span>
              </div>
              <div className="p-5 pt-0 space-y-2">
                <h4 className="text-base font-extrabold text-gray-900">{portalData.booking?.makkahHotel}</h4>
                <p className="text-xs text-gray-600">Room Category: <strong>{portalData.booking?.roomType}</strong></p>
                <div className="pt-2 border-t border-gray-100 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Direct Access to Holy Kaaba Mataf Courtyard</span>
                </div>
              </div>
            </div>

            {/* Madinah Hotel Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-3">
              <div className="relative aspect-16/9 bg-gray-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800"
                  alt="Madinah Hotel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Madinah Al-Munawwarah
                </span>
                <span className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow">
                  Zero Distance Northern Courtyard • 5-Star
                </span>
              </div>
              <div className="p-5 pt-0 space-y-2">
                <h4 className="text-base font-extrabold text-gray-900">{portalData.booking?.madinahHotel}</h4>
                <p className="text-xs text-gray-600">Room Category: <strong>{portalData.booking?.roomType}</strong></p>
                <div className="pt-2 border-t border-gray-100 text-xs text-amber-800 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Facing Prophet's Mosque Green Dome & Courtyard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aviation & Ground Transport Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-gray-900">Aviation Routing & Ground Logistics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 block mb-1">Airline GDS PNR</span>
                <strong className="font-mono text-base text-[#0A4D3C]">{portalData.booking?.pnrCode}</strong>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500 block mb-1">Flight Routing</span>
                <strong className="text-gray-900">{portalData.booking?.flightDetails}</strong>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150"
                  className="w-12 h-9 rounded object-cover border border-gray-200 shrink-0"
                  alt="Fleet"
                />
                <div>
                  <span className="text-gray-500 block mb-0.5">Assigned Ground Fleet</span>
                  <strong className="text-gray-900 truncate block">{portalData.booking?.assignedVehicle}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Total Package Selling Price</span>
              <strong className="text-base text-gray-900">{formatMoney(portalData.booking?.financials?.totalSellingPrice)}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Total Paid So Far</span>
              <strong className="text-base text-emerald-700">{formatMoney(portalData.booking?.financials?.totalPaid)}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Remaining Balance Due</span>
              <strong className={`text-base ${portalData.booking?.financials?.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatMoney(portalData.booking?.financials?.outstandingBalance || 0)}
              </strong>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                portalData.booking?.paymentStatus === 'Fully Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {portalData.booking?.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL */}
      <PrintableDocumentModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        docType={docType}
        data={docData}
      />
    </div>
  );
}
