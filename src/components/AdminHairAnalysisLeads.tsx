import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Phone,
  MessageCircle,
  ExternalLink,
  CheckCircle,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Eye,
  User,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import { HairAnalysisLead } from '../types/hairAnalysis';
import { useStore } from '../context/StoreContext';

export const AdminHairAnalysisLeads: React.FC = () => {
  const { products, formatPrice, playSound } = useStore();
  const [leads, setLeads] = useState<HairAnalysisLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'CONVERTED'>('ALL');
  const [selectedLead, setSelectedLead] = useState<HairAnalysisLead | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/hair-analysis/leads', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'NEW' | 'CONTACTED' | 'CONVERTED') => {
    try {
      setActionLoadingId(id);
      playSound('nav_click');
      const res = await fetch(`/api/admin/hair-analysis/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
        if (selectedLead?.id === id) {
          setSelectedLead(data.lead);
        }
        playSound('success_chime');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this consultation lead?')) return;
    try {
      setActionLoadingId(id);
      playSound('nav_click');
      const res = await fetch(`/api/admin/hair-analysis/leads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = lead.name?.toLowerCase().includes(term);
      const matchPhone = lead.mobile?.includes(term);
      const matchCity = lead.city?.toLowerCase().includes(term);
      const matchConcern = (lead.allAnswers?.mainConcern || lead.generatedProfile?.mainConcern || '').toLowerCase().includes(term);
      if (!matchName && !matchPhone && !matchCity && !matchConcern) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full text-xs">NEW</span>;
      case 'CONTACTED':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-xs">CONTACTED</span>;
      case 'CONVERTED':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs">CONVERTED</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-full text-xs">{status}</span>;
    }
  };

  const cleanPhoneForWhatsApp = (countryCode: string, mobile: string) => {
    const raw = `${countryCode || '+91'}${mobile || ''}`.replace(/\D/g, '');
    return raw;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Hair Analysis Leads</span>
            <span className="text-xs bg-[#0B2F20] text-[#C9A84E] font-bold px-2.5 py-0.5 rounded-full">
              {leads.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review customer consultations, recommendations, and direct WhatsApp follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLeads}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search name, phone, concern..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:border-[#0B2F20]"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'NEW', 'CONTACTED', 'CONVERTED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0B2F20] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Gender & Age</th>
                <th className="py-3.5 px-4">Main Concern</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Goal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    {loading ? 'Loading hair analysis leads...' : 'No consultation leads found.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const answers = lead.allAnswers || ({} as any);
                  const waNumber = cleanPhoneForWhatsApp(lead.countryCode, lead.mobile);
                  const waText = encodeURIComponent(
                    `Namaste ${lead.name}! This is your HAKKIVEDA Hair Care Advisor regarding your recent Hair Root Analysis for ${answers.mainConcern || 'hair fall'}. How can we assist you today?`
                  );

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {lead.countryCode} {lead.mobile}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>{lead.country || 'India'}</div>
                        <div className="text-[11px] text-slate-400">{lead.city || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>{lead.gender || '—'}</div>
                        <div className="text-[11px] text-slate-400">{lead.ageGroup || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-[#0B2F20]">
                        {answers.mainConcern || lead.generatedProfile?.mainConcern || '—'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {answers.severity || '—'}
                      </td>
                      <td className="py-3.5 px-4 max-w-[140px] truncate text-slate-600">
                        {answers.mainGoal || '—'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp CTA */}
                          <a
                            href={`https://wa.me/${waNumber}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                            title="View Complete Assessment"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B2F20] text-[#C9A84E] font-bold flex items-center justify-center text-sm">
                  {selectedLead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{selectedLead.name}</span>
                    {getStatusBadge(selectedLead.status)}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedLead.countryCode} {selectedLead.mobile} · {selectedLead.city}, {selectedLead.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">
              {/* Quick Status Control Bar */}
              <div className="bg-[#FBF9F4] border border-[#E7DFC9] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#0B2F20]">Lead Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={actionLoadingId === selectedLead.id}
                    onClick={() => handleUpdateStatus(selectedLead.id, 'NEW')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedLead.status === 'NEW'
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Reset to New
                  </button>
                  <button
                    type="button"
                    disabled={actionLoadingId === selectedLead.id}
                    onClick={() => handleUpdateStatus(selectedLead.id, 'CONTACTED')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedLead.status === 'CONTACTED'
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Mark Contacted
                  </button>
                  <button
                    type="button"
                    disabled={actionLoadingId === selectedLead.id}
                    onClick={() => handleUpdateStatus(selectedLead.id, 'CONVERTED')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedLead.status === 'CONVERTED'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Mark Converted
                  </button>

                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(selectedLead.countryCode, selectedLead.mobile)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Photos if uploaded */}
              {selectedLead.photoReferences && Object.keys(selectedLead.photoReferences).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Uploaded Scalp Photos
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedLead.photoReferences).map(([slot, url]) => (
                      <div key={slot} className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
                        <img
                          src={url as string}
                          alt={slot}
                          className="w-full h-32 object-cover rounded-lg border border-slate-200"
                        />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1 block">
                          {slot}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assessment Question & Answers */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Complete Assessment Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">MAIN CONCERN</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">{selectedLead.allAnswers?.mainConcern || '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">HAIR LOSS PATTERN</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">{selectedLead.allAnswers?.hairLossPattern || '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">DURATION</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{selectedLead.allAnswers?.duration || '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">SEVERITY</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{selectedLead.allAnswers?.severity || '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">SCALP CONDITION</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      {selectedLead.allAnswers?.scalpConditions?.join(', ') || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">STRAND QUALITY</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      {selectedLead.allAnswers?.hairQualities?.join(', ') || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">FAMILY HISTORY</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{selectedLead.allAnswers?.familyHistory || '—'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">STRESS & SLEEP</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      Stress: {selectedLead.allAnswers?.stressLevel || '—'} · Sleep: {selectedLead.allAnswers?.sleepHours || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">DIET & PROTEIN</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      {selectedLead.allAnswers?.dietType || '—'} (Protein: {selectedLead.allAnswers?.proteinIntake || '—'})
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-bold block text-[10px]">WASH & OIL ROUTINE</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      Wash: {selectedLead.allAnswers?.washFrequency || '—'} · Oil: {selectedLead.allAnswers?.oilingFrequency || '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                    <span className="text-slate-400 font-bold block text-[10px]">HEALTH CONTEXT (INTERNAL)</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      {selectedLead.allAnswers?.healthBackground?.join(', ') || 'None noted'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              {selectedLead.generatedProfile?.recommendedProducts && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Recommended HAKKIVEDA Regimen
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedLead.generatedProfile.recommendedProducts.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-[#0B2F20] font-semibold">{p.ritualRole}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delete lead action */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  disabled={actionLoadingId === selectedLead.id}
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Lead</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
