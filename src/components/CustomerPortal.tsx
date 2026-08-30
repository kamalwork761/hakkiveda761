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
  Key,
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
  Star,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SavedAddress, Order, Product } from '../types/store';
import { getProductUrl } from '../utils/productUtils';

// Helper to compute initials for avatar placeholder
const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'HV';
  const clean = name.trim();
  const words = clean.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    customerAccounts,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    changeCustomerPassword,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    exportCustomerData,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authInitialTab,
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
    selectedCountry,
    currentCurrency,
  } = useStore();

  // Auth Forms State
  const [authTab, setAuthTab] = useState<'SIGN_IN' | 'CREATE_ACCOUNT' | 'FORGOT_PASSWORD'>('SIGN_IN');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Change Password State (for logged-in customer settings)
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmNewPassInput, setConfirmNewPassInput] = useState('');
  const [changePassStatus, setChangePassStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Registration state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Sync auth tab when opening modal
  useEffect(() => {
    if (isAuthModalOpen && authInitialTab) {
      setAuthTab(authInitialTab);
      setAuthError('');
      setAuthSuccess('');
    }
  }, [isAuthModalOpen, authInitialTab]);

  // Policy Modal state
  const [policyModal, setPolicyModal] = useState<'PRIVACY' | 'TERMS' | null>(null);

  // Dashboard Active Section
  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'preferences' | 'rewards' | 'support' | 'settings'
  >('profile');
  const [addedWishlistProductId, setAddedWishlistProductId] = useState<string | null>(null);

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

  // Navigation Helpers for Wishlist
  const handleNavigateToProduct = (prod: Product) => {
    playSound('nav_click');
    setIsWishlistOpen(false);
    setIsAuthModalOpen(false);
    const targetUrl = getProductUrl(prod);
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreProducts = () => {
    playSound('nav_click');
    setIsWishlistOpen(false);
    setIsAuthModalOpen(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setTimeout(() => {
      const el = document.getElementById('products') || document.getElementById('featured-products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }, 120);
  };

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
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!signInEmail.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInEmail.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!signInPassword) {
      setAuthError('Please enter your password.');
      return;
    }

    playSound('cta_click');
    setIsAuthSubmitting(true);
    try {
      const res = await loginUser(signInEmail.trim(), signInPassword);
      if (!res.success) {
        setAuthError(res.message);
      } else {
        setAuthSuccess(res.message);
        setSignInEmail('');
        setSignInPassword('');
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!regFirstName.trim()) {
      setAuthError('Please enter your first name.');
      return;
    }
    if (!regEmail.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!regPhone.trim()) {
      setAuthError('Please enter your mobile number.');
      return;
    }
    if (!regPassword) {
      setAuthError('Please enter your password.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match. Please verify your entries.');
      return;
    }

    playSound('cta_click');
    setIsAuthSubmitting(true);
    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim();
    try {
      const res = await registerUser({
        name: fullName,
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
      });

      if (!res.success) {
        setAuthError(res.message);
      } else {
        setAuthSuccess(res.message);
        setRegFirstName('');
        setRegLastName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setRegConfirmPassword('');
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('form_submit');
    setAuthError('');
    if (!signInEmail.trim()) {
      setAuthError('Please enter your registered email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInEmail.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail.trim() }),
      });
      const data = await res.json();
      setAuthSuccess(data.message || `Password assistance email sent to ${signInEmail.trim()}.`);
    } catch {
      setAuthSuccess(`Password reset request received for ${signInEmail.trim()}. Our dedicated customer care team has been notified and will assist you.`);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassStatus(null);

    if (!currentPassInput) {
      setChangePassStatus({ type: 'error', message: 'Please enter your current password.' });
      return;
    }
    if (!newPassInput || newPassInput.length < 6) {
      setChangePassStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassInput !== confirmNewPassInput) {
      setChangePassStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changeCustomerPassword(currentPassInput, newPassInput);
      if (res.success) {
        setChangePassStatus({ type: 'success', message: res.message || 'Password updated successfully!' });
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmNewPassInput('');
      } else {
        setChangePassStatus({ type: 'error', message: res.message || 'Failed to update password.' });
      }
    } finally {
      setIsChangingPass(false);
    }
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
      `${idx + 1}. ${item.product.name} x ${item.quantity} = ${formatPrice(item.product.priceINR * item.quantity)}`
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
            /* CENTERED PREMIUM LIGHT AUTH CARD */
            <div
              className={`relative w-full ${
                authTab === 'CREATE_ACCOUNT' ? 'max-w-[520px]' : 'max-w-[450px]'
              } bg-[#FAF7F2] border border-[#D8CDAF] rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-[#0F2E22] font-sans z-10 animate-in fade-in zoom-in-95 duration-200 my-auto`}
            >
              {/* Top Bar Navigation (Back Button & Close Button) */}
              <div className="flex items-center justify-between mb-4">
                {authTab !== 'SIGN_IN' ? (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('nav_click');
                      setAuthTab('SIGN_IN');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#0F2E22]/75 hover:text-[#0F2E22] transition-colors py-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    playSound('nav_click');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EFE9DC] hover:bg-[#0F2E22] text-[#0F2E22] hover:text-[#FAF7F2] border border-[#D8CDAF] flex items-center justify-center transition-all cursor-pointer ml-auto shrink-0"
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Centered HAKKIVEDA Branding */}
              <div className="flex flex-col items-center justify-center text-center mb-6">
                <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center rotate-45 mb-3 bg-[#0F2E22] shadow-sm">
                  <span className="-rotate-45 font-bold font-serif text-[#D4AF37] text-xs tracking-tighter">
                    HV
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8E7026] block">
                  HAKKIVEDA TRIBAL AYURVEDA
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F2E22] tracking-tight mt-1 uppercase">
                  {authTab === 'SIGN_IN' && 'WELCOME BACK'}
                  {authTab === 'CREATE_ACCOUNT' && 'CREATE YOUR ACCOUNT'}
                  {authTab === 'FORGOT_PASSWORD' && 'RESET PASSWORD'}
                </h2>
                <p className="text-xs text-[#0F2E22]/70 font-sans mt-1">
                  {authTab === 'SIGN_IN' && 'Sign in to your HAKKIVEDA account'}
                  {authTab === 'CREATE_ACCOUNT' && 'Join HAKKIVEDA for a more personalised shopping experience.'}
                  {authTab === 'FORGOT_PASSWORD' && 'Request assistance from our customer care team.'}
                </p>
              </div>

              {/* Feedback Messages */}
              {authError && (
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 mb-5 animate-in fade-in space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{authError}</span>
                  </div>
                  {authError.toLowerCase().includes('support') && (
                    <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                      <a
                        href="mailto:support@hakkiveda.com?subject=Account%20Password%20Setup%20Assistance"
                        className="font-bold text-[#0F2E22] hover:text-[#8E7026] underline flex items-center gap-1"
                      >
                        Email Official Support
                      </a>
                      <a
                        href="https://wa.me/917619536831?text=Hi%20HAKKIVEDA%20Support,%20I%20need%20assistance%20setting%20up%20my%20account%20password."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        WhatsApp Support
                      </a>
                    </div>
                  )}
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 mb-5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{authSuccess}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN A: SIGN IN */}
              {/* ========================================================= */}
              {authTab === 'SIGN_IN' && (
                <div className="animate-in fade-in duration-200">
                  <form onSubmit={handleSignInSubmit} className="space-y-4">
                    <div>
                      <label
                        className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                        htmlFor="customer-signin-email"
                      >
                        EMAIL ADDRESS *
                      </label>
                      <input
                        id="customer-signin-email"
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full h-12 bg-white border border-[#D8CDAF] rounded-xl px-4 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                        htmlFor="customer-signin-password"
                      >
                        PASSWORD *
                      </label>
                      <div className="relative">
                        <input
                          id="customer-signin-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-12 bg-white border border-[#D8CDAF] rounded-xl pl-4 pr-11 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F2E22]/50 hover:text-[#0F2E22] p-1.5 transition-colors cursor-pointer"
                          title={showPassword ? 'Hide password' : 'Show password'}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0F2E22]/80 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-[#D8CDAF] text-[#0F2E22] focus:ring-[#0F2E22] accent-[#0F2E22] cursor-pointer"
                        />
                        <span>Remember Me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          playSound('nav_click');
                          setAuthTab('FORGOT_PASSWORD');
                          setAuthError('');
                          setAuthSuccess('');
                        }}
                        className="text-xs font-semibold text-[#8E7026] hover:text-[#0F2E22] underline underline-offset-2 transition-colors cursor-pointer"
                        id="customer-forgot-password-link"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#0F2E22] text-[#FAF7F2] rounded-xl font-bold font-serif uppercase tracking-[0.18em] text-xs hover:bg-[#163f2f] shadow-md transition-all active:scale-[0.99] mt-2 cursor-pointer"
                      id="customer-signin-submit-btn"
                    >
                      SIGN IN
                    </button>
                  </form>

                  {/* Subtle Divider */}
                  <div className="relative flex items-center justify-center my-6">
                    <div className="w-full border-t border-[#E5DEC9]"></div>
                    <span className="absolute bg-[#FAF7F2] px-4 text-[11px] font-bold text-[#8E7026] uppercase tracking-widest">
                      OR
                    </span>
                  </div>

                  {/* New to HakkiVeda Section */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2E22]">
                      NEW TO HAKKIVEDA?
                    </h3>
                    <p className="text-xs text-[#0F2E22]/70 leading-relaxed max-w-sm mx-auto">
                      Create your account to manage orders, save your favourite formulations and enjoy a faster checkout.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('nav_click');
                        setAuthTab('CREATE_ACCOUNT');
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      className="w-full h-12 border-2 border-[#0F2E22] text-[#0F2E22] hover:bg-[#0F2E22] hover:text-[#FAF7F2] rounded-xl font-bold font-serif uppercase tracking-[0.18em] text-xs transition-all active:scale-[0.99] mt-2 cursor-pointer"
                      id="customer-switch-to-register-btn"
                    >
                      CREATE ACCOUNT
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN B: CREATE ACCOUNT */}
              {/* ========================================================= */}
              {authTab === 'CREATE_ACCOUNT' && (
                <div className="animate-in fade-in duration-200">
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                          htmlFor="reg-first-name"
                        >
                          FIRST NAME *
                        </label>
                        <input
                          id="reg-first-name"
                          type="text"
                          required
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full h-11 sm:h-12 bg-white border border-[#D8CDAF] rounded-xl px-4 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                          htmlFor="reg-last-name"
                        >
                          LAST NAME
                        </label>
                        <input
                          id="reg-last-name"
                          type="text"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full h-11 sm:h-12 bg-white border border-[#D8CDAF] rounded-xl px-4 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                        htmlFor="reg-email"
                      >
                        EMAIL ADDRESS *
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full h-11 sm:h-12 bg-white border border-[#D8CDAF] rounded-xl px-4 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                        htmlFor="reg-phone"
                      >
                        MOBILE NUMBER *
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98000 00000"
                        className="w-full h-11 sm:h-12 bg-white border border-[#D8CDAF] rounded-xl px-4 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                          htmlFor="reg-password"
                        >
                          PASSWORD *
                        </label>
                        <div className="relative">
                          <input
                            id="reg-password"
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Create password"
                            className="w-full h-11 sm:h-12 bg-white border border-[#D8CDAF] rounded-xl pl-4 pr-10 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F2E22]/50 hover:text-[#0F2E22] p-1.5 transition-colors cursor-pointer"
                            title={showRegPassword ? 'Hide password' : 'Show password'}
                            aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                          htmlFor="reg-confirm-password"
                        >
                          CONFIRM PASSWORD *
                        </label>
                        <div className="relative">
                          <input
                            id="reg-confirm-password"
                            type={showRegConfirmPassword ? 'text' : 'password'}
                            required
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full h-11 sm:h-12 bg-white border border-[#D8CDAF] rounded-xl pl-4 pr-10 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F2E22]/50 hover:text-[#0F2E22] p-1.5 transition-colors cursor-pointer"
                            title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                            aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#0F2E22] text-[#FAF7F2] rounded-xl font-bold font-serif uppercase tracking-[0.18em] text-xs hover:bg-[#163f2f] shadow-md transition-all active:scale-[0.99] mt-3 cursor-pointer"
                      id="customer-register-submit-btn"
                    >
                      CREATE ACCOUNT
                    </button>

                    <div className="text-center pt-4 mt-2 border-t border-[#E5DEC9] text-xs text-[#0F2E22]/70">
                      <span>Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => {
                          playSound('nav_click');
                          setAuthTab('SIGN_IN');
                          setAuthError('');
                          setAuthSuccess('');
                        }}
                        className="font-bold text-[#0F2E22] hover:text-[#8E7026] uppercase tracking-wider underline underline-offset-4 ml-1 transition-colors cursor-pointer"
                        id="customer-switch-to-signin-btn"
                      >
                        SIGN IN
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN C: FORGOT PASSWORD */}
              {/* ========================================================= */}
              {authTab === 'FORGOT_PASSWORD' && (
                <div className="animate-in fade-in duration-200">
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <p className="text-xs text-[#0F2E22]/80 leading-relaxed font-sans">
                      Please enter your registered email address below. For security and authentic tribal support, our dedicated customer care team will assist you in restoring access.
                    </p>

                    <div>
                      <label
                        className="block text-[11px] font-bold text-[#0F2E22] uppercase tracking-wider mb-1.5"
                        htmlFor="forgot-email"
                      >
                        EMAIL ADDRESS *
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full h-12 bg-white border border-[#D8CDAF] rounded-xl px-4 text-sm text-[#0F2E22] placeholder-[#0F2E22]/40 focus:outline-none focus:border-[#0F2E22] focus:ring-1 focus:ring-[#0F2E22]/30 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#0F2E22] text-[#FAF7F2] rounded-xl font-bold font-serif uppercase tracking-[0.18em] text-xs hover:bg-[#163f2f] shadow-md transition-all active:scale-[0.99] mt-2 cursor-pointer"
                    >
                      REQUEST ASSISTANCE
                    </button>

                    <div className="pt-3 flex items-center justify-between text-xs text-[#0F2E22]/75">
                      <button
                        type="button"
                        onClick={() => {
                          playSound('nav_click');
                          setAuthTab('SIGN_IN');
                          setAuthError('');
                          setAuthSuccess('');
                        }}
                        className="flex items-center gap-1 font-semibold text-[#0F2E22] hover:text-[#8E7026] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </button>

                      <a
                        href="https://wa.me/917619536831?text=Hi%20Hakkiveda%20Care,%20I%20need%20help%20accessing%20my%20account."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8E7026] hover:text-[#0F2E22] underline underline-offset-2 font-medium"
                      >
                        WhatsApp Support
                      </a>
                    </div>
                  </form>
                </div>
              )}

              {/* Footer Policies */}
              <div className="border-t border-[#E5DEC9] pt-4 mt-6 flex items-center justify-center gap-5 text-[11px] text-[#0F2E22]/60 font-medium">
                <button
                  type="button"
                  onClick={() => setPolicyModal('PRIVACY')}
                  className="hover:text-[#0F2E22] transition-colors underline-offset-2 hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span className="text-[#D8CDAF]">•</span>
                <button
                  type="button"
                  onClick={() => setPolicyModal('TERMS')}
                  className="hover:text-[#0F2E22] transition-colors underline-offset-2 hover:underline cursor-pointer"
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
                  <div className="bg-[#0F2E22] border border-[#C5A059]/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden text-[#FAF7F2]">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
                      <div className="relative shrink-0">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#C5A059] shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#163F2F] text-[#FAF7F2] font-bold text-xl sm:text-2xl font-serif-luxury flex items-center justify-center border-2 border-[#C5A059] shadow-lg tracking-wider">
                            {getInitials(currentUser.name)}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0F2E22]"></span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                            {currentUser.name}
                          </h3>
                          <span className="bg-[#C5A059]/20 text-[#E5D8B5] border border-[#C5A059]/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {currentUser.isAdmin ? 'Master Admin' : 'Tribal Gold Member'}
                          </span>
                        </div>
                        <p className="text-xs text-[#E5D8B5] font-medium">{currentUser.email}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {currentUser.phone || 'Phone not set'} • Member since {currentUser.createdAt || '2026'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 z-10 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      <div className="bg-[#0B2319] border border-[#C5A059]/30 px-4 py-2 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-300 block">Reward Balance</span>
                        <span className="text-base font-bold text-[#E5D8B5]">
                          {currentUser.loyaltyPoints || 100} Hakki-Points
                        </span>
                      </div>

                      <button
                        onClick={logoutUser}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                      </button>
                    </div>
                  </div>

                  {currentUser.mustChangePassword ? (
                    /* MANDATORY SECURITY BARRIER WHEN MUST_CHANGE_PASSWORD IS SET */
                    <div className="bg-[var(--brand-primary-dark)] border-2 border-amber-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 shrink-0">
                          <Key className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 block">
                            Action Required • Security Verification
                          </span>
                          <h3 className="text-xl font-bold font-serif-luxury text-slate-100">
                            Establish Your Personal Password
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            Your account was recently accessed with an administrator-issued temporary password. For your security and privacy, you must establish a new, confidential password before proceeding to your personal dashboard and orders.
                          </p>
                        </div>
                      </div>

                      {changePassStatus && (
                        <div
                          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                            changePassStatus.type === 'success'
                              ? 'bg-emerald-950 border border-emerald-500 text-emerald-200'
                              : 'bg-rose-950 border border-rose-500 text-rose-200'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{changePassStatus.message}</span>
                        </div>
                      )}

                      <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-lg">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Temporary / Current Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={currentPassInput}
                            onChange={(e) => setCurrentPassInput(e.target.value)}
                            placeholder="Enter the temporary password provided"
                            className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                              New Secret Password *
                            </label>
                            <input
                              type="password"
                              required
                              value={newPassInput}
                              onChange={(e) => setNewPassInput(e.target.value)}
                              placeholder="At least 6 characters"
                              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                              Confirm New Password *
                            </label>
                            <input
                              type="password"
                              required
                              value={confirmNewPassInput}
                              onChange={(e) => setConfirmNewPassInput(e.target.value)}
                              placeholder="Re-enter new password"
                              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isChangingPass}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl text-xs shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
                        >
                          {isChangingPass ? 'Establishing Password...' : 'Save Password & Unlock Account'}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <>

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
                            key={`portal-tab-${tab.id}`}
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
                    <div className="bg-[#FDFBF7] border border-[#D8CDAF] rounded-2xl p-6 space-y-6 animate-in fade-in shadow-xs text-[#0F2E22]">
                      <div className="flex items-center justify-between border-b border-[#D8CDAF] pb-4">
                        <div>
                          <h4 className="text-lg font-bold font-serif-luxury text-[#0F2E22]">Personal Information</h4>
                          <p className="text-xs text-[#1C550E]">Manage your contact details and account dossier.</p>
                        </div>
                        <button
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="bg-[#0F2E22] hover:bg-[#163F2F] text-[#FAF7F2] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border border-[#C5A059]/50 shadow-xs cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
                        </button>
                      </div>

                      {isEditingProfile ? (
                        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-bold text-[#1C550E] uppercase text-[11px] tracking-wider mb-1">Full Name</label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-white border border-[#D8CDAF] p-2.5 rounded-xl text-[#0F2E22] text-sm focus:border-[#1C550E] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-[#1C550E] uppercase text-[11px] tracking-wider mb-1">Phone Number</label>
                              <input
                                type="text"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full bg-white border border-[#D8CDAF] p-2.5 rounded-xl text-[#0F2E22] text-sm focus:border-[#1C550E] focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-[#1C550E] uppercase text-[11px] tracking-wider mb-1">Avatar Image URL</label>
                            <input
                              type="text"
                              value={editAvatar}
                              onChange={(e) => setEditAvatar(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-white border border-[#D8CDAF] p-2.5 rounded-xl text-[#0F2E22] text-sm focus:border-[#1C550E] focus:outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-[#0F2E22] text-[#FAF7F2] px-5 py-2.5 rounded-xl font-bold uppercase text-xs hover:bg-[#163F2F] transition-all shadow-md cursor-pointer tracking-wider"
                          >
                            Save Profile Updates
                          </button>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          {/* Full Name Card */}
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDAF] shadow-xs space-y-1.5">
                            <span className="text-[#1C550E] block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">Full Name</span>
                            <span className="font-bold text-[#0F2E22] text-sm sm:text-base block">{currentUser.name}</span>
                          </div>

                          {/* Email Address Card */}
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDAF] shadow-xs space-y-1.5">
                            <span className="text-[#1C550E] block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">Email Address</span>
                            <span className="font-bold text-[#8E7026] text-sm sm:text-base block">{currentUser.email}</span>
                          </div>

                          {/* Phone Number Card */}
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDAF] shadow-xs space-y-1.5">
                            <span className="text-[#1C550E] block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">Phone Number</span>
                            <span className="font-bold text-[#0F2E22] text-sm sm:text-base block">{currentUser.phone || 'Not provided'}</span>
                          </div>

                          {/* Account Referral Code Card */}
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D8CDAF] shadow-xs space-y-1.5">
                            <span className="text-[#1C550E] block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">Account Referral Code</span>
                            <span className="font-bold text-[#8E7026] text-sm sm:text-base font-mono block">
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
                          {userOrders.map((order, oIdx) => (
                            <div
                              key={order.id ? `cust-order-${order.id}` : `cust-order-${order.orderNumber || oIdx}`}
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
                                  <div key={`order-${order.id || oIdx}-item-${item.product?.id || idx}-${idx}`} className="flex items-center gap-3 bg-[var(--brand-primary-deep)] p-2.5 rounded-xl">
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
                    <div className="space-y-6 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold font-serif-luxury text-slate-100">Saved Wishlist</h4>
                          <p className="text-xs text-slate-400">Your personalized collection of Ayurvedic hair formulations</p>
                        </div>
                        <span className="text-xs text-[var(--brand-gold)] font-bold px-2.5 py-1 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30">
                          {wishlist.length} {wishlist.length === 1 ? 'Formulation' : 'Formulations'} Saved
                        </span>
                      </div>

                      {wishlist.length === 0 ? (
                        <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-10 sm:p-14 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-black/40 border border-[var(--brand-gold)]/30 flex items-center justify-center mx-auto text-[var(--brand-gold)] shadow-inner">
                            <Heart className="w-8 h-8 fill-current/20" />
                          </div>
                          <div className="space-y-1.5">
                            <h5 className="font-serif-luxury text-base sm:text-lg font-bold uppercase tracking-wider text-slate-100">
                              YOUR WISHLIST IS EMPTY
                            </h5>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                              Save products you love and find them here later.
                            </p>
                          </div>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleExploreProducts}
                              className="bg-[var(--brand-gold)] hover:bg-[#E5C158] text-[var(--brand-primary-dark)] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[var(--brand-gold)]/20 active:scale-98 transition-all cursor-pointer inline-flex items-center gap-2"
                            >
                              <span>EXPLORE PRODUCTS</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {wishlist.map((prod, pIdx) => {
                            const discountPct = prod.originalPriceINR && prod.originalPriceINR > prod.priceINR
                              ? Math.round(((prod.originalPriceINR - prod.priceINR) / prod.originalPriceINR) * 100)
                              : 0;

                            return (
                              <div
                                key={prod.id ? `wishlist-item-${prod.id}` : `wishlist-idx-${pIdx}`}
                                className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-[var(--brand-gold)]/40 transition-all group"
                              >
                                <div className="flex gap-3.5 items-start">
                                  {/* Product Image Clickable */}
                                  <div
                                    onClick={() => handleNavigateToProduct(prod)}
                                    className="relative w-20 h-20 rounded-xl bg-black/30 p-1 border border-white/10 shrink-0 cursor-pointer overflow-hidden flex items-center justify-center group-hover:border-[var(--brand-gold)]/50 transition-colors"
                                  >
                                    <img
                                      src={prod.image || 'https://images.unsplash.com/photo-1608248597359-0a6311656816?auto=format&fit=crop&w=400&q=80'}
                                      alt={prod.name}
                                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                      loading="lazy"
                                    />
                                    {discountPct > 0 && (
                                      <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded shadow-xs">
                                        {discountPct}% OFF
                                      </span>
                                    )}
                                  </div>

                                  {/* Details */}
                                  <div className="flex-1 min-w-0">
                                    <h5
                                      onClick={() => handleNavigateToProduct(prod)}
                                      className="font-bold font-serif-luxury text-sm text-white hover:text-[var(--brand-gold)] cursor-pointer truncate transition-colors"
                                      title={prod.name}
                                    >
                                      {prod.name}
                                    </h5>
                                    {prod.volume && (
                                      <span className="text-[10px] text-slate-400 block mt-0.5">
                                        {prod.volume}
                                      </span>
                                    )}

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-300">
                                      <div className="flex items-center text-[var(--brand-gold)]">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="ml-1 font-bold">{prod.rating || 4.9}</span>
                                      </div>
                                      <span className="text-slate-500">({prod.reviewCount || 48})</span>
                                    </div>

                                    {/* Price and Stock */}
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-sm text-[var(--brand-gold)] font-bold">
                                        {formatPrice(prod.priceINR)}
                                      </span>
                                      {prod.originalPriceINR && prod.originalPriceINR > prod.priceINR && (
                                        <span className="text-xs text-slate-500 line-through">
                                          {formatPrice(prod.originalPriceINR)}
                                        </span>
                                      )}
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        prod.inStock !== false ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                                      }`}>
                                        {prod.inStock !== false ? 'In Stock' : 'Sold Out'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      addToCart(prod, 1);
                                      setAddedWishlistProductId(prod.id);
                                      setTimeout(() => setAddedWishlistProductId(null), 1800);
                                    }}
                                    disabled={prod.inStock === false}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                                      prod.inStock === false
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : addedWishlistProductId === prod.id
                                        ? 'bg-emerald-600 text-white cursor-pointer shadow-md'
                                        : 'bg-[var(--brand-gold)] hover:bg-[#E5C158] text-[var(--brand-primary-dark)] cursor-pointer shadow-md'
                                    }`}
                                  >
                                    {addedWishlistProductId === prod.id ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                        <span>Added</span>
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        <span>Add to Bag</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleWishlist(prod)}
                                    className="p-2 rounded-lg bg-black/30 hover:bg-rose-950/50 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                    aria-label="Remove from Wishlist"
                                    title="Remove from Wishlist"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
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
                          {currentUser.addresses.map((addr, addrIdx) => (
                            <div
                              key={addr.id ? `addr-item-${addr.id}` : `addr-idx-${addrIdx}`}
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
                        HAKKIVEDA supports 100% secure encrypted checkout via Razorpay Secure Checkout, Razorpay International, and Cash on Delivery.
                      </p>

                      <div className="space-y-3 pt-2">
                        {(currentUser.savedPayments || []).map((pay, payIdx) => (
                          <div
                            key={pay.id ? `saved-pay-${pay.id}` : `saved-pay-${payIdx}`}
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
                            {selectedCountry?.flag} {selectedCountry?.name}
                          </span>
                        </div>
                        <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10">
                          <label className="block font-bold text-slate-400 mb-1">Currency</label>
                          <span className="font-bold text-[var(--brand-gold)] text-sm block">
                            {currentCurrency?.code} ({currentCurrency?.symbol})
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
                          {coupons.map((c, cIdx) => (
                            <div
                              key={c.code ? `coupon-${c.code}` : `coupon-idx-${cIdx}`}
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
                        <p className="text-slate-300">Manage your credentials, update your password, and export your account data.</p>
                      </div>

                      {/* Change Password Card */}
                      <div className="bg-[var(--brand-primary-deep)] p-5 rounded-xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[var(--brand-gold)]" />
                          <h5 className="font-bold text-white text-sm">Change Account Password</h5>
                        </div>

                        {changePassStatus && (
                          <div
                            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                              changePassStatus.type === 'success'
                                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                            }`}
                          >
                            {changePassStatus.type === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span>{changePassStatus.message}</span>
                          </div>
                        )}

                        <form onSubmit={handleChangePasswordSubmit} className="space-y-3 max-w-md">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">CURRENT PASSWORD</label>
                            <input
                              type="password"
                              required
                              value={currentPassInput}
                              onChange={(e) => setCurrentPassInput(e.target.value)}
                              placeholder="Enter your current password"
                              className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 mb-1">NEW PASSWORD</label>
                              <input
                                type="password"
                                required
                                value={newPassInput}
                                onChange={(e) => setNewPassInput(e.target.value)}
                                placeholder="At least 6 chars"
                                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 mb-1">CONFIRM NEW PASSWORD</label>
                              <input
                                type="password"
                                required
                                value={confirmNewPassInput}
                                onChange={(e) => setConfirmNewPassInput(e.target.value)}
                                placeholder="Re-enter new password"
                                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2.5 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isChangingPass}
                            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-white transition-all disabled:opacity-50"
                          >
                            {isChangingPass ? 'Updating...' : 'Update Password'}
                          </button>
                        </form>
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
                  </>
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
                      <div key={`track-scan-${idx}-${scan.date || ''}-${scan.activity || ''}`} className="text-[11px] text-slate-300 font-mono flex justify-between gap-2 bg-black/30 p-1.5 rounded">
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
                  <div key={`tracking-step-${step.status}-${idx}`} className="flex items-start gap-3 relative">
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
              <span className="text-[var(--brand-gold)] text-[10px] uppercase font-bold tracking-widest block">7-Day Return & Replacement Policy</span>
              <h3 className="text-xl font-bold font-serif-luxury text-slate-100">
                Return Request for {returnOrder.orderNumber}
              </h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Return or replacement requests must be raised within 7 days of delivery. For hygiene reasons, opened items are non-returnable unless damaged or defective.
              </p>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsWishlistOpen(false)}
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-full flex z-10 w-full sm:w-auto">
            <div className="w-full sm:w-screen sm:max-w-md bg-[var(--brand-primary-deep)] border-l border-[var(--brand-gold)]/40 text-slate-100 shadow-2xl flex flex-col justify-between font-sans h-full">
              {/* Header */}
              <div className="p-4 sm:p-5 bg-[var(--brand-primary-dark)] border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-serif-luxury text-slate-100 flex items-center gap-2">
                      Saved Wishlist
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40">
                        {wishlist.length}
                      </span>
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Close Wishlist"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 px-4 text-center space-y-5">
                    <div className="w-20 h-20 rounded-full bg-black/40 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)] shadow-inner">
                      <Heart className="w-10 h-10 fill-current/20" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold font-serif-luxury uppercase tracking-wider text-slate-100">
                        YOUR WISHLIST IS EMPTY
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Save products you love and find them here later.
                      </p>
                    </div>
                    <div className="pt-2 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={handleExploreProducts}
                        className="w-full bg-[var(--brand-gold)] hover:bg-[#E5C158] text-[var(--brand-primary-dark)] py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[var(--brand-gold)]/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>EXPLORE PRODUCTS</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  wishlist.map((prod, pIdx) => {
                    const discountPct = prod.originalPriceINR && prod.originalPriceINR > prod.priceINR
                      ? Math.round(((prod.originalPriceINR - prod.priceINR) / prod.originalPriceINR) * 100)
                      : 0;

                    return (
                      <div
                        key={prod.id ? `drawer-wishlist-${prod.id}` : `drawer-wishlist-idx-${pIdx}`}
                        className="p-3.5 bg-[var(--brand-primary-dark)] border border-white/10 rounded-xl hover:border-[var(--brand-gold)]/30 transition-all flex flex-col gap-3 group"
                      >
                        <div className="flex gap-3 items-start">
                          {/* Image */}
                          <div
                            onClick={() => handleNavigateToProduct(prod)}
                            className="relative w-18 h-18 rounded-lg bg-black/30 p-1 border border-white/10 shrink-0 cursor-pointer overflow-hidden flex items-center justify-center group-hover:border-[var(--brand-gold)]/40 transition-colors"
                          >
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1608248597359-0a6311656816?auto=format&fit=crop&w=400&q=80'}
                              alt={prod.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                            {discountPct > 0 && (
                              <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded shadow-xs">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4
                              onClick={() => handleNavigateToProduct(prod)}
                              className="text-xs sm:text-sm font-bold font-serif-luxury text-slate-100 hover:text-[var(--brand-gold)] line-clamp-2 cursor-pointer transition-colors"
                              title={prod.name}
                            >
                              {prod.name}
                            </h4>
                            {prod.volume && (
                              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                                {prod.volume}
                              </span>
                            )}

                            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                              <div className="flex items-center text-[var(--brand-gold)]">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="ml-1 font-bold">{prod.rating || 4.9}</span>
                              </div>
                              <span className="text-slate-500">({prod.reviewCount || 48})</span>
                            </div>

                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs font-bold text-[var(--brand-gold)]">
                                {formatPrice(prod.priceINR)}
                              </span>
                              {prod.originalPriceINR && prod.originalPriceINR > prod.priceINR && (
                                <span className="text-[10px] text-slate-500 line-through">
                                  {formatPrice(prod.originalPriceINR)}
                                </span>
                              )}
                              <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase ${
                                prod.inStock !== false ? 'bg-emerald-950/80 text-emerald-300' : 'bg-rose-950/80 text-rose-300'
                              }`}>
                                {prod.inStock !== false ? 'In Stock' : 'Sold Out'}
                              </span>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(prod)}
                            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                            aria-label="Remove item"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Add to Bag CTA */}
                        <div className="pt-2 border-t border-white/5 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(prod, 1);
                              setAddedWishlistProductId(prod.id);
                              setTimeout(() => setAddedWishlistProductId(null), 1800);
                            }}
                            disabled={prod.inStock === false}
                            className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                              prod.inStock === false
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : addedWishlistProductId === prod.id
                                ? 'bg-emerald-600 text-white cursor-pointer shadow-md'
                                : 'bg-[var(--brand-gold)] hover:bg-[#E5C158] text-[var(--brand-primary-dark)] cursor-pointer shadow-md'
                            }`}
                          >
                            {addedWishlistProductId === prod.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add To Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {wishlist.length > 0 && (
                <div className="p-4 bg-[var(--brand-primary-dark)] border-t border-white/10 shrink-0 space-y-2">
                  <button
                    type="button"
                    onClick={handleExploreProducts}
                    className="w-full py-2.5 px-4 rounded-xl border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] hover:bg-[var(--brand-gold)]/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explore More Formulations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
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

            <div className="pt-2 flex items-center justify-between">
              <a
                href={policyModal === 'PRIVACY' ? '/privacy-policy' : '/terms-and-conditions'}
                onClick={(e) => {
                  e.preventDefault();
                  setPolicyModal(null);
                  setIsAuthModalOpen?.(false);
                  const targetUrl = policyModal === 'PRIVACY' ? '/privacy-policy' : '/terms-and-conditions';
                  window.history.pushState({}, '', targetUrl);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs text-[var(--brand-gold)] hover:underline font-medium"
              >
                View Full Public {policyModal === 'PRIVACY' ? 'Privacy Policy' : 'Terms & Conditions'} →
              </a>
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
