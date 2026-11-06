import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { Landmark, Plus, MapPin, Clock, Bus, User, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ZiyaratView() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    city: 'Makkah Al-Mukarramah',
    title: '',
    scheduleDate: '2026-11-22',
    departureTime: '06:30 AM (Post Fajr)',
    meetingPoint: 'Clock Tower Group Lobby',
    guideName: 'Maulana Qari Zubair (Licensed Islamic Scholar)',
    guideContact: '+966 55 991 0293',
    assignedVehicle: 'Toyota Coaster Luxury 2024',
    driverName: 'Muhammad Saeed',
    durationHours: 4.5,
    refreshmentsProvided: 'Bottled Zamzam & Fresh Madinah Dates'
  });

  const loadTours = async () => {
    setLoading(true);
    try {
      const res = await api.getZiyaratTours();
      if (res.success) setTours(res.tours);
    } catch (err) {
      console.error('Failed to load ziyarat tours:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createZiyaratTour(formData);
      setShowAddModal(false);
      loadTours();
      alert('Holy Ziyarat tour scheduled!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Tour Title & City',
      accessor: 'title',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.title}</div>
          <div className="text-[10px] text-[#0A4D3C] font-semibold">{row.city}</div>
        </div>
      )
    },
    {
      header: 'Date & Time',
      accessor: 'scheduleDate',
      render: (row) => (
        <div>
          <div className="font-mono text-gray-900 font-bold">{row.scheduleDate}</div>
          <div className="text-[10px] text-gray-500">{row.departureTime}</div>
        </div>
      )
    },
    {
      header: 'Islamic Scholar Guide',
      accessor: 'guideName',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-800">{row.guideName}</div>
          <div className="text-[10px] text-gray-500 font-mono">{row.guideContact}</div>
        </div>
      )
    },
    {
      header: 'Assigned Coach & Driver',
      accessor: 'assignedVehicle',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-800">{row.assignedVehicle}</div>
          <div className="text-[10px] text-emerald-800 font-semibold">Chauffeur: {row.driverName}</div>
        </div>
      )
    },
    {
      header: 'Duration & Refreshments',
      accessor: 'durationHours',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.durationHours} Hours</div>
          <div className="text-[10px] text-gray-500 truncate max-w-[140px]">{row.refreshmentsProvided}</div>
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
            Holy Ziyarat Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Conduct guided historical tours of sacred sites in Makkah and Madinah with scholarly commentary and private luxury coaches.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Schedule Ziyarat Tour</span>
        </button>
      </div>

      {/* Tour Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#0A4D3C] border border-[#0A4D3C]/20 uppercase">
                  {t.city}
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">
                  {t.scheduleDate} • {t.departureTime}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-gray-900">{t.title}</h3>
              <p className="text-xs text-gray-500 mt-1">Meeting Point: <strong>{t.meetingPoint}</strong></p>

              {/* Destination Pills */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                <div className="text-[11px] font-bold text-gray-700">Holy Itinerary Destinations:</div>
                <div className="space-y-1">
                  {(t.destinations || []).map((d, i) => (
                    <div key={i} className="text-xs flex items-baseline gap-1.5 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"></span>
                      <span><strong className="text-gray-800">{d.name}</strong> - {d.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <div>Guide: <strong className="text-gray-900">{t.guideName}</strong></div>
              <div>Coach: <strong className="text-[#0A4D3C]">{t.assignedVehicle}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tours Table */}
      <DataTable
        columns={columns}
        data={tours}
        searchPlaceholder="Search tours by title, guide or city..."
        exportFileName="harmain_ziyarat_tours.csv"
      />

      {/* SCHEDULE TOUR MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Holy Ziyarat Tour"
        subtitle="Appoint licensed Islamic scholar guide, select holy sites and assign fleet coach."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">City</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
              >
                <option value="Makkah Al-Mukarramah">Makkah Al-Mukarramah</option>
                <option value="Madinah Al-Munawwarah">Madinah Al-Munawwarah</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Tour Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Historical Madinah Holy Landmarks Tour"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.scheduleDate}
                onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Departure Time</label>
              <input
                type="text"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Islamic Scholar Guide Name</label>
              <input
                type="text"
                value={formData.guideName}
                onChange={(e) => setFormData({ ...formData, guideName: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Assigned Vehicle</label>
              <input
                type="text"
                value={formData.assignedVehicle}
                onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm Tour
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
