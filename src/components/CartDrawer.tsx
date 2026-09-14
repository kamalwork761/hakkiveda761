import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, Shield, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getAuthoritativeShippingQuote } from '../utils/shipping';

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
    selectedCountry,
    getProductEffectivePriceINR,
    checkProductCountryAvailability,
    siteSettings,
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

  const isIndia = !selectedCountry?.code || selectedCountry.code === 'IN' || selectedCountry.name?.toLowerCase() === 'india';

  const shippingQuote = getAuthoritativeShippingQuote(
    cartSubtotalINR,
    selectedCountry?.code || selectedCountry?.name,
    null,
    undefined,
    siteSettings
  );

  const showFreeShippingBar = isIndia || Boolean(
    siteSettings?.internationalFreeShippingEnabled &&
    typeof siteSettings?.internationalFreeShippingThresholdINR === 'number' &&
    siteSettings.internationalFreeShippingThresholdINR > 0
  );

  const progressPercent = (showFreeShippingBar && shippingQuote.thresholdINR && shippingQuote.thresholdINR < Infinity)
    ? Math.min(100, Math.round((cartSubtotalINR / shippingQuote.thresholdINR) * 100))
    : 0;

  // Check if any cart item is restricted for the selected country
  const restrictedItems = cart.filter(
    (item) => !checkProductCountryAvailability(item.product, selectedCountry?.code || selectedCountry?.name).available
  );
  const hasRestrictedItems = restrictedItems.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--brand-primary-deep)] border-l border-[var(--brand-gold)]/40 text-slate-100 shadow-2xl flex flex-col justify-between font-sans">
          {/* Cart Header */}
          <div className="p-6 bg-[var(--brand-primary-dark)] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--brand-gold)]" />
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
          {showFreeShippingBar && shippingQuote.thresholdINR && shippingQuote.thresholdINR < Infinity && (
            <div className="bg-black/30 px-6 py-3 border-b border-white/10 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--brand-gold)] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {shippingQuote.isFree
                      ? (isIndia ? '🎉 You unlocked Free Express Shipping!' : '🎉 You unlocked Free Express Worldwide Shipping!')
                      : `Add ${formatPrice(shippingQuote.amountNeededForFreeINR)} for Free Shipping`}
                  </span>
                </span>
              </div>
              <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--brand-gold)] h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {hasRestrictedItems && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-rose-300">Shipping Notice:</strong>
                  <span>Some items in your cart cannot be shipped to {selectedCountry?.name || 'your region'}. Please remove them before checkout.</span>
                </div>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
                <p className="text-slate-300 text-sm font-serif-luxury">Your herbal cart is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemKey = item.selectedVariant ? `${item.product.id}-${item.selectedVariant.id}` : item.product.id;
                const availability = checkProductCountryAvailability(item.product, selectedCountry?.code || selectedCountry?.name);
                const isItemRestricted = !availability.available;
                const effectiveItemPrice = getProductEffectivePriceINR(item.product, selectedCountry?.code || selectedCountry?.name);

                return (
                  <div
                    key={itemKey}
                    className={`flex gap-4 p-3 bg-[var(--brand-primary-dark)] border rounded-xl transition-colors ${
                      isItemRestricted ? 'border-rose-500/60 bg-rose-950/20' : 'border-white/10 hover:border-[var(--brand-gold)]/40'
                    }`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-contain rounded-lg shrink-0 border border-white/10 bg-black/30 p-1"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-bold font-serif-luxury text-slate-100 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[var(--brand-gold)] font-medium">
                              {item.selectedVariant ? item.selectedVariant.name : item.product.volume}
                            </span>
                            {item.selectedVariant?.sku && (
                              <span className="text-[9px] text-slate-400 font-mono">
                                ({item.selectedVariant.sku})
                              </span>
                            )}
                          </div>
                          {isItemRestricted && (
                            <div className="mt-1 px-2 py-0.5 rounded bg-rose-950/90 border border-rose-500/50 text-[10px] text-rose-300 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                              <span>{availability.reason || `Unavailable in ${selectedCountry?.name || 'your region'}`}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(itemKey)}
                          className="text-slate-400 hover:text-red-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-white/20 rounded overflow-hidden bg-black/30">
                          <button
                            onClick={() => updateCartQuantity(itemKey, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:bg-white/10"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(itemKey, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-300 hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[var(--brand-gold)]">
                          {formatPrice(effectiveItemPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-[var(--brand-primary-dark)] border-t border-white/10 space-y-4">
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-1.5 text-xs text-slate-100 uppercase placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="submit"
                    className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-1.5 rounded text-xs font-bold uppercase"
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
                {isIndia ? (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>Shipping (India)</span>
                      <span>{cartSubtotalINR >= 999 ? 'FREE' : formatPrice(99)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[var(--brand-gold)] border-t border-white/10 pt-2">
                      <span>Total</span>
                      <span>{formatPrice(cartTotalINR + (cartSubtotalINR >= 999 ? 0 : 99))}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>Shipping ({selectedCountry?.name || 'International'})</span>
                      <span className="text-slate-400 italic">Shipping calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[var(--brand-gold)] border-t border-white/10 pt-2">
                      <div className="flex flex-col">
                        <span>Total</span>
                        <span className="text-[10px] font-normal text-slate-400">Excl. shipping</span>
                      </div>
                      <span>{formatPrice(cartTotalINR)}</span>
                    </div>
                  </>
                )}
              </div>

              {hasRestrictedItems ? (
                <button
                  disabled
                  className="w-full bg-rose-900/60 border border-rose-500/50 text-rose-200 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Remove Restricted Items to Checkout</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Proceed To Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
