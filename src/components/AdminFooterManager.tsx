import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Globe,
  Truck,
  CreditCard,
  Share2,
  Layers,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Type,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FooterConfig, FooterColumn, FooterNavLink, FooterShippingItem, FooterSocialLink } from '../types/store';
import { Footer } from './Footer';

interface AdminFooterManagerProps {
  showToast?: (message: string) => void;
}

export const AdminFooterManager: React.FC<AdminFooterManagerProps> = ({ showToast }) => {
  const { footerConfig, updateFooterConfig, resetFooterConfig, playSound } = useStore();

  const [activeTab, setActiveTab] = useState<'brand_contact' | 'nav_columns' | 'shipping' | 'newsletter' | 'payments_social' | 'preview'>('brand_contact');
  const [formData, setFormData] = useState<FooterConfig>(footerConfig);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if external store changes
  React.useEffect(() => {
    setFormData(footerConfig);
  }, [footerConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    playSound?.('form_submit');
    try {
      await updateFooterConfig(formData);
      if (showToast) showToast('Footer configuration saved permanently.');
    } catch (err: any) {
      if (showToast) showToast(`Error saving footer: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all footer settings to default?')) {
      playSound?.('click');
      await resetFooterConfig();
      if (showToast) showToast('Footer restored to default configuration.');
    }
  };

  // Section 1: Brand & Contact Handlers
  const handleBrandContactChange = (field: keyof FooterConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Section 2: Nav Column Handlers
  const handleToggleColumn = (colId: string) => {
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => (col.id === colId ? { ...col, enabled: !col.enabled } : col)),
    }));
  };

  const handleColumnTitleChange = (colId: string, title: string) => {
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => (col.id === colId ? { ...col, title } : col)),
    }));
  };

  const handleAddLink = (colId: string) => {
    const newLink: FooterNavLink = {
      id: Date.now().toString(),
      label: 'New Link',
      url: '#',
    };
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === colId ? { ...col, links: [...col.links, newLink] } : col
      ),
    }));
  };

  const handleUpdateLink = (colId: string, linkId: string, partial: Partial<FooterNavLink>) => {
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === colId
          ? {
              ...col,
              links: col.links.map((lnk) => (lnk.id === linkId ? { ...lnk, ...partial } : lnk)),
            }
          : col
      ),
    }));
  };

  const handleDeleteLink = (colId: string, linkId: string) => {
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === colId
          ? {
              ...col,
              links: col.links.filter((lnk) => lnk.id !== linkId),
            }
          : col
      ),
    }));
  };

  const handleAddColumn = () => {
    const newCol: FooterColumn = {
      id: `col_${Date.now()}`,
      title: 'New Column',
      enabled: true,
      links: [
        { id: '1', label: 'Sample Link', url: '#' },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      columns: [...prev.columns, newCol],
    }));
  };

  const handleDeleteColumn = (colId: string) => {
    if (window.confirm('Delete this footer column and all its links?')) {
      setFormData((prev) => ({
        ...prev,
        columns: prev.columns.filter((col) => col.id !== colId),
      }));
    }
  };

  // Section 3: Shipping Items Handlers
  const handleAddShippingItem = () => {
    const newItem: FooterShippingItem = {
      id: `s_${Date.now()}`,
      text: 'New Shipping Guarantee',
    };
    setFormData((prev) => ({
      ...prev,
      shippingItems: [...prev.shippingItems, newItem],
    }));
  };

  const handleUpdateShippingItem = (id: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingItems: prev.shippingItems.map((item) => (item.id === id ? { ...item, text } : item)),
    }));
  };

  const handleDeleteShippingItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingItems: prev.shippingItems.filter((item) => item.id !== id),
    }));
  };

  // Section 4: Social Links Handlers
  const handleUpdateSocial = (id: string, partial: Partial<FooterSocialLink>) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  };

  // Section 5: Payment Badge Toggles
  const handleTogglePaymentMethod = (key: keyof FooterConfig['paymentMethods']) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [key]: !prev.paymentMethods[key],
      },
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold font-serif-luxury text-slate-100 flex items-center gap-2">
            <Globe className="w-6 h-6 text-[var(--brand-gold)]" />
            <span>Footer System Manager</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage public website footer branding, contact details, navigation links, shipping badge highlights, newsletter text, payment logos, and copyright statements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-amber-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'brand_contact', label: '1. Brand & Contact Info', icon: MapPin },
          { id: 'nav_columns', label: '2. Navigation Columns', icon: Layers },
          { id: 'shipping', label: '3. Worldwide Shipping Column', icon: Truck },
          { id: 'newsletter', label: '4. Newsletter & Signup', icon: Send },
          { id: 'payments_social', label: '5. Payments, Social & Copyright', icon: CreditCard },
          { id: 'preview', label: '6. Live Footer Preview', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound?.('click');
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md font-extrabold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Brand & Contact Info */}
      {activeTab === 'brand_contact' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Brand Identity & Contact Details</span>
              </h2>
              <p className="text-[11px] text-slate-400">Shown in the primary column of the customer footer.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
              <span>Show Column:</span>
              <input
                type="checkbox"
                checked={formData.showBrandColumn}
                onChange={(e) => handleBrandContactChange('showBrandColumn', e.target.checked)}
                className="w-4 h-4 accent-[var(--brand-gold)] rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Brand Logo Text</label>
              <input
                type="text"
                value={formData.brandLogoText}
                onChange={(e) => handleBrandContactChange('brandLogoText', e.target.value)}
                placeholder="e.g. HAKKIVEDA"
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Custom Brand Logo Image URL (Optional)</label>
              <input
                type="text"
                value={formData.brandLogo}
                onChange={(e) => handleBrandContactChange('brandLogo', e.target.value)}
                placeholder="https://... (Leave blank to use wordmark)"
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Footer Brand Story / Description</label>
            <textarea
              rows={3}
              value={formData.brandDescription}
              onChange={(e) => handleBrandContactChange('brandDescription', e.target.value)}
              placeholder="e.g. Blend of Hakki-Pikki Tribe & Ayurveda..."
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                <span>Official Address</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleBrandContactChange('address', e.target.value)}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                <span>Phone Number</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleBrandContactChange('phone', e.target.value)}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Number (e.g. 917619536831)</span>
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleBrandContactChange('whatsappNumber', e.target.value)}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
              <span>Support Email Address</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleBrandContactChange('email', e.target.value)}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Navigation Columns */}
      {activeTab === 'nav_columns' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Footer Navigation Columns ({formData.columns.length})</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">Customize columns, titles, menu items, URLs, and badges in the customer footer.</p>
            </div>
            <button
              onClick={handleAddColumn}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-100 flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Add New Column</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.columns.map((col) => (
              <div key={col.id} className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg relative">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Column Title</label>
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => handleColumnTitleChange(col.id, e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-lg text-xs font-bold text-slate-100"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <button
                      onClick={() => handleToggleColumn(col.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        col.enabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {col.enabled ? 'Enabled' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => handleDeleteColumn(col.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Column"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Link Items */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">Links ({col.links.length})</span>
                    <button
                      onClick={() => handleAddLink(col.id)}
                      className="text-[11px] font-bold text-[var(--brand-gold)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  {col.links.map((lnk) => (
                    <div key={lnk.id} className="bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">Label</label>
                          <input
                            type="text"
                            value={lnk.label}
                            onChange={(e) => handleUpdateLink(col.id, lnk.id, { label: e.target.value })}
                            className="w-full bg-black/30 border border-white/10 p-1.5 rounded text-xs text-slate-100 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold uppercase block mb-0.5">URL / Link Target</label>
                          <input
                            type="text"
                            value={lnk.url}
                            onChange={(e) => handleUpdateLink(col.id, lnk.id, { url: e.target.value })}
                            placeholder="e.g. #products or quiz"
                            className="w-full bg-black/30 border border-white/10 p-1.5 rounded text-xs text-slate-100 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-1.5 text-[10px] text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!lnk.isBadge}
                            onChange={(e) => handleUpdateLink(col.id, lnk.id, { isBadge: e.target.checked })}
                            className="w-3.5 h-3.5 accent-[var(--brand-gold)] rounded cursor-pointer"
                          />
                          <span>Show Badge tag</span>
                        </label>

                        {lnk.isBadge && (
                          <input
                            type="text"
                            value={lnk.badgeText || ''}
                            onChange={(e) => handleUpdateLink(col.id, lnk.id, { badgeText: e.target.value })}
                            placeholder="Badge e.g. AI Powered"
                            className="bg-black/30 border border-white/10 px-2 py-0.5 rounded text-[10px] text-[var(--brand-gold)] font-bold w-28"
                          />
                        )}

                        <button
                          onClick={() => handleDeleteLink(col.id, lnk.id)}
                          className="text-slate-400 hover:text-red-400 text-[10px] font-bold underline cursor-pointer ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Worldwide Shipping Column */}
      {activeTab === 'shipping' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Worldwide Shipping Column Settings</span>
              </h2>
              <p className="text-[11px] text-slate-400">Configure global shipping highlights, policy popups, and B2B export link.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
              <span>Show Column:</span>
              <input
                type="checkbox"
                checked={formData.showShippingColumn}
                onChange={(e) => setFormData((prev) => ({ ...prev, showShippingColumn: e.target.checked }))}
                className="w-4 h-4 accent-[var(--brand-gold)] rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Shipping Section Heading</label>
              <input
                type="text"
                value={formData.shippingTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, shippingTitle: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Wholesale / Export Link Text</label>
              <input
                type="text"
                value={formData.wholesaleLinkText}
                onChange={(e) => setFormData((prev) => ({ ...prev, wholesaleLinkText: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>
          </div>

          {/* Shipping Items list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Bullet Highlights ({formData.shippingItems.length})</span>
              <button
                onClick={handleAddShippingItem}
                className="text-xs font-bold text-[var(--brand-gold)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.shippingItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 bg-[var(--brand-primary-deep)] p-2.5 rounded-xl border border-white/10">
                  <span className="text-[var(--brand-gold)] font-bold shrink-0">✓</span>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateShippingItem(item.id, e.target.value)}
                    className="flex-1 bg-black/20 border border-white/10 p-2 rounded text-xs text-slate-100 font-medium"
                  />
                  <button
                    onClick={() => handleDeleteShippingItem(item.id)}
                    className="text-slate-400 hover:text-red-400 p-1.5 cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Policy popup text */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Shipping Policy Button Label</label>
              <input
                type="text"
                value={formData.shippingPolicyButtonText}
                onChange={(e) => setFormData((prev) => ({ ...prev, shippingPolicyButtonText: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Shipping Policy Modal Popup Content</label>
              <textarea
                rows={3}
                value={formData.shippingPolicyModalContent}
                onChange={(e) => setFormData((prev) => ({ ...prev, shippingPolicyModalContent: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Newsletter & Signup */}
      {activeTab === 'newsletter' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Newsletter & Lead Capture Column</span>
              </h2>
              <p className="text-[11px] text-slate-400">Configure email subscription headings, incentive copy, and success messages.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
              <span>Show Column:</span>
              <input
                type="checkbox"
                checked={formData.showNewsletterColumn}
                onChange={(e) => setFormData((prev) => ({ ...prev, showNewsletterColumn: e.target.checked }))}
                className="w-4 h-4 accent-[var(--brand-gold)] rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Newsletter Title Heading</label>
              <input
                type="text"
                value={formData.newsletterHeading}
                onChange={(e) => setFormData((prev) => ({ ...prev, newsletterHeading: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Email Input Placeholder</label>
              <input
                type="text"
                value={formData.newsletterPlaceholder}
                onChange={(e) => setFormData((prev) => ({ ...prev, newsletterPlaceholder: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Incentive Description Subtext</label>
            <textarea
              rows={2}
              value={formData.newsletterSubtext}
              onChange={(e) => setFormData((prev) => ({ ...prev, newsletterSubtext: e.target.value }))}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Submit Button Label</label>
              <input
                type="text"
                value={formData.newsletterButtonText}
                onChange={(e) => setFormData((prev) => ({ ...prev, newsletterButtonText: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Success Welcome Banner Message</label>
              <input
                type="text"
                value={formData.newsletterSuccessMessage}
                onChange={(e) => setFormData((prev) => ({ ...prev, newsletterSuccessMessage: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 text-emerald-400 font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Payments, Social & Copyright */}
      {activeTab === 'payments_social' && (
        <div className="space-y-6">
          {/* Payment Badges Toggle */}
          <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span>Payment Method Trust Badges</span>
                </h2>
                <p className="text-[11px] text-slate-400">Enable or disable payment gateway icons rendered in the footer trust bar.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                <span>Show Payment Icons:</span>
                <input
                  type="checkbox"
                  checked={formData.showPaymentBadges}
                  onChange={(e) => setFormData((prev) => ({ ...prev, showPaymentBadges: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--brand-gold)] rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { key: 'upi', name: 'UPI Payment (GPay, PhonePe, Paytm)' },
                { key: 'visa', name: 'Visa Credit & Debit' },
                { key: 'mastercard', name: 'Mastercard International' },
                { key: 'rupay', name: 'RuPay Cards' },
                { key: 'netbanking', name: 'NetBanking (50+ Banks)' },
                { key: 'cod', name: 'Cash On Delivery (COD)' },
                { key: 'paypal', name: 'PayPal Global Express' },
              ].map((pm) => {
                const k = pm.key as keyof FooterConfig['paymentMethods'];
                const isEnabled = formData.paymentMethods[k];
                return (
                  <button
                    key={k}
                    onClick={() => handleTogglePaymentMethod(k)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                      isEnabled
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60'
                    }`}
                  >
                    <span>{pm.name}</span>
                    <span className="text-xs">{isEnabled ? '✓' : '✕'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span>Social Media Profiles</span>
                </h2>
                <p className="text-[11px] text-slate-400">Configure profile URLs for Facebook, Instagram, YouTube, and WhatsApp.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                <span>Show Social Section:</span>
                <input
                  type="checkbox"
                  checked={formData.showSocialLinks}
                  onChange={(e) => setFormData((prev) => ({ ...prev, showSocialLinks: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--brand-gold)] rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.socialLinks.map((soc) => (
                <div key={soc.id} className="bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] text-[var(--brand-gold)]">{soc.platform}</span>
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={soc.enabled}
                        onChange={(e) => handleUpdateSocial(soc.id, { enabled: e.target.checked })}
                        className="w-3.5 h-3.5 accent-[var(--brand-gold)] rounded cursor-pointer"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={soc.url}
                    onChange={(e) => handleUpdateSocial(soc.id, { url: e.target.value })}
                    placeholder={`https://${soc.platform}.com/...`}
                    className="w-full bg-black/30 border border-white/10 p-2 rounded text-xs text-slate-100 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Copyright & Bottom Bar */}
          <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Copyright & Bottom Bar</span>
            </h2>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Copyright Statement</label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => setFormData((prev) => ({ ...prev, copyrightText: e.target.value }))}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Live Footer Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
              <span>
                Below is a 100% real-time rendering of your customer footer as it appears on the public website. (Admin Portal link is strictly hidden).
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold shrink-0 cursor-pointer"
            >
              Save Now
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--brand-gold)]/40 shadow-2xl">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
};
