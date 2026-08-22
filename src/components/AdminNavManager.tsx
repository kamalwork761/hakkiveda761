import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Leaf,
  Shield,
  Flame,
  Briefcase,
  MessageSquare,
  Tag,
  Heart,
  Globe,
  User,
  HelpCircle,
  Star,
  Phone,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Layout,
  BarChart2,
  Layers,
  Settings,
  Zap,
  Clock,
  Grid,
  Image as ImageIcon,
  ShoppingBag,
  Calendar,
  Lock,
  RefreshCw,
  FolderTree,
  Upload,
  Play,
  FileText,
  Move,
  ArrowRight,
  Video,
  Link as LinkIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NavLink, MegaMenuColumn, HeaderLayoutSettings, GalleryImageItem, TribalHeritagePageContent } from '../types/store';
import { HakkivedaWordmark } from './HakkivedaWordmark';

interface AdminNavManagerProps {
  showToast: (msg: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Leaf,
  Shield,
  Flame,
  Briefcase,
  MessageSquare,
  Tag,
  Heart,
  Globe,
  User,
  HelpCircle,
  Star,
  Phone,
  ExternalLink,
  ShoppingBag,
};

const AVAILABLE_COUNTRIES = [
  { code: 'IN', name: 'India (INR)' },
  { code: 'US', name: 'United States (USD)' },
  { code: 'AE', name: 'United Arab Emirates (AED)' },
  { code: 'GB', name: 'United Kingdom (GBP)' },
  { code: 'CA', name: 'Canada (CAD)' },
  { code: 'AU', name: 'Australia (AUD)' },
  { code: 'SG', name: 'Singapore (SGD)' },
];

export const AdminNavManager: React.FC<AdminNavManagerProps> = ({ showToast }) => {
  const store = useStore();
  const navLinks = Array.isArray(store?.navLinks) ? store.navLinks : [];
  const addNavLink = store?.addNavLink || (() => {});
  const updateNavLink = store?.updateNavLink || (() => {});
  const deleteNavLink = store?.deleteNavLink || (() => {});
  const reorderNavLinks = store?.reorderNavLinks || (() => {});
  const duplicateNavLink = store?.duplicateNavLink || (() => {});
  const resetNavAnalytics = store?.resetNavAnalytics || (() => {});
  const trackNavClick = store?.trackNavClick || (() => {});

  const headerSettings = store?.headerLayoutSettings || {
    showLogo: true,
    showSearch: true,
    showCountrySelector: true,
    showWishlist: true,
    showAccount: true,
    showCart: true,
    showMenu: true,
    hoverStyle: 'gold_line',
    headerLayout: 'standard',
  };
  const updateHeaderLayoutSettings = store?.updateHeaderLayoutSettings || (() => {});

  const products = Array.isArray(store?.products) ? store.products : [];
  const categories = Array.isArray(store?.categories) ? store.categories : [];
  const blogs = Array.isArray(store?.blogs) ? store.blogs : [];

  // Tabs inside Manager
  const [activeTab, setActiveTab] = useState<'items' | 'layout' | 'preview' | 'analytics'>('items');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterBadge, setFilterBadge] = useState<string>('ALL');
  const [filterLinkType, setFilterLinkType] = useState<string>('ALL');

  // Drawer / Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavLink | null>(null);

  // Form Fields
  const [formLabel, setFormLabel] = useState('');
  const [formLinkType, setFormLinkType] = useState<NavLink['linkType']>('HOMEPAGE');
  const [formUrl, setFormUrl] = useState('');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formOpenInNewTab, setFormOpenInNewTab] = useState(false);
  const [formIsModal, setFormIsModal] = useState(false);
  const [formModalType, setFormModalType] = useState<'QUIZ' | 'B2B' | 'WISHLIST'>('QUIZ');
  const [formVisible, setFormVisible] = useState(true);
  const [formIcon, setFormIcon] = useState('Leaf');
  const [formBadge, setFormBadge] = useState<NavLink['badge']>('NONE');
  const [formBadgeCustomText, setFormBadgeCustomText] = useState('');

  // Visibility Controls
  const [formShowOnDesktop, setFormShowOnDesktop] = useState(true);
  const [formShowOnTablet, setFormShowOnTablet] = useState(true);
  const [formShowOnMobile, setFormShowOnMobile] = useState(true);
  const [formUserVisibility, setFormUserVisibility] = useState<NavLink['userVisibility']>('EVERYONE');
  const [formAllowedCountries, setFormAllowedCountries] = useState<string[]>([]);

  // Schedule
  const [formStatus, setFormStatus] = useState<NavLink['status']>('ACTIVE');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');

  // Mega Menu State
  const [megaEnabled, setMegaEnabled] = useState(false);
  const [megaFeaturedImage, setMegaFeaturedImage] = useState('');
  const [megaFeaturedTitle, setMegaFeaturedTitle] = useState('');
  const [megaFeaturedSubtitle, setMegaFeaturedSubtitle] = useState('');
  const [megaFeaturedLink, setMegaFeaturedLink] = useState('#products');
  const [megaFeaturedProductId, setMegaFeaturedProductId] = useState('');
  const [megaColumns, setMegaColumns] = useState<MegaMenuColumn[]>([]);

  // Page Content Manager State
  const [contentDesktopHero, setContentDesktopHero] = useState('/images/hero_tribal_elders.jpg');
  const [contentDesktopHeroFilename, setContentDesktopHeroFilename] = useState('hero_tribal_elders.jpg');
  const [contentMobileHero, setContentMobileHero] = useState('/images/hero_tribal_elders.jpg');
  const [contentMobileHeroFilename, setContentMobileHeroFilename] = useState('hero_tribal_elders.jpg');

  const [contentMainHeading, setContentMainHeading] = useState('Where Ancient Tribal Wisdom Meets Modern Hair Science');
  const [contentSmallHeading, setContentSmallHeading] = useState('The Genesis of HAKKIVEDA');

  const [contentParagraphs, setContentParagraphs] = useState<string[]>([
    'For centuries, the nomadic Hakki-Pikki tribe traversed the dense forest corridors of the Western Ghats in Karnataka, India. Unbounded by modern industrial cosmetics, they relied on a secret repertoire of 42 wild mountain herbs, tree barks, seeds, and flower juices to keep their hair thick, dark, and resilient well into old age.',
    'At HAKKIVEDA, we preserve this authentic living heritage. We work directly with tribal harvesters in Hunsur to sustainably gather rare botanicals at sunrise when nutrient concentration is highest.',
  ]);

  const [contentLists, setContentLists] = useState<string[]>([
    '42 Wild Herbs: Including Abrus precatorius, Jatamansi, and Bhringraj harvested in untouched forests.',
    '21-Day Woodfire Brew: Slow-cooked in pure copper cauldrons over woodfire for optimal phytonutrient retention.',
    'Tribal Empowerment: Fair-trade compensation directly supporting Hakki-Pikki artisan families in Mysore.',
    'Worldwide Shipping: Exported directly to India, Singapore, Malaysia, Fiji, Mauritius, and Global markets.',
  ]);

  const [contentQuotes, setContentQuotes] = useState<string[]>([
    'Every drop is small-batch brewed by Hakki-Pikki tribal elders in Mysore using 42 wild herbs.',
  ]);

  const [contentHighlightText, setContentHighlightText] = useState('Ancestral Mysore Heritage • Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka');

  const [contentGallery, setContentGallery] = useState<GalleryImageItem[]>([
    {
      id: 'gal-1',
      url: '/images/hakkiveda_oil_couple_herbs.jpg',
      filename: 'hakkiveda_oil_couple_herbs.jpg',
      title: 'Tribal Elders & Herb Gathering',
      altText: 'Hakki-Pikki tribal elders with wild forest botanicals',
      sortOrder: 1,
    },
    {
      id: 'gal-2',
      url: '/images/hakkiveda_108_herbs_infographic.jpg',
      filename: 'hakkiveda_108_herbs_infographic.jpg',
      title: '42 Wild Mountain Botanicals',
      altText: 'Botanical infographic of sacred mountain herbs',
      sortOrder: 2,
    },
    {
      id: 'gal-3',
      url: '/images/hakkiveda_108_oil_gold.jpg',
      filename: 'hakkiveda_108_oil_gold.jpg',
      title: 'Traditional Copper Cauldron Extraction',
      altText: 'Pure golden herbal hair oil bottle handcrafted in Mysore',
      sortOrder: 3,
    },
  ]);

  const [contentVideoMp4, setContentVideoMp4] = useState('');
  const [contentVideoYoutube, setContentVideoYoutube] = useState('');

  const [contentCtaText, setContentCtaText] = useState('Explore 42-Herb Formulations');
  const [contentCtaLink, setContentCtaLink] = useState('#products');

  const [contentSeoAltText, setContentSeoAltText] = useState('Hakki-Pikki Forest Canopy and Tribal Elders in Mysore');
  const [contentSeoImageTitle, setContentSeoImageTitle] = useState('Ancestral Hakki-Pikki Herbal Hair Oil Brewing Tradition');

  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number | null>(null);

  // Active Tab inside Edit Modal
  const [modalTab, setModalTab] = useState<'basic' | 'visibility' | 'megamenu' | 'pagecontent'>('basic');

  // Preview Mode State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewHoveredNavId, setPreviewHoveredNavId] = useState<string | null>(null);

  // File Upload Handlers
  const handleDesktopHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setContentDesktopHero(data.url);
          setContentDesktopHeroFilename(file.name);
          showToast(`Desktop Hero uploaded: ${file.name}`);
          return;
        }
      }
    } catch (err) {
      console.warn('[AdminNavManager] Server upload failed, falling back to FileReader:', err);
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setContentDesktopHero(evt.target.result as string);
        setContentDesktopHeroFilename(file.name);
        showToast(`Desktop Hero uploaded: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMobileHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setContentMobileHero(data.url);
          setContentMobileHeroFilename(file.name);
          showToast(`Mobile Hero uploaded: ${file.name}`);
          return;
        }
      }
    } catch (err) {
      console.warn('[AdminNavManager] Server upload failed, falling back to FileReader:', err);
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setContentMobileHero(evt.target.result as string);
        setContentMobileHeroFilename(file.name);
        showToast(`Mobile Hero uploaded: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          const newItem: GalleryImageItem = {
            id: `gal-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
            url: evt.target.result as string,
            filename: file.name,
            title: file.name.replace(/\.[^/.]+$/, ''),
            altText: file.name,
            sortOrder: contentGallery.length + index + 1,
          };
          setContentGallery((prev) => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`Added ${files.length} gallery image(s)`);
  };

  const handleVideoMp4Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setContentVideoMp4(evt.target.result as string);
        showToast(`Uploaded video MP4: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Edit Form
  const openEditModal = (item?: NavLink) => {
    if (item) {
      setEditingItem(item);
      setFormLabel(item.label || '');
      setFormLinkType(item.linkType || 'HOMEPAGE');
      setFormUrl(item.url || '');
      setFormParentId(item.parentId || '');
      setFormOpenInNewTab(Boolean(item.openInNewTab));
      setFormIsModal(Boolean(item.isModal));
      setFormModalType(item.modalType || 'QUIZ');
      setFormVisible(item.visible ?? true);
      setFormIcon(item.icon || 'Leaf');
      setFormBadge(item.badge || 'NONE');
      setFormBadgeCustomText(item.badgeCustomText || '');
      setFormShowOnDesktop(item.showOnDesktop ?? true);
      setFormShowOnTablet(item.showOnTablet ?? true);
      setFormShowOnMobile(item.showOnMobile ?? true);
      setFormUserVisibility(item.userVisibility || 'EVERYONE');
      setFormAllowedCountries(item.allowedCountries || []);
      setFormStatus(item.status || 'ACTIVE');
      setFormStartDate(item.startDate || '');
      setFormEndDate(item.endDate || '');

      const mega = item.megaMenu;
      setMegaEnabled(Boolean(mega?.enabled));
      setMegaFeaturedImage(mega?.featuredImageUrl || '');
      setMegaFeaturedTitle(mega?.featuredImageTitle || '');
      setMegaFeaturedSubtitle(mega?.featuredImageSubtitle || '');
      setMegaFeaturedLink(mega?.featuredImageLink || '#products');
      setMegaFeaturedProductId(mega?.featuredProductId || '');
      setMegaColumns(mega?.columns ? JSON.parse(JSON.stringify(mega.columns)) : []);

      const content = item.pageContent;
      setContentDesktopHero(content?.desktopHeroImage || '/images/hero_tribal_elders.jpg');
      setContentDesktopHeroFilename(content?.desktopHeroFilename || 'hero_tribal_elders.jpg');
      setContentMobileHero(content?.mobileHeroImage || '/images/hero_tribal_elders.jpg');
      setContentMobileHeroFilename(content?.mobileHeroFilename || 'hero_tribal_elders.jpg');
      setContentMainHeading(content?.mainHeading || 'Where Ancient Tribal Wisdom Meets Modern Hair Science');
      setContentSmallHeading(content?.smallHeading || 'The Genesis of HAKKIVEDA');
      setContentParagraphs(content?.richText?.paragraphs || [
        'For centuries, the nomadic Hakki-Pikki tribe traversed the dense forest corridors of the Western Ghats in Karnataka, India. Unbounded by modern industrial cosmetics, they relied on a secret repertoire of 42 wild mountain herbs, tree barks, seeds, and flower juices to keep their hair thick, dark, and resilient well into old age.',
        'At HAKKIVEDA, we preserve this authentic living heritage. We work directly with tribal harvesters in Hunsur to sustainably gather rare botanicals at sunrise when nutrient concentration is highest.',
      ]);
      setContentLists(content?.richText?.lists || [
        '42 Wild Herbs: Including Abrus precatorius, Jatamansi, and Bhringraj harvested in untouched forests.',
        '21-Day Woodfire Brew: Slow-cooked in pure copper cauldrons over woodfire for optimal phytonutrient retention.',
        'Tribal Empowerment: Fair-trade compensation directly supporting Hakki-Pikki artisan families in Mysore.',
        'Worldwide Shipping: Exported directly to India, Singapore, Malaysia, Fiji, Mauritius, and Global markets.',
      ]);
      setContentQuotes(content?.richText?.quotes || [
        'Every drop is small-batch brewed by Hakki-Pikki tribal elders in Mysore using 42 wild herbs.',
      ]);
      setContentHighlightText(content?.richText?.highlightText || 'Ancestral Mysore Heritage • Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka');
      setContentGallery(content?.gallery || [
        {
          id: 'gal-1',
          url: '/images/hakkiveda_oil_couple_herbs.jpg',
          filename: 'hakkiveda_oil_couple_herbs.jpg',
          title: 'Tribal Elders & Herb Gathering',
          altText: 'Hakki-Pikki tribal elders with wild forest botanicals',
          sortOrder: 1,
        },
        {
          id: 'gal-2',
          url: '/images/hakkiveda_108_herbs_infographic.jpg',
          filename: 'hakkiveda_108_herbs_infographic.jpg',
          title: '42 Wild Mountain Botanicals',
          altText: 'Botanical infographic of sacred mountain herbs',
          sortOrder: 2,
        },
        {
          id: 'gal-3',
          url: '/images/hakkiveda_108_oil_gold.jpg',
          filename: 'hakkiveda_108_oil_gold.jpg',
          title: 'Traditional Copper Cauldron Extraction',
          altText: 'Pure golden herbal hair oil bottle handcrafted in Mysore',
          sortOrder: 3,
        },
      ]);
      setContentVideoMp4(content?.videoMp4Url || '');
      setContentVideoYoutube(content?.videoYoutubeUrl || '');
      setContentCtaText(content?.ctaText || 'Explore 42-Herb Formulations');
      setContentCtaLink(content?.ctaLink || '#products');
      setContentSeoAltText(content?.seoAltText || 'Hakki-Pikki Forest Canopy and Tribal Elders in Mysore');
      setContentSeoImageTitle(content?.seoImageTitle || 'Ancestral Hakki-Pikki Herbal Hair Oil Brewing Tradition');

      if (item.label.toLowerCase().includes('heritage') || item.url === '#brand-story' || item.id === 'nav-2') {
        setModalTab('pagecontent');
      } else {
        setModalTab('basic');
      }
    } else {
      setEditingItem(null);
      setFormLabel('');
      setFormLinkType('HOMEPAGE');
      setFormUrl('#');
      setFormParentId('');
      setFormOpenInNewTab(false);
      setFormIsModal(false);
      setFormModalType('QUIZ');
      setFormVisible(true);
      setFormIcon('Leaf');
      setFormBadge('NONE');
      setFormBadgeCustomText('');
      setFormShowOnDesktop(true);
      setFormShowOnTablet(true);
      setFormShowOnMobile(true);
      setFormUserVisibility('EVERYONE');
      setFormAllowedCountries([]);
      setFormStatus('ACTIVE');
      setFormStartDate('');
      setFormEndDate('');

      setMegaEnabled(false);
      setMegaFeaturedImage('');
      setMegaFeaturedTitle('');
      setMegaFeaturedSubtitle('');
      setMegaFeaturedLink('#products');
      setMegaFeaturedProductId('');
      setMegaColumns([
        {
          id: `col-${Date.now()}-1`,
          title: 'Top Formulations',
          links: [
            { label: '42 Mountain Herbs Hair Oil', url: '#products', badge: 'HOT' },
            { label: 'Scalp Cleansing Wash', url: '#products' },
          ],
        },
      ]);
      setModalTab('basic');
    }
    setIsModalOpen(true);
  };

  // Handle Link Type change
  const handleLinkTypeChange = (type: NavLink['linkType']) => {
    setFormLinkType(type);
    if (type === 'HOMEPAGE') {
      setFormUrl('#');
      setFormIsModal(false);
    } else if (type === 'COLLECTION') {
      setFormUrl('#products');
      setFormIsModal(false);
    } else if (type === 'QUIZ') {
      setFormUrl('#ai-quiz');
      setFormIsModal(true);
      setFormModalType('QUIZ');
    } else if (type === 'B2B') {
      setFormUrl('#b2b');
      setFormIsModal(true);
      setFormModalType('B2B');
    } else if (type === 'JOURNAL') {
      setFormUrl('#blogs');
      setFormIsModal(false);
    } else if (type === 'CONTACT') {
      setFormUrl('#contact');
      setFormIsModal(false);
    } else if (type === 'PRODUCT') {
      if (products.length > 0) setFormUrl(`#product-${products[0].id}`);
      setFormIsModal(false);
    } else if (type === 'CATEGORY') {
      if (categories.length > 0) setFormUrl(`#category-${categories[0].name}`);
      setFormIsModal(false);
    }
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim()) {
      showToast('Please enter a menu label');
      return;
    }

    const pageContentPayload: TribalHeritagePageContent = {
      desktopHeroImage: contentDesktopHero,
      desktopHeroFilename: contentDesktopHeroFilename,
      mobileHeroImage: contentMobileHero,
      mobileHeroFilename: contentMobileHeroFilename,
      mainHeading: contentMainHeading,
      smallHeading: contentSmallHeading,
      richText: {
        paragraphs: contentParagraphs,
        lists: contentLists,
        quotes: contentQuotes,
        highlightText: contentHighlightText,
      },
      gallery: contentGallery,
      videoMp4Url: contentVideoMp4,
      videoYoutubeUrl: contentVideoYoutube,
      ctaText: contentCtaText,
      ctaLink: contentCtaLink,
      seoAltText: contentSeoAltText,
      seoImageTitle: contentSeoImageTitle,
    };

    const payload: Omit<NavLink, 'id'> = {
      label: formLabel.trim(),
      url: formUrl || '#',
      linkType: formLinkType,
      parentId: formParentId || null,
      openInNewTab: formOpenInNewTab,
      isModal: formIsModal,
      modalType: formModalType,
      visible: formVisible,
      icon: formIcon,
      badge: formBadge,
      badgeCustomText: formBadgeCustomText,
      showOnDesktop: formShowOnDesktop,
      showOnTablet: formShowOnTablet,
      showOnMobile: formShowOnMobile,
      userVisibility: formUserVisibility,
      allowedCountries: formAllowedCountries,
      status: formStatus,
      startDate: formStartDate,
      endDate: formEndDate,
      megaMenu: megaEnabled
        ? {
            enabled: true,
            featuredImageUrl: megaFeaturedImage,
            featuredImageTitle: megaFeaturedTitle,
            featuredImageSubtitle: megaFeaturedSubtitle,
            featuredImageLink: megaFeaturedLink,
            featuredProductId: megaFeaturedProductId,
            columns: megaColumns,
          }
        : { enabled: false, columns: [] },
      pageContent: pageContentPayload,
    };

    if (editingItem) {
      updateNavLink(editingItem.id, payload);
      showToast(`Updated menu item: "${formLabel}" and page content`);
    } else {
      addNavLink(payload);
      showToast(`Created new menu item: "${formLabel}"`);
    }
    setIsModalOpen(false);
  };

  // Move Up / Down
  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const sorted = [...navLinks].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    reorderNavLinks(sorted);
    showToast('Menu order updated');
  };

  // Filtered Nav Items
  const filteredNavItems = useMemo(() => {
    return navLinks
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .filter((item) => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchLabel = item.label.toLowerCase().includes(query);
          const matchUrl = item.url.toLowerCase().includes(query);
          if (!matchLabel && !matchUrl) return false;
        }
        if (filterStatus !== 'ALL') {
          if (filterStatus === 'ACTIVE' && item.status !== 'ACTIVE') return false;
          if (filterStatus === 'DISABLED' && item.visible !== false) return false;
          if (filterStatus === 'SCHEDULED' && item.status !== 'SCHEDULED') return false;
          if (filterStatus === 'DRAFT' && item.status !== 'DRAFT') return false;
        }
        if (filterBadge !== 'ALL') {
          if (filterBadge === 'NONE' && (item.badge || 'NONE') !== 'NONE') return false;
          if (filterBadge !== 'NONE' && item.badge !== filterBadge) return false;
        }
        if (filterLinkType !== 'ALL' && item.linkType !== filterLinkType) {
          return false;
        }
        return true;
      });
  }, [navLinks, searchQuery, filterStatus, filterBadge, filterLinkType]);

  // Root vs Child Items
  const rootNavItems = filteredNavItems.filter((i) => !i.parentId);
  const getChildren = (parentId: string) => filteredNavItems.filter((i) => i.parentId === parentId);

  // Analytics totals
  const totalImpressions = useMemo(() => navLinks.reduce((acc, curr) => acc + (curr.impressions || 0), 0), [navLinks]);
  const totalClicks = useMemo(() => navLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0), [navLinks]);
  const overallCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  // Render Badge component helper
  const renderBadgeTag = (badge?: NavLink['badge'], customText?: string) => {
    if (!badge || badge === 'NONE') return null;
    let bg = 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]';
    let text = badge;
    if (badge === 'HOT') bg = 'bg-rose-500 text-white animate-pulse';
    if (badge === 'NEW') bg = 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]';
    if (badge === 'SALE') bg = 'bg-emerald-500 text-white';
    if (badge === 'B2B') bg = 'bg-amber-500 text-slate-950 font-bold';
    if (badge === 'CUSTOM' && customText) text = customText as any;

    return (
      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm ${bg}`}>
        {text}
      </span>
    );
  };

  // Render Lucide Icon helper
  const renderIcon = (iconName?: string, className: string = 'w-3.5 h-3.5') => {
    if (!iconName) return null;
    const IconComponent = ICON_MAP[iconName];
    if (IconComponent) return <IconComponent className={className} />;
    return <Sparkles className={className} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[var(--brand-gold)]" />
            <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">
              Navigation Menu Manager
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Build multi-level menus, rich mega menus, badges, device visibility, and header layout settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal()}
            className="flex items-center gap-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#d8b25a] transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'items'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-lg'
              : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Menu Structure ({navLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'layout'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-lg'
              : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Header Layout & Styles</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-lg'
              : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Header Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-lg'
              : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Menu Analytics & CTR</span>
        </button>
      </div>

      {/* TAB 1: MENU STRUCTURE MANAGER */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-[var(--brand-primary-dark)] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search menu label or link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg pl-9 pr-3 py-1.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
              >
                <option value="ALL">Status: All</option>
                <option value="ACTIVE">Status: Active</option>
                <option value="DISABLED">Status: Disabled</option>
                <option value="SCHEDULED">Status: Scheduled</option>
                <option value="DRAFT">Status: Draft</option>
              </select>

              {/* Badge Filter */}
              <select
                value={filterBadge}
                onChange={(e) => setFilterBadge(e.target.value)}
                className="bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
              >
                <option value="ALL">Badge: All</option>
                <option value="HOT">Badge: HOT</option>
                <option value="NEW">Badge: NEW</option>
                <option value="SALE">Badge: SALE</option>
                <option value="B2B">Badge: B2B</option>
                <option value="NONE">Badge: None</option>
              </select>

              {/* Link Type Filter */}
              <select
                value={filterLinkType}
                onChange={(e) => setFilterLinkType(e.target.value)}
                className="bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
              >
                <option value="ALL">Type: All</option>
                <option value="HOMEPAGE">Type: Homepage</option>
                <option value="COLLECTION">Type: Collection</option>
                <option value="PRODUCT">Type: Product</option>
                <option value="CATEGORY">Type: Category</option>
                <option value="QUIZ">Type: AI Quiz</option>
                <option value="JOURNAL">Type: Journal</option>
                <option value="B2B">Type: B2B</option>
                <option value="EXTERNAL">Type: External URL</option>
              </select>
            </div>
          </div>

          {/* Menu Items Tree List */}
          <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-4 space-y-3 shadow-xl">
            {rootNavItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FolderTree className="w-10 h-10 mx-auto text-slate-500 opacity-50" />
                <p className="font-semibold text-sm">No navigation items match your search filter.</p>
                <p className="text-xs">Click "Add Menu Item" above to create your first navigation link.</p>
              </div>
            ) : (
              rootNavItems.map((item, index) => {
                const childItems = getChildren(item.id);
                const isEnabled = item.visible !== false;

                return (
                  <div key={item.id} className="space-y-2">
                    {/* Parent Menu Card */}
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isEnabled
                          ? 'bg-[var(--brand-primary-deep)] border-white/10 hover:border-[var(--brand-gold)]/40'
                          : 'bg-[var(--brand-primary-deeper)]/60 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMove(index, 'UP')}
                            disabled={index === 0}
                            className="p-1 rounded bg-black/30 hover:bg-[var(--brand-gold)]/20 text-slate-300 disabled:opacity-20 text-[10px]"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 'DOWN')}
                            disabled={index === rootNavItems.length - 1}
                            className="p-1 rounded bg-black/30 hover:bg-[var(--brand-gold)]/20 text-slate-300 disabled:opacity-20 text-[10px]"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Icon & Label */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
                            {renderIcon(item.icon)}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 text-sm">{item.label}</span>
                              {renderBadgeTag(item.badge, item.badgeCustomText)}
                              {item.megaMenu?.enabled && (
                                <span className="text-[9px] bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-1.5 py-0.5 rounded font-bold uppercase">
                                  Mega Menu
                                </span>
                              )}
                              {!isEnabled && (
                                <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
                                  Disabled
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono">
                              <span>{item.url}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-300 uppercase text-[10px] bg-black/30 px-1.5 py-0.5 rounded border border-white/5">
                                {item.linkType || 'LINK'}
                              </span>
                              {childItems.length > 0 && (
                                <span className="text-[var(--brand-gold)] text-[10px] font-bold">
                                  ({childItems.length} sub-links)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Quick Actions */}
                      <div className="flex items-center gap-2 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        {/* Toggle Visible */}
                        <button
                          onClick={() => {
                            updateNavLink(item.id, { visible: !isEnabled });
                            showToast(`${item.label} ${!isEnabled ? 'Enabled' : 'Disabled'}`);
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                            isEnabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                          }`}
                        >
                          {isEnabled ? 'Active' : 'Disabled'}
                        </button>

                        {/* Page Content Manager Quick Button */}
                        {(item.label.toLowerCase().includes('heritage') || item.pageContent || item.id === 'nav-2') && (
                          <button
                            type="button"
                            onClick={() => {
                              openEditModal(item);
                              setModalTab('pagecontent');
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 text-xs font-bold transition-all"
                            title="Manage Page Content (Story, Hero, Gallery, Video, SEO)"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                            <span>Page Content</span>
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-[var(--brand-primary-dark)] hover:bg-[var(--brand-gold)]/20 text-slate-200 border border-white/10 hover:border-[var(--brand-gold)]/40 transition-colors"
                          title="Edit Menu Item"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => {
                            duplicateNavLink(item.id);
                            showToast(`Duplicated ${item.label}`);
                          }}
                          className="p-1.5 rounded-lg bg-[var(--brand-primary-dark)] hover:bg-[var(--brand-gold)]/20 text-slate-200 border border-white/10 hover:border-[var(--brand-gold)]/40 transition-colors"
                          title="Duplicate Item"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-300" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete menu item "${item.label}"?`)) {
                              deleteNavLink(item.id);
                              showToast(`Deleted ${item.label}`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Child Menu Sub-Items Tree */}
                    {childItems.length > 0 && (
                      <div className="ml-8 pl-4 border-l-2 border-[var(--brand-gold)]/30 space-y-2 pt-1">
                        {childItems.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between p-2.5 bg-[var(--brand-primary-deeper)] rounded-lg border border-white/5 text-xs hover:border-white/15"
                          >
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                              <span className="font-semibold text-slate-200">{child.label}</span>
                              {renderBadgeTag(child.badge, child.badgeCustomText)}
                              <span className="text-slate-400 font-mono text-[11px] ml-2">{child.url}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(child)}
                                className="p-1 text-slate-300 hover:text-[var(--brand-gold)]"
                                title="Edit Child Item"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  deleteNavLink(child.id);
                                  showToast(`Deleted child item ${child.label}`);
                                }}
                                className="p-1 text-rose-400 hover:text-rose-300"
                                title="Delete Child Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HEADER LAYOUT & STYLES MANAGER */}
      {activeTab === 'layout' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layout className="w-5 h-5 text-[var(--brand-gold)]" />
              Header Elements & Interactive Hover Styles
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Customize which elements appear in the global website header and select interactive hover effects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Element Visibility Toggles */}
            <div className="bg-[var(--brand-primary-deep)] p-5 rounded-xl border border-white/10 space-y-4">
              <h3 className="font-bold text-slate-100 text-sm border-b border-white/10 pb-2 flex items-center justify-between">
                <span>Header Component Elements</span>
                <span className="text-[10px] text-[var(--brand-gold)]">Live Website Switcher</span>
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-2 rounded hover:bg-black/20 cursor-pointer">
                  <span className="font-medium text-slate-200">Brand Logo & Wordmark</span>
                  <input
                    type="checkbox"
                    checked={headerSettings.showLogo}
                    onChange={(e) => updateHeaderLayoutSettings({ showLogo: e.target.checked })}
                    className="w-4 h-4 accent-[var(--brand-gold)]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded hover:bg-black/20 cursor-pointer">
                  <span className="font-medium text-slate-200">Search Bar / Quick Autocomplete</span>
                  <input
                    type="checkbox"
                    checked={headerSettings.showSearch}
                    onChange={(e) => updateHeaderLayoutSettings({ showSearch: e.target.checked })}
                    className="w-4 h-4 accent-[var(--brand-gold)]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded hover:bg-black/20 cursor-pointer">
                  <span className="font-medium text-slate-200">Global Country & Currency Switcher</span>
                  <input
                    type="checkbox"
                    checked={headerSettings.showCountrySelector}
                    onChange={(e) => updateHeaderLayoutSettings({ showCountrySelector: e.target.checked })}
                    className="w-4 h-4 accent-[var(--brand-gold)]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded hover:bg-black/20 cursor-pointer">
                  <span className="font-medium text-slate-200">Wishlist Heart Button</span>
                  <input
                    type="checkbox"
                    checked={headerSettings.showWishlist}
                    onChange={(e) => updateHeaderLayoutSettings({ showWishlist: e.target.checked })}
                    className="w-4 h-4 accent-[var(--brand-gold)]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded hover:bg-black/20 cursor-pointer">
                  <span className="font-medium text-slate-200">User Account Portal Button</span>
                  <input
                    type="checkbox"
                    checked={headerSettings.showAccount}
                    onChange={(e) => updateHeaderLayoutSettings({ showAccount: e.target.checked })}
                    className="w-4 h-4 accent-[var(--brand-gold)]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded hover:bg-black/20 cursor-pointer">
                  <span className="font-medium text-slate-200">Shopping Cart Drawer Badge</span>
                  <input
                    type="checkbox"
                    checked={headerSettings.showCart}
                    onChange={(e) => updateHeaderLayoutSettings({ showCart: e.target.checked })}
                    className="w-4 h-4 accent-[var(--brand-gold)]"
                  />
                </label>
              </div>
            </div>

            {/* Hover Style & Layout Selector */}
            <div className="bg-[var(--brand-primary-deep)] p-5 rounded-xl border border-white/10 space-y-5">
              <h3 className="font-bold text-slate-100 text-sm border-b border-white/10 pb-2">
                Navigation Hover Effect & Style
              </h3>

              <div className="space-y-3">
                <label className="block text-xs text-slate-300 font-medium">Select Hover Style</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'gold_line', name: 'Gold Bottom Line', desc: 'Sleek gold bottom indicator line' },
                    { id: 'underline', name: 'Classic Underline', desc: 'Standard text underline' },
                    { id: 'glow', name: 'Gold Aura Glow', desc: 'Glowing luxury gold shadow' },
                    { id: 'none', name: 'Simple Color Change', desc: 'Text color shift only' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => updateHeaderLayoutSettings({ hoverStyle: style.id as any })}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        headerSettings.hoverStyle === style.id
                          ? 'bg-[var(--brand-primary-dark)] border-[var(--brand-gold)] text-white shadow-lg'
                          : 'bg-[var(--brand-primary-deeper)] border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <div className="font-bold text-xs text-[var(--brand-gold)]">{style.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs text-slate-300 font-medium">Header Layout Mode</label>
                <select
                  value={headerSettings.headerLayout}
                  onChange={(e) => updateHeaderLayoutSettings({ headerLayout: e.target.value as any })}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                >
                  <option value="standard">Standard (Logo Left, Links Center, Actions Right)</option>
                  <option value="centered">Centered Branding (Logo Top Center)</option>
                  <option value="compact">Compact Minimalist Header</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE HEADER PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--brand-gold)]" />
                Live Header Interactive Simulator
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Test how your navigation links, mega menus, badges, and layout render across devices.
              </p>
            </div>

            {/* Device Frame Switcher */}
            <div className="flex items-center gap-1.5 bg-[var(--brand-primary-deep)] p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  previewDevice === 'desktop' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1200px)</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  previewDevice === 'tablet' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet (768px)</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  previewDevice === 'mobile' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Interactive Frame Wrapper */}
          <div className="bg-black/60 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto min-h-[400px]">
            <div
              className={`bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                previewDevice === 'desktop'
                  ? 'w-full max-w-[1100px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              {/* Simulated Header Component */}
              <div className="bg-[var(--brand-primary-dark)]/95 border-b border-[var(--brand-gold)]/20 px-4 py-3 flex items-center justify-between relative z-30">
                {/* Logo */}
                {headerSettings.showLogo && (
                  <div className="flex items-center gap-2">
                    {store?.brandIdentity?.mainLogoLight || store?.brandIdentity?.mainLogoDark || store?.brandIdentity?.transparentLogo ? (
                      <img
                        src={store?.brandIdentity?.mainLogoLight || store?.brandIdentity?.mainLogoDark || store?.brandIdentity?.transparentLogo}
                        alt="Logo"
                        className="h-8 max-h-[36px] w-auto object-contain"
                      />
                    ) : (
                      <div className="w-7 h-7 border-2 border-[var(--brand-gold)] flex items-center justify-center rotate-45">
                        <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold)] text-[10px]">
                          {store?.brandIdentity?.brandInitials || 'HV'}
                        </span>
                      </div>
                    )}
                    <HakkivedaWordmark size="sm" theme="dark-header" />
                  </div>
                )}

                {/* Desktop Nav Links */}
                {headerSettings.showMenu && previewDevice === 'desktop' && (
                  <nav className="flex items-center gap-5 text-[11px] uppercase tracking-widest font-medium text-slate-200">
                    {rootNavItems
                      .filter((i) => i.visible !== false)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="relative py-2"
                          onMouseEnter={() => setPreviewHoveredNavId(item.id)}
                          onMouseLeave={() => setPreviewHoveredNavId(null)}
                        >
                          <a
                            href={item.url}
                            onClick={(e) => {
                              e.preventDefault();
                              trackNavClick(item.id);
                              showToast(`Clicked menu item "${item.label}"`);
                            }}
                            className={`flex items-center gap-1.5 transition-all ${
                              headerSettings.hoverStyle === 'gold_line'
                                ? 'hover:text-[var(--brand-gold)] border-b-2 border-transparent hover:border-[var(--brand-gold)]'
                                : headerSettings.hoverStyle === 'underline'
                                ? 'hover:underline hover:text-[var(--brand-gold)]'
                                : headerSettings.hoverStyle === 'glow'
                                ? 'hover:text-[var(--brand-gold)] hover:drop-shadow-[0_0_8px_rgba(200,162,74,0.8)]'
                                : 'hover:text-[var(--brand-gold)]'
                            }`}
                          >
                            {renderIcon(item.icon, 'w-3 h-3 text-[var(--brand-gold)]')}
                            <span>{item.label}</span>
                            {renderBadgeTag(item.badge, item.badgeCustomText)}
                          </a>

                          {/* Mega Menu Dropdown Preview */}
                          {item.megaMenu?.enabled && previewHoveredNavId === item.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[580px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-xl shadow-2xl p-5 text-left grid grid-cols-3 gap-4 normal-case">
                                {item.megaMenu.columns.map((col) => (
                                  <div key={col.id} className="space-y-2">
                                    <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider border-b border-white/10 pb-1">
                                      {col.title}
                                    </h4>
                                    <ul className="space-y-1.5 text-xs text-slate-200">
                                      {col.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                          <a href={link.url} className="hover:text-[var(--brand-gold)] flex items-center gap-1.5">
                                            <span>{link.label}</span>
                                            {renderBadgeTag(link.badge as any)}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}

                                {item.megaMenu.featuredImageUrl && (
                                  <div className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10 flex flex-col justify-between">
                                    <img
                                      src={item.megaMenu.featuredImageUrl}
                                      alt="Featured"
                                      className="w-full h-24 object-cover rounded-lg mb-2"
                                    />
                                    <div className="font-bold text-xs text-slate-100 line-clamp-1">
                                      {item.megaMenu.featuredImageTitle || 'Featured Herb'}
                                    </div>
                                    <p className="text-[10px] text-slate-400 line-clamp-1">
                                      {item.megaMenu.featuredImageSubtitle}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </nav>
                )}

                {/* Header Right Controls */}
                <div className="flex items-center gap-3">
                  {headerSettings.showSearch && (
                    <div className="hidden sm:block text-slate-300 text-xs bg-black/30 px-3 py-1 rounded-full border border-white/10">
                      Search...
                    </div>
                  )}
                  {headerSettings.showCart && (
                    <div className="bg-black/40 border border-[var(--brand-gold)]/40 px-2.5 py-1 rounded-full text-xs font-bold text-[var(--brand-gold)]">
                      Cart (0)
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Drawer Simulator Preview */}
              {previewDevice !== 'desktop' && (
                <div className="p-4 bg-[var(--brand-primary-deep)] space-y-3 text-xs">
                  <div className="text-[10px] font-bold uppercase text-[var(--brand-gold)] tracking-wider border-b border-white/10 pb-1">
                    Mobile / Tablet Drawer Menu
                  </div>
                  {rootNavItems
                    .filter((i) => i.visible !== false)
                    .map((item) => (
                      <div key={item.id} className="p-2 bg-[var(--brand-primary-dark)] rounded-lg border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {renderIcon(item.icon, 'w-3.5 h-3.5 text-[var(--brand-gold)]')}
                          <span className="font-bold text-slate-200">{item.label}</span>
                        </div>
                        {renderBadgeTag(item.badge, item.badgeCustomText)}
                      </div>
                    ))}
                </div>
              )}

              {/* Canvas Content Placeholder */}
              <div className="p-12 text-center text-slate-400 bg-[var(--brand-primary-deeper)]">
                <Sparkles className="w-8 h-8 text-[var(--brand-gold)] mx-auto mb-2 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-200">Hakki-Pikki Store Canvas</h3>
                <p className="text-xs text-slate-400 mt-1">Hover over menu links above to test live mega menus and click links to trigger events.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MENU ANALYTICS & CTR */}
      {activeTab === 'analytics' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[var(--brand-gold)]" />
                Navigation Engagement & Click-Through Analytics
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Monitor user engagement, top clicked menu items, and overall CTR performance.
              </p>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all navigation click and impression counts?')) {
                  resetNavAnalytics();
                  showToast('Navigation analytics reset');
                }
              }}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Analytics</span>
            </button>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
              <span className="text-slate-400 text-xs font-medium">Total Menu Impressions</span>
              <div className="text-2xl font-bold text-slate-100 mt-1">{totalImpressions.toLocaleString()}</div>
            </div>

            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
              <span className="text-slate-400 text-xs font-medium">Total Menu Clicks</span>
              <div className="text-2xl font-bold text-[var(--brand-gold)] mt-1">{totalClicks.toLocaleString()}</div>
            </div>

            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
              <span className="text-slate-400 text-xs font-medium">Average CTR Rate</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{overallCTR}%</div>
            </div>
          </div>

          {/* Performance Table */}
          <div className="bg-[var(--brand-primary-deep)] rounded-xl border border-white/10 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[var(--brand-primary-deeper)] text-[var(--brand-gold)] uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Menu Item</th>
                  <th className="p-3">Link Type</th>
                  <th className="p-3">Impressions</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">CTR %</th>
                  <th className="p-3">Engagement Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {navLinks.map((item) => {
                  const impressions = item.impressions || 1;
                  const clicks = item.clicks || 0;
                  const ctr = ((clicks / impressions) * 100).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-black/20">
                      <td className="p-3 font-bold flex items-center gap-2">
                        {renderIcon(item.icon, 'w-3.5 h-3.5 text-[var(--brand-gold)]')}
                        <span>{item.label}</span>
                      </td>
                      <td className="p-3 text-slate-400 uppercase text-[10px]">{item.linkType || 'LINK'}</td>
                      <td className="p-3 font-mono">{impressions}</td>
                      <td className="p-3 font-mono text-[var(--brand-gold)] font-bold">{clicks}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{ctr}%</td>
                      <td className="p-3 w-40">
                        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="bg-[var(--brand-gold)] h-full transition-all"
                            style={{ width: `${Math.min(Number(ctr) * 2, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MENU ITEM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-serif-luxury text-slate-100 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[var(--brand-gold)]" />
                {editingItem ? `Edit Menu Item: "${editingItem.label}"` : 'Create New Menu Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Internal Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalTab('basic')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  modalTab === 'basic' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow' : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white'
                }`}
              >
                1. Basic Info & Link
              </button>
              <button
                type="button"
                onClick={() => setModalTab('visibility')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  modalTab === 'visibility' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow' : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white'
                }`}
              >
                2. Visibility & Schedule
              </button>
              <button
                type="button"
                onClick={() => setModalTab('megamenu')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  modalTab === 'megamenu' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow' : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white'
                }`}
              >
                3. Mega Menu Builder
              </button>
              <button
                type="button"
                onClick={() => setModalTab('pagecontent')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  modalTab === 'pagecontent' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow' : 'bg-[var(--brand-primary-deep)] text-slate-300 hover:text-white border border-[var(--brand-gold)]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                <span>4. Page Content Manager</span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              {/* MODAL TAB 1: BASIC INFO */}
              {modalTab === 'basic' && (
                <div className="space-y-4">
                  {/* Label & Icon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-200 font-bold mb-1">
                        Menu Label <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Collections, B2B, AI Hair Quiz"
                        value={formLabel}
                        onChange={(e) => setFormLabel(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 font-bold mb-1">Menu Icon</label>
                      <select
                        value={formIcon}
                        onChange={(e) => setFormIcon(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                      >
                        {Object.keys(ICON_MAP).map((iconKey) => (
                          <option key={iconKey} value={iconKey}>
                            {iconKey}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Link Type & URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-200 font-bold mb-1">Link Destination Type</label>
                      <select
                        value={formLinkType}
                        onChange={(e) => handleLinkTypeChange(e.target.value as any)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                      >
                        <option value="HOMEPAGE">Homepage Anchor Section</option>
                        <option value="COLLECTION">Collections Grid (#products)</option>
                        <option value="PRODUCT">Specific Product Page</option>
                        <option value="CATEGORY">Specific Category</option>
                        <option value="QUIZ">AI Hair Diagnostic Quiz</option>
                        <option value="JOURNAL">Ayurveda Journal (#blogs)</option>
                        <option value="B2B">B2B Wholesale Portal</option>
                        <option value="CONTACT">Contact & Support</option>
                        <option value="EXTERNAL">External URL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-200 font-bold mb-1">Target URL / Hash</label>
                      <input
                        type="text"
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        placeholder="e.g. #products or https://..."
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                      />
                    </div>
                  </div>

                  {/* Parent Hierarchy */}
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Parent Menu (Multi-Level Hierarchy)</label>
                    <select
                      value={formParentId}
                      onChange={(e) => setFormParentId(e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    >
                      <option value="">Root Level (Main Header Menu)</option>
                      {navLinks
                        .filter((n) => n.id !== editingItem?.id && !n.parentId)
                        .map((n) => (
                          <option key={n.id} value={n.id}>
                            Child of: {n.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Badge & Open Tab */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-200 font-bold mb-1">Menu Badge</label>
                      <select
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value as any)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                      >
                        <option value="NONE">No Badge</option>
                        <option value="HOT">HOT (Red Pulsing)</option>
                        <option value="NEW">NEW (Gold Tag)</option>
                        <option value="SALE">SALE (Emerald Tag)</option>
                        <option value="B2B">B2B (Amber Tag)</option>
                        <option value="CUSTOM">Custom Badge Text</option>
                      </select>
                      {formBadge === 'CUSTOM' && (
                        <input
                          type="text"
                          placeholder="Custom text e.g. 50% OFF"
                          value={formBadgeCustomText}
                          onChange={(e) => setFormBadgeCustomText(e.target.value)}
                          className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded text-slate-100 mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-2 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formOpenInNewTab}
                          onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                          className="w-4 h-4 accent-[var(--brand-gold)]"
                        />
                        <span className="text-slate-200 font-semibold">Open link in new browser tab (_blank)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL TAB 2: VISIBILITY & SCHEDULE */}
              {modalTab === 'visibility' && (
                <div className="space-y-4">
                  {/* Devices */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
                    <label className="block text-slate-100 font-bold">Device Visibility</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formShowOnDesktop}
                          onChange={(e) => setFormShowOnDesktop(e.target.checked)}
                          className="w-4 h-4 accent-[var(--brand-gold)]"
                        />
                        <span className="text-slate-200">Desktop</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formShowOnTablet}
                          onChange={(e) => setFormShowOnTablet(e.target.checked)}
                          className="w-4 h-4 accent-[var(--brand-gold)]"
                        />
                        <span className="text-slate-200">Tablet</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formShowOnMobile}
                          onChange={(e) => setFormShowOnMobile(e.target.checked)}
                          className="w-4 h-4 accent-[var(--brand-gold)]"
                        />
                        <span className="text-slate-200">Mobile</span>
                      </label>
                    </div>
                  </div>

                  {/* User Access Role */}
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">User Visibility Access</label>
                    <select
                      value={formUserVisibility}
                      onChange={(e) => setFormUserVisibility(e.target.value as any)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    >
                      <option value="EVERYONE">Everyone (Public & Customers)</option>
                      <option value="GUEST">Guests / Unauthenticated Users Only</option>
                      <option value="CUSTOMER">Logged-in Customers Only</option>
                      <option value="ADMIN">Store Administrators Only</option>
                    </select>
                  </div>

                  {/* Country Rules */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
                    <label className="block text-slate-100 font-bold">Country / Regional Visibility Rules</label>
                    <p className="text-[11px] text-slate-400">
                      Uncheck all to make this link available worldwide. Check specific countries to restrict.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {AVAILABLE_COUNTRIES.map((country) => {
                        const isChecked = formAllowedCountries.includes(country.code);
                        return (
                          <label key={country.code} className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormAllowedCountries([...formAllowedCountries, country.code]);
                                } else {
                                  setFormAllowedCountries(formAllowedCountries.filter((c) => c !== country.code));
                                }
                              }}
                              className="w-3.5 h-3.5 accent-[var(--brand-gold)]"
                            />
                            <span>{country.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Publish Schedule */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-200 font-bold mb-1">Publish Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SCHEDULED">Scheduled Timer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-200 font-bold mb-1">Publish Start Date</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 font-bold mb-1">Expiry End Date</label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL TAB 3: MEGA MENU BUILDER */}
              {modalTab === 'megamenu' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--brand-primary-deep)] rounded-xl border border-white/10">
                    <div>
                      <span className="font-bold text-slate-100 text-sm">Enable Rich Mega Menu Dropdown</span>
                      <p className="text-[11px] text-slate-400">
                        Displays multi-column category links, badges, and featured promotional banners on hover.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={megaEnabled}
                      onChange={(e) => setMegaEnabled(e.target.checked)}
                      className="w-5 h-5 accent-[var(--brand-gold)]"
                    />
                  </div>

                  {megaEnabled && (
                    <div className="space-y-4 bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
                      {/* Featured Banner */}
                      <h4 className="font-bold text-[var(--brand-gold)] text-xs uppercase tracking-wider border-b border-white/10 pb-1">
                        Featured Side Banner / Highlighted Formulation
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-200 font-medium mb-1">Featured Image URL</label>
                          <input
                            type="text"
                            value={megaFeaturedImage}
                            onChange={(e) => setMegaFeaturedImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-200 font-medium mb-1">Featured Title</label>
                          <input
                            type="text"
                            value={megaFeaturedTitle}
                            onChange={(e) => setMegaFeaturedTitle(e.target.value)}
                            placeholder="Royal Hakki-Pikki Hair Oil"
                            className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded text-slate-100"
                          />
                        </div>
                      </div>

                      {/* Mega Columns */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                          <h4 className="font-bold text-[var(--brand-gold)] text-xs uppercase tracking-wider">
                            Mega Menu Content Columns ({megaColumns.length})
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              setMegaColumns([
                                ...megaColumns,
                                {
                                  id: `col-${Date.now()}`,
                                  title: 'New Column',
                                  links: [{ label: 'New Link', url: '#products' }],
                                },
                              ])
                            }
                            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-2.5 py-1 rounded font-bold text-[11px]"
                          >
                            + Add Column
                          </button>
                        </div>

                        <div className="space-y-3">
                          {megaColumns.map((col, colIdx) => (
                            <div key={col.id} className="bg-[var(--brand-primary-dark)] p-3 rounded-lg border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  value={col.title}
                                  onChange={(e) => {
                                    const next = [...megaColumns];
                                    next[colIdx].title = e.target.value;
                                    setMegaColumns(next);
                                  }}
                                  className="bg-[var(--brand-primary-deep)] border border-white/20 p-1.5 rounded text-xs text-slate-100 font-bold"
                                />
                                <button
                                  type="button"
                                  onClick={() => setMegaColumns(megaColumns.filter((_, idx) => idx !== colIdx))}
                                  className="text-rose-400 hover:text-rose-300 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Links list in column */}
                              <div className="space-y-1.5 pt-1">
                                {col.links.map((link, linkIdx) => (
                                  <div key={linkIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Link label"
                                      value={link.label}
                                      onChange={(e) => {
                                        const next = [...megaColumns];
                                        next[colIdx].links[linkIdx].label = e.target.value;
                                        setMegaColumns(next);
                                      }}
                                      className="w-1/3 bg-[var(--brand-primary-deep)] border border-white/15 p-1 rounded text-[11px] text-slate-100"
                                    />
                                    <input
                                      type="text"
                                      placeholder="URL e.g. #products"
                                      value={link.url}
                                      onChange={(e) => {
                                        const next = [...megaColumns];
                                        next[colIdx].links[linkIdx].url = e.target.value;
                                        setMegaColumns(next);
                                      }}
                                      className="w-1/3 bg-[var(--brand-primary-deep)] border border-white/15 p-1 rounded text-[11px] text-slate-100"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = [...megaColumns];
                                        next[colIdx].links.splice(linkIdx, 1);
                                        setMegaColumns(next);
                                      }}
                                      className="text-rose-400 p-1"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...megaColumns];
                                    next[colIdx].links.push({ label: 'New Link', url: '#products' });
                                    setMegaColumns(next);
                                  }}
                                  className="text-[10px] text-[var(--brand-gold)] font-bold hover:underline"
                                >
                                  + Add Link
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODAL TAB 4: PAGE CONTENT MANAGER */}
              {modalTab === 'pagecontent' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-[var(--brand-gold)]/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[var(--brand-gold)]" />
                      <h4 className="text-sm font-bold text-slate-100 font-serif-luxury">
                        Page Content Manager — Tribal Heritage Section
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Manage live media, story narrative, rich text paragraphs, gallery images, video, CTA, and SEO for the website's Tribal Heritage section. Changes update live on save.
                    </p>
                  </div>

                  {/* 1. HERO IMAGE SECTION */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-4">
                    <h5 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[var(--brand-gold)]" />
                      1. Hero Image Settings (Desktop & Mobile)
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Desktop Hero Image */}
                      <div className="bg-[var(--brand-primary-dark)] p-3.5 rounded-xl border border-white/10 space-y-2">
                        <label className="block text-slate-200 font-bold text-xs">
                          Desktop Hero Image
                        </label>
                        {contentDesktopHero ? (
                          <div className="space-y-2">
                            <div className="relative rounded-lg overflow-hidden border border-white/15 h-36 bg-black/40 group">
                              <img
                                src={contentDesktopHero}
                                alt="Desktop Hero Preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <label className="cursor-pointer bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-[#d8b25a]">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Replace</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDesktopHeroUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContentDesktopHero('');
                                    setContentDesktopHeroFilename('');
                                    showToast('Deleted Desktop Hero image');
                                  }}
                                  className="bg-rose-500 text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              File: <span className="text-slate-200">{contentDesktopHeroFilename || 'Desktop Hero'}</span>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-[var(--brand-gold)]/60 rounded-xl h-36 cursor-pointer bg-black/20 hover:bg-black/40 transition-all p-4 text-center">
                            <Upload className="w-6 h-6 text-[var(--brand-gold)] mb-1" />
                            <span className="text-xs font-bold text-slate-200">Upload Desktop Hero</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP (Preserves original quality)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleDesktopHeroUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Mobile Hero Image */}
                      <div className="bg-[var(--brand-primary-dark)] p-3.5 rounded-xl border border-white/10 space-y-2">
                        <label className="block text-slate-200 font-bold text-xs">
                          Mobile Hero Image
                        </label>
                        {contentMobileHero ? (
                          <div className="space-y-2">
                            <div className="relative rounded-lg overflow-hidden border border-white/15 h-36 bg-black/40 group">
                              <img
                                src={contentMobileHero}
                                alt="Mobile Hero Preview"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <label className="cursor-pointer bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-[#d8b25a]">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Replace</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMobileHeroUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContentMobileHero('');
                                    setContentMobileHeroFilename('');
                                    showToast('Deleted Mobile Hero image');
                                  }}
                                  className="bg-rose-500 text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              File: <span className="text-slate-200">{contentMobileHeroFilename || 'Mobile Hero'}</span>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-[var(--brand-gold)]/60 rounded-xl h-36 cursor-pointer bg-black/20 hover:bg-black/40 transition-all p-4 text-center">
                            <Smartphone className="w-6 h-6 text-[var(--brand-gold)] mb-1" />
                            <span className="text-xs font-bold text-slate-200">Upload Mobile Hero</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Optimized for vertical smartphone viewports</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMobileHeroUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. STORY CONTENT & RICH TEXT EDITOR */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-4">
                    <h5 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--brand-gold)]" />
                      2. Story Content & Rich Text Editor
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-200 font-bold mb-1">Small Sub-Heading / Eyebrow</label>
                        <input
                          type="text"
                          value={contentSmallHeading}
                          onChange={(e) => setContentSmallHeading(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-2 text-slate-100 font-mono focus:border-[var(--brand-gold)]"
                          placeholder="e.g. The Genesis of HAKKIVEDA"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-200 font-bold mb-1">Main Narrative Title</label>
                        <input
                          type="text"
                          value={contentMainHeading}
                          onChange={(e) => setContentMainHeading(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-2 text-slate-100 font-bold focus:border-[var(--brand-gold)]"
                          placeholder="e.g. Where Ancient Tribal Wisdom Meets Modern Hair Science"
                        />
                      </div>
                    </div>

                    {/* Paragraphs Editor */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-200 font-bold text-xs">
                          Story Paragraphs ({contentParagraphs.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => setContentParagraphs([...contentParagraphs, 'New story paragraph detailing the Hakki-Pikki lore...'])}
                          className="text-[11px] bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] px-2.5 py-1 rounded font-bold transition-all"
                        >
                          + Add Paragraph
                        </button>
                      </div>
                      {contentParagraphs.map((para, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[10px] text-slate-400 font-mono mt-2">P{idx + 1}</span>
                          <textarea
                            rows={2}
                            value={para}
                            onChange={(e) => {
                              const next = [...contentParagraphs];
                              next[idx] = e.target.value;
                              setContentParagraphs(next);
                            }}
                            className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg p-2.5 text-slate-100 text-xs focus:border-[var(--brand-gold)]"
                          />
                          <button
                            type="button"
                            onClick={() => setContentParagraphs(contentParagraphs.filter((_, i) => i !== idx))}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded mt-1"
                            title="Delete Paragraph"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Key Features Bullet List Editor */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-200 font-bold text-xs">
                          Botanical & Heritage Bullet Points ({contentLists.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => setContentLists([...contentLists, 'New botanical feature highlight...'])}
                          className="text-[11px] bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] px-2.5 py-1 rounded font-bold transition-all"
                        >
                          + Add Bullet Point
                        </button>
                      </div>
                      {contentLists.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[var(--brand-gold)] text-xs font-bold">•</span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const next = [...contentLists];
                              next[idx] = e.target.value;
                              setContentLists(next);
                            }}
                            className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:border-[var(--brand-gold)]"
                          />
                          <button
                            type="button"
                            onClick={() => setContentLists(contentLists.filter((_, i) => i !== idx))}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                            title="Delete Bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Tribal Quotes & Lore Block */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-200 font-bold text-xs">
                          Elder Quotes & Tribal Quotes ({contentQuotes.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => setContentQuotes([...contentQuotes, 'Wisdom quote from Hakki-Pikki tribal elders...'])}
                          className="text-[11px] bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] px-2.5 py-1 rounded font-bold transition-all"
                        >
                          + Add Lore Quote
                        </button>
                      </div>
                      {contentQuotes.map((quote, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[var(--brand-gold)] text-lg font-serif">“</span>
                          <input
                            type="text"
                            value={quote}
                            onChange={(e) => {
                              const next = [...contentQuotes];
                              next[idx] = e.target.value;
                              setContentQuotes(next);
                            }}
                            className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-1.5 text-slate-100 italic text-xs focus:border-[var(--brand-gold)]"
                          />
                          <button
                            type="button"
                            onClick={() => setContentQuotes(contentQuotes.filter((_, i) => i !== idx))}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                            title="Delete Quote"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Highlight Text Banner */}
                    <div>
                      <label className="block text-slate-200 font-bold mb-1">
                        Highlight Footer Text Banner
                      </label>
                      <input
                        type="text"
                        value={contentHighlightText}
                        onChange={(e) => setContentHighlightText(e.target.value)}
                        className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-2 text-slate-100 focus:border-[var(--brand-gold)]"
                        placeholder="e.g. Ancestral Mysore Heritage • Door No. 574, Hunsur, Mysore"
                      />
                    </div>
                  </div>

                  {/* 3. GALLERY SECTION (MULTIPLE UPLOAD & DRAG/DROP ORDERING) */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                          <Grid className="w-4 h-4 text-[var(--brand-gold)]" />
                          3. Story Gallery Images ({contentGallery.length})
                        </h5>
                        <p className="text-[11px] text-slate-300">
                          Upload multiple photos, drag & drop cards or use arrow buttons to reorder gallery tiles on the website.
                        </p>
                      </div>

                      <label className="cursor-pointer bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-[#d8b25a] flex items-center gap-1.5 shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {contentGallery.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 bg-[var(--brand-primary-dark)] rounded-xl border border-dashed border-white/10">
                        <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-1 opacity-40" />
                        <p className="text-xs font-bold">No gallery images uploaded yet.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Click "Upload Images" above to add forest photos or brewing stills.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {contentGallery.map((imgItem, idx) => (
                          <div
                            key={imgItem.id}
                            draggable
                            onDragStart={() => setDraggedGalleryIdx(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (draggedGalleryIdx !== null && draggedGalleryIdx !== idx) {
                                const next = [...contentGallery];
                                const [moved] = next.splice(draggedGalleryIdx, 1);
                                next.splice(idx, 0, moved);
                                setContentGallery(next);
                                setDraggedGalleryIdx(null);
                                showToast('Reordered gallery photo');
                              }
                            }}
                            className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10 space-y-2 relative group hover:border-[var(--brand-gold)]/40 transition-all cursor-move"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <Move className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                                <span className="font-bold text-[11px]">Photo #{idx + 1}</span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const next = [...contentGallery];
                                    const temp = next[idx - 1];
                                    next[idx - 1] = next[idx];
                                    next[idx] = temp;
                                    setContentGallery(next);
                                  }}
                                  className="p-1 rounded bg-black/40 hover:bg-[var(--brand-gold)]/20 text-slate-200 disabled:opacity-20"
                                  title="Move Left/Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === contentGallery.length - 1}
                                  onClick={() => {
                                    const next = [...contentGallery];
                                    const temp = next[idx + 1];
                                    next[idx + 1] = next[idx];
                                    next[idx] = temp;
                                    setContentGallery(next);
                                  }}
                                  className="p-1 rounded bg-black/40 hover:bg-[var(--brand-gold)]/20 text-slate-200 disabled:opacity-20"
                                  title="Move Right/Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContentGallery(contentGallery.filter((_, i) => i !== idx));
                                    showToast('Deleted photo from gallery');
                                  }}
                                  className="p-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white ml-1"
                                  title="Delete Image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-3 items-center">
                              <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40 relative">
                                <img src={imgItem.url} alt={imgItem.altText || 'Gallery'} className="w-full h-full object-cover" />
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[10px] font-bold text-[var(--brand-gold)]">
                                  Replace
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onload = (evt) => {
                                        if (evt.target?.result) {
                                          const next = [...contentGallery];
                                          next[idx].url = evt.target.result as string;
                                          next[idx].filename = file.name;
                                          setContentGallery(next);
                                          showToast(`Replaced photo ${idx + 1}`);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              <div className="space-y-1.5 flex-1 min-w-0">
                                <input
                                  type="text"
                                  placeholder="Photo Title"
                                  value={imgItem.title}
                                  onChange={(e) => {
                                    const next = [...contentGallery];
                                    next[idx].title = e.target.value;
                                    setContentGallery(next);
                                  }}
                                  className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded px-2 py-1 text-[11px] text-slate-100 font-bold"
                                />
                                <input
                                  type="text"
                                  placeholder="SEO Alt Text"
                                  value={imgItem.altText}
                                  onChange={(e) => {
                                    const next = [...contentGallery];
                                    next[idx].altText = e.target.value;
                                    setContentGallery(next);
                                  }}
                                  className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded px-2 py-1 text-[10px] text-slate-300 font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. OPTIONAL VIDEO (MP4 & YOUTUBE) */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-4">
                    <h5 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <Video className="w-4 h-4 text-[var(--brand-gold)]" />
                      4. Optional Documentary Video (MP4 Upload / YouTube Link)
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Direct MP4 Upload */}
                      <div className="space-y-2">
                        <label className="block text-slate-200 font-bold text-xs">
                          MP4 Video Upload or URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={contentVideoMp4}
                            onChange={(e) => setContentVideoMp4(e.target.value)}
                            placeholder="https://domain.com/video.mp4"
                            className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-1.5 text-slate-100 text-xs font-mono"
                          />
                          <label className="cursor-pointer bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload MP4</span>
                            <input
                              type="file"
                              accept="video/mp4,video/*"
                              onChange={handleVideoMp4Upload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* YouTube Embed URL */}
                      <div className="space-y-2">
                        <label className="block text-slate-200 font-bold text-xs">
                          YouTube Video Link
                        </label>
                        <input
                          type="text"
                          value={contentVideoYoutube}
                          onChange={(e) => setContentVideoYoutube(e.target.value)}
                          placeholder="https://youtu.be/1jzF9v5PEBY"
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-1.5 text-slate-100 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. CALL TO ACTION (CTA) */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-4">
                    <h5 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-[var(--brand-gold)]" />
                      5. Call to Action (CTA Button)
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-200 font-bold mb-1">CTA Button Text</label>
                        <input
                          type="text"
                          value={contentCtaText}
                          onChange={(e) => setContentCtaText(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-2 text-slate-100 font-bold"
                          placeholder="e.g. Explore 42-Herb Formulations"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-200 font-bold mb-1">CTA Target Link</label>
                        <input
                          type="text"
                          value={contentCtaLink}
                          onChange={(e) => setContentCtaLink(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-2 text-slate-100 font-mono"
                          placeholder="e.g. #products"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. SEO & METADATA */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-4">
                    <h5 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[var(--brand-gold)]" />
                      6. SEO & Accessibility Metadata
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-200 font-bold mb-1">Primary Hero Alt Text</label>
                        <input
                          type="text"
                          value={contentSeoAltText}
                          onChange={(e) => setContentSeoAltText(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs"
                          placeholder="e.g. Hakki-Pikki Forest Canopy and Tribal Elders in Mysore"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-200 font-bold mb-1">Image Title Tag</label>
                        <input
                          type="text"
                          value={contentSeoImageTitle}
                          onChange={(e) => setContentSeoImageTitle(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs"
                          placeholder="e.g. Ancestral Hakki-Pikki Herbal Hair Oil Brewing Tradition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. LIVE PREVIEW FRAME */}
                  <div className="bg-[var(--brand-primary-dark)] p-5 rounded-2xl border border-[var(--brand-gold)]/40 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[var(--brand-gold)]" />
                        <h5 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-widest">
                          7. Real-Time Website Story Section Preview
                        </h5>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                        Live Render
                      </span>
                    </div>

                    <div className="bg-slate-950 rounded-xl p-6 border border-white/10 text-slate-200 space-y-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)]">
                          {contentSmallHeading}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-serif-luxury text-slate-100">
                        {contentMainHeading}
                      </h3>

                      {contentDesktopHero && (
                        <div className="rounded-xl overflow-hidden border border-[var(--brand-gold)]/30 h-48 bg-black/60 relative">
                          <img src={contentDesktopHero} alt={contentSeoAltText} className="w-full h-full object-cover" />
                          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                            Desktop Hero
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                        {contentParagraphs.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      {contentLists.length > 0 && (
                        <ul className="space-y-2 text-xs">
                          {contentLists.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-200">
                              <span className="text-[var(--brand-gold)] font-bold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {contentQuotes.map((q, idx) => (
                        <blockquote key={idx} className="border-l-2 border-[var(--brand-gold)] pl-4 italic text-slate-300 text-xs py-1">
                          "{q}"
                        </blockquote>
                      ))}

                      {contentGallery.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          {contentGallery.map((g) => (
                            <div key={g.id} className="h-16 rounded-lg overflow-hidden border border-white/10">
                              <img src={g.url} alt={g.altText} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <a
                          href={contentCtaLink}
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex items-center gap-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
                        >
                          <span>{contentCtaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold shadow-lg hover:bg-[#d8b25a] transition-all"
                >
                  Save Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
