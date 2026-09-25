import React, { useState } from 'react';
import { User, Heart, MapPin, MessageCircle, Phone, Bell, Shield, LogOut, ChevronRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AppAccountScreenProps {
  onOpenWishlist: () => void;
  onNavigateToOrders: () => void;
}

export const AppAccountScreen: React.FC<AppAccountScreenProps> = ({
  onOpenWishlist,
  onNavigateToOrders,
}) => {
  const { currentCustomer, logoutCustomer, siteSettings, wishlist } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const whatsappNum = siteSettings?.socialWhatsapp || '919900110800';
  const supportPhone = siteSettings?.contactPhone || '+91 99001 10800';

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
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#0E382C] via-[#134E3F] to-[#07241C] text-white shadow-md border border-[#C5A059]/30 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center font-bold text-xl shadow-inner">
            {currentCustomer ? currentCustomer.name.charAt(0).toUpperCase() : <User className="w-7 h-7 text-[#C5A059]" />}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif text-base font-bold text-[#FDF8EC] leading-tight">
                {currentCustomer ? currentCustomer.name : 'Welcome, Sacred Seeker'}
              </h2>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5 font-sans">
              {currentCustomer ? currentCustomer.email : 'Explore 108 Sacred Forest Herbal Remedies'}
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1 bg-[#C5A059]/15 border border-[#C5A059]/30 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#C5A059] uppercase tracking-wider">
              <span>HAKKIVEDA Tribal Club Member</span>
            </div>
          </div>
        </div>
      </div>

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
              <div className="text-xs font-bold text-emerald-950">Chat with Senior Vaidya</div>
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
          HAKKIVEDA Android Native Edition • v1.0.0
        </span>
      </div>
    </div>
  );
};
