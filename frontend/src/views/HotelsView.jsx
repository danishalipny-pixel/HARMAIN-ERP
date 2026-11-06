import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import HotelGalleryModal from '../components/common/HotelGalleryModal';
import { Hotel, MapPin, Phone, Mail, Plus, Star, BedDouble, Images, Eye, Sparkles } from 'lucide-react';

export default function HotelsView({ defaultCity = 'Makkah' }) {
  const { formatMoney } = useCurrency();
  const [activeCity, setActiveCity] = useState(defaultCity); // 'Makkah' or 'Madinah'
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGalleryHotel, setSelectedGalleryHotel] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    city: defaultCity,
    starRating: 5,
    courtyardDistanceMeters: 0,
    locationDescription: '',
    contactPerson: '',
    phone: '',
    email: '',
    contractType: 'Master Allotment',
    totalContractedRooms: 30,
    rates: {
      standardSAR: 950,
      haramViewSAR: 1400,
      ramadanSAR: 3200
    }
  });

  const loadHotels = async () => {
    setLoading(true);
    try {
      const res = await api.getHotels();
      if (res.success) setHotels(res.hotels);
    } catch (err) {
      console.error('Failed to load hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    setActiveCity(defaultCity);
  }, [defaultCity]);

  const filteredHotels = hotels.filter(h => h.city && h.city.toLowerCase() === activeCity.toLowerCase());

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createHotel({ ...formData, city: activeCity });
      setShowAddModal(false);
      loadHotels();
      alert(`Hotel added to ${activeCity} directory!`);
    } catch (err) {
      alert('Creation failed: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Hotel & Property',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.coverImage || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=150"}
            alt={row.name}
            className="w-12 h-12 rounded-xl object-cover border border-[#0A4D3C]/20 shadow-2xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedGalleryHotel(row)}
            title="Click to view image gallery"
          />
          <div>
            <div
              className="font-bold text-gray-900 hover:text-[#0A4D3C] cursor-pointer"
              onClick={() => setSelectedGalleryHotel(row)}
            >
              {row.name}
            </div>
            <div className="text-[10px] text-gray-500 line-clamp-1">{row.locationDescription}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Courtyard Proximity',
      accessor: 'courtyardDistanceMeters',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          row.courtyardDistanceMeters === 0
            ? 'bg-emerald-100 text-[#0A4D3C] border border-[#0A4D3C]/30'
            : 'bg-amber-100 text-amber-900'
        }`}>
          {row.courtyardDistanceMeters === 0 ? '0m Courtyard Front' : `${row.courtyardDistanceMeters}m from Haram`}
        </span>
      )
    },
    {
      header: 'Contract Rooms',
      accessor: 'totalContractedRooms',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.allocatedRooms || 0} / {row.totalContractedRooms} Rooms</div>
          <div className="text-[10px] text-gray-500">{row.contractType}</div>
        </div>
      )
    },
    {
      header: 'Contract Rates (SAR)',
      accessor: (row) => row.rates?.standardSAR,
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">SAR {row.rates?.standardSAR || 0} / night</div>
          <div className="text-[10px] text-amber-800">Ramadan: SAR {row.rates?.ramadanSAR || 0}</div>
        </div>
      )
    },
    {
      header: 'Image Gallery & Tour',
      accessor: 'id',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={() => setSelectedGalleryHotel(row)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#0A4D3C]/30 bg-emerald-50 text-[#0A4D3C] hover:bg-[#0A4D3C] hover:text-white transition-all text-xs font-bold shadow-2xs ml-auto"
          title="Open interactive photo tour and room configurations"
        >
          <Images className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Photos ({row.gallery?.length || 8})</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            {activeCity} Hotel Contracts & Hospitality
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Master room allotments, courtyard proximity measurements, corporate rates, and hotel management contacts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setActiveCity('Makkah')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCity === 'Makkah' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              Makkah Hotels
            </button>
            <button
              onClick={() => setActiveCity('Madinah')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCity === 'Madinah' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              Madinah Hotels
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Add Hotel</span>
          </button>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map(h => (
          <div key={h.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              {/* Hotel Cover Image with distance badge & stars */}
              <div
                className="relative aspect-16/10 bg-gray-900 overflow-hidden cursor-pointer"
                onClick={() => setSelectedGalleryHotel(h)}
              >
                <img
                  src={h.coverImage || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800"}
                  alt={h.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md ${
                    h.courtyardDistanceMeters === 0 ? 'bg-[#0A4D3C] text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {h.courtyardDistanceMeters === 0 ? '0m Courtyard Front' : `${h.courtyardDistanceMeters}m to Courtyard`}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center bg-black/50 backdrop-blur-xs px-2 py-1 rounded-lg text-amber-400">
                  {[...Array(h.starRating || 5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>

                <div className="absolute bottom-3 inset-x-3 text-white flex items-center justify-between">
                  <span className="text-xs font-bold drop-shadow flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{h.gallery?.length || 8} Photos Gallery</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-300 drop-shadow">
                    {h.roomCategories?.length || 3} Room Categories
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5">
                <h3
                  className="text-base font-extrabold text-gray-900 group-hover:text-[#0A4D3C] transition-colors cursor-pointer"
                  onClick={() => setSelectedGalleryHotel(h)}
                >
                  {h.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{h.locationDescription}</p>

                {/* Gallery Preview Thumbnails */}
                {h.gallery?.length > 0 && (
                  <div className="grid grid-cols-4 gap-1.5 my-3.5">
                    {h.gallery.slice(0, 4).map((g, gIdx) => (
                      <div
                        key={gIdx}
                        onClick={() => setSelectedGalleryHotel(h)}
                        className="relative aspect-4/3 rounded-lg overflow-hidden bg-gray-100 cursor-pointer border border-gray-200 hover:opacity-90"
                        title={g.title}
                      >
                        <img src={g.url} alt={g.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 truncate">
                          {g.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Contracted Allotment:</span>
                    <strong className="text-gray-900">{h.allocatedRooms || 0} / {h.totalContractedRooms} Rooms</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Standard Rate:</span>
                    <strong className="text-emerald-800 font-bold">SAR {h.rates?.standardSAR} / Night</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Ramadan Special:</span>
                    <strong className="text-amber-800 font-bold">SAR {h.rates?.ramadanSAR} / Night</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setSelectedGalleryHotel(h)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-[#0A4D3C] hover:to-[#063A2D] text-[#0A4D3C] hover:text-white border border-[#0A4D3C]/30 text-xs font-bold transition-all shadow-2xs group/btn"
              >
                <Images className="w-4 h-4 text-[#D4AF37]" />
                <span>View Full Photo Tour & Room Styles</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hotel Directory Table */}
      <DataTable
        columns={columns}
        data={filteredHotels}
        searchPlaceholder={`Search ${activeCity} hotels...`}
        exportFileName={`harmain_${activeCity.toLowerCase()}_hotels.csv`}
      />

      {/* HOTEL IMAGE GALLERY MODAL */}
      <HotelGalleryModal
        isOpen={!!selectedGalleryHotel}
        onClose={() => setSelectedGalleryHotel(null)}
        hotel={selectedGalleryHotel}
      />

      {/* ADD HOTEL MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Register New ${activeCity} Hotel`}
        subtitle="Contracted room blocks, amenities, distance to Haram and contact details."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Hotel Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Swissôtel Al Maqam Makkah"
              className="w-full p-2.5 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Courtyard Distance (Meters)</label>
              <input
                type="number"
                value={formData.courtyardDistanceMeters}
                onChange={(e) => setFormData({ ...formData, courtyardDistanceMeters: parseInt(e.target.value || 0, 10) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Total Contracted Rooms</label>
              <input
                type="number"
                value={formData.totalContractedRooms}
                onChange={(e) => setFormData({ ...formData, totalContractedRooms: parseInt(e.target.value || 20, 10) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Standard Rate (SAR / Night)</label>
              <input
                type="number"
                value={formData.rates.standardSAR}
                onChange={(e) => setFormData({ ...formData, rates: { ...formData.rates, standardSAR: parseFloat(e.target.value || 0) } })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Ramadan Rate (SAR / Night)</label>
              <input
                type="number"
                value={formData.rates.ramadanSAR}
                onChange={(e) => setFormData({ ...formData, rates: { ...formData.rates, ramadanSAR: parseFloat(e.target.value || 0) } })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-amber-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Director of Sales Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Hotel Direct Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+966 12 XXXXXXX"
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
              Confirm Hotel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
