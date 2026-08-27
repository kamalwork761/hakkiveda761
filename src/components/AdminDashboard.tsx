import React, { useState, useEffect } from 'react';
import { uploadFileToServer } from '../utils/upload';
import { formatAdminINR, formatOriginalAmount } from '../utils/adminCurrency';
import { AdminProductImageManager } from './AdminProductImageManager';
import { AdminCategoryManager } from './AdminCategoryManager';
import { AdminHeroSliderManager } from './AdminHeroSliderManager';
import { AdminNavManager } from './AdminNavManager';
import { AdminReviewsManager } from './AdminReviewsManager';
import { AdminBeforeAfterManager } from './AdminBeforeAfterManager';
import { AdminVideoTestimonialsManager } from './AdminVideoTestimonialsManager';
import { AdminBlogManager } from './AdminBlogManager';
import { AdminQuizManager } from './AdminQuizManager';
import { AdminHomepageQuizManager } from './AdminHomepageQuizManager';
import { AdminBrandManager } from './AdminBrandManager';
import { AdminFooterManager } from './AdminFooterManager';
import { AdminB2BSectionManager } from './AdminB2BSectionManager';
import { AdminVideoPopupManager } from './AdminVideoPopupManager';
import { AdminShoppableReelsManager } from './AdminShoppableReelsManager';
import { AdminShiprocketManager } from './AdminShiprocketManager';
import { AdminOrderManager } from './AdminOrderManager';
import { AdminCategoryPageManager } from './AdminCategoryPageManager';
import { AdminProductManager } from './admin/AdminProductManager';
import { AdminMobileNavManager } from './AdminMobileNavManager';
import { AdminEditorialStoriesManager } from './AdminEditorialStoriesManager';
import { AdminAnnouncementManager } from './AdminAnnouncementManager';
import {
  Lock,
  LayoutDashboard,
  Package,
  Layers,
  Sliders,
  Smartphone,
  ShoppingBag,
  Building2,
  Tag,
  DollarSign,
  Settings,
  Plus,
  Box,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  Truck,
  Eye,
  Bot,
  AlertTriangle,
  XCircle,
  Megaphone,
  Globe,
  Users,
  Video,
  Film,
  FileText,
  HelpCircle,
  Image,
  Navigation,
  LogOut,
  Shield,
  Search,
  Sparkles,
  PhoneCall,
  Download,
  Save,
  Check,
  MessageSquare,
  Mail,
  X,
  CreditCard,
  MapPin,
  Key,
  Volume2,
  VolumeX,
  Trees,
  Upload,
  ShieldCheck,
  CheckCircle,
  Banknote,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderDetailsModal } from './OrderDetailsModal';
import { PaymentIcon } from './PaymentIcons';
import {
  Product,
  Category,
  HeroSlide,
  Coupon,
  BlogArticle,
  BeforeAfterItem,
  Review,
  TestimonialVideo,
  QuizQuestion,
  NavLink,
  CountrySetting,
  User,
  Order,
  PaymentGatewayConfig,
  PaymentGatewayId,
  PaymentLog,
} from '../types/store';

interface AdminDashboardProps {
  onLogoutAdmin: () => void;
  onReturnToStoreFront: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogoutAdmin, onReturnToStoreFront }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    orders,
    updateOrderStatus,
    b2bLeads,
    updateB2BLeadStatus,
    deleteB2BLead,
    coupons,
    addCoupon,
    deleteCoupon,
    currencies,
    updateCurrencyRate,
    markets,
    updateMarket,
    countries,
    updateCountrySetting,
    bulkUpdateCountries,
    siteSettings,
    updateSiteSettings,
    navLinks,
    addNavLink,
    updateNavLink,
    deleteNavLink,
    blogs,
    addBlog,
    updateBlog,
    deleteBlog,
    beforeAfterItems,
    addBeforeAfterItem,
    updateBeforeAfterItem,
    deleteBeforeAfterItem,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    testimonialVideos,
    addTestimonialVideo,
    deleteTestimonialVideo,
    quizQuestions,
    addQuizQuestion,
    deleteQuizQuestion,
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    customerAccounts,
    adminSetCustomerPassword,
    toggleBlockCustomer,
    deleteCustomerAccount,
    exportCustomerData,
    updateAdminPassword,
    formatPrice,
    resetToDefaults,
    paymentGateways,
    updatePaymentGateway,
    reorderPaymentGateways,
    testGatewayConnection,
    codRules,
    updateCodRules,
    marketGateways,
    updateMarketGateways,
    paymentLogs,
    addPaymentLog,
    refundPaymentLog,
    soundEnabled,
    soundVolume,
    soundPack,
    adminMutedSound,
    toggleSound,
    setSoundEnabled,
    setSoundVolume,
    setSoundPack,
    setAdminMutedSound,
    playSound,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'inventory'
    | 'categories'
    | 'category_pages'
    | 'announcement'
    | 'hero'
    | 'nav'
    | 'orders'
    | 'b2b'
    | 'b2b_section'
    | 'customers'
    | 'coupons'
    | 'reviews'
    | 'before_after'
    | 'videos'
    | 'blogs'
    | 'editorial_stories'
    | 'quiz'
    | 'homepage_quiz'
    | 'media'
    | 'currency'
    | 'payments'
    | 'shipping'
    | 'seo'
    | 'branding'
    | 'contact'
    | 'footer'
    | 'settings'
  >(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const search = window.location.search;
      if (
        pathname.includes('/admin/orders') ||
        search.includes('filter=') ||
        search.includes('paymentStatus=') ||
        search.includes('paymentMethod=') ||
        search.includes('market=')
      ) {
        return 'orders';
      }
      if (pathname.includes('/admin/inventory')) {
        return 'inventory';
      }
    }
    return 'overview';
  });

  // Preset Filters State for Order Manager & Inventory Tab
  const [orderPresetFilter, setOrderPresetFilter] = useState<{
    filter?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    market?: string;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter') || undefined;
      const paymentStatus = params.get('paymentStatus') || undefined;
      const paymentMethod = params.get('paymentMethod') || undefined;
      const market = params.get('market') || undefined;
      if (filter || paymentStatus || paymentMethod || market) {
        return { filter, paymentStatus, paymentMethod, market };
      }
    }
    return null;
  });

  const [inventoryFilter, setInventoryFilter] = useState<'ALL' | 'low_stock'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('filter') === 'low_stock') return 'low_stock';
    }
    return 'ALL';
  });

  const handleDashboardCardNavigate = (
    tab: 'orders' | 'inventory' | 'payments',
    params?: { filter?: string; paymentStatus?: string; paymentMethod?: string; market?: string }
  ) => {
    setActiveTab(tab as any);

    const query = new URLSearchParams();
    if (params?.filter) query.set('filter', params.filter);
    if (params?.paymentStatus) query.set('paymentStatus', params.paymentStatus);
    if (params?.paymentMethod) query.set('paymentMethod', params.paymentMethod);
    if (params?.market) query.set('market', params.market);

    const queryString = query.toString();
    const targetPath = `/admin/${tab}${queryString ? `?${queryString}` : ''}`;

    if (typeof window !== 'undefined') {
      window.history.pushState({ tab, params }, '', targetPath);
    }

    if (tab === 'orders') {
      setOrderPresetFilter(params || null);
    } else if (tab === 'inventory') {
      setInventoryFilter(params?.filter === 'low_stock' ? 'low_stock' : 'ALL');
    }
  };

  // Sync state with browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter') || undefined;
      const paymentStatus = params.get('paymentStatus') || undefined;
      const paymentMethod = params.get('paymentMethod') || undefined;
      const market = params.get('market') || undefined;

      if (pathname.includes('/admin/orders') || filter || paymentStatus || paymentMethod || market) {
        setActiveTab('orders');
        if (filter || paymentStatus || paymentMethod || market) {
          setOrderPresetFilter({ filter, paymentStatus, paymentMethod, market });
        } else {
          setOrderPresetFilter(null);
        }
      } else if (pathname.includes('/admin/inventory')) {
        setActiveTab('inventory');
        setInventoryFilter(filter === 'low_stock' ? 'low_stock' : 'ALL');
      } else {
        setActiveTab('overview');
        setOrderPresetFilter(null);
        setInventoryFilter('ALL');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Success toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Image File Upload Helper (Uploads file permanently to server /app/uploads folder)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFileToServer(file);
      callback(url);
      showToast('Image uploaded permanently to server uploads');
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
          showToast('Image loaded');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Forms states
  const [paymentSubTab, setPaymentSubTab] = useState<'GATEWAYS' | 'MARKETS' | 'COD' | 'PRIORITY' | 'LOGS'>('GATEWAYS');
  const [testingGatewayId, setTestingGatewayId] = useState<string | null>(null);
  const [draggedGatewayIdx, setDraggedGatewayIdx] = useState<number | null>(null);
  
  // Refund Modal State
  const [refundingLog, setRefundingLog] = useState<PaymentLog | null>(null);
  const [refundAmountInput, setRefundAmountInput] = useState<number>(0);
  const [refundReasonInput, setRefundReasonInput] = useState<string>('Customer requested return/refund');
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);

  // Payment Logs Filters
  const [paymentLogStatusFilter, setPaymentLogStatusFilter] = useState<string>('ALL');
  const [paymentLogSearch, setPaymentLogSearch] = useState<string>('');

  const [countrySearch, setCountrySearch] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');
  const [selectedRuleFilter, setSelectedRuleFilter] = useState<string>('ALL');
  const [countryPage, setCountryPage] = useState<number>(1);
  const COUNTRIES_PER_PAGE = 20;

  // Analytics Metrics for Dashboard Cards
  const todayDateStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayDateStr.substring(0, 7);

  const isTodayOrder = (o: Order) =>
    !!(o.date && (o.date === todayDateStr || o.date.startsWith(todayDateStr)));

  const isThisMonthOrder = (o: Order) =>
    !!(o.date && o.date.startsWith(currentMonthStr));

  const isPaidOrder = (o: Order) => {
    const pStatus = (o.paymentStatus || '').trim().toUpperCase();
    return pStatus === 'PAID' || pStatus === 'SUCCESSFUL' || pStatus === 'COMPLETED';
  };

  const isPendingOrder = (o: Order) => {
    if (isPaidOrder(o)) return false;
    const pStatus = (o.paymentStatus || '').trim().toUpperCase();
    const tStatus = (o.trackingStatus || '').trim().toUpperCase();
    return (
      pStatus === 'PENDING' ||
      pStatus === 'PENDING PAYMENT' ||
      pStatus === 'AWAITING PAYMENT' ||
      pStatus === 'COD_DUE' ||
      pStatus === 'COD PENDING' ||
      pStatus === 'PENDING FULFILLMENT' ||
      pStatus === 'AWAITING FULFILLMENT' ||
      pStatus === 'PAYMENT FAILED' ||
      pStatus === 'FAILED' ||
      tStatus === 'ORDER_PLACED' ||
      tStatus === 'PENDING FULFILLMENT' ||
      tStatus === 'AWAITING_FULFILLMENT' ||
      tStatus === 'PENDING PAYMENT'
    );
  };

  const isCodOrder = (o: Order) => (o.paymentMethod || '').trim().toUpperCase() === 'COD';

  const isInternationalOrder = (o: Order) => {
    const c = (o.customer?.country || '').trim().toLowerCase();
    const cc = (o.customer?.countryCode || o.currencyCode || '').trim().toUpperCase();
    const isDomestic = c === 'india' || c === 'in' || cc === 'IN';
    return c !== '' && !isDomestic;
  };

  const todaysOrders = orders.filter(isTodayOrder);
  const pendingOrders = orders.filter(isPendingOrder);
  const paidOrders = orders.filter(isPaidOrder);
  const codOrders = orders.filter(isCodOrder);
  const internationalOrders = orders.filter(isInternationalOrder);

  const revenueTodayOrders = orders.filter((o) => isTodayOrder(o) && (isPaidOrder(o) || isCodOrder(o)));
  const revenueToday = revenueTodayOrders.reduce((acc, o) => acc + (o.totalAmountINR || 0), 0);

  const revenueThisMonthOrders = orders.filter((o) => isThisMonthOrder(o) && (isPaidOrder(o) || isCodOrder(o)));
  const revenueThisMonth = revenueThisMonthOrders.reduce((acc, o) => acc + (o.totalAmountINR || 0), 0);

  const totalRevenueOrders = orders.filter((o) => isPaidOrder(o) || isCodOrder(o));
  const totalRevenue = totalRevenueOrders.reduce((acc, o) => acc + (o.totalAmountINR || 0), 0);

  const refundTotals = paymentLogs.filter((l) => l.status === 'REFUNDED').reduce((acc, l) => acc + (l.amountINR || 0), 0) +
    orders.filter((o) => (o.paymentStatus || '').trim().toUpperCase() === 'REFUNDED').reduce((acc, o) => acc + (o.totalAmountINR || 0), 0);

  const settlementTotals = orders.filter(isPaidOrder).reduce((acc, o) => acc + (o.totalAmountINR || 0), 0);

  const lowStockProducts = products.filter((p) => (typeof p.stock === 'number' ? p.stock : 100) < 10 || p.inStock === false);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    category: categories[0]?.name || 'Hair Oils & Elixirs',
    subtitle: '42 Mountain Herbs Formula',
    priceINR: 1999,
    originalPriceINR: 2499,
    rating: 5.0,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    additionalImages: [],
    description: 'Slow-cooked in copper cauldrons over woodfire.',
    benefits: ['Stimulates root density', 'Prevents hair fall'],
    ingredients: ['Wild Amla', 'Bhringraj', 'Shikakai', 'Cold-Pressed Sesame Oil'],
    volume: '200 ml / 6.7 fl oz',
    usageRitual: 'Massage gently onto scalp 3x weekly.',
    stock: 100,
    sku: `HV-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    isBestseller: false,
    isNew: true,
    inStock: true,
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name) return;
    addProduct(prodForm as Omit<Product, 'id'>);
    setIsAddingProduct(false);
    showToast('Product created successfully');
  };

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800');

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    addCategory({
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      description: catDesc || 'Ayurvedic formulations',
      image: catImg,
      itemCount: 0,
    });
    setCatName('');
    setCatDesc('');
    showToast('Category created');
  };

  // Coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'PERCENT' | 'FLAT'>('PERCENT');
  const [couponVal, setCouponVal] = useState(15);
  const [couponMinINR, setCouponMinINR] = useState(1500);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    addCoupon({
      code: couponCode.toUpperCase().trim(),
      discountType: couponType,
      value: couponVal,
      minOrderINR: couponMinINR,
      isActive: true,
    });
    setCouponCode('');
    showToast('Coupon added');
  };

  // Hero Slide form state
  const [slideTag, setSlideTag] = useState('ANCIENT TRIBAL SECRET');
  const [slideTitle, setSlideTitle] = useState('42 Mountain Herbs Formula');
  const [slideHighlight, setSlideHighlight] = useState('Hair Fall & Growth Elixir');
  const [slideSubtitle, setSlideSubtitle] = useState('Handcrafted by Hakki-Pikki tribe in Mysore.');
  const [slideImg, setSlideImg] = useState('https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHeroSlide({
      tag: slideTag,
      title: slideTitle,
      highlightText: slideHighlight,
      subtitle: slideSubtitle,
      image: slideImg,
      ctaText: 'Shop Elixir',
      ctaLink: '#products',
      active: true,
    });
    showToast('Hero slide created');
  };

  // Password Update State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    const res = await updateAdminPassword(oldPass, newPass);
    setPassMsg(res.message);
    if (res.success) {
      setOldPass('');
      setNewPass('');
      showToast('Master Password Updated');
    }
  };

  // Customer Search & Filter state
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');
  const [selectedCustomerDossier, setSelectedCustomerDossier] = useState<User | null>(null);

  // Admin Customer Password Assist Modal State
  const [custPasswordModalUser, setCustPasswordModalUser] = useState<User | null>(null);
  const [custManualPassword, setCustManualPassword] = useState('');
  const [custAssignedTempPass, setCustAssignedTempPass] = useState<string | null>(null);
  const [custPassLoading, setCustPassLoading] = useState(false);
  const [custPassModalMsg, setCustPassModalMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAdminSetCustomerPassword = async (generateRandom: boolean) => {
    if (!custPasswordModalUser) return;
    setCustPassLoading(true);
    setCustPassModalMsg(null);
    try {
      const res = await adminSetCustomerPassword(
        custPasswordModalUser.id,
        generateRandom ? undefined : custManualPassword.trim(),
        generateRandom
      );
      if (res.success) {
        setCustAssignedTempPass(res.temporaryPassword || (custManualPassword ? custManualPassword : 'Password established'));
        setCustPassModalMsg({
          type: 'success',
          text: res.message || 'Secure credentials established successfully.',
        });
        setCustManualPassword('');
        showToast('Customer password updated');
      } else {
        setCustPassModalMsg({ type: 'error', text: res.message || 'Failed to update customer password.' });
      }
    } finally {
      setCustPassLoading(false);
    }
  };

  const filteredCustomers = customerAccounts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearch));
    const matchesStatus =
      customerStatusFilter === 'ALL' || (c.status || 'ACTIVE') === customerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="admin-root" className="admin-root min-h-screen bg-[var(--brand-primary-deep)] text-slate-100 font-sans flex flex-col sm:flex-row">
      {/* Toast Popup */}
      {toastMsg && (
        <div className="fixed top-5 right-5 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside id="admin-sidebar" className="admin-sidebar w-full sm:w-64 bg-[var(--brand-primary-dark)] border-r border-[var(--brand-gold)]/30 p-4 shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 border-2 border-[var(--brand-gold)] flex items-center justify-center rotate-45 bg-[var(--brand-primary-deep)]">
                <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold)] text-xs">HV</span>
              </div>
              <div>
                <h2 className="text-sm font-bold font-brand tracking-widest text-[var(--brand-gold)]">HAKKIVEDA</h2>
                <p className="text-[8px] uppercase tracking-wider text-slate-300">Admin Control Suite</p>
              </div>
            </div>
            <button
              onClick={onReturnToStoreFront}
              className="text-slate-400 hover:text-[var(--brand-gold)] p-1"
              title="Return to Store Front"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links Group */}
          <div className="space-y-1 font-sans text-xs font-semibold overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[var(--brand-gold)]/70 font-bold px-3">
              Catalog & Inventory
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'inventory' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Inventory & Stock SKU</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'categories' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[var(--brand-gold)]/70 font-bold px-3">
              Website & Content
            </div>
            <button
              onClick={() => setActiveTab('category_pages')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'category_pages' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Category Pages</span>
            </button>
            <button
              onClick={() => setActiveTab('announcement')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'announcement' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Announcement Bar</span>
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'hero' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Hero Slider</span>
            </button>
            <button
              onClick={() => setActiveTab('nav')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'nav' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Navigation Menu</span>
            </button>
            <button
              onClick={() => setActiveTab('mobile_nav')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'mobile_nav' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile Navigation</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'reviews' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Reviews & Ratings</span>
            </button>
            <button
              onClick={() => setActiveTab('before_after')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'before_after' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Before & After Slider</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'videos' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>YouTube Video Guides</span>
            </button>
            <button
              onClick={() => setActiveTab('video_popup')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'video_popup' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Video Popup Modal</span>
            </button>
            <button
              onClick={() => setActiveTab('shoppable_reels')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'shoppable_reels' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Shoppable Video Reels</span>
            </button>
            <button
              onClick={() => setActiveTab('editorial_stories')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'editorial_stories' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Editorial Stories</span>
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'blogs' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Journal & Articles</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'quiz' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>AI Quiz Questions</span>
            </button>
            <button
              onClick={() => setActiveTab('homepage_quiz')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'homepage_quiz' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Homepage AI Hair Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'media' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Media Gallery</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[var(--brand-gold)]/70 font-bold px-3">
              Sales & Customers
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Fulfillment ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'b2b' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>B2B Wholesale Enquiries ({b2bLeads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('b2b_section')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'b2b_section' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>📦 B2B Section Manager</span>
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'customers' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Accounts ({customerAccounts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'coupons' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Coupons & Offers</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[var(--brand-gold)]/70 font-bold px-3">
              Store Configuration
            </div>
            <button
              onClick={() => setActiveTab('currency')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'currency' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Currencies & Countries</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'payments' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Gateways</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'shipping' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Shipping Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('shiprocket')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'shiprocket' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Shiprocket Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'seo' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>SEO & Meta Tags</span>
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'branding' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Logo & Branding</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'contact' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Info</span>
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'footer' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Footer Configuration</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Master Security & Reset</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 space-y-2 mt-4">
          <button
            onClick={onLogoutAdmin}
            className="w-full bg-rose-950/80 text-rose-300 border border-rose-500/30 p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard Area */}
      <main id="admin-main" className="admin-main flex-1 p-6 sm:p-10 overflow-y-auto bg-white dark:bg-[var(--brand-primary-deep)] text-[#123F2A] dark:text-slate-100">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-[#0B2F20] dark:text-slate-100">Store Command Dashboard</h1>
              <p className="text-xs text-[#6B756E] dark:text-slate-300">Live analytics and operational status of HAKKIVEDA.</p>
            </div>

            {/* Top Stat Cards for Requirement 7 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => handleDashboardCardNavigate('orders', { filter: 'today' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-[var(--brand-gold)]/30 p-5 rounded-2xl cursor-pointer hover:border-[var(--brand-gold)] hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-[#123F2A] dark:text-[var(--brand-gold)] font-bold">
                      Today's Orders
                    </div>
                    <ShoppingBag className="w-4 h-4 text-[#C9A84E] dark:text-[var(--brand-gold)]" />
                  </div>
                  <div className="admin-stat-value text-3xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{todaysOrders.length}</div>
                </div>
                <div className="text-[10px] text-[#C9A84E] dark:text-[var(--brand-gold)] group-hover:underline font-bold mt-3">
                  View Today's Orders →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { paymentStatus: 'pending' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-amber-500/30 p-5 rounded-2xl cursor-pointer hover:border-amber-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                      Pending Orders
                    </div>
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="admin-stat-value text-3xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{pendingOrders.length}</div>
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 group-hover:underline font-bold mt-3">
                  Awaiting Fulfillment →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { paymentStatus: 'paid' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-emerald-500/30 p-5 rounded-2xl cursor-pointer hover:border-emerald-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                      Paid Orders
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="admin-stat-value text-3xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{paidOrders.length}</div>
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 group-hover:underline font-bold mt-3">
                  Successful Payments →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { paymentMethod: 'cod' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-cyan-500/30 p-5 rounded-2xl cursor-pointer hover:border-cyan-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-cyan-700 dark:text-cyan-400 font-bold">
                      COD Orders
                    </div>
                    <Banknote className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="admin-stat-value text-3xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{codOrders.length}</div>
                </div>
                <div className="text-[10px] text-cyan-700 dark:text-cyan-400 group-hover:underline font-bold mt-3">
                  Cash on Delivery →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { market: 'international' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-indigo-500/30 p-5 rounded-2xl cursor-pointer hover:border-indigo-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-indigo-700 dark:text-indigo-400 font-bold">
                      International Orders
                    </div>
                    <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="admin-stat-value text-3xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{internationalOrders.length}</div>
                </div>
                <div className="text-[10px] text-indigo-700 dark:text-indigo-400 group-hover:underline font-bold mt-3">
                  Global Express Shipments →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { filter: 'revenue_today' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-emerald-500/30 p-5 rounded-2xl cursor-pointer hover:border-emerald-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                      Revenue Today (INR)
                    </div>
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="admin-stat-value text-2xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{formatAdminINR(revenueToday)}</div>
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 group-hover:underline font-bold mt-3">
                  Today's Sales →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { filter: 'revenue_month' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-[var(--brand-gold)]/30 p-5 rounded-2xl cursor-pointer hover:border-[var(--brand-gold)] hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-[#123F2A] dark:text-[var(--brand-gold)] font-bold">
                      Revenue This Month (INR)
                    </div>
                    <DollarSign className="w-4 h-4 text-[#C9A84E] dark:text-[var(--brand-gold)]" />
                  </div>
                  <div className="admin-stat-value text-2xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{formatAdminINR(revenueThisMonth)}</div>
                </div>
                <div className="text-[10px] text-[#C9A84E] dark:text-[var(--brand-gold)] group-hover:underline font-bold mt-3">
                  Monthly Total →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { filter: 'revenue_all' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-cyan-500/30 p-5 rounded-2xl cursor-pointer hover:border-cyan-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-cyan-700 dark:text-cyan-400 font-bold">
                      Total Revenue (INR)
                    </div>
                    <DollarSign className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="admin-stat-value text-2xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{formatAdminINR(totalRevenue)}</div>
                </div>
                <div className="text-[10px] text-cyan-700 dark:text-cyan-400 group-hover:underline font-bold mt-3">
                  All Time Gross →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { paymentStatus: 'refunded' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-purple-500/30 p-5 rounded-2xl cursor-pointer hover:border-purple-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-purple-700 dark:text-purple-400 font-bold">
                      Refund Totals (INR)
                    </div>
                    <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="admin-stat-value text-2xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{formatAdminINR(refundTotals)}</div>
                </div>
                <div className="text-[10px] text-purple-700 dark:text-purple-400 group-hover:underline font-bold mt-3">
                  View Refunds →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('orders', { paymentStatus: 'settled' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-amber-500/30 p-5 rounded-2xl cursor-pointer hover:border-amber-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                      Settlement Totals (INR)
                    </div>
                    <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="admin-stat-value text-2xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{formatAdminINR(settlementTotals)}</div>
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400 group-hover:underline font-bold mt-3">
                  Settled Sales →
                </div>
              </div>

              <div
                onClick={() => handleDashboardCardNavigate('inventory', { filter: 'low_stock' })}
                className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-rose-500/30 p-5 rounded-2xl cursor-pointer hover:border-rose-500 hover:shadow-md dark:hover:bg-[var(--brand-primary-light)] hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-rose-700 dark:text-rose-400 font-bold">
                      Low Stock Products
                    </div>
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="admin-stat-value text-3xl font-bold font-mono text-[#0B2F20] dark:text-white mt-1">{lowStockProducts.length}</div>
                </div>
                <div className="text-[10px] text-rose-700 dark:text-rose-400 group-hover:underline font-bold mt-3">
                  Manage Inventory →
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="admin-card bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif-luxury text-[#0B2F20] dark:text-slate-100">Recent Customer Orders</h3>
                  <p className="text-[11px] text-[#6B756E] dark:text-slate-400">Click any row to open complete Order Details & Logistics Management</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#C9A84E] dark:text-[var(--brand-gold)] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-[#6B756E] dark:text-slate-400 text-xs border border-dashed border-[#E5D8B5] dark:border-white/10 rounded-xl">
                  No customer orders received yet. Start with empty database state.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="text-[10px] uppercase tracking-wider text-[#123F2A] dark:text-[var(--brand-gold)] border-b border-[#E5D8B5] dark:border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5D8B5] dark:divide-white/5">
                      {orders.map((o) => (
                        <tr
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className="cursor-pointer hover:bg-[#F4EFE6] dark:hover:bg-white/10 transition-colors group"
                        >
                          <td className="py-3 px-3 font-mono font-bold text-[#123F2A] dark:text-[var(--brand-gold)] group-hover:underline">{o.orderNumber}</td>
                          <td className="py-3 px-3 text-[#4F5F55] dark:text-slate-300 font-mono text-[11px]">{o.date}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#123F2A] dark:text-white block">{o.customer.name}</span>
                            <span className="text-[10px] text-[#6B756E] dark:text-slate-400 block">{o.customer.email}</span>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <div className="font-bold text-[#0B2F20] dark:text-white">{formatAdminINR(o.totalAmountINR)}</div>
                            {o.currencyCode && o.currencyCode !== 'INR' && (
                              <div className="text-[10px] text-[#6B756E] dark:text-slate-400 font-normal">{formatOriginalAmount(o)}</div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.trackingStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/30' :
                              o.trackingStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/30' :
                              'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/30'
                            }`}>
                              {o.trackingStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(o);
                              }}
                              className="px-2.5 py-1 bg-[var(--brand-gold)] text-[#0B2F20] font-bold text-[10px] rounded-lg hover:bg-amber-400 transition-colors inline-flex items-center gap-1 shadow-sm"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Products Catalog & PDP Manager */}
        {activeTab === 'products' && (
          <AdminProductManager
            products={products}
            categories={categories}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onShowToast={showToast}
            formatINR={formatAdminINR}
          />
        )}

        {/* Tab 3: Inventory & SKU */}
        {activeTab === 'inventory' && (() => {
          const inventoryProducts = products.filter((p) => {
            if (inventoryFilter === 'low_stock') {
              return (typeof p.stock === 'number' ? p.stock : 100) < 10 || p.inStock === false;
            }
            return true;
          });

          return (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Inventory & Stock SKU</h1>
                  <p className="text-xs text-slate-300">Update stock counts, SKUs, and availability status.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--brand-gold)] bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 px-3.5 py-2 rounded-xl">
                  <span>Showing SKUs: {inventoryProducts.length} of {products.length}</span>
                </div>
              </div>

              {inventoryFilter === 'low_stock' && (
                <div className="bg-rose-950/80 border border-rose-500/40 p-3.5 px-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-rose-200 shadow-md">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>
                      Active Inventory Filter: <strong className="text-white font-mono">Low Stock & Out of Stock SKUs</strong> ({inventoryProducts.length} item{inventoryProducts.length === 1 ? '' : 's'})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setInventoryFilter('ALL');
                      if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/inventory');
                    }}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] uppercase font-bold flex items-center gap-1 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Clear Filter (Show All SKUs)</span>
                  </button>
                </div>
              )}

              <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl overflow-x-auto p-4 shadow-lg">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="text-[10px] uppercase text-[var(--brand-gold)] border-b border-white/10">
                    <tr>
                      <th className="py-2 px-3">SKU</th>
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3">Stock Units</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inventoryProducts.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 px-3 font-mono text-[var(--brand-gold)]">{p.sku}</td>
                        <td className="py-3 px-3 font-bold">{p.name}</td>
                        <td className="py-3 px-3 font-mono">{p.stock}</td>
                        <td className="py-3 px-3">
                          {p.stock > 10 ? (
                            <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded">In Stock</span>
                          ) : p.stock > 0 ? (
                            <span className="text-amber-400 font-bold text-[10px] bg-amber-950/60 px-2 py-0.5 rounded">Low Stock</span>
                          ) : (
                            <span className="text-rose-400 font-bold text-[10px] bg-rose-950/60 px-2 py-0.5 rounded">Out of Stock</span>
                          )}
                        </td>
                        <td className="py-3 px-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              updateProduct(p.id, { stock: Math.max(0, p.stock - 10) });
                              showToast('Stock decreased');
                            }}
                            className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[10px] font-bold"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => {
                              updateProduct(p.id, { stock: p.stock + 50 });
                              showToast('Stock added');
                            }}
                            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            +50
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* Tab 4: Categories */}
        {activeTab === 'categories' && (
          <AdminCategoryManager
            showToast={showToast}
            onSwitchToProductsTab={() => {
              setActiveTab('products');
            }}
          />
        )}

        {/* Tab 4.5: Category Pages Manager */}
        {activeTab === 'category_pages' && (
          <AdminCategoryPageManager />
        )}

        {/* Tab 5: Announcement Bar */}
        {activeTab === 'announcement' && <AdminAnnouncementManager showToast={showToast} />}

        {/* Tab 6: Hero Slider */}
        {activeTab === 'hero' && <AdminHeroSliderManager showToast={showToast} />}

        {/* Tab 7: Navigation Menu */}
        {activeTab === 'nav' && <AdminNavManager showToast={showToast} />}

        {/* Tab 7.5: Mobile Navigation Manager (Phase 3) */}
        {activeTab === 'mobile_nav' && <AdminMobileNavManager showToast={showToast} />}

        {/* Reviews & Ratings Module */}
        {activeTab === 'reviews' && <AdminReviewsManager showToast={showToast} />}

        {/* Before & After Slider Module */}
        {activeTab === 'before_after' && <AdminBeforeAfterManager showToast={showToast} />}

        {/* Video Testimonials Module */}
        {activeTab === 'videos' && <AdminVideoTestimonialsManager showToast={showToast} />}

        {/* Video Popup Modal Module */}
        {activeTab === 'video_popup' && <AdminVideoPopupManager showToast={showToast} />}

        {/* Shoppable Reels Module */}
        {activeTab === 'shoppable_reels' && <AdminShoppableReelsManager showToast={showToast} />}

        {/* Editorial Stories Module */}
        {activeTab === 'editorial_stories' && <AdminEditorialStoriesManager showToast={showToast} />}

        {/* Journal & Articles Module */}
        {activeTab === 'blogs' && <AdminBlogManager showToast={showToast} />}

        {/* AI Quiz Questions Module */}
        {activeTab === 'quiz' && <AdminQuizManager showToast={showToast} />}

        {/* Homepage AI Hair Quiz Banner Manager */}
        {activeTab === 'homepage_quiz' && <AdminHomepageQuizManager showToast={showToast} />}

        {/* Tab 8: Orders & Tracking */}
        {activeTab === 'orders' && (
          <AdminOrderManager
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            setSelectedOrder={setSelectedOrder}
            formatPrice={formatAdminINR}
            showToast={showToast}
            presetFilter={orderPresetFilter}
            onClearPresetFilter={() => {
              setOrderPresetFilter(null);
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin/orders');
            }}
          />
        )}

        {/* Tab 9: B2B Wholesale */}
        {activeTab === 'b2b' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-serif-luxury text-[#123F2A] dark:text-slate-100">
                  B2B Wholesale & Export Enquiries
                </h1>
                <p className="text-xs text-[#5F6B63] dark:text-slate-300">
                  Manage global commercial proposals, distributor applications, and bulk packaging orders ({b2bLeads.length} total).
                </p>
              </div>
            </div>

            {b2bLeads.length === 0 ? (
              <div className="p-12 text-center text-[#5F6B63] dark:text-slate-400 border border-dashed border-[#E5D8B5] dark:border-white/10 rounded-2xl bg-white dark:bg-[var(--brand-primary-dark)]">
                <Building2 className="w-10 h-10 mx-auto text-[#C9A84E] mb-3 opacity-60" />
                <p className="text-sm font-bold text-[#123F2A] dark:text-slate-200">No B2B Enquiries Yet</p>
                <p className="text-xs text-[#5F6B63] dark:text-slate-400 mt-1">
                  Enquiries submitted through the /b2b-enquiry page will appear here with complete business profiles.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {b2bLeads.map((lead) => {
                  const rawPhone = (lead.phone || '').replace(/\D/g, '');
                  const waUrl = rawPhone
                    ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                        `Hello ${lead.contactName}, thank you for contacting HAKKIVEDA regarding wholesale/export partnerships for ${lead.companyName}.`
                      )}`
                    : null;

                  return (
                    <div
                      key={lead.id}
                      className="bg-white dark:bg-[var(--brand-primary-dark)] border border-[#E5D8B5] dark:border-white/10 p-5 rounded-2xl space-y-4 text-xs shadow-xs"
                    >
                      {/* Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5D8B5] dark:border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#FAF8F2] dark:bg-black/30 border border-[#E5D8B5] dark:border-white/10 flex items-center justify-center text-[#123F2A] dark:text-[var(--brand-gold)] font-bold shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#123F2A] dark:text-[var(--brand-gold)]">
                              {lead.companyName}
                            </h4>
                            <span className="text-[10px] text-[#5F6B63] dark:text-slate-400">
                              Business Type: <strong className="text-[#123F2A] dark:text-slate-200">{lead.businessType || 'Wholesale / Distribution'}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[#5F6B63] dark:text-slate-400 font-mono text-[10px] bg-[#FAF8F2] dark:bg-black/40 px-2.5 py-1 rounded-lg border border-[#E5D8B5] dark:border-white/10">
                            {lead.createdAt}
                          </span>
                        </div>
                      </div>

                      {/* Detail Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[#37463D] dark:text-slate-300 bg-[#FAF8F2] dark:bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-[#E5D8B5] dark:border-white/5">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold">
                            Contact Person
                          </span>
                          <span className="font-bold text-[#123F2A] dark:text-slate-100">{lead.contactName}</span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold">
                            Email
                          </span>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-[#123F2A] dark:text-slate-200 hover:underline break-all"
                          >
                            {lead.email}
                          </a>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold">
                            Phone / WhatsApp
                          </span>
                          <span className="font-bold text-[#123F2A] dark:text-slate-100">{lead.phone}</span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold">
                            Country / Territory
                          </span>
                          <span className="font-medium text-[#123F2A] dark:text-slate-100">{lead.country}</span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold">
                            Estimated Order Volume
                          </span>
                          <span className="font-bold text-[#123F2A] dark:text-[var(--brand-gold)]">
                            {lead.estimatedVolume || 'Standard Order'}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold">
                            Preferred Contact
                          </span>
                          <span className="font-medium text-[#123F2A] dark:text-slate-100">
                            {lead.preferredContactMethod || 'WhatsApp'}
                          </span>
                        </div>
                      </div>

                      {/* Products Interested */}
                      {lead.productsInterested && (
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold mb-1">
                            Products Interested In:
                          </span>
                          <div className="bg-white dark:bg-black/30 border border-[#E5D8B5] dark:border-white/10 px-3 py-2 rounded-lg text-xs text-[#123F2A] dark:text-slate-200">
                            {lead.productsInterested}
                          </div>
                        </div>
                      )}

                      {/* Message / Requirements */}
                      {lead.message && (
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 font-bold mb-1">
                            Message / Requirements:
                          </span>
                          <p className="p-3 bg-white dark:bg-black/40 rounded-xl text-[#37463D] dark:text-slate-200 border border-[#E5D8B5] dark:border-white/10 italic leading-relaxed">
                            "{lead.message}"
                          </p>
                        </div>
                      )}

                      {/* Actions & Status Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5D8B5] dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-[#123F2A] dark:text-slate-300">
                            Status:
                          </label>
                          <select
                            value={lead.status || 'NEW'}
                            onChange={(e) => {
                              updateB2BLeadStatus(lead.id, e.target.value as any);
                              showToast(`Lead status updated to ${e.target.value}`);
                            }}
                            className="bg-[#FAF8F2] dark:bg-[var(--brand-primary-deep)] border border-[#E5D8B5] dark:border-white/20 px-3 py-1.5 rounded-lg text-[#123F2A] dark:text-slate-100 text-xs font-bold focus:outline-none focus:border-[#C9A84E] cursor-pointer"
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="NEGOTIATING">Negotiating</option>
                            <option value="SAMPLE_REQUESTED">Sample Requested</option>
                            <option value="CONVERTED">Converted</option>
                            <option value="CLOSED">Closed</option>
                            <option value="QUALIFIED">Qualified</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <a
                            href={`mailto:${lead.email}?subject=${encodeURIComponent(
                              `HAKKIVEDA Wholesale Partnership - ${lead.companyName}`
                            )}`}
                            className="bg-[#123F2A] hover:bg-[#0B2F20] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete enquiry from ${lead.companyName}?`)) {
                                deleteB2BLead(lead.id);
                                showToast('Enquiry deleted');
                              }
                            }}
                            className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 text-xs font-bold flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
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

        {/* Tab 9b: B2B Section Manager (Homepage Content) */}
        {activeTab === 'b2b_section' && <AdminB2BSectionManager />}

        {/* Tab: Customer Accounts Management */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Customer Accounts Directory</h1>
                <p className="text-xs text-slate-300">
                  Inspect profiles, view order histories, addresses, login logs, block accounts, and export customer data.
                </p>
              </div>

              <button
                onClick={() => {
                  playSound('form_submit');
                  exportCustomerData();
                }}
                className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-all shadow-lg shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export All Customers (CSV)</span>
              </button>
            </div>

            {/* Customer Search & Filter Bar */}
            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-gold)]" />
                <input
                  type="text"
                  placeholder="Search name, email, phone, city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto">
                <span className="text-slate-400">Status Filter:</span>
                <select
                  value={customerStatusFilter}
                  onChange={(e) => setCustomerStatusFilter(e.target.value as any)}
                  className="bg-[var(--brand-primary-deep)] border border-white/20 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                >
                  <option value="ALL">All Statuses ({customerAccounts.length})</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="BLOCKED">Blocked Only</option>
                </select>
              </div>
            </div>

            {/* Customers Table / List */}
            {filteredCustomers.length === 0 ? (
              <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-12 text-center rounded-2xl space-y-2">
                <Users className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-slate-300 font-serif-luxury text-sm">No customers matched your filter query.</p>
              </div>
            ) : (
              <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-200">
                    <thead className="bg-[var(--brand-primary-deep)] text-[var(--brand-gold)] font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Status & Points</th>
                        <th className="p-4">Total Spent / Orders</th>
                        <th className="p-4">Joined Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCustomers.map((cust) => {
                        const custOrders = orders.filter(
                          (o) => o.customer.email.toLowerCase() === cust.email.toLowerCase()
                        );
                        const totalSpent = custOrders.reduce((sum, o) => sum + o.totalAmountINR, 0);

                        return (
                          <tr key={cust.id} className="hover:bg-[var(--brand-primary-deep)]/60 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {cust.avatar ? (
                                  <img
                                    src={cust.avatar}
                                    alt={cust.name}
                                    className="w-10 h-10 rounded-full object-cover border border-[var(--brand-gold)]"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold flex items-center justify-center font-serif-luxury">
                                    {cust.name[0]?.toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-white text-sm block">{cust.name}</span>
                                  <span className="text-[10px] font-mono text-[var(--brand-gold)]">{cust.id}</span>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 space-y-0.5">
                              <div className="font-bold text-slate-200">{cust.email}</div>
                              <div className="text-[11px] text-slate-400">{cust.phone || 'No phone'}</div>
                            </td>

                            <td className="p-4 space-y-1">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  cust.status === 'BLOCKED'
                                    ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                                    : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                }`}
                              >
                                {cust.status || 'ACTIVE'}
                              </span>
                              <div className="text-[10px] text-[var(--brand-gold)] font-bold">
                                {cust.loyaltyPoints || 100} Hakki-Points
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="font-bold text-white">{formatAdminINR(totalSpent)}</div>
                              <div className="text-[10px] text-slate-400">{custOrders.length} Completed Orders</div>
                            </td>

                            <td className="p-4 text-slate-300 text-xs">
                              <div>{cust.createdAt || '2026-01-15'}</div>
                              <div className="text-[10px] text-slate-500">Last: {cust.lastLogin || 'Recent'}</div>
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    playSound('nav_click');
                                    setSelectedCustomerDossier(cust);
                                  }}
                                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-white transition-all shadow-sm"
                                >
                                  Inspect Profile
                                </button>

                                <button
                                  onClick={() => {
                                    playSound('nav_click');
                                    setCustPasswordModalUser(cust);
                                    setCustAssignedTempPass(null);
                                    setCustPassModalMsg(null);
                                    setCustManualPassword('');
                                  }}
                                  className="bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all"
                                  title="Admin-Assisted Password Setup / Reset"
                                >
                                  <Key className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Set Pass</span>
                                </button>

                                <button
                                  onClick={() => {
                                    toggleBlockCustomer(cust.id);
                                    showToast(cust.status === 'BLOCKED' ? 'Account Unblocked' : 'Account Blocked');
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] border transition-all ${
                                    cust.status === 'BLOCKED'
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                      : 'bg-rose-950/60 text-rose-300 border-rose-500/30 hover:bg-rose-900'
                                  }`}
                                >
                                  {cust.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Delete customer profile for ${cust.name}?`)) {
                                      deleteCustomerAccount(cust.id);
                                      showToast('Customer deleted');
                                    }
                                  }}
                                  className="text-slate-400 hover:text-rose-400 p-1.5"
                                  title="Delete Customer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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

            {/* Customer Profile Dossier Inspection Modal */}
            {selectedCustomerDossier && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="relative w-full max-w-2xl bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl shadow-2xl p-6 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto font-sans">
                  <button
                    onClick={() => setSelectedCustomerDossier(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    {selectedCustomerDossier.avatar ? (
                      <img
                        src={selectedCustomerDossier.avatar}
                        alt={selectedCustomerDossier.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[var(--brand-gold)]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-2xl font-serif-luxury flex items-center justify-center">
                        {selectedCustomerDossier.name[0]?.toUpperCase()}
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)] block">
                        Customer Account Dossier
                      </span>
                      <h3 className="text-xl font-bold font-serif-luxury text-white">{selectedCustomerDossier.name}</h3>
                      <p className="text-xs text-slate-300">{selectedCustomerDossier.email} • {selectedCustomerDossier.phone || 'No phone'}</p>
                    </div>
                  </div>

                  {/* Dossier Quick Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Status</span>
                      <span className="font-bold text-[var(--brand-gold)]">{selectedCustomerDossier.status || 'ACTIVE'}</span>
                    </div>
                    <div className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Joined Date</span>
                      <span className="font-bold text-white">{selectedCustomerDossier.createdAt || '2026'}</span>
                    </div>
                    <div className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Reward Points</span>
                      <span className="font-bold text-[var(--brand-gold)]">{selectedCustomerDossier.loyaltyPoints || 100} Points</span>
                    </div>
                    <div className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Saved Addresses</span>
                      <span className="font-bold text-white">{selectedCustomerDossier.addresses?.length || 0}</span>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-[var(--brand-gold)] uppercase tracking-wider text-[11px]">Saved Shipping Addresses</h4>
                    {selectedCustomerDossier.addresses?.length === 0 ? (
                      <p className="text-slate-400">No saved addresses for this customer.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCustomerDossier.addresses.map((a) => (
                          <div key={a.id} className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10 text-[11px]">
                            <div className="font-bold text-white">{a.title} ({a.name})</div>
                            <div className="text-slate-300">{a.line1}, {a.city}, {a.state} - {a.pincode}, {a.country}</div>
                            <div className="text-[var(--brand-gold)]">Phone: {a.phone}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Login Activity Logs */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-[var(--brand-gold)] uppercase tracking-wider text-[11px]">Login Activity Telemetry</h4>
                    <div className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10 space-y-2">
                      {(selectedCustomerDossier.loginHistory || [
                        {
                          id: 'log-def',
                          timestamp: selectedCustomerDossier.lastLogin || 'Recent',
                          ipLocation: 'Mysore, Karnataka, India (Web Session)',
                          device: 'Chrome Browser',
                        },
                      ]).map((log) => (
                        <div key={log.id} className="flex items-center justify-between border-b border-white/5 pb-1 last:border-0 text-[11px]">
                          <div>
                            <span className="font-bold text-white block">{log.ipLocation}</span>
                            <span className="text-[10px] text-slate-400">{log.device}</span>
                          </div>
                          <span className="text-[10px] text-[var(--brand-gold)]">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Password & Security Administration Card */}
                  <div className="space-y-2 text-xs bg-[var(--brand-primary-dark)] p-4 rounded-xl border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                        <Key className="w-4 h-4" />
                        <span>Security & Account Credentials</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          playSound('nav_click');
                          setCustPasswordModalUser(selectedCustomerDossier);
                          setCustAssignedTempPass(null);
                          setCustPassModalMsg(null);
                          setCustManualPassword('');
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all"
                      >
                        Set / Reset Password
                      </button>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Assisted customer password migration. Generates cryptographically secure temporary passwords or establishes verified credentials directly on behalf of support-verified customers.
                    </p>
                  </div>

                  {/* Export Dossier Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => exportCustomerData(selectedCustomerDossier.id)}
                      className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white"
                    >
                      Export JSON Dossier
                    </button>
                    <button
                      onClick={() => setSelectedCustomerDossier(null)}
                      className="bg-[var(--brand-primary-dark)] text-slate-300 border border-white/20 px-4 py-2 rounded-xl font-bold text-xs"
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Admin-Assisted Customer Password Setup Modal */}
            {custPasswordModalUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                <div className="relative w-full max-w-lg bg-[var(--brand-primary-deep)] border border-amber-500/50 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100 font-sans">
                  <button
                    onClick={() => {
                      setCustPasswordModalUser(null);
                      setCustAssignedTempPass(null);
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        Admin Credential Setup
                      </span>
                      <h3 className="text-base font-bold text-white">
                        {custPasswordModalUser.name} ({custPasswordModalUser.email})
                      </h3>
                    </div>
                  </div>

                  {custPassModalMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium ${
                        custPassModalMsg.type === 'success'
                          ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
                      }`}
                    >
                      {custPassModalMsg.text}
                    </div>
                  )}

                  {custAssignedTempPass ? (
                    <div className="bg-amber-950/60 border border-amber-500/40 p-4 rounded-xl space-y-3">
                      <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Active Temporary / New Password:
                      </div>
                      <div className="flex items-center justify-between bg-black/60 px-4 py-3 rounded-lg border border-white/20">
                        <span className="font-mono text-base font-bold text-[var(--brand-gold)] select-all tracking-wider">
                          {custAssignedTempPass}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(custAssignedTempPass);
                            showToast('Password copied to clipboard');
                          }}
                          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-white transition-all"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Securely relay this temporary password to the customer via verified support channels (Email/SMS/WhatsApp).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs">
                      <p className="text-slate-300 leading-relaxed">
                        Establish credentials for customer support verification. For customer privacy and security, any password set here acts as a temporary key; the customer will be automatically required to establish their own private password upon next login.
                      </p>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-300 uppercase">
                          Custom Password (Optional - min 6 chars)
                        </label>
                        <input
                          type="text"
                          value={custManualPassword}
                          onChange={(e) => setCustManualPassword(e.target.value)}
                          placeholder="Leave blank to generate random password"
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-3 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button
                          type="button"
                          disabled={custPassLoading}
                          onClick={() => handleAdminSetCustomerPassword(true)}
                          className="w-full sm:w-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all disabled:opacity-50"
                        >
                          {custPassLoading ? 'Generating...' : 'Generate Random Temp Pass'}
                        </button>
                        <button
                          type="button"
                          disabled={custPassLoading || !custManualPassword.trim()}
                          onClick={() => handleAdminSetCustomerPassword(false)}
                          className="w-full sm:w-1/2 bg-[var(--brand-gold)] hover:bg-white text-[var(--brand-primary-dark)] py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all disabled:opacity-50"
                        >
                          {custPassLoading ? 'Setting...' : 'Set Specified Password'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setCustPasswordModalUser(null);
                        setCustAssignedTempPass(null);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-slate-300 px-4 py-2 rounded-xl font-bold text-xs"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 9: Media Gallery */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Product Media & Image Asset Library</h1>
                <p className="text-xs text-slate-300">
                  Shopify-style Original Media System. 100% exact original pixels stored without AI alteration, background removal, or recoloring.
                </p>
              </div>
              <label className="cursor-pointer bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg">
                <Upload className="w-4 h-4" />
                <span>Upload Original Media File</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []) as File[];
                    for (const file of files) {
                      try {
                        const url = await uploadFileToServer(file);
                        addMediaItem({
                          title: file.name.replace(/\.[^/.]+$/, ''),
                          url,
                          type: 'image',
                        });
                      } catch (err) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            addMediaItem({
                              title: file.name.replace(/\.[^/.]+$/, ''),
                              url: ev.target.result as string,
                              type: 'image',
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                    showToast('Media files uploaded permanently to server');
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Area Dropzone */}
            <div className="bg-[var(--brand-primary-dark)] border-2 border-dashed border-[var(--brand-gold)]/40 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] flex items-center justify-center mx-auto">
                <Image className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Upload High-Resolution Product Photos</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Select JPEG, PNG, WebP or GIF photos. The exact uploaded image file will be stored separately and displayed across all store views without AI modification.
              </p>
              <label className="inline-flex cursor-pointer bg-[var(--brand-primary-deep)] border border-white/20 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:border-[var(--brand-gold)] transition-all">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []) as File[];
                    for (const file of files) {
                      try {
                        const url = await uploadFileToServer(file);
                        addMediaItem({
                          title: file.name.replace(/\.[^/.]+$/, ''),
                          url,
                          type: 'image',
                        });
                      } catch (err) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            addMediaItem({
                              title: file.name.replace(/\.[^/.]+$/, ''),
                              url: ev.target.result as string,
                              type: 'image',
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                    showToast('Media uploaded permanently to server');
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaItems.map((m) => (
                <div key={m.id} className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-xl overflow-hidden group hover:border-[var(--brand-gold)] transition-all flex flex-col justify-between">
                  <div className="h-36 bg-black/40 relative flex items-center justify-center p-2">
                    <img src={m.url} alt={m.title} className="max-h-full max-w-full object-contain" />
                    <span className="absolute top-2 left-2 bg-black/60 text-[var(--brand-gold)] text-[9px] font-mono px-1.5 py-0.5 rounded uppercase">
                      Original
                    </span>
                  </div>
                  <div className="p-3 space-y-2 bg-[var(--brand-primary-deep)]">
                    <p className="text-xs font-bold text-slate-200 truncate">{m.title}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.url);
                          showToast('Image URL copied to clipboard');
                        }}
                        className="flex-1 bg-white/10 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] text-slate-200 text-[10px] py-1 rounded font-bold transition-all"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => {
                          deleteMediaItem(m.id);
                          showToast('Media deleted');
                        }}
                        className="p-1 text-rose-400 hover:text-rose-300"
                        title="Delete Media"
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

        {/* Tab 10: Coupons */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Coupons & Discount Codes</h1>
              <p className="text-xs text-slate-300">Create promotional discount codes for global checkout.</p>
            </div>

            <form onSubmit={handleCouponSubmit} className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-3 text-xs">
              <h3 className="font-bold text-[var(--brand-gold)] uppercase">Create New Coupon</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Coupon Code e.g. TRIBAL15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value as any)}
                  className="bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 font-bold"
                >
                  <option value="PERCENT">PERCENTAGE (%)</option>
                  <option value="FLAT">FLAT INR (₹)</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Value e.g. 15 or 500"
                  value={couponVal}
                  onChange={(e) => setCouponVal(Number(e.target.value))}
                  className="bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
                <input
                  type="number"
                  required
                  placeholder="Min Order INR"
                  value={couponMinINR}
                  onChange={(e) => setCouponMinINR(Number(e.target.value))}
                  className="bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
              </div>
              <button type="submit" className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-lg font-bold">
                Add Coupon Code
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="bg-[var(--brand-primary-dark)] border border-white/10 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-mono text-base font-bold text-[var(--brand-gold)]">{c.code}</h4>
                    <p className="text-xs text-slate-300">
                      {c.discountType === 'PERCENT' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                    </p>
                    <p className="text-[10px] text-slate-400">Min Order: ₹{c.minOrderINR}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteCoupon(c.code);
                      showToast('Coupon deleted');
                    }}
                    className="text-rose-400 hover:text-rose-300 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 11: Currency & Countries */}
        {activeTab === 'currency' && (() => {
          const filteredCountriesList = countries.filter((c) => {
            const matchesSearch =
              c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
              c.code.toLowerCase().includes(countrySearch.toLowerCase());
            const matchesRegion =
              selectedRegionFilter === 'ALL' ||
              (c.region && c.region.toUpperCase() === selectedRegionFilter.toUpperCase());
            const matchesRule =
              selectedRuleFilter === 'ALL' ||
              (selectedRuleFilter === 'COD_AND_PREPAID' && c.shippingRule === 'COD_AND_PREPAID') ||
              (selectedRuleFilter === 'PREPAID_ONLY' && c.shippingRule === 'PREPAID_ONLY') ||
              (selectedRuleFilter === 'BLOCK_ORDERS' && c.shippingRule === 'BLOCK_ORDERS');
            return matchesSearch && matchesRegion && matchesRule;
          });

          const totalPages = Math.ceil(filteredCountriesList.length / COUNTRIES_PER_PAGE) || 1;
          const currentPageSafe = Math.min(countryPage, totalPages);
          const paginatedCountries = filteredCountriesList.slice(
            (currentPageSafe - 1) * COUNTRIES_PER_PAGE,
            currentPageSafe * COUNTRIES_PER_PAGE
          );

          const enabledCount = countries.filter((c) => c.enabled).length;

          return (
            <div className="space-y-8 animate-in fade-in">
              {/* Module Header & Summary Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-[var(--brand-gold)]" />
                    <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">
                      Currencies & Global Shipping Countries
                    </h1>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Manage Shopify-style Markets, exchange rates, global shipping rules, and payment gateways for 250+ world destinations.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-[var(--brand-primary-dark)] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Destinations</span>
                    <span className="font-bold text-[var(--brand-gold)] font-mono">{countries.length} Countries</span>
                  </div>
                  <div className="bg-[var(--brand-primary-dark)] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Deliveries</span>
                    <span className="font-bold text-emerald-400 font-mono">{enabledCount} Active</span>
                  </div>
                  <div className="bg-[var(--brand-primary-dark)] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Markets Configured</span>
                    <span className="font-bold text-amber-300 font-mono">{markets.length} Markets</span>
                  </div>
                </div>
              </div>

              {/* Section 1: Exchange Rates (9 Official Currencies) */}
              <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Official Currency Exchange Rates (Base: INR ₹)
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Prices on the storefront automatically convert using these dynamic exchange rates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-sans">
                  {currencies.map((curr) => (
                    <div
                      key={curr.code}
                      className="p-3 bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl flex items-center justify-between hover:border-[var(--brand-gold)]/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{curr.flag}</span>
                        <div>
                          <span className="font-bold text-slate-100 block">{curr.country}</span>
                          <span className="text-[10px] font-mono text-[var(--brand-gold)]">
                            {curr.code} ({curr.symbol})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[var(--brand-primary-dark)] p-1.5 rounded-lg border border-white/10">
                        <span className="text-slate-400 text-[10px]">1 {curr.code} =</span>
                        <input
                          type="number"
                          step="0.001"
                          value={curr.rateToINR}
                          onChange={(e) => {
                            const newRate = Number(e.target.value);
                            updateCurrencyRate(curr.code, newRate);
                            showToast(`Updated exchange rate for ${curr.code}: 1 ${curr.code} = ₹${newRate}`);
                          }}
                          className="w-16 bg-black/40 border border-white/20 px-1.5 py-1 rounded text-slate-100 font-mono text-xs text-right focus:border-[var(--brand-gold)] outline-none"
                        />
                        <span className="text-slate-400 text-[10px]">INR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Shopify-Style Markets Manager */}
              <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-4 h-4" /> Global Markets Manager (Shopify Strategy)
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Define shipping policies, free shipping thresholds, and payment gateway rules for regional markets.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {markets.map((mkt) => {
                    const countryCount = countries.filter((c) => c.marketId === mkt.id || (mkt.code === 'INT' && c.marketId === 'mkt-int')).length;

                    return (
                      <div
                        key={mkt.id}
                        className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-xl space-y-3 relative overflow-hidden group hover:border-[var(--brand-gold)]/50 transition-all"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[var(--brand-gold)] tracking-wider">Market</span>
                            <h4 className="text-sm font-bold text-white">{mkt.name}</h4>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 font-bold">
                            {mkt.currencyCode}
                          </span>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Shipping Rule:</span>
                            <select
                              value={mkt.shippingRule}
                              onChange={(e) => {
                                const newRule = e.target.value as any;
                                updateMarket(mkt.id, { shippingRule: newRule });
                                showToast(`Updated default shipping rule for ${mkt.name}`);
                              }}
                              className="bg-[var(--brand-primary-dark)] border border-white/20 text-slate-100 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-[var(--brand-gold)]"
                            >
                              <option value="COD_AND_PREPAID">COD + Prepaid</option>
                              <option value="PREPAID_ONLY">Prepaid Only</option>
                              <option value="BLOCK_ORDERS">Block Orders</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Free Shipping Min:</span>
                            <div className="flex items-center gap-1 font-mono">
                              <input
                                type="number"
                                value={mkt.freeShippingThreshold}
                                onChange={(e) => updateMarket(mkt.id, { freeShippingThreshold: Number(e.target.value) })}
                                className="w-20 bg-[var(--brand-primary-dark)] border border-white/20 rounded px-2 py-0.5 text-right text-slate-100"
                              />
                              <span className="text-[10px] text-slate-400">{mkt.currencyCode}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-slate-400">Target Countries:</span>
                            <span className="font-bold text-slate-200 font-mono">{countryCount} Countries</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Bulk Quick Actions */}
              <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Quick Bulk Target Toggles
                </h3>
                <p className="text-[11px] text-slate-300">Enable or disable delivery targets for entire global regions with a single click.</p>

                <div className="flex items-center gap-2 flex-wrap pt-1 text-xs font-sans">
                  <button
                    onClick={() => {
                      bulkUpdateCountries('ENABLE_ALL');
                      showToast('Enabled delivery targets for ALL 250+ countries!');
                    }}
                    className="bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg border border-emerald-400/30 flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enable All Countries</span>
                  </button>

                  <button
                    onClick={() => {
                      bulkUpdateCountries('DISABLE_ALL');
                      showToast('Disabled delivery targets for all countries (except manually updated)');
                    }}
                    className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 font-bold px-3 py-1.5 rounded-lg border border-rose-500/30 flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Disable All Countries</span>
                  </button>

                  <div className="h-5 w-px bg-white/20 mx-1 hidden sm:block" />

                  {['Asia', 'GCC', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'].map((reg) => {
                    const regCount = countries.filter((c) => c.region?.toLowerCase() === reg.toLowerCase()).length;
                    return (
                      <button
                        key={reg}
                        onClick={() => {
                          bulkUpdateCountries('ENABLE_REGION', reg);
                          showToast(`Enabled delivery targets for all ${reg} countries (${regCount} countries)`);
                        }}
                        className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] text-slate-200 font-semibold px-3 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1"
                      >
                        <span>Enable {reg}</span>
                        <span className="text-[10px] opacity-70 font-mono">({regCount})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: All World Countries Table & Search */}
              <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Global Destinations Database ({filteredCountriesList.length} Matching)
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Configure Enable/Disable, Shipping Rules (COD/Prepaid/Blocked), and Payment Rules for individual countries.
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search country or code..."
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setCountryPage(1);
                      }}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                    />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-400 font-bold shrink-0 text-[10px] uppercase">Region:</span>
                  {['ALL', 'Asia', 'GCC', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'].map((reg) => (
                    <button
                      key={reg}
                      onClick={() => {
                        setSelectedRegionFilter(reg);
                        setCountryPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                        selectedRegionFilter === reg
                          ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                          : 'bg-black/30 text-slate-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}

                  <div className="h-4 w-px bg-white/20 mx-1 shrink-0" />

                  <span className="text-slate-400 font-bold shrink-0 text-[10px] uppercase">Rule:</span>
                  {[
                    { id: 'ALL', label: 'All Rules' },
                    { id: 'COD_AND_PREPAID', label: 'COD + Prepaid' },
                    { id: 'PREPAID_ONLY', label: 'Prepaid Only' },
                    { id: 'BLOCK_ORDERS', label: 'Blocked' },
                  ].map((rl) => (
                    <button
                      key={rl.id}
                      onClick={() => {
                        setSelectedRuleFilter(rl.id);
                        setCountryPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                        selectedRuleFilter === rl.id
                          ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                          : 'bg-black/30 text-slate-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {rl.label}
                    </button>
                  ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[var(--brand-primary-deep)]">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-[var(--brand-gold)] uppercase text-[10px] tracking-wider border-b border-white/10">
                        <th className="py-3 px-3">Country / Territory</th>
                        <th className="py-3 px-2">ISO Code</th>
                        <th className="py-3 px-2">Region</th>
                        <th className="py-3 px-2">Assigned Market</th>
                        <th className="py-3 px-2">Currency</th>
                        <th className="py-3 px-3">Shipping Rule</th>
                        <th className="py-3 px-3">Payment Rule</th>
                        <th className="py-3 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedCountries.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                            No countries found matching search query or active filter.
                          </td>
                        </tr>
                      ) : (
                        paginatedCountries.map((c) => {
                          const mkt = markets.find((m) => m.id === c.marketId) || markets.find((m) => m.code === 'INT');

                          return (
                            <tr key={c.code} className="hover:bg-white/5 transition-colors">
                              <td className="py-2.5 px-3 font-bold text-slate-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{c.flag}</span>
                                  <span>{c.name}</span>
                                </div>
                              </td>

                              <td className="py-2.5 px-2 font-mono text-[11px] text-slate-400">{c.code}</td>

                              <td className="py-2.5 px-2">
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                                  {c.region || 'Asia'}
                                </span>
                              </td>

                              <td className="py-2.5 px-2">
                                <span className="text-[11px] text-amber-300 font-bold">{mkt?.name || 'International'}</span>
                              </td>

                              <td className="py-2.5 px-2">
                                <span className="font-mono text-[11px] font-bold text-[var(--brand-gold)]">{c.currencyCode}</span>
                              </td>

                              <td className="py-2.5 px-3">
                                <select
                                  value={c.shippingRule}
                                  onChange={(e) => {
                                    const val = e.target.value as any;
                                    updateCountrySetting(c.code, { shippingRule: val, paymentRule: val === 'COD_AND_PREPAID' ? 'COD_AND_PREPAID' : 'PREPAID_ONLY' });
                                    showToast(`Updated ${c.name} shipping rule to ${val}`);
                                  }}
                                  className="bg-[var(--brand-primary-dark)] border border-white/20 text-slate-100 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                                >
                                  <option value="COD_AND_PREPAID">COD + Prepaid</option>
                                  <option value="PREPAID_ONLY">Prepaid Only</option>
                                  <option value="BLOCK_ORDERS">Block Orders</option>
                                </select>
                              </td>

                              <td className="py-2.5 px-3">
                                <select
                                  value={c.paymentRule}
                                  onChange={(e) => {
                                    const val = e.target.value as any;
                                    updateCountrySetting(c.code, { paymentRule: val });
                                    showToast(`Updated ${c.name} payment rule to ${val}`);
                                  }}
                                  className="bg-[var(--brand-primary-dark)] border border-white/20 text-slate-100 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-[var(--brand-gold)] font-sans"
                                >
                                  <option value="COD_AND_PREPAID">COD + Prepaid</option>
                                  <option value="PREPAID_ONLY">Prepaid Only</option>
                                  <option value="BLOCK_ORDERS">Block Orders</option>
                                </select>
                              </td>

                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => {
                                    const nextState = !c.enabled;
                                    updateCountrySetting(c.code, { enabled: nextState });
                                    showToast(`${nextState ? 'Enabled' : 'Disabled'} shipping target for ${c.name}`);
                                  }}
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                    c.enabled
                                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                                      : 'bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900'
                                  }`}
                                >
                                  {c.enabled ? 'Enabled' : 'Disabled'}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-slate-400">
                      Showing {(currentPageSafe - 1) * COUNTRIES_PER_PAGE + 1} -{' '}
                      {Math.min(currentPageSafe * COUNTRIES_PER_PAGE, filteredCountriesList.length)} of {filteredCountriesList.length} destinations
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCountryPage((p) => Math.max(1, p - 1))}
                        disabled={currentPageSafe === 1}
                        className="px-3 py-1.5 rounded-lg bg-[var(--brand-primary-deep)] border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300"
                      >
                        Previous
                      </button>

                      <span className="text-[11px] font-mono font-bold text-[var(--brand-gold)] px-2">
                        Page {currentPageSafe} of {totalPages}
                      </span>

                      <button
                        onClick={() => setCountryPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPageSafe >= totalPages}
                        className="px-3 py-1.5 rounded-lg bg-[var(--brand-primary-deep)] border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Shiprocket Tab */}
        {activeTab === 'shiprocket' && <AdminShiprocketManager />}

        {/* Tab 12: Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-bold font-serif-luxury text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[var(--brand-gold)]" />
                  Payment Gateway Settings
                </h1>
                <p className="text-xs text-slate-300">
                  Manage multi-gateway API credentials, market payment rules, COD limits, priorities & transaction refunds.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Payment configuration saved and active across all storefront markets!');
                  }}
                  className="px-4 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-deep)] font-extrabold text-xs hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Payment Settings
                </button>
              </div>
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
              {[
                { id: 'GATEWAYS', label: 'Payment Gateways', icon: Key },
                { id: 'MARKETS', label: 'Market & Country Mappings', icon: Globe },
                { id: 'COD', label: 'COD Rules & Limits', icon: Banknote },
                { id: 'PRIORITY', label: 'Priority & Drag Order', icon: ArrowUpDown },
                { id: 'LOGS', label: 'Payment Logs & Refunds', icon: CreditCard },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = paymentSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentSubTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border ${
                      isActive
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-deep)] border-[var(--brand-gold)] shadow-md'
                        : 'bg-[var(--brand-primary-dark)] text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab 1: GATEWAYS */}
            {paymentSubTab === 'GATEWAYS' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {paymentGateways.map((gw) => {
                    const isLive = gw.mode === 'LIVE';
                    return (
                      <div
                        key={gw.id}
                        className={`bg-[var(--brand-primary-dark)] border rounded-2xl p-6 transition-all space-y-5 ${
                          gw.enabled
                            ? 'border-white/15 shadow-xl'
                            : 'border-white/5 opacity-60 bg-slate-900/40'
                        }`}
                      >
                        {/* Top Bar: Icon, Name, Enabled Toggle, Mode Switch */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <PaymentIcon gatewayId={gw.id} size="lg" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-slate-100">{gw.name}</h3>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                                  {gw.id}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-0.5">{gw.description}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {/* Connection Status Badge */}
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border ${
                                gw.connectionStatus === 'CONNECTED'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                  : gw.connectionStatus === 'FAILED'
                                  ? 'bg-red-950/80 text-red-300 border-red-500/40'
                                  : 'bg-slate-800 text-slate-400 border-white/10'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  gw.connectionStatus === 'CONNECTED'
                                    ? 'bg-emerald-400 animate-pulse'
                                    : gw.connectionStatus === 'FAILED'
                                    ? 'bg-red-400'
                                    : 'bg-slate-500'
                                }`}
                              ></span>
                              {gw.connectionStatus}
                            </span>

                            {/* Mode Toggle */}
                            <div className="bg-[var(--brand-primary-deep)] p-1 rounded-xl border border-white/10 flex items-center text-xs font-bold">
                              <button
                                onClick={() => updatePaymentGateway(gw.id, { mode: 'TEST' })}
                                className={`px-2.5 py-1 rounded-lg transition-all ${
                                  !isLive
                                    ? 'bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                TEST
                              </button>
                              <button
                                onClick={() => updatePaymentGateway(gw.id, { mode: 'LIVE' })}
                                className={`px-2.5 py-1 rounded-lg transition-all ${
                                  isLive
                                    ? 'bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                LIVE
                              </button>
                            </div>

                            {/* Enable / Disable Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={gw.enabled}
                                onChange={(e) =>
                                  updatePaymentGateway(gw.id, { enabled: e.target.checked })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>
                        </div>

                        {/* Webhook Status & Copy Box */}
                        {gw.webhookUrl && (
                          <div className="bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="font-bold text-slate-400 shrink-0">Webhook URL:</span>
                              <code className="text-slate-200 font-mono truncate select-all">
                                {gw.webhookUrl}
                              </code>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  gw.webhookStatus === 'SYNCED' || gw.webhookStatus === 'ACTIVE'
                                    ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                                    : 'bg-amber-900/40 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {gw.webhookStatus}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(gw.webhookUrl || '');
                                  showToast(`${gw.name} Webhook URL copied to clipboard!`);
                                }}
                                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-bold transition-all text-[11px]"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Credentials Grid: Test Keys vs Live Keys */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Test Mode Keys */}
                          <div
                            className={`p-4 rounded-xl border space-y-3 ${
                              !isLive
                                ? 'bg-amber-950/20 border-amber-500/30 ring-1 ring-amber-500/20'
                                : 'bg-[var(--brand-primary-deep)] border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                Test Credentials
                              </span>
                              {!isLive && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40">
                                  ACTIVE MODE
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Test API Key / Merchant ID
                              </label>
                              <input
                                type="text"
                                value={gw.testApiKey}
                                onChange={(e) =>
                                  updatePaymentGateway(gw.id, { testApiKey: e.target.value })
                                }
                                placeholder="rzp_test_..."
                                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2.5 text-slate-100 font-mono focus:border-[var(--brand-gold)] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Test Secret Key / Salt Key
                              </label>
                              <input
                                type="password"
                                value={gw.testSecretKey}
                                onChange={(e) =>
                                  updatePaymentGateway(gw.id, { testSecretKey: e.target.value })
                                }
                                placeholder="••••••••••••••••"
                                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2.5 text-slate-100 font-mono focus:border-[var(--brand-gold)] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Live Mode Keys */}
                          <div
                            className={`p-4 rounded-xl border space-y-3 ${
                              isLive
                                ? 'bg-emerald-950/20 border-emerald-500/30 ring-1 ring-emerald-500/20'
                                : 'bg-[var(--brand-primary-deep)] border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                Live Credentials
                              </span>
                              {isLive && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                                  ACTIVE MODE
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Live API Key / Merchant ID
                              </label>
                              <input
                                type="text"
                                value={gw.liveApiKey}
                                onChange={(e) =>
                                  updatePaymentGateway(gw.id, { liveApiKey: e.target.value })
                                }
                                placeholder="rzp_live_..."
                                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2.5 text-slate-100 font-mono focus:border-[var(--brand-gold)] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Live Secret Key / Salt Key
                              </label>
                              <input
                                type="password"
                                value={gw.liveSecretKey}
                                onChange={(e) =>
                                  updatePaymentGateway(gw.id, { liveSecretKey: e.target.value })
                                }
                                placeholder="••••••••••••••••"
                                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-lg p-2.5 text-slate-100 font-mono focus:border-[var(--brand-gold)] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Test Connection Footer */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                          <span className="text-xs text-slate-400">
                            Last Tested:{' '}
                            <span className="text-slate-200 font-mono">
                              {gw.lastTestedAt || 'Never'}
                            </span>
                          </span>

                          <button
                            onClick={async () => {
                              setTestingGatewayId(gw.id);
                              const res = await testGatewayConnection(gw.id);
                              setTestingGatewayId(null);
                              showToast(res.message);
                            }}
                            disabled={testingGatewayId === gw.id}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-100 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/15 disabled:opacity-50"
                          >
                            {testingGatewayId === gw.id ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin text-[var(--brand-gold)]" />
                                Verifying Handshake...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                Test Connection & Webhook
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: MARKETS */}
            {paymentSubTab === 'MARKETS' && (
              <div className="space-y-6">
                <div className="bg-[var(--brand-primary-dark)] p-4 rounded-2xl border border-white/10">
                  <h2 className="font-serif-luxury text-base font-bold text-slate-100 mb-1">
                    Market-Specific Payment Gateway Matrix
                  </h2>
                  <p className="text-xs text-slate-300 mb-4">
                    Select which payment gateways are accessible to customers during checkout based on their shipping market.
                  </p>

                  <div className="space-y-4">
                    {markets.map((m) => {
                      const marketMapping = marketGateways.find((mg) => mg.marketId === m.id) || {
                        marketId: m.id,
                        countryCode: m.countryCode,
                        marketName: m.name,
                        currencyCode: m.currencyCode,
                        gateways: m.paymentGateways as PaymentGatewayId[],
                      };
                      const assignedGateways = marketMapping.gateways || [];

                      return (
                        <div
                          key={m.id}
                          className="bg-[var(--brand-primary-deep)] p-5 rounded-2xl border border-white/10 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{m.flag}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-sm text-slate-100">{m.name}</h3>
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                                    {m.currencyCode} ({m.currencySymbol})
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                  Includes {m.countriesCount} countries ({m.countriesList})
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[var(--brand-gold)]">
                              {assignedGateways.length} Gateways Enabled
                            </span>
                          </div>

                          {/* Gateway Checkboxes for this market */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {paymentGateways.map((gw) => {
                              const isChecked = assignedGateways.includes(gw.id);
                              return (
                                <label
                                  key={gw.id}
                                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md'
                                      : 'bg-[var(--brand-primary-dark)] border-white/10 text-slate-400 hover:border-white/20'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const nextGateways = e.target.checked
                                        ? [...assignedGateways, gw.id]
                                        : assignedGateways.filter((g) => g !== gw.id);
                                      updateMarketGateways(m.id, nextGateways);
                                      showToast(`Updated payment methods for ${m.name}`);
                                    }}
                                    className="sr-only"
                                  />
                                  <PaymentIcon gatewayId={gw.id} size="sm" />
                                  <span className="text-[11px] font-bold text-center">{gw.name}</span>
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                                      isChecked
                                        ? 'bg-emerald-500 border-emerald-400 text-white font-bold'
                                        : 'border-white/30 bg-white/5'
                                    }`}
                                  >
                                    {isChecked ? '✓' : ''}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: COD */}
            {paymentSubTab === 'COD' && (
              <div className="space-y-6">
                <div className="bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <Banknote className="w-6 h-6 text-[var(--brand-gold)]" />
                    <div>
                      <h2 className="font-serif-luxury text-base font-bold text-slate-100">
                        Cash on Delivery (COD) Rules & Safeguards
                      </h2>
                      <p className="text-xs text-slate-300">
                        Configure strict limits, regional restrictions, and handling fees for COD transactions.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Enable COD Master Toggle */}
                    <div className="bg-[var(--brand-primary-deep)] p-5 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-bold text-sm text-slate-100 block">
                            Master COD Status
                          </label>
                          <p className="text-slate-400 text-[11px]">
                            Enable or disable Cash on Delivery across the store.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={codRules.enabled}
                            onChange={(e) => updateCodRules({ enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Restrict to India */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <label className="font-bold text-slate-200 block">Restrict COD to India Only</label>
                          <p className="text-slate-400 text-[11px]">
                            All international orders default to Prepaid Only.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={codRules.restrictToIndia}
                            onChange={(e) => updateCodRules({ restrictToIndia: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Order Amount Thresholds */}
                    <div className="bg-[var(--brand-primary-deep)] p-5 rounded-2xl border border-white/10 space-y-4">
                      <h3 className="font-bold text-slate-200 text-sm border-b border-white/10 pb-2">
                        Order Amount Limits (INR ₹)
                      </h3>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Minimum Order Amount for COD (₹)
                        </label>
                        <input
                          type="number"
                          value={codRules.minOrderAmountINR}
                          onChange={(e) =>
                            updateCodRules({ minOrderAmountINR: Number(e.target.value) })
                          }
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-slate-100 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Maximum Order Amount for COD (₹)
                        </label>
                        <input
                          type="number"
                          value={codRules.maxOrderAmountINR}
                          onChange={(e) =>
                            updateCodRules({ maxOrderAmountINR: Number(e.target.value) })
                          }
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-slate-100 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Optional COD Handling Charge (₹)
                        </label>
                        <input
                          type="number"
                          value={codRules.codFeeINR}
                          onChange={(e) => updateCodRules({ codFeeINR: Number(e.target.value) })}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-3 text-slate-100 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 4: PRIORITY */}
            {paymentSubTab === 'PRIORITY' && (
              <div className="space-y-6">
                <div className="bg-[var(--brand-primary-dark)] p-6 rounded-2xl border border-white/10 space-y-4">
                  <div>
                    <h2 className="font-serif-luxury text-base font-bold text-slate-100">
                      Payment Gateway Display Priority Order
                    </h2>
                    <p className="text-xs text-slate-300">
                      Reorder payment gateways. Gateways near the top will be presented first to customers during checkout.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {paymentGateways.map((gw, idx) => (
                      <div
                        key={gw.id}
                        draggable
                        onDragStart={() => setDraggedGatewayIdx(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedGatewayIdx !== null && draggedGatewayIdx !== idx) {
                            const newList = [...paymentGateways];
                            const [moved] = newList.splice(draggedGatewayIdx, 1);
                            newList.splice(idx, 0, moved);
                            reorderPaymentGateways(newList);
                            setDraggedGatewayIdx(null);
                            showToast(`Reordered ${gw.name} priority to position #${idx + 1}`);
                          }
                        }}
                        className={`bg-[var(--brand-primary-deep)] p-4 rounded-xl border flex items-center justify-between gap-4 cursor-move transition-all ${
                          draggedGatewayIdx === idx
                            ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 ring-2 ring-[var(--brand-gold)]/30 scale-[0.99]'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-white/10 text-slate-200 font-mono font-bold text-xs flex items-center justify-center border border-white/10">
                            #{idx + 1}
                          </span>
                          <PaymentIcon gatewayId={gw.id} size="md" />
                          <div>
                            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                              <span>{gw.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono bg-black/30 px-1.5 py-0.5 rounded">
                                Drag to reorder
                              </span>
                            </span>
                            <span className="text-[11px] text-slate-400">{gw.description}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              const newList = [...paymentGateways];
                              const temp = newList[idx - 1];
                              newList[idx - 1] = newList[idx];
                              newList[idx] = temp;
                              reorderPaymentGateways(newList);
                              showToast(`Moved ${gw.name} up in priority`);
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-200 transition-all"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            disabled={idx === paymentGateways.length - 1}
                            onClick={() => {
                              const newList = [...paymentGateways];
                              const temp = newList[idx + 1];
                              newList[idx + 1] = newList[idx];
                              newList[idx] = temp;
                              reorderPaymentGateways(newList);
                              showToast(`Moved ${gw.name} down in priority`);
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-200 transition-all"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 5: LOGS */}
            {paymentSubTab === 'LOGS' && (
              <div className="space-y-6">
                {/* Stats Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[var(--brand-primary-dark)] p-4 rounded-2xl border border-white/10">
                    <span className="text-xs text-slate-400 font-bold block">Total Transactions</span>
                    <span className="text-2xl font-extrabold text-slate-100 font-mono">
                      {paymentLogs.length}
                    </span>
                  </div>
                  <div className="bg-[var(--brand-primary-dark)] p-4 rounded-2xl border border-white/10">
                    <span className="text-xs text-slate-400 font-bold block">Successful Paid</span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                      {paymentLogs.filter((l) => l.status === 'SUCCESSFUL').length}
                    </span>
                  </div>
                  <div className="bg-[var(--brand-primary-dark)] p-4 rounded-2xl border border-white/10">
                    <span className="text-xs text-slate-400 font-bold block">Pending COD</span>
                    <span className="text-2xl font-extrabold text-amber-400 font-mono">
                      {paymentLogs.filter((l) => l.status === 'PENDING').length}
                    </span>
                  </div>
                  <div className="bg-[var(--brand-primary-dark)] p-4 rounded-2xl border border-white/10">
                    <span className="text-xs text-slate-400 font-bold block">Refunded Volume</span>
                    <span className="text-2xl font-extrabold text-purple-400 font-mono">
                      {paymentLogs.filter((l) => l.status === 'REFUNDED').length}
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-[var(--brand-primary-dark)] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search order #, customer, txn ID..."
                      value={paymentLogSearch}
                      onChange={(e) => setPaymentLogSearch(e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    {['ALL', 'SUCCESSFUL', 'PENDING', 'FAILED', 'REFUNDED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setPaymentLogStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          paymentLogStatusFilter === st
                            ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-deep)]'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logs Table */}
                <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-200">
                      <thead className="bg-[var(--brand-primary-deep)] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Txn & Order #</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Gateway</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Date & Time</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-sans">
                        {paymentLogs
                          .filter((l) => {
                            if (paymentLogStatusFilter !== 'ALL' && l.status !== paymentLogStatusFilter) {
                              return false;
                            }
                            if (paymentLogSearch.trim()) {
                              const q = paymentLogSearch.toLowerCase();
                              return (
                                l.orderNumber.toLowerCase().includes(q) ||
                                l.customerName.toLowerCase().includes(q) ||
                                l.customerEmail.toLowerCase().includes(q) ||
                                l.transactionId.toLowerCase().includes(q)
                              );
                            }
                            return true;
                          })
                          .map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-all">
                              <td className="p-3.5 font-mono">
                                <span className="font-bold text-slate-100 block">{log.orderNumber}</span>
                                <span className="text-[10px] text-slate-400">{log.transactionId}</span>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-slate-200 block">{log.customerName}</span>
                                <span className="text-[10px] text-slate-400">{log.customerEmail}</span>
                              </td>
                              <td className="p-3.5">
                                <PaymentIcon gatewayId={log.gateway} size="sm" />
                              </td>
                              <td className="p-3.5 font-mono">
                                <span className="font-bold text-emerald-300 block">
                                  {log.currency} {log.amount.toLocaleString()}
                                </span>
                                {log.currency !== 'INR' && (
                                  <span className="text-[10px] text-slate-400">
                                    ₹{log.amountINR.toLocaleString()} INR
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                    log.status === 'SUCCESSFUL'
                                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                      : log.status === 'PENDING'
                                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                      : log.status === 'REFUNDED'
                                      ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                                      : 'bg-red-950/80 text-red-300 border-red-500/40'
                                  }`}
                                >
                                  {log.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                                {log.createdAt}
                              </td>
                              <td className="p-3.5 text-right">
                                {log.status === 'SUCCESSFUL' ? (
                                  <button
                                    onClick={() => {
                                      setRefundingLog(log);
                                      setRefundAmountInput(log.amountINR);
                                      setIsRefundModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs transition-all"
                                  >
                                    Refund
                                  </button>
                                ) : log.status === 'REFUNDED' ? (
                                  <span className="text-[10px] font-mono text-purple-300 font-bold">
                                    Refunded (ID: {log.refundId})
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-xs">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Refund Modal */}
            {isRefundModalOpen && refundingLog && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-[var(--brand-primary-dark)] border border-purple-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 text-xs text-slate-100 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-serif-luxury text-base font-bold text-purple-200 flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-purple-400" />
                      Issue Order Refund
                    </h3>
                    <button
                      onClick={() => setIsRefundModalOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order Number:</span>
                      <span className="font-bold text-slate-100">{refundingLog.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer:</span>
                      <span className="text-slate-200">{refundingLog.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Paid Amount:</span>
                      <span className="font-bold text-emerald-400">
                        {refundingLog.currency} {refundingLog.amount.toLocaleString()} (₹
                        {refundingLog.amountINR.toLocaleString()} INR)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Refund Amount (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={refundAmountInput}
                      onChange={(e) => setRefundAmountInput(Number(e.target.value))}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 rounded-xl p-3 text-slate-100 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Reason for Refund
                    </label>
                    <textarea
                      value={refundReasonInput}
                      onChange={(e) => setRefundReasonInput(e.target.value)}
                      rows={3}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 rounded-xl p-3 text-slate-100"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsRefundModalOpen(false)}
                      className="w-1/2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        refundPaymentLog(refundingLog.id, refundAmountInput, refundReasonInput);
                        setIsRefundModalOpen(false);
                        showToast(
                          `Refund of ₹${refundAmountInput} for Order ${refundingLog.orderNumber} completed!`
                        );
                      }}
                      className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow-lg"
                    >
                      Process Refund
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 13: Shipping */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Shipping & Delivery Configuration</h1>
              <p className="text-xs text-slate-300">Set free shipping threshold and express courier delivery partners.</p>
            </div>

            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Free Express Shipping Threshold (INR)</label>
                <input
                  type="number"
                  value={siteSettings.freeShippingThresholdINR}
                  onChange={(e) => updateSiteSettings({ freeShippingThresholdINR: Number(e.target.value) })}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Express Courier Partner Name</label>
                <input
                  type="text"
                  value={siteSettings.expressCourierPartner}
                  onChange={(e) => updateSiteSettings({ expressCourierPartner: e.target.value })}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 14: Branding */}
        {activeTab === 'branding' && <AdminBrandManager showToast={showToast} />}

        {/* Tab 15: Contact Info */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Contact Information</h1>
              <p className="text-xs text-slate-300">Update official company address, phone, WhatsApp, and support email.</p>
            </div>

            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={siteSettings.companyName}
                  onChange={(e) => updateSiteSettings({ companyName: e.target.value })}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Official Address</label>
                <input
                  type="text"
                  value={siteSettings.address}
                  onChange={(e) => updateSiteSettings({ address: e.target.value })}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={siteSettings.phone}
                    onChange={(e) => updateSiteSettings({ phone: e.target.value })}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">WhatsApp Number (e.g. 917619536831)</label>
                  <input
                    type="text"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => updateSiteSettings({ whatsappNumber: e.target.value })}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={siteSettings.email}
                    onChange={(e) => updateSiteSettings({ email: e.target.value })}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Footer Configuration */}
        {activeTab === 'footer' && <AdminFooterManager showToast={showToast} />}

        {/* Tab 16: SEO Settings */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">SEO & Meta Tags</h1>
              <p className="text-xs text-slate-300">Manage global search engine optimization settings.</p>
            </div>

            <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Title Tag</label>
                <input
                  type="text"
                  value={siteSettings.seoTitle}
                  onChange={(e) => updateSiteSettings({ seoTitle: e.target.value })}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={siteSettings.seoDescription}
                  onChange={(e) => updateSiteSettings({ seoDescription: e.target.value })}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  value={siteSettings.seoKeywords}
                  onChange={(e) => updateSiteSettings({ seoKeywords: e.target.value })}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 17: Master Security, Sound System & Password Change */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Master Settings & Sound System</h1>
              <p className="text-xs text-slate-300">Configure store acoustic system, master password, or reset store database state.</p>
            </div>

            {/* HAKKIVEDA Premium Website Sound System Control Panel */}
            <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 p-6 rounded-2xl space-y-6 text-xs max-w-2xl shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--brand-gold)]/20 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase flex items-center gap-2 tracking-wider">
                    <Volume2 className="w-5 h-5 text-[var(--brand-gold)]" />
                    <span>HAKKIVEDA Luxury Sound System Engine</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Low-latency Web Audio API synthesizer. Calibrated to 15-25% default volume for a high-end, calm luxury experience.
                  </p>
                </div>
                <button
                  onClick={() => setAdminMutedSound(!adminMutedSound)}
                  className={`px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all ${
                    adminMutedSound
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                      : 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                  }`}
                >
                  {adminMutedSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{adminMutedSound ? 'Admin Muted' : 'Sound Active'}</span>
                </button>
              </div>

              {/* Instant Sound Tester Grid */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider mb-3">
                  Test Audio Triggers (12 Event Types)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {[
                    { id: 'nav_click', label: '1. Nav Click (Wooden)' },
                    { id: 'cta_click', label: '2. CTA (Crystal)' },
                    { id: 'add_to_cart', label: '3. Cart (Chime)' },
                    { id: 'wishlist', label: '4. Wishlist (Sparkle)' },
                    { id: 'search', label: '5. Search (Soft Pop)' },
                    { id: 'country_select', label: '6. Country (Tick)' },
                    { id: 'menu_toggle', label: '7. Menu (Slide)' },
                    { id: 'toggle_switch', label: '8. Toggle (Click)' },
                    { id: 'form_submit', label: '9. Form (Tone)' },
                    { id: 'order_success', label: '10. Order (Success)' },
                    { id: 'error_warning', label: '11. Error (Warning)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => playSound(s.id as any)}
                      className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] text-slate-200 border border-white/10 p-2 rounded-lg text-[10px] font-semibold text-left transition-all active:scale-95 flex items-center justify-between"
                    >
                      <span className="truncate">{s.label}</span>
                      <Volume2 className="w-3 h-3 shrink-0 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Change Admin Password */}
            <form onSubmit={handlePasswordChange} className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/30 p-6 rounded-2xl space-y-4 text-xs max-w-lg">
              <h3 className="text-sm font-bold text-[var(--brand-gold)] uppercase flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>Update Master Admin Password</span>
              </h3>

              {passMsg && (
                <div className="p-3 bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] font-bold rounded-lg">
                  {passMsg}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg"
              >
                Hash & Update Password
              </button>
            </form>

            {/* Reset Database */}
            <div className="bg-rose-950/40 border border-rose-500/30 p-6 rounded-2xl space-y-3 text-xs max-w-lg">
              <h3 className="text-sm font-bold text-rose-300 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Reset Store Database</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Clears custom local storage states and restores initial seed configuration.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all store data to defaults?')) {
                    resetToDefaults();
                    showToast('Store reset to defaults');
                  }
                }}
                className="bg-rose-900 hover:bg-rose-800 text-rose-100 px-5 py-2.5 rounded-xl font-bold uppercase"
              >
                Reset Database
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Modal Popup */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onShowToast={showToast}
        />
      )}
    </div>
  );
};
