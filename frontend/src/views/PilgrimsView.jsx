import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import PrintableDocumentModal from '../components/common/PrintableDocumentModal';
import ImageUpload from '../components/common/ImageUpload';
import { 
  Users, Plus, CreditCard, Hotel, Plane, FileCheck, 
  Printer, Eye, Edit3, Trash2, ShieldCheck, HeartPulse, 
  MapPin, Phone, Mail, QrCode, Camera
} from 'lucide-react';

export default function PilgrimsView() {
  const [pilgrims, setPilgrims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPilgrim, setSelectedPilgrim] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('personal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [cardDocData, setCardDocData] = useState(null);

  // New pilgrim form state
  const [formData, setFormData] = useState({
    fullName: '',
    arabicName: '',
    gender: 'Male',
    dateOfBirth: '',
    age: '',
    bloodGroup: 'B+',
    cnicOrNationalId: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuingCountry: 'Pakistan',
    phone: '',
    whatsapp: '',
    email: '',
    city: 'Islamabad',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    relationshipWithMahram: 'Self',
    mahramName: '',
    packageName: 'Ramadan 2026 - Last 10 Days Itikaf Luxury',
    makkahHotel: 'Fairmont Makkah Clock Royal Tower',
    makkahRoomNo: '1204',
    madinahHotel: 'The Oberoi Madinah',
    madinahRoomNo: '305',
    flightNumber: 'SV-739 (Departure) / SV-738 (Return)',
    pnrCode: 'SV79KX',
    medicalNotes: '',
    photoUrl: '/images/avatar_male.svg'
  });

  const handleUpdatePhoto = async (newUrl) => {
    if (!selectedPilgrim) return;
    try {
      const updated = { ...selectedPilgrim, photoUrl: newUrl };
      const res = await api.updatePilgrim(selectedPilgrim.id, updated);
      if (res.success) {
        setSelectedPilgrim(res.pilgrim || updated);
        loadPilgrims();
      }
    } catch (err) {
      console.error('Failed to update photo:', err);
    }
  };

  const loadPilgrims = async () => {
    setLoading(true);
    try {
      const res = await api.getPilgrims();
      if (res.success) {
        setPilgrims(res.pilgrims);
      }
    } catch (err) {
      console.error('Failed to load pilgrims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPilgrims();
  }, []);

  const handleRowClick = async (pilgrim) => {
    try {
      const res = await api.getPilgrim(pilgrim.id);
      if (res.success) {
        setSelectedPilgrim(res.pilgrim);
        setActiveProfileTab('personal');
      }
    } catch (err) {
      setSelectedPilgrim(pilgrim);
    }
  };

  const handlePrintCard = async (pilgrim, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.getPilgrimCard(pilgrim.id);
      if (res.success) {
        setCardDocData(res.cardData);
        setShowPrintModal(true);
      }
    } catch (err) {
      alert('Failed to load pilgrim card');
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this pilgrim record?')) return;
    try {
      await api.deletePilgrim(id);
      loadPilgrims();
      if (selectedPilgrim?.id === id) setSelectedPilgrim(null);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPilgrim(formData);
      setShowAddModal(false);
      loadPilgrims();
      alert('Pilgrim profile created successfully!');
    } catch (err) {
      alert('Creation failed: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Pilgrim',
      accessor: 'fullName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.photoUrl || (row.gender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg')}
            alt={row.fullName}
            onError={(e) => {
              e.target.src = row.gender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg';
            }}
            className="w-9 h-9 rounded-full object-cover border border-[#0A4D3C]/30 shadow-2xs"
          />
          <div>
            <div className="font-bold text-gray-900">{row.fullName}</div>
            <div className="text-[10px] text-gray-500 font-mono">{row.pilgrimCode}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Passport / CNIC',
      accessor: 'passportNumber',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-gray-800">{row.passportNumber}</div>
          <div className="text-[10px] text-gray-500">{row.cnicOrNationalId || 'CNIC on file'}</div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: 'phone',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-800">{row.phone}</div>
          <div className="text-[10px] text-gray-500">{row.city}, {row.country}</div>
        </div>
      )
    },
    {
      header: 'Package & Hotels',
      accessor: 'packageName',
      render: (row) => (
        <div className="max-w-[180px] truncate">
          <div className="font-medium text-gray-900 truncate">{row.packageName || 'Custom Package'}</div>
          <div className="text-[10px] text-emerald-800 font-semibold truncate">
            {row.makkahHotel ? `Makkah: ${row.makkahHotel.split(' ')[0]}` : ''}
          </div>
        </div>
      )
    },
    {
      header: 'Visa Status',
      accessor: 'visaStatus',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          row.visaStatus?.includes('Active') || row.visaStatus?.includes('Delivered')
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-amber-100 text-amber-800'
        }`}>
          {row.visaStatus || 'In Process'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleRowClick(row)}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#0A4D3C] hover:text-white transition-all shadow-2xs"
            title="View Full Digital Profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handlePrintCard(row, e)}
            className="p-1.5 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-all shadow-2xs"
            title="Print Pilgrim ID Card"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handleDelete(row.id, e)}
            className="p-1.5 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 transition-all"
            title="Delete Pilgrim"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
            Pilgrim Digital Profiles
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Complete individual digital identity, biometric tracking, Mahram relationships, and Saudi accommodation records.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Register New Pilgrim</span>
        </button>
      </div>

      {/* Pilgrims Table */}
      <DataTable
        columns={columns}
        data={pilgrims}
        searchPlaceholder="Search by Name, Passport, CNIC, Phone or Pilgrim ID..."
        filterField="status"
        filterOptions={['Confirmed', 'Active', 'Visa In-Progress']}
        onRowClick={handleRowClick}
        exportFileName="harmain_pilgrims_master.csv"
      />

      {/* FULL DIGITAL PROFILE MODAL */}
      <Modal
        isOpen={!!selectedPilgrim}
        onClose={() => setSelectedPilgrim(null)}
        title={selectedPilgrim?.fullName || 'Pilgrim Profile'}
        subtitle={`Pilgrim ID: ${selectedPilgrim?.pilgrimCode || selectedPilgrim?.id} • Passport: ${selectedPilgrim?.passportNumber}`}
        maxWidth="max-w-4xl"
      >
        {selectedPilgrim && (
          <div className="space-y-6">
            {/* Top Pilgrim Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img
                    src={selectedPilgrim.photoUrl || (selectedPilgrim.gender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg')}
                    alt={selectedPilgrim.fullName}
                    onError={(e) => {
                      e.target.src = selectedPilgrim.gender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg';
                    }}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md"
                  />
                  <label className="text-[10px] text-[#0A4D3C] hover:underline cursor-pointer font-bold flex items-center gap-1 mt-1">
                    <Camera className="w-3 h-3" />
                    <span>Update Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const res = await api.uploadFile(file);
                          if (res.success && res.url) {
                            handleUpdatePhoto(res.url);
                          }
                        } catch (err) {
                          console.error('Upload failed:', err);
                        }
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedPilgrim.fullName}</h3>
                  {selectedPilgrim.arabicName && (
                    <div className="text-xs font-bold text-[#0A4D3C]">{selectedPilgrim.arabicName}</div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <span>{selectedPilgrim.gender}</span> • <span>{selectedPilgrim.age || 55} Years</span> • <span>Blood: <strong className="text-red-700">{selectedPilgrim.bloodGroup || 'B+'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePrintCard(selectedPilgrim, e)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Print ID Card</span>
                </button>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-gray-200 gap-4 text-xs font-bold">
              {[
                { id: 'personal', label: 'Personal & Mahram', icon: Users },
                { id: 'passport', label: 'Passport & Visa Record', icon: FileCheck },
                { id: 'accommodations', label: 'Flights & Hotel Rooms', icon: Hotel },
                { id: 'payments', label: 'Payments & Ledger', icon: CreditCard }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeProfileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id)}
                    className={`flex items-center gap-1.5 pb-2.5 border-b-2 transition-all ${
                      isActive
                        ? 'border-[#0A4D3C] text-[#0A4D3C]'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Personal Information */}
            {activeProfileTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50/50">
                  <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider mb-2">Demographics & Identity</h4>
                  <div><span className="text-gray-500">National ID / CNIC:</span> <strong className="font-mono">{selectedPilgrim.cnicOrNationalId || 'N/A'}</strong></div>
                  <div><span className="text-gray-500">Date of Birth:</span> <strong>{selectedPilgrim.dateOfBirth || '1965-08-15'}</strong></div>
                  <div><span className="text-gray-500">City / Country:</span> <strong>{selectedPilgrim.city}, {selectedPilgrim.country}</strong></div>
                  <div><span className="text-gray-500">Residential Address:</span> <strong>{selectedPilgrim.address || 'Capital Territory'}</strong></div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50/50">
                  <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider mb-2">Mahram & Emergency Contact</h4>
                  <div><span className="text-gray-500">Relationship with Mahram:</span> <strong>{selectedPilgrim.relationshipWithMahram || 'Self'}</strong></div>
                  <div><span className="text-gray-500">Mahram Name:</span> <strong>{selectedPilgrim.mahramName || 'Self / Head of Family'}</strong></div>
                  <div><span className="text-gray-500">Emergency Contact Person:</span> <strong>{selectedPilgrim.emergencyContactName || 'Family Contact'}</strong></div>
                  <div><span className="text-gray-500">Emergency Phone:</span> <strong className="font-mono">{selectedPilgrim.emergencyContactPhone || selectedPilgrim.phone}</strong></div>
                  {selectedPilgrim.medicalNotes && (
                    <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
                      Medical Alert: {selectedPilgrim.medicalNotes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Passport & Visa */}
            {activeProfileTab === 'passport' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50/50">
                  <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider mb-2">Passport Document Details</h4>
                  <div><span className="text-gray-500">Passport Number:</span> <strong className="font-mono text-sm">{selectedPilgrim.passportNumber}</strong></div>
                  <div><span className="text-gray-500">Issue Date:</span> <strong>{selectedPilgrim.passportIssueDate || '2022-01-10'}</strong></div>
                  <div><span className="text-gray-500">Expiry Date:</span> <strong className="text-emerald-700">{selectedPilgrim.passportExpiryDate || '2032-01-09'}</strong></div>
                  <div><span className="text-gray-500">Issuing Country:</span> <strong>{selectedPilgrim.passportIssuingCountry || 'Pakistan'}</strong></div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50/50">
                  <h4 className="font-bold text-[#0A4D3C] uppercase tracking-wider mb-2">Saudi E-Visa & MOFA Pipeline</h4>
                  <div><span className="text-gray-500">Saudi Visa Number:</span> <strong className="font-mono text-emerald-800">{selectedPilgrim.visaNumber || 'Active'}</strong></div>
                  <div><span className="text-gray-500">Visa Stage:</span> <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{selectedPilgrim.visaStatus}</span></div>
                  <div><span className="text-gray-500">QR Verification Token:</span> <strong className="font-mono text-[10px] text-gray-600 block">{selectedPilgrim.qrCodeToken}</strong></div>
                </div>
              </div>
            )}

            {/* Tab 3: Accommodations & Flights */}
            {activeProfileTab === 'accommodations' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-xl">
                    <h4 className="font-bold text-emerald-900 mb-1">Makkah Hotel & Room Allocation</h4>
                    <div className="text-sm font-bold text-gray-900">{selectedPilgrim.makkahHotel}</div>
                    <div className="mt-2 text-gray-700">Allocated Room: <strong className="font-mono text-sm text-[#0A4D3C]">{selectedPilgrim.makkahRoomNo || 'Assigned'}</strong></div>
                  </div>

                  <div className="p-4 border border-amber-200 bg-amber-50/40 rounded-xl">
                    <h4 className="font-bold text-amber-900 mb-1">Madinah Hotel & Room Allocation</h4>
                    <div className="text-sm font-bold text-gray-900">{selectedPilgrim.madinahHotel}</div>
                    <div className="mt-2 text-gray-700">Allocated Room: <strong className="font-mono text-sm text-amber-800">{selectedPilgrim.madinahRoomNo || 'Assigned'}</strong></div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-[#0A4D3C] mb-1">Flight Routing & GDS PNR</h4>
                  <div className="flex items-center justify-between">
                    <span>Flight: <strong>{selectedPilgrim.flightNumber}</strong></span>
                    <span>PNR Reference: <strong className="font-mono text-[#0A4D3C]">{selectedPilgrim.pnrCode}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Payments & History */}
            {activeProfileTab === 'payments' && (
              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <div className="p-3 bg-gray-100 font-bold text-gray-700">
                  Payments & Receipt History
                </div>
                {selectedPilgrim.paymentsHistory?.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-2.5">Receipt #</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Amount (PKR)</th>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5">Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedPilgrim.paymentsHistory.map(p => (
                        <tr key={p.id}>
                          <td className="p-2.5 font-mono font-bold text-[#0A4D3C]">{p.receiptNumber}</td>
                          <td className="p-2.5">{p.paymentDate}</td>
                          <td className="p-2.5 font-bold">Rs. {Number(p.amountPKR).toLocaleString()}</td>
                          <td className="p-2.5">{p.paymentMethod}</td>
                          <td className="p-2.5">{p.installmentStage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    Direct payment records are consolidated under Booking Reference: {selectedPilgrim.currentBookingId || 'BK-2026-0001'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* REGISTER NEW PILGRIM MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Pilgrim"
        subtitle="Create an individual digital identity profile with passport, CNIC and holy package linking."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {/* Identity Photo & Camera Capture */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
            <ImageUpload
              value={formData.photoUrl}
              gender={formData.gender}
              label="Pilgrim Photograph (Camera Capture / Mobile Upload)"
              onChange={(url) => setFormData({ ...formData, photoUrl: url })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name (as per Passport) *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Haji Muhammad Tariq"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Arabic Name</label>
              <input
                type="text"
                value={formData.arabicName}
                onChange={(e) => setFormData({ ...formData, arabicName: e.target.value })}
                placeholder="محمد طارق"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => {
                  const newGender = e.target.value;
                  const newPhoto = (!formData.photoUrl || formData.photoUrl.includes('/images/avatar_'))
                    ? (newGender === 'Female' ? '/images/avatar_female.svg' : '/images/avatar_male.svg')
                    : formData.photoUrl;
                  setFormData({ ...formData, gender: newGender, photoUrl: newPhoto });
                }}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">CNIC / National ID</label>
              <input
                type="text"
                value={formData.cnicOrNationalId}
                onChange={(e) => setFormData({ ...formData, cnicOrNationalId: e.target.value })}
                placeholder="61101-XXXXXXX-X"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Passport Number *</label>
              <input
                type="text"
                required
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                placeholder="e.g. BL4920194"
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Passport Issue Date</label>
              <input
                type="date"
                value={formData.passportIssueDate}
                onChange={(e) => setFormData({ ...formData, passportIssueDate: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Passport Expiry Date</label>
              <input
                type="date"
                value={formData.passportExpiryDate}
                onChange={(e) => setFormData({ ...formData, passportExpiryDate: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 XXXXXXX"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Emergency Contact Person</label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                placeholder="e.g. Brother / Son Name"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Emergency Phone</label>
              <input
                type="text"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                placeholder="+92 321 XXXXXXX"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A4D3C]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white font-bold rounded-xl shadow"
            >
              Confirm & Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* PRINTABLE PILGRIM ID CARD MODAL */}
      <PrintableDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        docType="idcard"
        data={cardDocData}
      />
    </div>
  );
}
