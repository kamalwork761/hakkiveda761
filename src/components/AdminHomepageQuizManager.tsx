import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { uploadFileToServer } from '../utils/upload';
import {
  Sparkles,
  Upload,
  Save,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  ToggleLeft,
  ToggleRight,
  Bot,
  ArrowRight,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { HomepageQuizBannerConfig } from '../types/store';

interface AdminHomepageQuizManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminHomepageQuizManager: React.FC<AdminHomepageQuizManagerProps> = ({ showToast }) => {
  const { homepageQuizBannerConfig, updateHomepageQuizBannerConfig } = useStore();

  const [form, setForm] = useState<HomepageQuizBannerConfig>({
    enabled: true,
    desktopBanner: '/images/hakkiveda_108_oil_gold.jpg',
    mobileBanner: '/images/hakkiveda_108_oil_gold.jpg',
    heading: 'Find the Right HAKKIVEDA Hair Ritual',
    subheading: 'PERSONALIZED HAIR ANALYSIS',
    description:
      'Answer a few quick questions about your hair type, scalp condition and concerns to receive personalized HAKKIVEDA product recommendations.',
    ctaText: 'START AI HAIR QUIZ',
    ctaAction: 'OPEN_QUIZ',
    imageFit: 'contain',
    desktopFocalPoint: 'center',
    mobileFocalPoint: 'center',
    imageAlignment: 'center',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (homepageQuizBannerConfig) {
      setForm({ ...homepageQuizBannerConfig });
    }
  }, [homepageQuizBannerConfig]);

  const handleChange = (field: keyof HomepageQuizBannerConfig, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDesktopImageUpload = async (file: File) => {
    try {
      setUploadingDesktop(true);
      const url = await uploadFileToServer(file);
      handleChange('desktopBanner', url);
      showToast('Desktop banner uploaded successfully.', 'success');
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleChange('desktopBanner', e.target.result as string);
          showToast('Desktop banner updated locally.', 'info');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingDesktop(false);
    }
  };

  const handleMobileImageUpload = async (file: File) => {
    try {
      setUploadingMobile(true);
      const url = await uploadFileToServer(file);
      handleChange('mobileBanner', url);
      showToast('Mobile banner uploaded successfully.', 'success');
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleChange('mobileBanner', e.target.result as string);
          showToast('Mobile banner updated locally.', 'info');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingMobile(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const success = await updateHomepageQuizBannerConfig(form);
      if (success) {
        showToast('Homepage AI Hair Quiz banner updated & saved to database!', 'success');
      } else {
        showToast('Failed to save settings. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Error saving settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setForm({
      enabled: true,
      desktopBanner: '/images/hakkiveda_108_oil_gold.jpg',
      mobileBanner: '/images/hakkiveda_108_oil_gold.jpg',
      heading: 'Find the Right HAKKIVEDA Hair Ritual',
      subheading: 'PERSONALIZED HAIR ANALYSIS',
      description:
        'Answer a few quick questions about your hair type, scalp condition and concerns to receive personalized HAKKIVEDA product recommendations.',
      ctaText: 'START AI HAIR QUIZ',
      ctaAction: 'OPEN_QUIZ',
      imageFit: 'contain',
      desktopFocalPoint: 'center',
      mobileFocalPoint: 'center',
      imageAlignment: 'center',
    });
    showToast('Form reset to default values.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block mb-1 font-sans">
            Homepage Content Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100">
            Homepage AI Hair Quiz
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Customize the AI Hair Quiz banner displayed on the main homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Banner Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status & Toggle */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-serif-luxury text-slate-100">
                  Banner Display Status
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Toggle to enable or hide the AI Hair Quiz banner on the main homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleChange('enabled', !form.enabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  form.enabled
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/50 hover:bg-rose-900'
                }`}
              >
                {form.enabled ? (
                  <>
                    <ToggleRight className="w-5 h-5 text-emerald-400" />
                    <span>Banner Enabled</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5 text-rose-400" />
                    <span>Banner Disabled</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Banner Images Section */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-5 space-y-5 shadow-md">
            <h3 className="text-sm font-bold font-serif-luxury text-slate-100 border-b border-white/10 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Banner Images</span>
            </h3>

            {/* Desktop Image Upload (1920x700) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  Desktop Banner Image <span className="text-[var(--brand-gold)]">(1920 × 700)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-sans">Recommended size: 1920×700px</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="text"
                  value={form.desktopBanner}
                  onChange={(e) => handleChange('desktopBanner', e.target.value)}
                  placeholder="Image URL or upload file..."
                  className="flex-1 bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />

                <label className="bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingDesktop ? 'Uploading...' : 'Upload Desktop (1920×700)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleDesktopImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {form.desktopBanner && (
                <div className="relative h-28 rounded-xl overflow-hidden border border-white/15 bg-black/40">
                  <img
                    src={form.desktopBanner}
                    alt="Desktop Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded font-sans border border-white/20">
                    Desktop Aspect Ratio
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Image Upload (1080x1350) */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  Mobile Banner Image <span className="text-[var(--brand-gold)]">(1080 × 1350)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-sans">Recommended size: 1080×1350px</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="text"
                  value={form.mobileBanner}
                  onChange={(e) => handleChange('mobileBanner', e.target.value)}
                  placeholder="Image URL or upload file..."
                  className="flex-1 bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />

                <label className="bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingMobile ? 'Uploading...' : 'Upload Mobile (1080×1350)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleMobileImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {form.mobileBanner && (
                <div className="relative h-28 rounded-xl overflow-hidden border border-white/15 bg-black/40">
                  <img
                    src={form.mobileBanner}
                    alt="Mobile Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded font-sans border border-white/20">
                    Mobile Aspect Ratio
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Image Display Options Section */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-5 space-y-4 shadow-md">
            <h3 className="text-sm font-bold font-serif-luxury text-slate-100 border-b border-white/10 pb-3 flex items-center justify-between">
              <span>Image Display & Sizing Controls</span>
              <span className="text-[10px] bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] px-2 py-0.5 rounded font-sans uppercase font-bold">
                Default: Full Image / Contain
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Image Fit Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Image Display Mode
                </label>
                <select
                  value={form.imageFit || 'contain'}
                  onChange={(e) => handleChange('imageFit', e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                >
                  <option value="contain">Full Image / Contain (No Cropping - Recommended)</option>
                  <option value="cover">Crop / Cover (Fill Box)</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  "Full Image / Contain" displays the entire artwork without cutting text or products.
                </span>
              </div>

              {/* Image Alignment */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Image Column Alignment
                </label>
                <select
                  value={form.imageAlignment || 'center'}
                  onChange={(e) => handleChange('imageAlignment', e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                >
                  <option value="center">Center Aligned</option>
                  <option value="left">Left Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>

              {/* Desktop Focal Point */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Desktop Image Focal Point
                </label>
                <select
                  value={form.desktopFocalPoint || 'center'}
                  onChange={(e) => handleChange('desktopFocalPoint', e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* Mobile Focal Point */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mobile Image Focal Point
                </label>
                <select
                  value={form.mobileFocalPoint || 'center'}
                  onChange={(e) => handleChange('mobileFocalPoint', e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-5 space-y-4 shadow-md">
            <h3 className="text-sm font-bold font-serif-luxury text-slate-100 border-b border-white/10 pb-3">
              Banner Text & Messaging
            </h3>

            {/* Subheading / Eyebrow */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Subheading / Eyebrow Tag
              </label>
              <input
                type="text"
                value={form.subheading}
                onChange={(e) => handleChange('subheading', e.target.value)}
                placeholder="e.g. PERSONALIZED HAIR ANALYSIS"
                className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
              />
            </div>

            {/* Heading */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Main Banner Heading *
              </label>
              <input
                type="text"
                required
                value={form.heading}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="e.g. Find the Right HAKKIVEDA Hair Ritual"
                className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans font-bold"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description / Details *
              </label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="e.g. Answer a few questions about your hair, scalp and concerns to receive personalized product recommendations."
                className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
              />
            </div>
          </div>

          {/* CTA Action & Button Section */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-5 space-y-4 shadow-md">
            <h3 className="text-sm font-bold font-serif-luxury text-slate-100 border-b border-white/10 pb-3">
              Button & CTA Action
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CTA Button Text */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  CTA Button Text *
                </label>
                <input
                  type="text"
                  required
                  value={form.ctaText}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  placeholder="e.g. START AI HAIR QUIZ"
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans font-bold"
                />
              </div>

              {/* CTA Button Action */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  CTA Button Action
                </label>
                <select
                  value={form.ctaAction}
                  onChange={(e) => handleChange('ctaAction', e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                >
                  <option value="OPEN_QUIZ">Open existing AI Hair Quiz (Modal)</option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Clicking button opens the existing AI Hair Quiz diagnostic engine.
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-3.5 rounded-2xl font-bold hover:bg-white transition-all shadow-xl text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Update Homepage'}</span>
            </button>
          </div>
        </div>

        {/* Right Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--brand-gold)]" />
                <h3 className="text-sm font-bold font-serif-luxury text-slate-100">Live Banner Preview</h3>
              </div>

              <div className="flex items-center gap-1 bg-[var(--brand-primary-dark)] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    previewDevice === 'desktop'
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    previewDevice === 'mobile'
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {!form.enabled && (
              <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs font-sans text-center">
                ⚠️ Banner is currently <strong>DISABLED</strong> and will not show on the homepage.
              </div>
            )}

            {/* Live Rendered Banner Component Preview */}
            <div
              className={`transition-all duration-300 mx-auto ${
                previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'
              }`}
            >
              <div className="relative bg-gradient-to-br from-[#123F2B] via-[#0E281C] to-[#0A1F16] text-white rounded-2xl overflow-hidden border border-[var(--brand-gold)]/40 p-4 sm:p-5 space-y-4 shadow-xl">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--brand-gold)]/10 rounded-full blur-2xl pointer-events-none" />

                {/* Subheading */}
                {form.subheading && (
                  <div className="inline-flex items-center gap-1.5 bg-[#0E281C]/80 px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/40">
                    <Sparkles className="w-3 h-3 text-[var(--brand-gold)]" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--brand-gold)] font-sans">
                      {form.subheading}
                    </span>
                  </div>
                )}

                {/* Heading */}
                <h4 className="text-base sm:text-lg font-serif-luxury font-bold text-slate-100 leading-snug">
                  {form.heading || 'Find the Right HAKKIVEDA Hair Ritual'}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {form.description || 'Answer a few questions for personalized product recommendations.'}
                </p>

                {/* CTA Button */}
                <div className="pt-1">
                  <div className="bg-[var(--brand-gold)] text-[#0E281C] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md">
                    <Bot className="w-4 h-4" />
                    <span>{form.ctaText || 'START AI HAIR QUIZ'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Image Preview inside Card */}
                <div className="relative rounded-xl overflow-hidden border border-[var(--brand-gold)]/30 mt-2 p-1.5 bg-black/40 flex items-center justify-center">
                  <img
                    src={
                      previewDevice === 'mobile'
                        ? form.mobileBanner || form.desktopBanner || '/images/hakkiveda_108_oil_gold.jpg'
                        : form.desktopBanner || '/images/hakkiveda_108_oil_gold.jpg'
                    }
                    alt="Preview"
                    style={{
                      objectPosition:
                        previewDevice === 'mobile'
                          ? form.mobileFocalPoint || 'center'
                          : form.desktopFocalPoint || 'center',
                    }}
                    className={`w-full h-auto max-h-48 ${
                      form.imageFit === 'cover' ? 'object-cover' : 'object-contain'
                    } rounded-lg`}
                  />
                  <div className="absolute bottom-2 left-2 bg-[#0E281C]/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-[var(--brand-gold)] font-serif border border-white/10 pointer-events-none">
                    {previewDevice === 'mobile' ? 'Mobile View' : 'Desktop View'} ({form.imageFit === 'cover' ? 'Crop/Cover' : 'Full Image/Contain'})
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-white/10 pt-2 font-sans">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>100% Hakki-Pikki Herbal Formulations</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans text-center">
              Changes reflect immediately on the homepage upon clicking "Save Banner Settings".
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
