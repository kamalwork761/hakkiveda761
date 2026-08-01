import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Truck, ArrowRight, Building2, FileText, Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, PaymentGatewayId } from '../types/store';
import { PaymentIcon } from './PaymentIcons';
import { WORLD_COUNTRIES, getCountryDetails, formatE164, CountryItem } from '../data/countriesData';

export interface CountryDetails {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  postalLabel: string;
  postalPlaceholder: string;
  phoneMinDigits: number;
  phoneMaxDigits: number;
  currency: string;
  supportsLookup: boolean;
}

export const COUNTRY_LOOKUP_MAP: Record<string, CountryDetails> = WORLD_COUNTRIES.reduce((acc, c) => {
  acc[c.name] = {
    code: c.code,
    name: c.name,
    flag: c.flag,
    phoneCode: c.phoneCode,
    postalLabel: c.postalLabel,
    postalPlaceholder: c.postalPlaceholder,
    phoneMinDigits: c.phoneMinDigits,
    phoneMaxDigits: c.phoneMaxDigits,
    currency: c.currencyCode,
    supportsLookup: c.supportsLookup,
  };
  return acc;
}, {} as Record<string, CountryDetails>);

const RAZORPAY_SUPPORTED_CURRENCIES = new Set([
  'INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED', 'MYR', 'SAR', 'AUD', 'CAD',
  'HKD', 'NZD', 'CHF', 'SEK', 'JPY', 'KWD', 'BHD', 'OMR', 'QAR', 'THB',
  'ZAR', 'RUB', 'MUR', 'NPR', 'BRL', 'MXN', 'DKK', 'NOK', 'PLN', 'CZK',
  'HUF', 'ILS', 'EGP', 'PHP', 'IDR', 'TRY', 'KRW', 'LKR', 'BDT'
]);

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalINR,
    discountAmountINR,
    cartTotalINR,
    formatPrice,
    currentCurrency,
    selectedCountry,
    selectCountry,
    countries,
    currentMarket,
    paymentGateways,
    codRules,
    marketGateways,
    addOrder,
    placeOrder,
    clearCart,
    products,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [step, setStep] = useState<'address' | 'review' | 'payment' | 'processing' | 'confirmation'>('address');
  const [processingPhase, setProcessingPhase] = useState<'idle' | 'submitting' | 'verifying' | 'success-animation' | 'receipt'>('idle');
  const [processingText, setProcessingText] = useState<string>('');

  // Customer form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState(selectedCountry?.name || 'India');
  const [pincode, setPincode] = useState('');

  // Lookup state
  const [isLookupReadonly, setIsLookupReadonly] = useState(false);
  const [lookupNote, setLookupNote] = useState('');

  // Billing Address State
  const [isBillingSame, setIsBillingSame] = useState(true);
  const [billingName, setBillingName] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingLine2, setBillingLine2] = useState('');
  const [billingLandmark, setBillingLandmark] = useState('');
  const [billingPincode, setBillingPincode] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingCountry, setBillingCountry] = useState(selectedCountry?.name || 'India');

  const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayId>('RAZORPAY');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Shiprocket / India Pincode Lookup state
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [addressFormError, setAddressFormError] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    serviceable: boolean;
    couriers: string[];
    codAllowed: boolean;
    message: string;
  }>({ checked: false, serviceable: true, couriers: [], codAllowed: true, message: '' });

  // Stock Validation & Coupon Review state
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);
  const [checkoutCouponInput, setCheckoutCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Restore draft on initial load
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('hakkiveda_checkout_draft');
      if (savedDraft) {
        const d = JSON.parse(savedDraft);
        if (d.name) setName(d.name);
        if (d.email) setEmail(d.email);
        if (d.phone) setPhone(d.phone);
        if (d.altPhone) setAltPhone(d.altPhone);
        if (d.line1) setLine1(d.line1);
        if (d.line2) setLine2(d.line2);
        if (d.landmark) setLandmark(d.landmark);
        if (d.companyName) setCompanyName(d.companyName);
        if (d.taxNumber) setTaxNumber(d.taxNumber);
        if (d.city) setCity(d.city);
        if (d.state) setState(d.state);
        if (d.pincode) setPincode(d.pincode);
        if (typeof d.isBillingSame === 'boolean') setIsBillingSame(d.isBillingSame);
        if (d.billingName) setBillingName(d.billingName);
        if (d.billingPhone) setBillingPhone(d.billingPhone);
        if (d.billingAddress) setBillingAddress(d.billingAddress);
        if (d.billingLine2) setBillingLine2(d.billingLine2);
        if (d.billingLandmark) setBillingLandmark(d.billingLandmark);
        if (d.billingPincode) setBillingPincode(d.billingPincode);
        if (d.billingCity) setBillingCity(d.billingCity);
        if (d.billingState) setBillingState(d.billingState);
      }
    } catch (e) {}
  }, []);

  // Auto save draft as customer types
  useEffect(() => {
    if (name || email || phone || line1 || pincode) {
      try {
        localStorage.setItem(
          'hakkiveda_checkout_draft',
          JSON.stringify({
            name,
            email,
            phone,
            altPhone,
            line1,
            line2,
            landmark,
            companyName,
            taxNumber,
            city,
            state,
            pincode,
            isBillingSame,
            billingName,
            billingPhone,
            billingAddress,
            billingLine2,
            billingLandmark,
            billingPincode,
            billingCity,
            billingState,
          })
        );
      } catch (e) {}
    }
  }, [
    name,
    email,
    phone,
    altPhone,
    line1,
    line2,
    landmark,
    companyName,
    taxNumber,
    city,
    state,
    pincode,
    isBillingSame,
    billingName,
    billingPhone,
    billingAddress,
    billingLine2,
    billingLandmark,
    billingPincode,
    billingCity,
    billingState,
  ]);

  const resetCheckoutState = () => {
    setStep('address');
    setCompletedOrder(null);
    setIsProcessingPayment(false);
    setProcessingPhase('idle');
    setProcessingText('');
    setAddressFormError('');
    setStockWarnings([]);
    setCouponFeedback(null);
    setCheckoutCouponInput('');
  };

  const handleCloseModal = () => {
    if (isProcessingPayment) return; // Do not close modal while payment or verification is actively processing
    setIsCheckoutOpen(false);
    resetCheckoutState();
  };

  // Lock body scroll and synchronize country state with StoreContext live selectedCountry
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
      if (selectedCountry?.name) {
        const matched = getCountryDetails(selectedCountry.name);
        setCountry(matched.name);
        setBillingCountry(matched.name);
      }
      // If opening checkout modal and an order was previously completed or in confirmation/processing, reset to start a brand new checkout session
      if (completedOrder || step === 'confirmation' || step === 'processing') {
        resetCheckoutState();
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen, selectedCountry?.name]);

  if (!isCheckoutOpen) return null;

  const activeCountryInfo = getCountryDetails(country);
  const billingCountryInfo = getCountryDetails(billingCountry);

  const matchedCountry =
    countries.find((c) => c.name.toLowerCase() === activeCountryInfo.name.toLowerCase() || c.code.toLowerCase() === activeCountryInfo.code.toLowerCase()) ||
    countries.find((c) => c.code === activeCountryInfo.code);

  const isBlocked = matchedCountry?.shippingRule === 'BLOCK_ORDERS';
  const isIndia = activeCountryInfo.code === 'IN';

  const handleCountryChange = (newCountryName: string) => {
    const newCountryObj = getCountryDetails(newCountryName);
    setCountry(newCountryObj.name);
    setBillingCountry(newCountryObj.name);
    setCity('');
    setState('');
    setPincode('');
    setPincodeError('');
    setAddressFormError('');
    setLookupNote('');
    setIsLookupReadonly(false);

    // Keep phone input empty and update prefix immediately when changing country
    setPhone('');
    setAltPhone('');
    setBillingPhone('');

    // Sync global store country and currency immediately
    const countryItem = WORLD_COUNTRIES.find(
      (c) => c.name.toLowerCase() === newCountryObj.name.toLowerCase() || c.code.toLowerCase() === newCountryObj.code.toLowerCase()
    ) || {
      code: newCountryObj.code,
      iso2: newCountryObj.code,
      name: newCountryObj.name,
      flag: newCountryObj.flag,
      phoneCode: newCountryObj.phoneCode,
      dialCode: newCountryObj.phoneCode,
      currencyCode: (newCountryObj.currency as any) || 'USD',
      currency: newCountryObj.currency,
      postalLabel: newCountryObj.postalLabel,
      postalPlaceholder: newCountryObj.postalPlaceholder,
      phoneMinDigits: newCountryObj.phoneMinDigits,
      phoneMaxDigits: newCountryObj.phoneMaxDigits,
      supportsLookup: newCountryObj.supportsLookup,
    };

    selectCountry(countryItem);

    if (newCountryObj.code !== 'IN' && paymentMethod === 'COD') {
      setPaymentMethod('RAZORPAY');
    }
  };

  const handlePostalCodeChange = (val: string) => {
    setPincode(val);
    setAddressFormError('');

    if (isIndia) {
      const cleanPincode = val.replace(/\D/g, '').slice(0, 6);
      setPincode(cleanPincode);
      setCity('');
      setState('');
      setPincodeError('');
      setIsLookupReadonly(false);

      if (cleanPincode.length === 6) {
        setIsCheckingPincode(true);
        setPincodeStatus({ checked: false, serviceable: true, couriers: [], codAllowed: true, message: '' });

        fetch(`/api/shipping/address-lookup?country=IN&postalCode=${cleanPincode}`)
          .then((res) => res.json())
          .then((data) => {
            setIsCheckingPincode(false);
            if (data.success && data.city && data.state) {
              setCity(data.city);
              setState(data.state);
              setIsLookupReadonly(true);
              setPincodeError('');
              setPincodeStatus({
                checked: true,
                serviceable: true,
                couriers: ['Delhivery', 'Xpressbees', 'Bluedart'],
                codAllowed: true,
                message: `${data.city}, ${data.state}`,
              });
            } else {
              setCity('');
              setState('');
              setIsLookupReadonly(false);
              setPincodeError(data.error || 'Please enter a valid Indian pincode.');
              setPincodeStatus({
                checked: true,
                serviceable: false,
                couriers: [],
                codAllowed: false,
                message: data.error || 'Please enter a valid Indian pincode.',
              });
            }
          })
          .catch(() => {
            setIsCheckingPincode(false);
            setIsLookupReadonly(false);
            setCity('');
            setState('');
            setPincodeError('Failed to verify pincode. Please check your connection and retry.');
          });
      }
    } else {
      setCity('');
      setState('');
      setPincodeError('');
      setLookupNote('');
      setIsLookupReadonly(false);

      if (!activeCountryInfo.supportsLookup) {
        setLookupNote('Automatic address lookup is not available for this country. Please enter city and region manually.');
        return;
      }

      const cleanVal = val.trim();
      let triggerLookup = false;

      if (activeCountryInfo.code === 'US') {
        const digits = cleanVal.replace(/\D/g, '');
        if (digits.length === 5 || /^\d{5}-\d{4}$/.test(cleanVal)) {
          triggerLookup = true;
        }
      } else if (activeCountryInfo.code === 'GB') {
        if (cleanVal.length >= 5) {
          triggerLookup = true;
        }
      } else if (activeCountryInfo.code === 'SG') {
        if (cleanVal.replace(/\D/g, '').length === 6) {
          triggerLookup = true;
        }
      } else if (activeCountryInfo.code === 'MY') {
        if (cleanVal.replace(/\D/g, '').length === 5) {
          triggerLookup = true;
        }
      } else if (activeCountryInfo.code === 'CA') {
        if (cleanVal.replace(/\s+/g, '').length >= 6) {
          triggerLookup = true;
        }
      }

      if (triggerLookup) {
        setIsCheckingPincode(true);
        fetch(`/api/shipping/address-lookup?country=${encodeURIComponent(activeCountryInfo.code)}&postalCode=${encodeURIComponent(cleanVal)}`)
          .then((res) => res.json())
          .then((data) => {
            setIsCheckingPincode(false);
            if (data.success && data.city && data.state) {
              setCity(data.city);
              setState(data.state);
              setIsLookupReadonly(true);
              setPincodeError('');
              setLookupNote('');
            } else {
              setIsLookupReadonly(false);
              setLookupNote(data.error || 'Automatic address lookup is not available for this country. Please enter city and region manually.');
            }
          })
          .catch(() => {
            setIsCheckingPincode(false);
            setIsLookupReadonly(false);
            setLookupNote('Automatic address lookup is not available for this country. Please enter city and region manually.');
          });
      }
    }
  };

  // COD checks
  const minOrder = codRules?.minOrderAmountINR ?? codRules?.minOrderINR ?? 0;
  const maxOrder = codRules?.maxOrderAmountINR ?? codRules?.maxOrderINR ?? 0;

  const isCodWithinLimits =
    (minOrder <= 0 || cartTotalINR >= minOrder) &&
    (maxOrder <= 0 || cartTotalINR <= maxOrder);

  const isCodAllowed = isIndia && (codRules?.enabled !== false) && isCodWithinLimits;

  // Final Payment Architecture:
  // - India: Razorpay Secure Checkout (prepaid) + Cash on Delivery (if allowed)
  // - International: Razorpay Secure International Checkout ONLY (no COD, no Stripe, no PayPal)
  const razorpayConfig = paymentGateways.find((g) => g.id === 'RAZORPAY');
  const razorpayMode = razorpayConfig?.mode || 'LIVE';

  const availableGateways: { id: PaymentGatewayId; name: string; description: string; mode: string }[] = isIndia
    ? [
        {
          id: 'RAZORPAY',
          name: 'Razorpay Secure Checkout',
          description: 'Pay securely via UPI, Google Pay, PhonePe, Cards, Net Banking & Wallets',
          mode: razorpayMode,
        },
        ...(isCodAllowed
          ? [
              {
                id: 'COD' as PaymentGatewayId,
                name: 'Cash on Delivery (COD)',
                description: 'Pay with cash upon package delivery at your doorstep',
                mode: 'LIVE',
              },
            ]
          : []),
      ]
    : [
        {
          id: 'RAZORPAY',
          name: 'Razorpay Secure International Checkout',
          description: 'Pay securely using supported international Visa, Mastercard, American Express and other enabled cards.',
          mode: razorpayMode,
        },
      ];

  // Dynamic Shipping & Grand Total Calculation
  const isFreeShipping = isIndia ? cartTotalINR >= 999 : cartTotalINR >= 2500;
  const shippingFeeINR = isFreeShipping ? 0 : isIndia ? 99 : 499;
  const grandTotalINR = cartTotalINR + shippingFeeINR;

  const courierName = isIndia
    ? pincodeStatus.couriers.length > 0
      ? pincodeStatus.couriers.join(', ')
      : 'Delhivery / Shiprocket / Bluedart'
    : 'DHL Express / FedEx Worldwide';

  const estimatedDelivery = isIndia ? '3–5 Business Days' : '5–8 Business Days';

  // Live stock validator
  const validateCartStock = (): boolean => {
    const warnings: string[] = [];
    let cartAdjusted = false;

    cart.forEach((item) => {
      const prod = products.find((p) => p.id === item.product.id);
      const avail = prod && prod.inStock !== false ? (typeof prod.stock === 'number' ? prod.stock : 100) : 0;

      if (avail <= 0) {
        warnings.push(`"${item.product.name}" is currently out of stock and was removed from your cart.`);
        removeFromCart(item.product.id);
        cartAdjusted = true;
      } else if (item.quantity > avail) {
        warnings.push(`Only ${avail} items left for "${item.product.name}". Cart quantity was updated automatically.`);
        updateCartQuantity(item.product.id, avail);
        cartAdjusted = true;
      }
    });

    setStockWarnings(warnings);
    return !cartAdjusted;
  };

  const handleApplyCheckoutCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutCouponInput.trim()) return;
    const res = applyCoupon(checkoutCouponInput);
    setCouponFeedback({ success: res.success, message: res.message });
    if (res.success) setCheckoutCouponInput('');
  };

  // Address Validation
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;
    setAddressFormError('');

    if (!name.trim()) {
      setAddressFormError('Please enter full customer name.');
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      setAddressFormError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, '');
    if (!cleanPhone || cleanPhone.length < activeCountryInfo.phoneMinDigits || cleanPhone.length > activeCountryInfo.phoneMaxDigits) {
      setAddressFormError(
        `Please enter a valid ${activeCountryInfo.phoneMinDigits}${
          activeCountryInfo.phoneMinDigits === activeCountryInfo.phoneMaxDigits ? '' : `-${activeCountryInfo.phoneMaxDigits}`
        }-digit mobile number for ${country}.`
      );
      return;
    }

    if (altPhone.trim()) {
      const cleanAlt = altPhone.replace(/\D/g, '').replace(/^0+/, '');
      if (cleanAlt.length < activeCountryInfo.phoneMinDigits || cleanAlt.length > activeCountryInfo.phoneMaxDigits) {
        setAddressFormError(
          `Alternate mobile number must be a valid ${activeCountryInfo.phoneMinDigits}${
            activeCountryInfo.phoneMinDigits === activeCountryInfo.phoneMaxDigits ? '' : `-${activeCountryInfo.phoneMaxDigits}`
          }-digit mobile number.`
        );
        return;
      }
    }

    if (!line1.trim()) {
      setAddressFormError('Please enter complete street address line 1.');
      return;
    }

    if (isIndia) {
      const cleanPin = pincode.replace(/\D/g, '');
      if (cleanPin.length !== 6) {
        setAddressFormError('Please enter a valid 6-digit Indian pincode.');
        return;
      }
      if (!city || !state || pincodeError) {
        setAddressFormError('Please enter a valid Indian pincode to fetch City and State.');
        return;
      }
    } else {
      if (activeCountryInfo.code !== 'AE' && !pincode.trim()) {
        setAddressFormError(`Please enter ${activeCountryInfo.postalLabel}.`);
        return;
      }
      if (!city.trim() || !state.trim()) {
        setAddressFormError('Please enter City and State / Province / Region.');
        return;
      }
    }

    if (!isBillingSame) {
      if (!billingName.trim()) {
        setAddressFormError('Please enter billing full name.');
        return;
      }
      const cleanBilling = billingPhone.replace(/\D/g, '').replace(/^0+/, '');
      if (!cleanBilling || cleanBilling.length < billingCountryInfo.phoneMinDigits || cleanBilling.length > billingCountryInfo.phoneMaxDigits) {
        setAddressFormError('Please enter a valid billing mobile number.');
        return;
      }
      if (!billingAddress.trim()) {
        setAddressFormError('Please enter billing complete address.');
        return;
      }
      if (!billingPincode.trim()) {
        setAddressFormError('Please enter billing postal code/pincode.');
        return;
      }
      if (!billingCity.trim() || !billingState.trim()) {
        setAddressFormError('Please enter billing city and state.');
        return;
      }
    }

    if (!isIndia && paymentMethod === 'COD') {
      const fallback = availableGateways.find((g) => g.id !== 'COD')?.id || 'RAZORPAY';
      setPaymentMethod(fallback);
    } else if (availableGateways.length > 0 && !availableGateways.some((g) => g.id === paymentMethod)) {
      setPaymentMethod(availableGateways[0].id);
    }

    validateCartStock();
    setStep('review');
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (isProcessingPayment) return; // Prevent duplicate order trigger
    validateCartStock();

    if (cart.length === 0) {
      setAddressFormError('Your cart is empty. Please add items to proceed.');
      setStep('address');
      return;
    }

    setIsProcessingPayment(true);
    setAddressFormError('');

    const fullAddress = line2
      ? `${line1}, ${line2}${landmark ? `, Landmark: ${landmark}` : ''}`
      : landmark
      ? `${line1}, Landmark: ${landmark}`
      : line1;
    const fullPhone = formatE164(activeCountryInfo.dialCode, phone);

    const customerPayload = {
      name,
      email,
      phone: fullPhone,
      address: fullAddress,
      line1,
      line2,
      landmark,
      city,
      state,
      country,
      countryCode: activeCountryInfo.code,
      pincode,
    };

    // 1. CASH ON DELIVERY (COD) FLOW
    if (paymentMethod === 'COD') {
      if (!isIndia) {
        setAddressFormError('Cash on Delivery is available only for shipments within India.');
        setIsProcessingPayment(false);
        return;
      }

      setStep('processing');
      setProcessingPhase('submitting');
      setProcessingText('Confirming your order…');

      const startTime = Date.now();

      try {
        const res = await fetch('/api/payments/cod/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
            customer: customerPayload,
            couponCode: appliedCoupon?.code,
            currencyCode: 'INR',
          }),
        });

        const data = await res.json();

        // Enforce smooth display timing (~1.2s minimum for processing text)
        const elapsed = Date.now() - startTime;
        if (elapsed < 1200) {
          await new Promise((resolve) => setTimeout(resolve, 1200 - elapsed));
        }

        if (data.success && data.order) {
          addOrder(data.order);
          setCompletedOrder(data.order);
          clearCart();
          try {
            localStorage.removeItem('hakkiveda_checkout_draft');
          } catch (e) {}

          // Show animated success check (~1.0s)
          setProcessingPhase('success-animation');
          setProcessingText('Order Confirmed');
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Reveal receipt
          setStep('confirmation');
          setProcessingPhase('receipt');
        } else {
          setStep('payment');
          setProcessingPhase('idle');
          setAddressFormError(data.error || 'Failed to place Cash on Delivery order.');
        }
      } catch (err: any) {
        console.error('[COD Checkout Error]:', err);
        setStep('payment');
        setProcessingPhase('idle');
        setAddressFormError('Network connection error while placing Cash on Delivery order.');
      } finally {
        setIsProcessingPayment(false);
      }
      return;
    }

    // 2. PREPAID RAZORPAY SECURE CHECKOUT FLOW
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setAddressFormError('Failed to load Razorpay Checkout SDK. Please check your internet connection.');
        setIsProcessingPayment(false);
        return;
      }

      const createRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          customer: customerPayload,
          couponCode: appliedCoupon?.code,
          currencyCode: currentCurrency.code,
        }),
      });

      const orderData = await createRes.json();
      if (!orderData.success) {
        setAddressFormError(orderData.error || 'Failed to initiate Razorpay order.');
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'HAKKIVEDA Tribal Wellness',
        description: `Order #${orderData.orderNumber}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: name,
          email: email,
          contact: fullPhone,
        },
        theme: {
          color: '#d97706',
        },
        handler: async function (response: any) {
          // Customer authorized payment in Razorpay popup -> show payment verification screen
          setStep('processing');
          setProcessingPhase('verifying');
          setProcessingText('Verifying your payment…');

          const verifyStartTime = Date.now();

          try {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                localOrderId: orderData.orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            // Enforce smooth display timing (~1.2s minimum for verification text)
            const elapsed = Date.now() - verifyStartTime;
            if (elapsed < 1200) {
              await new Promise((resolve) => setTimeout(resolve, 1200 - elapsed));
            }

            if (verifyData.success && verifyData.order) {
              addOrder(verifyData.order);
              setCompletedOrder(verifyData.order);
              clearCart();
              try {
                localStorage.removeItem('hakkiveda_checkout_draft');
              } catch (e) {}

              // Show animated success check (~1.0s)
              setProcessingPhase('success-animation');
              setProcessingText('Payment Successful');
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // Reveal receipt
              setStep('confirmation');
              setProcessingPhase('receipt');
            } else {
              setStep('payment');
              setProcessingPhase('idle');
              setAddressFormError(verifyData.error || 'Payment verification failed on server.');
            }
          } catch (vErr) {
            console.error('[Razorpay Verify Error]:', vErr);
            setStep('payment');
            setProcessingPhase('idle');
            setAddressFormError('Network issue verifying payment. Please contact support with payment ID: ' + response.razorpay_payment_id);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            console.log('[Razorpay Modal] Dismissed by customer');
            setIsProcessingPayment(false);
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', function (failResp: any) {
        console.error('[Razorpay Payment Failed]:', failResp.error);
        setAddressFormError(`Payment failed: ${failResp.error?.description || failResp.error?.reason || 'Transaction declined'}`);
        setIsProcessingPayment(false);
      });

      rzpInstance.open();
    } catch (err: any) {
      console.error('[Razorpay Flow Error]:', err);
      alert('An error occurred initializing payment: ' + (err.message || 'Unknown error'));
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-3xl h-[96dvh] sm:h-[90dvh] max-h-[850px] bg-[var(--surface-background)] border border-[var(--border-strong)] rounded-2xl shadow-2xl flex flex-col text-[var(--text-primary)] font-sans overflow-hidden my-auto">
        {/* Sticky Header with Step Navigation and Close Button */}
        <div className="flex-none px-4 py-3.5 sm:px-8 sm:py-4 border-b border-[var(--border-muted)] bg-[var(--surface-background)] relative z-30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-widest font-bold overflow-x-auto whitespace-nowrap scrollbar-none pr-8">
            <span className={step === 'address' ? 'text-[var(--heading-primary)] underline decoration-2 font-black' : 'text-[var(--text-muted)]'}>
              1. Delivery Address
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className={step === 'review' ? 'text-[var(--heading-primary)] underline decoration-2 font-black' : 'text-[var(--text-muted)]'}>
              2. Order Review
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className={step === 'payment' ? 'text-[var(--heading-primary)] underline decoration-2 font-black' : 'text-[var(--text-muted)]'}>
              3. Payment Method
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className={step === 'confirmation' || step === 'processing' ? 'text-[var(--heading-primary)] underline decoration-2 font-black' : 'text-[var(--text-muted)]'}>
              4. Order Receipt
            </span>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isProcessingPayment}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800/80 dark:bg-black/80 text-white hover:bg-amber-600 transition-all flex items-center justify-center shrink-0 shadow-lg ${
              isProcessingPayment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            aria-label="Close Checkout Modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 overscroll-contain">
          {/* Step 1: Address Form */}
          {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif-luxury font-bold text-[var(--text-primary)]">
                Shipping & Customer Information
              </h3>
              <div>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--input-text)] font-bold focus:outline-none focus:border-[var(--input-focus-border)] cursor-pointer"
                >
                  {WORLD_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isIndia ? (
              /* Indian Address Form */
              <div className="space-y-4">
                {/* 1. Mobile Number & 2. Full Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      1. Mobile Number *
                    </label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-[var(--input-border)] bg-slate-100 dark:bg-emerald-950/60 text-xs font-bold text-slate-800 dark:text-emerald-200 select-none">
                        {activeCountryInfo.phoneCode}
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={activeCountryInfo.phoneMaxDigits}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, activeCountryInfo.phoneMaxDigits));
                          setAddressFormError('');
                        }}
                        placeholder={`Mobile number (${activeCountryInfo.phoneMinDigits}-${activeCountryInfo.phoneMaxDigits} digits)`}
                        className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-r-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      2. Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setAddressFormError('');
                      }}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>
                </div>

                {/* 3. Complete Address */}
                <div>
                  <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                    3. Complete Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => {
                      setLine1(e.target.value);
                      setAddressFormError('');
                    }}
                    placeholder="House/Flat No., Building Name, Street, Colony"
                    className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                  />
                </div>

                {/* 4. Landmark (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                    4. Landmark <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Temple / Opposite Metro Station"
                    className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                  />
                </div>

                {/* 5. Pincode, 6. City, 7. State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      5. Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePostalCodeChange(e.target.value)}
                      placeholder="e.g. 141008"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)] font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      6. City <span className="text-[10px] font-normal text-slate-400">(Auto-filled)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={city}
                      placeholder={isCheckingPincode ? 'Checking pincode...' : 'Auto-filled'}
                      className="w-full bg-slate-100 dark:bg-emerald-950/40 border border-slate-300 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-100 font-semibold cursor-not-allowed text-xs p-2.5 rounded-lg focus:outline-none select-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      7. State <span className="text-[10px] font-normal text-slate-400">(Auto-filled)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={state}
                      placeholder={isCheckingPincode ? 'Checking pincode...' : 'Auto-filled'}
                      className="w-full bg-slate-100 dark:bg-emerald-950/40 border border-slate-300 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-100 font-semibold cursor-not-allowed text-xs p-2.5 rounded-lg focus:outline-none select-none"
                    />
                  </div>
                </div>

                {/* Pincode Lookup Feedback Status */}
                {isCheckingPincode && (
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-500/30 animate-pulse">
                    <Truck className="w-4 h-4 animate-bounce shrink-0" />
                    <span>Checking pincode...</span>
                  </div>
                )}

                {pincodeError && (
                  <div className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-lg border border-rose-300 dark:border-rose-500/40">
                    ⚠️ {pincodeError}
                  </div>
                )}

                {city && state && !pincodeError && !isCheckingPincode && (
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-between">
                    <span>✓ Verified Location: <strong>{city}, {state}</strong></span>
                    <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-200 uppercase font-extrabold">Serviceable</span>
                  </div>
                )}

                {/* 8. Alternate Mobile Number & 9. Email ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      8. Alternate Mobile Number <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-[var(--input-border)] bg-slate-100 dark:bg-emerald-950/60 text-xs font-bold text-slate-800 dark:text-emerald-200 select-none">
                        {activeCountryInfo.phoneCode}
                      </span>
                      <input
                        type="tel"
                        maxLength={activeCountryInfo.phoneMaxDigits}
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value.replace(/\D/g, '').slice(0, activeCountryInfo.phoneMaxDigits))}
                        placeholder="Optional second contact"
                        className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-r-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      9. Email ID <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="For invoice & order updates"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>
                </div>

                {/* 10. Checkbox: Billing Details are same as Delivery Details */}
                <div className="pt-2 border-t border-[var(--border-muted)]">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-[var(--text-primary)]">
                    <input
                      type="checkbox"
                      checked={isBillingSame}
                      onChange={(e) => setIsBillingSame(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                    />
                    <span>10. Billing Details are same as Delivery Details</span>
                  </label>
                </div>

                {/* Separate Billing Address Form */}
                {!isBillingSame && (
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3 mt-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Separate Billing Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">Billing Full Name *</label>
                        <input
                          type="text"
                          required
                          value={billingName}
                          onChange={(e) => setBillingName(e.target.value)}
                          placeholder="Name on bill"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Billing Mobile Number *</label>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-2 rounded-l-lg border border-r-0 border-[var(--input-border)] bg-slate-100 dark:bg-emerald-950/60 text-xs font-bold text-slate-800 dark:text-emerald-200 select-none">
                            {activeCountryInfo.phoneCode}
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={activeCountryInfo.phoneMaxDigits}
                            value={billingPhone}
                            onChange={(e) => setBillingPhone(e.target.value.replace(/\D/g, '').slice(0, activeCountryInfo.phoneMaxDigits))}
                            placeholder="Mobile number"
                            className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-r-lg p-2 text-xs text-[var(--input-text)] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Billing Complete Address *</label>
                      <input
                        type="text"
                        required
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        placeholder="House/Flat No., Street"
                        className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Billing Landmark (Optional)</label>
                      <input
                        type="text"
                        value={billingLandmark}
                        onChange={(e) => setBillingLandmark(e.target.value)}
                        placeholder="Landmark"
                        className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-bold mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={billingPincode}
                          onChange={(e) => setBillingPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          placeholder="City"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value)}
                          placeholder="State"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* International Delivery Form (Shiprocket International Order Style) */
              <div className="space-y-4">
                {/* 1. Country */}
                <div>
                  <label className="block text-xs font-bold text-[var(--input-label)] mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-500" />
                    1. Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] font-semibold focus:outline-none focus:border-[var(--input-focus-border)] cursor-pointer"
                  >
                    {WORLD_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Postal Code / ZIP Code & Lookup Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      2. {activeCountryInfo.postalLabel} {activeCountryInfo.code !== 'AE' ? '*' : '(Optional)'}
                    </label>
                    <input
                      type="text"
                      required={activeCountryInfo.code !== 'AE'}
                      value={pincode}
                      onChange={(e) => handlePostalCodeChange(e.target.value)}
                      placeholder={activeCountryInfo.postalPlaceholder}
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)] font-mono font-bold"
                    />
                  </div>

                  {/* 3. State / Province / Region */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      3. State / Province / Region *
                    </label>
                    <input
                      type="text"
                      required
                      readOnly={isLookupReadonly}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder={isLookupReadonly ? 'Auto-filled' : 'e.g. California / London'}
                      className={`w-full text-xs p-2.5 rounded-lg focus:outline-none ${
                        isLookupReadonly
                          ? 'bg-slate-100 dark:bg-emerald-950/40 border border-slate-300 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-100 font-semibold cursor-not-allowed select-none'
                          : 'bg-[var(--input-background)] border border-[var(--input-border)] text-[var(--input-text)] focus:border-[var(--input-focus-border)]'
                      }`}
                    />
                  </div>

                  {/* 4. City */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      4. City *
                    </label>
                    <input
                      type="text"
                      required
                      readOnly={isLookupReadonly}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={isLookupReadonly ? 'Auto-filled' : 'e.g. New York / Manchester'}
                      className={`w-full text-xs p-2.5 rounded-lg focus:outline-none ${
                        isLookupReadonly
                          ? 'bg-slate-100 dark:bg-emerald-950/40 border border-slate-300 dark:border-emerald-500/30 text-slate-900 dark:text-emerald-100 font-semibold cursor-not-allowed select-none'
                          : 'bg-[var(--input-background)] border border-[var(--input-border)] text-[var(--input-text)] focus:border-[var(--input-focus-border)]'
                      }`}
                    />
                  </div>
                </div>

                {/* Postal Code Feedback Status */}
                {isCheckingPincode && (
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-500/30 animate-pulse">
                    <Truck className="w-4 h-4 animate-bounce shrink-0" />
                    <span>Checking postal code...</span>
                  </div>
                )}

                {city && state && isLookupReadonly && !isCheckingPincode && (
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-between">
                    <span>✓ Verified Location: <strong>{city}, {state}</strong></span>
                    <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-200 uppercase font-extrabold">Auto-Filled</span>
                  </div>
                )}

                {lookupNote && !isCheckingPincode && !isLookupReadonly && (
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-300 dark:border-amber-500/30">
                    ℹ️ {lookupNote}
                  </div>
                )}

                {/* 5. Address Line 1 & 6. Address Line 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      5. Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => {
                        setLine1(e.target.value);
                        setAddressFormError('');
                      }}
                      placeholder="House / Flat No., Street Address"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      6. Address Line 2 <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      placeholder="Apartment, Suite, Unit, Building, Floor"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>
                </div>

                {/* 7. Mobile Number & 8. Full Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      7. Mobile Number *
                    </label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-[var(--input-border)] bg-slate-100 dark:bg-emerald-950/60 text-xs font-bold text-slate-800 dark:text-emerald-200 select-none">
                        {activeCountryInfo.phoneCode}
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={activeCountryInfo.phoneMaxDigits}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, activeCountryInfo.phoneMaxDigits));
                          setAddressFormError('');
                        }}
                        placeholder={`Local phone number (${activeCountryInfo.phoneMinDigits}-${activeCountryInfo.phoneMaxDigits} digits)`}
                        className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-r-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      8. Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setAddressFormError('');
                      }}
                      placeholder="e.g. John Smith"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>
                </div>

                {/* 9. Email ID & 10. Alternate Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      9. Email ID *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1">
                      10. Alternate Mobile Number <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-[var(--input-border)] bg-slate-100 dark:bg-emerald-950/60 text-xs font-bold text-slate-800 dark:text-emerald-200 select-none">
                        {activeCountryInfo.phoneCode}
                      </span>
                      <input
                        type="tel"
                        maxLength={activeCountryInfo.phoneMaxDigits}
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value.replace(/\D/g, '').slice(0, activeCountryInfo.phoneMaxDigits))}
                        placeholder="Optional second number"
                        className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-r-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 11. Company Name & 12. Tax / VAT / GST Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      11. Company Name <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme International LLC"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--input-label)] mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      12. Tax / VAT / GST Number <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      placeholder="e.g. EU123456789 / EIN / Tax ID"
                      className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2.5 text-xs text-[var(--input-text)] focus:outline-none focus:border-[var(--input-focus-border)]"
                    />
                  </div>
                </div>

                {/* 13. Billing address same as shipping address Checkbox */}
                <div className="pt-2 border-t border-[var(--border-muted)]">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-[var(--text-primary)]">
                    <input
                      type="checkbox"
                      checked={isBillingSame}
                      onChange={(e) => setIsBillingSame(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                    />
                    <span>13. Billing address is same as shipping address</span>
                  </label>
                </div>

                {/* Separate Billing Address Form for International */}
                {!isBillingSame && (
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3 mt-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Separate International Billing Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">Billing Full Name *</label>
                        <input
                          type="text"
                          required
                          value={billingName}
                          onChange={(e) => setBillingName(e.target.value)}
                          placeholder="Full Name on bill"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Billing Mobile Number *</label>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-2 rounded-l-lg border border-r-0 border-[var(--input-border)] bg-slate-100 text-xs font-bold select-none">
                            {activeCountryInfo.phoneCode}
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={activeCountryInfo.phoneMaxDigits}
                            value={billingPhone}
                            onChange={(e) => setBillingPhone(e.target.value.replace(/\D/g, '').slice(0, activeCountryInfo.phoneMaxDigits))}
                            placeholder="Local number"
                            className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-r-lg p-2 text-xs text-[var(--input-text)] font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">Billing Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="House/Street"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Billing Address Line 2</label>
                        <input
                          type="text"
                          value={billingLine2}
                          onChange={(e) => setBillingLine2(e.target.value)}
                          placeholder="Apt, Suite, Unit"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-bold mb-1">{activeCountryInfo.postalLabel} *</label>
                        <input
                          type="text"
                          required
                          value={billingPincode}
                          onChange={(e) => setBillingPincode(e.target.value)}
                          placeholder="Postal / ZIP"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          placeholder="City"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">State / Region *</label>
                        <input
                          type="text"
                          required
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value)}
                          placeholder="State / Region"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Validation Error Banner */}
            {addressFormError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/50 rounded-xl text-xs font-bold text-rose-800 dark:text-rose-200">
                ⚠️ {addressFormError}
              </div>
            )}

            {/* Order Items Preview */}
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
              <span>{isBlocked ? 'Shipping Blocked' : 'Continue To Order Review'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Order Review & Shipping Summary */}
        {step === 'review' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3">
              <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[var(--text-primary)]">
                Order Review & Shipping Summary
              </h3>
              <button
                type="button"
                onClick={() => setStep('address')}
                className="text-xs font-bold text-[var(--heading-primary)] hover:underline flex items-center gap-1"
              >
                Edit Address
              </button>
            </div>

            {/* Stock Warnings Banner */}
            {stockWarnings.length > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/50 rounded-xl text-xs text-amber-800 dark:text-amber-200 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                  ⚠️ Inventory Notice
                </span>
                {stockWarnings.map((w, idx) => (
                  <p key={idx}>• {w}</p>
                ))}
              </div>
            )}

            {/* Address Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold uppercase tracking-wider text-[var(--heading-primary)] text-[11px] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Shipping Address
                  </span>
                  <button
                    onClick={() => setStep('address')}
                    className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-[var(--text-primary)] space-y-0.5">
                  <p className="font-bold text-sm">{name}</p>
                  <p>{line1}{line2 ? `, ${line2}` : ''}</p>
                  {landmark && <p className="text-[var(--text-secondary)]">Landmark: {landmark}</p>}
                  <p>{city}, {state} - {pincode}</p>
                  <p className="font-semibold">{country} ({activeCountryInfo.flag})</p>
                  <p className="pt-1 text-[var(--text-secondary)] font-mono">📱 {formatE164(activeCountryInfo.dialCode, phone)}</p>
                  <p className="text-[var(--text-secondary)] font-mono">✉️ {email}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold uppercase tracking-wider text-[var(--heading-primary)] text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Billing Address
                  </span>
                  {!isBillingSame && (
                    <button
                      onClick={() => setStep('address')}
                      className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {isBillingSame ? (
                  <p className="text-[var(--text-secondary)] italic">Same as shipping address</p>
                ) : (
                  <div className="text-[var(--text-primary)] space-y-0.5">
                    <p className="font-bold">{billingName}</p>
                    <p>{billingAddress}{billingLine2 ? `, ${billingLine2}` : ''}</p>
                    <p>{billingCity}, {billingState} - {billingPincode}</p>
                    <p className="font-semibold">{billingCountry}</p>
                    <p className="text-[var(--text-secondary)] font-mono">📱 {formatE164(billingCountryInfo.dialCode, billingPhone)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Courier & Delivery Estimate */}
            <div className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="font-bold text-[var(--heading-primary)] block">Estimated Logistics & Courier:</span>
                <span className="text-[var(--text-secondary)]">{courierName}</span>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Est. Delivery Time:</span>
                <span className="text-[var(--text-primary)] font-semibold">{estimatedDelivery}</span>
              </div>
            </div>

            {/* Coupon Application Box */}
            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-default)] space-y-2.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-[var(--heading-primary)] block text-[11px]">
                Have a Promo Code or Coupon?
              </span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200">
                  <div>
                    <span className="font-mono font-bold uppercase">{appliedCoupon.code}</span>
                    <span className="ml-2 text-[11px]">({appliedCoupon.discountPercentage}% OFF Applied)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[10px] uppercase font-extrabold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCheckoutCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={checkoutCouponInput}
                    onChange={(e) => setCheckoutCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. VEDA10, FESTIVE15)"
                    className="flex-1 px-3 py-2 border border-[var(--border-default)] rounded-lg bg-[var(--surface-background)] text-[var(--text-primary)] uppercase text-xs focus:ring-1 focus:ring-[var(--border-strong)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-bold rounded-lg uppercase tracking-wider text-[11px] hover:opacity-90"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponFeedback && (
                <p className={`text-[11px] font-medium ${couponFeedback.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Order Items Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--heading-primary)] block">
                Products ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 bg-[var(--surface-background)] border border-[var(--border-muted)] rounded-xl"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      loading="lazy"
                      className="w-12 h-12 object-contain rounded bg-white p-1 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {item.product.volume || '100ml'} • Qty: {item.quantity} × {formatPrice(item.product.priceINR)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[var(--heading-primary)] shrink-0 font-mono">
                      {formatPrice(item.product.priceINR * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Tax Calculation Summary */}
            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-default)] space-y-2 text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[var(--text-primary)] font-mono">{formatPrice(cartSubtotalINR)}</span>
              </div>
              {discountAmountINR > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span className="font-bold font-mono">- {formatPrice(discountAmountINR)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping Charges:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {isFreeShipping ? 'FREE Express Shipping' : formatPrice(shippingFeeINR)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Estimated Taxes (5% GST):</span>
                <span className="font-bold text-[var(--text-primary)] font-mono">
                  {formatPrice(Math.round(cartTotalINR * 0.05))} (Included)
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-primary)] border-t border-[var(--border-muted)] pt-2 font-bold text-sm">
                <span className="text-[var(--text-primary)]">Grand Total:</span>
                <span className="text-[var(--heading-primary)] text-base font-black font-mono">
                  {formatPrice(grandTotalINR)}
                </span>
              </div>
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('address')}
                className="px-6 py-3 border border-[var(--border-default)] rounded-lg text-xs font-bold uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Back to Address
              </button>
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="flex-1 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment Methods</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Selection */}
        {step === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif-luxury font-bold text-[var(--text-primary)]">
              Select Payment Method
            </h3>

            {/* Error banner if payment/verification failed */}
            {addressFormError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/50 rounded-xl text-xs font-bold text-rose-800 dark:text-rose-200 animate-in fade-in duration-200">
                ⚠️ {addressFormError}
              </div>
            )}

            {/* Policy Callout - No COD warning for international! */}
            {isIndia ? (
              <div className="p-4 bg-[var(--surface-muted)] border border-[var(--border-default)] rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--heading-primary)] font-bold block">Market & Payment Policy:</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-background)] text-[var(--text-primary)] border border-[var(--border-default)] font-bold">
                    🇮🇳 India (INR)
                  </span>
                </div>
                <p className="text-[var(--text-secondary)]">
                  • Shipments to India qualify for both Razorpay Online Payment and Cash on Delivery (COD).
                </p>
              </div>
            ) : (
              <div className="p-4 bg-[var(--surface-muted)] border border-[var(--border-default)] rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--heading-primary)] font-bold block">International Express Checkout:</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-background)] text-[var(--text-primary)] border border-[var(--border-default)] font-bold">
                    {activeCountryInfo.flag} {activeCountryInfo.name} ({currentCurrency.code})
                  </span>
                </div>
                <p className="text-[var(--text-secondary)]">
                  • Fast & secure prepaid international payment with instant confirmation.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {availableGateways.map((gw) => (
                <label
                  key={gw.id}
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
              ))}

              {availableGateways.length === 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                  No payment gateways configured for this market yet. Please contact store administration.
                </div>
              )}
            </div>

            {/* Currency Settlement Disclosure for unsupported gateway currencies (e.g. FJD) */}
            {paymentMethod === 'RAZORPAY' && !RAZORPAY_SUPPORTED_CURRENCIES.has(currentCurrency.code) && (
              <div className="p-4 bg-amber-50/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 rounded-xl space-y-1.5 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in duration-200">
                <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-100">
                  <span>💱</span>
                  <span>Currency Charge Disclosure</span>
                </div>
                <p>
                  Your order display total is <strong>{formatPrice(grandTotalINR)} ({currentCurrency.code})</strong>. Because Razorpay processes transactions in Indian Rupees (INR) for this currency, <strong>your card will be charged ₹{grandTotalINR.toLocaleString('en-IN')} (INR)</strong> at checkout.
                </p>
              </div>
            )}

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
                <span>Grand Total Amount:</span>
                <span className="font-bold text-[var(--heading-primary)] text-sm">{formatPrice(grandTotalINR)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('review')}
                className="px-6 py-3 border border-[var(--border-default)] rounded-lg text-xs font-bold uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Back To Review
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
                    {isIndia
                      ? paymentMethod === 'COD'
                        ? 'PLACE CASH ON DELIVERY ORDER'
                        : `PAY ₹${grandTotalINR.toLocaleString('en-IN')} SECURELY`
                      : `PAY ${currentCurrency.code} ${
                          currentCurrency.code === 'INR'
                            ? grandTotalINR.toLocaleString('en-IN')
                            : (grandTotalINR / currentCurrency.rateToINR).toFixed(2)
                        } SECURELY`}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step Processing & Verification Animation */}
        {step === 'processing' && (
          <div className="py-12 sm:py-16 px-4 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 min-h-[350px]">
            {processingPhase === 'submitting' || processingPhase === 'verifying' ? (
              <>
                {/* Animated Metallic Gold Ring Loader */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[var(--brand-gold)]/10 blur-xl motion-safe:animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 dark:border-amber-400/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-[var(--brand-gold)] border-r-[var(--brand-gold)]/80 border-b-transparent border-l-transparent motion-safe:animate-spin shadow-[0_0_20px_rgba(217,119,6,0.3)]" />
                  <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)] font-serif font-bold text-sm shadow-inner motion-safe:animate-pulse">
                    HV
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[var(--heading-primary)] tracking-wide">
                    {processingText || (processingPhase === 'submitting' ? 'Confirming your order…' : 'Verifying your payment…')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-sans">
                    Please wait while we securely process and verify your request with the server. Do not refresh or close this window.
                  </p>
                </div>
              </>
            ) : processingPhase === 'success-animation' ? (
              <>
                {/* Animated Green Check Circle */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 motion-safe:animate-ping opacity-60" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] motion-safe:animate-in motion-safe:zoom-in-75 duration-300">
                    <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-white stroke-[2.5]" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                    {processingText || 'Order Confirmed'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-sans">
                    Your order was verified successfully. Preparing your receipt…
                  </p>
                </div>
              </>
            ) : null}
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
              onClick={handleCloseModal}
              className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
