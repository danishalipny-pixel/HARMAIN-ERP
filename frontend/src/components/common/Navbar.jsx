import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { 
  Bell, Globe, User, LogOut, ChevronDown, Check, ExternalLink, 
  ShieldCheck, Building, Sparkles, Menu 
} from 'lucide-react';

export default function Navbar({ onNavigate, activeTab, notifications = [], unreadCount = 0, onMarkRead, onToggleMobileMenu }) {
  const { user, switchRole, logout } = useAuth();
  const { currency, setCurrency, exchangeRates } = useCurrency();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roles = [
    { name: 'Super Admin', desc: 'Full System Access & Control' },
    { name: 'Branch Manager', desc: 'Branch Sales & Operations' },
    { name: 'Travel Consultant', desc: 'Bookings & Pilgrim Files' },
    { name: 'Visa Officer', desc: 'Embassy & MOFA Pipeline' },
    { name: 'Accountant', desc: 'Finance, P&L & Ledgers' },
    { name: 'Customer', desc: 'Pilgrim Self-Service View' }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-4 md:px-6 shadow-xs">
      {/* Left side info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-1.5 -ml-1 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 md:hidden focus:outline-hidden"
          title="Open Navigation Menu"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5 text-[#0A4D3C]" />
        </button>

        {/* Mobile brand emblem */}
        <div className="flex items-center gap-1.5 md:hidden font-bold text-xs text-[#0A4D3C]">
          <img src="/images/logo_emblem.svg" className="w-5 h-5" alt="Harmain ERP" />
          <span className="tracking-wider">HARMAIN</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8F5F1] border border-[#0A4D3C]/20 text-[#0A4D3C] text-xs font-semibold">
          <Building className="w-3.5 h-3.5 text-[#0A4D3C]" />
          <span>HQ Islamabad / Operations KSA</span>
        </div>
        <div className="text-xs text-gray-500 hidden xl:block">
          DTS Lic: <span className="font-semibold text-gray-700">DTS-ISB-2024-8849</span> • IATA: <span className="font-semibold text-gray-700">PK-2749102</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Customer Self-Service Portal Quick Button */}
        <button
          onClick={() => onNavigate('portal')}
          className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'portal'
              ? 'bg-[#0A4D3C] text-white shadow'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
          title="Open Pilgrim Self-Service Portal"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden sm:inline">Pilgrim Portal</span>
        </button>

        {/* Currency Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
          {['PKR', 'SAR', 'USD'].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-1.5 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-md transition-all ${
                currency === c
                  ? 'bg-[#0A4D3C] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title={`Switch currency to ${c} (1 SAR = ${exchangeRates.SAR} PKR)`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 rounded-xl border border-gray-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#0A4D3C]" />
                  <span>Notifications & Alerts</span>
                </div>
                <button
                  onClick={() => onNavigate('notifications')}
                  className="text-[11px] font-semibold text-[#0A4D3C] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (onMarkRead) onMarkRead(n.id);
                        if (n.link) onNavigate(n.link.replace('/', ''));
                        setShowNotifMenu(false);
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        n.read ? 'bg-gray-50 border-gray-100' : 'bg-emerald-50/50 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="text-gray-900">{n.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          n.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {n.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300/80 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 text-xs font-semibold hover:border-amber-400 transition-colors shadow-2xs"
            title="Switch Testing Persona / Role"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B38F24]" />
            <span className="hidden md:inline font-bold">{user?.role || 'User'}</span>
            <ChevronDown className="w-3 h-3 text-amber-700" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
              <div className="px-2 py-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Select Active User Role
              </div>
              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => {
                      switchRole(r.name);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      user?.role === r.name ? 'bg-[#E8F5F1] text-[#0A4D3C] font-bold' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-[10px] text-gray-400">{r.desc}</div>
                    </div>
                    {user?.role === r.name && <Check className="w-4 h-4 text-[#0A4D3C]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#0A4D3C] text-[#D4AF37] font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-semibold text-gray-800 hidden xl:inline">{user?.name}</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
              <div className="p-2 border-b border-gray-100">
                <div className="font-bold text-xs text-gray-900">{user?.name}</div>
                <div className="text-[11px] text-gray-500">{user?.email}</div>
                <div className="mt-1 text-[10px] font-semibold text-[#0A4D3C] bg-emerald-50 px-2 py-0.5 rounded inline-block">
                  {user?.role}
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg mt-1"
              >
                Agency Settings & Setup
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
