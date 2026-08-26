import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Eye,
  Sliders,
  Clock,
  Zap,
  MoveRight,
  MoveLeft,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  AnnouncementMessage,
  AnnouncementAnimationMode,
  AnnouncementSlideDirection,
  AnnouncementTransitionSpeed,
} from '../types/store';
import { AnnouncementBar } from './AnnouncementBar';

interface AdminAnnouncementManagerProps {
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminAnnouncementManager: React.FC<AdminAnnouncementManagerProps> = ({ showToast }) => {
  const { siteSettings, updateSiteSettings, selectedCountry, setIsCountryModalOpen } = useStore();

  // Active status
  const isActive = siteSettings?.announcementActive ?? true;
  const currentBgColor = siteSettings?.announcementBgColor || '#D4AF37';
  const currentTextColor = siteSettings?.announcementTextColor || '#1C550E';
  const currentMode: AnnouncementAnimationMode = siteSettings?.announcementMode || 'slide';
  const currentPause: number = siteSettings?.announcementPauseDuration || 3;
  const currentSpeed: AnnouncementTransitionSpeed = siteSettings?.announcementTransitionSpeed || 'normal';
  const currentDirection: AnnouncementSlideDirection = siteSettings?.announcementDirection || 'right_to_left';

  // Get messages list or initialize from single legacy announcementText
  const messages: AnnouncementMessage[] = React.useMemo(() => {
    if (Array.isArray(siteSettings?.announcementMessages) && siteSettings.announcementMessages.length > 0) {
      return siteSettings.announcementMessages;
    }
    const legacy = siteSettings?.announcementText?.trim() || 'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula';
    return [
      {
        id: 'ann-1',
        text: legacy,
        link: '',
        enabled: true,
        sortOrder: 1,
      },
    ];
  }, [siteSettings?.announcementMessages, siteSettings?.announcementText]);

  // Form state for adding a new message
  const [newMsgText, setNewMsgText] = useState('');
  const [newMsgLink, setNewMsgLink] = useState('');

  // Helper to commit updates
  const saveChanges = (updates: Partial<typeof siteSettings>, messageNotice?: string) => {
    updateSiteSettings(updates);
    if (showToast && messageNotice) {
      showToast(messageNotice, 'success');
    }
  };

  // 1. Toggle Announcement Bar Active
  const handleToggleActive = (checked: boolean) => {
    saveChanges({ announcementActive: checked }, checked ? 'Announcement bar enabled' : 'Announcement bar disabled');
  };

  // 2. Change Colors
  const handleBgColorChange = (color: string) => {
    saveChanges({ announcementBgColor: color });
  };
  const handleTextColorChange = (color: string) => {
    saveChanges({ announcementTextColor: color });
  };

  // 3. Change Animation Mode
  const handleModeChange = (mode: AnnouncementAnimationMode) => {
    saveChanges({ announcementMode: mode }, `Animation mode set to ${mode.toUpperCase()}`);
  };

  // 4. Change Slide Pause Duration
  const handlePauseChange = (duration: number) => {
    saveChanges({ announcementPauseDuration: duration }, `Pause duration set to ${duration} seconds`);
  };

  // 5. Change Transition Speed
  const handleSpeedChange = (speed: AnnouncementTransitionSpeed) => {
    saveChanges({ announcementTransitionSpeed: speed }, `Transition speed set to ${speed.toUpperCase()}`);
  };

  // 6. Change Slide Direction
  const handleDirectionChange = (direction: AnnouncementSlideDirection) => {
    saveChanges(
      { announcementDirection: direction },
      `Direction set to ${direction === 'right_to_left' ? 'Right → Left' : 'Left → Right'}`
    );
  };

  // 7. Add New Message
  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) {
      showToast?.('Please enter announcement text', 'error');
      return;
    }

    const newMsg: AnnouncementMessage = {
      id: `ann-${Date.now()}`,
      text: newMsgText.trim(),
      link: newMsgLink.trim(),
      enabled: true,
      sortOrder: messages.length + 1,
    };

    const updated = [...messages, newMsg];
    saveChanges(
      {
        announcementMessages: updated,
        announcementText: updated[0]?.text || newMsg.text,
      },
      'New announcement message added'
    );
    setNewMsgText('');
    setNewMsgLink('');
  };

  // 8. Update Individual Message
  const handleUpdateMessage = (id: string, partial: Partial<AnnouncementMessage>) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, ...partial } : m));
    const firstActive = updated.find((m) => m.enabled) || updated[0];
    saveChanges({
      announcementMessages: updated,
      announcementText: firstActive?.text || '',
    });
  };

  // 9. Delete Message
  const handleDeleteMessage = (id: string) => {
    if (messages.length <= 1) {
      showToast?.('You must keep at least one announcement message', 'error');
      return;
    }
    const updated = messages.filter((m) => m.id !== id);
    const firstActive = updated.find((m) => m.enabled) || updated[0];
    saveChanges(
      {
        announcementMessages: updated,
        announcementText: firstActive?.text || '',
      },
      'Announcement message removed'
    );
  };

  // 10. Reorder Messages (Move Up / Move Down)
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= messages.length) return;

    const list = [...messages];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    // re-assign sortOrder
    const reordered = list.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    saveChanges({
      announcementMessages: reordered,
      announcementText: reordered.find((m) => m.enabled)?.text || reordered[0]?.text || '',
    });
  };

  // Preset suggestions for quick adding
  const presets = [
    'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula',
    'Handcrafted in 21-Day Slow Woodfire Decoction by Hakki-Pikki Tribe',
    'Complimentary Express Delivery on Orders Over ₹999 / $50',
    'Certified AYUSH Compliant • Wildcrafted Mysore Botanicals',
    'Special Festive Offer: Use code TRIBAL10 for 10% Off Your First Order',
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)]">
              <Megaphone className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">
              Announcement Bar Manager
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            Configure multi-message sliding announcements, animation modes, pause intervals, and custom brand colors.
          </p>
        </div>

        {/* Global Master Switch */}
        <div className="flex items-center gap-3 bg-[var(--brand-primary-deep,#0A1810)] px-4 py-2.5 rounded-xl border border-white/15 shadow-sm">
          <input
            type="checkbox"
            id="ann-master-active"
            checked={isActive}
            onChange={(e) => handleToggleActive(e.target.checked)}
            className="w-4 h-4 accent-[var(--brand-gold)] cursor-pointer"
          />
          <label htmlFor="ann-master-active" className="text-xs font-bold text-slate-200 cursor-pointer select-none">
            {isActive ? 'Bar Active (Visible)' : 'Bar Inactive (Hidden)'}
          </label>
        </div>
      </div>

      {/* Live Interactive Preview */}
      <div className="bg-[var(--brand-primary-dark,#07160E)] border border-[var(--brand-gold)]/30 rounded-2xl p-4 sm:p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">
            <Eye className="w-4 h-4" />
            <span>Live Interactive Header Preview</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Mode: <strong className="text-slate-200 uppercase">{currentMode}</strong> • Pause: <strong className="text-slate-200">{currentPause}s</strong> • Speed: <strong className="text-slate-200 uppercase">{currentSpeed}</strong>
          </span>
        </div>

        {/* Mock Live Top Bar */}
        <div className="rounded-xl overflow-hidden shadow-md border border-white/10 bg-black">
          <AnnouncementBar
            siteSettings={siteSettings}
            selectedCountry={selectedCountry}
            onOpenCountryModal={() => setIsCountryModalOpen(true)}
          />
        </div>
        <p className="text-[11px] text-slate-400 italic">
          Hover (desktop) or tap (mobile) above to test pause interaction. Active country selector remains stationary on the right.
        </p>
      </div>

      {/* Section 1: Animation Mode & Slide Timing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Animation Mode */}
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Sliders className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Animation Mode</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Choose how messages are displayed in the announcement bar.
          </p>

          <div className="space-y-2 pt-1">
            {[
              {
                id: 'slide',
                label: 'Slide (Recommended)',
                desc: 'One message at a time, pauses for X seconds then slides horizontally',
              },
              {
                id: 'marquee',
                label: 'Continuous Marquee',
                desc: 'Continuous horizontally crawling text ticker ribbon',
              },
              {
                id: 'static',
                label: 'Static Display',
                desc: 'Stationary message without motion transitions',
              },
            ].map((option) => (
              <label
                key={option.id}
                onClick={() => handleModeChange(option.id as AnnouncementAnimationMode)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  currentMode === option.id
                    ? 'bg-[var(--brand-gold)]/15 border-[var(--brand-gold)] text-slate-100 shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="ann_mode"
                  checked={currentMode === option.id}
                  onChange={() => handleModeChange(option.id as AnnouncementAnimationMode)}
                  className="mt-0.5 accent-[var(--brand-gold)]"
                />
                <div>
                  <span className="block text-xs font-bold">{option.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Slide Pause Duration & Transition Speed */}
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Clock className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Slide Pause Duration</span>
          </div>
          <p className="text-[11px] text-slate-400">
            How long each message remains stationary before sliding out.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handlePauseChange(sec)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                  currentPause === sec
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)] font-extrabold shadow'
                    : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Zap className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Transition Speed</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fast', label: 'Fast', ms: '300ms' },
                { id: 'normal', label: 'Normal', ms: '500ms' },
                { id: 'slow', label: 'Slow', ms: '700ms' },
              ].map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => handleSpeedChange(sp.id as AnnouncementTransitionSpeed)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                    currentSpeed === sp.id
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)] font-extrabold shadow'
                      : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="block text-xs">{sp.label}</span>
                  <span className="block text-[9px] opacity-75 font-normal">{sp.ms}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Slide Direction & Brand Colors */}
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <MoveRight className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Slide Direction</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDirectionChange('right_to_left')}
              className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                currentDirection === 'right_to_left'
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)] font-extrabold shadow'
                  : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
              }`}
            >
              <MoveLeft className="w-3.5 h-3.5" />
              <span>Right → Left</span>
            </button>
            <button
              type="button"
              onClick={() => handleDirectionChange('left_to_right')}
              className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                currentDirection === 'left_to_right'
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)] font-extrabold shadow'
                  : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
              }`}
            >
              <MoveRight className="w-3.5 h-3.5" />
              <span>Left → Right</span>
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-3">
            <span className="block text-xs font-bold text-slate-200">Colors & Styling</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentBgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer p-0.5 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={currentBgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1.5 rounded-lg text-[11px] text-slate-100 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTextColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer p-0.5 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={currentTextColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1.5 rounded-lg text-[11px] text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Manage Announcement Messages List */}
      <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif-luxury text-slate-100 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Announcement Messages ({messages.length})</span>
            </h2>
            <p className="text-xs text-slate-300">
              In Slide mode, each enabled message displays sequentially according to sort order.
            </p>
          </div>
        </div>

        {/* Existing Messages List */}
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl border transition-all ${
                msg.enabled
                  ? 'bg-[var(--brand-primary-deep)] border-white/15'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                {/* Drag / Move & Order Badge */}
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300">
                    #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      title="Move Up"
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === messages.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      title="Move Down"
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Text Input */}
                <div className="flex-1 w-full sm:w-auto space-y-2">
                  <input
                    type="text"
                    value={msg.text}
                    onChange={(e) => handleUpdateMessage(msg.id, { text: e.target.value })}
                    placeholder="Enter announcement message text..."
                    className="w-full bg-black/30 border border-white/20 p-2.5 rounded-lg text-xs font-medium text-slate-100 focus:border-[var(--brand-gold)] outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-3 h-3 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={msg.link || ''}
                      onChange={(e) => handleUpdateMessage(msg.id, { link: e.target.value })}
                      placeholder="Optional link (e.g. #products, /about, https://...)"
                      className="w-full bg-black/20 border border-white/10 px-2 py-1 rounded text-[11px] text-slate-300 focus:border-[var(--brand-gold)] outline-none"
                    />
                  </div>
                </div>

                {/* Status Toggle & Delete */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={msg.enabled}
                      onChange={(e) => handleUpdateMessage(msg.id, { enabled: e.target.checked })}
                      className="w-4 h-4 accent-[var(--brand-gold)] rounded cursor-pointer"
                    />
                    <span>{msg.enabled ? 'Enabled' : 'Disabled'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(msg.id)}
                    title="Delete Message"
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Message Form */}
        <form onSubmit={handleAddMessage} className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Plus className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Add New Announcement Message</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
                placeholder="Type new announcement message here..."
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-xs text-slate-100 focus:border-[var(--brand-gold)] outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                value={newMsgLink}
                onChange={(e) => setNewMsgLink(e.target.value)}
                placeholder="Optional link (e.g. #products)"
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-xs text-slate-100 focus:border-[var(--brand-gold)] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Message</span>
            </button>
          </div>
        </form>

        {/* Quick Presets / Templates */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Template Suggestions (Click to Add):
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNewMsgText(p);
                }}
                className="text-[11px] bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors text-left"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
