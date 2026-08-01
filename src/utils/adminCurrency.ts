import { Order } from '../types/store';

/**
 * Standard Admin Base/Reporting Currency Formatter.
 * Admin Accounting MUST ALWAYS be fixed in Indian Rupees (INR).
 * Never reads storefront public country, currency, or localStorage state.
 */
export const formatAdminINR = (amountINR: number | undefined | null): string => {
  const val = Math.round(amountINR || 0);
  return `₹${val.toLocaleString('en-IN')}`;
};

/**
 * Formats the customer's original order amount in their selected currency at checkout.
 * Example: FJ$ 54.00, $31.00 USD, S$ 42.00, ₹1,999
 */
export const formatOriginalAmount = (order: Order): string => {
  const curr = order.displayCurrency || order.chargeCurrency || order.currencyCode || 'INR';
  const amt = order.displayAmount ?? order.chargeAmount ?? order.convertedTotal ?? order.totalAmountINR;

  if (curr === 'INR' || !amt) {
    return `₹${Math.round(order.totalAmountINR || 0).toLocaleString('en-IN')}`;
  }

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    SGD: 'S$',
    AUD: 'A$',
    CAD: 'C$',
    FJD: 'FJ$',
    AED: 'AED ',
    SAR: 'SAR ',
    MYR: 'RM ',
    NZD: 'NZ$',
    HKD: 'HK$',
    JPY: '¥',
    INR: '₹',
  };

  const symbol = currencySymbols[curr] || `${curr} `;
  return `${symbol}${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
