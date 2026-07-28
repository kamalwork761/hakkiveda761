import React from 'react';
import { PaymentGatewayId } from '../types/store';
import { Banknote, ShieldCheck } from 'lucide-react';

interface PaymentIconProps {
  gatewayId: PaymentGatewayId | string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PaymentIcon: React.FC<PaymentIconProps> = ({
  gatewayId,
  className = '',
  showName = false,
  size = 'md',
}) => {
  const normalized = (gatewayId || '').toUpperCase();

  const sizeClasses = {
    sm: 'h-4 w-auto',
    md: 'h-6 w-auto',
    lg: 'h-8 w-auto',
  }[size];

  switch (normalized) {
    case 'RAZORPAY':
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <div className="bg-[#02042B] px-2 py-1 rounded border border-[#0C2340] flex items-center gap-1">
            <svg className={`${sizeClasses}`} viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 2L2 26H10.5L16.5 12.5L20.5 26H28.5L20.5 2H12.5Z" fill="#0284C7" />
              <path d="M16.5 12.5L23.5 2H31.5L22.5 15.5L16.5 12.5Z" fill="#38BDF8" />
              <text x="34" y="20" fill="#FFFFFF" fontWeight="800" fontSize="16" fontFamily="sans-serif">
                Razorpay
              </text>
            </svg>
          </div>
          {showName && <span className="text-xs font-bold text-slate-100">Razorpay</span>}
        </div>
      );

    case 'STRIPE':
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <div className="bg-[#635BFF] px-2.5 py-1 rounded border border-[#4B45C6] flex items-center">
            <svg className={`${sizeClasses}`} viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="5" y="20" fill="#FFFFFF" fontWeight="800" fontSize="20" fontFamily="sans-serif" letterSpacing="-1">
                stripe
              </text>
            </svg>
          </div>
          {showName && <span className="text-xs font-bold text-slate-100">Stripe</span>}
        </div>
      );

    case 'PAYPAL':
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <div className="bg-[#003087] px-2.5 py-1 rounded border border-[#001C66] flex items-center">
            <svg className={`${sizeClasses}`} viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 2L3 24H8.5L11 8.5H16.5C20.5 8.5 23 6.5 23.5 3.5C24 0.5 21.5 0 17 0H8.5L8 2Z"
                fill="#0079C1"
              />
              <path
                d="M12.5 7L7.5 29H13L15.5 13.5H21C25 13.5 27.5 11.5 28 8.5C28.5 5.5 26 5 21.5 5H13L12.5 7Z"
                fill="#00457C"
              />
              <text x="32" y="20" fill="#FFFFFF" fontWeight="800" fontSize="16" fontFamily="sans-serif">
                PayPal
              </text>
            </svg>
          </div>
          {showName && <span className="text-xs font-bold text-slate-100">PayPal</span>}
        </div>
      );

    case 'PHONEPE':
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <div className="bg-[#5F259F] px-2.5 py-1 rounded border border-[#491B7D] flex items-center gap-1">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center font-bold text-[#5F259F] text-xs font-sans">
              पे
            </div>
            <span className="text-white font-extrabold text-xs font-sans tracking-tight">PhonePe</span>
          </div>
          {showName && <span className="text-xs font-bold text-slate-100">PhonePe</span>}
        </div>
      );

    case 'UPI':
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <div className="bg-white px-2 py-1 rounded border border-emerald-500 flex items-center gap-1">
            <svg className={`${sizeClasses}`} viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2L15 22H23L13 2H5Z" fill="#008000" />
              <path d="M15 2L25 22H33L23 2H15Z" fill="#FF8C00" />
              <text x="35" y="18" fill="#111827" fontWeight="900" fontSize="15" fontFamily="sans-serif">
                UPI
              </text>
            </svg>
          </div>
          {showName && <span className="text-xs font-bold text-slate-100">UPI</span>}
        </div>
      );

    case 'COD':
    default:
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <div className="bg-amber-950/80 px-2.5 py-1 rounded border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
            <span className="font-extrabold text-xs font-sans uppercase tracking-wider text-amber-200">
              Cash On Delivery
            </span>
          </div>
          {showName && <span className="text-xs font-bold text-slate-100">COD</span>}
        </div>
      );
  }
};

export const PaymentIcons: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`py-6 border-y border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs ${className}`}>
      <div className="flex items-center gap-2 text-slate-300">
        <ShieldCheck className="w-5 h-5 text-[var(--brand-gold)]" />
        <span className="font-semibold">100% Encrypted & PCI-DSS Compliant Checkout</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <PaymentIcon gatewayId="RAZORPAY" size="sm" />
        <PaymentIcon gatewayId="STRIPE" size="sm" />
        <PaymentIcon gatewayId="PAYPAL" size="sm" />
        <PaymentIcon gatewayId="PHONEPE" size="sm" />
        <PaymentIcon gatewayId="UPI" size="sm" />
        <PaymentIcon gatewayId="COD" size="sm" />
      </div>
    </div>
  );
};
