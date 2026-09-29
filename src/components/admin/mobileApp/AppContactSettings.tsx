import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  ExternalLink,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { MobileAppSettings } from '../../../types/mobileApp';

interface AppContactSettingsProps {
  settings: MobileAppSettings;
  onSave: (updated: MobileAppSettings) => void;
  isSaving: boolean;
}

export const AppContactSettings: React.FC<AppContactSettingsProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState(
    settings.whatsappNumber || '+917619536831'
  );
  const [contactPhone, setContactPhone] = useState(
    settings.contactPhone || '+917619536831'
  );
  const [supportEmail, setSupportEmail] = useState(
    settings.supportEmail || 'support@hakkiveda.com'
  );

  // Clean whatsapp number for wa.me link (no +, no spaces, no dashes)
  const cleanWaNumber = (whatsappNumber || '+917619536831').replace(/[^\d]/g, '');
  const testWaUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Namaste HAKKIVEDA! I need consultation regarding my hair regimen.'
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MobileAppSettings = {
      ...settings,
      whatsappNumber,
      contactPhone,
      supportEmail,
    };
    onSave(updated);
  };

  return (
    <div className="space-y-6 mobile-app-admin text-white">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#C5A059]" />
          <span>Android App Customer Support & WhatsApp Channels</span>
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Configure official contact numbers used across the Android app for consultations, order assistance and instant WhatsApp chat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
          {/* WhatsApp Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary WhatsApp Consultation Number *</span>
              </label>
              <span className="text-[10px] text-[#C5A059] font-mono">
                Current Standard: +917619536831
              </span>
            </div>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+917619536831"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 font-mono focus:outline-none focus:border-[#C5A059]"
            />
            <p className="text-[10px] text-slate-300 mt-1">
              Directly powers all "Chat on WhatsApp" buttons and post-analysis consultations.
            </p>
          </div>

          {/* Formatted wa.me link preview */}
          <div className="p-3.5 rounded-xl bg-[#0E382C]/60 border border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider block">
                Generated wa.me URL Format (No "+" symbol):
              </span>
              <code className="text-emerald-200 font-mono text-[11px] select-all break-all">
                https://wa.me/{cleanWaNumber}
              </code>
            </div>

            <a
              href={testWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] text-[#0E382C] font-bold text-[11px] flex items-center gap-1 hover:bg-[#d4af37] transition-all self-start sm:self-auto flex-shrink-0"
            >
              <span>Test wa.me URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Support Phone */}
            <div>
              <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Support Phone Number</span>
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+917619536831"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 font-mono focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Support Email */}
            <div>
              <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Support Email Address</span>
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@hakkiveda.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save App Contact Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
