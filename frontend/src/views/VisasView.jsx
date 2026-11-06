import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { FileCheck, Plus, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

export default function VisasView() {
  const { formatMoney } = useCurrency();
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'

  const stages = [
    'Documents Received',
    'Biometrics Completed',
    'MOFA Application Submitted',
    'Issued & Delivered'
  ];

  const [formData, setFormData] = useState({
    pilgrimName: '',
    passportNumber: '',
    visaType: 'Umrah E-Visa (KSA Single Entry 90 Days)',
    mofaNumber: '',
    visaNumber: '',
    insurancePolicyNo: '',
    stage: 'Documents Received',
    agencyFeeSAR: 450,
    costFeeSAR: 380,
    notes: ''
  });

  const loadVisas = async () => {
    setLoading(true);
    try {
      const res = await api.getVisas();
      if (res.success) setVisas(res.visas);
    } catch (err) {
      console.error('Failed to load visas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisas();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createVisa(formData);
      setShowAddModal(false);
      loadVisas();
      alert('Visa application created in pipeline!');
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleStageAdvance = async (visa, newStage) => {
    try {
      await api.updateVisa(visa.id, {
        stage: newStage,
        status: newStage.includes('Delivered') ? 'Delivered' : 'In Process'
      });
      loadVisas();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Visa Application #',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-[#0A4D3C]">{row.id}</span>
      )
    },
    {
      header: 'Pilgrim Name',
      accessor: 'pilgrimName',
      render: (row) => {
        const photo = row.photoUrl || (row.pilgrimName.includes('Parveen') || row.pilgrimName.includes('Fatima') || row.pilgrimName.includes('Begum')
          ? '/images/avatar_female.svg'
          : '/images/avatar_male.svg');
        return (
          <div className="flex items-center gap-2.5">
            <img
              src={photo}
              alt={row.pilgrimName}
              className="w-8 h-8 rounded-full object-cover border border-[#0A4D3C]/30 shrink-0 shadow-2xs"
              onError={(e) => { e.target.src = '/images/avatar_male.svg'; }}
            />
            <div>
              <div className="font-bold text-gray-900">{row.pilgrimName}</div>
              <div className="text-[10px] text-gray-500 font-mono">Pass: {row.passportNumber}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Visa Type',
      accessor: 'visaType',
      render: (row) => (
        <span className="text-gray-700 font-medium">{row.visaType}</span>
      )
    },
    {
      header: 'MOFA / Visa Ref',
      accessor: 'mofaNumber',
      render: (row) => (
        <div>
          <div className="font-mono text-emerald-800 font-bold">{row.visaNumber || 'Pending Issuance'}</div>
          <div className="text-[10px] font-mono text-gray-500">{row.mofaNumber || 'MOFA In Process'}</div>
        </div>
      )
    },
    {
      header: 'Processing Stage',
      accessor: 'stage',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          row.stage.includes('Delivered') ? 'bg-emerald-100 text-emerald-800' :
          row.stage.includes('MOFA') ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {row.stage}
        </span>
      )
    },
    {
      header: 'Fee & Profit',
      accessor: 'profitPKR',
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">SAR {row.agencyFeeSAR}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Profit: Rs. {Number(row.profitPKR).toLocaleString()}</div>
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
            Saudi E-Visa & Embassy Pipeline
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track Umrah E-Visas, Nusuk Hajj permits, Tasheer biometric scheduling, Saudi MOFA generation and Tawuniya health insurance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-[#0A4D3C] text-white shadow' : 'text-gray-600'
              }`}
            >
              Data Table
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A4D3C] hover:bg-[#063A2D] text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>New Visa Application</span>
          </button>
        </div>
      </div>

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage, idx) => {
            const stageVisas = visas.filter(v => v.stage === stage || (idx === 3 && v.status === 'Delivered'));
            return (
              <div key={idx} className="bg-gray-100/75 rounded-2xl p-4 flex flex-col justify-between border border-gray-200 min-h-[420px]">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                    <span className="font-bold text-xs text-gray-800">{stage}</span>
                    <span className="h-5 w-5 rounded-full bg-[#0A4D3C] text-[#D4AF37] font-bold text-[10px] flex items-center justify-center">
                      {stageVisas.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageVisas.map(v => (
                      <div key={v.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#0A4D3C]">{v.id}</span>
                          <span className="font-mono text-[10px] text-gray-500 font-bold">{v.passportNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <img
                            src={v.photoUrl || (v.pilgrimName.includes('Parveen') || v.pilgrimName.includes('Fatima') || v.pilgrimName.includes('Begum') ? '/images/avatar_female.svg' : '/images/avatar_male.svg')}
                            alt={v.pilgrimName}
                            className="w-7 h-7 rounded-full object-cover border border-[#0A4D3C]/30 shrink-0"
                            onError={(e) => { e.target.src = '/images/avatar_male.svg'; }}
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 leading-tight">{v.pilgrimName}</h4>
                            <div className="text-[10px] text-gray-500">{v.visaType?.split(' ')[0]} {v.visaType?.split(' ')[1]}</div>
                          </div>
                        </div>

                        {v.mofaNumber && (
                          <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 p-1 rounded">
                            MOFA: {v.mofaNumber}
                          </div>
                        )}

                        {idx < stages.length - 1 && (
                          <button
                            onClick={() => handleStageAdvance(v, stages[idx + 1])}
                            className="w-full mt-2 py-1 px-2 text-[10px] font-bold text-[#0A4D3C] bg-emerald-50 hover:bg-[#0A4D3C] hover:text-white rounded border border-[#0A4D3C]/30 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Advance to {stages[idx + 1].split(' ')[0]}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 text-center text-[10px] text-gray-400">
                  Step {idx + 1} of 4 in Saudi MOFA Pipeline
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={visas}
          searchPlaceholder="Search visas by pilgrim name, passport, or MOFA number..."
          exportFileName="harmain_visas_pipeline.csv"
        />
      )}

      {/* NEW VISA MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Submit New Saudi Visa Application"
        subtitle="Initiate MOFA registration with Tasheer biometric and health insurance."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Pilgrim Full Name *</label>
              <input
                type="text"
                required
                value={formData.pilgrimName}
                onChange={(e) => setFormData({ ...formData, pilgrimName: e.target.value })}
                placeholder="e.g. Haji Abdul Qayyum"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Passport Number *</label>
              <input
                type="text"
                required
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                placeholder="BL4920194"
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Visa Category</label>
              <select
                value={formData.visaType}
                onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
              >
                <option value="Umrah E-Visa (KSA Single Entry 90 Days)">Umrah E-Visa (Single Entry 90 Days)</option>
                <option value="Saudi Tourist E-Visa Multiple Entry 1 Year">Saudi Tourist E-Visa (1 Year Multiple)</option>
                <option value="Hajj Nusuk Platform Dedicated Visa">Hajj Nusuk Dedicated Visa</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Processing Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
              >
                {stages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Agency Client Fee (SAR)</label>
              <input
                type="number"
                value={formData.agencyFeeSAR}
                onChange={(e) => setFormData({ ...formData, agencyFeeSAR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Saudi MOFA Direct Cost (SAR)</label>
              <input
                type="number"
                value={formData.costFeeSAR}
                onChange={(e) => setFormData({ ...formData, costFeeSAR: parseFloat(e.target.value || 0) })}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
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
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
