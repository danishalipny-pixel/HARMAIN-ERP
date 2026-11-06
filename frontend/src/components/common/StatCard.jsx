import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default', badge }) {
  const getGradient = () => {
    switch (variant) {
      case 'emerald':
        return 'from-[#0A4D3C] to-[#063A2D] text-white';
      case 'gold':
        return 'from-[#D4AF37] to-[#B38F24] text-[#063A2D]';
      case 'charcoal':
        return 'from-gray-900 to-gray-800 text-white';
      default:
        return 'bg-white border border-gray-200 text-gray-900';
    }
  };

  const isDark = variant === 'emerald' || variant === 'charcoal';

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 shadow-xs transition-all hover:shadow-md ${
      variant !== 'default' ? `bg-gradient-to-br ${getGradient()}` : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          {title}
        </span>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${
            isDark ? 'bg-white/10 text-[#D4AF37]' : variant === 'gold' ? 'bg-black/10 text-gray-900' : 'bg-emerald-50 text-[#0A4D3C]'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h4 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {value}
        </h4>
        {badge && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            isDark ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 font-bold ${
              trend >= 0 ? (isDark ? 'text-emerald-300' : 'text-emerald-600') : 'text-rose-500'
            }`}>
              {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(trend)}%
            </span>
          )}
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
