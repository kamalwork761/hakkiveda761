import React, { useState } from 'react';
import { AdminProductImageManager } from './AdminProductImageManager';
import {
  Lock,
  LayoutDashboard,
  Package,
  Layers,
  Sliders,
  ShoppingBag,
  Building2,
  Tag,
  DollarSign,
  Settings,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  Truck,
  Eye,
  AlertTriangle,
  Megaphone,
  Globe,
  Users,
  Video,
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
  X,
  CreditCard,
  MapPin,
  Key,
  Volume2,
  VolumeX,
  Trees,
  Upload,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderDetailsModal } from './OrderDetailsModal';
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
    countries,
    updateCountrySetting,
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
    toggleBlockCustomer,
    deleteCustomerAccount,
    exportCustomerData,
    updateAdminPassword,
    formatPrice,
    resetToDefaults,
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
    ambientEnabled,
    ambientVolume,
    ambientPreset,
    toggleAmbient,
    setAmbientVolume,
    setAmbientPreset,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'inventory'
    | 'categories'
    | 'announcement'
    | 'hero'
    | 'nav'
    | 'orders'
    | 'b2b'
    | 'customers'
    | 'coupons'
    | 'reviews'
    | 'before_after'
    | 'videos'
    | 'blogs'
    | 'quiz'
    | 'media'
    | 'currency'
    | 'payments'
    | 'shipping'
    | 'seo'
    | 'branding'
    | 'contact'
    | 'footer'
    | 'settings'
  >('overview');

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Success toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Image File Upload Helper (Preserves 100% original pixels, no AI alteration)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
        showToast('Original product image uploaded (100% pixels preserved)');
      }
    };
    reader.readAsDataURL(file);
  };

  // Forms states
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
    <div className="min-h-screen bg-[#072a20] text-slate-100 font-sans flex flex-col sm:flex-row">
      {/* Toast Popup */}
      {toastMsg && (
        <div className="fixed top-5 right-5 bg-[#C8A24A] text-[#0B3D2E] font-bold px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full sm:w-64 bg-[#0B3D2E] border-r border-[#C8A24A]/30 p-4 shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 border-2 border-[#C8A24A] flex items-center justify-center rotate-45 bg-[#072a20]">
                <span className="-rotate-45 font-bold font-brand text-[#C8A24A] text-xs">HV</span>
              </div>
              <div>
                <h2 className="text-sm font-bold font-brand tracking-widest text-[#C8A24A]">HAKKIVEDA</h2>
                <p className="text-[8px] uppercase tracking-wider text-slate-300">Admin Control Suite</p>
              </div>
            </div>
            <button
              onClick={onReturnToStoreFront}
              className="text-slate-400 hover:text-[#C8A24A] p-1"
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
                activeTab === 'overview' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[#C8A24A]/70 font-bold px-3">
              Catalog & Inventory
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'inventory' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Inventory & Stock SKU</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'categories' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[#C8A24A]/70 font-bold px-3">
              Website & Content
            </div>
            <button
              onClick={() => setActiveTab('announcement')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'announcement' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Announcement Bar</span>
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'hero' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Hero Slider</span>
            </button>
            <button
              onClick={() => setActiveTab('nav')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'nav' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Navigation Menu</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'reviews' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Reviews & Ratings</span>
            </button>
            <button
              onClick={() => setActiveTab('before_after')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'before_after' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Before & After Slider</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'videos' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Testimonials</span>
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'blogs' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Journal & Articles</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'quiz' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>AI Quiz Questions</span>
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'media' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Media Gallery</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[#C8A24A]/70 font-bold px-3">
              Sales & Customers
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Fulfillment ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('b2b')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'b2b' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>B2B Wholesale Enquiries ({b2bLeads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'customers' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Accounts ({customerAccounts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'coupons' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Coupons & Offers</span>
            </button>

            <div className="pt-3 pb-1 text-[9px] uppercase tracking-widest text-[#C8A24A]/70 font-bold px-3">
              Store Configuration
            </div>
            <button
              onClick={() => setActiveTab('currency')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'currency' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Currencies & Countries</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'payments' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Gateways</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'shipping' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Shipping Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'seo' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>SEO & Meta Tags</span>
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'branding' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Logo & Branding</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'contact' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Info</span>
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'footer' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Footer Configuration</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'settings' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-white/5'
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
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Store Command Dashboard</h1>
              <p className="text-xs text-slate-300">Live analytics and operational status of HAKKIVEDA.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-[#0B3D2E] border border-[#C8A24A]/30 p-5 rounded-2xl cursor-pointer hover:border-[#C8A24A] hover:bg-[#0e4837] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#C8A24A]/10 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-[#C8A24A] font-bold">
                      Total Orders
                    </div>
                    <ShoppingBag className="w-4 h-4 text-[#C8A24A] opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-3xl font-bold font-mono text-white mt-1">{orders.length}</div>
                </div>
                <div className="text-[10px] text-[#C8A24A] group-hover:underline font-bold mt-3 flex items-center justify-between">
                  <span>View All Orders</span>
                  <span>→</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('products')}
                className="bg-[#0B3D2E] border border-[#C8A24A]/30 p-5 rounded-2xl cursor-pointer hover:border-[#C8A24A] hover:bg-[#0e4837] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#C8A24A]/10 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-[#C8A24A] font-bold">
                      Active Products
                    </div>
                    <Package className="w-4 h-4 text-[#C8A24A] opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-3xl font-bold font-mono text-white mt-1">{products.length}</div>
                </div>
                <div className="text-[10px] text-[#C8A24A] group-hover:underline font-bold mt-3 flex items-center justify-between">
                  <span>Across {categories.length} categories</span>
                  <span>→</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('b2b')}
                className="bg-[#0B3D2E] border border-[#C8A24A]/30 p-5 rounded-2xl cursor-pointer hover:border-[#C8A24A] hover:bg-[#0e4837] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#C8A24A]/10 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-[#C8A24A] font-bold">
                      B2B Wholesale Enquiries
                    </div>
                    <Building2 className="w-4 h-4 text-[#C8A24A] opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-3xl font-bold font-mono text-white mt-1">{b2bLeads.length}</div>
                </div>
                <div className="text-[10px] text-[#C8A24A] group-hover:underline font-bold mt-3 flex items-center justify-between">
                  <span>View Global Enquiries</span>
                  <span>→</span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('customers')}
                className="bg-[#0B3D2E] border border-[#C8A24A]/30 p-5 rounded-2xl cursor-pointer hover:border-[#C8A24A] hover:bg-[#0e4837] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#C8A24A]/10 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-[#C8A24A] font-bold">
                      Registered Customers
                    </div>
                    <Users className="w-4 h-4 text-[#C8A24A] opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-3xl font-bold font-mono text-white mt-1">{customerAccounts.length}</div>
                </div>
                <div className="text-[10px] text-[#C8A24A] group-hover:underline font-bold mt-3 flex items-center justify-between">
                  <span>Customer Accounts</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#0B3D2E] border border-white/10 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif-luxury text-slate-100">Recent Customer Orders</h3>
                  <p className="text-[11px] text-slate-400">Click any row to open complete Order Details & Logistics Management</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#C8A24A] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-white/10 rounded-xl">
                  No customer orders received yet. Start with empty database state.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="text-[10px] uppercase tracking-wider text-[#C8A24A] border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((o) => (
                        <tr
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className="cursor-pointer hover:bg-white/10 transition-colors group"
                        >
                          <td className="py-3 px-3 font-mono font-bold text-[#C8A24A] group-hover:underline">{o.orderNumber}</td>
                          <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{o.date}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{o.customer.name}</span>
                            <span className="text-[10px] text-slate-400 block">{o.customer.email}</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">{formatPrice(o.totalAmountINR)}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.trackingStatus === 'DELIVERED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                              o.trackingStatus === 'CANCELLED' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                              'bg-amber-950 text-amber-300 border border-amber-500/30'
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
                              className="px-2.5 py-1 bg-[#C8A24A] text-[#0B3D2E] font-bold text-[10px] rounded-lg hover:bg-white transition-colors inline-flex items-center gap-1 shadow-sm"
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

        {/* Tab 2: Products Catalog */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Products Catalog</h1>
                <p className="text-xs text-slate-300">Add, edit, or delete Ayurvedic formulations.</p>
              </div>
              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingProduct ? 'Cancel' : 'Add New Product'}</span>
              </button>
            </div>

            {isAddingProduct && (
              <form onSubmit={handleProductSubmit} className="bg-[#0B3D2E] border border-[#C8A24A]/40 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-[#C8A24A] uppercase tracking-wider">New Product Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      placeholder="e.g. 42 Herbs Tribal Elixir Oil"
                      className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category *</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Price (INR) *</label>
                    <input
                      type="number"
                      required
                      value={prodForm.priceINR}
                      onChange={(e) => setProdForm({ ...prodForm, priceINR: Number(e.target.value) })}
                      className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={prodForm.stock}
                      onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                      className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">SKU Code *</label>
                    <input
                      type="text"
                      required
                      value={prodForm.sku}
                      onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                      className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-2">
                    <AdminProductImageManager
                      images={[prodForm.image, ...(prodForm.additionalImages || [])].filter(Boolean)}
                      onChange={(newImages) => {
                        setProdForm((prev) => ({
                          ...prev,
                          image: newImages[0] || '',
                          additionalImages: newImages.slice(1),
                        }));
                      }}
                      onShowToast={showToast}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#C8A24A] text-[#0B3D2E] px-6 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-white"
                >
                  Save Formulation
                </button>
              </form>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => {
                const gallery = [p.image, ...(p.additionalImages || [])].filter(Boolean);
                return (
                  <div key={p.id} className="bg-[#0B3D2E] border border-white/10 rounded-2xl p-4 flex gap-4 relative">
                    <div className="relative shrink-0">
                      <img src={p.image} alt={p.name} loading="lazy" className="w-20 h-20 object-contain rounded-xl bg-black/30 border border-white/10" />
                      {gallery.length > 1 && (
                        <span className="absolute -bottom-1 -right-1 bg-[#C8A24A] text-[#0B3D2E] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow border border-[#0B3D2E]">
                          {gallery.length} Photos
                        </span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{p.name}</h4>
                      <p className="text-[10px] text-[#C8A24A] uppercase font-semibold">{p.category}</p>
                      <p className="text-xs font-mono font-bold">{formatPrice(p.priceINR)}</p>
                      <div className="text-[10px] text-slate-400">SKU: {p.sku} • Stock: {p.stock}</div>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="text-[#C8A24A] hover:text-white text-[10px] font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Product / Gallery</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteProduct(p.id);
                            showToast('Product deleted');
                          }}
                          className="text-rose-400 hover:text-rose-300 text-[10px] font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#0B3D2E] border border-[#C8A24A] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-[#C8A24A] uppercase">Edit Product & Gallery Images</h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateProduct(editingProduct.id, editingProduct);
                      setEditingProduct(null);
                      showToast('Product updated successfully');
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Price (INR)</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.priceINR}
                          onChange={(e) => setEditingProduct({ ...editingProduct, priceINR: Number(e.target.value) })}
                          className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Stock</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                          className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <AdminProductImageManager
                        images={[editingProduct.image, ...(editingProduct.additionalImages || [])].filter(Boolean)}
                        onChange={(newImages) => {
                          setEditingProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  image: newImages[0] || '',
                                  additionalImages: newImages.slice(1),
                                }
                              : null
                          );
                        }}
                        onShowToast={showToast}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl bg-black/40 border border-white/20 text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#C8A24A] text-[#0B3D2E] font-bold uppercase"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Inventory & SKU */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Inventory & Stock SKU</h1>
              <p className="text-xs text-slate-300">Update stock counts, SKUs, and availability status.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 rounded-2xl overflow-x-auto p-4">
              <table className="w-full text-left text-xs font-sans">
                <thead className="text-[10px] uppercase text-[#C8A24A] border-b border-white/10">
                  <tr>
                    <th className="py-2 px-3">SKU</th>
                    <th className="py-2 px-3">Product Name</th>
                    <th className="py-2 px-3">Stock Units</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-3 font-mono text-[#C8A24A]">{p.sku}</td>
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
                          className="bg-[#C8A24A] text-[#0B3D2E] hover:bg-white px-2 py-1 rounded text-[10px] font-bold"
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
        )}

        {/* Tab 4: Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Category Management</h1>
              <p className="text-xs text-slate-300">Organize formulations into distinct categories.</p>
            </div>

            <form onSubmit={handleCategorySubmit} className="bg-[#0B3D2E] border border-white/10 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-[#C8A24A] uppercase">Add New Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Category Name"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="bg-[#072a20] border border-white/20 p-2 rounded-lg text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="bg-[#072a20] border border-white/20 p-2 rounded-lg text-slate-100"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-[#C8A24A] text-[#0B3D2E] p-2 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, (url) => setCatImg(url))}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or Image URL"
                    value={catImg}
                    onChange={(e) => setCatImg(e.target.value)}
                    className="w-full bg-[#072a20] border border-white/20 p-2 rounded-lg text-slate-100"
                  />
                </div>
              </div>
              <button type="submit" className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-2 rounded-lg font-bold text-xs">
                Add Category
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-[#0B3D2E] border border-white/10 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{c.name}</h4>
                    <p className="text-xs text-slate-400">{c.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteCategory(c.id);
                      showToast('Category deleted');
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

        {/* Tab 5: Announcement Bar */}
        {activeTab === 'announcement' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Announcement Bar Manager</h1>
              <p className="text-xs text-slate-300">Edit top announcement text, background color, and active state.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-6 rounded-2xl space-y-4 font-sans text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Announcement Text *</label>
                <input
                  type="text"
                  value={siteSettings.announcementText}
                  onChange={(e) => updateSiteSettings({ announcementText: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={siteSettings.announcementBgColor}
                    onChange={(e) => updateSiteSettings({ announcementBgColor: e.target.value })}
                    className="w-full h-10 bg-[#072a20] border border-white/20 rounded-xl cursor-pointer p-1"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={siteSettings.announcementTextColor}
                    onChange={(e) => updateSiteSettings({ announcementTextColor: e.target.value })}
                    className="w-full h-10 bg-[#072a20] border border-white/20 rounded-xl cursor-pointer p-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="ann-active"
                  checked={siteSettings.announcementActive}
                  onChange={(e) => updateSiteSettings({ announcementActive: e.target.checked })}
                  className="w-4 h-4 accent-[#C8A24A]"
                />
                <label htmlFor="ann-active" className="font-bold text-slate-200">
                  Show Announcement Bar on Header
                </label>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] uppercase text-[#C8A24A] font-bold mb-2">Live Bar Preview:</p>
                <div
                  style={{
                    backgroundColor: siteSettings.announcementBgColor,
                    color: siteSettings.announcementTextColor,
                  }}
                  className="p-3 text-center text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg"
                >
                  {siteSettings.announcementText}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Hero Slider */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Hero Slider Manager</h1>
              <p className="text-xs text-slate-300">Add or edit homepage hero banner slides and video backgrounds.</p>
            </div>

            <form onSubmit={handleHeroSubmit} className="bg-[#0B3D2E] border border-white/10 p-5 rounded-2xl space-y-3 text-xs">
              <h3 className="font-bold text-[#C8A24A] uppercase">Create New Banner Slide</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tagline e.g. ANCIENT HERBAL SECRET"
                  value={slideTag}
                  onChange={(e) => setSlideTag(e.target.value)}
                  className="bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Main Title"
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  className="bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Highlight Text"
                  value={slideHighlight}
                  onChange={(e) => setSlideHighlight(e.target.value)}
                  className="bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-[#C8A24A] text-[#0B3D2E] p-2.5 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner File</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleImageFileUpload(e, (url) => setSlideImg(url))}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or Image / Video URL"
                    value={slideImg}
                    onChange={(e) => setSlideImg(e.target.value)}
                    className="w-full bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                  />
                </div>
              </div>
              <button type="submit" className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-2 rounded-lg font-bold">
                Add Banner Slide
              </button>
            </form>

            <div className="space-y-4">
              {heroSlides.map((s) => (
                <div key={s.id} className="bg-[#0B3D2E] border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4">
                  <img src={s.image} alt={s.title} className="w-24 h-16 object-cover rounded-lg shrink-0" />
                  <div className="flex-1">
                    <span className="text-[9px] text-[#C8A24A] font-bold uppercase">{s.tag}</span>
                    <h4 className="text-sm font-bold text-slate-100">{s.title}</h4>
                    <p className="text-xs text-slate-300">{s.subtitle}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteHeroSlide(s.id);
                      showToast('Slide deleted');
                    }}
                    className="text-rose-400 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Navigation Menu */}
        {activeTab === 'nav' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Navigation Menu Manager</h1>
              <p className="text-xs text-slate-300">Customize header menu items and links.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-5 rounded-2xl space-y-3">
              {navLinks.map((nav) => (
                <div key={nav.id} className="flex items-center justify-between p-3 bg-[#072a20] rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-slate-100">{nav.label}</span>
                    <span className="text-slate-400 ml-3 font-mono">{nav.url}</span>
                  </div>
                  <button
                    onClick={() => {
                      deleteNavLink(nav.id);
                      showToast('Nav link deleted');
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Orders & Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Orders & Express Shipping</h1>
              <p className="text-xs text-slate-300">View orders, assign tracking numbers, and update delivery status.</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                No orders received yet. Start with empty database state.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-[#0B3D2E] border border-white/10 p-5 rounded-2xl space-y-3 text-xs">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-base font-bold text-[#C8A24A]">{o.orderNumber}</span>
                        <span className="text-slate-400 ml-3">Date: {o.date}</span>
                      </div>
                      <div className="font-mono font-bold text-sm text-white">{formatPrice(o.totalAmountINR)}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                      <div>
                        <span className="text-[#C8A24A] font-bold">Customer:</span> {o.customer.name} ({o.customer.email})
                      </div>
                      <div>
                        <span className="text-[#C8A24A] font-bold">Shipping Address:</span> {o.customer.address}, {o.customer.city}, {o.customer.country}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-200">Tracking Status:</span>
                        <select
                          value={o.trackingStatus}
                          onChange={(e) => {
                            updateOrderStatus(o.id, e.target.value as any);
                            showToast('Order status updated');
                          }}
                          className="bg-[#072a20] border border-white/20 p-2 rounded-lg text-slate-100 text-xs font-bold"
                        >
                          <option value="ORDER_PLACED">ORDER_PLACED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="IN_TRANSIT">IN_TRANSIT</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3.5 py-1.5 bg-[#C8A24A] text-[#0B3D2E] font-bold text-xs rounded-xl hover:bg-white transition-colors inline-flex items-center gap-1.5 shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage Complete Order Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 9: B2B Wholesale */}
        {activeTab === 'b2b' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">B2B Wholesale Enquiries</h1>
              <p className="text-xs text-slate-300">Manage global export requests and wholesale leads.</p>
            </div>

            {b2bLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                No B2B leads submitted yet. Start with empty database state.
              </div>
            ) : (
              <div className="space-y-4">
                {b2bLeads.map((lead) => (
                  <div key={lead.id} className="bg-[#0B3D2E] border border-white/10 p-5 rounded-2xl space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <h4 className="font-bold text-sm text-[#C8A24A]">{lead.companyName}</h4>
                      <span className="text-slate-400 font-mono text-[10px]">{lead.createdAt}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                      <div>Contact: {lead.contactName} ({lead.email})</div>
                      <div>Phone: {lead.phone} | Country: {lead.country}</div>
                      <div>Estimated Volume: {lead.estimatedVolume}</div>
                    </div>
                    <p className="p-3 bg-[#072a20] rounded-xl text-slate-200 italic">{lead.message}</p>
                    <div className="flex items-center justify-between pt-2">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          updateB2BLeadStatus(lead.id, e.target.value as any);
                          showToast('Lead status updated');
                        }}
                        className="bg-[#072a20] border border-white/20 p-2 rounded-lg text-slate-100 text-xs font-bold"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                      <button
                        onClick={() => {
                          deleteB2BLead(lead.id);
                          showToast('Lead deleted');
                        }}
                        className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Lead</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-all shadow-lg shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export All Customers (CSV)</span>
              </button>
            </div>

            {/* Customer Search & Filter Bar */}
            <div className="bg-[#0B3D2E] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A24A]" />
                <input
                  type="text"
                  placeholder="Search name, email, phone, city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-[#072a20] border border-white/20 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#C8A24A]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto">
                <span className="text-slate-400">Status Filter:</span>
                <select
                  value={customerStatusFilter}
                  onChange={(e) => setCustomerStatusFilter(e.target.value as any)}
                  className="bg-[#072a20] border border-white/20 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-[#C8A24A]"
                >
                  <option value="ALL">All Statuses ({customerAccounts.length})</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="BLOCKED">Blocked Only</option>
                </select>
              </div>
            </div>

            {/* Customers Table / List */}
            {filteredCustomers.length === 0 ? (
              <div className="bg-[#0B3D2E] border border-white/10 p-12 text-center rounded-2xl space-y-2">
                <Users className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-slate-300 font-serif-luxury text-sm">No customers matched your filter query.</p>
              </div>
            ) : (
              <div className="bg-[#0B3D2E] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-200">
                    <thead className="bg-[#072a20] text-[#C8A24A] font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
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
                          <tr key={cust.id} className="hover:bg-[#072a20]/60 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {cust.avatar ? (
                                  <img
                                    src={cust.avatar}
                                    alt={cust.name}
                                    className="w-10 h-10 rounded-full object-cover border border-[#C8A24A]"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-[#C8A24A] text-[#0B3D2E] font-bold flex items-center justify-center font-serif-luxury">
                                    {cust.name[0]?.toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-white text-sm block">{cust.name}</span>
                                  <span className="text-[10px] font-mono text-[#C8A24A]">{cust.id}</span>
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
                              <div className="text-[10px] text-[#C8A24A] font-bold">
                                {cust.loyaltyPoints || 100} Hakki-Points
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="font-bold text-white">{formatPrice(totalSpent)}</div>
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
                                  className="bg-[#C8A24A] text-[#0B3D2E] px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-white transition-all shadow-sm"
                                >
                                  Inspect Profile
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
                <div className="relative w-full max-w-2xl bg-[#072a20] border border-[#C8A24A]/50 rounded-2xl shadow-2xl p-6 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto font-sans">
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
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#C8A24A]"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#C8A24A] text-[#0B3D2E] font-bold text-2xl font-serif-luxury flex items-center justify-center">
                        {selectedCustomerDossier.name[0]?.toUpperCase()}
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A24A] block">
                        Customer Account Dossier
                      </span>
                      <h3 className="text-xl font-bold font-serif-luxury text-white">{selectedCustomerDossier.name}</h3>
                      <p className="text-xs text-slate-300">{selectedCustomerDossier.email} • {selectedCustomerDossier.phone || 'No phone'}</p>
                    </div>
                  </div>

                  {/* Dossier Quick Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-[#0B3D2E] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Status</span>
                      <span className="font-bold text-[#C8A24A]">{selectedCustomerDossier.status || 'ACTIVE'}</span>
                    </div>
                    <div className="bg-[#0B3D2E] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Joined Date</span>
                      <span className="font-bold text-white">{selectedCustomerDossier.createdAt || '2026'}</span>
                    </div>
                    <div className="bg-[#0B3D2E] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Reward Points</span>
                      <span className="font-bold text-[#C8A24A]">{selectedCustomerDossier.loyaltyPoints || 100} Points</span>
                    </div>
                    <div className="bg-[#0B3D2E] p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Saved Addresses</span>
                      <span className="font-bold text-white">{selectedCustomerDossier.addresses?.length || 0}</span>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-[#C8A24A] uppercase tracking-wider text-[11px]">Saved Shipping Addresses</h4>
                    {selectedCustomerDossier.addresses?.length === 0 ? (
                      <p className="text-slate-400">No saved addresses for this customer.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCustomerDossier.addresses.map((a) => (
                          <div key={a.id} className="bg-[#0B3D2E] p-3 rounded-xl border border-white/10 text-[11px]">
                            <div className="font-bold text-white">{a.title} ({a.name})</div>
                            <div className="text-slate-300">{a.line1}, {a.city}, {a.state} - {a.pincode}, {a.country}</div>
                            <div className="text-[#C8A24A]">Phone: {a.phone}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Login Activity Logs */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-[#C8A24A] uppercase tracking-wider text-[11px]">Login Activity Telemetry</h4>
                    <div className="bg-[#0B3D2E] p-3 rounded-xl border border-white/10 space-y-2">
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
                          <span className="text-[10px] text-[#C8A24A]">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Dossier Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => exportCustomerData(selectedCustomerDossier.id)}
                      className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white"
                    >
                      Export JSON Dossier
                    </button>
                    <button
                      onClick={() => setSelectedCustomerDossier(null)}
                      className="bg-[#0B3D2E] text-slate-300 border border-white/20 px-4 py-2 rounded-xl font-bold text-xs"
                    >
                      Close Dossier
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
              <label className="cursor-pointer bg-[#C8A24A] text-[#0B3D2E] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg">
                <Upload className="w-4 h-4" />
                <span>Upload Original Media File</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []) as File[];
                    files.forEach((file: File) => {
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
                    });
                    showToast('Media files uploaded (Original pixels preserved)');
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Area Dropzone */}
            <div className="bg-[#0B3D2E] border-2 border-dashed border-[#C8A24A]/40 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#C8A24A]/10 text-[#C8A24A] flex items-center justify-center mx-auto">
                <Image className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Upload High-Resolution Product Photos</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Select JPEG, PNG, WebP or GIF photos. The exact uploaded image file will be stored separately and displayed across all store views without AI modification.
              </p>
              <label className="inline-flex cursor-pointer bg-[#072a20] border border-white/20 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:border-[#C8A24A] transition-all">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []) as File[];
                    files.forEach((file: File) => {
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
                    });
                    showToast('Media uploaded');
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaItems.map((m) => (
                <div key={m.id} className="bg-[#0B3D2E] border border-white/10 rounded-xl overflow-hidden group hover:border-[#C8A24A] transition-all flex flex-col justify-between">
                  <div className="h-36 bg-black/40 relative flex items-center justify-center p-2">
                    <img src={m.url} alt={m.title} className="max-h-full max-w-full object-contain" />
                    <span className="absolute top-2 left-2 bg-black/60 text-[#C8A24A] text-[9px] font-mono px-1.5 py-0.5 rounded uppercase">
                      Original
                    </span>
                  </div>
                  <div className="p-3 space-y-2 bg-[#072a20]">
                    <p className="text-xs font-bold text-slate-200 truncate">{m.title}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(m.url);
                          showToast('Image URL copied to clipboard');
                        }}
                        className="flex-1 bg-white/10 hover:bg-[#C8A24A] hover:text-[#0B3D2E] text-slate-200 text-[10px] py-1 rounded font-bold transition-all"
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

            <form onSubmit={handleCouponSubmit} className="bg-[#0B3D2E] border border-white/10 p-5 rounded-2xl space-y-3 text-xs">
              <h3 className="font-bold text-[#C8A24A] uppercase">Create New Coupon</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Coupon Code e.g. TRIBAL15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value as any)}
                  className="bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100 font-bold"
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
                  className="bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
                <input
                  type="number"
                  required
                  placeholder="Min Order INR"
                  value={couponMinINR}
                  onChange={(e) => setCouponMinINR(Number(e.target.value))}
                  className="bg-[#072a20] border border-white/20 p-2.5 rounded-lg text-slate-100"
                />
              </div>
              <button type="submit" className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-2 rounded-lg font-bold">
                Add Coupon Code
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="bg-[#0B3D2E] border border-white/10 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-mono text-base font-bold text-[#C8A24A]">{c.code}</h4>
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
        {activeTab === 'currency' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Currencies & Global Shipping Countries</h1>
              <p className="text-xs text-slate-300">Adjust exchange rates and enabled country targets.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-[#C8A24A] uppercase">Exchange Rates to Base INR (₹)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                {currencies.map((curr) => (
                  <div key={curr.code} className="p-3 bg-[#072a20] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-100">{curr.flag} {curr.country}</span>
                      <p className="text-[10px] text-slate-400">{curr.code} ({curr.symbol})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[10px]">1 {curr.code} =</span>
                      <input
                        type="number"
                        step="0.01"
                        value={curr.rateToINR}
                        onChange={(e) => updateCurrencyRate(curr.code, Number(e.target.value))}
                        className="w-20 bg-[#0B3D2E] border border-white/20 p-1.5 rounded text-slate-100 font-mono text-xs"
                      />
                      <span className="text-slate-400 text-[10px]">INR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 12: Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Payment Gateway Settings</h1>
              <p className="text-xs text-slate-300">Configure Razorpay key IDs, Cash on Delivery rules, and International payment settings.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-6 rounded-2xl space-y-5 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Razorpay Live API Key ID</label>
                <input
                  type="text"
                  value={siteSettings.razorpayKeyId}
                  onChange={(e) => updateSiteSettings({ razorpayKeyId: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="cod-enabled"
                  checked={siteSettings.codEnabled}
                  onChange={(e) => updateSiteSettings({ codEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#C8A24A]"
                />
                <label htmlFor="cod-enabled" className="font-bold text-slate-200">
                  Enable Cash on Delivery (COD) for Domestic India Orders
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 13: Shipping */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Shipping & Delivery Configuration</h1>
              <p className="text-xs text-slate-300">Set free shipping threshold and express courier delivery partners.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-6 rounded-2xl space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Free Express Shipping Threshold (INR)</label>
                <input
                  type="number"
                  value={siteSettings.freeShippingThresholdINR}
                  onChange={(e) => updateSiteSettings({ freeShippingThresholdINR: Number(e.target.value) })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Express Courier Partner Name</label>
                <input
                  type="text"
                  value={siteSettings.expressCourierPartner}
                  onChange={(e) => updateSiteSettings({ expressCourierPartner: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 14: Branding */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Logo & Brand Identity</h1>
              <p className="text-xs text-slate-300">Update store name, tagline, and brand initials.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-6 rounded-2xl space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={siteSettings.logoText}
                  onChange={(e) => updateSiteSettings({ logoText: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Subtitle / Tagline *</label>
                <input
                  type="text"
                  value={siteSettings.logoSubtext}
                  onChange={(e) => updateSiteSettings({ logoSubtext: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Emblem Initials (e.g. HV)</label>
                <input
                  type="text"
                  value={siteSettings.logoInitials}
                  onChange={(e) => updateSiteSettings({ logoInitials: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 15: Contact Info */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">Contact Information</h1>
              <p className="text-xs text-slate-300">Update official company address, phone, WhatsApp, and support email.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-6 rounded-2xl space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={siteSettings.companyName}
                  onChange={(e) => updateSiteSettings({ companyName: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Official Address</label>
                <input
                  type="text"
                  value={siteSettings.address}
                  onChange={(e) => updateSiteSettings({ address: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={siteSettings.phone}
                    onChange={(e) => updateSiteSettings({ phone: e.target.value })}
                    className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">WhatsApp Number (e.g. 917619536831)</label>
                  <input
                    type="text"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => updateSiteSettings({ whatsappNumber: e.target.value })}
                    className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={siteSettings.email}
                    onChange={(e) => updateSiteSettings({ email: e.target.value })}
                    className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 16: SEO Settings */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-bold font-serif-luxury text-slate-100">SEO & Meta Tags</h1>
              <p className="text-xs text-slate-300">Manage global search engine optimization settings.</p>
            </div>

            <div className="bg-[#0B3D2E] border border-white/10 p-6 rounded-2xl space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Title Tag</label>
                <input
                  type="text"
                  value={siteSettings.seoTitle}
                  onChange={(e) => updateSiteSettings({ seoTitle: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={siteSettings.seoDescription}
                  onChange={(e) => updateSiteSettings({ seoDescription: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  value={siteSettings.seoKeywords}
                  onChange={(e) => updateSiteSettings({ seoKeywords: e.target.value })}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
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
            <div className="bg-[#0B3D2E] border border-[#C8A24A]/40 p-6 rounded-2xl space-y-6 text-xs max-w-2xl shadow-xl">
              <div className="flex items-center justify-between border-b border-[#C8A24A]/20 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#C8A24A] uppercase flex items-center gap-2 tracking-wider">
                    <Volume2 className="w-5 h-5 text-[#C8A24A]" />
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
                      : 'bg-[#C8A24A] text-[#0B3D2E]'
                  }`}
                >
                  {adminMutedSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{adminMutedSound ? 'Admin Muted' : 'Sound Active'}</span>
                </button>
              </div>

              {/* Continuous Nature & Forest Music Ambient Panel */}
              <div className="bg-[#072a20] border border-[#C8A24A]/30 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trees className="w-5 h-5 text-[#C8A24A]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#C8A24A]">Continuous Nature Ambience (Forest, River, Ayurvedic Drone)</h4>
                      <p className="text-[11px] text-slate-300">Continuous background audio loop synthesized with Web Audio API.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAmbient()}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                      ambientEnabled && !adminMutedSound
                        ? 'bg-[#C8A24A] text-[#0B3D2E] shadow-lg'
                        : 'bg-black/40 border border-white/20 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ambientEnabled && !adminMutedSound ? '🌲 Nature Ambience ON' : 'Nature Ambience OFF'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-200 block text-[11px]">Nature Preset Profile</label>
                    <select
                      value={ambientPreset}
                      onChange={(e) => setAmbientPreset(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/20 p-2 rounded-xl text-slate-100 font-semibold focus:border-[#C8A24A] outline-none text-xs"
                    >
                      <option value="nilgiri_forest">🌲 Nilgiri Forest & Stream (Water + Drone + Birds)</option>
                      <option value="ayurvedic_garden">🍃 Ayurvedic Herbal Garden (Bamboo Wind + Drone)</option>
                      <option value="monsoon_rain">🌧️ Western Ghats Monsoon (Rain + Bell Chimes)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-200">
                      <span>Background Volume ({Math.round(ambientVolume * 100)}%)</span>
                      <span className="text-[#C8A24A] font-mono">Default: 15%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.4"
                      step="0.01"
                      value={ambientVolume}
                      onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                      className="w-full accent-[#C8A24A] bg-black/40 h-2 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Instant Sound Tester Grid */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold text-[#C8A24A] uppercase tracking-wider mb-3">
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
                      className="bg-[#072a20] hover:bg-[#C8A24A] hover:text-[#0B3D2E] text-slate-200 border border-white/10 p-2 rounded-lg text-[10px] font-semibold text-left transition-all active:scale-95 flex items-center justify-between"
                    >
                      <span className="truncate">{s.label}</span>
                      <Volume2 className="w-3 h-3 shrink-0 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Change Admin Password */}
            <form onSubmit={handlePasswordChange} className="bg-[#0B3D2E] border border-[#C8A24A]/30 p-6 rounded-2xl space-y-4 text-xs max-w-lg">
              <h3 className="text-sm font-bold text-[#C8A24A] uppercase flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>Update Master Admin Password</span>
              </h3>

              {passMsg && (
                <div className="p-3 bg-[#072a20] border border-[#C8A24A]/40 text-[#C8A24A] font-bold rounded-lg">
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
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-[#072a20] border border-white/20 p-3 rounded-xl text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="bg-[#C8A24A] text-[#0B3D2E] px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg"
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
