import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { Layers, Plus, Users, Calendar, Printer, Download, Eye, FileSpreadsheet } from 'lucide-react';

export default function GroupsView() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [manifestData, setManifestData] = useState(null);
  const [showManifestModal, setShowManifestModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    groupCode: '',
    type: 'Umrah',
    caravanLeaderName: '',
    caravanLeaderPhone: '',
    departureDate: '2026-11-20',
    returnDate: '2026-12-04',
    targetPilgrims: 40,
    assignedFlightCode: 'Saudia SV-739 / SV-738',
    makkahHotel: 'Fairmont Makkah Clock Royal Tower',
    madinahHotel: 'The Oberoi Madinah',
    busLeader: 'SAPTCO VIP Special Fleet'
  });

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await api.getGroups();
      if (res.success) setGroups(res.groups);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleOpenManifest = async (group, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.getGroupManifest(group.id);
      if (res.success) {
        setManifestData(res.manifest);
        setShowManifestModal(true);
      }
    } catch (err) {
      alert('Failed to load group manifest: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createGroup(formData);
      setShowAddModal(false);
      loadGroups();
      alert('Group Caravan created!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Caravan Code',
      accessor: 'groupCode',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-[#0A4D3C] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {row.groupCode}
        </span>
      )
    },
    {
      header: 'Caravan Title',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.name}</div>
          <div className="text-[10px] text-gray-500">{row.type} • Origin: {row.originCity}</div>
        </div>
      )
    },
    {
      header: 'Caravan Leader (Ameer)',
      accessor: 'caravanLeaderName',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-800">{row.caravanLeaderName}</div>
          <div className="text-[10px] text-emerald-800 font-mono">{row.caravanLeaderPhone}</div>
        </div>
      )
    },
    {
      header: 'Travel Dates',
      accessor: 'departureDate',
      render: (row) => (
        <div>
          <div className="font-mono text-gray-800">{row.departureDate}</div>
          <div className="text-[10px] text-gray-500 font-mono">Ret: {row.returnDate}</div>
        </div>
      )
    },
    {
      header: 'Confirmed Manifest',
      accessor: 'confirmedPilgrims',
      render: (row) => (
        <span className="font-bold text-gray-900">
          {row.confirmedPilgrims} / {row.targetPilgrims} Pilgrims
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
          {row.status}
        </span>
      )
    },
    {
      header: 'Manifest Action',
      accessor: 'id',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={(e) => handleOpenManifest(row, e)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-lg shadow-2xs transition-all ml-auto"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Manifest</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Groups, Caravans & Departure Manifests
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Organize pilgrimage caravans, assign scholarly leaders (Ameer-e-Caravan), and export official manifests for Saudi Moallim and airlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Form New Caravan</span>
        </button>
      </div>

      {/* Groups Table */}
      <DataTable
        columns={columns}
        data={groups}
        searchPlaceholder="Search caravans by name, code or Ameer..."
        exportFileName="harmain_caravan_groups.csv"
      />

      {/* OFFICIAL MANIFEST MODAL */}
      <Modal
        isOpen={showManifestModal}
        onClose={() => setShowManifestModal(false)}
        title={`Official Passenger Manifest: ${manifestData?.groupCode}`}
        subtitle={`${manifestData?.groupName} • Leader: ${manifestData?.leaderName} (${manifestData?.leaderPhone})`}
        maxWidth="max-w-5xl"
      >
        {manifestData && (
          <div className="space-y-4 text-xs">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-500">Departure:</span> <strong className="text-gray-900">{manifestData.departureDate}</strong> • Flight: <strong>{manifestData.flight}</strong>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A4D3C] text-white rounded-lg font-bold shadow-xs hover:bg-[#063A2D]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Manifest</span>
              </button>
            </div>

            {/* Manifest Table */}
            <div className="border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Passenger Name</th>
                    <th className="p-2.5">Gender</th>
                    <th className="p-2.5">Passport Number</th>
                    <th className="p-2.5">Visa Number</th>
                    <th className="p-2.5">Makkah Rm</th>
                    <th className="p-2.5">Madinah Rm</th>
                    <th className="p-2.5">Emergency Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {manifestData.passengers?.map((pax) => (
                    <tr key={pax.serial} className="hover:bg-gray-50">
                      <td className="p-2.5 font-bold">{pax.serial}</td>
                      <td className="p-2.5 font-bold text-gray-900">
                        {pax.name}
                        {pax.arabicName && <span className="block text-[10px] text-gray-400 font-normal">{pax.arabicName}</span>}
                      </td>
                      <td className="p-2.5">{pax.gender}</td>
                      <td className="p-2.5 font-mono font-bold text-gray-800">{pax.passport}</td>
                      <td className="p-2.5 font-mono text-emerald-800">{pax.visaNumber}</td>
                      <td className="p-2.5 font-mono">{pax.makkahRoom || '1204'}</td>
                      <td className="p-2.5 font-mono">{pax.madinahRoom || '305'}</td>
                      <td className="p-2.5 text-gray-600">{pax.emergencyContact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* NEW GROUP MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Form New Pilgrimage Caravan"
        subtitle="Appoint tour guide, set departure dates and configure quota limits."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Caravan Group Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Al-Khair Executive Umrah Caravan"
              className="w-full p-2.5 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Caravan Leader (Ameer) Name *</label>
              <input
                type="text"
                required
                value={formData.caravanLeaderName}
                onChange={(e) => setFormData({ ...formData, caravanLeaderName: e.target.value })}
                placeholder="Maulana Hafiz Rashid"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Leader Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.caravanLeaderPhone}
                onChange={(e) => setFormData({ ...formData, caravanLeaderPhone: e.target.value })}
                placeholder="+92 300 XXXXXXX"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Departure Date</label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Return Date</label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Save Caravan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
