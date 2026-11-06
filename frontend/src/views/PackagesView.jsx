import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { 
  Compass, MoonStar, Plus, Hotel, Calendar, Users, 
  CheckCircle2, Sparkles, DollarSign, Edit3, Trash2
} from 'lucide-react';

export default function PackagesView({ defaultType = 'Umrah' }) {
  const { formatMoney, currency } = useCurrency();
  const [activeType, setActiveType] = useState(defaultType); // 'Hajj' or 'Umrah'
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: defaultType,
    category: '5-Star Luxury Haram Front',
    shiftingType: 'Non-Shifting',
    durationDays: 14,
    makkahHotel: 'Fairmont Makkah Clock Royal Tower',
    makkahNights: 8,
    madinahHotel: 'The Oberoi Madinah',
    madinahNights: 6,
    maktabNumber: 'Maktab 01 (VIP Zone A)',
    minaTentType: 'VIP Air-Conditioned Tents',
    arafatFacility: 'Air-Conditioned German Tents',
    transportType: 'Private VIP Mercedes Pullman',
    foodBoard: 'Full Board (Buffet 3 Meals)',
    qurbaniIncluded: true,
    ziyaratIncluded: true,
    totalSeats: 60,
    costPricePKR: 850000,
    sellingPricePKR: 1150000,
    description: ''
  });

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await api.getPackages();
      if (res.success) setPackages(res.packages);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    setActiveType(defaultType);
  }, [defaultType]);

  const filteredPackages = packages.filter(p => p.type && p.type.toLowerCase() === activeType.toLowerCase());

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPackage({ ...formData, type: activeType });
      setShowAddModal(false);
      loadPackages();
      alert(`${activeType} Package created successfully!`);
    } catch (err) {
      alert('Creation failed: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Package Title & Imagery',
      accessor: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#0A4D3C]/20 shadow-2xs shrink-0 bg-gray-100">
            <img
              src={row.coverImage || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=150"}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.title}</div>
            <div className="text-[10px] text-gray-500 font-mono">Code: {row.code} • {row.category}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Duration',
      accessor: 'durationDays',
      render: (row) => (
        <span className="font-bold text-gray-800">{row.durationDays} Days</span>
      )
    },
    {
      header: 'Holy Sanctuaries',
      accessor: 'makkahHotel',
      render: (row) => (
        <div className="text-[11px] space-y-0.5">
          <div className="text-[#0A4D3C] font-semibold">Makkah: {row.makkahHotel?.split(' ')[0]}</div>
          <div className="text-amber-800 font-semibold">Madinah: {row.madinahHotel?.split(' ')[0]}</div>
        </div>
      )
    },
    {
      header: 'Quota & Capacity',
      accessor: 'bookedSeats',
      render: (row) => {
        const percent = Math.round(((row.bookedSeats || 0) / (row.totalSeats || 50)) * 100);
        return (
          <div className="w-32">
            <div className="flex justify-between text-[10px] font-bold mb-1">
              <span>{row.bookedSeats || 0} / {row.totalSeats} Seats</span>
              <span className="text-[#0A4D3C]">{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-[#0A4D3C] to-[#D4AF37]"></div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Selling Price',
      accessor: 'sellingPricePKR',
      render: (row) => (
        <div>
          <div className="font-black text-gray-900">{formatMoney(row.sellingPricePKR)}</div>
          <div className="text-[10px] text-gray-500">Cost: {formatMoney(row.costPricePKR)}</div>
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
      {/* Header with Type Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            {activeType === 'Hajj' ? 'Hajj 1447H Quota & Packages' : 'Umrah 2026 Season Packages'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure holy packages with Maktab tent categories, Shifting/Non-Shifting itineraries, courtyard hotels and multi-currency pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setActiveType('Umrah')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeType === 'Umrah' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MoonStar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Umrah Packages</span>
            </button>
            <button
              onClick={() => setActiveType('Hajj')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeType === 'Hajj' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Hajj 1447 Quota</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Create {activeType} Package</span>
          </button>
        </div>
      </div>

      {/* Package Master Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div 
            key={pkg.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Dual Holy Hotel Visual Banner */}
              <div className="relative h-28 rounded-xl overflow-hidden mb-3.5 bg-gray-900 grid grid-cols-2 gap-0.5">
                <div className="relative h-full overflow-hidden group/img">
                  <img
                    src={pkg.makkahHotelImage || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600"}
                    alt={pkg.makkahHotel}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white drop-shadow">
                    Makkah ({pkg.makkahNights}N)
                  </span>
                </div>
                <div className="relative h-full overflow-hidden group/img">
                  <img
                    src={pkg.madinahHotelImage || "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=600"}
                    alt={pkg.madinahHotel}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-amber-300 drop-shadow">
                    Madinah ({pkg.madinahNights}N)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#0A4D3C] border border-[#0A4D3C]/20 uppercase">
                  {pkg.category}
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">
                  {pkg.code}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                {pkg.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {pkg.description || 'Exclusive sacred experience with comprehensive Haramain services.'}
              </p>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-gray-500">Makkah Stay:</span>
                  <strong className="text-right truncate max-w-[180px]">{pkg.makkahHotel} ({pkg.makkahNights}N)</strong>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-gray-500">Madinah Stay:</span>
                  <strong className="text-right truncate max-w-[180px]">{pkg.madinahHotel} ({pkg.madinahNights}N)</strong>
                </div>
                {pkg.type === 'Hajj' && (
                  <div className="flex items-center justify-between text-emerald-800 font-semibold bg-emerald-50/50 p-1.5 rounded">
                    <span>Maktab / Mina:</span>
                    <span>{pkg.maktabNumber} ({pkg.shiftingType})</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-gray-500">Boarding & Meals:</span>
                  <strong>{pkg.foodBoard}</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200">
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Selling Price</span>
                  <div className="text-xl font-black text-gray-900">{formatMoney(pkg.sellingPricePKR)}</div>
                </div>
                <div className="text-right text-[11px] text-emerald-700 font-semibold">
                  Profit: {formatMoney(pkg.sellingPricePKR - pkg.costPricePKR)}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl">
                <span>Booked: <strong>{pkg.bookedSeats || 0} / {pkg.totalSeats} Pax</strong></span>
                <span className="text-emerald-700 font-bold">{pkg.totalSeats - (pkg.bookedSeats || 0)} Seats Available</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Master Table */}
      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
          All {activeType} Inventory Master Table
        </h3>
        <DataTable
          columns={columns}
          data={filteredPackages}
          searchPlaceholder="Search packages by title or category..."
          exportFileName={`harmain_${activeType.toLowerCase()}_packages.csv`}
        />
      </div>

      {/* CREATE PACKAGE MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Create New ${activeType} Package`}
        subtitle="Define accommodations, Maktab details, inclusions and pricing."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Package Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Ramadan 2026 - Last 10 Days Itikaf Luxury"
              className="w-full p-2.5 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Star Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="5-Star Luxury Clock Tower"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value || 14, 10) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Total Quota / Seats</label>
              <input
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value || 50, 10) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Makkah Hotel</label>
              <input
                type="text"
                value={formData.makkahHotel}
                onChange={(e) => setFormData({ ...formData, makkahHotel: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Madinah Hotel</label>
              <input
                type="text"
                value={formData.madinahHotel}
                onChange={(e) => setFormData({ ...formData, madinahHotel: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          {activeType === 'Hajj' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
              <div>
                <label className="block font-bold text-amber-900 mb-1">Maktab Number</label>
                <input
                  type="text"
                  value={formData.maktabNumber}
                  onChange={(e) => setFormData({ ...formData, maktabNumber: e.target.value })}
                  placeholder="Maktab 01 (VIP Zone A)"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">Mina Tent Category</label>
                <input
                  type="text"
                  value={formData.minaTentType}
                  onChange={(e) => setFormData({ ...formData, minaTentType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">Shifting Mode</label>
                <select
                  value={formData.shiftingType}
                  onChange={(e) => setFormData({ ...formData, shiftingType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="Non-Shifting">Non-Shifting (Full Haram)</option>
                  <option value="Shifting">Shifting (Aziziyah + Clock Tower)</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Selling Price Per Pax (PKR) *</label>
              <input
                type="number"
                required
                value={formData.sellingPricePKR}
                onChange={(e) => setFormData({ ...formData, sellingPricePKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Direct Cost Price Per Pax (PKR)</label>
              <input
                type="number"
                value={formData.costPricePKR}
                onChange={(e) => setFormData({ ...formData, costPricePKR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Save Package
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
