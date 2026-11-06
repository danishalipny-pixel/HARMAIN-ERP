import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { BedDouble, Users, Plus, UserMinus, ShieldAlert, CheckCircle2, Hotel } from 'lucide-react';

export default function RoomInventoryView() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [pilgrims, setPilgrims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPilgrimId, setSelectedPilgrimId] = useState('');
  const [allocationError, setAllocationError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, hRes, pRes] = await Promise.all([
        api.getRooms(),
        api.getHotels(),
        api.getPilgrims()
      ]);
      if (rRes.success) setRooms(rRes.rooms);
      if (hRes.success) setHotels(hRes.hotels);
      if (pRes.success) setPilgrims(pRes.pilgrims);
    } catch (err) {
      console.error('Failed to load room inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAllocate = (room) => {
    setSelectedRoom(room);
    setSelectedPilgrimId('');
    setAllocationError('');
    setShowAllocateModal(true);
  };

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    setAllocationError('');
    if (!selectedRoom || !selectedPilgrimId) return;

    try {
      const res = await api.allocateRoomBed({
        roomId: selectedRoom.id,
        pilgrimId: selectedPilgrimId
      });
      if (res.success) {
        setShowAllocateModal(false);
        loadData();
        alert(res.message || 'Bed allocated successfully!');
      }
    } catch (err) {
      setAllocationError(err.message || 'Failed to allocate bed');
    }
  };

  const handleDeallocate = async (roomId, pilgrimId) => {
    if (!confirm('Free this bed allocation?')) return;
    try {
      await api.deallocateRoomBed({ roomId, pilgrimId });
      loadData();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Room # & Photo',
      accessor: 'roomNumber',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=150"}
            alt={row.roomNumber}
            className="w-12 h-9 rounded-lg object-cover border border-gray-200 shadow-2xs shrink-0"
          />
          <div>
            <div className="font-mono font-black text-sm text-[#0A4D3C]">{row.roomNumber}</div>
            <div className="text-[10px] text-gray-500">Floor {row.floor}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Hotel & City',
      accessor: 'hotelName',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.hotelName}</div>
          <div className="text-[10px] text-gray-500">{row.type}</div>
        </div>
      )
    },
    {
      header: 'Bed Capacity',
      accessor: 'occupiedBeds',
      render: (row) => {
        const percent = Math.round((row.occupiedBeds / row.capacity) * 100);
        return (
          <div className="w-28">
            <div className="flex justify-between text-[10px] font-bold mb-1">
              <span>{row.occupiedBeds} / {row.capacity} Beds</span>
              <span className={row.occupiedBeds >= row.capacity ? 'text-rose-600' : 'text-emerald-700'}>{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                style={{ width: `${percent}%` }} 
                className={`h-full ${row.occupiedBeds >= row.capacity ? 'bg-rose-500' : 'bg-[#0A4D3C]'}`}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Assigned Pilgrims',
      accessor: 'assignedPilgrims',
      render: (row) => (
        <div className="space-y-1">
          {row.assignedPilgrims?.length === 0 ? (
            <span className="text-gray-400 italic text-[11px]">No pilgrims assigned (All beds vacant)</span>
          ) : (
            row.assignedPilgrims?.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                <span className="font-medium text-gray-800">
                  {p.name} <span className="text-gray-400 text-[9px]">({p.gender})</span>
                </span>
                <button
                  onClick={() => handleDeallocate(row.id, p.pilgrimId)}
                  className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                  title="Remove from bed"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          row.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
          row.status === 'Occupied' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'id',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenAllocate(row)}
            disabled={row.occupiedBeds >= row.capacity}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-[#0A4D3C] text-[#0A4D3C] hover:bg-[#0A4D3C] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
            <span>Assign Bed</span>
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
            Room Inventory & Bed Allocation
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time hotel room matrix, vacant bed tracking, and automated Islamic gender segregation enforcement.
          </p>
        </div>
      </div>

      {/* Islamic Segregation Notice */}
      <div className="flex items-center gap-3 p-3.5 bg-emerald-50/70 border border-[#0A4D3C]/30 rounded-2xl text-xs text-[#063A2D]">
        <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0" />
        <div>
          <span className="font-bold">Automated Shariah Compliance Policy:</span> Non-family sharing rooms automatically prevent male and female pilgrims from sharing the same room without verified Mahram linkage.
        </div>
      </div>

      {/* Rooms Table */}
      <DataTable
        columns={columns}
        data={rooms}
        searchPlaceholder="Search rooms by number, hotel, or allocated pilgrim..."
        filterField="status"
        filterOptions={['Available', 'Occupied', 'Partially Available']}
        exportFileName="harmain_room_inventory.csv"
      />

      {/* ASSIGN BED MODAL */}
      <Modal
        isOpen={showAllocateModal}
        onClose={() => setShowAllocateModal(false)}
        title={`Assign Bed - Room ${selectedRoom?.roomNumber}`}
        subtitle={`${selectedRoom?.hotelName} (${selectedRoom?.type})`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-4 text-xs">
          {allocationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{allocationError}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">Select Registered Pilgrim</label>
            <select
              required
              value={selectedPilgrimId}
              onChange={(e) => setSelectedPilgrimId(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0A4D3C]"
            >
              <option value="">-- Choose Pilgrim --</option>
              {pilgrims.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.gender}, Pass: {p.passportNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-600 space-y-1">
            <div>Current Occupancy: <strong>{selectedRoom?.occupiedBeds} / {selectedRoom?.capacity} Beds</strong></div>
            <div>Remaining Vacant Beds: <strong>{(selectedRoom?.capacity || 0) - (selectedRoom?.occupiedBeds || 0)}</strong></div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAllocateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm Bed Allocation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
