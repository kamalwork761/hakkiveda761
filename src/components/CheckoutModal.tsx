import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Truck, ArrowRight, Building2, FileText, Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, PaymentGatewayId } from '../types/store';
import { PaymentIcon } from './PaymentIcons';

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

export const COUNTRY_LOOKUP_MAP: Record<string, CountryDetails> = {
  'India': {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    phoneCode: '+91',
    postalLabel: 'Pincode',
    postalPlaceholder: 'e.g. 141008',
    phoneMinDigits: 10,
    phoneMaxDigits: 10,
    currency: 'INR',
    supportsLookup: true,
  },
  'United States': {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    phoneCode: '+1',
    postalLabel: 'ZIP Code',
    postalPlaceholder: 'e.g. 10282',
    phoneMinDigits: 10,
    phoneMaxDigits: 10,
    currency: 'USD',
    supportsLookup: true,
  },
  'United Kingdom': {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    phoneCode: '+44',
    postalLabel: 'Postcode',
    postalPlaceholder: 'e.g. SW1A 1AA',
    phoneMinDigits: 10,
    phoneMaxDigits: 11,
    currency: 'GBP',
    supportsLookup: true,
  },
  'United Arab Emirates': {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    phoneCode: '+971',
    postalLabel: 'Postal Code (Optional)',
    postalPlaceholder: 'e.g. 00000',
    phoneMinDigits: 8,
    phoneMaxDigits: 9,
    currency: 'USD',
    supportsLookup: false,
  },
  'Singapore': {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    phoneCode: '+65',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'e.g. 049318',
    phoneMinDigits: 8,
    phoneMaxDigits: 8,
    currency: 'SGD',
    supportsLookup: true,
  },
  'Malaysia': {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    phoneCode: '+60',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'e.g. 50450',
    phoneMinDigits: 9,
    phoneMaxDigits: 10,
    currency: 'MYR',
    supportsLookup: true,
  },
  'Fiji': {
    code: 'FJ',
    name: 'Fiji',
    flag: '🇫🇯',
    phoneCode: '+679',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'e.g. 00240',
    phoneMinDigits: 7,
    phoneMaxDigits: 7,
    currency: 'FJD',
    supportsLookup: false,
  },
  'Mauritius': {
    code: 'MU',
    name: 'Mauritius',
    flag: '🇲🇺',
    phoneCode: '+230',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'e.g. 742CU001',
    phoneMinDigits: 7,
    phoneMaxDigits: 8,
    currency: 'MUR',
    supportsLookup: false,
  },
  'Nepal': {
    code: 'NP',
    name: 'Nepal',
    flag: '🇳🇵',
    phoneCode: '+977',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'e.g. 44600',
    phoneMinDigits: 10,
    phoneMaxDigits: 10,
    currency: 'USD',
    supportsLookup: false,
  },
  'Canada': {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    phoneCode: '+1',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'e.g. M5V 2T6',
    phoneMinDigits: 10,
    phoneMaxDigits: 10,
    currency: 'USD',
    supportsLookup: true,
  },
  'Worldwide': {
    code: 'WW',
    name: 'Rest of World',
    flag: '🌐',
    phoneCode: '+1',
    postalLabel: 'Postal Code',
    postalPlaceholder: 'Zip / Postal Code',
    phoneMinDigits: 6,
    phoneMaxDigits: 15,
    currency: 'USD',
    supportsLookup: false,
  },
};

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotalINR,
    formatPrice,
    currentCurrency,
    selectedCountry,
    countries,
    currentMarket,
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

  if (!isCheckoutOpen) return null;

  const matchedCountry =
    countries.find((c) => c.name.toLowerCase() === country.toLowerCase() || c.code.toLowerCase() === country.toLowerCase()) ||
    countries.find((c) => c.code === selectedCountry.code);

  const isBlocked = matchedCountry?.shippingRule === 'BLOCK_ORDERS';
  const isIndia = matchedCountry?.code === 'IN' || country.toLowerCase() === 'india' || country.toLowerCase().includes('in');
  const activeCountryInfo = COUNTRY_LOOKUP_MAP[country] || COUNTRY_LOOKUP_MAP['Worldwide'];

  const handleCountryChange = (newCountryName: string) => {
    setCountry(newCountryName);
    setBillingCountry(newCountryName);
    setCity('');
    setState('');
    setPincode('');
    setPincodeError('');
    setAddressFormError('');
    setLookupNote('');
    setIsLookupReadonly(false);

    const newIsIndia = newCountryName.toLowerCase() === 'india' || newCountryName.toLowerCase().includes('in');
    if (!newIsIndia && paymentMethod === 'COD') {
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

  // Determine market payment gateways
  const marketMapping = marketGateways.find((mg) => mg.marketId === currentMarket.id) ||
    marketGateways.find((mg) => mg.countryCode === matchedCountry?.code);
  const activeGatewayIds: PaymentGatewayId[] = marketMapping
    ? marketMapping.gateways
    : (currentMarket.paymentGateways as PaymentGatewayId[]) || ['RAZORPAY', 'UPI', 'PHONEPE', 'COD'];

  // Filter paymentGateways by enabled & active for this market, AND EXCLUDE COD FOR INTERNATIONAL
  const availableGateways = paymentGateways
    .filter((gw) => gw.enabled && activeGatewayIds.includes(gw.id))
    .filter((gw) => isIndia || gw.id !== 'COD')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // COD checks
  const minOrder = codRules?.minOrderAmountINR ?? codRules?.minOrderINR ?? 0;
  const maxOrder = codRules?.maxOrderAmountINR ?? codRules?.maxOrderINR ?? 0;

  const isCodWithinLimits =
    (minOrder <= 0 || cartTotalINR >= minOrder) &&
    (maxOrder <= 0 || cartTotalINR <= maxOrder);

  const isCodAllowed = isIndia && (codRules?.enabled !== false) && isCodWithinLimits;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;
    setAddressFormError('');

    if (isIndia) {
      if (!name.trim()) {
        setAddressFormError('Please enter full name.');
        return;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setAddressFormError('Please enter a valid 10-digit Indian mobile number.');
        return;
      }
      if (altPhone.trim()) {
        const cleanAlt = altPhone.replace(/\D/g, '');
        if (cleanAlt.length !== 10) {
          setAddressFormError('Alternate mobile number must be a valid 10-digit Indian mobile number.');
          return;
        }
      }
      if (!line1.trim()) {
        setAddressFormError('Please enter complete address.');
        return;
      }
      const cleanPin = pincode.replace(/\D/g, '');
      if (cleanPin.length !== 6) {
        setAddressFormError('Please enter a valid 6-digit Indian pincode.');
        return;
      }
      if (!city || !state || pincodeError) {
        setAddressFormError('Please enter a valid Indian pincode to fetch City and State.');
        return;
      }
      if (!isBillingSame) {
        if (!billingName.trim()) {
          setAddressFormError('Please enter billing full name.');
          return;
        }
        if (!billingPhone.replace(/\D/g, '')) {
          setAddressFormError('Please enter billing mobile number.');
          return;
        }
        if (!billingAddress.trim()) {
          setAddressFormError('Please enter billing complete address.');
          return;
        }
        if (!billingPincode.replace(/\D/g, '')) {
          setAddressFormError('Please enter billing pincode.');
          return;
        }
        if (!billingCity.trim() || !billingState.trim()) {
          setAddressFormError('Please enter billing city and state.');
          return;
        }
      }
    } else {
      // International validation
      if (!name.trim()) {
        setAddressFormError('Please enter Full Name.');
        return;
      }
      const phoneDigits = phone.replace(/\D/g, '');
      if (!phoneDigits || phoneDigits.length < activeCountryInfo.phoneMinDigits || phoneDigits.length > activeCountryInfo.phoneMaxDigits) {
        setAddressFormError(`Please enter a valid mobile number for ${country} (${activeCountryInfo.phoneMinDigits}-${activeCountryInfo.phoneMaxDigits} digits).`);
        return;
      }
      if (altPhone.trim()) {
        const altDigits = altPhone.replace(/\D/g, '');
        if (altDigits.length < activeCountryInfo.phoneMinDigits || altDigits.length > activeCountryInfo.phoneMaxDigits) {
          setAddressFormError(`Alternate mobile number must be a valid number.`);
          return;
        }
      }
      if (!line1.trim()) {
        setAddressFormError('Please enter Address Line 1.');
        return;
      }
      if (activeCountryInfo.code !== 'AE' && !pincode.trim()) {
        setAddressFormError(`Please enter ${activeCountryInfo.postalLabel}.`);
        return;
      }
      if (!city.trim() || !state.trim()) {
        setAddressFormError('Please enter City and State / Province / Region.');
        return;
      }
      if (!isBillingSame) {
        if (!billingName.trim()) {
          setAddressFormError('Please enter billing full name.');
          return;
        }
        if (!billingPhone.replace(/\D/g, '')) {
          setAddressFormError('Please enter billing mobile number.');
          return;
        }
        if (!billingAddress.trim()) {
          setAddressFormError('Please enter billing address line 1.');
          return;
        }
        if (!billingCity.trim() || !billingState.trim()) {
          setAddressFormError('Please enter billing city and state.');
          return;
        }
      }
    }

    if (!isIndia && paymentMethod === 'COD') {
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
      const isCod = paymentMethod === 'COD';

      const fullAddress = line2 ? `${line1}, ${line2}${landmark ? `, Landmark: ${landmark}` : ''}` : (landmark ? `${line1}, Landmark: ${landmark}` : line1);
      const cleanPhoneDigits = phone.replace(/\D/g, '');
      const fullPhone = `${activeCountryInfo.phoneCode}${cleanPhoneDigits}`;
      const cleanAltDigits = altPhone.replace(/\D/g, '');
      const fullAltPhone = cleanAltDigits ? `${activeCountryInfo.phoneCode}${cleanAltDigits}` : '';

      const billingFullAddress = isBillingSame
        ? fullAddress
        : (billingLine2 ? `${billingAddress}, ${billingLine2}${billingLandmark ? `, Landmark: ${billingLandmark}` : ''}` : (billingLandmark ? `${billingAddress}, Landmark: ${billingLandmark}` : billingAddress));

      const billingFullPhone = isBillingSame
        ? fullPhone
        : (billingPhone ? `${activeCountryInfo.phoneCode}${billingPhone.replace(/\D/g, '')}` : '');

      const order = placeOrder({
        items: [...cart],
        totalAmountINR: cartTotalINR,
        currencyCode: currentCurrency.code,
        convertedTotal: currentCurrency.code === 'INR' ? cartTotalINR : Number((cartTotalINR / currentCurrency.rateToINR).toFixed(2)),
        customer: {
          name,
          email,
          phone: fullPhone,
          phoneCode: activeCountryInfo.phoneCode,
          localPhone: phone,
          altPhone: fullAltPhone,
          address: fullAddress,
          line1,
          line2,
          landmark,
          companyName,
          taxNumber,
          city,
          state,
          country,
          countryCode: activeCountryInfo.code,
          pincode,
          isBillingSame,
          billingName: isBillingSame ? name : billingName,
          billingPhone: billingFullPhone,
          billingAddress: billingFullAddress,
          billingLine1: isBillingSame ? line1 : billingAddress,
          billingLine2: isBillingSame ? line2 : billingLine2,
          billingCity: isBillingSame ? city : billingCity,
          billingState: isBillingSame ? state : billingState,
          billingPincode: isBillingSame ? pincode : billingPincode,
          billingCountry: isBillingSame ? country : billingCountry,
        },
        paymentMethod: paymentMethod,
        paymentStatus: isCod ? 'COD_DUE' : 'PAID',
        trackingStatus: 'ORDER_PLACED',
        trackingNumber: `HV-${Math.floor(100000 + Math.random() * 900000)}`,
        courierName: isIndia ? 'Delhivery Surface / Shiprocket' : 'DHL Express Worldwide',
        estimatedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      });

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
                  <option value="India">🇮🇳 India (INR)</option>
                  <option value="United States">🇺🇸 United States (USD)</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom (GBP)</option>
                  <option value="Singapore">🇸🇬 Singapore (SGD)</option>
                  <option value="Malaysia">🇲🇾 Malaysia (MYR)</option>
                  <option value="United Arab Emirates">🇦🇪 United Arab Emirates (USD)</option>
                  <option value="Fiji">🇫🇯 Fiji (FJD)</option>
                  <option value="Mauritius">🇲🇺 Mauritius (MUR)</option>
                  <option value="Nepal">🇳🇵 Nepal (USD)</option>
                  <option value="Canada">🇨🇦 Canada (USD)</option>
                  <option value="Worldwide">🌐 Rest of World (USD)</option>
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
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                          setAddressFormError('');
                        }}
                        placeholder="10-digit mobile number"
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
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
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
                        <input
                          type="tel"
                          required
                          value={billingPhone}
                          onChange={(e) => setBillingPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit number"
                          className="w-full bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg p-2 text-xs text-[var(--input-text)]"
                        />
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
                    {Object.values(COUNTRY_LOOKUP_MAP).map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name} ({c.currency})
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
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
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
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value.replace(/\D/g, ''))}
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
                            value={billingPhone}
                            onChange={(e) => setBillingPhone(e.target.value.replace(/\D/g, ''))}
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
                    {paymentMethod === 'STRIPE'
                      ? `PAY ${formatPrice(cartTotalINR)} VIA STRIPE`
                      : paymentMethod === 'PAYPAL'
                      ? `PAY ${formatPrice(cartTotalINR)} VIA PAYPAL`
                      : paymentMethod === 'RAZORPAY'
                      ? `PAY ${formatPrice(cartTotalINR)} VIA RAZORPAY`
                      : paymentMethod === 'PHONEPE'
                      ? `PAY ${formatPrice(cartTotalINR)} VIA PHONEPE`
                      : paymentMethod === 'UPI'
                      ? `PAY ${formatPrice(cartTotalINR)} VIA INSTANT UPI`
                      : paymentMethod === 'COD'
                      ? 'PLACE CASH ON DELIVERY ORDER'
                      : `PAY ${formatPrice(cartTotalINR)}`}
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
