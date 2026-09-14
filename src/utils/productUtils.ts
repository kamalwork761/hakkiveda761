import { Product } from '../types/store';

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getProductSlug = (product: { id: string; name: string; sku?: string; slug?: string }): string => {
  if (product.slug && product.slug.trim()) {
    return slugify(product.slug);
  }
  const nameSlug = slugify(product.name);
  return nameSlug || product.id;
};

export const getProductUrl = (product: { id: string; name: string; sku?: string; slug?: string }): string => {
  return `/products/${getProductSlug(product)}`;
};

export const getProductReviewsUrl = (product: { id: string; name: string; sku?: string; slug?: string }): string => {
  return `/products/${getProductSlug(product)}/reviews`;
};

export const findProductBySlug = (products: Product[], slug: string): Product | undefined => {
  if (!slug || !products || products.length === 0) return undefined;
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  
  return products.find((p) => {
    if (p.slug && p.slug.toLowerCase().trim() === cleanSlug) return true;
    if (p.slug && slugify(p.slug) === cleanSlug) return true;
    if (p.id.toLowerCase() === cleanSlug) return true;
    if (slugify(p.name) === cleanSlug) return true;
    if (p.sku && p.sku.toLowerCase() === cleanSlug) return true;
    // Partial id matching if slug ends with -prod-id or is prod-id
    if (cleanSlug.endsWith(`-${p.id.toLowerCase()}`)) return true;
    return false;
  });
};

/**
 * Normalizes country code or name to standard uppercase ISO2 code or clean uppercase string
 */
export const normalizeCountryCode = (countryCodeOrName?: string): string => {
  if (!countryCodeOrName) return 'IN';
  const val = countryCodeOrName.trim().toUpperCase();
  if (val === 'IN' || val === 'INDIA' || val === 'IND') return 'IN';
  if (val === 'US' || val === 'USA' || val === 'UNITED STATES' || val === 'UNITED STATES OF AMERICA') return 'US';
  if (val === 'GB' || val === 'UK' || val === 'UNITED KINGDOM' || val === 'GREAT BRITAIN') return 'GB';
  if (val === 'AE' || val === 'UAE' || val === 'UNITED ARAB EMIRATES' || val === 'DUBAI') return 'AE';
  if (val === 'SA' || val === 'KSA' || val === 'SAUDI ARABIA') return 'SA';
  if (val === 'SG' || val === 'SINGAPORE') return 'SG';
  if (val === 'MY' || val === 'MALAYSIA') return 'MY';
  if (val === 'MU' || val === 'MAURITIUS') return 'MU';
  if (val === 'FJ' || val === 'FIJI') return 'FJ';
  if (val === 'NP' || val === 'NEPAL') return 'NP';
  if (val === 'CA' || val === 'CANADA') return 'CA';
  if (val === 'AU' || val === 'AUSTRALIA') return 'AU';
  if (val === 'NZ' || val === 'NEW ZEALAND') return 'NZ';
  if (val === 'DE' || val === 'GERMANY') return 'DE';
  if (val === 'FR' || val === 'FRANCE') return 'FR';
  return val.length === 2 ? val : val.slice(0, 2);
};

export const isIndiaDestination = (countryCodeOrName?: string): boolean => {
  if (!countryCodeOrName) return true;
  const norm = normalizeCountryCode(countryCodeOrName);
  const lower = countryCodeOrName.trim().toLowerCase();
  return norm === 'IN' || lower === 'india' || lower === 'in';
};

/**
 * Validates whether a product is available for sale and shipping to the given country
 */
export const isProductAvailableForCountry = (
  product: Partial<Product> | null | undefined,
  countryCodeOrName?: string
): { available: boolean; reason?: string } => {
  if (!product) {
    return { available: false, reason: 'Product not found.' };
  }

  // Domestic (India)
  if (isIndiaDestination(countryCodeOrName)) {
    if (product.status === 'ARCHIVED' || product.status === 'DRAFT') {
      return { available: false, reason: 'Product is currently unavailable.' };
    }
    return { available: true };
  }

  // International
  // 1. Is international sales enabled for this product? (Default: true if undefined for backwards compatibility)
  if (product.internationalEnabled === false) {
    return {
      available: false,
      reason: 'This herbal formulation is currently not available for international dispatch.',
    };
  }

  const destinationIso = normalizeCountryCode(countryCodeOrName);
  const destinationRaw = (countryCodeOrName || '').trim().toUpperCase();

  // 2. Country Allowlist Check (if configured and non-empty)
  if (
    Array.isArray(product.internationalAllowedCountries) &&
    product.internationalAllowedCountries.length > 0
  ) {
    const allowedList = product.internationalAllowedCountries.map((c) => c.trim().toUpperCase());
    const isAllowed =
      allowedList.includes(destinationIso) ||
      allowedList.includes(destinationRaw) ||
      allowedList.includes('ALL') ||
      allowedList.includes('*');

    if (!isAllowed) {
      return {
        available: false,
        reason: `This formulation is not permitted for shipping to ${countryCodeOrName || 'your destination'}.`,
      };
    }
  }

  // 3. Country Blocklist Check (if configured and non-empty)
  if (
    Array.isArray(product.internationalBlockedCountries) &&
    product.internationalBlockedCountries.length > 0
  ) {
    const blockedList = product.internationalBlockedCountries.map((c) => c.trim().toUpperCase());
    const isBlocked =
      blockedList.includes(destinationIso) ||
      blockedList.includes(destinationRaw);

    if (isBlocked) {
      return {
        available: false,
        reason: `International delivery of this item to ${countryCodeOrName || 'your destination'} is currently restricted.`,
      };
    }
  }

  return { available: true };
};

/**
 * Calculates the authoritative INR price for a product based on destination country
 */
export const getProductPriceINRForCountry = (
  product: Partial<Product> | null | undefined,
  countryCodeOrName?: string
): number => {
  if (!product) return 0;
  const basePrice = Number(product.priceINR) || 0;

  // Domestic (India) always uses the normal India INR price
  if (isIndiaDestination(countryCodeOrName)) {
    return basePrice;
  }

  // International pricing logic
  const mode = product.internationalPricingMode || 'SAME_AS_INDIA';

  if (mode === 'FIXED_INR') {
    if (product.internationalPriceINR && product.internationalPriceINR > 0) {
      return Math.round(Number(product.internationalPriceINR));
    }
    return basePrice;
  }

  if (mode === 'MARKUP_PERCENT') {
    const markupPct = Number(product.internationalMarkupPercent) || 0;
    if (markupPct > 0) {
      return Math.round(basePrice * (1 + markupPct / 100));
    }
    return basePrice;
  }

  // Default: SAME_AS_INDIA
  return basePrice;
};

/**
 * Returns a product representation with effective pricing, title, and description for the destination country
 */
export const getEffectiveProductForCountry = (
  product: Product,
  countryCodeOrName?: string
): Product => {
  if (isIndiaDestination(countryCodeOrName)) {
    return product;
  }

  const effectivePriceINR = getProductPriceINRForCountry(product, countryCodeOrName);
  const effectiveTitle = product.internationalTitle?.trim() || product.name;
  const effectiveDescription = product.internationalDescription?.trim() || product.description;

  return {
    ...product,
    name: effectiveTitle,
    description: effectiveDescription,
    priceINR: effectivePriceINR,
  };
};

