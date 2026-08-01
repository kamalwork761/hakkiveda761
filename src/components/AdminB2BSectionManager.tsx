import React, { useState, useEffect } from 'react';
import { formatAdminINR } from '../utils/adminCurrency';
import {
  Building2,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Upload,
  Image as ImageIcon,
  Palette,
  Package,
  Globe,
  Tag,
  Truck,
  ShieldCheck,
  Headphones,
  FileCheck,
  Award,
  Sparkles,
  Star,
  Lock,
  ArrowUp,
  ArrowDown,
  X,
  Edit2,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { B2BSectionConfig, B2BFeature } from '../types/store';

const AVAILABLE_ICONS = [
  { name: 'Package', label: 'Package / Drum', icon: Package },
  { name: 'FileCheck', label: 'Documents / Certificate', icon: FileCheck },
  { name: 'Tag', label: 'Wholesale Tag', icon: Tag },
  { name: 'Truck', label: 'Shipping / Freight', icon: Truck },
  { name: 'ShieldCheck', label: 'Security / Quality', icon: ShieldCheck },
  { name: 'Headphones', label: 'Support / Account Manager', icon: Headphones },
  { name: 'Building2', label: 'Company / OEM', icon: Building2 },
  { name: 'Globe', label: 'Global / Export', icon: Globe },
  { name: 'Award', label: 'Certified Standard', icon: Award },
  { name: 'Sparkles', label: 'Ayurvedic Formulations', icon: Sparkles },
  { name: 'Star', label: 'Premium Quality', icon: Star },
  { name: 'Lock', label: 'Secure Packaging', icon: Lock },
];

export const AdminB2BSectionManager: React.FC = () => {
  const { b2bSectionConfig, updateB2BSectionConfig, products, formatPrice } = useStore();

  const [formState, setFormState] = useState<B2BSectionConfig>(b2bSectionConfig);
  const [activeTab, setActiveTab] = useState<'content' | 'features' | 'products' | 'countries' | 'theme' | 'preview'>('content');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Feature Edit Modal state
  const [editingFeature, setEditingFeature] = useState<B2BFeature | null>(null);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [featTitle, setFeatTitle] = useState('');
  const [featDesc, setFeatDesc] = useState('');
  const [featIcon, setFeatIcon] = useState('Package');
  const [featSortOrder, setFeatSortOrder] = useState(1);

  // Country Input state
  const [newCountryInput, setNewCountryInput] = useState('');

  // Sync state when b2bSectionConfig updates externally
  useEffect(() => {
    if (b2bSectionConfig) {
      setFormState(b2bSectionConfig);
    }
  }, [b2bSectionConfig]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateB2BSectionConfig(formState);
    setSaving(false);
    if (success) {
      showToast('✓ B2B Section Manager settings saved permanently!');
    } else {
      showToast('❌ Failed to save settings to database.');
    }
  };

  // Banner & Background Image Upload Handlers
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'bannerImage' | 'backgroundImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormState((prev) => ({
        ...prev,
        [field]: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Feature Handlers
  const handleOpenAddFeature = () => {
    setEditingFeature(null);
    setFeatTitle('');
    setFeatDesc('');
    setFeatIcon('Package');
    setFeatSortOrder((formState.features?.length || 0) + 1);
    setFeatureModalOpen(true);
  };

  const handleOpenEditFeature = (feat: B2BFeature) => {
    setEditingFeature(feat);
    setFeatTitle(feat.title);
    setFeatDesc(feat.description);
    setFeatIcon(feat.icon);
    setFeatSortOrder(feat.sortOrder || 1);
    setFeatureModalOpen(true);
  };

  const handleSaveFeature = () => {
    if (!featTitle.trim()) return;

    if (editingFeature) {
      // Update
      setFormState((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.id === editingFeature.id
            ? {
                ...f,
                title: featTitle.trim(),
                description: featDesc.trim(),
                icon: featIcon,
                sortOrder: featSortOrder,
              }
            : f
        ),
      }));
    } else {
      // Add
      const newFeat: B2BFeature = {
        id: `feat-${Date.now()}`,
        title: featTitle.trim(),
        description: featDesc.trim(),
        icon: featIcon,
        sortOrder: featSortOrder,
      };
      setFormState((prev) => ({
        ...prev,
        features: [...prev.features, newFeat],
      }));
    }

    setFeatureModalOpen(false);
  };

  const handleDeleteFeature = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    const nextFeatures = [...formState.features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextFeatures.length) return;

    const temp = nextFeatures[index];
    nextFeatures[index] = nextFeatures[targetIndex];
    nextFeatures[targetIndex] = temp;

    // Re-assign sortOrder
    nextFeatures.forEach((f, i) => (f.sortOrder = i + 1));

    setFormState((prev) => ({
      ...prev,
      features: nextFeatures,
    }));
  };

  // Product Selection Handlers
  const toggleProductSelection = (productId: string) => {
    setFormState((prev) => {
      const exists = prev.selectedProductIds?.includes(productId);
      const updated = exists
        ? prev.selectedProductIds.filter((id) => id !== productId)
        : [...(prev.selectedProductIds || []), productId];
      return { ...prev, selectedProductIds: updated };
    });
  };

  // Country Coverage Handlers
  const handleAddCountry = () => {
    const name = newCountryInput.trim();
    if (!name) return;
    if (formState.supportedCountries?.includes(name)) {
      setNewCountryInput('');
      return;
    }
    setFormState((prev) => ({
      ...prev,
      supportedCountries: [...(prev.supportedCountries || []), name],
    }));
    setNewCountryInput('');
  };

  const handleRemoveCountry = (countryName: string) => {
    setFormState((prev) => ({
      ...prev,
      supportedCountries: prev.supportedCountries.filter((c) => c !== countryName),
    }));
  };

  const quickAddCountries = [
    'India',
    'Singapore',
    'Malaysia',
    'Fiji',
    'Mauritius',
    'UAE',
    'USA',
    'United Kingdom',
    'Germany',
    'Australia',
    'Canada',
    'Japan',
  ];

  return (
    <div className="space-y-8 font-sans text-slate-100 pb-12">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs px-5 py-3 rounded-xl shadow-2xl animate-fade-in border border-white/20 flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)]">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-slate-100 flex items-center gap-2">
                <span>📦 B2B Section Manager</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Customize the homepage bulk distribution & spa export marketing section in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Section Enable/Disable Switch */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl">
            <span className="text-xs font-bold text-slate-200">
              Section Status:
            </span>
            <button
              type="button"
              onClick={() =>
                setFormState((prev) => ({ ...prev, enabled: !prev.enabled }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formState.enabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formState.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-[10px] font-bold uppercase ${formState.enabled ? 'text-emerald-400' : 'text-slate-400'}`}>
              {formState.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-amber-300 active:scale-98 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'content', label: '📝 Content & Banner' },
          { id: 'features', label: `⚡ Key Features (${formState.features?.length || 0})` },
          { id: 'products', label: `📦 Product Showcase (${formState.selectedProductIds?.length || 0})` },
          { id: 'countries', label: `🌍 Country Coverage (${formState.supportedCountries?.length || 0})` },
          { id: 'theme', label: '🎨 Theme & Colors' },
          { id: 'preview', label: '📱 Live Preview' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-lg'
                : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CONTENT & BANNER */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Form */}
          <div className="lg:col-span-7 bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)] border-b border-white/10 pb-3">
              Wholesale Heading & Copywriting
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Badge / Tagline Text
              </label>
              <input
                type="text"
                value={formState.badgeText}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, badgeText: e.target.value }))
                }
                placeholder="e.g. WHOLESALE & EXPORT PARTNERSHIPS"
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Main Section Heading *
              </label>
              <input
                type="text"
                value={formState.heading}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, heading: e.target.value }))
                }
                placeholder="e.g. Partner with HAKKIVEDA for Bulk Distribution & Spa Supply"
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 font-bold focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Subheading
              </label>
              <input
                type="text"
                value={formState.subheading}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, subheading: e.target.value }))
                }
                placeholder="e.g. Direct Factory Supply & Custom Private Label Formulation"
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description Paragraph
              </label>
              <textarea
                rows={4}
                value={formState.description}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter description text about export certifications, formulations, spa networks..."
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={formState.ctaText}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, ctaText: e.target.value }))
                  }
                  placeholder="e.g. Submit Export Enquiry"
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  CTA Button URL / Action
                </label>
                <input
                  type="text"
                  value={formState.ctaUrl}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, ctaUrl: e.target.value }))
                  }
                  placeholder="#b2b (Opens Enquiry Modal)"
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Use '#b2b' to trigger the built-in commercial proposal modal window.
                </span>
              </div>
            </div>
          </div>

          {/* Banner & Background Images */}
          <div className="lg:col-span-5 space-y-6">
            {/* Side Banner Card */}
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)] border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Side Banner Image</span>
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </h3>

              {formState.bannerImage ? (
                <div className="relative h-48 rounded-xl overflow-hidden border border-white/20 group">
                  <img
                    src={formState.bannerImage}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <label className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      Replace Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'bannerImage')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({ ...prev, bannerImage: '' }))
                      }
                      className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/20 hover:border-[var(--brand-gold)] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-black/20">
                  <Upload className="w-8 h-8 text-[var(--brand-gold)] mb-2" />
                  <span className="text-xs font-bold text-slate-200">
                    Upload Side Banner Image
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'bannerImage')}
                  />
                </label>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Or Paste Image URL:
                </label>
                <input
                  type="text"
                  value={formState.bannerImage}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, bannerImage: e.target.value }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>
            </div>

            {/* Background Texture Card */}
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)] border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Background Image / Texture</span>
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </h3>

              {formState.backgroundImage ? (
                <div className="relative h-36 rounded-xl overflow-hidden border border-white/20 group">
                  <img
                    src={formState.backgroundImage}
                    alt="Background Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <label className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      Replace Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'backgroundImage')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({ ...prev, backgroundImage: '' }))
                      }
                      className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/20 hover:border-[var(--brand-gold)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-black/20">
                  <Upload className="w-6 h-6 text-[var(--brand-gold)] mb-1" />
                  <span className="text-xs font-bold text-slate-200">
                    Upload Section Background Texture
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'backgroundImage')}
                  />
                </label>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Or Paste Background Image URL:
                </label>
                <input
                  type="text"
                  value={formState.backgroundImage}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      backgroundImage: e.target.value,
                    }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEATURES MANAGEMENT */}
      {activeTab === 'features' && (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)]">
                B2B Key Value Propositions & Features
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage feature items shown on the B2B marketing section (OEM drums, docs, pricing, shipping, etc.).
              </p>
            </div>
            <button
              onClick={handleOpenAddFeature}
              className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Feature</span>
            </button>
          </div>

          {formState.features?.length === 0 ? (
            <div className="text-center py-12 text-slate-400 border border-dashed border-white/10 rounded-2xl">
              <Package className="w-12 h-12 mx-auto mb-2 text-slate-500" />
              <p className="text-xs font-bold">No features created yet.</p>
              <button
                onClick={handleOpenAddFeature}
                className="mt-3 text-xs text-[var(--brand-gold)] underline font-bold"
              >
                + Add your first feature
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formState.features?.map((feat, index) => {
                const iconObj = AVAILABLE_ICONS.find((i) => i.name === feat.icon);
                const IconComp = iconObj ? iconObj.icon : CheckCircle2;

                return (
                  <div
                    key={feat.id}
                    className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-[var(--brand-gold)]/40 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[var(--brand-gold)] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                            #{index + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-100 truncate">
                            {feat.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {feat.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveFeature(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFeature(index, 'down')}
                          disabled={index === (formState.features?.length || 0) - 1}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFeature(feat)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] text-slate-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold px-2.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(feat.id)}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          title="Delete Feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRODUCT SHOWCASE */}
      {activeTab === 'products' && (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4 space-y-2">
            <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)]">
              Product Showcase for Wholesale & Export
            </h3>
            <p className="text-xs text-slate-300">
              Select products directly from your store database. Selected items will automatically appear on the B2B homepage section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Showcase Heading
              </label>
              <input
                type="text"
                value={formState.showcaseTitle || ''}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    showcaseTitle: e.target.value,
                  }))
                }
                placeholder="e.g. Featured Wholesale & Export Products"
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Showcase Subtitle
              </label>
              <input
                type="text"
                value={formState.showcaseSubtitle || ''}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    showcaseSubtitle: e.target.value,
                  }))
                }
                placeholder="e.g. Ready for global bulk shipment, spa supply, and white-labeling"
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Select Products from Store ({formState.selectedProductIds?.length || 0} selected):
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    selectedProductIds:
                      prev.selectedProductIds?.length === products.length
                        ? []
                        : products.map((p) => p.id),
                  }))
                }
                className="text-[11px] text-[var(--brand-gold)] hover:underline font-bold"
              >
                {formState.selectedProductIds?.length === products.length
                  ? 'Deselect All'
                  : 'Select All Products'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto pr-1">
              {products.map((prod) => {
                const isSelected = formState.selectedProductIds?.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => toggleProductSelection(prod.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[var(--brand-gold)]/15 border-[var(--brand-gold)] shadow-md'
                        : 'bg-black/30 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black/60 shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {prod.category} • {formatAdminINR(prod.priceINR)}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[var(--brand-gold)] border-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                          : 'border-white/30 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COUNTRY COVERAGE */}
      {activeTab === 'countries' && (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)]">
              Supported Export Countries & Regions
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Edit the list of international markets HAKKIVEDA exports to.
            </p>
          </div>

          <div className="flex items-center gap-3 max-w-xl">
            <input
              type="text"
              value={newCountryInput}
              onChange={(e) => setNewCountryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCountry())}
              placeholder="Enter country name (e.g. Germany, Australia)..."
              className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
            />
            <button
              type="button"
              onClick={handleAddCountry}
              className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shrink-0 cursor-pointer"
            >
              + Add Country
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Current Active Export Markets ({formState.supportedCountries?.length || 0}):
            </label>
            <div className="flex flex-wrap gap-2">
              {formState.supportedCountries?.map((c) => (
                <span
                  key={c}
                  className="bg-black/60 border border-[var(--brand-gold)]/40 text-slate-100 text-xs font-sans font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCountry(c)}
                    className="text-slate-400 hover:text-red-400 transition-colors ml-1"
                    title="Remove Country"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <label className="block text-[11px] font-bold text-slate-400 mb-2">
              Quick Add Popular Markets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickAddCountries.map((qc) => {
                const added = formState.supportedCountries?.includes(qc);
                return (
                  <button
                    key={qc}
                    type="button"
                    disabled={added}
                    onClick={() => {
                      if (!added) {
                        setFormState((prev) => ({
                          ...prev,
                          supportedCountries: [...(prev.supportedCountries || []), qc],
                        }));
                      }
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      added
                        ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                        : 'bg-black/40 border-white/20 text-slate-300 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]'
                    }`}
                  >
                    {added ? `✓ ${qc}` : `+ ${qc}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: THEME CONTROLS */}
      {activeTab === 'theme' && (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)] flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <span>Theme & Styling Customization</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Adjust section background, overlay colors, text, and action buttons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Background Color */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formState.theme?.backgroundColor || '#0d1a10'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, backgroundColor: e.target.value },
                    }))
                  }
                  className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formState.theme?.backgroundColor || '#0d1a10'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, backgroundColor: e.target.value },
                    }))
                  }
                  className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2 text-xs font-mono text-slate-100 uppercase"
                />
              </div>
            </div>

            {/* Overlay Color */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                Overlay Tint Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formState.theme?.overlayColor || '#000000'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, overlayColor: e.target.value },
                    }))
                  }
                  className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formState.theme?.overlayColor || '#000000'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, overlayColor: e.target.value },
                    }))
                  }
                  className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2 text-xs font-mono text-slate-100 uppercase"
                />
              </div>
            </div>

            {/* Overlay Opacity */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-200">
                  Overlay Opacity
                </label>
                <span className="text-xs font-mono font-bold text-[var(--brand-gold)]">
                  {formState.theme?.overlayOpacity ?? 35}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formState.theme?.overlayOpacity ?? 35}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    theme: {
                      ...prev.theme,
                      overlayOpacity: parseInt(e.target.value, 10),
                    },
                  }))
                }
                className="w-full accent-[var(--brand-gold)] cursor-pointer"
              />
            </div>

            {/* Text Color */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formState.theme?.textColor || '#f8fafc'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, textColor: e.target.value },
                    }))
                  }
                  className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formState.theme?.textColor || '#f8fafc'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, textColor: e.target.value },
                    }))
                  }
                  className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2 text-xs font-mono text-slate-100 uppercase"
                />
              </div>
            </div>

            {/* Button Color */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-bold text-slate-200">
                CTA Button Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formState.theme?.buttonColor || '#d4af37'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, buttonColor: e.target.value },
                    }))
                  }
                  className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={formState.theme?.buttonColor || '#d4af37'}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, buttonColor: e.target.value },
                    }))
                  }
                  className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2 text-xs font-mono text-slate-100 uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: LIVE PREVIEW MODE */}
      {activeTab === 'preview' && (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-[var(--brand-gold)]">
                Interactive Multi-Device Live Preview
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Preview how the B2B Section will render across Desktop, Tablet, and Mobile screens.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewDevice === 'tablet'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Render Frame Container */}
          <div className="flex justify-center bg-black/60 border border-white/10 rounded-2xl p-4 sm:p-8 overflow-x-auto">
            <div
              className={`transition-all duration-300 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[var(--brand-primary-dark)] ${
                previewDevice === 'mobile'
                  ? 'w-[375px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-full'
              }`}
            >
              <div className="bg-slate-900 border-b border-white/10 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>
                  {previewDevice === 'desktop'
                    ? '100% Full Desktop View'
                    : previewDevice === 'tablet'
                    ? '768px Tablet View'
                    : '375px Mobile View'}
                </span>
                <span>Live Homepage B2B Section</span>
              </div>

              {/* Rendered Preview using formState */}
              <div
                className="p-6 sm:p-8 relative overflow-hidden space-y-8"
                style={{
                  backgroundColor: formState.theme?.backgroundColor || '#0d1a10',
                  color: formState.theme?.textColor || '#f8fafc',
                }}
              >
                {formState.backgroundImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: `url(${formState.backgroundImage})` }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: formState.theme?.overlayColor || '#000000',
                        opacity: (formState.theme?.overlayOpacity ?? 35) / 100,
                      }}
                    />
                  </div>
                )}

                <div className="relative z-10 space-y-6">
                  {/* Badge */}
                  {formState.badgeText && (
                    <span className="inline-block bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)] text-[var(--brand-gold)] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                      {formState.badgeText}
                    </span>
                  )}

                  {/* Heading & Copy */}
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold leading-tight">
                    {formState.heading}
                  </h2>

                  {formState.subheading && (
                    <h3 className="text-xs sm:text-sm font-semibold text-[var(--brand-gold)]">
                      {formState.subheading}
                    </h3>
                  )}

                  {formState.description && (
                    <p className="text-xs opacity-90 leading-relaxed max-w-xl">
                      {formState.description}
                    </p>
                  )}

                  {/* Banner Image Preview */}
                  {formState.bannerImage && (
                    <div className="h-44 rounded-xl overflow-hidden border border-[var(--brand-gold)]/40 relative">
                      <img
                        src={formState.bannerImage}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Features List */}
                  {formState.features?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {formState.features.map((f) => (
                        <div
                          key={f.id}
                          className="bg-black/40 border border-white/10 rounded-lg p-2.5 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[var(--brand-gold)] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold block">{f.title}</span>
                            <span className="text-[10px] text-slate-300 block">{f.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Countries */}
                  {formState.supportedCountries?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {formState.supportedCountries.map((c) => (
                        <span
                          key={c}
                          className="bg-black/50 text-[10px] px-2 py-0.5 rounded-full border border-white/10"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Button */}
                  <button
                    type="button"
                    style={{
                      backgroundColor: formState.theme?.buttonColor || '#d4af37',
                    }}
                    className="w-full text-[var(--brand-primary-dark)] py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{formState.ctaText || 'Submit Export Enquiry'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Edit / Add Modal */}
      {featureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5 text-slate-100 font-sans relative">
            <button
              onClick={() => setFeatureModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif-luxury font-bold text-[var(--brand-gold)]">
              {editingFeature ? 'Edit B2B Feature' : 'Add New B2B Feature'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Feature Title *
                </label>
                <input
                  type="text"
                  value={featTitle}
                  onChange={(e) => setFeatTitle(e.target.value)}
                  placeholder="e.g. Custom OEM / Bulk Drums"
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={featDesc}
                  onChange={(e) => setFeatDesc(e.target.value)}
                  placeholder="e.g. High capacity drums (25L-200L) for custom formulation..."
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select Icon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = featIcon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFeatIcon(item.name)}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold border-[var(--brand-gold)]'
                            : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <IconComp className="w-4 h-4 shrink-0" />
                        <span className="text-[11px] truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Sort Order Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={featSortOrder}
                  onChange={(e) => setFeatSortOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setFeatureModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFeature}
                className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-md cursor-pointer"
              >
                Save Feature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
