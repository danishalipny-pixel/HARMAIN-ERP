import React, { useRef } from 'react';
import { X, Printer, Download, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function PrintableDocumentModal({ isOpen, onClose, docType = 'voucher', data = {} }) {
  const printRef = useRef(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden my-6">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#0A4D3C] uppercase tracking-wider">
              Official Document Preview
            </span>
            <span className="text-xs bg-emerald-100 text-[#0A4D3C] px-2 py-0.5 rounded font-bold uppercase">
              {docType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="print-container p-8 md:p-12 bg-white text-gray-900 max-h-[80vh] overflow-y-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#D4AF37] pb-6 gap-4">
            <Logo size="lg" />
            <div className="text-right sm:text-right text-xs text-gray-500">
              <div className="font-bold text-sm text-gray-800">HARMAIN TRAVEL & TOURS (PVT) LTD</div>
              <div>Govt DTS License: <span className="font-semibold text-gray-700">DTS-ISB-2024-8849</span></div>
              <div>IATA Accredited Agency: <span className="font-semibold text-gray-700">PK-2749102</span></div>
              <div>Saudi Moallim Munazzam ID: <span className="font-semibold text-gray-700">MNZ-77192</span></div>
              <div>Tel: +92 51 8849200 • KSA 24/7 Helpline: +966 50 123 4567</div>
            </div>
          </div>

          {/* VOUCHER DOCUMENT */}
          {docType === 'voucher' && (
            <div className="mt-6 space-y-6">
              <div className="bg-gradient-to-r from-[#0A4D3C] to-[#0E624E] text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37]">
                    Official Pilgrimage Booking Voucher
                  </h2>
                  <p className="text-xs text-emerald-100">Confirmed Hajj & Umrah Travel Itinerary & Services Order</p>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-200">Voucher Ref:</div>
                  <div className="font-mono font-extrabold text-sm text-white">{data.voucherNumber || 'HRM-VCH-2026-0001'}</div>
                </div>
              </div>

              {/* Pilgrim & Package Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider mb-2">Lead Pilgrim Details</h4>
                  <div className="space-y-1">
                    <div><span className="text-gray-500">Full Name:</span> <strong className="text-gray-900">{data.leadPilgrim?.name || data.customerName}</strong></div>
                    <div><span className="text-gray-500">Contact Phone:</span> <strong>{data.leadPilgrim?.phone || data.customerPhone}</strong></div>
                    <div><span className="text-gray-500">Email:</span> <strong>{data.leadPilgrim?.email || data.customerEmail || 'N/A'}</strong></div>
                    <div><span className="text-gray-500">Total Passengers:</span> <strong>{data.passengers?.length || data.paxCount || 1} Pax</strong></div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider mb-2">Package & Booking Meta</h4>
                  <div className="space-y-1">
                    <div><span className="text-gray-500">Package Name:</span> <strong className="text-gray-900">{data.package?.name || data.packageName}</strong></div>
                    <div><span className="text-gray-500">Booking Number:</span> <strong className="font-mono">{data.bookingNumber || data.id}</strong></div>
                    <div><span className="text-gray-500">Travel Window:</span> <strong>{data.package?.travelDate || data.travelDate} to {data.package?.returnDate || data.returnDate}</strong></div>
                    <div><span className="text-gray-500">Payment Status:</span> <strong className="text-emerald-700">{data.financialSummary?.paymentStatus || data.paymentStatus}</strong></div>
                  </div>
                </div>
              </div>

              {/* Accommodations & Ground Logistics */}
              <div className="border border-gray-200 rounded-xl p-4 text-xs space-y-3">
                <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider">Confirmed Holy Sanctuaries & Logistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <div className="font-bold text-gray-800">Makkah Al-Mukarramah</div>
                    <div className="text-gray-600 mt-1">{data.accommodations?.makkah?.hotel || data.makkahHotel}</div>
                    <div className="text-[11px] text-[#0A4D3C] font-semibold mt-1">Room: {data.accommodations?.makkah?.roomType || data.roomType}</div>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                    <div className="font-bold text-gray-800">Madinah Al-Munawwarah</div>
                    <div className="text-gray-600 mt-1">{data.accommodations?.madinah?.hotel || data.madinahHotel}</div>
                    <div className="text-[11px] text-amber-800 font-semibold mt-1">Room: {data.accommodations?.madinah?.roomType || data.roomType}</div>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div className="font-bold text-gray-800">Aviation & Ground Transport</div>
                    <div className="text-gray-600 mt-1">PNR: <strong className="font-mono">{data.package?.pnr || data.pnrCode}</strong></div>
                    <div className="text-gray-600 mt-0.5">Flight: {data.package?.flights || data.flightDetails}</div>
                    <div className="text-gray-600 mt-0.5">Fleet: {data.transport?.assignedVehicle || data.assignedVehicle}</div>
                  </div>
                </div>
              </div>

              {/* Passengers Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 font-bold text-gray-700">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Passenger Name</th>
                      <th className="p-2.5">Passport Number</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(data.passengers || []).map((pax, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-gray-900">{pax.name}</td>
                        <td className="p-2.5 font-mono">{pax.passport || 'Verified on File'}</td>
                        <td className="p-2.5">{pax.type || 'Adult'}</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">Confirmed</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAYMENT RECEIPT DOCUMENT */}
          {docType === 'receipt' && (
            <div className="mt-6 space-y-6">
              <div className="text-center pb-4 border-b border-gray-200">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  OFFICIAL HARMAIN TREASURY RECEIPT
                </span>
                <h2 className="text-2xl font-black text-gray-900 mt-2" style={{ fontFamily: "'Cinzel', serif" }}>
                  PAYMENT RECEIPT VOUCHER
                </h2>
                <p className="text-xs text-gray-500">Receipt No: <strong className="font-mono text-gray-800">{data.receiptNumber || data.id}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Received With Thanks From:</span>
                  <div className="text-base font-bold text-gray-900 mt-0.5">{data.customerName}</div>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Payment Date:</span>
                  <div className="text-base font-bold text-gray-900 mt-0.5">{data.paymentDate}</div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-dashed border-[#0A4D3C]/30 rounded-2xl text-center">
                <span className="text-xs uppercase tracking-widest text-[#0A4D3C] font-bold">Total Amount Received</span>
                <div className="text-4xl font-extrabold text-[#0A4D3C] mt-1">
                  Rs. {Number(data.amountPKR || 0).toLocaleString()}
                </div>
                {data.amountSAR && (
                  <div className="text-xs text-amber-800 font-bold mt-1">
                    Equivalent: SAR {Number(data.amountSAR || 0).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border border-gray-200 p-4 rounded-xl">
                <div>
                  <div><span className="text-gray-500">Payment Instrument:</span> <strong>{data.paymentMethod}</strong></div>
                  <div><span className="text-gray-500">Bank / Ref Number:</span> <strong className="font-mono">{data.bankReferenceNo || 'Cleared'}</strong></div>
                  <div><span className="text-gray-500">Installment Stage:</span> <strong>{data.installmentStage || 'Payment'}</strong></div>
                </div>
                <div className="text-right">
                  <div><span className="text-gray-500">Booking Reference:</span> <strong className="font-mono">{data.bookingRef || 'BK-2026-0001'}</strong></div>
                  <div><span className="text-gray-500">Total Package Price:</span> <strong>Rs. {Number(data.totalBookingPrice || data.amountPKR).toLocaleString()}</strong></div>
                  <div><span className="text-gray-500">Remaining Balance:</span> <strong className="text-rose-600">Rs. {Number(data.remainingBalance || 0).toLocaleString()}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* PILGRIM ID CARD */}
          {docType === 'idcard' && (
            <div className="mt-6 flex flex-col items-center">
              <div className="w-80 sm:w-96 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#063A2D] via-[#0A4D3C] to-[#0E624E] text-white p-5 shadow-2xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                  <Logo light={true} size="sm" showTagline={false} />
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-bold block">PILGRIM IDENTITY</span>
                    <span className="text-xs font-mono font-bold text-white">{data.pilgrim?.code || 'PLG-2026-0001'}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex gap-4 mt-4 items-center">
                  <div className="w-20 h-24 rounded-xl border-2 border-[#D4AF37] overflow-hidden shrink-0 bg-gray-800">
                    <img 
                      src={data.pilgrim?.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} 
                      alt="Pilgrim" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <h3 className="text-sm font-black text-white">{data.pilgrim?.fullName}</h3>
                    {data.pilgrim?.arabicName && (
                      <p className="text-xs text-[#D4AF37] font-bold">{data.pilgrim?.arabicName}</p>
                    )}
                    <div className="text-[11px] text-gray-200">
                      Passport: <span className="font-mono font-bold text-[#D4AF37]">{data.pilgrim?.passportNumber}</span>
                    </div>
                    <div className="text-[11px] text-gray-200">
                      Blood Group: <strong className="text-white">{data.pilgrim?.bloodGroup || 'B+'}</strong>
                    </div>
                    <div className="text-[11px] text-gray-200">
                      Visa: <span className="font-mono text-emerald-300">{data.pilgrim?.visaNumber || 'Active'}</span>
                    </div>
                  </div>
                </div>

                {/* Hotels in Makkah & Madinah */}
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-black/20 p-2 rounded-lg">
                    <div className="text-[#D4AF37] font-bold">Makkah Hotel</div>
                    <div className="text-white truncate">{data.pilgrim?.makkahHotel || 'Fairmont Clock Tower'}</div>
                    <div className="text-gray-300 font-mono">Room: {data.pilgrim?.makkahRoomNo || '1204'}</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded-lg">
                    <div className="text-[#D4AF37] font-bold">Madinah Hotel</div>
                    <div className="text-white truncate">{data.pilgrim?.madinahHotel || 'The Oberoi Madinah'}</div>
                    <div className="text-gray-300 font-mono">Room: {data.pilgrim?.madinahRoomNo || '305'}</div>
                  </div>
                </div>

                {/* Emergency Contact & Barcode Emulation */}
                <div className="mt-3 text-center text-[10px] text-gray-300">
                  <div>Emergency Contact: <strong className="text-white">{data.pilgrim?.emergencyContact}</strong></div>
                  <div>Saudi 24/7 Helpline: <strong className="text-[#D4AF37]">{data.emergencyPhoneKSA || '+966 50 123 4567'}</strong></div>
                  {/* Barcode Strip */}
                  <div className="mt-2 bg-white px-2 py-1 rounded flex justify-center items-center">
                    <div className="font-mono text-[9px] text-gray-800 tracking-widest font-black">
                      ||| | ||||| || |||| ||||| ||| || | {data.pilgrim?.qrToken || 'HRM-2026'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ITINERARY DOCUMENT */}
          {docType === 'itinerary' && (
            <div className="mt-6 space-y-6 text-xs">
              <div className="bg-gradient-to-r from-[#0A4D3C] to-[#063A2D] text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#D4AF37] uppercase tracking-wider">
                    Official Sacred Journey Day-by-Day Itinerary
                  </h2>
                  <p className="text-xs text-emerald-200">Booking: {data.bookingRef} • Customer: {data.customerName}</p>
                </div>
                <div className="text-xs text-right font-bold text-amber-200">
                  {data.travelDates}
                </div>
              </div>

              <div className="space-y-3">
                {(data.schedule || []).map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-3.5 border border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="w-16 shrink-0 font-bold text-[#0A4D3C] text-center border-r border-gray-200 pr-3">
                      Day {step.day}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                      <p className="text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OFFICIAL FOOTER STAMP & SIGNATURE */}
          <div className="mt-10 pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <div className="flex items-center gap-3">
              {/* Islamic Official Stamp Circle */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#0A4D3C] flex flex-col items-center justify-center text-[8px] text-[#0A4D3C] font-extrabold uppercase text-center p-1 select-none">
                <span>★ HARMAIN ERP ★</span>
                <span className="text-[7px]">OFFICIAL VERIFIED</span>
                <span className="text-[6.5px] text-[#D4AF37]">HAJJ & UMRAH AUTH</span>
              </div>
              <div className="text-[11px]">
                <div className="font-bold text-gray-800">Electronically Verified Document</div>
                <div>Authorized by Harmain ERP Operations Center</div>
                <div>Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="h-10 border-b border-gray-400 w-48 mb-1"></div>
              <div className="text-[11px] font-bold text-gray-800">Authorized Officer Signature</div>
              <div className="text-[10px] text-gray-500">Harmain Travel & Tours Pvt Ltd</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
