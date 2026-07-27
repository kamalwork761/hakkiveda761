import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalINR,
    cartTotalINR,
    formatPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmountINR,
    setIsCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const freeShippingThresholdINR = 1500;
  const progressPercent = Math.min(100, Math.round((cartSubtotalINR / freeShippingThresholdINR) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#072a20] border-l border-[#C8A24A]/40 text-slate-100 shadow-2xl flex flex-col justify-between font-sans">
          {/* Cart Header */}
          <div className="p-6 bg-[#0B3D2E] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C8A24A]" />
              <h2 className="text-xl font-bold font-serif-luxury text-slate-100">Your Tribal Herbal Bag</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-black/30 px-6 py-3 border-b border-white/10 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#C8A24A] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {cartSubtotalINR >= freeShippingThresholdINR
                    ? '🎉 You unlocked Free Express Worldwide Shipping!'
                    : `Add ${formatPrice(freeShippingThresholdINR - cartSubtotalINR)} for Free Shipping`}
                </span>
              </span>
            </div>
            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C8A24A] h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
                <p className="text-slate-300 text-sm font-serif-luxury">Your herbal cart is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#C8A24A] text-[#0B3D2E] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-[#0B3D2E] border border-white/10 rounded-xl hover:border-[#C8A24A]/40 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain rounded-lg shrink-0 border border-white/10 bg-black/30 p-1"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-xs font-bold font-serif-luxury text-slate-100 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-[#C8A24A]">{item.product.volume}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-white/20 rounded overflow-hidden bg-black/30">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-300"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-300"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#C8A24A]">
                        {formatPrice(item.product.priceINR * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#0B3D2E] border-t border-white/10 space-y-4">
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-1.5 text-xs text-slate-100 uppercase placeholder-slate-400 focus:outline-none focus:border-[#C8A24A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-1.5 rounded text-xs font-bold uppercase"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[10px] ${
                      couponMessage.success ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded text-xs text-emerald-400 mt-2">
                    <span className="flex items-center gap-1 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code: {appliedCoupon.code}</span>
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-300 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Order Summary breakdown */}
              <div className="space-y-1.5 text-xs border-t border-white/10 pt-3">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotalINR)}</span>
                </div>
                {discountAmountINR > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmountINR)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>{cartSubtotalINR >= freeShippingThresholdINR ? 'FREE' : formatPrice(150)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#C8A24A] border-t border-white/10 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(cartTotalINR + (cartSubtotalINR >= freeShippingThresholdINR ? 0 : 150))}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-[#C8A24A] text-[#0B3D2E] py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
