import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { Plane, Ticket, Plus, ArrowRight, CheckCircle2, DollarSign, Clock } from 'lucide-react';

export default function AviationView({ defaultSubTab = 'flights' }) {
  const { formatMoney } = useCurrency();
  const [subTab, setSubTab] = useState(defaultSubTab); // 'flights' or 'pnrs'
  const [flights, setFlights] = useState([]);
  const [pnrs, setPnrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showPnrModal, setShowPnrModal] = useState(false);

  // Forms
  const [flightForm, setFlightForm] = useState({
    airlineCode: 'SV',
    airlineName: 'Saudi Arabian Airlines (Saudia)',
    flightNumber: 'SV-739',
    originAirport: 'ISB (Islamabad International)',
    destinationAirport: 'JED (King Abdulaziz Terminal 1)',
    departureDateTime: '2026-11-20T04:30:00.000Z',
    arrivalDateTime: '2026-11-20T08:15:00.000Z',
    totalBlockSeats: 50,
    costPricePerSeatPKR: 195000,
    sellingPricePerSeatPKR: 245000
  });

  const [pnrForm, setPnrForm] = useState({
    pnrCode: '',
    airline: 'Saudia (SV)',
    flightNumbers: ['SV-739', 'SV-738'],
    bookingRef: 'HRM-BK-2026-0001',
    passengerCount: 2,
    passengers: ['Passenger 1', 'Passenger 2'],
    purchasePricePKR: 390000,
    sellingPricePKR: 490000
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [fRes, pRes] = await Promise.all([api.getFlights(), api.getPnrs()]);
      if (fRes.success) setFlights(fRes.flights);
      if (pRes.success) setPnrs(pRes.pnrs);
    } catch (err) {
      console.error('Failed to load aviation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createFlight(flightForm);
      setShowFlightModal(false);
      loadData();
      alert('Flight schedule block created!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handlePnrSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPnr(pnrForm);
      setShowPnrModal(false);
      loadData();
      alert('PNR record issued!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const flightColumns = [
    {
      header: 'Flight #',
      accessor: 'flightNumber',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.flightNumber}</div>
          <div className="text-[10px] text-gray-500">{row.airlineName}</div>
        </div>
      )
    },
    {
      header: 'Sector Route',
      accessor: 'originAirport',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
          <span>{row.originAirport.split('(')[0]}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0A4D3C]" />
          <span>{row.destinationAirport.split('(')[0]}</span>
        </div>
      )
    },
    {
      header: 'Schedule',
      accessor: 'departureDateTime',
      render: (row) => (
        <div>
          <div className="font-mono text-gray-800">{row.departureDateTime.split('T')[0]}</div>
          <div className="text-[10px] text-gray-500 font-mono">{row.departureDateTime.split('T')[1]?.slice(0, 5)} GMT</div>
        </div>
      )
    },
    {
      header: 'Block Capacity',
      accessor: 'confirmedSeats',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.confirmedSeats} / {row.totalBlockSeats} Seats</div>
          <div className="text-[10px] text-emerald-700 font-semibold">{row.availableSeats} Available</div>
        </div>
      )
    },
    {
      header: 'Seat Pricing & Margin',
      accessor: 'sellingPricePerSeatPKR',
      render: (row) => (
        <div>
          <div className="font-extrabold text-gray-900">{formatMoney(row.sellingPricePerSeatPKR)}</div>
          <div className="text-[10px] text-emerald-700">Margin: {formatMoney(row.sellingPricePerSeatPKR - row.costPricePerSeatPKR)}</div>
        </div>
      )
    }
  ];

  const pnrColumns = [
    {
      header: 'PNR Code',
      accessor: 'pnrCode',
      render: (row) => (
        <span className="font-mono font-black text-sm text-[#0A4D3C] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {row.pnrCode}
        </span>
      )
    },
    {
      header: 'Airline & Flights',
      accessor: 'airline',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.airline}</div>
          <div className="text-[10px] text-gray-500 font-mono">{row.flightNumbers?.join(', ')}</div>
        </div>
      )
    },
    {
      header: 'Passengers',
      accessor: 'passengers',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.passengerCount} Pax</div>
          <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{row.passengers?.join(', ')}</div>
        </div>
      )
    },
    {
      header: 'Booking Ref',
      accessor: 'bookingRef',
      render: (row) => (
        <span className="font-mono text-gray-700">{row.bookingRef}</span>
      )
    },
    {
      header: 'Cost / Selling Margin',
      accessor: 'sellingPricePKR',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{formatMoney(row.sellingPricePKR)}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Margin: {formatMoney(row.marginPKR)}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Aviation, Block Seats & Air Tickets
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage bulk airline seat allocations, GDS PNR issuance, ticketing cost vs selling prices, and passenger manifests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setSubTab('flights')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'flights' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Flight Schedules</span>
            </button>
            <button
              onClick={() => setSubTab('pnrs')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'pnrs' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>PNR Tickets</span>
            </button>
          </div>

          <button
            onClick={() => subTab === 'flights' ? setShowFlightModal(true) : setShowPnrModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>{subTab === 'flights' ? 'Add Flight Block' : 'Issue New PNR'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {subTab === 'flights' ? (
        <DataTable
          columns={flightColumns}
          data={flights}
          searchPlaceholder="Search flights by flight number or sector..."
          exportFileName="harmain_flights_schedules.csv"
        />
      ) : (
        <DataTable
          columns={pnrColumns}
          data={pnrs}
          searchPlaceholder="Search PNRs by 6-char PNR code, passenger or booking ref..."
          exportFileName="harmain_pnr_tickets.csv"
        />
      )}

      {/* NEW FLIGHT MODAL */}
      <Modal
        isOpen={showFlightModal}
        onClose={() => setShowFlightModal(false)}
        title="Add Scheduled Flight Block"
        subtitle="Record bulk seat block purchase from Saudia, PIA, Flynas or other airlines."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFlightSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Airline Code & Name</label>
              <input
                type="text"
                required
                value={flightForm.airlineName}
                onChange={(e) => setFlightForm({ ...flightForm, airlineName: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Flight Number *</label>
              <input
                type="text"
                required
                value={flightForm.flightNumber}
                onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })}
                placeholder="SV-739"
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Origin Airport</label>
              <input
                type="text"
                value={flightForm.originAirport}
                onChange={(e) => setFlightForm({ ...flightForm, originAirport: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Destination Airport</label>
              <input
                type="text"
                value={flightForm.destinationAirport}
                onChange={(e) => setFlightForm({ ...flightForm, destinationAirport: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Total Block Seats</label>
              <input
                type="number"
                value={flightForm.totalBlockSeats}
                onChange={(e) => setFlightForm({ ...flightForm, totalBlockSeats: parseInt(e.target.value || 50, 10) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Cost Price / Seat (PKR)</label>
              <input
                type="number"
                value={flightForm.costPricePerSeatPKR}
                onChange={(e) => setFlightForm({ ...flightForm, costPricePerSeatPKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Selling Price / Seat (PKR)</label>
              <input
                type="number"
                value={flightForm.sellingPricePerSeatPKR}
                onChange={(e) => setFlightForm({ ...flightForm, sellingPricePerSeatPKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowFlightModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Save Flight Block
            </button>
          </div>
        </form>
      </Modal>

      {/* NEW PNR MODAL */}
      <Modal
        isOpen={showPnrModal}
        onClose={() => setShowPnrModal(false)}
        title="Issue PNR Air Ticket Record"
        subtitle="Link 6-character GDS booking reference to passenger files and calculate ticket selling margin."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handlePnrSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">PNR Code *</label>
              <input
                type="text"
                required
                maxLength="6"
                value={pnrForm.pnrCode}
                onChange={(e) => setPnrForm({ ...pnrForm, pnrCode: e.target.value.toUpperCase() })}
                placeholder="e.g. SV79KX"
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono text-base font-bold text-[#0A4D3C]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Airline Consolidator</label>
              <input
                type="text"
                value={pnrForm.airline}
                onChange={(e) => setPnrForm({ ...pnrForm, airline: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Consolidator Purchase Price (PKR)</label>
              <input
                type="number"
                value={pnrForm.purchasePricePKR}
                onChange={(e) => setPnrForm({ ...pnrForm, purchasePricePKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Pilgrim Selling Price (PKR)</label>
              <input
                type="number"
                value={pnrForm.sellingPricePKR}
                onChange={(e) => setPnrForm({ ...pnrForm, sellingPricePKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-emerald-800"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowPnrModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm PNR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
