import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { 
  Car, UserCheck, PlaneTakeoff, Plus, Phone, ShieldCheck, 
  MapPin, Users, Luggage, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function TransportView({ defaultSubTab = 'transfers' }) {
  const [subTab, setSubTab] = useState(defaultSubTab); // 'transfers', 'vehicles', or 'drivers'
  const [transfers, setTransfers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);

  // Forms
  const [transferForm, setTransferForm] = useState({
    groupOrLeadName: '',
    transferType: 'Airport Arrival Pickup',
    pickupLocation: 'Jeddah King Abdulaziz Airport (Terminal 1)',
    dropoffLocation: 'Fairmont Makkah Clock Royal Tower',
    flightNumber: 'SV-739',
    estimatedArrival: '2026-11-20T08:15:00.000Z',
    assignedVehicle: 'GMC Yukon XL Denali 2025',
    assignedDriver: 'Tariq Al-Otaibi',
    passengerCount: 2,
    luggageCount: 4
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicleName: '',
    type: 'VIP Luxury SUV',
    registrationPlate: '',
    seatingCapacity: 7,
    luggageCapacity: '6 Large Bags',
    dailyRateSAR: 1200
  });

  const [driverForm, setDriverForm] = useState({
    fullName: '',
    nationality: 'Saudi Arabian',
    iqamaNumber: '',
    licenseNumber: '',
    mobileNumber: '',
    languages: ['Arabic', 'Urdu']
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, vRes, dRes] = await Promise.all([
        api.getTransfers(),
        api.getVehicles(),
        api.getDrivers()
      ]);
      if (tRes.success) setTransfers(tRes.transfers);
      if (vRes.success) setVehicles(vRes.vehicles);
      if (dRes.success) setDrivers(dRes.drivers);
    } catch (err) {
      console.error('Failed to load transport data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createTransfer(transferForm);
      setShowTransferModal(false);
      loadData();
      alert('Airport transfer scheduled!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createVehicle(vehicleForm);
      setShowVehicleModal(false);
      loadData();
      alert('Vehicle added to fleet!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createDriver(driverForm);
      setShowDriverModal(false);
      loadData();
      alert('Chauffeur registered!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const transferColumns = [
    {
      header: 'Lead / Group Name',
      accessor: 'groupOrLeadName',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.groupOrLeadName}</div>
          <div className="text-[10px] text-gray-500">{row.passengerCount} Pax • {row.luggageCount} Bags</div>
        </div>
      )
    },
    {
      header: 'Transfer Type',
      accessor: 'transferType',
      render: (row) => (
        <span className="font-semibold text-gray-800">{row.transferType}</span>
      )
    },
    {
      header: 'Pickup ➔ Drop-off',
      accessor: 'pickupLocation',
      render: (row) => (
        <div className="text-[11px] space-y-0.5">
          <div className="text-[#0A4D3C] font-semibold">From: {row.pickupLocation}</div>
          <div className="text-gray-600">To: {row.dropoffLocation}</div>
        </div>
      )
    },
    {
      header: 'Flight & Arrival Time',
      accessor: 'estimatedArrival',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-gray-800">{row.flightNumber}</div>
          <div className="text-[10px] text-gray-500 font-mono">{row.estimatedArrival?.split('T')[0]} {row.estimatedArrival?.split('T')[1]?.slice(0, 5)}</div>
        </div>
      )
    },
    {
      header: 'Assigned Chauffeur & Fleet',
      accessor: 'assignedVehicle',
      render: (row) => {
        const matched = vehicles.find(v => v.vehicleName === row.assignedVehicle);
        return (
          <div className="flex items-center gap-2.5">
            <img
              src={matched?.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150"}
              alt={row.assignedVehicle}
              className="w-10 h-7 rounded-md object-cover border border-gray-200 shrink-0"
            />
            <div>
              <div className="font-bold text-gray-900">{row.assignedDriver}</div>
              <div className="text-[10px] text-emerald-800 font-semibold">{row.assignedVehicle}</div>
            </div>
          </div>
        );
      }
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

  const vehicleColumns = [
    {
      header: 'Vehicle Model & Image',
      accessor: 'vehicleName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150"}
            alt={row.vehicleName}
            className="w-14 h-9 rounded-lg object-cover border border-[#0A4D3C]/20 shadow-2xs shrink-0"
          />
          <div>
            <div className="font-bold text-gray-900">{row.vehicleName}</div>
            <div className="text-[10px] text-gray-500 font-mono">{row.type}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Saudi License Plate',
      accessor: 'registrationPlate',
      render: (row) => (
        <span className="font-mono font-bold text-xs bg-gray-100 px-2.5 py-1 rounded border border-gray-300">
          {row.registrationPlate}
        </span>
      )
    },
    {
      header: 'Capacities',
      accessor: 'seatingCapacity',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-800">{row.seatingCapacity} Passenger Seats</div>
          <div className="text-[10px] text-gray-500">{row.luggageCapacity}</div>
        </div>
      )
    },
    {
      header: 'Daily Rate (SAR)',
      accessor: 'dailyRateSAR',
      render: (row) => (
        <span className="font-bold text-emerald-800">SAR {row.dailyRateSAR}</span>
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

  const driverColumns = [
    {
      header: 'Chauffeur Name',
      accessor: 'fullName',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.fullName}</div>
          <div className="text-[10px] text-gray-500">{row.nationality}</div>
        </div>
      )
    },
    {
      header: 'Saudi Iqama / DL',
      accessor: 'iqamaNumber',
      render: (row) => (
        <div>
          <div className="font-mono text-gray-800">Iqama: {row.iqamaNumber}</div>
          <div className="text-[10px] font-mono text-gray-500">DL: {row.licenseNumber}</div>
        </div>
      )
    },
    {
      header: 'Mobile / WhatsApp',
      accessor: 'mobileNumber',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-800">{row.mobileNumber}</span>
      )
    },
    {
      header: 'Languages',
      accessor: 'languages',
      render: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.languages?.map((l, i) => (
            <span key={i} className="px-1.5 py-0.2 rounded bg-gray-100 text-[10px] font-semibold text-gray-700">
              {l}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (row) => (
        <span className="font-bold text-amber-600">★ {row.rating} / 5.0</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Ground Logistics, Fleet & Airport Transfers
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            VIP GMC Yukon & Luxury Coach transport scheduling, Saudi airport Meet & Assist coordination, and chauffeur tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setSubTab('transfers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'transfers' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              Airport Transfers
            </button>
            <button
              onClick={() => setSubTab('vehicles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'vehicles' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              Fleet & Vehicles
            </button>
            <button
              onClick={() => setSubTab('drivers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subTab === 'drivers' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              Chauffeurs
            </button>
          </div>

          <button
            onClick={() => {
              if (subTab === 'transfers') setShowTransferModal(true);
              else if (subTab === 'vehicles') setShowVehicleModal(true);
              else setShowDriverModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>
              {subTab === 'transfers' ? 'Schedule Transfer' : subTab === 'vehicles' ? 'Add Vehicle' : 'Register Chauffeur'}
            </span>
          </button>
        </div>
      </div>

      {/* Tables based on active subTab */}
      {subTab === 'transfers' && (
        <DataTable
          columns={transferColumns}
          data={transfers}
          searchPlaceholder="Search airport transfers by lead name or flight number..."
          exportFileName="harmain_airport_transfers.csv"
        />
      )}
      {subTab === 'vehicles' && (
        <div className="space-y-6">
          {/* Visual Fleet Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Vehicle Photo Container */}
                  <div className="relative aspect-16/10 bg-gray-900 overflow-hidden">
                    <img
                      src={v.image || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"}
                      alt={v.vehicleName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#0A4D3C] text-white shadow-md">
                        {v.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="font-mono font-bold text-[11px] bg-white/90 text-gray-900 px-2 py-0.5 rounded border border-gray-300 shadow-xs">
                        {v.registrationPlate}
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-white flex items-center justify-between text-xs">
                      <span className="font-bold drop-shadow flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{v.seatingCapacity} Seats</span>
                      </span>
                      <span className="text-gray-200 drop-shadow flex items-center gap-1">
                        <Luggage className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{v.luggageCapacity}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900">{v.vehicleName}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Supplier: {v.supplier || 'Harmain Fleet KSA'}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        v.status === 'Assigned' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    {/* Amenities Pills */}
                    {v.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {v.amenities.map((a, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-semibold text-[#0A4D3C] border border-emerald-100"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Assigned Chauffeur:</span>
                      <strong className="text-gray-900 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#0A4D3C]" />
                        <span>{v.currentDriver || 'Unassigned'}</span>
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100/60 bg-gray-50/50 mt-2 flex items-center justify-between text-xs py-3">
                  <span className="text-gray-500 font-semibold">Standard Daily Rate:</span>
                  <strong className="text-emerald-800 font-bold text-sm">SAR {v.dailyRateSAR} / day</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Fleet Table */}
          <DataTable
            columns={vehicleColumns}
            data={vehicles}
            searchPlaceholder="Search fleet vehicles by plate, model, or category..."
            exportFileName="harmain_fleet_registry.csv"
          />
        </div>
      )}
      {subTab === 'drivers' && (
        <DataTable
          columns={driverColumns}
          data={drivers}
          searchPlaceholder="Search chauffeurs by name or phone..."
          exportFileName="harmain_chauffeurs_directory.csv"
        />
      )}

      {/* SCHEDULE TRANSFER MODAL */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Schedule Airport Transfer"
        subtitle="Coordinate Meet & Assist, banner signage, and assigned vehicle dispatch."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Lead Passenger / Group Name *</label>
              <input
                type="text"
                required
                value={transferForm.groupOrLeadName}
                onChange={(e) => setTransferForm({ ...transferForm, groupOrLeadName: e.target.value })}
                placeholder="e.g. Haji Abdul Qayyum & Family"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Flight Number</label>
              <input
                type="text"
                value={transferForm.flightNumber}
                onChange={(e) => setTransferForm({ ...transferForm, flightNumber: e.target.value })}
                placeholder="SV-739"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Pickup Location</label>
              <input
                type="text"
                value={transferForm.pickupLocation}
                onChange={(e) => setTransferForm({ ...transferForm, pickupLocation: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Drop-off Destination</label>
              <input
                type="text"
                value={transferForm.dropoffLocation}
                onChange={(e) => setTransferForm({ ...transferForm, dropoffLocation: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Assigned Vehicle</label>
              <select
                value={transferForm.assignedVehicle}
                onChange={(e) => setTransferForm({ ...transferForm, assignedVehicle: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.vehicleName}>{v.vehicleName} ({v.registrationPlate})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Assigned Chauffeur</label>
              <select
                value={transferForm.assignedDriver}
                onChange={(e) => setTransferForm({ ...transferForm, assignedDriver: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
              >
                {drivers.map(d => (
                  <option key={d.id} value={d.fullName}>{d.fullName} ({d.mobileNumber})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
