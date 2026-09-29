import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  AlertTriangle,
  Info,
  Check,
  Smartphone,
  Eye,
  Layers,
  Palette,
} from 'lucide-react';
import { MobileAppSettings } from '../../../types/mobileApp';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';

interface AppBrandingManagerProps {
  settings: MobileAppSettings;
  onSave: (updated: MobileAppSettings) => void;
  isSaving: boolean;
}

export const AppBrandingManager: React.FC<AppBrandingManagerProps> = ({
  settings,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState<MobileAppSettings>({ ...settings });
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  const handleFileUpload = async (file: File, field: keyof MobileAppSettings) => {
    setUploadingTarget(String(field));
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload/mobile-app?folder=branding', {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Upload failed');
      }

      const updated = { ...formData, [field]: data.url };
      setFormData(updated);
      onSave(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to upload branding image');
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleFieldChange = (field: keyof MobileAppSettings, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Android App Branding & Color Palette</span>
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Configure real-time app logos, color accents and header branding displayed inside the Android application.
        </p>
      </div>

      {/* Critical Architecture Notice: Launcher Icon vs In-App Branding */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Android Launcher Icon Notice (Technical Constraint)</span>
        </div>
        <p className="leading-relaxed text-amber-100/90">
          The Android home screen launcher icon (<code>ic_launcher.png</code>, <code>ic_launcher_round.png</code>, and adaptive vector XML)
          is packaged statically into the native Android application bundle (APK / AAB) and cannot be swapped over the air from an admin dashboard.
          Changes made here instantly update the <strong>in-app header logo</strong>, <strong>in-app splash screen</strong>, and <strong>colors</strong> without requiring APK rebuild.
        </p>
      </div>

      <form onSubmit={handleSaveForm} className="space-y-6">
        {/* Logos & Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Header Logo */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white block">In-App Header Logo</span>
            <span className="text-[10px] text-slate-400 block">
              Displayed in the persistent top native navigation bar.
            </span>

            <div className="w-full h-24 rounded-xl bg-[#0E382C] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
              <img
                src={resolveAssetUrl(formData.headerLogoUrl || '/images/hakkiveda_hv_logo.png')}
                alt="Header Logo"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hakkiveda-logo.png';
                }}
              />
            </div>

            <label className="block cursor-pointer">
              <div className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-[#C5A059]/50 text-center text-xs font-bold text-[#C5A059] flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingTarget === 'headerLogoUrl' ? 'Uploading...' : 'Replace Header Logo'}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={Boolean(uploadingTarget)}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'headerLogoUrl');
                }}
              />
            </label>

            <input
              type="text"
              value={formData.headerLogoUrl || ''}
              onChange={(e) => handleFieldChange('headerLogoUrl', e.target.value)}
              placeholder="/images/hakkiveda_hv_logo.png"
              className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-[10px] text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Splash Image / Logo */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white block">In-App Splash / Loading Mark</span>
            <span className="text-[10px] text-slate-400 block">
              Shown during app launch and initial initialization screens.
            </span>

            <div className="w-full h-24 rounded-xl bg-[#0E382C] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
              <img
                src={resolveAssetUrl(formData.splashImageUrl || '/images/hakkiveda_hv_logo.png')}
                alt="Splash Mark"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hakkiveda-logo.png';
                }}
              />
            </div>

            <label className="block cursor-pointer">
              <div className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-[#C5A059]/50 text-center text-xs font-bold text-[#C5A059] flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingTarget === 'splashImageUrl' ? 'Uploading...' : 'Replace Splash Logo'}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={Boolean(uploadingTarget)}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'splashImageUrl');
                }}
              />
            </label>

            <input
              type="text"
              value={formData.splashImageUrl || ''}
              onChange={(e) => handleFieldChange('splashImageUrl', e.target.value)}
              placeholder="/images/hakkiveda_hv_logo.png"
              className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-[10px] text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Home Optional Logo */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-white block">Optional Home Header Logo</span>
            <span className="text-[10px] text-slate-400 block">
              Secondary emblem or celebratory festival badge.
            </span>

            <div className="w-full h-24 rounded-xl bg-[#0E382C] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
              <img
                src={resolveAssetUrl(formData.homeLogoUrl || '/images/hakkiveda_hv_logo.png')}
                alt="Home Logo"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hakkiveda-logo.png';
                }}
              />
            </div>

            <label className="block cursor-pointer">
              <div className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-[#C5A059]/50 text-center text-xs font-bold text-[#C5A059] flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingTarget === 'homeLogoUrl' ? 'Uploading...' : 'Replace Home Logo'}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={Boolean(uploadingTarget)}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'homeLogoUrl');
                }}
              />
            </label>

            <input
              type="text"
              value={formData.homeLogoUrl || ''}
              onChange={(e) => handleFieldChange('homeLogoUrl', e.target.value)}
              placeholder="/images/hakkiveda_hv_logo.png"
              className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-[10px] text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Text & Header Subtitles */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            App Header Titles & Copy
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                App Name
              </label>
              <input
                type="text"
                value={formData.appName}
                onChange={(e) => handleFieldChange('appName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Header Main Title
              </label>
              <input
                type="text"
                value={formData.headerTitle}
                onChange={(e) => handleFieldChange('headerTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Optional App Header Subtitle
            </label>
            <input
              type="text"
              value={formData.headerSubtitle}
              onChange={(e) => handleFieldChange('headerSubtitle', e.target.value)}
              placeholder="e.g. Authentic Hakki-Pikki Tribal Ayurveda"
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Brand Theme Colors */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#C5A059]" />
            <span>Theme Colors</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Primary Accent Color */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                App Accent Gold Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brandAccentColor || '#C5A059'}
                  onChange={(e) => handleFieldChange('brandAccentColor', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.brandAccentColor || '#C5A059'}
                  onChange={(e) => handleFieldChange('brandAccentColor', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Deep Green Primary */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Primary Forest Green
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brandDeepGreen || '#0E382C'}
                  onChange={(e) => handleFieldChange('brandDeepGreen', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.brandDeepGreen || '#0E382C'}
                  onChange={(e) => handleFieldChange('brandDeepGreen', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Secondary Dark Green
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.brandSecondaryColor || '#1A4D3E'}
                  onChange={(e) => handleFieldChange('brandSecondaryColor', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.brandSecondaryColor || '#1A4D3E'}
                  onChange={(e) => handleFieldChange('brandSecondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Free Delivery Threshold */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
            Free Express Delivery Minimum Amount (₹)
          </label>
          <input
            type="number"
            value={formData.freeDeliveryThreshold}
            onChange={(e) => handleFieldChange('freeDeliveryThreshold', parseInt(e.target.value, 10) || 0)}
            className="w-full max-w-xs px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save App Branding Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
