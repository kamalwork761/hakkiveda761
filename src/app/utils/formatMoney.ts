/**
 * Safe money and number formatting utility for HAKKIVEDA Android Native App & Web.
 * Guaranteed never to throw TypeError: Cannot read properties of undefined (reading 'toLocaleString').
 */

export function parseSafeAmount(
  amount: number | string | null | undefined
): number | null {
  if (amount === undefined || amount === null || amount === '') {
    return null;
  }
  if (typeof amount === 'number') {
    return isNaN(amount) || !isFinite(amount) ? null : amount;
  }
  const cleanStr = String(amount).replace(/[^0-9.-]+/g, '');
  if (!cleanStr) return null;
  const num = parseFloat(cleanStr);
  return isNaN(num) || !isFinite(num) ? null : num;
}

export function formatSafeINR(
  amount: number | string | null | undefined,
  fallback: string = ''
): string {
  const num = parseSafeAmount(amount);
  if (num === null) {
    return fallback;
  }

  try {
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  } catch {
    return `₹${Math.round(num)}`;
  }
}

export function formatSafeCurrency(
  amount: number | string | null | undefined,
  currencySymbol: string = '₹',
  fallback: string = ''
): string {
  const num = parseSafeAmount(amount);
  if (num === null) {
    return fallback;
  }

  try {
    return `${currencySymbol}${Math.round(num).toLocaleString('en-IN')}`;
  } catch {
    return `${currencySymbol}${Math.round(num)}`;
  }
}

export function formatSafeNumber(
  value: number | string | null | undefined,
  fallback: string = '0'
): string {
  const num = parseSafeAmount(value);
  if (num === null) {
    return fallback;
  }

  try {
    return Math.round(num).toLocaleString('en-IN');
  } catch {
    return String(Math.round(num));
  }
}
