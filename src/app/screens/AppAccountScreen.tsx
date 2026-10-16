import React, { useState } from 'react';
import { User, Heart, MapPin, MessageCircle, Phone, Bell, Shield, LogOut, ChevronRight, Check, Edit2, Trash2, Plus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

import { MobileAppSettings } from '../../types/mobileApp';

interface AppAccountScreenProps {
  onOpenWishlist: () => void;
  onNavigateToOrders: () => void;
  appSettings?: MobileAppSettings;
}

export const AppAccountScreen: React.FC<AppAccountScreenProps> = ({
  onOpenWishlist,
  onNavigateToOrders,
  appSettings,
}) => {
  const {
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    changeCustomerPassword,
    siteSettings,
    wishlist,
  } = useStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'REGISTER' | 'FORGOT_PASSWORD'>('SIGN_IN');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showAddressEditor, setShowAddressEditor] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  const [addressTitle, setAddressTitle] = useState('Home');
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressCountry, setAddressCountry] = useState('India');
  const [addressPincode, setAddressPincode] = useState('');

  const [showPasswordEditor, setShowPasswordEditor] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const rawWa = appSettings?.whatsappNumber || siteSettings?.socialWhatsapp || '+917619536831';
  const whatsappNum = rawWa.replace(/[^\d]/g, '') || '917619536831';
  const supportPhone = appSettings?.contactPhone || siteSettings?.contactPhone || '+917619536831';
  const supportEmail = appSettings?.supportEmail || siteSettings?.contactEmail || 'support@hakkiveda.com';

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMessage('');

    const email = authEmail.trim();

    if (!email) {
      setAuthError('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setAuthSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setAuthMessage(
        data.message || `Password assistance request received for ${email}.`
      );
    } catch {
      setAuthError('Unable to process password assistance right now.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMessage('');

    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please enter your email and password.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const res = await loginUser(authEmail.trim(), authPassword);
      if (res.success) {
        setAuthMessage(res.message);
        setAuthEmail('');
        setAuthPassword('');
      } else {
        setAuthError(res.message);
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMessage('');

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword) {
      setAuthError('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const res = await registerUser({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      if (res.success) {
        setAuthMessage(res.message);
        setRegName('');
        setRegPhone('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
      } else {
        setAuthError(res.message);
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus('');

    if (!currentPasswordInput) {
      setPasswordStatus('Please enter your current password.');
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordStatus('New password must be at least 6 characters.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatus('New passwords do not match.');
      return;
    }

    setPasswordSubmitting(true);

    const result = await changeCustomerPassword(
      currentPasswordInput,
      newPasswordInput
    );

    setPasswordStatus(result.message);
    setPasswordSubmitting(false);

    if (result.success) {
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    await updateUserProfile({
      name: profileName.trim() || currentUser.name,
      phone: profilePhone.trim(),
    });

    setShowProfileEditor(false);
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressTitle('Home');
    setAddressName(currentUser?.name || '');
    setAddressPhone(currentUser?.phone || '');
    setAddressLine1('');
    setAddressCity('');
    setAddressState('');
    setAddressCountry('India');
    setAddressPincode('');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const addressData = {
      title: addressTitle.trim() || 'Home',
      name: addressName.trim(),
      phone: addressPhone.trim(),
      line1: addressLine1.trim(),
      city: addressCity.trim(),
      state: addressState.trim(),
      country: addressCountry.trim() || 'India',
      pincode: addressPincode.trim(),
      isDefault: currentUser.addresses?.length ? false : true,
    };

    if (
      !addressData.name ||
      !addressData.phone ||
      !addressData.line1 ||
      !addressData.city ||
      !addressData.state ||
      !addressData.pincode
    ) {
      return;
    }

    if (editingAddressId) {
      updateSavedAddress(editingAddressId, addressData);
    } else {
      addSavedAddress(addressData);
    }

    setShowAddressEditor(false);
    resetAddressForm();
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
      'Namaste HAKKIVEDA! I need consultation regarding my hair regimen.'
    )}`;
    window.open(url, '_system');
  };

  const handleCallSupport = () => {
    window.open(`tel:${supportPhone}`, '_system');
  };

  return (
    <div className="w-full pb-24 px-4 pt-3">
      {/* Profile Header */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#0E382C] via-[#134E3F] to-[#07241C] text-white shadow-md border border-[#C5A059]/30 mb-4 app-dark-card">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center font-bold text-xl shadow-inner">
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-7 h-7 text-[#C5A059]" />}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif text-base font-bold text-[#FDF8EC] leading-tight dark-heading">
                {currentUser ? currentUser.name : 'Welcome, Sacred Seeker'}
              </h2>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5 font-sans">
              {currentUser ? currentUser.email : 'Explore 108 Sacred Forest Herbal Remedies'}
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1 bg-[#C5A059]/15 border border-[#C5A059]/30 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#C5A059] uppercase tracking-wider">
              <span>HAKKIVEDA Tribal Club Member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Authentication */}
      {!currentUser ? (
        <div className="bg-white rounded-3xl border border-emerald-950/10 shadow-sm p-4 mb-4">
          <div className="flex bg-[#FAF7F2] rounded-2xl p-1 mb-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('SIGN_IN');
                setAuthError('');
                setAuthMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'SIGN_IN'
                  ? 'bg-[#0E382C] text-white shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('REGISTER');
                setAuthError('');
                setAuthMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'REGISTER'
                  ? 'bg-[#0E382C] text-white shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="mb-3 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] font-medium text-rose-700">
              {authError}
            </div>
          )}

          {authMessage && (
            <div className="mb-3 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] font-medium text-emerald-800">
              {authMessage}
            </div>
          )}

          {authMode === 'FORGOT_PASSWORD' ? (
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div className="text-sm font-bold text-slate-900">Reset Password</div>
              <p className="text-[11px] text-slate-500">
                Enter your registered email address for password assistance.
              </p>

              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Registered email address"
                autoComplete="email"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 rounded-xl bg-[#0E382C] text-[#FDF8EC] text-xs font-bold disabled:opacity-60"
              >
                {authSubmitting ? 'Submitting...' : 'Continue'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGN_IN');
                  setAuthError('');
                  setAuthMessage('');
                }}
                className="w-full h-10 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
              >
                Back to Sign In
              </button>
            </form>
          ) : authMode === 'SIGN_IN' ? (
            <form onSubmit={handleSignIn} className="space-y-3">
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />
              <button
                type="button"
                onClick={() => {
                  setAuthMode('FORGOT_PASSWORD');
                  setAuthError('');
                  setAuthMessage('');
                }}
                className="w-full text-right text-[11px] font-bold text-[#8E7026]"
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 rounded-xl bg-[#0E382C] text-[#FDF8EC] text-xs font-bold disabled:opacity-60"
              >
                {authSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Full name"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="Mobile number"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Password (minimum 6 characters)"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />
              <input
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full h-11 rounded-xl border border-emerald-950/15 bg-[#FAF7F2] px-3 text-sm outline-none focus:border-[#0E382C]"
              />
              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 rounded-xl bg-[#0E382C] text-[#FDF8EC] text-xs font-bold disabled:opacity-60"
              >
                {authSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          <div className="bg-white rounded-3xl border border-emerald-950/10 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                {currentUser.phone && (
                  <div className="text-[11px] text-slate-500">{currentUser.phone}</div>
                )}
              </div>

              <button
                type="button"
                onClick={logoutUser}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-bold text-rose-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileName(currentUser.name || '');
                setProfilePhone(currentUser.phone || '');
                setShowProfileEditor(!showProfileEditor);
              }}
              className="mt-3 w-full rounded-xl border border-emerald-950/10 bg-[#FAF7F2] px-3 py-2.5 flex items-center justify-between text-xs font-bold text-[#0E382C]"
            >
              <span className="flex items-center gap-2">
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {showProfileEditor && (
              <form onSubmit={handleSaveProfile} className="mt-3 space-y-2">
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Full name"
                  className="w-full h-10 rounded-xl border border-emerald-950/15 px-3 text-sm"
                />
                <input
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="Mobile number"
                  className="w-full h-10 rounded-xl border border-emerald-950/15 px-3 text-sm"
                />
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-[#0E382C] text-white text-xs font-bold"
                >
                  Save Profile
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setShowPasswordEditor(!showPasswordEditor);
                setPasswordStatus('');
              }}
              className="mt-3 w-full rounded-xl border border-emerald-950/10 bg-[#FAF7F2] px-3 py-2.5 flex items-center justify-between text-xs font-bold text-[#0E382C]"
            >
              <span>Change Password</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {showPasswordEditor && (
              <form onSubmit={handleChangePassword} className="mt-3 space-y-2">
                <input
                  type="password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Current password"
                  className="w-full h-10 rounded-xl border border-emerald-950/15 px-3 text-sm"
                />

                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="New password"
                  className="w-full h-10 rounded-xl border border-emerald-950/15 px-3 text-sm"
                />

                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-10 rounded-xl border border-emerald-950/15 px-3 text-sm"
                />

                {passwordStatus && (
                  <div className="text-[11px] text-slate-600">
                    {passwordStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="w-full h-10 rounded-xl bg-[#0E382C] text-white text-xs font-bold disabled:opacity-60"
                >
                  {passwordSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-emerald-950/10 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Saved Addresses</h3>
                <p className="text-[10px] text-slate-500">Manage delivery addresses</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetAddressForm();
                  setShowAddressEditor(true);
                }}
                className="w-8 h-8 rounded-xl bg-[#0E382C] text-white flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {(currentUser.addresses || []).map((addr) => (
              <div key={addr.id} className="border-t border-slate-100 py-3 first:border-t-0">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="text-xs font-bold text-slate-900">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {addr.name}, {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-[10px] text-slate-500">{addr.phone}</p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddressId(addr.id);
                        setAddressTitle(addr.title);
                        setAddressName(addr.name);
                        setAddressPhone(addr.phone);
                        setAddressLine1(addr.line1);
                        setAddressCity(addr.city);
                        setAddressState(addr.state);
                        setAddressCountry(addr.country);
                        setAddressPincode(addr.pincode);
                        setShowAddressEditor(true);
                      }}
                      className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSavedAddress(addr.id)}
                      className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="mt-2 text-[10px] font-bold text-[#0E382C]"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}

            {showAddressEditor && (
              <form onSubmit={handleSaveAddress} className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                {[
                  [addressTitle, setAddressTitle, 'Label (Home / Office)'],
                  [addressName, setAddressName, 'Full name'],
                  [addressPhone, setAddressPhone, 'Phone'],
                  [addressLine1, setAddressLine1, 'Address'],
                  [addressCity, setAddressCity, 'City'],
                  [addressState, setAddressState, 'State'],
                  [addressCountry, setAddressCountry, 'Country'],
                  [addressPincode, setAddressPincode, 'Pincode'],
                ].map(([value, setter, placeholder], i) => (
                  <input
                    key={i}
                    value={value as string}
                    onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                    placeholder={placeholder as string}
                    className="w-full h-10 rounded-xl border border-emerald-950/15 px-3 text-sm"
                  />
                ))}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-[#0E382C] text-white text-xs font-bold"
                  >
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressEditor(false);
                      resetAddressForm();
                    }}
                    className="px-4 h-10 rounded-xl bg-slate-100 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions List */}
      <div className="bg-white rounded-3xl border border-emerald-950/10 shadow-sm overflow-hidden mb-4">
        <button
          type="button"
          onClick={onNavigateToOrders}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E382C] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#0E382C]" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold text-slate-900">My Orders & Tracking</h3>
              <p className="text-[10px] text-slate-500">View active shipments and invoices</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onOpenWishlist}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold text-slate-900">Wishlist & Saved Remedies</h3>
              <p className="text-[10px] text-slate-500">{wishlist.length} remedies bookmarked</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <div className="w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-bold text-slate-900">Order Updates & Push Alerts</h3>
              <p className="text-[10px] text-slate-500">Dispatch notifications via WhatsApp & SMS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              notificationsEnabled ? 'bg-[#0E382C]' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Support & Tribal Vaidya Consultation */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-950/10 shadow-sm mb-4 space-y-2.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Direct Tribal Assistance
        </h3>

        <button
          type="button"
          onClick={handleOpenWhatsApp}
          className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">WhatsApp Hair Care Support</div>
              <div className="text-[10px] text-emerald-700">Official WhatsApp: +{whatsappNum}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700" />
        </button>

        <button
          type="button"
          onClick={handleCallSupport}
          className="w-full p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3ECE1] border border-emerald-950/10 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0E382C] text-[#C5A059] flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Call Forest Helpdesk</div>
              <div className="text-[10px] text-slate-500">10:00 AM - 7:00 PM IST ({supportPhone})</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center py-2">
        <span className="text-[10px] font-mono text-slate-400">
          HAKKIVEDA • Version 1.0.0
        </span>
      </div>
    </div>
  );
};
