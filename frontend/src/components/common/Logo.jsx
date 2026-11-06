import React from 'react';

export default function Logo({ size = 'default', showTagline = true, light = false }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconSize = isSmall ? 28 : isLarge ? 56 : 38;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* SVG Emblem */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0A4D3C] via-[#0E624E] to-[#063A2D] p-1.5 shadow-md border border-[#D4AF37]/40"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
          {/* Islamic Hexagonal Star Motif */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#D4AF37" strokeWidth="2.5" opacity="0.8" />
          <polygon points="50,14 81,32 81,68 50,86 19,68 19,32" fill="none" stroke="#D4AF37" strokeWidth="1.8" />
          {/* Central Sacred Kaaba Symbol in Gold & Obsidian */}
          <rect x="36" y="36" width="28" height="28" rx="2" fill="#111827" stroke="#D4AF37" strokeWidth="2" />
          {/* Gold Kiswah Belt */}
          <line x1="36" y1="44" x2="64" y2="44" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          {/* Crescent Accent */}
          <path d="M50 20 A6 6 0 0 1 54 26 A6 6 0 0 1 48 30 A5 5 0 0 0 50 20 Z" fill="#D4AF37" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-extrabold tracking-wider ${
              isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl'
            } ${light ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: "'Cinzel', 'Plus Jakarta Sans', serif", letterSpacing: '0.08em' }}
          >
            HARMAIN
          </span>
          <span className="font-black px-1.5 py-0.5 rounded text-xs bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#063A2D] shadow-sm tracking-wide">
            ERP
          </span>
        </div>
        {showTagline && (
          <span 
            className={`text-[9.5px] font-semibold tracking-widest uppercase ${
              light ? 'text-[#D4AF37]' : 'text-[#0A4D3C]'
            }`}
            style={{ letterSpacing: '0.14em' }}
          >
            ONE PLATFORM. EVERY JOURNEY.
          </span>
        )}
      </div>
    </div>
  );
}
