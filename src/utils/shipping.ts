/**
 * Phase 10D: Authoritative shipping calculation rules for HakkiVeda
 * 
 * Unifies shipping fees and free shipping thresholds across:
 * - Cart Drawer
 * - Checkout Modal & Order Review
 * - Server Order Total & Razorpay Verification
 * 
 * Rules:
 * - India: Free standard shipping at or above ₹999; otherwise ₹99.
 * - International: Free shipping ONLY if enabled by Admin with a threshold.
 * - International rates resolved strictly via hierarchy:
 *   1. Live Carrier (Shiprocket API) if finite and > 0
 *   2. Admin Country Rate (internationalCountryShippingRates[ISO2])
 *   3. Admin Default Rate (internationalDefaultShippingRateINR)
 *   4. Unserviceable
 * 
 * Developer-defined hardcoded monetary rates (₹499, ₹1850) have been completely removed.
 */

export interface ShippingQuote {
  isIndia: boolean;
  countryCode: string;
  thresholdINR: number | null;
  shippingFeeINR: number;
  isFree: boolean;
  amountNeededForFreeINR: number;
  standardRateINR: number;
  courierLabel: string;
  estimatedDelivery?: string;
  isDynamicQuote?: boolean;
  serviceable: boolean;
  source:
    | 'DOMESTIC_STANDARD'
    | 'DOMESTIC_FREE'
    | 'LIVE_CARRIER'
    | 'ADMIN_COUNTRY_RATE'
    | 'ADMIN_DEFAULT_RATE'
    | 'ADMIN_INTERNATIONAL_FREE'
    | 'UNSERVICEABLE';
}

export interface ShippingSettingsConfig {
  internationalShippingEnabled?: boolean;
  internationalDefaultShippingRateINR?: number;
  internationalCountryShippingRates?: Record<string, number>;
  internationalFreeShippingEnabled?: boolean;
  internationalFreeShippingThresholdINR?: number | null;
}

/**
 * Non-monetary informational delivery estimates by country
 */
export const INFORMATIONAL_CARRIER_DETAILS: Record<string, { courierName: string; estimatedDays: string }> = {
  'US': { courierName: 'DHL Express Worldwide', estimatedDays: '4–7 Business Days' },
  'CA': { courierName: 'DHL Express Worldwide', estimatedDays: '4–8 Business Days' },
  'GB': { courierName: 'DHL Express Worldwide', estimatedDays: '3–6 Business Days' },
  'AE': { courierName: 'Aramex International / DHL Express', estimatedDays: '3–5 Business Days' },
  'AU': { courierName: 'DHL Express Worldwide Oceania', estimatedDays: '5–8 Business Days' },
  'NZ': { courierName: 'DHL Express Worldwide Oceania', estimatedDays: '5–9 Business Days' },
  'FJ': { courierName: 'DHL International Express Fiji', estimatedDays: '6–10 Business Days' },
  'SG': { courierName: 'DHL Express Singapore', estimatedDays: '3–5 Business Days' },
  'MY': { courierName: 'DHL Express Malaysia', estimatedDays: '4–6 Business Days' },
  'MU': { courierName: 'DHL International Express Mauritius', estimatedDays: '5–8 Business Days' },
  'DE': { courierName: 'DHL Express Europe', estimatedDays: '4–7 Business Days' },
  'FR': { courierName: 'DHL Express Europe', estimatedDays: '4–7 Business Days' },
  'IT': { courierName: 'DHL Express Europe', estimatedDays: '4–7 Business Days' },
  'ES': { courierName: 'DHL Express Europe', estimatedDays: '4–7 Business Days' },
  'NL': { courierName: 'DHL Express Europe', estimatedDays: '4–6 Business Days' },
  'CH': { courierName: 'DHL Express Worldwide', estimatedDays: '4–7 Business Days' },
  'SA': { courierName: 'Aramex Express GCC', estimatedDays: '3–6 Business Days' },
  'QA': { courierName: 'Aramex Express GCC', estimatedDays: '3–5 Business Days' },
  'KW': { courierName: 'Aramex Express GCC', estimatedDays: '3–5 Business Days' },
  'OM': { courierName: 'Aramex Express GCC', estimatedDays: '3–5 Business Days' },
  'BH': { courierName: 'Aramex Express GCC', estimatedDays: '3–5 Business Days' },
  'TH': { courierName: 'DHL Express South East Asia', estimatedDays: '4–6 Business Days' },
  'ID': { courierName: 'DHL Express Asia', estimatedDays: '4–7 Business Days' },
  'PH': { courierName: 'DHL Express Asia', estimatedDays: '4–7 Business Days' },
  'JP': { courierName: 'DHL Express East Asia', estimatedDays: '4–7 Business Days' },
  'HK': { courierName: 'DHL Express East Asia', estimatedDays: '3–5 Business Days' },
  'ZA': { courierName: 'DHL Express South Africa', estimatedDays: '5–9 Business Days' },
  'KE': { courierName: 'DHL Express Africa', estimatedDays: '5–8 Business Days' },
  'NP': { courierName: 'Air Cargo Express Nepal', estimatedDays: '3–6 Business Days' },
  'LK': { courierName: 'DHL Express Sri Lanka', estimatedDays: '3–5 Business Days' },
  'BD': { courierName: 'DHL Express Bangladesh', estimatedDays: '3–5 Business Days' },
  'IN': { courierName: 'Shiprocket Surface Delivery', estimatedDays: '3–5 Business Days' },
};

export function isIndiaCountry(countryOrCode?: string): boolean {
  if (!countryOrCode) return true;
  const clean = countryOrCode.trim().toUpperCase();
  return clean === 'IN' || clean === 'IND' || clean === 'INDIA';
}

export function normalizeCountryCode(countryOrCode?: string): string {
  if (!countryOrCode) return 'IN';
  const clean = countryOrCode.trim().toUpperCase();
  if (clean === 'INDIA' || clean === 'IND' || clean === 'IN') return 'IN';
  if (clean === 'USA' || clean === 'UNITED STATES' || clean === 'UNITED STATES OF AMERICA' || clean === 'US') return 'US';
  if (clean === 'UK' || clean === 'UNITED KINGDOM' || clean === 'GREAT BRITAIN' || clean === 'GB') return 'GB';
  if (clean === 'UAE' || clean === 'UNITED ARAB EMIRATES' || clean === 'AE') return 'AE';
  if (clean === 'FIJI' || clean === 'FJ') return 'FJ';
  if (clean === 'AUSTRALIA' || clean === 'AU') return 'AU';
  if (clean === 'CANADA' || clean === 'CA') return 'CA';
  if (clean === 'NEW ZEALAND' || clean === 'NZ') return 'NZ';
  if (clean === 'SINGAPORE' || clean === 'SG') return 'SG';
  if (clean === 'MALAYSIA' || clean === 'MY') return 'MY';
  if (clean === 'MAURITIUS' || clean === 'MU') return 'MU';
  if (clean === 'GERMANY' || clean === 'DE') return 'DE';
  if (clean === 'FRANCE' || clean === 'FR') return 'FR';
  if (clean === 'SPAIN' || clean === 'ES') return 'ES';
  if (clean === 'ITALY' || clean === 'IT') return 'IT';
  if (clean === 'NETHERLANDS' || clean === 'NL') return 'NL';
  if (clean === 'SWITZERLAND' || clean === 'CH') return 'CH';
  if (clean === 'SOUTH AFRICA' || clean === 'ZA') return 'ZA';
  if (clean === 'KENYA' || clean === 'KE') return 'KE';
  if (clean === 'NEPAL' || clean === 'NP') return 'NP';
  if (clean === 'SRI LANKA' || clean === 'LK') return 'LK';
  if (clean === 'BANGLADESH' || clean === 'BD') return 'BD';
  return clean.length === 2 ? clean : clean.slice(0, 2);
}

export function getDestinationCourierInfo(countryOrCode?: string): { courierName: string; estimatedDays: string } {
  const code = normalizeCountryCode(countryOrCode);
  if (INFORMATIONAL_CARRIER_DETAILS[code]) {
    return INFORMATIONAL_CARRIER_DETAILS[code];
  }
  if (code === 'IN') {
    return { courierName: 'Shiprocket Surface Delivery', estimatedDays: '3–5 Business Days' };
  }
  return { courierName: 'DHL Express International', estimatedDays: '5–9 Business Days' };
}

/**
 * Authoritative Unified Shipping Quote Calculation
 */
export function getAuthoritativeShippingQuote(
  cartSubtotalINR: number,
  countryOrCode?: string,
  customShippingFeeINR?: number | null,
  customCourierLabel?: string,
  siteSettings?: ShippingSettingsConfig
): ShippingQuote {
  const isIndia = isIndiaCountry(countryOrCode);
  const countryCode = normalizeCountryCode(countryOrCode);

  // 1. Domestic India Shipping Rules:
  // - ₹999 or more: ₹0 (Free Shipping)
  // - Under ₹999: ₹99 standard shipping
  if (isIndia) {
    const thresholdINR = 999;
    const isFree = cartSubtotalINR >= thresholdINR;
    const standardRateINR = 99;
    const shippingFeeINR = isFree ? 0 : standardRateINR;
    const amountNeededForFreeINR = Math.max(0, thresholdINR - cartSubtotalINR);
    const courierLabel = customCourierLabel || 'Shiprocket Surface Delivery';

    return {
      isIndia: true,
      countryCode: 'IN',
      thresholdINR,
      shippingFeeINR,
      isFree,
      amountNeededForFreeINR,
      standardRateINR,
      courierLabel,
      estimatedDelivery: '3–5 Business Days',
      isDynamicQuote: false,
      serviceable: true,
      source: isFree ? 'DOMESTIC_FREE' : 'DOMESTIC_STANDARD',
    };
  }

  // 2. International Shipping Rules:
  const info = getDestinationCourierInfo(countryCode);

  // Check if international shipping is explicitly disabled
  if (siteSettings?.internationalShippingEnabled === false) {
    return {
      isIndia: false,
      countryCode,
      thresholdINR: null,
      shippingFeeINR: 0,
      isFree: false,
      amountNeededForFreeINR: 0,
      standardRateINR: 0,
      courierLabel: 'International Shipping Paused',
      estimatedDelivery: undefined,
      isDynamicQuote: false,
      serviceable: false,
      source: 'UNSERVICEABLE',
    };
  }

  // International Free Shipping is ADMIN-CONTROLLED ONLY
  const freeShippingEnabled = Boolean(
    siteSettings?.internationalFreeShippingEnabled &&
    typeof siteSettings?.internationalFreeShippingThresholdINR === 'number' &&
    siteSettings.internationalFreeShippingThresholdINR > 0
  );
  const thresholdINR = freeShippingEnabled ? siteSettings!.internationalFreeShippingThresholdINR! : null;
  const isFree = Boolean(freeShippingEnabled && thresholdINR !== null && cartSubtotalINR >= thresholdINR);
  const amountNeededForFreeINR = (freeShippingEnabled && thresholdINR !== null) ? Math.max(0, thresholdINR - cartSubtotalINR) : 0;

  // Rate Resolution Hierarchy:
  // 1. Live Carrier (customShippingFeeINR) -> finite and > 0
  // 2. Admin Country Rate (internationalCountryShippingRates[ISO2])
  // 3. Admin Default Rate (internationalDefaultShippingRateINR)
  // 4. Unserviceable
  let resolvedRateINR: number;
  let source: ShippingQuote['source'];

  if (typeof customShippingFeeINR === 'number' && Number.isFinite(customShippingFeeINR) && customShippingFeeINR > 0) {
    resolvedRateINR = Math.round(customShippingFeeINR);
    source = 'LIVE_CARRIER';
  } else if (
    siteSettings?.internationalCountryShippingRates &&
    typeof siteSettings.internationalCountryShippingRates[countryCode] === 'number' &&
    Number.isFinite(siteSettings.internationalCountryShippingRates[countryCode]) &&
    siteSettings.internationalCountryShippingRates[countryCode] > 0
  ) {
    resolvedRateINR = Math.round(siteSettings.internationalCountryShippingRates[countryCode]);
    source = 'ADMIN_COUNTRY_RATE';
  } else if (
    typeof siteSettings?.internationalDefaultShippingRateINR === 'number' &&
    Number.isFinite(siteSettings.internationalDefaultShippingRateINR) &&
    siteSettings.internationalDefaultShippingRateINR > 0
  ) {
    resolvedRateINR = Math.round(siteSettings.internationalDefaultShippingRateINR);
    source = 'ADMIN_DEFAULT_RATE';
  } else {
    return {
      isIndia: false,
      countryCode,
      thresholdINR,
      shippingFeeINR: 0,
      isFree: false,
      amountNeededForFreeINR,
      standardRateINR: 0,
      courierLabel: 'International Shipping Unavailable',
      estimatedDelivery: undefined,
      isDynamicQuote: false,
      serviceable: false,
      source: 'UNSERVICEABLE',
    };
  }

  const standardRateINR = resolvedRateINR;
  const shippingFeeINR = isFree ? 0 : standardRateINR;
  const courierLabel = customCourierLabel || info.courierName;

  return {
    isIndia: false,
    countryCode,
    thresholdINR,
    shippingFeeINR,
    isFree,
    amountNeededForFreeINR,
    standardRateINR,
    courierLabel,
    estimatedDelivery: info.estimatedDays,
    isDynamicQuote: source === 'LIVE_CARRIER',
    serviceable: true,
    source: isFree ? 'ADMIN_INTERNATIONAL_FREE' : source,
  };
}
