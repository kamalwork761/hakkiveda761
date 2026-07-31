import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Heart,
  Package,
  MapPin,
  CreditCard,
  Sliders,
  Gift,
  HelpCircle,
  Settings,
  LogOut,
  X,
  CheckCircle2,
  Truck,
  Clock,
  ShieldCheck,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SavedAddress, Order, Product } from '../types/store';

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    customerAccounts,
    loginUser,
    registerUser,
    guestLogin,
    logoutUser,
    updateUserProfile,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    exportCustomerData,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    orders,
    coupons,
    applyCoupon,
    formatPrice,
    setIsCartOpen,
    setIsQuizOpen,
    playSound,
  } = useStore();

  // Auth Forms State
  const [authTab, setAuthTab] = useState<'SIGN_IN' | 'CREATE_ACCOUNT' | 'FORGOT_PASSWORD'>('SIGN_IN');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Policy Modal state
  const [policyModal, setPolicyModal] = useState<'PRIVACY' | 'TERMS' | null>(null);

  // Dashboard Active Section
  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'preferences' | 'rewards' | 'support' | 'settings'
  >('profile');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrCountry, setAddrCountry] = useState('India');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Track Order Modal State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isFetchingTracking, setIsFetchingTracking] = useState(false);
  const [liveTrackingData, setLiveTrackingData] = useState<any>(null);

  useEffect(() => {
    if (trackingOrder) {
      const identifier = trackingOrder.awbCode || trackingOrder.trackingNumber || trackingOrder.shipmentId || trackingOrder.orderNumber;
      setIsFetchingTracking(true);
      fetch(`/api/shiprocket/track/${identifier}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLiveTrackingData(data);
          }
        })
        .catch((err) => console.warn('Could not fetch tracking:', err))
        .finally(() => setIsFetchingTracking(false));
    } else {
      setLiveTrackingData(null);
    }
  }, [trackingOrder]);

  // Return Request Modal State
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Defective product / Leaking bottle');
  const [returnComments, setReturnComments] = useState('');
  const [returnSuccessMsg, setReturnSuccessMsg] = useState('');

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // Dashboard Navigation scroll & fade indicators state
  const navContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateNavScrollFades = () => {
    if (!navContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navContainerRef.current;
    setShowLeftFade(scrollLeft > 5);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    updateNavScrollFades();
    window.addEventListener('resize', updateNavScrollFades);
    return () => window.removeEventListener('resize', updateNavScrollFades);
  }, []);

  // Auto-scroll active tab into view when activeTab or portal visibility changes
  useEffect(() => {
    if (navContainerRef.current) {
      const activeEl = navContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
      const timer = setTimeout(updateNavScrollFades, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isAuthModalOpen]);

  const scrollNav = (direction: 'left' | 'right') => {
    if (!navContainerRef.current) return;
    const scrollAmount = 220;
    navContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Sync profile state when editing
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || '');
      setEditAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  // Esc key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (trackingOrder) setTrackingOrder(null);
        else if (returnOrder) setReturnOrder(null);
        else if (isAddressModalOpen) setIsAddressModalOpen(false);
        else if (isAuthModalOpen) setIsAuthModalOpen(false);
        else if (isWishlistOpen) setIsWishlistOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trackingOrder, returnOrder, isAddressModalOpen, isAuthModalOpen, isWishlistOpen]);

  // Auth Handlers
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const res = loginUser(signInEmail, signInPassword);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      setAuthSuccess(res.message);
      setSignInEmail('');
      setSignInPassword('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!regName || !regEmail) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match. Please verify your entries.');
      return;
    }
    const res = registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });
    if (!res.success) {
      setAuthError(res.message);
    } else {
      setAuthSuccess(res.message);
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('form_submit');
    setAuthError('');
    if (!signInEmail) {
      setAuthError('Please enter your registered email address.');
      return;
    }
    setAuthSuccess(`A password reset link has been dispatched to ${signInEmail}. Please check your inbox.`);
  };

  const handleQuickLogin = (email: string) => {
    playSound('cta_click');
    setSignInEmail(email);
    loginUser(email);
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone,
      avatar: editAvatar,
    });
    setIsEditingProfile(false);
  };

  // Address Modal open for Add/Edit
  const openAddressModal = (address?: SavedAddress) => {
    playSound('nav_click');
    if (address) {
      setEditingAddressId(address.id);
      setAddrTitle(address.title);
      setAddrName(address.name);
      setAddrPhone(address.phone);
      setAddrLine1(address.line1);
      setAddrCity(address.city);
      setAddrState(address.state);
      setAddrCountry(address.country);
      setAddrPincode(address.pincode);
      setAddrIsDefault(address.isDefault);
    } else {
      setEditingAddressId(null);
      setAddrTitle('Home');
      setAddrName(currentUser?.name || '');
      setAddrPhone(currentUser?.phone || '');
      setAddrLine1('');
      setAddrCity('');
      setAddrState('');
      setAddrCountry(currentUser?.preferences?.country || 'India');
      setAddrPincode('');
      setAddrIsDefault(currentUser?.addresses.length === 0);
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateSavedAddress(editingAddressId, {
        title: addrTitle,
        name: addrName,
        phone: addrPhone,
        line1: addrLine1,
        city: addrCity,
        state: addrState,
        country: addrCountry,
        pincode: addrPincode,
        isDefault: addrIsDefault,
      });
    } else {
      addSavedAddress({
        title: addrTitle,
        name: addrName,
        phone: addrPhone,
        line1: addrLine1,
        city: addrCity,
        state: addrState,
        country: addrCountry,
        pincode: addrPincode,
        isDefault: addrIsDefault,
      });
    }
    setIsAddressModalOpen(false);
  };

  // Invoice Download Simulator
  const handleDownloadInvoice = (order: Order) => {
    playSound('form_submit');
    const content = `
============================================================
HAKKIVEDA HERBAL FORMULATIONS PRIVATE LIMITED
Mysore, Karnataka, India • Toll Free: +91 76195 36831
============================================================
TAX INVOICE / ORDER RECEIPT
Order Number: ${order.orderNumber}
Date: ${order.date}
Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}

CUSTOMER DETAILS:
Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}, ${order.customer.country}

ORDERED ITEMS:
${order.items
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.product.name} x ${item.quantity} = ₹${item.product.priceINR * item.quantity}`
  )
  .join('\n')}

------------------------------------------------------------
Total Amount: ${formatPrice(order.totalAmountINR)}
Tracking Courier: ${order.courierName || 'BlueDart Air Express'}
Tracking Number: ${order.trackingNumber || 'BD-EXP-883901'}
------------------------------------------------------------
Thank you for supporting 100% authentic Hakki-Pikki tribal heritage!
============================================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HAKKIVEDA_Invoice_${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Submit Return Request
  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('order_success');
    setReturnSuccessMsg(`Return request #RET-${Math.floor(10000 + Math.random() * 90000)} submitted! Our tribal concierge will arrange reverse pickup.`);
    setTimeout(() => {
      setReturnOrder(null);
      setReturnSuccessMsg('');
    }, 2500);
  };

  // Get customer specific orders
  const userOrders = currentUser
    ? orders.filter((o) => o.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MAIN CUSTOMER PORTAL OVERLAY / MODAL */}
      {/* ========================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/80 transition-opacity animate-in fade-in duration-300">
          {/* Backdrop Click */}
          <div
            className="fixed inset-0 bg-black/80 transition-opacity"
            onClick={() => setIsAuthModalOpen(false)}
          ></div>

          {!currentUser ? (
            /* LARGE CENTERED LUXURY MODAL FOR AUTH */
            <div className="relative w-full max-w-xl bg-[#06261d] border border-[var(--brand-gold)]/30 rounded-3xl shadow-2xl p-6 sm:p-10 text-slate-100 font-sans z-10 animate-in fade-in zoom-in-95 duration-300 my-auto">
              {/* Top Bar with Brand Title & Close Button */}
              <div className="flex items-center justify-between border-b border-[var(--brand-gold)]/20 pb-5 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[var(--brand-gold)] block mb-1 font-serif-luxury">
                    HAKKIVEDA TRIBAL AYURVEDA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100 tracking-tight">
                    {authTab === 'SIGN_IN' && 'Sign In'}
                    {authTab === 'CREATE_ACCOUNT' && 'Create Account'}
                    {authTab === 'FORGOT_PASSWORD' && 'Forgot Password'}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    playSound('nav_click');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-10 h-10 rounded-full bg-[var(--brand-primary-dark)] text-slate-300 hover:text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all flex items-center justify-center border border-[var(--brand-gold)]/30 shrink-0"
                  title="Close Modal (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Minimal Clean Tabs */}
              <div className="flex items-center border-b border-white/10 mb-8 text-xs sm:text-sm font-medium">
                <button
                  type="button"
                  onClick={() => {
                    playSound('nav_click');
                    setAuthTab('SIGN_IN');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`pb-3 px-3 sm:px-5 transition-all relative font-serif-luxury ${
                    authTab === 'SIGN_IN'
                      ? 'text-[var(--brand-gold)] font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                  {authTab === 'SIGN_IN' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-gold)] rounded-full"></span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('nav_click');
                    setAuthTab('CREATE_ACCOUNT');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`pb-3 px-3 sm:px-5 transition-all relative font-serif-luxury ${
                    authTab === 'CREATE_ACCOUNT'
                      ? 'text-[var(--brand-gold)] font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                  {authTab === 'CREATE_ACCOUNT' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-gold)] rounded-full"></span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('nav_click');
                    setAuthTab('FORGOT_PASSWORD');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`pb-3 px-3 sm:px-5 transition-all relative font-serif-luxury ${
                    authTab === 'FORGOT_PASSWORD'
                      ? 'text-[var(--brand-gold)] font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Forgot Password
                  {authTab === 'FORGOT_PASSWORD' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-gold)] rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Feedback Messages */}
              {authError && (
                <div className="bg-rose-950/90 border border-rose-500/40 p-3.5 rounded-xl flex items-center gap-3 text-xs text-rose-200 mb-6 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-950/90 border border-emerald-500/40 p-3.5 rounded-xl flex items-center gap-3 text-xs text-emerald-200 mb-6 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* SIGN IN TAB */}
              {authTab === 'SIGN_IN' && (
                <form onSubmit={handleSignInSubmit} className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Password *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 pr-10 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--brand-gold)] transition-colors"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--brand-gold)]/40 bg-[var(--brand-primary-dark)] accent-[var(--brand-gold)] focus:ring-0 cursor-pointer"
                      />
                      <span>Remember Me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('FORGOT_PASSWORD');
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      className="text-xs text-[var(--brand-gold)] hover:underline font-serif-luxury"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-4 rounded-xl font-bold font-serif-luxury text-xs uppercase tracking-[0.2em] hover:bg-[#d8b45c] transition-all shadow-lg active:scale-[0.99] mt-2"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {/* CREATE ACCOUNT TAB */}
              {authTab === 'CREATE_ACCOUNT' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Maharani Gayatri Devi"
                      className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98000 00000"
                        className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create password"
                          className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 pr-10 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--brand-gold)] transition-colors"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-4 rounded-xl font-bold font-serif-luxury text-xs uppercase tracking-[0.2em] hover:bg-[#d8b45c] transition-all shadow-lg active:scale-[0.99] mt-3"
                  >
                    Create Account
                  </button>
                </form>
              )}

              {/* FORGOT PASSWORD TAB */}
              {authTab === 'FORGOT_PASSWORD' && (
                <form onSubmit={handleForgotSubmit} className="space-y-5 animate-in fade-in">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Please provide your registered email address below. We will send a password reset link directly to your inbox.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/25 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-400/80 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-1 focus:ring-[var(--brand-gold)]/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-4 rounded-xl font-bold font-serif-luxury text-xs uppercase tracking-[0.2em] hover:bg-[#d8b45c] transition-all shadow-lg active:scale-[0.99] mt-2"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}

              {/* Footer */}
              <div className="border-t border-[var(--brand-gold)]/20 pt-6 mt-8 flex items-center justify-center gap-6 text-[11px] text-slate-400 font-medium">
                <button
                  type="button"
                  onClick={() => setPolicyModal('PRIVACY')}
                  className="hover:text-[var(--brand-gold)] transition-colors underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </button>
                <span className="text-[var(--brand-gold)]/40">•</span>
                <button
                  type="button"
                  onClick={() => setPolicyModal('TERMS')}
                  className="hover:text-[var(--brand-gold)] transition-colors underline-offset-4 hover:underline"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>
          ) : (
            /* SLIDING / SPACIOUS DASHBOARD PANEL WHEN LOGGED IN */
            <div className="relative w-full max-w-4xl bg-[#06261d] border border-[var(--brand-gold)]/30 text-slate-100 shadow-2xl rounded-3xl flex flex-col max-h-[90vh] font-sans z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden my-auto">
              {/* Header Bar */}
              <div className="p-4 sm:p-6 bg-[var(--brand-primary-dark)] border-b border-[var(--brand-gold)]/30 flex items-center justify-between shrink-0 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)] flex items-center justify-center text-[var(--brand-gold)]">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--brand-gold)] block">
                      HAKKIVEDA LUXURY ACCOUNT
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-slate-100">
                      Welcome, {currentUser.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound('nav_click');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-black/40 text-slate-300 hover:text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all flex items-center justify-center border border-white/10"
                  title="Close Portal (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Portal Content Scroll Area */}
              <div className="flex-1 overflow-y-auto">
                {/* ========================================================= */}
                {/* IF LOGGED IN: DISPLAY LUXURY CUSTOMER DASHBOARD */}
                {/* ========================================================= */}
                <div className="p-4 sm:p-8 space-y-6">
                  {/* Top Profile Summary Header Card */}
                  <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-[var(--brand-gold)]/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
                      <div className="relative shrink-0">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[var(--brand-gold)] shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-2xl font-serif-luxury flex items-center justify-center border-2 border-white/20 shadow-lg">
                            {currentUser.name[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--brand-primary-dark)]"></span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-100">
                            {currentUser.name}
                          </h3>
                          <span className="bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {currentUser.isAdmin ? 'Master Admin' : 'Tribal Gold Member'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--brand-gold)]">{currentUser.email}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {currentUser.phone || 'Phone not set'} • Member since {currentUser.createdAt || '2026'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 z-10 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 px-4 py-2 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Reward Balance</span>
                        <span className="text-base font-bold text-[var(--brand-gold)]">
                          {currentUser.loyaltyPoints || 100} Hakki-Points
                        </span>
                      </div>

                      <button
                        onClick={logoutUser}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Sidebar / Navigation Tabs Bar */}
                  <div className="relative w-full border-b border-white/10 pb-2">
                    {/* Left Fade Indicator & Scroll Arrow */}
                    <div
                      className={`absolute left-0 top-0 bottom-2 w-10 sm:w-14 bg-gradient-to-r from-[#06261d] via-[#06261d]/80 to-transparent z-10 flex items-center justify-start pointer-events-none transition-opacity duration-300 ${
                        showLeftFade ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => scrollNav('left')}
                        className="pointer-events-auto w-7 h-7 rounded-full bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 flex items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all shadow-md ml-0.5 active:scale-90"
                        title="Scroll left"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Right Fade Indicator & Scroll Arrow */}
                    <div
                      className={`absolute right-0 top-0 bottom-2 w-10 sm:w-14 bg-gradient-to-l from-[#06261d] via-[#06261d]/80 to-transparent z-10 flex items-center justify-end pointer-events-none transition-opacity duration-300 ${
                        showRightFade ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => scrollNav('right')}
                        className="pointer-events-auto w-7 h-7 rounded-full bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 flex items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all shadow-md mr-0.5 active:scale-90"
                        title="Scroll right"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Scrollable Tabs Track */}
                    <div
                      ref={navContainerRef}
                      onScroll={updateNavScrollFades}
                      className="flex items-center gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth py-1 px-1 text-xs font-bold uppercase tracking-wider touch-pan-x [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {[
                        { id: 'profile', label: 'Profile', icon: UserIcon },
                        { id: 'orders', label: `Orders (${userOrders.length})`, icon: Package },
                        { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
                        { id: 'addresses', label: `Addresses (${currentUser.addresses?.length || 0})`, icon: MapPin },
                        { id: 'payments', label: 'Payments', icon: CreditCard },
                        { id: 'preferences', label: 'Preferences', icon: Sliders },
                        { id: 'rewards', label: 'Rewards & Referrals', icon: Gift },
                        { id: 'support', label: 'Support', icon: HelpCircle },
                        { id: 'settings', label: 'Settings', icon: Settings },
                      ].map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            data-active={isActive ? 'true' : 'false'}
                            onClick={() => {
                              playSound('nav_click');
                              setActiveTab(tab.id as any);
                            }}
                            className={`snap-center flex items-center justify-center gap-2.5 px-4 min-h-[44px] h-11 rounded-xl shrink-0 whitespace-nowrap transition-all duration-200 select-none touch-manipulation ${
                              isActive
                                ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-lg font-bold border border-[var(--brand-gold)] scale-[1.02]'
                                : 'bg-[var(--brand-primary-dark)]/80 text-slate-300 hover:bg-[var(--brand-primary-dark)] hover:text-white border border-white/10 active:scale-95'
                            }`}
                          >
                            <IconComponent className="w-4 h-4 shrink-0" />
                            <span className="whitespace-nowrap">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* TAB CONTENT SECTIONS */}
                  {/* ========================================================= */}

                  {/* 1. PROFILE TAB */}
                  {activeTab === 'profile' && (
                    <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-6 space-y-6 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Personal Information</h4>
                          <p className="text-xs text-slate-300">Manage your contact details and account dossier.</p>
                        </div>
                        <button
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border border-[var(--brand-gold)]/40"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
                        </button>
                      </div>

                      {isEditingProfile ? (
                        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                              <input
                                type="text"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Avatar Image URL</label>
                            <input
                              type="text"
                              value={editAvatar}
                              onChange={(e) => setEditAvatar(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2.5 rounded-lg font-bold uppercase text-xs hover:bg-white transition-all shadow-md"
                          >
                            Save Profile Updates
                          </button>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
                            <span className="font-bold text-white text-sm">{currentUser.name}</span>
                          </div>
                          <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                            <span className="font-bold text-[var(--brand-gold)] text-sm">{currentUser.email}</span>
                          </div>
                          <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                            <span className="font-bold text-white text-sm">{currentUser.phone || 'Not provided'}</span>
                          </div>
                          <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Referral Code</span>
                            <span className="font-bold text-[var(--brand-gold)] text-sm font-mono">
                              {currentUser.referralCode || 'HAKKI-VIP-100'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. MY ORDERS TAB */}
                  {activeTab === 'orders' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Your Order History</h4>
                        <span className="text-xs text-[var(--brand-gold)] font-bold">{userOrders.length} Total Orders</span>
                      </div>

                      {userOrders.length === 0 ? (
                        <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-12 text-center space-y-3">
                          <Package className="w-12 h-12 text-slate-500 mx-auto" />
                          <h5 className="font-serif-luxury text-base font-bold text-slate-200">No orders placed yet</h5>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Explore our rare 42 mountain herbs formulations and start your hair transformation journey today.
                          </p>
                          <button
                            onClick={() => setIsAuthModalOpen(false)}
                            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg mt-2"
                          >
                            Explore Collections
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userOrders.map((order) => (
                            <div
                              key={order.id}
                              className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg hover:border-[var(--brand-gold)]/40 transition-all"
                            >
                              {/* Order Header */}
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs">
                                <div>
                                  <span className="font-bold text-[var(--brand-gold)] font-mono text-sm block">
                                    {order.orderNumber}
                                  </span>
                                  <span className="text-slate-400 text-[10px]">Placed on {order.date}</span>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                        order.trackingStatus === 'DELIVERED'
                                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                                          : 'bg-amber-950 text-amber-300 border-amber-500/40 animate-pulse'
                                      }`}
                                    >
                                      {order.shipmentStatus || order.trackingStatus?.replace('_', ' ') || 'PROCESSING'}
                                    </span>
                                    <span className="font-bold text-white text-sm">
                                      {formatPrice(order.totalAmountINR)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Courier & Shipping Telemetry Bar */}
                              <div className="bg-[var(--brand-primary-deep)] p-2.5 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                <div>
                                  <span className="text-slate-400">Courier Partner: </span>
                                  <span className="font-bold text-slate-100">{order.courierName || 'Shiprocket Air Express'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">AWB No: </span>
                                  <span className="font-mono font-bold text-[var(--brand-gold)]">
                                    {order.awbCode || order.trackingNumber || 'Pending Assignment'}
                                  </span>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 bg-[var(--brand-primary-deep)] p-2.5 rounded-xl">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="w-12 h-12 object-contain rounded-lg shrink-0 bg-black/30 p-0.5 border border-white/10"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-bold font-serif-luxury text-xs text-white truncate">
                                        {item.product.name}
                                      </h5>
                                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-xs font-bold text-[var(--brand-gold)]">
                                      {formatPrice(item.product.priceINR * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                                <div className="text-[11px] text-slate-300">
                                  Shipping to: <span className="font-bold text-white">{order.customer.city}, {order.customer.country}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      playSound('nav_click');
                                      setTrackingOrder(order);
                                    }}
                                    className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 hover:bg-white transition-all shadow-sm"
                                  >
                                    <Truck className="w-3.5 h-3.5" />
                                    <span>Track Shipment</span>
                                  </button>

                                  <button
                                    onClick={() => handleDownloadInvoice(order)}
                                    className="bg-[var(--brand-primary-deep)] hover:bg-black/40 border border-white/20 text-slate-200 px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all"
                                  >
                                    <Download className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                                    <span>Invoice</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      playSound('nav_click');
                                      setReturnOrder(order);
                                    }}
                                    className="bg-[var(--brand-primary-deep)] hover:bg-rose-950/60 border border-white/20 text-slate-300 hover:text-rose-300 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all"
                                  >
                                    Return
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. WISHLIST TAB */}
                  {activeTab === 'wishlist' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Saved Wishlist</h4>
                        <span className="text-xs text-[var(--brand-gold)] font-bold">{wishlist.length} Formulations Saved</span>
                      </div>

                      {wishlist.length === 0 ? (
                        <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-12 text-center space-y-3">
                          <Heart className="w-12 h-12 text-slate-500 mx-auto" />
                          <h5 className="font-serif-luxury text-base font-bold text-slate-200">Wishlist is empty</h5>
                          <p className="text-xs text-slate-400">Save your favorite herbal hair products here for quick access.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {wishlist.map((prod) => (
                            <div
                              key={prod.id}
                              className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-4 flex gap-3 items-center justify-between"
                            >
                              <img src={prod.image} alt={prod.name} className="w-16 h-16 object-contain rounded-xl shrink-0 bg-black/30 p-1 border border-white/10" />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold font-serif-luxury text-xs text-white truncate">{prod.name}</h5>
                                <span className="text-xs text-[var(--brand-gold)] font-bold block mt-0.5">
                                  {formatPrice(prod.priceINR)}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 shrink-0">
                                <button
                                  onClick={() => addToCart(prod, 1)}
                                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-white"
                                >
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => toggleWishlist(prod)}
                                  className="text-slate-400 hover:text-rose-400 text-[10px] text-center underline pt-0.5"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. ADDRESSES TAB */}
                  {activeTab === 'addresses' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Saved Addresses</h4>
                          <p className="text-xs text-slate-300">Manage your shipping destinations for instant checkout.</p>
                        </div>
                        <button
                          onClick={() => openAddressModal()}
                          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-white transition-all shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Address</span>
                        </button>
                      </div>

                      {currentUser.addresses.length === 0 ? (
                        <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-8 text-center text-xs text-slate-400">
                          No address saved yet. Click "Add New Address" above.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {currentUser.addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className={`bg-[var(--brand-primary-dark)] border rounded-2xl p-5 space-y-3 relative ${
                                addr.isDefault ? 'border-[var(--brand-gold)] shadow-xl' : 'border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                                    {addr.title || 'Address'}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                      DEFAULT
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => openAddressModal(addr)}
                                    className="text-slate-400 hover:text-white p-1"
                                    title="Edit Address"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      playSound('toggle_switch');
                                      deleteSavedAddress(addr.id);
                                    }}
                                    className="text-slate-400 hover:text-rose-400 p-1"
                                    title="Delete Address"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-xs text-slate-300 space-y-1">
                                <p className="font-bold text-white">{addr.name}</p>
                                <p>{addr.line1}</p>
                                <p>
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                <p>{addr.country}</p>
                                <p className="text-[var(--brand-gold)] pt-1">Phone: {addr.phone}</p>
                              </div>

                              {!addr.isDefault && (
                                <button
                                  onClick={() => {
                                    playSound('toggle_switch');
                                    setDefaultAddress(addr.id);
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)] hover:underline block pt-1"
                                >
                                  Set as Default Shipping Address
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. PAYMENTS TAB */}
                  {activeTab === 'payments' && (
                    <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-6 space-y-4 animate-in fade-in text-xs">
                      <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Saved Payment Methods</h4>
                      <p className="text-slate-300">
                        HAKKIVEDA supports 100% secure encrypted checkout via Razorpay, Stripe, PayPal, and Cash on Delivery.
                      </p>

                      <div className="space-y-3 pt-2">
                        {(currentUser.savedPayments || []).map((pay) => (
                          <div
                            key={pay.id}
                            className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-xl flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-6 h-6 text-[var(--brand-gold)]" />
                              <div>
                                <h5 className="font-bold text-white text-sm">{pay.title}</h5>
                                <span className="text-slate-400 text-xs font-mono">{pay.details}</span>
                              </div>
                            </div>

                            {pay.isDefault ? (
                              <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                DEFAULT METHOD
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Verified</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. PREFERENCES TAB */}
                  {activeTab === 'preferences' && (
                    <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-6 space-y-6 animate-in fade-in text-xs">
                      <div>
                        <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Global Account Preferences</h4>
                        <p className="text-slate-300">Customize regional delivery settings and communication alerts.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
                          <label className="block font-bold text-slate-400 mb-1">Country</label>
                          <span className="font-bold text-white text-sm block">
                            {currentUser.preferences?.country || 'India 🇮🇳'}
                          </span>
                        </div>
                        <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
                          <label className="block font-bold text-slate-400 mb-1">Currency</label>
                          <span className="font-bold text-[var(--brand-gold)] text-sm block">
                            {currentUser.preferences?.currency || 'INR (₹)'}
                          </span>
                        </div>
                        <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
                          <label className="block font-bold text-slate-400 mb-1">Language</label>
                          <span className="font-bold text-white text-sm block">
                            {currentUser.preferences?.language || 'English'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4 space-y-3">
                        <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Alert Notifications</h5>
                        <label className="flex items-center gap-3 bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={currentUser.preferences?.emailOrders ?? true}
                            className="w-4 h-4 rounded accent-[var(--brand-gold)]"
                          />
                          <span className="text-slate-200">Email Order Dispatch & Tracking Receipt</span>
                        </label>
                        <label className="flex items-center gap-3 bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={currentUser.preferences?.whatsappUpdates ?? true}
                            className="w-4 h-4 rounded accent-[var(--brand-gold)]"
                          />
                          <span className="text-slate-200">WhatsApp Dispatch & Delivery Updates</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* 7. REWARDS TAB */}
                  {activeTab === 'rewards' && (
                    <div className="space-y-6 animate-in fade-in">
                      {/* Loyalty Balance Header */}
                      <div className="bg-gradient-to-br from-[var(--brand-primary-dark)] to-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/40 rounded-2xl p-6 shadow-xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--brand-gold)] block">
                            HAKKIVEDA Tribal Rewards Club
                          </span>
                          <h4 className="text-2xl font-bold font-serif-luxury text-white">
                            {currentUser.loyaltyPoints || 100} Hakki-Points Balance
                          </h4>
                          <p className="text-xs text-slate-300 mt-1">
                            100 Hakki-Points = ₹100 direct discount at checkout!
                          </p>
                        </div>
                        <Gift className="w-12 h-12 text-[var(--brand-gold)]" />
                      </div>

                      {/* Active Coupons List */}
                      <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-6 space-y-4 text-xs">
                        <h4 className="text-base font-bold font-serif-luxury text-slate-100">Available Promotional Codes</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {coupons.map((c) => (
                            <div
                              key={c.code}
                              className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 p-4 rounded-xl flex items-center justify-between"
                            >
                              <div>
                                <span className="font-mono text-base font-bold text-[var(--brand-gold)]">{c.code}</span>
                                <p className="text-slate-200 text-xs font-bold">
                                  {c.discountType === 'PERCENT' ? `${c.value}% OFF` : `FLAT ₹${c.value} OFF`}
                                </p>
                                <p className="text-[10px] text-slate-400">Min Order: ₹{c.minOrderINR}</p>
                              </div>

                              <button
                                onClick={() => {
                                  applyCoupon(c.code);
                                  setIsCartOpen(true);
                                }}
                                className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase hover:bg-white"
                              >
                                Apply to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Referral Program */}
                      <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-6 space-y-3 text-xs">
                        <h4 className="text-base font-bold font-serif-luxury text-slate-100">Refer & Earn Program</h4>
                        <p className="text-slate-300">
                          Share your unique referral code with friends & family. They receive ₹200 OFF their first order, and you earn 200 Hakki-Points!
                        </p>

                        <div className="flex items-center gap-2 max-w-md pt-1">
                          <input
                            type="text"
                            readOnly
                            value={currentUser.referralCode || 'HAKKI-VIP-100'}
                            className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] font-mono font-bold p-2.5 rounded-xl text-center text-sm w-full"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(currentUser.referralCode || 'HAKKI-VIP-100');
                              playSound('form_submit');
                              alert('Referral code copied to clipboard!');
                            }}
                            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] p-2.5 rounded-xl font-bold hover:bg-white shrink-0"
                            title="Copy Code"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 8. SUPPORT TAB */}
                  {activeTab === 'support' && (
                    <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-6 space-y-6 animate-in fade-in text-xs">
                      <div>
                        <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Customer Support & Concierge</h4>
                        <p className="text-slate-300">Our tribal herbal experts in Mysore are here to guide your hair recovery.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                          onClick={() => {
                            playSound('cta_click');
                            setIsQuizOpen(true);
                            setIsAuthModalOpen(false);
                          }}
                          className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/40 p-5 rounded-2xl text-left space-y-2 transition-all group"
                        >
                          <Sparkles className="w-6 h-6 text-[var(--brand-gold)]" />
                          <h5 className="font-bold text-white group-hover:text-[var(--brand-gold)]">AI Hair Analysis Quiz</h5>
                          <p className="text-[11px] text-slate-400">Get custom hair oiling ritual recommendations.</p>
                        </button>

                        <a
                          href="https://wa.me/917619536831?text=Hello%20HAKKIVEDA%20Concierge,%20I%20have%20a%20question%20about%20my%20hair%20oil."
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSound('nav_click')}
                          className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-primary-deeper)] border border-emerald-500/40 p-5 rounded-2xl text-left space-y-2 transition-all group"
                        >
                          <MessageSquare className="w-6 h-6 text-emerald-400" />
                          <h5 className="font-bold text-white group-hover:text-emerald-400">WhatsApp Concierge</h5>
                          <p className="text-[11px] text-slate-400">Instant chat with our Mysore team.</p>
                        </a>

                        <a
                          href="tel:+917619536831"
                          onClick={() => playSound('nav_click')}
                          className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-primary-deeper)] border border-white/20 p-5 rounded-2xl text-left space-y-2 transition-all group"
                        >
                          <Phone className="w-6 h-6 text-[var(--brand-gold)]" />
                          <h5 className="font-bold text-white group-hover:text-[var(--brand-gold)]">Toll-Free Helpline</h5>
                          <p className="text-[11px] text-slate-400">+91 76195 36831 (Mon - Sat 10 AM - 7 PM IST)</p>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 9. SETTINGS TAB */}
                  {activeTab === 'settings' && (
                    <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-6 space-y-6 animate-in fade-in text-xs">
                      <div>
                        <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Account Security & Privacy</h4>
                        <p className="text-slate-300">Manage credentials and export your account data.</p>
                      </div>

                      {/* Download Data Export */}
                      <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-white">Download Personal Account Dossier</h5>
                          <p className="text-[11px] text-slate-400">Export a complete JSON file of your profile and orders.</p>
                        </div>
                        <button
                          onClick={() => exportCustomerData(currentUser.id)}
                          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl font-bold uppercase text-[10px] hover:bg-white"
                        >
                          Export Data
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-500/30 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-rose-300">Delete Customer Account</h5>
                          <p className="text-[11px] text-rose-200/70">Permanently remove your account and reward balance.</p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                              logoutUser();
                              setIsAuthModalOpen(false);
                            }
                          }}
                          className="bg-rose-800 text-white px-4 py-2 rounded-xl font-bold uppercase text-[10px] hover:bg-rose-700"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TRACK SHIPMENT MODAL */}
      {/* ========================================================= */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl shadow-2xl p-6 space-y-6 text-slate-100 font-sans">
            <button
              onClick={() => setTrackingOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[var(--brand-gold)] text-[10px] uppercase font-bold tracking-widest block">
                Live Shipment Telemetry
              </span>
              <h3 className="text-xl font-bold font-serif-luxury text-slate-100">
                Tracking Order {trackingOrder.orderNumber}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Courier: <span className="font-bold text-white">{trackingOrder.courierName || 'BlueDart Air Express'}</span> • AWB: <span className="font-mono text-[var(--brand-gold)]">{trackingOrder.awbCode || trackingOrder.trackingNumber || 'BD-EXP-883901'}</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                Shipment Status: {trackingOrder.shipmentStatus || trackingOrder.trackingStatus || 'IN_TRANSIT'}
              </p>
            </div>

            {/* Live API Telemetry Stream */}
            {isFetchingTracking ? (
              <div className="p-4 bg-[var(--brand-primary-dark)] rounded-xl border border-white/10 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[var(--brand-gold)] border-t-transparent rounded-full animate-spin" />
                <span>Fetching live Shiprocket tracking updates...</span>
              </div>
            ) : liveTrackingData ? (
              <div className="bg-[var(--brand-primary-dark)] p-4 rounded-xl border border-[var(--brand-gold)]/30 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-[var(--brand-gold)]">
                  <span>Current Status:</span>
                  <span>{liveTrackingData.shipmentStatus}</span>
                </div>
                {liveTrackingData.trackingUrl && (
                  <a
                    href={liveTrackingData.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:underline font-mono text-[11px]"
                  >
                    <span>Open External Courier Tracking Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {liveTrackingData.scans && Array.isArray(liveTrackingData.scans) && liveTrackingData.scans.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1.5 max-h-36 overflow-y-auto">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Checkpoint History:</span>
                    {liveTrackingData.scans.map((scan: any, idx: number) => (
                      <div key={idx} className="text-[11px] text-slate-300 font-mono flex justify-between gap-2 bg-black/30 p-1.5 rounded">
                        <span>{scan.activity} ({scan.location})</span>
                        <span className="text-slate-400 shrink-0">{scan.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Stepper Delivery Timeline Bar */}
            <div className="space-y-4 pt-2">
              {[
                { status: 'PLACED', label: 'Order Confirmed', time: trackingOrder.date },
                { status: 'PROCESSING', label: 'Copper Cauldron Brewed & Packed', time: 'Day +1' },
                { status: 'IN_TRANSIT', label: 'Dispatched via Air Courier', time: 'In Transit' },
                { status: 'OUT_FOR_DELIVERY', label: 'Out for Handshake Delivery', time: 'Today' },
                { status: 'DELIVERED', label: 'Delivered to Address', time: trackingOrder.estimatedDeliveryDate || 'Est. 2-3 Days' },
              ].map((step, idx) => {
                const isCompleted = trackingOrder.trackingStatus === 'DELIVERED' || idx <= 2;
                return (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                        isCompleted
                          ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md'
                          : 'bg-[var(--brand-primary-dark)] text-slate-500 border border-white/20'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 pb-4 border-l border-white/10 pl-3 -ml-6 pt-0.5">
                      <h5 className="font-bold text-xs text-white">{step.label}</h5>
                      <span className="text-[10px] text-slate-400">{step.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setTrackingOrder(null)}
              className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. RETURN REQUEST MODAL */}
      {/* ========================================================= */}
      {returnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100 font-sans">
            <button onClick={() => setReturnOrder(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[var(--brand-gold)] text-[10px] uppercase font-bold tracking-widest block">100% Satisfaction Guarantee</span>
              <h3 className="text-xl font-bold font-serif-luxury text-slate-100">
                Return Request for {returnOrder.orderNumber}
              </h3>
            </div>

            {returnSuccessMsg ? (
              <div className="bg-emerald-950 border border-emerald-500/50 p-4 rounded-xl text-center space-y-2 text-xs text-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p>{returnSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Reason for Return *</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-2.5 text-xs text-slate-100"
                  >
                    <option value="Defective product / Leaking bottle">Defective product / Leaking bottle</option>
                    <option value="Wrong item delivered">Wrong item delivered</option>
                    <option value="Hair concern changed / Unopened bottle">Hair concern changed / Unopened bottle</option>
                    <option value="Other">Other reason</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Additional Comments</label>
                  <textarea
                    rows={3}
                    value={returnComments}
                    onChange={(e) => setReturnComments(e.target.value)}
                    placeholder="Provide details for our Mysore quality team..."
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 rounded-xl p-2.5 text-xs text-slate-100"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all shadow-xl"
                >
                  Submit Reverse Pickup Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ADD / EDIT ADDRESS MODAL */}
      {/* ========================================================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100 font-sans">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif-luxury text-slate-100">
              {editingAddressId ? 'Edit Address' : 'Add New Shipping Address'}
            </h3>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Title</label>
                  <select
                    value={addrTitle}
                    onChange={(e) => setAddrTitle(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Street Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  placeholder="House/Apt No., Building, Street"
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={addrCountry}
                    onChange={(e) => setAddrCountry(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Pincode / Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--brand-gold)]"
                />
                <span className="text-slate-300">Set as default delivery address</span>
              </label>

              <button
                type="submit"
                className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all shadow-xl"
              >
                Save Shipping Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. WISHLIST DRAWER (STANDALONE) */}
      {/* ========================================================= */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsWishlistOpen(false)}
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-10">
            <div className="w-screen max-w-md bg-[var(--brand-primary-deep)] border-l border-[var(--brand-gold)]/40 text-slate-100 shadow-2xl flex flex-col justify-between font-sans">
              <div className="p-6 bg-[var(--brand-primary-dark)] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[var(--brand-gold)] fill-current" />
                  <h2 className="text-xl font-bold font-serif-luxury text-slate-100">Saved Wishlist</h2>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Heart className="w-16 h-16 text-slate-600 mx-auto" />
                    <p className="text-slate-300 text-sm font-serif-luxury">No saved formulations yet.</p>
                  </div>
                ) : (
                  wishlist.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex gap-4 p-3 bg-[var(--brand-primary-dark)] border border-white/10 rounded-xl items-center justify-between"
                    >
                      <img src={prod.image} alt={prod.name} className="w-16 h-16 object-contain rounded-lg bg-black/30 p-1 border border-white/10" />
                      <div className="flex-1 px-2">
                        <h4 className="text-xs font-bold font-serif-luxury text-slate-100 line-clamp-1">
                          {prod.name}
                        </h4>
                        <span className="text-xs text-[var(--brand-gold)] font-bold">{formatPrice(prod.priceINR)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-1.5 rounded text-[10px] font-bold uppercase"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. PRIVACY & TERMS POLICY MODAL */}
      {/* ========================================================= */}
      {policyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#06261d] border border-[var(--brand-gold)]/40 rounded-2xl shadow-2xl p-6 text-slate-100 font-sans space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--brand-gold)]/20 pb-3">
              <h3 className="text-xl font-serif-luxury font-bold text-[var(--brand-gold)]">
                {policyModal === 'PRIVACY' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button
                onClick={() => setPolicyModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto text-xs text-slate-300 leading-relaxed space-y-3 pr-2">
              {policyModal === 'PRIVACY' ? (
                <>
                  <p>
                    <strong>HAKKIVEDA Respects Your Privacy:</strong> We collect and protect your personal information with royal diligence. Your data (name, email, phone number, and delivery addresses) is strictly used for order processing, authenticating your account, and providing personalized customer care.
                  </p>
                  <p>
                    <strong>Data Encryption & Security:</strong> All password hashes and personal telemetry are encrypted using standard protocols. We never sell, rent, or trade customer information with third-party vendors.
                  </p>
                  <p>
                    <strong>Your Data Rights:</strong> You may request full export of your personal dossier or request account deletion directly from your account panel settings at any time.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Authentic Formulation Guarantee:</strong> All HAKKIVEDA wild forest oils and elixirs are hand-crafted by indigenous Hakki Pikki master herbalists using authentic traditional methods.
                  </p>
                  <p>
                    <strong>Orders & Delivery:</strong> Orders are dispatched within 24-48 business hours. Delivery timelines are subject to courier partners. Invoices and tracking details are provided digitally in your customer portal.
                  </p>
                  <p>
                    <strong>Return Policy:</strong> Due to the handcrafted, organic nature of our botanical formulations, returns are accepted within 7 days of delivery for damaged or unopened items.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setPolicyModal(null)}
                className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
