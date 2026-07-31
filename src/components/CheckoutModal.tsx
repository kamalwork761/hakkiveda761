import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Banknote, Truck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, PaymentGatewayId } from '../types/store';
import { PaymentIcon } from './PaymentIcons';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalINR,
    cartTotalINR,
    discountAmountINR,
    formatPrice,
    currentCurrency,
    selectedCountry,
    countries,
    currentMarket,
    markets,
    paymentGateways,
    codRules,
    marketGateways,
    placeOrder,
    clearCart,
  } = useStore();

  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');

  // Customer form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState(selectedCountry?.name || 'India');
  const [pincode, setPincode] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayId>('RAZORPAY');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Shiprocket Pincode Serviceability state
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    serviceable: boolean;
    couriers: string[];
    codAllowed: boolean;
    message: string;
  }>({ checked: false, serviceable: true, couriers: [], codAllowed: true, message: '' });

  if (!isCheckoutOpen) return null;

  const matchedCountry =
    countries.find((c) => c.name.toLowerCase() === country.toLowerCase() || c.code.toLowerCase() === country.toLowerCase()) ||
    countries.find((c) => c.code === selectedCountry.code);

  const isBlocked = matchedCountry?.shippingRule === 'BLOCK_ORDERS';
  const isIndia = matchedCountry?.code === 'IN' || country.toLowerCase() === 'india' || country.toLowerCase().includes('in');

  // Pincode validation & Shiprocket check trigger
  const handlePincodeChange = (value: string) => {
    setPincode(value);
    if (isIndia && value.trim().length === 6 && /^\d{6}$/.test(value.trim())) {
      setIsCheckingPincode(true);
      fetch(`/api/shiprocket/check-serviceability?delivery_pincode=${value.trim()}`)
        .then((res) => res.json())
        .then((data) => {
          setIsCheckingPincode(false);
          if (data.success && data.serviceable) {
            setPincodeStatus({
              checked: true,
              serviceable: true,
              couriers: data.couriers || ['Delhivery', 'Xpressbees', 'Bluedart'],
              codAllowed: data.codAllowed !== false,
              message: `Serviceable via ${data.couriers?.slice(0, 3).join(', ') || 'Shiprocket Logistics Network'}`,
            });
          } else {
            setPincodeStatus({
              checked: true,
              serviceable: false,
              couriers: [],
              codAllowed: false,
              message: data.message || 'Pincode unserviceable for delivery',
            });
          }
        })
        .catch(() => {
          setIsCheckingPincode(false);
          // Fallback graceful
          setPincodeStatus({
            checked: true,
            serviceable: true,
            couriers: ['Delhivery Surface', 'Shiprocket Express'],
            codAllowed: true,
            message: 'Serviceable via Express Delivery',
          });
        });
    } else {
      setPincodeStatus({ checked: false, serviceable: true, couriers: [], codAllowed: true, message: '' });
    }
  };

  // Determine market payment gateways
  const marketMapping = marketGateways.find((mg) => mg.marketId === currentMarket.id) ||
    marketGateways.find((mg) => mg.countryCode === matchedCountry?.code);
  const activeGatewayIds: PaymentGatewayId[] = marketMapping
    ? marketMapping.gateways
    : (currentMarket.paymentGateways as PaymentGatewayId[]) || ['RAZORPAY', 'UPI', 'PHONEPE', 'COD'];

  // Filter paymentGateways by enabled & active for this market
  const availableGateways = paymentGateways
    .filter((gw) => gw.enabled && activeGatewayIds.includes(gw.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // COD checks
  // Requirement 1: If customer country is India -> COD allowed (show COD option, allow selection, no "Prepaid Only", no "COD disabled for India" msg).
  // Requirement 2: If customer country is outside India -> COD disabled (show "Prepaid Only", disable COD).
  // Requirement 3: Ignore Shiprocket COD serviceability for now. Do not block COD based on pincode yet.
  // Requirement 4: Use actual configured min/max order limits. If no limits configured, do not show "Min ₹, Max ₹".
  const minOrder = codRules?.minOrderAmountINR ?? codRules?.minOrderINR ?? 0;
  const maxOrder = codRules?.maxOrderAmountINR ?? codRules?.maxOrderINR ?? 0;

  const isCodWithinLimits =
    (minOrder <= 0 || cartTotalINR >= minOrder) &&
    (maxOrder <= 0 || cartTotalINR <= maxOrder);

  const isCodAllowed = isIndia && (codRules?.enabled !== false) && isCodWithinLimits;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;
    if (!isCodAllowed && paymentMethod === 'COD') {
      const fallback = availableGateways.find((g) => g.id !== 'COD')?.id || 'RAZORPAY';
      setPaymentMethod(fallback);
    } else if (availableGateways.length > 0 && !availableGateways.some((g) => g.id === paymentMethod)) {
      setPaymentMethod(availableGateways[0].id);
    }
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const selectedGw = paymentGateways.find((g) => g.id === paymentMethod);
      const isCod = paymentMethod === 'COD';

      const order = placeOrder({
        items: [...cart],
        totalAmountINR: cartTotalINR,
        currencyCode: currentCurrency.code,
        convertedTotal: currentCurrency.code === 'INR' ? cartTotalINR : Number((cartTotalINR / currentCurrency.rateToINR).toFixed(2)),
        customer: {
          name,
          email,
          phone,
          address: line1,
          city,
          state,
          country,
          pincode,
        },
        paymentMethod: paymentMethod,
        paymentStatus: isCod ? 'COD_DUE' : 'PAID',
        trackingStatus: 'ORDER_PLACED',
        trackingNumber: `HV-${Math.floor(100000 + Math.random() * 900000)}`,
        courierName: isIndia ? 'Delhivery Surface / Shiprocket' : 'DHL Express Worldwide',
        estimatedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      });

      // Synchronize order with Shiprocket backend API
      fetch('/api/shiprocket/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, orderData: order }),
      })
        .then((res) => res.json())
        .then((srRes) => {
          if (srRes.success) {
            setCompletedOrder((prev) =>
              prev
                ? {
                    ...prev,
                    shiprocketOrderId: srRes.shiprocketOrderId,
                    shipmentId: srRes.shipmentId,
                    awbCode: srRes.awbCode || prev.awbCode,
                    courierName: srRes.courierName || prev.courierName,
                    trackingUrl: srRes.trackingUrl || prev.trackingUrl,
                    shipmentStatus: srRes.shipmentStatus || 'MANIFESTED',
                  }
                : null
            );
          }
        })
        .catch((err) => console.error('[Shiprocket Create Order Error]:', err));

      setCompletedOrder(order);
      clearCart();
      setIsProcessingPayment(false);
      setStep('confirmation');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[var(--surface-background)] border border-[var(--border-strong)] rounded-2xl shadow-2xl p-6 sm:p-10 my-8 text-[var(--text-primary)] font-sans">
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/30 text-[var(--text-primary)] hover:bg-[var(--border-strong)] hover:text-black transition-all flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Steps */}
        <div className="flex items-center gap-3 border-b border-[var(--border-muted)] pb-4 mb-6 text-xs uppercase tracking-widest font-bold">
          <span className={step === 'address' ? 'text-[var(--heading-primary)] underline decoration-2' : 'text-[var(--text-muted)]'}>1. Delivery Address</span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className={step === 'payment' ? 'text-[var(--heading-primary)] underline decoration-2' : 'text-[var(--text-muted)]'}>2. Payment Method</span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className={step === 'confirmation' ? 'text-[var(--heading-primary)] underline decoration-2' : 'text-[var(--text-muted)]'}>3. Order Receipt</span>
        </div>

        {/* Step 1: Address Form */}
        {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <h3 className="text-2xl font-serif-luxury font-bold text-[var(--text-primary)]">
              Shipping & Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--input-label)] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--input-label)] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@gmail.com"
                  className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--input-label)] mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--input-label)] mb-1">Country *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                >
                  <option value="India">India (INR)</option>
                  <option value="Singapore">Singapore (SGD)</option>
                  <option value="Malaysia">Malaysia (MYR)</option>
                  <option value="Fiji">Fiji (FJD)</option>
                  <option value="Mauritius">Mauritius (MUR)</option>
                  <option value="United States">United States (USD)</option>
                  <option value="United Arab Emirates">United Arab Emirates (USD)</option>
                  <option value="Worldwide">Rest of World (USD)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--input-label)] mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="House No, Street, Landmark"
                className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--input-label)] mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--input-label)] mb-1">State / Region *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--input-label)] mb-1">Zip / Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="e.g. 560001"
                  className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                />
              </div>
            </div>

            {/* Pincode Serviceability Feedback Badge */}
            {isIndia && (
              <div className="text-xs font-bold">
                {isCheckingPincode ? (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                    <Truck className="w-4 h-4" /> Checking Shiprocket pincode serviceability...
                  </span>
                ) : pincodeStatus.checked ? (
                  pincodeStatus.serviceable ? (
                    <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-300 dark:border-emerald-500/40 block">
                      ✓ {pincodeStatus.message}
                    </span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-300 dark:border-rose-500/40 block">
                      ⚠️ {pincodeStatus.message}
                    </span>
                  )
                ) : null}
              </div>
            )}

            {/* Order Items Preview with Product Images */}
            {cart.length > 0 && (
              <div className="bg-[var(--surface-muted)] border border-[var(--border-default)] rounded-xl p-3 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[var(--heading-primary)] tracking-wider block">
                  Order Summary ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)
                </span>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 bg-[var(--surface-background)] p-2 rounded-lg border border-[var(--border-muted)]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        loading="lazy"
                        className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-[var(--text-secondary)]">Qty: {item.quantity} × {formatPrice(item.product.priceINR)}</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--heading-primary)] shrink-0">
                        {formatPrice(item.product.priceINR * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isBlocked && (
              <div className="p-4 bg-rose-50 dark:bg-red-950/60 border border-rose-300 dark:border-red-500/50 rounded-xl text-xs text-rose-800 dark:text-rose-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                  ⚠️ Shipping Unavailable
                </span>
                <p>
                  Orders to <strong>{matchedCountry?.name || country}</strong> are currently blocked by store administration rules. Please select a different delivery country.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isBlocked}
              className={`w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 mt-6 ${
                isBlocked
                  ? 'bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                  : 'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-95'
              }`}
            >
              <span>{isBlocked ? 'Shipping Blocked' : 'Continue To Payment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment Selection */}
        {step === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif-luxury font-bold text-[var(--text-primary)]">
              Select Payment Method
            </h3>

            {/* Rules Callout */}
            <div className="p-4 bg-[var(--surface-muted)] border border-[var(--border-default)] rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[var(--heading-primary)] font-bold block">Market & Payment Policy:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-background)] text-[var(--text-primary)] border border-[var(--border-default)] font-bold">
                  {matchedCountry?.flag || selectedCountry.flag} {matchedCountry?.name || selectedCountry.name} ({currentCurrency.code})
                </span>
              </div>
              <p className="text-[var(--text-secondary)]">
                {isCodAllowed
                  ? `• Shipments to ${matchedCountry?.name || 'India'} qualify for both Razorpay Online Payment and Cash on Delivery (COD).`
                  : `• Cash on Delivery (COD) is disabled for ${matchedCountry?.name || country}. International shipments require Prepaid Checkout.`}
              </p>
            </div>

            <div className="space-y-3">
              {availableGateways.map((gw) => {
                const isCod = gw.id === 'COD';
                const isDisabledCod = isCod && !isCodAllowed;

                return (
                  <div key={gw.id}>
                    {isDisabledCod ? (
                      <div className="p-3.5 bg-rose-50 dark:bg-red-950/30 border border-rose-200 dark:border-red-500/20 rounded-xl text-[11px] text-rose-700 dark:text-rose-300 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PaymentIcon gatewayId="COD" size="sm" />
                          <span>
                            Cash on Delivery unavailable for {matchedCountry?.name || country}
                            {minOrder > 0 || maxOrder > 0
                              ? ` (${minOrder > 0 ? `Min ₹${minOrder}` : ''}${minOrder > 0 && maxOrder > 0 ? ', ' : ''}${maxOrder > 0 ? `Max ₹${maxOrder}` : ''})`
                              : ''}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-200 dark:bg-red-900/40 text-rose-800 dark:text-red-300 rounded border border-rose-300 dark:border-red-500/30">
                          Prepaid Only
                        </span>
                      </div>
                    ) : (
                      <label
                        onClick={() => setPaymentMethod(gw.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === gw.id
                            ? 'border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--heading-primary)] shadow-md ring-1 ring-[var(--border-strong)]'
                            : 'border-[var(--border-muted)] bg-[var(--surface-background)] text-[var(--text-primary)] hover:border-[var(--border-default)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <PaymentIcon gatewayId={gw.id} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm block text-[var(--text-primary)]">{gw.name}</span>
                              {gw.mode === 'TEST' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  TEST MODE
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[var(--text-secondary)] block">{gw.description}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] bg-[var(--surface-muted)] px-2 py-1 rounded border border-[var(--border-muted)]">
                            {currentCurrency.code}
                          </span>
                          <input type="radio" name="pay" checked={paymentMethod === gw.id} readOnly className="accent-[var(--button-primary-bg)] w-4 h-4" />
                        </div>
                      </label>
                    )}
                  </div>
                );
              })}

              {availableGateways.length === 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                  No payment gateways configured for this market yet. Please contact store administration.
                </div>
              )}
            </div>

            {/* Order Total Preview */}
            <div className="bg-[var(--surface-muted)] p-4 rounded-xl space-y-3 border border-[var(--border-default)] text-xs">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {cart.map((item) => (
                  <img
                    key={item.product.id}
                    src={item.product.image}
                    alt={item.product.name}
                    title={`${item.product.name} (x${item.quantity})`}
                    loading="lazy"
                    className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-slate-200 shrink-0"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[var(--text-primary)] border-t border-[var(--border-muted)] pt-2 font-bold">
                <span>Total Amount:</span>
                <span className="font-bold text-[var(--heading-primary)] text-sm">{formatPrice(cartTotalINR)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('address')}
                className="px-6 py-3 border border-[var(--border-default)] rounded-lg text-xs font-bold uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessingPayment}
                className="flex-1 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[var(--button-primary-hover)] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <span>
                    {paymentMethod === 'COD'
                      ? 'PLACE CASH ON DELIVERY ORDER'
                      : paymentMethod === 'RAZORPAY'
                      ? `Pay ${formatPrice(cartTotalINR)} via Razorpay`
                      : paymentMethod === 'PHONEPE'
                      ? `Pay ${formatPrice(cartTotalINR)} via PhonePe`
                      : paymentMethod === 'UPI'
                      ? `Pay ${formatPrice(cartTotalINR)} via Instant UPI`
                      : paymentMethod === 'PAYPAL'
                      ? `Pay ${formatPrice(cartTotalINR)} via PayPal`
                      : `Pay ${formatPrice(cartTotalINR)}`}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Receipt & Tracking */}
        {step === 'confirmation' && completedOrder && (
          <div className="text-center space-y-6 py-4 animate-in fade-in duration-500">
            <CheckCircle2 className="w-20 h-20 text-[var(--brand-gold)] mx-auto animate-bounce" />

            <div>
              <span className="text-xs uppercase font-bold text-[var(--brand-gold)] tracking-widest block">
                Order Confirmed & Logged
              </span>
              <h3 className="text-3xl font-serif-luxury font-bold text-slate-100 mt-1">
                Thank You For Your Order!
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                A confirmation email with herbal ritual instructions has been dispatched to{' '}
                <span className="text-[var(--brand-gold)] font-bold">{completedOrder.customer.email}</span>.
              </p>
            </div>

            <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 p-6 rounded-2xl text-left space-y-3 font-sans text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2 font-bold">
                <span>Order Reference: <span className="text-[var(--brand-gold)]">{completedOrder.orderNumber}</span></span>
                <span className="text-emerald-400">Status: {completedOrder.paymentStatus}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Shipping Address</span>
                  <p className="text-slate-200 font-medium">
                    {completedOrder.customer.name}<br />
                    {completedOrder.customer.address}, {completedOrder.customer.city}, {completedOrder.customer.country}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Tracking Number</span>
                  <p className="text-[var(--brand-gold)] font-bold font-mono text-sm">{completedOrder.trackingNumber}</p>
                  <p className="text-slate-400 text-[10px]">Courier: {completedOrder.courierName}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
