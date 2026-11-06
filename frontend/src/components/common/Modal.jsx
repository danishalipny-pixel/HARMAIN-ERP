import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className={`relative w-full ${maxWidth} rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden my-2 sm:my-8 animate-in fade-in zoom-in-95 duration-150`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-4 py-3 sm:px-6 sm:py-4">
          <div className="pr-2">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate" style={{ fontFamily: "'Cinzel', serif" }}>
              {title}
            </h3>
            {subtitle && <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-6 max-h-[82vh] sm:max-h-[76vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
