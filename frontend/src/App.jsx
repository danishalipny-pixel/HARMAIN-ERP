import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

// Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Views
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import PilgrimsView from './views/PilgrimsView';
import BookingsView from './views/BookingsView';
import PackagesView from './views/PackagesView';
import AviationView from './views/AviationView';
import HotelsView from './views/HotelsView';
import RoomInventoryView from './views/RoomInventoryView';
import TransportView from './views/TransportView';
import VisasView from './views/VisasView';
import GroupsView from './views/GroupsView';
import ZiyaratView from './views/ZiyaratView';
import FinanceView from './views/FinanceView';
import DocumentsView from './views/DocumentsView';
import CustomerPortalView from './views/CustomerPortalView';
import EnterpriseView from './views/EnterpriseView';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPublicPortalMode, setIsPublicPortalMode] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifs();
    }
  }, [isAuthenticated, activeTab]);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifs();
    } catch (e) {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A4D3C] border-t-[#D4AF37]"></div>
          <span className="text-xs font-bold text-gray-700 tracking-wider">HARMAIN ERP STARTING UP...</span>
        </div>
      </div>
    );
  }

  // If public portal mode clicked from login screen
  if (isPublicPortalMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-gray-500">Public Access Mode</span>
            <button
              onClick={() => setIsPublicPortalMode(false)}
              className="px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl transition-all shadow"
            >
              Back to Employee Sign In
            </button>
          </div>
          <CustomerPortalView onBackToErp={() => setIsPublicPortalMode(false)} />
        </div>
      </div>
    );
  }

  // If not authenticated, render LoginView
  if (!isAuthenticated) {
    return <LoginView onOpenPortal={() => setIsPublicPortalMode(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-gray-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Workspace Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={handleMarkRead}
          onToggleMobileMenu={() => setIsMobileOpen(prev => !prev)}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
            {activeTab === 'pilgrims' && <PilgrimsView />}
            {activeTab === 'bookings' && <BookingsView />}
            {activeTab === 'packages_hajj' && <PackagesView defaultType="Hajj" />}
            {activeTab === 'packages_umrah' && <PackagesView defaultType="Umrah" />}
            {activeTab === 'flights' && <AviationView defaultSubTab="flights" />}
            {activeTab === 'pnrs' && <AviationView defaultSubTab="pnrs" />}
            {activeTab === 'hotels_makkah' && <HotelsView defaultCity="Makkah" />}
            {activeTab === 'hotels_madinah' && <HotelsView defaultCity="Madinah" />}
            {activeTab === 'rooms' && <RoomInventoryView />}
            {activeTab === 'vehicles' && <TransportView defaultSubTab="vehicles" />}
            {activeTab === 'drivers' && <TransportView defaultSubTab="drivers" />}
            {activeTab === 'transfers' && <TransportView defaultSubTab="transfers" />}
            {activeTab === 'visas' && <VisasView />}
            {activeTab === 'groups' && <GroupsView />}
            {activeTab === 'ziyarat' && <ZiyaratView />}
            {activeTab === 'accounts' && <FinanceView defaultSubTab="profit_loss" />}
            {activeTab === 'expenses' && <FinanceView defaultSubTab="expenses" />}
            {activeTab === 'payments' && <FinanceView defaultSubTab="payments" />}
            {activeTab === 'suppliers' && <FinanceView defaultSubTab="suppliers" />}
            {activeTab === 'agents' && <FinanceView defaultSubTab="agents" />}
            {activeTab === 'documents' && <DocumentsView />}
            {activeTab === 'portal' && <CustomerPortalView onBackToErp={() => setActiveTab('dashboard')} />}
            {activeTab === 'branches' && <EnterpriseView defaultSubTab="branches" />}
            {activeTab === 'staff' && <EnterpriseView defaultSubTab="staff" />}
            {activeTab === 'notifications' && <EnterpriseView defaultSubTab="notifications" />}
            {activeTab === 'reports' && <EnterpriseView defaultSubTab="reports" />}
            {activeTab === 'settings' && <EnterpriseView defaultSubTab="settings" />}
            {activeTab === 'audit' && <EnterpriseView defaultSubTab="audit" />}
          </div>
        </main>
      </div>
    </div>
  );
}
