import React, { useState } from 'react';
import {
  Layers,
  Save,
  Upload,
  Video,
  Eye,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Monitor,
  Tablet,
  Smartphone,
  Globe,
  HelpCircle,
  Sparkles,
  Type,
  Image as ImageIcon,
  Sliders,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryPageConfig, CategoryPageSection } from '../types/store';
import { uploadFileToServer } from '../utils/upload';

export const AdminCategoryPageManager: React.FC = () => {
  const { categoryPages, updateCategoryPage, products } = useStore();

  const [selectedCatId, setSelectedCatId] = useState<string>('hair-care');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'sections' | 'seo' | 'cards'>('general');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Active page config
  const activeConfig = categoryPages.find((c) => c.id === selectedCatId) || categoryPages[0];

  if (!activeConfig) {
    return (
      <div className="p-8 text-center text-gray-500">
        No category pages configured. Please refresh or reset to defaults.
      </div>
    );
  }

  const handleFieldChange = (field: keyof CategoryPageConfig, value: any) => {
    updateCategoryPage(activeConfig.id, { [field]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof CategoryPageConfig) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotification({
        type: 'error',
        message: 'Please select a valid image file (JPG, PNG, WEBP, GIF).',
      });
      return;
    }

    try {
      setUploadingField(fieldName as string);
      const url = await uploadFileToServer(file);

      // Requirement 4 & 5: Ensure image URL has cache-busting timestamp parameter
      const timestamp = Date.now();
      const freshUrl = url.includes('?') ? `${url}&v=${timestamp}` : `${url}?v=${timestamp}`;

      handleFieldChange(fieldName, freshUrl);
      setNotification({
        type: 'success',
        message: `Successfully uploaded "${file.name}"! Image preview updated instantly.`,
      });
    } catch (err: any) {
      // Requirement 3: Display error message on upload failure
      setNotification({
        type: 'error',
        message: `Upload failed: ${err.message || 'Error uploading image to server.'}`,
      });
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setNotification(null);
    try {
      const timestamp = Date.now();
      // Ensure activeConfig cardImage has fresh timestamp parameter if present
      let finalCardImage = activeConfig.cardImage;
      if (finalCardImage && !finalCardImage.startsWith('data:')) {
        const cleanUrl = finalCardImage.split('?')[0];
        finalCardImage = `${cleanUrl}?v=${timestamp}`;
      }

      const updatedConfig: CategoryPageConfig = {
        ...activeConfig,
        cardImage: finalCardImage || activeConfig.cardImage,
      };

      const success = await updateCategoryPage(activeConfig.id, updatedConfig);
      
      if (success !== false) {
        setSaveSuccess(true);
        setNotification({
          type: 'success',
          message: `Homepage Category Card image & page configuration saved successfully to database!`,
        });
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error('Failed to update database');
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Save failed: ${err.message || 'Error saving category page'}`,
      });
    } finally {
      setSaving(false);
    }
  };

  // Section CRUD
  const handleToggleSection = (sectionId: string) => {
    const updatedSections = activeConfig.sections.map((s) =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    handleFieldChange('sections', updatedSections);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...activeConfig.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-index displayOrder
    const ordered = newSections.map((sec, idx) => ({ ...sec, displayOrder: idx + 1 }));
    handleFieldChange('sections', ordered);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm('Are you sure you want to remove this content section?')) return;
    const updatedSections = activeConfig.sections.filter((s) => s.id !== sectionId);
    handleFieldChange('sections', updatedSections);
  };

  const handleAddSection = (type: string) => {
    const newSec: CategoryPageSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: `New ${type.toUpperCase()} Section`,
      subtitle: '',
      enabled: true,
      displayOrder: activeConfig.sections.length + 1,
      items: [],
    };
    handleFieldChange('sections', [...activeConfig.sections, newSec]);
  };

  const handleSectionTitleChange = (sectionId: string, title: string) => {
    const updated = activeConfig.sections.map((s) => (s.id === sectionId ? { ...s, title } : s));
    handleFieldChange('sections', updated);
  };

  // Filter products for preview
  const previewProducts = products.filter((p) => {
    return (
      p.primaryCategory === activeConfig.id ||
      (activeConfig.id === 'hair-care' && (p.category.includes('Hair') || p.name.includes('Hair') || p.name.includes('Oil'))) ||
      (activeConfig.id === 'skin-care' && (p.category.includes('Skin') || p.name.includes('Lepa') || p.name.includes('Powder'))) ||
      (activeConfig.id === 'tribal-wellness' && (p.category.includes('Wellness') || p.name.includes('Kit') || p.name.includes('Combo')))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Category Selector */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-1">
            <Layers className="w-4 h-4" /> Website & Content &rarr; Category Pages
          </div>
          <h2 className="text-2xl font-serif font-bold text-emerald-950">
            Category Page Manager
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Customize hero banners, videos, SEO metadata, and routine sections for dynamic category landing pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <span className="animate-spin text-white">⏳</span>
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4 text-amber-300" />
            )}
            <span>{saveSuccess ? 'Saved & Synced!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Top Notification Toast / Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-2 border-emerald-500/50'
              : 'bg-rose-950/90 text-rose-200 border-2 border-rose-500/50'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-75 hover:opacity-100 font-extrabold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Tabs & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-900/5 p-2 rounded-xl border border-emerald-900/10">
        <div className="flex items-center gap-2">
          {categoryPages.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                selectedCatId === cat.id
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-800/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cat.enabled ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span>{cat.categoryName || cat.title}</span>
              <span className="text-[10px] opacity-70 uppercase tracking-wider">({cat.slug})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <span>Status:</span>
          <button
            onClick={() => handleFieldChange('enabled', !activeConfig.enabled)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              activeConfig.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {activeConfig.enabled ? 'ENABLED (LIVE)' : 'DISABLED (OFFLINE)'}
          </button>
        </div>
      </div>

      {/* Main Grid: Controls vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-1">
            {[
              { id: 'general', label: 'General & Title', icon: Type },
              { id: 'hero', label: 'Hero & Media', icon: ImageIcon },
              { id: 'cards', label: 'Homepage Card', icon: Sliders },
              { id: 'sections', label: 'Content Sections', icon: Layers },
              { id: 'seo', label: 'SEO & Meta', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-t-lg text-xs font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-900 text-white border-b-2 border-amber-400'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-800" /> Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category Title</label>
                  <input
                    type="text"
                    value={activeConfig.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                    placeholder="e.g. Hair Care Formulations"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={activeConfig.displayOrder}
                    onChange={(e) => handleFieldChange('displayOrder', parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Short Category Introduction</label>
                <textarea
                  rows={3}
                  value={activeConfig.shortDescription}
                  onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:outline-none"
                  placeholder="A brief overview of this category's formulations..."
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">Category Page URL Route:</span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  /{activeConfig.slug}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & MEDIA */}
          {activeTab === 'hero' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-800" /> Hero Media & Visual Styling
              </h3>

              {/* Desktop Hero Image */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Desktop Hero Image</label>
                <div className="flex items-center gap-3">
                  {activeConfig.desktopHeroImage && (
                    <img
                      src={activeConfig.desktopHeroImage}
                      alt="Hero Desktop"
                      className="w-20 h-12 object-cover rounded border border-gray-200"
                    />
                  )}
                  <input
                    type="text"
                    value={activeConfig.desktopHeroImage}
                    onChange={(e) => handleFieldChange('desktopHeroImage', e.target.value)}
                    className="flex-1 text-xs p-2 border border-gray-300 rounded-lg"
                    placeholder="/images/hero_tribal_elders.jpg"
                  />
                  <label className="bg-emerald-900 hover:bg-emerald-950 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'desktopHeroImage' ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'desktopHeroImage')}
                    />
                  </label>
                </div>
              </div>

              {/* Mobile Hero Image */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Hero Image</label>
                <div className="flex items-center gap-3">
                  {activeConfig.mobileHeroImage && (
                    <img
                      src={activeConfig.mobileHeroImage}
                      alt="Hero Mobile"
                      className="w-12 h-16 object-cover rounded border border-gray-200"
                    />
                  )}
                  <input
                    type="text"
                    value={activeConfig.mobileHeroImage}
                    onChange={(e) => handleFieldChange('mobileHeroImage', e.target.value)}
                    className="flex-1 text-xs p-2 border border-gray-300 rounded-lg"
                    placeholder="/images/hero_tribal_elders.jpg"
                  />
                  <label className="bg-emerald-900 hover:bg-emerald-950 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'mobileHeroImage' ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'mobileHeroImage')}
                    />
                  </label>
                </div>
              </div>

              {/* Hero Video MP4 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Optional Hero Background Video (MP4)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={activeConfig.heroVideo || ''}
                    onChange={(e) => handleFieldChange('heroVideo', e.target.value)}
                    className="flex-1 text-xs p-2 border border-gray-300 rounded-lg"
                    placeholder="https://.../video.mp4"
                  />
                  <label className="bg-emerald-900 hover:bg-emerald-950 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Video className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'heroVideo' ? 'Uploading MP4...' : 'Upload MP4'}</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'heroVideo')}
                    />
                  </label>
                </div>
              </div>

              {/* Hero Image Fit & Focal Point */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Image Fit Mode</label>
                  <select
                    value={activeConfig.heroObjectFit || 'cover'}
                    onChange={(e) => handleFieldChange('heroObjectFit', e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="cover">Cover (Fill container smoothly)</option>
                    <option value="contain">Contain (Show 100% full image without cropping)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hero Focal Point / Position</label>
                  <select
                    value={activeConfig.heroFocalPoint || 'center'}
                    onChange={(e) => handleFieldChange('heroFocalPoint', e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="center">Center Center</option>
                    <option value="left">Left Center</option>
                    <option value="right">Right Center</option>
                    <option value="top">Center Top</option>
                    <option value="bottom">Center Bottom</option>
                  </select>
                </div>
              </div>

              {/* Desktop & Mobile Heights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Desktop Hero Height</label>
                  <select
                    value={activeConfig.heroHeightDesktop || '600px'}
                    onChange={(e) => handleFieldChange('heroHeightDesktop', e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="550px">550px (Compact Desktop)</option>
                    <option value="600px">600px (Standard Desktop - Recommended)</option>
                    <option value="650px">650px (Tall Desktop)</option>
                    <option value="700px">700px (Max Immersive Desktop)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Hero Height</label>
                  <select
                    value={activeConfig.heroHeightMobile || '480px'}
                    onChange={(e) => handleFieldChange('heroHeightMobile', e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="380px">380px (Compact Mobile)</option>
                    <option value="420px">420px (Medium Mobile)</option>
                    <option value="480px">480px (Standard Mobile - Recommended)</option>
                    <option value="540px">540px (Tall Mobile)</option>
                  </select>
                </div>
              </div>

              {/* Overlay Opacity & Text Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Dark Overlay Opacity ({activeConfig.heroOverlayOpacity}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeConfig.heroOverlayOpacity}
                    onChange={(e) => handleFieldChange('heroOverlayOpacity', parseInt(e.target.value))}
                    className="w-full accent-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hero Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeConfig.heroTextColor || '#FFFFFF'}
                      onChange={(e) => handleFieldChange('heroTextColor', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={activeConfig.heroTextColor || '#FFFFFF'}
                      onChange={(e) => handleFieldChange('heroTextColor', e.target.value)}
                      className="flex-1 text-xs p-2 border border-gray-300 rounded-lg font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={activeConfig.ctaText}
                    onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg"
                    placeholder="Explore Hair Care"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">CTA Button Link</label>
                  <input
                    type="text"
                    value={activeConfig.ctaLink}
                    onChange={(e) => handleFieldChange('ctaLink', e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg"
                    placeholder="#products"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOMEPAGE CARD */}
          {activeTab === 'cards' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-800" /> Homepage "Shop by Category" Card Manager
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Upload and manage the card image & button text displayed in the "Shop by Category" grid on the main homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Card Image'}</span>
                </button>
              </div>

              {/* Card Image Upload & URL Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Homepage Card Image <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {activeConfig.cardImage ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 bg-white shrink-0 group">
                      <img
                        src={activeConfig.cardImage}
                        alt="Card Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                        Live Preview
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 bg-white">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={activeConfig.cardImage || ''}
                      onChange={(e) => handleFieldChange('cardImage', e.target.value)}
                      placeholder="/images/hakkiveda_108_oil_gold.jpg or https://..."
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    />
                    <p className="text-[10px] text-gray-500 font-mono">
                      Recommended aspect ratio: 4:3 or 16:9 (High Resolution JPG/PNG/WEBP)
                    </p>
                  </div>

                  <label className="bg-emerald-900 hover:bg-emerald-950 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition shadow">
                    {uploadingField === 'cardImage' ? (
                      <span className="animate-spin text-white">⏳</span>
                    ) : (
                      <Upload className="w-4 h-4 text-amber-300" />
                    )}
                    <span>{uploadingField === 'cardImage' ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'cardImage')}
                    />
                  </label>
                </div>
              </div>

              {/* Card CTA Text */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Homepage Card CTA Button Text
                </label>
                <input
                  type="text"
                  value={activeConfig.cardCtaText || ''}
                  onChange={(e) => handleFieldChange('cardCtaText', e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  placeholder="e.g. Shop Hair Care"
                />
              </div>

              {/* Save Prompt Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
                <span className="font-medium">
                  ✨ Image changes reflect in the Live Preview instantly. Click <strong>Save Card Image</strong> to persist permanently to the database.
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 cursor-pointer"
                >
                  Save & Sync DB
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECTIONS */}
          {activeTab === 'sections' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-800" /> Page Content Sections Manager
                </h3>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => handleAddSection('faq')}
                    className="bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> FAQ
                  </button>
                  <button
                    onClick={() => handleAddSection('routine')}
                    className="bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Routine
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {activeConfig.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`p-4 rounded-xl border transition ${
                      section.enabled
                        ? 'bg-emerald-50/30 border-emerald-900/15'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900 text-white px-2 py-0.5 rounded">
                          {section.type}
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                          className="text-xs font-bold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 flex-1"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleSection(section.id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            section.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {section.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => handleMoveSection(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(index, 'down')}
                          disabled={index === activeConfig.sections.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SEO */}
          {activeTab === 'seo' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-800" /> SEO & Social Share Metadata
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">SEO Title Tag</label>
                <input
                  type="text"
                  value={activeConfig.seoTitle}
                  onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={activeConfig.seoDescription}
                  onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Open Graph Image (OG Image)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={activeConfig.ogImage}
                    onChange={(e) => handleFieldChange('ogImage', e.target.value)}
                    className="flex-1 text-xs p-2 border border-gray-300 rounded-lg"
                  />
                  <label className="bg-emerald-900 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'ogImage')}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-gray-900 p-4 rounded-2xl text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Live Preview</span>
              </div>

              {/* Device Viewport Selector */}
              <div className="flex items-center bg-gray-800 p-1 rounded-lg border border-gray-700 gap-1">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-amber-400 text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Desktop 100%"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded transition cursor-pointer ${
                    previewDevice === 'tablet' ? 'bg-amber-400 text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Tablet 768px"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-amber-400 text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Mobile 375px"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Homepage Category Card Live Preview */}
            <div
              className={`p-4 bg-[#123F2B] rounded-xl border-2 transition-all ${
                activeTab === 'cards' ? 'border-amber-400 shadow-xl' : 'border-emerald-800/80'
              }`}
            >
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2 mb-3">
                <span className="text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Homepage Category Card Live Preview
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                  Live Sync
                </span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl max-w-[280px] mx-auto text-slate-900">
                <div className="h-40 overflow-hidden relative w-full bg-gray-100">
                  {activeConfig.cardImage ? (
                    <img
                      key={activeConfig.cardImage}
                      src={activeConfig.cardImage}
                      alt={activeConfig.categoryName}
                      className="w-full h-full object-cover transition-all"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-xs">
                      No card image set
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="bg-[#123F2B]/90 text-[var(--brand-gold,#D4AF37)] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/40 shadow">
                      Botanical Category
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2 bg-white">
                  <h3 className="text-sm font-serif font-bold text-[#123F2B] flex items-center justify-between">
                    <span>{activeConfig.categoryName || 'Category Name'}</span>
                    <span className="text-[11px] text-[#B8891E] font-sans font-bold">&rarr;</span>
                  </h3>
                  <p className="text-[10px] text-[#405B4A] line-clamp-2 leading-relaxed">
                    {activeConfig.shortDescription || 'Authentic herbal hair & skincare formulations.'}
                  </p>

                  <div className="pt-1">
                    <div className="w-full py-1.5 bg-[#123F2B] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider text-center shadow">
                      {activeConfig.cardCtaText || 'Shop Category'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Canvas Frame */}
            <div
              className={`mx-auto bg-[#0E281C] text-white rounded-xl overflow-hidden border border-emerald-800 transition-all duration-300 ${
                previewDevice === 'mobile'
                  ? 'max-w-[340px] text-[11px]'
                  : previewDevice === 'tablet'
                  ? 'max-w-[500px] text-[12px]'
                  : 'w-full text-xs'
              }`}
            >
              {!activeConfig.enabled ? (
                <div className="p-8 text-center bg-red-950/80 text-red-200">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="font-bold">Page Currently Offline</p>
                  <p className="text-[10px] opacity-75 mt-1">
                    This category page is set to disabled in admin settings.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pb-6">
                  {/* Hero Banner Preview */}
                  <div
                    className="relative w-full overflow-hidden flex items-center justify-center p-4 text-center transition-all duration-300"
                    style={{
                      height: previewDevice === 'mobile' ? '240px' : previewDevice === 'tablet' ? '300px' : '360px',
                    }}
                  >
                    {/* Background media */}
                    {activeConfig.heroVideo ? (
                      <video
                        src={activeConfig.heroVideo}
                        autoPlay
                        loop
                        muted
                        className="absolute inset-0 w-full h-full"
                        style={{
                          objectFit: (activeConfig.heroObjectFit as any) || 'cover',
                          objectPosition: activeConfig.heroFocalPoint || 'center',
                        }}
                      />
                    ) : (
                      <img
                        src={
                          previewDevice === 'mobile'
                            ? activeConfig.mobileHeroImage || activeConfig.desktopHeroImage
                            : activeConfig.desktopHeroImage
                        }
                        alt="Hero background"
                        className="absolute inset-0 w-full h-full"
                        style={{
                          objectFit: (activeConfig.heroObjectFit as any) || 'cover',
                          objectPosition: activeConfig.heroFocalPoint || 'center',
                        }}
                      />
                    )}

                    {/* Dark Overlay */}
                    <div
                      className="absolute inset-0 bg-black"
                      style={{ opacity: activeConfig.heroOverlayOpacity / 100 }}
                    />

                    {/* Hero Text */}
                    <div className="relative z-10 space-y-2" style={{ color: activeConfig.heroTextColor || '#FFFFFF' }}>
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400 text-gray-950 px-2 py-0.5 rounded-full">
                        {activeConfig.categoryName}
                      </span>
                      <h1 className="text-lg font-serif font-bold leading-tight">
                        {activeConfig.title}
                      </h1>
                      <p className="text-[10px] line-clamp-2 max-w-xs mx-auto opacity-90">
                        {activeConfig.shortDescription}
                      </p>
                      <button className="bg-[var(--brand-gold,#D4AF37)] text-emerald-950 px-3 py-1 rounded-full text-[10px] font-bold mt-2">
                        {activeConfig.ctaText || 'Explore Products'}
                      </button>
                    </div>
                  </div>

                  {/* Product Grid Preview */}
                  <div className="px-4">
                    <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 border-b border-emerald-800 pb-1">
                      Category Products ({previewProducts.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {previewProducts.slice(0, 4).map((p) => (
                        <div key={p.id} className="bg-emerald-950/80 p-2 rounded border border-emerald-800 text-[10px]">
                          <img src={p.image} alt={p.name} className="w-full h-16 object-cover rounded mb-1" />
                          <p className="font-bold truncate">{p.name}</p>
                          <p className="text-amber-400 font-bold">₹{p.priceINR}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Content Sections Preview */}
                  <div className="px-4 space-y-3 pt-2">
                    {activeConfig.sections
                      .filter((s) => s.enabled)
                      .map((sec) => (
                        <div key={sec.id} className="p-2.5 rounded bg-emerald-900/40 border border-emerald-800/60">
                          <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                            {sec.type}: {sec.title}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
