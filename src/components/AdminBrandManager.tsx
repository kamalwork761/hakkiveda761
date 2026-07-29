import React, { useState } from 'react';
import { uploadFileToServer } from '../utils/upload';
import {
  Upload,
  Image as ImageIcon,
  Palette,
  Type,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Share2,
  Globe,
  Mail,
  FileText,
  Eye,
  Check,
  Trash2,
  RefreshCw,
  Save,
  Smartphone,
  Tablet,
  Laptop,
  ShieldCheck,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  CheckCircle2,
  Zap,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandIdentityConfig } from '../types/store';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { Header } from './Header';
import { HeroSlider } from './HeroSlider';
import { ProductGrid } from './ProductGrid';
import { Footer } from './Footer';

interface AdminBrandManagerProps {
  showToast: (msg: string) => void;
}

export const AdminBrandManager: React.FC<AdminBrandManagerProps> = ({ showToast }) => {
  const {
    brandIdentity,
    draftBrandIdentity,
    saveBrandDraft,
    publishBrandTheme,
    reloadThemeCache,
    applyBrandStyles,
    setIsPreviewingWebsiteTheme,
  } = useStore();

  const [formData, setFormData] = useState<BrandIdentityConfig>(() => ({
    ...(draftBrandIdentity || brandIdentity),
  }));

  const [activeSection, setActiveSection] = useState<
    | 'LOGOS'
    | 'IDENTITY'
    | 'COLOURS'
    | 'TYPOGRAPHY'
    | 'THEME'
    | 'ANIMATION'
    | 'SOCIAL'
    | 'BROWSER_PWA'
    | 'EMAIL'
    | 'ASSETS'
  >('LOGOS');

  const [previewDevice, setPreviewDevice] = useState<'DESKTOP' | 'TABLET' | 'MOBILE' | 'ADMIN'>('DESKTOP');
  const [isWebsitePreviewOpen, setIsWebsitePreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTextChange = (field: keyof BrandIdentityConfig, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      applyBrandStyles(next);
      return next;
    });
  };

  const handleFileUpload = async (
    field: keyof BrandIdentityConfig,
    e: React.ChangeEvent<HTMLInputElement>,
    filenameField?: keyof BrandIdentityConfig
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFileToServer(file);
      setFormData((prev) => {
        const next = {
          ...prev,
          [field]: url,
          ...(filenameField ? { [filenameField]: file.name } : {}),
        };
        applyBrandStyles(next);
        return next;
      });
      showToast(`Uploaded file for ${String(field)} to server`);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => {
            const next = {
              ...prev,
              [field]: event.target?.result as string,
              ...(filenameField ? { [filenameField]: file.name } : {}),
            };
            applyBrandStyles(next);
            return next;
          });
          showToast(`Uploaded file for ${String(field)}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearField = (field: keyof BrandIdentityConfig, filenameField?: keyof BrandIdentityConfig) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [field]: '',
        ...(filenameField ? { [filenameField]: '' } : {}),
      };
      applyBrandStyles(next);
      return next;
    });
    showToast(`Cleared ${String(field)}`);
  };

  const handleSaveDraft = () => {
    saveBrandDraft(formData);
    showToast('💾 Theme Draft Saved! Use "Preview Website" to test or "Publish Theme" to push live.');
  };

  const handleOpenPreview = () => {
    setIsWebsitePreviewOpen(true);
    setIsPreviewingWebsiteTheme(true);
    applyBrandStyles(formData);
  };

  const handleClosePreview = () => {
    setIsWebsitePreviewOpen(false);
    setIsPreviewingWebsiteTheme(false);
    applyBrandStyles(brandIdentity);
  };

  const handlePublishTheme = () => {
    setIsSaving(true);
    publishBrandTheme(formData);
    setTimeout(() => {
      setIsSaving(false);
      showToast('✨ Theme Published Successfully! All website pages are now using the updated theme.');
    }, 300);
  };

  const handleResetDefaults = () => {
    const defaults: BrandIdentityConfig = {
      mainLogoLight: '',
      mainLogoDark: '',
      mobileLogo: '',
      footerLogo: '',
      adminLogo: '',
      emailLogo: '',
      favicon: '',
      appleTouchIcon: '',
      svgLogo: '',
      transparentLogo: '',
      brandName: 'HAKKIVEDA',
      brandSubtitle: 'Ancestral Hakki-Pikki Herbal Secret',
      brandInitials: 'HV',
      brandDescription: 'Authentic 42-herb tribal hair care formulations brewed with traditional Mysore forest wisdom and zero synthetic additives.',
      companyMotto: 'Pure Botanical Science • Zero Synthetic Harm',
      primaryColor: '#3AA91F',
      secondaryGold: '#D4AF37',
      backgroundColor: '#0B1D13',
      textColor: '#F8FAFC',
      accentColor: '#10B981',
      buttonColor: '#D4AF37',
      hoverColor: '#B8962E',
      borderColor: 'rgba(212, 175, 55, 0.3)',
      headingFont: 'Cinzel, Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      buttonFont: 'Plus Jakarta Sans, sans-serif',
      fontSize: 'md',
      fontWeight: 'bold',
      themeMode: 'dark',
      enableLoadingAnimation: true,
      animationType: 'gold_glow',
      animationDuration: 1.5,
      introSoundEnabled: true,
      socialFacebook: 'https://facebook.com/hakkiveda',
      socialInstagram: 'https://instagram.com/hakkiveda',
      socialYoutube: 'https://youtube.com/@hakkiveda',
      socialWhatsapp: 'https://wa.me/917619536831',
      socialLinkedin: 'https://linkedin.com/company/hakkiveda',
      socialTwitter: 'https://x.com/hakkiveda',
      browserTitle: 'HAKKIVEDA | Ancestral Hakki-Pikki Tribal Hair Care',
      themeColor: '#0B1D13',
      pwaIcon192: '',
      pwaIcon512: '',
      emailHeaderLogo: '',
      emailFooterLogo: '',
      emailAccentColor: '#D4AF37',
      emailSignature: 'HAKKIVEDA Botanical Care Team\nHunsur, Mysore, Karnataka 571105',
      brandGuidelinesPdf: '',
      brandGuidelinesFilename: '',
      watermarkLogo: '',
      whiteLogo: '',
      blackLogo: '',
    };
    setFormData(defaults);
    publishBrandTheme(defaults);
    showToast('Reset Brand Identity to factory defaults (#3AA91F Green & #D4AF37 Gold)');
  };

  const validPickerHex = (val: string) => {
    if (!val) return '#000000';
    const cleaned = val.trim();
    if (cleaned.startsWith('#')) {
      if (cleaned.length === 7) return cleaned;
      if (cleaned.length === 4) {
        return `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`;
      }
    } else if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
      return `#${cleaned}`;
    } else if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
      return `#${cleaned[0]}${cleaned[0]}${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}`;
    }
    return '#D4AF37';
  };

  const navTabs = [
    { id: 'LOGOS', label: '1. Logo Management', icon: ImageIcon },
    { id: 'IDENTITY', label: '2. Brand Identity', icon: ShieldCheck },
    { id: 'COLOURS', label: '3. Brand Colours', icon: Palette },
    { id: 'TYPOGRAPHY', label: '4. Typography', icon: Type },
    { id: 'THEME', label: '5. Theme Manager', icon: Sun },
    { id: 'ANIMATION', label: '6. Brand Animation', icon: Zap },
    { id: 'SOCIAL', label: '7. Social Branding', icon: Share2 },
    { id: 'BROWSER_PWA', label: '8. Browser & PWA', icon: Globe },
    { id: 'EMAIL', label: '9. Email Branding', icon: Mail },
    { id: 'ASSETS', label: '10. Brand Assets', icon: FileText },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-20 w-full max-w-full overflow-x-hidden">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--brand-gold)]/20 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[var(--brand-gold)] font-mono text-xs uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Store Configuration System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100 mt-1">
            Brand Identity Management System
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Customize logos, color palettes, typography, theme modes, animations, and assets with real-time live preview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleOpenPreview}
            className="px-4 py-2.5 rounded-xl bg-amber-900/60 hover:bg-amber-800 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Eye className="w-4 h-4 text-amber-300" />
            <span>Preview Website</span>
          </button>

          <button
            onClick={handlePublishTheme}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[var(--brand-gold)] hover:bg-[#b8962e] text-[var(--brand-primary-dark)] font-extrabold text-xs flex items-center gap-2 shadow-xl hover:shadow-[var(--brand-gold)]/20 transition-all cursor-pointer"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span>Publish Theme</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Section Navigation & Form Editor + Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full max-w-full">
        {/* Left Column: Module Navigation & Settings Editor (7 Cols) */}
        <div className="xl:col-span-7 space-y-6 w-full max-w-full overflow-x-hidden">
          {/* Module Section Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 w-full max-w-full">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md font-extrabold'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 1: Logo Management */}
          {activeSection === 'LOGOS' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>1. Logo Management & Uploads</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">10 Logo Assets Supported</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'mainLogoLight', label: 'Main Logo (Light Mode Header)', desc: 'Used on dark background headers' },
                  { id: 'mainLogoDark', label: 'Main Logo (Dark Mode / Printable)', desc: 'Used on light background layouts' },
                  { id: 'mobileLogo', label: 'Mobile Logo (Compact)', desc: 'Optimal for mobile navigation headers' },
                  { id: 'footerLogo', label: 'Footer Logo', desc: 'Used in dark footer section' },
                  { id: 'adminLogo', label: 'Admin Panel Logo', desc: 'Appears in top admin sidebar' },
                  { id: 'emailLogo', label: 'Email Template Logo', desc: 'Included in order confirmation emails' },
                  { id: 'favicon', label: 'Browser Favicon (.ico / .png / .svg)', desc: 'Appears in browser tab' },
                  { id: 'appleTouchIcon', label: 'Apple Touch Icon', desc: 'iOS home screen bookmark icon' },
                  { id: 'svgLogo', label: 'SVG Logo (Vector)', desc: 'High-DPI vector brand mark' },
                  { id: 'transparentLogo', label: 'Transparent Logo (.png)', desc: 'Watermarking & transparent layouts' },
                ].map((item) => {
                  const key = item.id as keyof BrandIdentityConfig;
                  const value = formData[key] as string;
                  return (
                    <div
                      key={item.id}
                      className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-200 block">{item.label}</label>
                        {value && (
                          <button
                            onClick={() => handleClearField(key)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>

                      {/* Image Preview Thumbnail */}
                      <div className="h-16 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center p-2 overflow-hidden">
                        {value ? (
                          <img src={value} alt={item.label} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <div className="text-center text-slate-500 font-mono text-[10px] flex items-center gap-1">
                            <HakkivedaWordmark size="sm" />
                          </div>
                        )}
                      </div>

                      {/* Upload Control */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleTextChange(key, e.target.value)}
                          placeholder="Paste image URL or upload file..."
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-200 text-[11px]"
                        />
                        <label className="px-3 py-1.5 rounded-lg bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)]/30 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] font-bold text-[11px] shrink-0 cursor-pointer flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Browse</span>
                          <input
                            type="file"
                            accept="image/*,.ico,.svg"
                            onChange={(e) => handleFileUpload(key, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Brand Identity */}
          {activeSection === 'IDENTITY' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>2. Brand Identity & Copywriting</span>
                </h3>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleTextChange('brandName', e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Subtitle / Tagline *</label>
                <input
                  type="text"
                  value={formData.brandSubtitle}
                  onChange={(e) => handleTextChange('brandSubtitle', e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Brand Initials / Emblem</label>
                  <input
                    type="text"
                    value={formData.brandInitials}
                    onChange={(e) => handleTextChange('brandInitials', e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Company Motto / Philosophy</label>
                  <input
                    type="text"
                    value={formData.companyMotto}
                    onChange={(e) => handleTextChange('companyMotto', e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Heritage Description</label>
                <textarea
                  rows={3}
                  value={formData.brandDescription}
                  onChange={(e) => handleTextChange('brandDescription', e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Section 3: Brand Colours */}
          {activeSection === 'COLOURS' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span>3. Brand Colours & Palette Engine</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
                  Default Green: #3AA91F • Gold: #D4AF37
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'primaryColor', label: 'Primary Brand Colour', default: '#3AA91F' },
                  { key: 'secondaryGold', label: 'Secondary Metallic Gold', default: '#D4AF37' },
                  { key: 'backgroundColor', label: 'Background Colour', default: '#0B1D13' },
                  { key: 'textColor', label: 'Text Colour', default: '#F8FAFC' },
                  { key: 'accentColor', label: 'Accent Colour', default: '#10B981' },
                  { key: 'buttonColor', label: 'Button Colour', default: '#D4AF37' },
                  { key: 'hoverColor', label: 'Hover Colour', default: '#B8962E' },
                  { key: 'borderColor', label: 'Border Colour', default: 'rgba(212, 175, 55, 0.3)' },
                ].map((col) => {
                  const fieldKey = col.key as keyof BrandIdentityConfig;
                  const hexVal = (formData[fieldKey] as string) || col.default;
                  const pickerHex = validPickerHex(hexVal);
                  return (
                    <div
                      key={col.key}
                      className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-200">{col.label}</label>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                            style={{ backgroundColor: pickerHex }}
                          ></span>
                          <span className="font-mono text-[11px] text-slate-300 font-bold bg-black/40 px-2 py-0.5 rounded border border-white/10">
                            {hexVal}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Interactive Color Picker */}
                        <div className="relative shrink-0">
                          <input
                            type="color"
                            value={pickerHex}
                            onChange={(e) => handleTextChange(fieldKey, e.target.value)}
                            className="w-11 h-11 rounded-xl cursor-pointer bg-black/40 border border-white/20 p-1 transition-transform hover:scale-105"
                            title="Click to open color picker"
                          />
                        </div>

                        {/* Unlocked Manual Text/HEX Input */}
                        <div className="w-full relative">
                          <input
                            type="text"
                            value={hexVal}
                            onChange={(e) => handleTextChange(fieldKey, e.target.value)}
                            placeholder="#3AA91F or HEX"
                            className="w-full bg-black/40 border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] font-bold tracking-wide"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Preset Color Swatches */}
              <div className="bg-black/30 p-4 rounded-xl border border-white/10 space-y-3">
                <span className="font-bold text-slate-300 block text-xs">Quick Brand Color Presets</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Ayurvedic Forest (Default)', primary: '#3AA91F', gold: '#D4AF37', bg: '#0B1D13', text: '#F8FAFC' },
                    { name: 'Emerald Royalty', primary: '#059669', gold: '#F59E0B', bg: '#022C22', text: '#F8FAFC' },
                    { name: 'Midnight Sandalwood', primary: '#166534', gold: '#EAB308', bg: '#091E12', text: '#F8FAFC' },
                    { name: 'Imperial Botanical', primary: '#15803D', gold: '#CA8A04', bg: '#0B2317', text: '#F8FAFC' },
                  ].map((swatch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          primaryColor: swatch.primary,
                          secondaryGold: swatch.gold,
                          backgroundColor: swatch.bg,
                          textColor: swatch.text,
                          buttonColor: swatch.gold,
                          hoverColor: swatch.gold,
                        }));
                        showToast(`Applied ${swatch.name} color palette`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: swatch.primary }}></span>
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: swatch.gold }}></span>
                      <span>{swatch.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Typography */}
          {activeSection === 'TYPOGRAPHY' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>4. Typography & Font Families</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Heading Font Family</label>
                  <select
                    value={formData.headingFont}
                    onChange={(e) => handleTextChange('headingFont', e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                  >
                    <option value="Cinzel, Playfair Display, serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Cinzel (Luxury Serif Default)
                    </option>
                    <option value="Playfair Display, serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Playfair Display
                    </option>
                    <option value="Cormorant Garamond, serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Cormorant Garamond
                    </option>
                    <option value="Plus Jakarta Sans, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Plus Jakarta Sans (Modern)
                    </option>
                    <option value="Inter, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Inter
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Body Font Family</label>
                  <select
                    value={formData.bodyFont}
                    onChange={(e) => handleTextChange('bodyFont', e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                  >
                    <option value="Plus Jakarta Sans, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Plus Jakarta Sans (Default)
                    </option>
                    <option value="Inter, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Inter
                    </option>
                    <option value="Outfit, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Outfit
                    </option>
                    <option value="Roboto, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Roboto
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Button Font Family</label>
                  <select
                    value={formData.buttonFont}
                    onChange={(e) => handleTextChange('buttonFont', e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                  >
                    <option value="Plus Jakarta Sans, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Plus Jakarta Sans
                    </option>
                    <option value="Outfit, sans-serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Outfit
                    </option>
                    <option value="Cinzel, serif" className="bg-[#0B1D13] text-slate-100 py-1.5">
                      Cinzel
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Font Weight</label>
                  <select
                    value={formData.fontWeight}
                    onChange={(e) => handleTextChange('fontWeight', e.target.value as any)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                  >
                    <option value="normal" className="bg-[#0B1D13] text-slate-100 py-1.5">Normal (400)</option>
                    <option value="medium" className="bg-[#0B1D13] text-slate-100 py-1.5">Medium (500)</option>
                    <option value="semibold" className="bg-[#0B1D13] text-slate-100 py-1.5">Semibold (600)</option>
                    <option value="bold" className="bg-[#0B1D13] text-slate-100 py-1.5">Bold (700)</option>
                    <option value="extrabold" className="bg-[#0B1D13] text-slate-100 py-1.5">Extrabold (800)</option>
                  </select>
                </div>
              </div>

              {/* Typography Live Text Tester Card */}
              <div className="bg-black/40 p-5 rounded-xl border border-[var(--brand-gold)]/30 space-y-3">
                <span className="text-[11px] font-mono text-[var(--brand-gold)] font-bold uppercase tracking-wider block">
                  Live Typography Sample Preview
                </span>
                <div className="space-y-2 p-4 rounded-lg bg-[var(--brand-primary-deep)] border border-white/10">
                  <h3
                    className="text-lg font-bold"
                    style={{
                      fontFamily: formData.headingFont,
                      color: formData.secondaryGold || '#D4AF37',
                    }}
                  >
                    {formData.brandName || 'HAKKIVEDA'} — Ancestral 42-Herb Hair Oil
                  </h3>
                  <p
                    className="text-xs text-slate-200 leading-relaxed"
                    style={{ fontFamily: formData.bodyFont }}
                  >
                    Handcrafted by Mysore forest Hakki-Pikki tribal elders following centuries of botanical wisdom.
                  </p>
                  <div className="pt-2">
                    <button
                      className="px-4 py-2 rounded-lg text-xs font-bold shadow-md"
                      style={{
                        fontFamily: formData.buttonFont,
                        backgroundColor: formData.buttonColor || '#D4AF37',
                        color: '#0B1D13',
                      }}
                    >
                      Shop Botanical Formulas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Theme Manager */}
          {activeSection === 'THEME' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <span>5. Theme Manager (Light / Dark / Auto)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'dark', label: 'Dark Mode (Forest Green)', icon: Moon, desc: 'Signature dark luxury experience' },
                  { id: 'light', label: 'Light Mode (Clean Cream)', icon: Sun, desc: 'High-contrast bright storefront' },
                  { id: 'auto', label: 'Auto (System Preference)', icon: Monitor, desc: 'Adapts to user operating system' },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSel = formData.themeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleTextChange('themeMode', mode.id)}
                      className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                        isSel
                          ? 'bg-[var(--brand-gold)]/10 border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/30'
                          : 'bg-[var(--brand-primary-deep)] border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${isSel ? 'text-[var(--brand-gold)]' : 'text-slate-400'}`} />
                        {isSel && <CheckCircle2 className="w-4 h-4 text-[var(--brand-gold)]" />}
                      </div>
                      <span className="font-bold text-slate-100 block text-sm">{mode.label}</span>
                      <p className="text-[11px] text-slate-400">{mode.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 6: Brand Animation */}
          {activeSection === 'ANIMATION' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>6. Brand Animation & Intro Sound Settings</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
                  <div>
                    <span className="font-bold text-slate-100 block">Enable Loading Animation</span>
                    <span className="text-[11px] text-slate-400">Shows initial luxury brand intro on page refresh</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableLoadingAnimation}
                      onChange={(e) => handleTextChange('enableLoadingAnimation', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Animation Type</label>
                    <select
                      value={formData.animationType}
                      onChange={(e) => handleTextChange('animationType', e.target.value as any)}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                    >
                      <option value="gold_glow" className="bg-[#0B1D13] text-slate-100 py-1.5">Gold Glow Pulse</option>
                      <option value="fade" className="bg-[#0B1D13] text-slate-100 py-1.5">Smooth Fade In</option>
                      <option value="pulse" className="bg-[#0B1D13] text-slate-100 py-1.5">Pulse Emblem</option>
                      <option value="spin_emblem" className="bg-[#0B1D13] text-slate-100 py-1.5">Spinning Emblem</option>
                      <option value="shimmer" className="bg-[#0B1D13] text-slate-100 py-1.5">Golden Shimmer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Duration (Seconds)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="5"
                      value={formData.animationDuration}
                      onChange={(e) => handleTextChange('animationDuration', Number(e.target.value))}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
                  <div>
                    <span className="font-bold text-slate-100 block">Intro Chime Sound On/Off</span>
                    <span className="text-[11px] text-slate-400">Synthesizes calm Web Audio API welcome chime</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.introSoundEnabled}
                      onChange={(e) => handleTextChange('introSoundEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Social Branding */}
          {activeSection === 'SOCIAL' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span>7. Social Branding Profiles</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { field: 'socialFacebook', label: 'Facebook URL' },
                  { field: 'socialInstagram', label: 'Instagram URL' },
                  { field: 'socialYoutube', label: 'YouTube Channel URL' },
                  { field: 'socialWhatsapp', label: 'WhatsApp Link / Number' },
                  { field: 'socialLinkedin', label: 'LinkedIn Company URL' },
                  { field: 'socialTwitter', label: 'X (Twitter) Profile URL' },
                ].map((s) => (
                  <div key={s.field}>
                    <label className="block font-bold text-slate-300 mb-1">{s.label}</label>
                    <input
                      type="text"
                      value={(formData as any)[s.field]}
                      onChange={(e) => handleTextChange(s.field as any, e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: Browser & PWA */}
          {activeSection === 'BROWSER_PWA' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>8. Browser Tab & PWA App Branding</span>
                </h3>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Browser Title Tag</label>
                <input
                  type="text"
                  value={formData.browserTitle}
                  onChange={(e) => handleTextChange('browserTitle', e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Theme Color Meta Tag (Hex)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={validPickerHex(formData.themeColor || '#0B1D13')}
                    onChange={(e) => handleTextChange('themeColor', e.target.value)}
                    className="w-11 h-11 rounded-xl cursor-pointer bg-black/40 border border-white/20 p-1"
                  />
                  <input
                    type="text"
                    value={formData.themeColor}
                    onChange={(e) => handleTextChange('themeColor', e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">PWA Icon (192x192)</label>
                  <input
                    type="text"
                    value={formData.pwaIcon192 || ''}
                    onChange={(e) => handleTextChange('pwaIcon192', e.target.value)}
                    placeholder="URL or upload..."
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">PWA Icon (512x512)</label>
                  <input
                    type="text"
                    value={formData.pwaIcon512 || ''}
                    onChange={(e) => handleTextChange('pwaIcon512', e.target.value)}
                    placeholder="URL or upload..."
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 9: Email Branding */}
          {activeSection === 'EMAIL' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>9. Email Template Branding</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Header Logo</label>
                  <input
                    type="text"
                    value={formData.emailHeaderLogo || ''}
                    onChange={(e) => handleTextChange('emailHeaderLogo', e.target.value)}
                    placeholder="Logo URL..."
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Accent Colour</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={validPickerHex(formData.emailAccentColor || '#D4AF37')}
                      onChange={(e) => handleTextChange('emailAccentColor', e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer bg-black/40 border border-white/20 p-1"
                    />
                    <input
                      type="text"
                      value={formData.emailAccentColor}
                      onChange={(e) => handleTextChange('emailAccentColor', e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Signature Footer Text</label>
                <textarea
                  rows={3}
                  value={formData.emailSignature}
                  onChange={(e) => handleTextChange('emailSignature', e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Section 10: Brand Assets */}
          {activeSection === 'ASSETS' && (
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>10. Brand Assets & Guidelines</span>
                </h3>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Guidelines Document (PDF)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.brandGuidelinesFilename || formData.brandGuidelinesPdf || ''}
                    readOnly
                    placeholder="No PDF uploaded..."
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-mono text-[11px]"
                  />
                  <label className="px-4 py-3 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>Upload PDF</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload('brandGuidelinesPdf', e, 'brandGuidelinesFilename')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'watermarkLogo', label: 'Watermark Logo' },
                  { key: 'whiteLogo', label: 'Monochrome White Logo' },
                  { key: 'blackLogo', label: 'Monochrome Black Logo' },
                ].map((item) => {
                  const key = item.key as keyof BrandIdentityConfig;
                  return (
                    <div key={item.key} className="bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 space-y-2">
                      <label className="font-bold text-slate-200 block text-[11px]">{item.label}</label>
                      <input
                        type="text"
                        value={(formData[key] as string) || ''}
                        onChange={(e) => handleTextChange(key, e.target.value)}
                        placeholder="Image URL..."
                        className="w-full bg-black/40 border border-white/20 p-2 rounded-lg text-slate-100 text-[11px]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Multi-Device Live Preview (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="sticky top-6 bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 p-5 rounded-2xl space-y-5 shadow-2xl">
            {/* Live Preview Bar & Device Switcher */}
            <div className="flex items-center justify-between border-b border-[var(--brand-gold)]/20 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--brand-gold)]" />
                <h3 className="font-serif-luxury font-bold text-sm text-[var(--brand-gold)] uppercase tracking-wider">
                  Real-time Live Preview
                </h3>
              </div>

              <div className="bg-[var(--brand-primary-deep)] p-1 rounded-xl border border-white/10 flex items-center gap-1">
                {[
                  { id: 'DESKTOP', icon: Laptop, title: 'Desktop' },
                  { id: 'TABLET', icon: Tablet, title: 'Tablet' },
                  { id: 'MOBILE', icon: Smartphone, title: 'Mobile' },
                  { id: 'ADMIN', icon: Monitor, title: 'Admin' },
                ].map((dev) => {
                  const Icon = dev.icon;
                  return (
                    <button
                      key={dev.id}
                      onClick={() => setPreviewDevice(dev.id as any)}
                      title={dev.title}
                      className={`p-1.5 rounded-lg transition-all ${
                        previewDevice === dev.id
                          ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Rendered Canvas Frame */}
            <div
              className={`mx-auto rounded-2xl border transition-all overflow-hidden ${
                previewDevice === 'DESKTOP'
                  ? 'w-full min-h-[420px]'
                  : previewDevice === 'TABLET'
                  ? 'max-w-[340px] min-h-[400px]'
                  : previewDevice === 'MOBILE'
                  ? 'max-w-[260px] min-h-[380px]'
                  : 'w-full min-h-[380px]'
              }`}
              style={{
                backgroundColor: formData.backgroundColor || '#0B1D13',
                color: formData.textColor || '#F8FAFC',
                borderColor: formData.borderColor || 'rgba(212, 175, 55, 0.3)',
              }}
            >
              {/* Device Header Bar */}
              <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] bg-black/40">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 ml-2">
                    {formData.browserTitle || 'HAKKIVEDA'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 uppercase">
                  {previewDevice}
                </span>
              </div>

              {/* Rendered Live Website / Admin Preview Body */}
              <div className="p-4 space-y-4">
                {/* Brand Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    {formData.mainLogoLight ? (
                      <img src={formData.mainLogoLight} alt="Logo" className="h-6 object-contain" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center font-mono border"
                          style={{
                            backgroundColor: formData.primaryColor,
                            color: formData.textColor,
                            borderColor: formData.secondaryGold,
                          }}
                        >
                          {formData.brandInitials || 'HV'}
                        </span>
                        <div>
                          <span
                            className="font-bold text-sm block leading-tight font-serif-luxury"
                            style={{ color: formData.secondaryGold }}
                          >
                            {formData.brandName || 'HAKKIVEDA'}
                          </span>
                          <span className="text-[9px] opacity-70 block">
                            {formData.brandSubtitle || 'Botanical Secret'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold"
                      style={{
                        backgroundColor: formData.buttonColor,
                        color: formData.backgroundColor,
                      }}
                    >
                      Shop
                    </button>
                  </div>
                </div>

                {/* Hero Card Preview */}
                <div
                  className="p-4 rounded-xl border space-y-2 relative overflow-hidden"
                  style={{
                    borderColor: formData.borderColor,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div
                    className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider"
                    style={{
                      backgroundColor: formData.primaryColor,
                      color: formData.textColor,
                    }}
                  >
                    {formData.companyMotto || 'Ancestral Formula'}
                  </div>
                  <h4
                    className="text-base font-bold"
                    style={{
                      fontFamily: formData.headingFont,
                      color: formData.secondaryGold,
                    }}
                  >
                    {formData.brandName}: 42 Herb Botanical Oil
                  </h4>
                  <p className="text-[11px] opacity-80 line-clamp-2">{formData.brandDescription}</p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-md"
                      style={{
                        backgroundColor: formData.buttonColor,
                        color: '#000000',
                      }}
                    >
                      Buy Now
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border"
                      style={{
                        borderColor: formData.secondaryGold,
                        color: formData.secondaryGold,
                      }}
                    >
                      Learn Wisdom
                    </button>
                  </div>
                </div>

                {/* Color Swatch Indicators */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Active Theme Spectrum
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono">
                    <div className="p-1 rounded text-center font-bold" style={{ backgroundColor: formData.primaryColor, color: '#fff' }}>
                      Primary
                    </div>
                    <div className="p-1 rounded text-center font-bold" style={{ backgroundColor: formData.secondaryGold, color: '#000' }}>
                      Gold
                    </div>
                    <div className="p-1 rounded text-center font-bold" style={{ backgroundColor: formData.accentColor, color: '#fff' }}>
                      Accent
                    </div>
                    <div className="p-1 rounded text-center font-bold" style={{ backgroundColor: formData.backgroundColor, color: formData.textColor, border: '1px solid rgba(255,255,255,0.2)' }}>
                      Canvas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Interactive Website Storefront Preview Modal */}
      {isWebsitePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          {/* Header Control Bar */}
          <div className="bg-[var(--brand-primary-dark)] border-b border-[var(--brand-gold)]/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center font-bold font-mono text-sm shadow-md">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-100 font-serif-luxury">Storefront Theme Live Preview</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Draft Theme Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Testing colors, buttons, & typography across full website layout before publishing.
                </p>
              </div>
            </div>

            {/* Device Viewport Switcher */}
            <div className="bg-black/40 p-1 rounded-xl border border-white/10 flex items-center gap-1">
              {[
                { id: 'DESKTOP', label: 'Desktop', icon: Laptop },
                { id: 'TABLET', label: 'Tablet (768px)', icon: Tablet },
                { id: 'MOBILE', label: 'Mobile (375px)', icon: Smartphone },
              ].map((dev) => {
                const Icon = dev.icon;
                return (
                  <button
                    key={dev.id}
                    onClick={() => setPreviewDevice(dev.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      previewDevice === dev.id
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{dev.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Exit Preview</span>
              </button>

              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-400/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>

              <button
                onClick={() => {
                  handlePublishTheme();
                  setIsWebsitePreviewOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[var(--brand-gold)] hover:bg-[#b8962e] text-[var(--brand-primary-dark)] font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>Publish Theme Now</span>
              </button>
            </div>
          </div>

          {/* Scrollable Viewport Stage */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/80">
            <div
              className={`bg-[var(--background)] text-[var(--text-primary)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--brand-border)] transition-all ${
                previewDevice === 'DESKTOP'
                  ? 'w-full max-w-7xl'
                  : previewDevice === 'TABLET'
                  ? 'w-full max-w-3xl'
                  : 'w-full max-w-sm'
              }`}
            >
              {/* Actual Storefront Components */}
              <Header />
              <main className="space-y-12 pb-12">
                <HeroSlider />
                <ProductGrid selectedCategory="ALL" />
              </main>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
