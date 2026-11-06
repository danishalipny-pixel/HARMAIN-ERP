import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BedDouble, Eye, Star, MapPin, Building, Sparkles } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export default function HotelGalleryModal({ isOpen, onClose, hotel }) {
  const { formatMoney } = useCurrency();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showRoomCategories, setShowRoomCategories] = useState(false);

  if (!isOpen || !hotel) return null;

  const gallery = hotel.gallery || [];
  const roomCategories = hotel.roomCategories || [];

  const categories = ['All', ...new Set(gallery.map(g => g.category || 'General'))];

  const filteredImages = activeCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category === activeCategory);

  const currentImage = filteredImages[selectedImageIndex] || filteredImages[0] || {
    url: hotel.coverImage || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80',
    title: hotel.name,
    category: 'Exterior',
    description: hotel.locationDescription
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const handlePrev = () => {
    setSelectedImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden my-2 sm:my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                hotel.courtyardDistanceMeters === 0 ? 'bg-emerald-100 text-[#0A4D3C]' : 'bg-amber-100 text-amber-900'
              }`}>
                {hotel.courtyardDistanceMeters === 0 ? '0m Courtyard Front' : `${hotel.courtyardDistanceMeters}m to Haram`}
              </span>
              <div className="flex items-center text-amber-500">
                {[...Array(hotel.starRating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 mt-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
              {hotel.name} — Visual Tour & Gallery
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0A4D3C]" />
              <span>{hotel.city} • {hotel.locationDescription}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            aria-label="Close Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto shrink-0 text-xs">
          <div className="flex items-center gap-1.5 flex-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedImageIndex(0);
                  setShowRoomCategories(false);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  !showRoomCategories && activeCategory === cat
                    ? 'bg-[#0A4D3C] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {roomCategories.length > 0 && (
            <button
              onClick={() => setShowRoomCategories(!showRoomCategories)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                showRoomCategories
                  ? 'bg-[#D4AF37] text-[#063A2D] shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Room Categories ({roomCategories.length})</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!showRoomCategories ? (
            <>
              {/* Main Active Photo Container */}
              <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-16/9 sm:aspect-21/9 max-h-[460px] flex items-center justify-center group shadow-inner">
                <img
                  src={currentImage.url}
                  alt={currentImage.title || hotel.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />

                {/* Left / Right arrows */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-lg"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all shadow-lg"
                      title="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Bottom Overlay Info Banner */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#063A2D] uppercase tracking-wider">
                        {currentImage.category || 'Featured'}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold mt-1">{currentImage.title}</h4>
                      {currentImage.description && (
                        <p className="text-xs text-gray-200 mt-0.5 line-clamp-2 max-w-2xl">{currentImage.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-mono text-gray-300 shrink-0 ml-3">
                      {selectedImageIndex + 1} / {filteredImages.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {filteredImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                  {filteredImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#D4AF37] scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Room Categories Grid View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Room Categories & Bedding Configurations</h4>
                  <p className="text-xs text-gray-500">Contracted room styles, capacity allowances and holy sanctuary views.</p>
                </div>
                <button
                  onClick={() => setShowRoomCategories(false)}
                  className="text-xs font-bold text-[#0A4D3C] hover:underline"
                >
                  Back to Full Hotel Photos
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomCategories.map((rm, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                    <div className="relative aspect-16/10 bg-gray-200">
                      <img src={rm.image} alt={rm.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A4D3C] text-white shadow-xs">
                        {rm.view}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{rm.name}</h5>
                        <div className="text-gray-500 mt-1 flex items-center justify-between">
                          <span>Configuration:</span>
                          <strong className="text-gray-800">{rm.bedType}</strong>
                        </div>
                        <div className="text-gray-500 flex items-center justify-between">
                          <span>Standard Capacity:</span>
                          <strong className="text-gray-800">{rm.capacity} Adults</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-gray-500 font-semibold">Contract Rate:</span>
                        <strong className="text-emerald-800 font-bold text-sm">SAR {rm.rateSAR} / night</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
