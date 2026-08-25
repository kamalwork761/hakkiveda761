import React, { useState } from 'react';
import {
  Smartphone,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  RotateCcw,
  Eye,
  Layers,
  ShoppingBag,
  Heart,
  Tag,
  Building2,
  FileText,
  HelpCircle,
  Sparkles,
  BookOpen,
  User,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Home,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Link as LinkIcon,
  Shield,
  Leaf,
  LogOut,
  X,
  Compass,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  MobileNavConfig,
  MobileNavItem,
  MobileNavChildLink,
  MobileNavSocialLink,
  MobileNavBadgeType,
} from '../types/store';

interface Props {
  showToast?: (title: string, message: string, type?: 'success' | 'error') => void;
}

const AVAILABLE_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Home,
  Layers,
  ShoppingBag,
  Heart,
  Tag,
  Building2,
  FileText,
  HelpCircle,
  Sparkles,
  BookOpen,
  User,
  MessageCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Shield,
  Leaf,
  Compass,
  Link: LinkIcon,
};

export const AdminMobileNavManager: React.FC<Props> = ({ showToast }) => {
  const {
    mobileNavConfig,
    updateMobileNavConfig,
    resetMobileNavConfig,
    categories,
    siteSettings,
    currentUser,
    wishlist,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'bottom_nav' | 'menu' | 'blogs' | 'quicklinks' | 'categories' | 'social_auth' | 'preview'>('menu');
  const [config, setConfig] = useState<MobileNavConfig>(() => JSON.parse(JSON.stringify(mobileNavConfig)));
  const [isSaving, setIsSaving] = useState(false);
  const [previewDeviceWidth, setPreviewDeviceWidth] = useState<number>(375);

  // Synchronize when store loads
  React.useEffect(() => {
    setConfig(JSON.parse(JSON.stringify(mobileNavConfig)));
  }, [mobileNavConfig]);

  // Preview interactive state
  const [previewOpenCategories, setPreviewOpenCategories] = useState(false);
  const [previewOpenSubcategory, setPreviewOpenSubcategory] = useState<string | null>(null);
  const [previewOpenBlogs, setPreviewOpenBlogs] = useState(false);
  const [previewOpenQuickLinks, setPreviewOpenQuickLinks] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateMobileNavConfig(config);
      if (success) {
        if (showToast) {
          showToast('Settings Saved', 'Mobile Navigation Drawer configuration updated and synced to database.', 'success');
        }
      } else {
        if (showToast) {
          showToast('Save Error', 'Failed to save changes to database.', 'error');
        }
      }
    } catch (err: any) {
      if (showToast) {
        showToast('Error', err.message || 'Failed to update mobile navigation.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all Mobile Navigation settings to defaults?')) {
      setIsSaving(true);
      try {
        await resetMobileNavConfig();
        if (showToast) {
          showToast('Reset Complete', 'Mobile Navigation restored to default layout.', 'success');
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Menu Items Reordering & Editing
  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...config.menuItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    newItems.forEach((item, idx) => {
      item.sortOrder = idx + 1;
    });
    setConfig({ ...config, menuItems: newItems });
  };

  const updateMenuItem = (id: string, partial: Partial<MobileNavItem>) => {
    const newItems = config.menuItems.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    );
    setConfig({ ...config, menuItems: newItems });
  };

  const addCustomMenuItem = () => {
    const newItem: MobileNavItem = {
      id: `mnav-custom-${Date.now()}`,
      type: 'LINK',
      label: 'Custom Link',
      route: '/collections',
      icon: 'Link',
      enabled: true,
      sortOrder: config.menuItems.length + 1,
      badge: 'NONE',
    };
    setConfig({ ...config, menuItems: [...config.menuItems, newItem] });
  };

  const deleteMenuItem = (id: string) => {
    const newItems = config.menuItems.filter((i) => i.id !== id);
    newItems.forEach((item, idx) => {
      item.sortOrder = idx + 1;
    });
    setConfig({ ...config, menuItems: newItems });
  };

  // Blogs & More Children
  const blogsItem = config.menuItems.find((i) => i.id === 'mnav-blogs-more');
  const updateBlogsChildren = (newChildren: MobileNavChildLink[]) => {
    const newItems = config.menuItems.map((item) =>
      item.id === 'mnav-blogs-more' ? { ...item, children: newChildren } : item
    );
    setConfig({ ...config, menuItems: newItems });
  };

  const addBlogsChild = () => {
    const currentChildren = blogsItem?.children || [];
    const newChild: MobileNavChildLink = {
      id: `mnav-child-blog-${Date.now()}`,
      label: 'New Article / Link',
      route: '/#blogs',
      icon: 'FileText',
      enabled: true,
      sortOrder: currentChildren.length + 1,
      badge: 'NONE',
    };
    updateBlogsChildren([...currentChildren, newChild]);
  };

  const moveBlogsChild = (index: number, direction: 'up' | 'down') => {
    if (!blogsItem?.children) return;
    const newChildren = [...blogsItem.children];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChildren.length) return;
    const temp = newChildren[index];
    newChildren[index] = newChildren[targetIndex];
    newChildren[targetIndex] = temp;
    newChildren.forEach((c, idx) => {
      c.sortOrder = idx + 1;
    });
    updateBlogsChildren(newChildren);
  };

  // Quick Links Children
  const quickLinksItem = config.menuItems.find((i) => i.id === 'mnav-quick-links');
  const updateQuickLinksChildren = (newChildren: MobileNavChildLink[]) => {
    const newItems = config.menuItems.map((item) =>
      item.id === 'mnav-quick-links' ? { ...item, children: newChildren } : item
    );
    setConfig({ ...config, menuItems: newItems });
  };

  const addQuickLinksChild = () => {
    const currentChildren = quickLinksItem?.children || [];
    const newChild: MobileNavChildLink = {
      id: `mnav-child-quick-${Date.now()}`,
      label: 'New Quick Link',
      route: '/#faq',
      icon: 'HelpCircle',
      enabled: true,
      sortOrder: currentChildren.length + 1,
      badge: 'NONE',
    };
    updateQuickLinksChildren([...currentChildren, newChild]);
  };

  const moveQuickLinksChild = (index: number, direction: 'up' | 'down') => {
    if (!quickLinksItem?.children) return;
    const newChildren = [...quickLinksItem.children];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChildren.length) return;
    const temp = newChildren[index];
    newChildren[index] = newChildren[targetIndex];
    newChildren[targetIndex] = temp;
    newChildren.forEach((c, idx) => {
      c.sortOrder = idx + 1;
    });
    updateQuickLinksChildren(newChildren);
  };

  // Social Links
  const updateSocialLink = (id: string, partial: Partial<MobileNavSocialLink>) => {
    const newSocials = config.socialLinks.map((s) =>
      s.id === id ? { ...s, ...partial } : s
    );
    setConfig({ ...config, socialLinks: newSocials });
  };

  // Badge Color Helper
  const getBadgeStyle = (badgeType?: MobileNavBadgeType) => {
    switch (badgeType) {
      case 'green':
        return 'bg-[#0A5A2A] text-white';
      case 'amber':
        return 'bg-amber-600 text-white';
      case 'red':
        return 'bg-red-600 text-white';
      case 'purple':
        return 'bg-purple-700 text-white';
      case 'gold':
      default:
        return 'bg-[#D4AF37] text-[#123F2A]';
    }
  };

  const renderIcon = (iconName?: string, className: string = 'w-4 h-4') => {
    if (!iconName) return null;
    const IconComp = AVAILABLE_ICONS[iconName] || LinkIcon;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)] shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif-luxury text-slate-100 flex items-center gap-2.5">
              Mobile Navigation Manager
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30">
                Phase 3
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Control the structure, dynamic categories, accordions, badges, social links, and live preview for the mobile hamburger drawer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:brightness-110 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3 font-sans">
        <button
          type="button"
          onClick={() => setActiveTab('bottom_nav')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bottom_nav'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Bottom Navigation ({config.bottomNavEnabled ? 'Enabled' : 'Disabled'})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'menu'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Menu Items & Structure ({config.menuItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('blogs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'blogs'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Blogs & More ({blogsItem?.children?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('quicklinks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quicklinks'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Quick Links ({quickLinksItem?.children?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          Botanical Categories
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social_auth')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'social_auth'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Social, Auth & Footer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Interactive Preview
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB: MOBILE BOTTOM NAVIGATION & STICKY HEADER SETTING */}
      {/* ========================================================= */}
      {activeTab === 'bottom_nav' && (
        <div className="space-y-6">
          <div className="bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100">Mobile Bottom Navigation</h2>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      config.bottomNavEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {config.bottomNavEnabled ? 'Currently Enabled' : 'Currently Disabled (Default)'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Control whether the 6-button app-style mobile bottom navigation bar is active, or use the clean mobile web experience with a permanent sticky top header.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, bottomNavEnabled: false })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !config.bottomNavEnabled
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  Disabled (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, bottomNavEnabled: true })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    config.bottomNavEnabled
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  Enabled
                </button>
              </div>
            </div>

            {/* Behavior Explanation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Disabled State Info */}
              <div
                className={`p-5 rounded-xl border transition-all ${
                  !config.bottomNavEnabled
                    ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30'
                    : 'bg-white/[0.02] border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">When Bottom Navigation is Disabled</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                  <li>
                    <strong className="text-slate-100">No Bottom Bar:</strong> Floating bottom navigation bar is completely hidden on mobile web.
                  </li>
                  <li>
                    <strong className="text-slate-100">Zero Empty Space:</strong> Removes reserved bottom spacing/padding for maximum screen estate.
                  </li>
                  <li>
                    <strong className="text-[var(--brand-gold)]">Permanent Sticky Mobile Header:</strong> Hamburger menu, search button, center HAKKIVEDA branding, cart, and account stay fixed at the top during scroll.
                  </li>
                  <li>
                    <strong className="text-slate-100">Repositioned Floating Controls:</strong> WhatsApp and Nature Audio controls rest safely above the mobile device bottom safe-area.
                  </li>
                </ul>
              </div>

              {/* Enabled State Info */}
              <div
                className={`p-5 rounded-xl border transition-all ${
                  config.bottomNavEnabled
                    ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/30'
                    : 'bg-white/[0.02] border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                    📱
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">When Bottom Navigation is Enabled</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                  <li>
                    <strong className="text-slate-100">6-Item Bottom Navigation:</strong> Restores Home, Shop, AI Quiz, Saved, Cart, and Menu buttons.
                  </li>
                  <li>
                    <strong className="text-slate-100">PWA / App Style Experience:</strong> Ideal for installed web apps or Android/iOS wrapper use.
                  </li>
                  <li>
                    <strong className="text-slate-100">Elevated Floating Controls:</strong> WhatsApp and ambient sound controls automatically sit above the bottom navigation bar.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: MENU ITEMS & STRUCTURE */}
      {/* ========================================================= */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Mobile Menu Items</h2>
              <p className="text-xs text-slate-400">Order, enable/disable, customize labels, badges, icons, and routing for top-level menu items.</p>
            </div>
            <button
              type="button"
              onClick={addCustomMenuItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)]/30 border border-[var(--brand-gold)]/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Item
            </button>
          </div>

          <div className="space-y-3">
            {config.menuItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.enabled
                    ? 'bg-[var(--brand-primary-dark)] border-white/10'
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Reorder & Status & Label */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveMenuItem(index, 'up')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === config.menuItems.length - 1}
                        onClick={() => moveMenuItem(index, 'down')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => updateMenuItem(item.id, { enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
                    </label>

                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--brand-gold)] shrink-0">
                      {renderIcon(item.icon, 'w-4 h-4')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--brand-gold)]">#{index + 1}</span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                          className="bg-[var(--brand-primary-deep)] border border-white/20 px-2.5 py-1 rounded text-xs font-bold text-slate-100 uppercase tracking-wider w-48 sm:w-60 focus:border-[var(--brand-gold)] focus:outline-hidden"
                        />
                        {item.type === 'CATEGORY_GROUP' && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                            Category Group
                          </span>
                        )}
                        {item.type === 'ACCORDION' && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-semibold">
                            Accordion
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Route, Badge, Icon, and Delete */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Route selector / text */}
                    {item.type !== 'CATEGORY_GROUP' && (
                      <div>
                        <input
                          type="text"
                          value={item.route}
                          onChange={(e) => updateMenuItem(item.id, { route: e.target.value })}
                          placeholder="Route or modal (e.g. /collections or modal:quiz)"
                          className="bg-[var(--brand-primary-deep)] border border-white/20 px-2.5 py-1 rounded text-xs text-slate-200 w-44 sm:w-56 focus:border-[var(--brand-gold)] focus:outline-hidden"
                        />
                      </div>
                    )}

                    {/* Icon selector */}
                    <div>
                      <select
                        value={item.icon || 'Link'}
                        onChange={(e) => updateMenuItem(item.id, { icon: e.target.value })}
                        className="bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1 rounded text-xs text-slate-200 focus:border-[var(--brand-gold)] focus:outline-hidden"
                      >
                        {Object.keys(AVAILABLE_ICONS).map((iconKey) => (
                          <option key={iconKey} value={iconKey}>
                            {iconKey}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Badge Selection */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={item.badge || 'NONE'}
                        onChange={(e) =>
                          updateMenuItem(item.id, {
                            badge: e.target.value as any,
                            badgeText: e.target.value === 'NONE' ? '' : item.badgeText || e.target.value,
                          })
                        }
                        className="bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1 rounded text-xs text-slate-200 focus:border-[var(--brand-gold)] focus:outline-hidden"
                      >
                        <option value="NONE">No Badge</option>
                        <option value="NEW">NEW</option>
                        <option value="HOT">HOT</option>
                        <option value="SALE">SALE</option>
                        <option value="B2B">B2B</option>
                        <option value="CUSTOM">Custom Badge</option>
                      </select>

                      {item.badge && item.badge !== 'NONE' && (
                        <>
                          <input
                            type="text"
                            value={item.badgeText || ''}
                            onChange={(e) => updateMenuItem(item.id, { badgeText: e.target.value })}
                            placeholder="Text"
                            className="bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1 rounded text-xs text-slate-200 w-16 focus:border-[var(--brand-gold)] focus:outline-hidden"
                          />
                          <select
                            value={item.badgeType || 'gold'}
                            onChange={(e) => updateMenuItem(item.id, { badgeType: e.target.value as any })}
                            className="bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1 rounded text-xs text-slate-200 focus:border-[var(--brand-gold)] focus:outline-hidden"
                          >
                            <option value="gold">Gold</option>
                            <option value="green">Green</option>
                            <option value="amber">Amber</option>
                            <option value="red">Red</option>
                            <option value="purple">Purple</option>
                          </select>
                        </>
                      )}
                    </div>

                    {/* Delete for custom links */}
                    {item.type === 'LINK' || item.type === 'CUSTOM' ? (
                      <button
                        type="button"
                        onClick={() => deleteMenuItem(item.id)}
                        className="p-1.5 rounded text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Menu Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BLOGS & MORE LINKS */}
      {/* ========================================================= */}
      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">"BLOGS & MORE" Accordion Sub-Links</h2>
              <p className="text-xs text-slate-400">
                These child links render inside the expandable "BLOGS & MORE" accordion in the mobile drawer.
              </p>
            </div>
            <button
              type="button"
              onClick={addBlogsChild}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)]/30 border border-[var(--brand-gold)]/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Child Link
            </button>
          </div>

          <div className="space-y-3">
            {(blogsItem?.children || []).map((child, index) => (
              <div
                key={child.id}
                className={`p-4 rounded-xl border transition-all ${
                  child.enabled
                    ? 'bg-[var(--brand-primary-dark)] border-white/10'
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveBlogsChild(index, 'up')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === (blogsItem?.children?.length || 1) - 1}
                        onClick={() => moveBlogsChild(index, 'down')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={child.enabled}
                        onChange={(e) => {
                          const updated = (blogsItem?.children || []).map((c) =>
                            c.id === child.id ? { ...c, enabled: e.target.checked } : c
                          );
                          updateBlogsChildren(updated);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
                    </label>

                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--brand-gold)] shrink-0">
                      {renderIcon(child.icon || 'FileText', 'w-4 h-4')}
                    </div>

                    <input
                      type="text"
                      value={child.label}
                      onChange={(e) => {
                        const updated = (blogsItem?.children || []).map((c) =>
                          c.id === child.id ? { ...c, label: e.target.value } : c
                        );
                        updateBlogsChildren(updated);
                      }}
                      className="bg-[var(--brand-primary-deep)] border border-white/20 px-2.5 py-1 rounded text-xs font-bold text-slate-100 w-52 sm:w-64 focus:border-[var(--brand-gold)] focus:outline-hidden"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={child.route}
                      onChange={(e) => {
                        const updated = (blogsItem?.children || []).map((c) =>
                          c.id === child.id ? { ...c, route: e.target.value } : c
                        );
                        updateBlogsChildren(updated);
                      }}
                      placeholder="Route or anchor (e.g. /#brand-story)"
                      className="bg-[var(--brand-primary-deep)] border border-white/20 px-2.5 py-1 rounded text-xs text-slate-200 w-44 sm:w-56 focus:border-[var(--brand-gold)] focus:outline-hidden"
                    />

                    {/* Badge */}
                    <select
                      value={child.badge || 'NONE'}
                      onChange={(e) => {
                        const updated = (blogsItem?.children || []).map((c) =>
                          c.id === child.id
                            ? {
                                ...c,
                                badge: e.target.value as any,
                                badgeText: e.target.value === 'NONE' ? '' : c.badgeText || e.target.value,
                              }
                            : c
                        );
                        updateBlogsChildren(updated);
                      }}
                      className="bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1 rounded text-xs text-slate-200"
                    >
                      <option value="NONE">No Badge</option>
                      <option value="HOT">HOT</option>
                      <option value="NEW">NEW</option>
                      <option value="CUSTOM">Custom</option>
                    </select>

                    {child.badge && child.badge !== 'NONE' && (
                      <input
                        type="text"
                        value={child.badgeText || ''}
                        onChange={(e) => {
                          const updated = (blogsItem?.children || []).map((c) =>
                            c.id === child.id ? { ...c, badgeText: e.target.value } : c
                          );
                          updateBlogsChildren(updated);
                        }}
                        placeholder="Text"
                        className="bg-[var(--brand-primary-deep)] border border-white/20 px-2 py-1 rounded text-xs text-slate-200 w-16"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = (blogsItem?.children || []).filter((c) => c.id !== child.id);
                        updateBlogsChildren(updated);
                      }}
                      className="p-1.5 rounded text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Delete Link"
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

      {/* ========================================================= */}
      {/* TAB 3: QUICK LINKS */}
      {/* ========================================================= */}
      {activeTab === 'quicklinks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">"QUICK LINKS" Accordion Sub-Links</h2>
              <p className="text-xs text-slate-400">
                These child links render inside the expandable "QUICK LINKS" accordion in the mobile drawer.
              </p>
            </div>
            <button
              type="button"
              onClick={addQuickLinksChild}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)]/30 border border-[var(--brand-gold)]/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Quick Link
            </button>
          </div>

          <div className="space-y-3">
            {(quickLinksItem?.children || []).map((child, index) => (
              <div
                key={child.id}
                className={`p-4 rounded-xl border transition-all ${
                  child.enabled
                    ? 'bg-[var(--brand-primary-dark)] border-white/10'
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveQuickLinksChild(index, 'up')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === (quickLinksItem?.children?.length || 1) - 1}
                        onClick={() => moveQuickLinksChild(index, 'down')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={child.enabled}
                        onChange={(e) => {
                          const updated = (quickLinksItem?.children || []).map((c) =>
                            c.id === child.id ? { ...c, enabled: e.target.checked } : c
                          );
                          updateQuickLinksChildren(updated);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
                    </label>

                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--brand-gold)] shrink-0">
                      {renderIcon(child.icon || 'HelpCircle', 'w-4 h-4')}
                    </div>

                    <input
                      type="text"
                      value={child.label}
                      onChange={(e) => {
                        const updated = (quickLinksItem?.children || []).map((c) =>
                          c.id === child.id ? { ...c, label: e.target.value } : c
                        );
                        updateQuickLinksChildren(updated);
                      }}
                      className="bg-[var(--brand-primary-deep)] border border-white/20 px-2.5 py-1 rounded text-xs font-bold text-slate-100 w-52 sm:w-64 focus:border-[var(--brand-gold)] focus:outline-hidden"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={child.route}
                      onChange={(e) => {
                        const updated = (quickLinksItem?.children || []).map((c) =>
                          c.id === child.id ? { ...c, route: e.target.value } : c
                        );
                        updateQuickLinksChildren(updated);
                      }}
                      placeholder="URL or modal:auth or https://wa.me/..."
                      className="bg-[var(--brand-primary-deep)] border border-white/20 px-2.5 py-1 rounded text-xs text-slate-200 w-44 sm:w-60 focus:border-[var(--brand-gold)] focus:outline-hidden"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updated = (quickLinksItem?.children || []).filter((c) => c.id !== child.id);
                        updateQuickLinksChildren(updated);
                      }}
                      className="p-1.5 rounded text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Delete Link"
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

      {/* ========================================================= */}
      {/* TAB 4: BOTANICAL CATEGORIES */}
      {/* ========================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-slate-100">Category Display Rules</h2>
            <p className="text-xs text-slate-300">
              The mobile drawer automatically integrates with your active store categories. You can toggle whether subcategories appear as nested accordions.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.categorySettings.showCategories}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      categorySettings: {
                        ...config.categorySettings,
                        showCategories: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-[var(--brand-gold)]"
                />
                <span className="text-xs font-bold text-slate-200">Show Botanical Categories in Drawer</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.categorySettings.showSubcategories}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      categorySettings: {
                        ...config.categorySettings,
                        showSubcategories: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-[var(--brand-gold)]"
                />
                <span className="text-xs font-bold text-slate-200">Enable Subcategory Accordions</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Store Categories in Mobile Drawer</h3>
            {categories.map((cat, idx) => {
              const override = config.categorySettings.categoryOverrides[cat.id] || {
                show: true,
                sortOrder: idx + 1,
                showSubcategories: true,
              };

              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl bg-[var(--brand-primary-dark)] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={override.show !== false}
                        onChange={(e) => {
                          const updated = {
                            ...config.categorySettings.categoryOverrides,
                            [cat.id]: { ...override, show: e.target.checked },
                          };
                          setConfig({
                            ...config,
                            categorySettings: {
                              ...config.categorySettings,
                              categoryOverrides: updated,
                            },
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
                    </label>

                    <div>
                      <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">{cat.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {cat.subcategories?.length || 0} subcategories • Slug: /{cat.slug || cat.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={override.showSubcategories !== false}
                        onChange={(e) => {
                          const updated = {
                            ...config.categorySettings.categoryOverrides,
                            [cat.id]: { ...override, showSubcategories: e.target.checked },
                          };
                          setConfig({
                            ...config,
                            categorySettings: {
                              ...config.categorySettings,
                              categoryOverrides: updated,
                            },
                          });
                        }}
                        className="w-3.5 h-3.5 accent-[var(--brand-gold)]"
                      />
                      <span>Expandable Subcategories</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SOCIAL, AUTH & FOOTER */}
      {/* ========================================================= */}
      {activeTab === 'social_auth' && (
        <div className="space-y-6">
          {/* Top Auth Bar Settings */}
          <div className="bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--brand-gold)]" />
                Sign In / Register Top Bar
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.authBar.show}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      authBar: { ...config.authBar, show: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
              </label>
            </div>
            <p className="text-xs text-slate-300">
              The authentication bar appears at the very top of the mobile navigation drawer, giving customers instant access to sign in or view their account.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Guest Sign In Label</label>
                <input
                  type="text"
                  value={config.authBar.signInText}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      authBar: { ...config.authBar, signInText: e.target.value },
                    })
                  }
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 px-3 py-2 rounded-xl text-xs text-slate-100 focus:border-[var(--brand-gold)] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Guest Register Label</label>
                <input
                  type="text"
                  value={config.authBar.registerText}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      authBar: { ...config.authBar, registerText: e.target.value },
                    })
                  }
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 px-3 py-2 rounded-xl text-xs text-slate-100 focus:border-[var(--brand-gold)] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Logged-in Account Label</label>
                <input
                  type="text"
                  value={config.authBar.accountText}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      authBar: { ...config.authBar, accountText: e.target.value },
                    })
                  }
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 px-3 py-2 rounded-xl text-xs text-slate-100 focus:border-[var(--brand-gold)] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Logout Button Label</label>
                <input
                  type="text"
                  value={config.authBar.logoutText}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      authBar: { ...config.authBar, logoutText: e.target.value },
                    })
                  }
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 px-3 py-2 rounded-xl text-xs text-slate-100 focus:border-[var(--brand-gold)] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--brand-gold)]" />
              Follow Us Social Media Icons
            </h2>
            <p className="text-xs text-slate-300">
              Customize URLs and visibility for brand channels displayed in the drawer bottom footer.
            </p>

            <div className="space-y-3 pt-2">
              {config.socialLinks.map((social) => (
                <div
                  key={social.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--brand-primary-deep)] border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={social.enabled}
                        onChange={(e) => updateSocialLink(social.id, { enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--brand-gold)]"></div>
                    </label>

                    <span className="text-xs font-bold text-slate-100 uppercase tracking-wider w-24">
                      {social.platform}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => updateSocialLink(social.id, { url: e.target.value })}
                    placeholder={`https://${social.platform}.com/...`}
                    className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 px-3 py-1.5 rounded-lg text-xs text-slate-100 focus:border-[var(--brand-gold)] focus:outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Copyright Text */}
          <div className="bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-slate-100">Drawer Footer Copyright</h2>
            <input
              type="text"
              value={config.copyrightText}
              onChange={(e) => setConfig({ ...config, copyrightText: e.target.value })}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 px-3 py-2 rounded-xl text-xs text-slate-100 focus:border-[var(--brand-gold)] focus:outline-hidden"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: LIVE INTERACTIVE PREVIEW */}
      {/* ========================================================= */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--brand-primary-dark)] p-4 rounded-xl border border-white/10">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Interactive Mobile Frame Preview</h2>
              <p className="text-xs text-slate-400">Click links, accordions, and subcategories below to test the mobile drawer and bottom navigation in real-time.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Bottom Nav Quick Toggle */}
              <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 text-xs">
                <span className="text-slate-400 font-medium">Bottom Bar:</span>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, bottomNavEnabled: !config.bottomNavEnabled })}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    config.bottomNavEnabled
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {config.bottomNavEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Device Width Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-300">Width:</span>
                {[320, 360, 375, 390, 412].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setPreviewDeviceWidth(w)}
                    className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                      previewDeviceWidth === w
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center py-6 bg-slate-950/80 rounded-2xl border border-white/10 overflow-x-auto">
            {/* Phone Shell */}
            <div
              style={{ width: `${previewDeviceWidth}px` }}
              className="bg-[#FAF8F4] text-[#123F2A] rounded-[32px] border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col font-sans relative"
            >
              {/* Phone Speaker Notch */}
              <div className="bg-slate-800 h-5 w-full flex items-center justify-center">
                <div className="w-16 h-1 bg-slate-600 rounded-full"></div>
              </div>

              {/* 1. TOP AUTH BAR */}
              {config.authBar.show && (
                <div className="bg-[#0A5A2A] text-white px-5 py-3 flex items-center justify-between text-xs font-bold tracking-wider uppercase border-b border-[#D8CDAF]/30">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span>{config.authBar.signInText}</span>
                    <span className="text-white/40">/</span>
                    <span>{config.authBar.registerText}</span>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/50 px-2 py-0.5 rounded">
                    JOIN CLUB
                  </span>
                </div>
              )}

              {/* 2. HEADER BRAND LOGO & CLOSE */}
              <div className="p-5 border-b border-[#E5DEC9] bg-[#FAF8F4] flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg tracking-widest text-[#123F2A]">
                    {siteSettings.logoText || 'HAKKIVEDA'}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0A5A2A] block">
                    AYURVEDIC SANCTUARY
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F3EFE6] border border-[#E5DEC9] flex items-center justify-center text-[#123F2A]">
                  <X className="w-4 h-4" />
                </div>
              </div>

              {/* 3. MENU ITEMS LIST */}
              <div className="flex-1 divide-y divide-[#E5DEC9] bg-[#FAF8F4] overflow-y-auto max-h-[500px]">
                {config.menuItems
                  .filter((i) => i.enabled)
                  .map((item) => {
                    // CATEGORY GROUP ITEM
                    if (item.type === 'CATEGORY_GROUP') {
                      return (
                        <div key={item.id} className="w-full">
                          <button
                            type="button"
                            onClick={() => setPreviewOpenCategories(!previewOpenCategories)}
                            className={`w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] uppercase tracking-wider hover:bg-[#F3EFE6] transition-colors cursor-pointer ${
                              previewOpenCategories ? 'bg-[#F3EFE6] text-[#0A5A2A]' : ''
                            }`}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-[#7A6E58] transition-transform duration-200 shrink-0 ${
                                previewOpenCategories ? 'rotate-180 text-[#0A5A2A]' : ''
                              }`}
                            />
                          </button>

                          {previewOpenCategories && config.categorySettings.showCategories && (
                            <div className="bg-[#F4EFE6]/70 border-y border-[#E5DEC9] py-1 text-xs divide-y divide-[#E5DEC9]/50 font-sans">
                              {categories.map((cat) => {
                                const override = config.categorySettings.categoryOverrides[cat.id];
                                if (override && override.show === false) return null;
                                const isSubOpen = previewOpenSubcategory === cat.id;

                                return (
                                  <div key={cat.id} className="w-full">
                                    <div className="flex items-center justify-between py-2 px-6 hover:bg-[#EBE4D5] transition-colors">
                                      <span className="font-semibold text-[#123F2A]">{cat.name}</span>
                                      {cat.subcategories && cat.subcategories.length > 0 && config.categorySettings.showSubcategories && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setPreviewOpenSubcategory(isSubOpen ? null : cat.id)
                                          }
                                          className="p-1 text-[#7A6E58] hover:text-[#0A5A2A]"
                                        >
                                          <ChevronRight
                                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                              isSubOpen ? 'rotate-90 text-[#0A5A2A]' : ''
                                            }`}
                                          />
                                        </button>
                                      )}
                                    </div>

                                    {isSubOpen && cat.subcategories && (
                                      <div className="bg-[#EBE4D5]/60 pl-10 pr-6 py-1.5 space-y-1 text-[11px] text-[#4A4036]">
                                        {cat.subcategories.map((sub) => (
                                          <div key={sub} className="py-1 hover:text-[#0A5A2A]">
                                            {sub}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // BLOGS & MORE ACCORDION
                    if (item.id === 'mnav-blogs-more') {
                      return (
                        <div key={item.id} className="w-full">
                          <button
                            type="button"
                            onClick={() => setPreviewOpenBlogs(!previewOpenBlogs)}
                            className={`w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] uppercase tracking-wider hover:bg-[#F3EFE6] transition-colors cursor-pointer ${
                              previewOpenBlogs ? 'bg-[#F3EFE6] text-[#0A5A2A]' : ''
                            }`}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-[#7A6E58] transition-transform duration-200 shrink-0 ${
                                previewOpenBlogs ? 'rotate-180 text-[#0A5A2A]' : ''
                              }`}
                            />
                          </button>

                          {previewOpenBlogs && (
                            <div className="bg-[#F4EFE6]/70 border-y border-[#E5DEC9] py-1.5 pl-7 pr-4 space-y-0.5 text-xs font-medium">
                              {(item.children || [])
                                .filter((c) => c.enabled)
                                .map((child) => (
                                  <div
                                    key={child.id}
                                    className="py-2 px-2 text-[#2C3E2D] hover:text-[#0A5A2A] flex items-center justify-between cursor-pointer"
                                  >
                                    <span className="flex items-center gap-2">
                                      {renderIcon(child.icon, 'w-3.5 h-3.5 text-[#0A5A2A]')}
                                      {child.label}
                                    </span>
                                    {child.badge && child.badge !== 'NONE' && (
                                      <span
                                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs ${getBadgeStyle(
                                          child.badgeType
                                        )}`}
                                      >
                                        {child.badgeText || child.badge}
                                      </span>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // QUICK LINKS ACCORDION
                    if (item.id === 'mnav-quick-links') {
                      return (
                        <div key={item.id} className="w-full">
                          <button
                            type="button"
                            onClick={() => setPreviewOpenQuickLinks(!previewOpenQuickLinks)}
                            className={`w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] uppercase tracking-wider hover:bg-[#F3EFE6] transition-colors cursor-pointer ${
                              previewOpenQuickLinks ? 'bg-[#F3EFE6] text-[#0A5A2A]' : ''
                            }`}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-[#7A6E58] transition-transform duration-200 shrink-0 ${
                                previewOpenQuickLinks ? 'rotate-180 text-[#0A5A2A]' : ''
                              }`}
                            />
                          </button>

                          {previewOpenQuickLinks && (
                            <div className="bg-[#F4EFE6]/70 border-y border-[#E5DEC9] py-1.5 pl-7 pr-4 space-y-0.5 text-xs font-medium">
                              {(item.children || [])
                                .filter((c) => c.enabled)
                                .map((child) => (
                                  <div
                                    key={child.id}
                                    className="py-2 px-2 text-[#2C3E2D] hover:text-[#0A5A2A] flex items-center justify-between cursor-pointer"
                                  >
                                    <span className="flex items-center gap-2">
                                      {renderIcon(child.icon, 'w-3.5 h-3.5 text-[#0A5A2A]')}
                                      {child.label}
                                    </span>
                                    {child.route?.startsWith('http') && (
                                      <ExternalLink className="w-3 h-3 opacity-60" />
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // STANDARD STATIC LINK / BADGE LINK
                    return (
                      <div
                        key={item.id}
                        className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] uppercase tracking-wider hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          {renderIcon(item.icon, 'w-4 h-4 text-[#123F2A]/80')}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && item.badge !== 'NONE' && (
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-2xs ${getBadgeStyle(
                              item.badgeType
                            )}`}
                          >
                            {item.badgeText || item.badge}
                          </span>
                        )}
                        {item.id === 'mnav-wishlist' && wishlist.length > 0 && (
                          <span className="bg-[#0A5A2A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {wishlist.length}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* 4. DRAWER BOTTOM FOOTER: SOCIAL & COPYRIGHT */}
              <div className="p-5 border-t border-[#E5DEC9] bg-[#F3EFE6] space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#123F2A]/70 block mb-2 font-sans">
                    FOLLOW US ON
                  </span>
                  <div className="flex items-center gap-3">
                    {config.socialLinks
                      .filter((s) => s.enabled)
                      .map((social) => (
                        <div
                          key={social.id}
                          className="w-8 h-8 rounded-full bg-[#FAF8F4] border border-[#D8CDAF] text-[#123F2A] flex items-center justify-center shadow-2xs cursor-pointer hover:bg-[#0A5A2A] hover:text-white transition-colors"
                        >
                          {renderIcon(
                            social.platform === 'facebook'
                              ? 'Facebook'
                              : social.platform === 'instagram'
                              ? 'Instagram'
                              : social.platform === 'youtube'
                              ? 'Youtube'
                              : 'MessageCircle',
                            'w-4 h-4'
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5DEC9]/60 text-center">
                  <p className="text-[11px] text-[#123F2A]/60 font-medium tracking-wider">
                    {config.copyrightText || '© 2026 HAKKIVEDA'}
                  </p>
                </div>
              </div>

              {/* 5. SIMULATED MOBILE BOTTOM NAVIGATION (If Enabled) */}
              {config.bottomNavEnabled ? (
                <div className="border-t border-[#D4AF37]/30 bg-[#062419] text-[#F3EFE6] px-2 py-2 flex items-center justify-around text-[10px] font-sans font-medium shrink-0 shadow-lg">
                  <div className="flex flex-col items-center gap-0.5 text-[#D4AF37]">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-300">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-[#D4AF37]">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Quiz</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-300">
                    <Heart className="w-4 h-4" />
                    <span>Saved</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-300 relative">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-300">
                    <Layers className="w-4 h-4" />
                    <span>Menu</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#062419]/90 border-t border-white/10 px-3 py-1.5 text-center text-[10px] text-amber-300/80 font-mono">
                  Bottom Nav: Disabled • Sticky Header Active
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
