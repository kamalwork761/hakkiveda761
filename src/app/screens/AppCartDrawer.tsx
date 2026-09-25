import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onExploreShop: () => void;
}

export const AppCartDrawer: React.FC<AppCartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onExploreShop,
}) => {
  const { cart, updateQuantity, removeFromCart, appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount || 200 : 0;
  const shipping = subtotal >= 499 ? 0 : 70;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const freeDeliveryThreshold = 499;
  const amountToFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    if (couponInput.trim().toUpperCase() === 'TRIBAL200') {
      applyCoupon({
        code: 'TRIBAL200',
        discountAmount: 200,
        type: 'FIXED',
      } as any);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try TRIBAL200 for ₹200 off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div
        className="relative z-10 w-full max-h-[90vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="pt-3 pb-2.5 px-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0E382C]" />
            <h2 className="font-serif text-base font-bold text-slate-900">
              Your Sacred Cart ({cart.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#FAF7F2] px-4 py-2 border-b border-emerald-950/10">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
            <span>
              {amountToFreeShipping === 0 ? (
                <strong className="text-emerald-800">You unlocked FREE Express Shipping!</strong>
              ) : (
                <>Add <strong className="text-[#0E382C]">₹{amountToFreeShipping}</strong> more for Free Shipping</>
              )}
            </span>
            <span className="text-[10px] font-bold text-[#0E382C]">{shippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0E382C] transition-all duration-300"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Your remedy bag is empty</p>
              <p className="text-xs text-slate-500 mt-1">Discover handcrafted 108 tribal herb formulations.</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreShop();
                }}
                className="mt-4 px-5 py-2 rounded-full bg-[#0E382C] text-[#C5A059] font-bold text-xs shadow-sm"
              >
                Explore Remedies
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const imgSrc = resolveAssetUrl(item.product.image);
              return (
                <div key={item.product.id} className="py-3 flex gap-3 items-center">
                  <img
                    src={imgSrc}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    {item.variant && (
                      <span className="text-[10px] text-slate-500 block">
                        Volume: {item.variant.name}
                      </span>
                    )}
                    <div className="text-xs font-bold text-[#0E382C] mt-1">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.product.id, item.quantity - 1);
                        } else {
                          removeFromCart(item.product.id);
                        }
                      }}
                      className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-black shadow-xs"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-600 hover:text-black shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary if items exist */}
        {cart.length > 0 && (
          <div className="bg-[#FAF7F2] p-4 border-t border-emerald-950/10 space-y-3 pb-[max(14px,env(safe-area-inset-bottom))]">
            {/* Coupon Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. TRIBAL200)"
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-xl text-xs uppercase font-mono tracking-wider border border-slate-300 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#0E382C] text-[#C5A059] font-bold text-xs"
                >
                  Apply
                </button>
              </form>
              {couponError && (
                <span className="text-[10px] text-rose-600 mt-1 block">{couponError}</span>
              )}
              {appliedCoupon && (
                <div className="mt-1.5 flex items-center justify-between text-xs text-emerald-800 font-bold bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                  <span>Coupon {appliedCoupon.code} applied!</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 text-[10px] underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-1 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Tribal Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>{shipping === 0 ? <strong className="text-emerald-800">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-[#0E382C] text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#0E382C] text-[#C5A059] font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:bg-[#134E3F] active:scale-98 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
