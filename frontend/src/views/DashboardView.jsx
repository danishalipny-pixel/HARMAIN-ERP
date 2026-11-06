import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import StatCard from '../components/common/StatCard';
import { 
  DollarSign, TrendingUp, Users, CalendarDays, FileCheck, 
  Hotel, Plane, Plus, CreditCard, Layers, ArrowUpRight, 
  Clock, ShieldCheck, AlertTriangle, Sparkles, Building
} from 'lucide-react';

export default function DashboardView({ onNavigate, onOpenNewBooking, onOpenNewPilgrim, onOpenPaymentModal }) {
  const { formatMoney, currency, exchangeRates } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.getDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A4D3C] border-t-[#D4AF37]"></div>
          <span className="text-xs font-semibold text-gray-500">Loading Harmain Business Intelligence...</span>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const roomStats = data?.roomStats || {};
  const recentBookings = data?.recentBookings || [];
  const upcomingFlights = data?.upcomingFlights || [];
  const activeGroups = data?.activeGroups || [];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-white via-emerald-50/30 to-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
              Enterprise Overview & Intelligence
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5F1] text-[#0A4D3C] border border-[#0A4D3C]/30 uppercase">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time financial reconciliation, pilgrim status tracking and logistics monitoring across Makkah, Madinah & Pakistan branches.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('bookings')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>New Booking</span>
          </button>
          <button
            onClick={() => onNavigate('pilgrims')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#0A4D3C] border border-[#0A4D3C]/30 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-[#0A4D3C]" />
            <span>Add Pilgrim</span>
          </button>
          <button
            onClick={() => onNavigate('payments')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={() => onNavigate('groups')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-gray-500" />
            <span>Passenger Manifest</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={formatMoney(kpis.totalRevenuePKR)}
          subtitle={`Converted to ${currency} (Live Rate)`}
          icon={DollarSign}
          variant="emerald"
          badge="+18.4% YoY"
        />
        <StatCard
          title="Actual Gross Profit"
          value={formatMoney(kpis.grossProfitPKR)}
          subtitle="Net of Direct Airlines & Hotels Cost"
          icon={TrendingUp}
          variant="gold"
          trend={22.2}
        />
        <StatCard
          title="Registered Pilgrims"
          value={kpis.totalPilgrimsCount || 0}
          subtitle={`${kpis.activeBookingsCount || 0} Confirmed Travel Groups`}
          icon={Users}
          badge="Active"
        />
        <StatCard
          title="Outstanding Receivables"
          value={formatMoney(kpis.totalOutstandingReceivablesPKR)}
          subtitle={`Collected: ${formatMoney(kpis.totalReceivedPKR)}`}
          icon={CreditCard}
          variant={kpis.totalOutstandingReceivablesPKR > 0 ? 'default' : 'emerald'}
        />
      </div>

      {/* Secondary Operational Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Visas In-Process</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-1">{kpis.visasInProcessCount || 0}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">{kpis.visasDeliveredCount || 0} Delivered to Pilgrims</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Room Utilization</span>
            <Hotel className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-1">{roomStats.roomOccupancyRate || 83}%</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{roomStats.totalAllocatedRooms || 0} of {roomStats.totalContractedRooms || 0} Rooms</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Active Packages</span>
            <Sparkles className="w-4 h-4 text-[#0A4D3C]" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-1">{kpis.totalPackagesCount || 0}</div>
          <div className="text-[11px] text-[#0A4D3C] font-semibold mt-0.5">Hajj 1447 & Umrah 2026</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Net Profit Margin</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-1">{kpis.netProfitMargin || 0}%</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Net: {formatMoney(kpis.netProfitPKR)}</div>
        </div>
      </div>

      {/* Middle Row: Revenue Trends & Upcoming Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Revenue & Profit Trajectory
              </h3>
              <p className="text-xs text-gray-500">Monthly pilgrimage sales comparison (Hajj vs Umrah)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A4D3C]"></span> Umrah Revenue
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span> Hajj Quota
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end gap-3 pt-6 border-b border-gray-200 pb-2">
            {(data?.monthlySales || []).map((m, idx) => {
              const maxVal = 9000000;
              const umrahH = Math.max(12, Math.round((m.umrah / maxVal) * 100));
              const hajjH = Math.max(8, Math.round((m.hajj / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    {/* Umrah Bar */}
                    <div 
                      style={{ height: `${umrahH}%` }} 
                      className="w-full max-w-[20px] rounded-t-md bg-[#0A4D3C] group-hover:bg-[#063A2D] transition-all relative"
                      title={`Umrah: ${formatMoney(m.umrah)}`}
                    ></div>
                    {/* Hajj Bar */}
                    <div 
                      style={{ height: `${hajjH}%` }} 
                      className="w-full max-w-[20px] rounded-t-md bg-[#D4AF37] group-hover:bg-[#B38F24] transition-all relative"
                      title={`Hajj: ${formatMoney(m.hajj)}`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{m.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Audited Accounting Currency: <strong className="text-gray-800">PKR (Base)</strong></span>
            <button
              onClick={() => onNavigate('accounts')}
              className="text-[#0A4D3C] font-bold hover:underline flex items-center gap-1"
            >
              <span>View Full General Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Upcoming Flight Schedules & Blocks (1 Col) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-[#0A4D3C]" />
                Upcoming Flights
              </h3>
              <button
                onClick={() => onNavigate('flights')}
                className="text-[11px] text-[#0A4D3C] font-bold hover:underline"
              >
                All Flights
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Confirmed block allocations & passenger departures</p>

            <div className="space-y-3">
              {upcomingFlights.map((flt) => (
                <div key={flt.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span className="text-emerald-800">{flt.flightNumber} ({flt.airlineCode})</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {flt.confirmedSeats} / {flt.totalBlockSeats} Pax
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1 flex items-center justify-between">
                    <span>{flt.originAirport.split('(')[0]} ➔ {flt.destinationAirport.split('(')[0]}</span>
                    <span className="font-mono text-gray-500">{flt.departureDateTime.split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Seat Block Utilization:</span>
            <span className="font-bold text-[#0A4D3C]">82.5% Confirmed</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Bookings & Caravans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Recent Pilgrim Bookings
              </h3>
              <p className="text-xs text-gray-500">Latest reservations and multi-passenger files</p>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="text-xs font-bold text-[#0A4D3C] hover:underline"
            >
              View All Bookings
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 font-bold text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Booking Ref</th>
                  <th className="p-2.5">Lead Pilgrim</th>
                  <th className="p-2.5">Package</th>
                  <th className="p-2.5">Pax</th>
                  <th className="p-2.5">Total Price</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-[#0A4D3C]">{b.bookingNumber}</td>
                    <td className="p-2.5 font-semibold text-gray-900">{b.customerName}</td>
                    <td className="p-2.5 text-gray-600 truncate max-w-[160px]">{b.packageName}</td>
                    <td className="p-2.5 font-bold">{b.paxCount}</td>
                    <td className="p-2.5 font-bold text-gray-900">
                      {formatMoney(b.financials ? b.financials.totalSellingPrice : 0)}
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.paymentStatus === 'Fully Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Caravans & Groups (1 Col) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              Active Caravans
            </h3>
            <button
              onClick={() => onNavigate('groups')}
              className="text-[11px] text-[#0A4D3C] font-bold hover:underline"
            >
              All Caravans
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">Moallim groups, departures and assigned guides</p>

          <div className="space-y-3">
            {activeGroups.map((g) => (
              <div key={g.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900">{g.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-[#0A4D3C] font-bold">
                    {g.status}
                  </span>
                </div>
                <div className="text-gray-600 text-[11px]">
                  Caravan Leader: <strong className="text-gray-800">{g.caravanLeaderName}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Dep: {g.departureDate}</span>
                  <span>{g.confirmedPilgrims} / {g.targetPilgrims} Pilgrims</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
