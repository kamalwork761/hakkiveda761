/**
 * Authoritative Price Helper for HAKKIVEDA Android App.
 * Ensures consistent usage of priceINR across all catalog, cart, and diagnostic flows.
 * Never silently converts missing/invalid prices to ₹0.
 */

import { Product, ProductVariant } from '../../types/store';
import { formatSafeINR } from './formatMoney';

export function getAuthoritativePriceINR(
  product?: Partial<Product> | null,
  variant?: Partial<ProductVariant> | null
): number | null {
  // If a specific variant is selected, its price takes absolute precedence
  if (variant) {
    if (typeof variant.priceINR === 'number' && !isNaN(variant.priceINR) && variant.priceINR > 0) {
      return variant.priceINR;
    }
    const rawVarPrice = (variant as any)?.price;
    if (typeof rawVarPrice === 'number' && !isNaN(rawVarPrice) && rawVarPrice > 0) {
      return rawVarPrice;
    }
  }

  // Base product priceINR
  if (product) {
    if (typeof product.priceINR === 'number' && !isNaN(product.priceINR) && product.priceINR > 0) {
      return product.priceINR;
    }
    if (typeof product.price === 'number' && !isNaN(product.price) && product.price > 0) {
      return product.price;
    }
    // Also check string prices with numbers
    if (product.priceINR) {
      const parsed = parseFloat(String(product.priceINR));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (product.price) {
      const parsed = parseFloat(String(product.price));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  return null;
}

export function getAuthoritativeOriginalPriceINR(
  product?: Partial<Product> | null,
  variant?: Partial<ProductVariant> | null
): number | null {
  if (variant) {
    if (typeof variant.originalPriceINR === 'number' && !isNaN(variant.originalPriceINR) && variant.originalPriceINR > 0) {
      return variant.originalPriceINR;
    }
    const rawVarOrig = (variant as any)?.originalPrice;
    if (typeof rawVarOrig === 'number' && !isNaN(rawVarOrig) && rawVarOrig > 0) {
      return rawVarOrig;
    }
  }

  if (product) {
    if (typeof product.originalPriceINR === 'number' && !isNaN(product.originalPriceINR) && product.originalPriceINR > 0) {
      return product.originalPriceINR;
    }
    if (typeof product.originalPrice === 'number' && !isNaN(product.originalPrice) && product.originalPrice > 0) {
      return product.originalPrice;
    }
    if (product.originalPriceINR) {
      const parsed = parseFloat(String(product.originalPriceINR));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (product.originalPrice) {
      const parsed = parseFloat(String(product.originalPrice));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  // Fallback: estimate 45% markup over sellable price if present
  const currentPrice = getAuthoritativePriceINR(product, variant);
  if (currentPrice !== null && currentPrice > 0) {
    return Math.round(currentPrice * 1.45);
  }

  return null;
}

export function formatProductPriceINR(
  product?: Partial<Product> | null,
  variant?: Partial<ProductVariant> | null,
  fallbackLabel: string = 'Price on Request'
): string {
  const price = getAuthoritativePriceINR(product, variant);
  if (price === null) {
    return fallbackLabel;
  }
  return formatSafeINR(price, fallbackLabel);
}

export function isSellablePrice(amount: number | null | undefined): boolean {
  return typeof amount === 'number' && !isNaN(amount) && isFinite(amount) && amount > 0;
}
