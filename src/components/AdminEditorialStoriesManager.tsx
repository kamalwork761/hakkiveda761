import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { uploadFileToServer } from '../utils/upload';
import {
  Upload,
  Save,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  Link2,
} from 'lucide-react';
import { HomepageEditorialConfig, HomepageEditorialSectionItem } from '../types/store';
import { INITIAL_HOMEPAGE_EDITORIAL_CONFIG } from '../data/initialData';

interface AdminEditorialStoriesManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminEditorialStoriesManager: React.FC<AdminEditorialStoriesManagerProps> = ({ showToast }) => {
  const { homepageEditorialConfig, updateHomepageEditorialConfig } = useStore();

  const [form, setForm] = useState<HomepageEditorialConfig>(() => ({
    section1: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section1, ...(homepageEditorialConfig?.section1 || {}) },
    section2: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section2, ...(homepageEditorialConfig?.section2 || {}) },
    section3: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section3, ...(homepageEditorialConfig?.section3 || {}) },
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'section1' | 'section2' | 'section3'>('section1');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [uploadingImage, setUploadingImage] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (homepageEditorialConfig) {
      setForm({
        section1: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section1, ...(homepageEditorialConfig.section1 || {}) },
        section2: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section2, ...(homepageEditorialConfig.section2 || {}) },
        section3: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section3, ...(homepageEditorialConfig.section3 || {}) },
      });
    }
  }, [homepageEditorialConfig]);

  const handleSectionChange = (sectionKey: 'section1' | 'section2' | 'section3', field: keyof HomepageEditorialSectionItem, value: any) => {
    setForm((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleImageUpload = async (sectionKey: 'section1' | 'section2' | 'section3', file: File) => {
    try {
      setUploadingImage((prev) => ({ ...prev, [sectionKey]: true }));
      const url = await uploadFileToServer(file);
      handleSectionChange(sectionKey, 'image', url);
      showToast('Image uploaded successfully.', 'success');
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleSectionChange(sectionKey, 'image', e.target.result as string);
          showToast('Image updated locally.', 'info');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage((prev) => ({ ...prev, [sectionKey]: false }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateHomepageEditorialConfig(form);
      showToast('Homepage Editorial Story sections updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_HOMEPAGE_EDITORIAL_CONFIG);
    showToast('Reset form to initial defaults. Click Save to publish.', 'info');
  };

  const currentSection = form[activeTab];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--brand-primary-deep)] p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] border border-[var(--brand-gold)]/20">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold font-serif-luxury text-white">
              Homepage Editorial Story Sections
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            Configure the 3 editorial brand narrative blocks on the homepage (Rooted in Tribal Wisdom, Inside HAKKIVEDA, The HAKKIVEDA Story).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-white/20 text-slate-200 hover:bg-white/5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-[var(--brand-gold-light)] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('section1')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
            activeTab === 'section1'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md font-bold'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>Section 1: Rooted in Tribal Wisdom</span>
          {form.section1.enabled ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('section2')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
            activeTab === 'section2'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md font-bold'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>Section 2: Inside HAKKIVEDA</span>
          {form.section2.enabled ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('section3')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
            activeTab === 'section3'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md font-bold'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>Section 3: The HAKKIVEDA Story</span>
          {form.section3.enabled ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-slate-500" />
          )}
        </button>
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-[var(--brand-primary-deep)] p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Edit {activeTab === 'section1' ? 'Section 1' : activeTab === 'section2' ? 'Section 2' : 'Section 3'}
            </h3>
            
            <button
              onClick={() => handleSectionChange(activeTab, 'enabled', !currentSection.enabled)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-200"
            >
              <span>Status:</span>
              {currentSection.enabled ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                  <ToggleRight className="w-5 h-5" /> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <ToggleLeft className="w-5 h-5" /> Disabled
                </span>
              )}
            </button>
          </div>

          {/* Eyebrow */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Small Eyebrow Label
            </label>
            <input
              type="text"
              value={currentSection.eyebrow}
              onChange={(e) => handleSectionChange(activeTab, 'eyebrow', e.target.value)}
              placeholder="e.g. OUR ROOTS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--brand-gold)] focus:outline-none"
            />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Section Heading
            </label>
            <input
              type="text"
              value={currentSection.heading}
              onChange={(e) => handleSectionChange(activeTab, 'heading', e.target.value)}
              placeholder="e.g. ROOTED IN TRIBAL WISDOM"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--brand-gold)] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Story Paragraph
            </label>
            <textarea
              rows={4}
              value={currentSection.description}
              onChange={(e) => handleSectionChange(activeTab, 'description', e.target.value)}
              placeholder="Enter editorial description..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--brand-gold)] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Image & Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Section Image URL / Upload
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentSection.image}
                onChange={(e) => handleSectionChange(activeTab, 'image', e.target.value)}
                placeholder="/images/hero_tribal_elders.jpg"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--brand-gold)] focus:outline-none"
              />
              <label className="px-4 py-2.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase cursor-pointer hover:bg-[var(--brand-gold-light)] flex items-center gap-1.5 transition-all">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(activeTab, file);
                  }}
                  className="hidden"
                />
              </label>
            </div>
            {uploadingImage[activeTab] && (
              <p className="text-[11px] text-[var(--brand-gold)]">Uploading image...</p>
            )}
          </div>

          {/* Image Alt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Image Alt Description (SEO)
            </label>
            <input
              type="text"
              value={currentSection.imageAlt || ''}
              onChange={(e) => handleSectionChange(activeTab, 'imageAlt', e.target.value)}
              placeholder="Descriptive alt text for image"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--brand-gold)] focus:outline-none"
            />
          </div>

          {/* CTA Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Button Text
              </label>
              <input
                type="text"
                value={currentSection.ctaText}
                onChange={(e) => handleSectionChange(activeTab, 'ctaText', e.target.value)}
                placeholder="KNOW MORE →"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--brand-gold)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Destination Link URL
              </label>
              <input
                type="text"
                value={currentSection.ctaLink}
                onChange={(e) => handleSectionChange(activeTab, 'ctaLink', e.target.value)}
                placeholder="/our-tribal-roots"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--brand-gold)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between bg-[var(--brand-primary-deep)] px-4 py-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Eye className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>LIVE PREVIEW</span>
            </div>

            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded ${
                  previewDevice === 'desktop' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded ${
                  previewDevice === 'mobile' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            className={`mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl p-5 transition-all ${
              previewDevice === 'mobile' ? 'max-w-[340px]' : 'w-full'
            }`}
          >
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/20">
                <img
                  src={currentSection.image || '/images/hero_tribal_elders.jpg'}
                  alt={currentSection.heading}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-left">
                <span className="inline-block text-[10px] font-bold tracking-widest text-[var(--brand-gold)] uppercase bg-[var(--brand-gold)]/10 px-2.5 py-0.5 rounded-full border border-[var(--brand-gold)]/20">
                  {currentSection.eyebrow || 'OUR ROOTS'}
                </span>

                <h4 className="font-serif text-lg font-bold text-[var(--color-heading)] leading-snug">
                  {currentSection.heading || 'ROOTED IN TRIBAL WISDOM'}
                </h4>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
                  {currentSection.description}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[11px] font-bold tracking-wider uppercase">
                    <span>{currentSection.ctaText || 'KNOW MORE →'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
