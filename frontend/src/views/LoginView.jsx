import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, Building, Sparkles } from 'lucide-react';

export default function LoginView({ onOpenPortal }) {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('admin@harmain.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = async (roleName) => {
    setLoading(true);
    setError('');
    try {
      await switchRole(roleName);
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA] selection:bg-[#0A4D3C] selection:text-[#D4AF37]">
      {/* Left Brand Showcase Banner */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#063A2D] via-[#0A4D3C] to-[#0E624E] text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Geometric Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="islamic-geom" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,5 75,40 40,75 5,40" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="40" cy="40" r="20" fill="none" stroke="#D4AF37" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-geom)" />
          </svg>
        </div>

        {/* Top Logo */}
        <div className="relative z-10">
          <Logo light={true} size="lg" />
        </div>

        {/* Main Pitch */}
        <div className="relative z-10 my-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise Pilgrimage Management
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
            ONE PLATFORM.<br />
            <span className="text-[#D4AF37]">EVERY JOURNEY.</span>
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-lg leading-relaxed">
            The complete, commercially proven ERP for Hajj & Umrah travel agencies. From pilgrim digital profiles and flight block seat allotments to Makkah/Madinah courtyard hotel allocations, Saudi MOFA visa pipelines, and multi-currency accounting.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>DTS & IATA Compliance</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Multi-Passenger Bookings</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>PKR / SAR / USD Live Ledgers</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Instant PDF Vouchers & Manifests</span>
            </div>
          </div>
        </div>

        {/* Bottom Agency Credentials */}
        <div className="relative z-10 pt-6 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-200">
          <div>
            <span className="block font-semibold text-white">Harmain Travel & Tours Pvt Ltd</span>
            <span>DTS-ISB-2024-8849 • Munazzam MNZ-77192</span>
          </div>
          <button
            onClick={onOpenPortal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold transition-all text-xs"
          >
            <span>Pilgrim Self Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Sign In to HARMAIN ERP
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Enter your employee credentials or select a preconfigured role to launch the workspace.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@harmain.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A4D3C] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A4D3C] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </form>

        {/* Quick Demo Personas */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B38F24]" />
              Quick Persona Switcher (Instant Demo Access)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { role: 'Super Admin', email: 'admin@harmain.com', badge: 'Full Access' },
              { role: 'Branch Manager', email: 'manager@harmain.com', badge: 'Operations' },
              { role: 'Travel Consultant', email: 'consultant@harmain.com', badge: 'Bookings' },
              { role: 'Visa Officer', email: 'visa@harmain.com', badge: 'Embassy' },
              { role: 'Accountant', email: 'finance@harmain.com', badge: 'Finance' },
              { role: 'Customer', email: 'pilgrim@harmain.com', badge: 'Portal' }
            ].map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleQuickRole(p.role)}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:border-[#0A4D3C] hover:bg-emerald-50/50 text-left transition-all group"
              >
                <div className="font-bold text-gray-800 text-[11px] group-hover:text-[#0A4D3C]">
                  {p.role}
                </div>
                <div className="text-[9px] text-[#B38F24] font-semibold mt-0.5">
                  {p.badge}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
