import React, { useState } from 'react';
import Logo from './Logo';
import { 
  LayoutDashboard, Users, CalendarDays, Compass, MoonStar, 
  Plane, Ticket, Hotel, BedDouble, Car, UserCheck, 
  PlaneTakeoff, FileCheck, Layers, Landmark, Calculator, 
  Receipt, CreditCard, Building2, UserPlus, Award, 
  FileText, Globe2, GitBranch, Bell, BarChart3, Settings, 
  ShieldAlert, ChevronRight, ChevronDown, Sparkles, X
} from 'lucide-react';

export default function Sidebar({ activeTab, onNavigate, isMobileOpen, setIsMobileOpen }) {
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (name) => {
    setCollapsedSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const navGroups = [
    {
      title: 'CORE ERP',
      items: [
        { id: 'dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
        { id: 'pilgrims', label: 'Pilgrim Digital Profiles', icon: Users, badge: 'Profiles' },
        { id: 'bookings', label: 'Bookings & Sales', icon: CalendarDays }
      ]
    },
    {
      title: 'HAJJ & UMRAH PACKAGES',
      items: [
        { id: 'packages_hajj', label: 'Hajj Packages', icon: Compass },
        { id: 'packages_umrah', label: 'Umrah Packages', icon: MoonStar },
        { id: 'groups', label: 'Groups & Caravans', icon: Layers, badge: 'Manifest' },
        { id: 'ziyarat', label: 'Holy Ziyarat Tours', icon: Landmark }
      ]
    },
    {
      title: 'AVIATION & TICKETING',
      items: [
        { id: 'flights', label: 'Flight Schedules & Blocks', icon: Plane },
        { id: 'pnrs', label: 'Air Tickets & PNR Tracking', icon: Ticket }
      ]
    },
    {
      title: 'HOTELS & ACCOMMODATION',
      items: [
        { id: 'hotels_makkah', label: 'Makkah Hotels', icon: Hotel },
        { id: 'hotels_madinah', label: 'Madinah Hotels', icon: Hotel },
        { id: 'rooms', label: 'Room Inventory & Beds', icon: BedDouble }
      ]
    },
    {
      title: 'GROUND TRANSPORTATION',
      items: [
        { id: 'vehicles', label: 'Fleet & Vehicles', icon: Car },
        { id: 'drivers', label: 'Chauffeurs & Drivers', icon: UserCheck },
        { id: 'transfers', label: 'Airport Transfers', icon: PlaneTakeoff }
      ]
    },
    {
      title: 'VISA & EMBASSY',
      items: [
        { id: 'visas', label: 'Saudi Visa Pipeline', icon: FileCheck, badge: 'MOFA' }
      ]
    },
    {
      title: 'ACCOUNTS & FINANCE',
      items: [
        { id: 'accounts', label: 'Chart of Accounts & P&L', icon: Calculator },
        { id: 'expenses', label: 'Income & Expenses', icon: Receipt },
        { id: 'payments', label: 'Customer Payments & Receipts', icon: CreditCard },
        { id: 'suppliers', label: 'Supplier Payables', icon: Building2 },
        { id: 'agents', label: 'Sub-Agent Commissions', icon: Award }
      ]
    },
    {
      title: 'DOCUMENTS & PORTAL',
      items: [
        { id: 'documents', label: 'Document & PDF Hub', icon: FileText, badge: 'Print' },
        { id: 'portal', label: 'Customer Self Portal', icon: Sparkles, highlight: true }
      ]
    },
    {
      title: 'ENTERPRISE OPERATIONS',
      items: [
        { id: 'branches', label: 'Multi-Branch Offices', icon: GitBranch },
        { id: 'staff', label: 'Staff & Team Directory', icon: UserPlus },
        { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
        { id: 'reports', label: 'Reports & Intelligence', icon: BarChart3 },
        { id: 'settings', label: 'Agency Settings & DTS', icon: Settings },
        { id: 'audit', label: 'Audit Logs & Backup', icon: ShieldAlert }
      ]
    }
  ];

  const handleSelect = (id) => {
    onNavigate(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0A4D3C] text-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#0E624E] px-5 bg-[#063A2D]">
          <Logo light={true} size="sm" />
          <button
            type="button"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#0E624E] transition-colors"
            title="Close Menu"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group, groupIdx) => {
          const isCollapsed = collapsedSections[group.title];
          return (
            <div key={groupIdx} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleSection(group.title)}
                className="flex w-full items-center justify-between px-3 py-1 text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase select-none hover:text-amber-200"
              >
                <span>{group.title}</span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#D4AF37] text-[#063A2D] font-bold shadow-md'
                            : item.highlight
                            ? 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 font-semibold'
                            : 'text-gray-200 hover:bg-[#0E624E] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform ${
                              isActive ? 'text-[#063A2D]' : 'text-[#D4AF37] group-hover:scale-110'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                              isActive
                                ? 'bg-[#063A2D] text-[#D4AF37]'
                                : 'bg-[#0E624E] text-amber-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="border-t border-[#0E624E] bg-[#063A2D] p-3 text-center text-[10px] text-gray-400">
        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>HARMAIN ERP Enterprise v1.0</span>
        </div>
        <div>All 28 Modules Online • Secure DB Persistence</div>
      </div>
    </aside>
  </>
  );
}
