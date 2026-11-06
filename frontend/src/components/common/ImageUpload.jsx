import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

export default function ImageUpload({ value, onChange, label = 'Photo / Document Scan', gender = 'Male', defaultPlaceholder = '' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || defaultPlaceholder || (gender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg'));
  const fileInputRef = useRef(null);

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        setPreview(res.url);
        if (onChange) onChange(res.url);
      } else {
        // Fallback to base64 if needed
        const reader = new FileReader();
        reader.onloadend = () => {
          if (onChange) onChange(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Direct upload fallback to base64:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onChange) onChange(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectPreset = (url) => {
    setPreview(url);
    if (onChange) onChange(url);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block font-bold text-gray-700 text-xs mb-1">{label}</label>}
      <div className="flex items-center gap-4">
        {/* Preview Container */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-300 overflow-hidden shrink-0 bg-gray-100 shadow-2xs group">
          <img
            src={preview || (gender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg')}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = gender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg';
            }}
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-[#D4AF37] rounded-full animate-spin"></div>
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 md:opacity-0 transition-opacity flex items-center justify-center text-white"
            title="Change photo"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="space-y-1.5 flex-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelected}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{uploading ? 'Uploading...' : 'Upload Image / Camera'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-0.5">
            <span>Or use default:</span>
            <button
              type="button"
              onClick={() => handleSelectPreset('/images/avatar_male.svg')}
              className="text-[#0A4D3C] hover:underline font-semibold"
            >
              Male Avatar
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleSelectPreset('/images/avatar_female.svg')}
              className="text-[#0A4D3C] hover:underline font-semibold"
            >
              Female Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
