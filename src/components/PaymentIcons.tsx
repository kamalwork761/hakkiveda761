import React from 'react';
import { Building2, Banknote, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PaymentIcons: React.FC = () => {
  const { siteSettings } = useStore();
  const codEnabled = siteSettings?.codEnabled ?? true;

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2L2 22H10L14 12H20L16 2H10Z" fill="#0C2340"/>
          <path d="M14 12L10 22H18L26 2H18L14 12Z" fill="#008CFF"/>
          <text x="30" y="17" fontSize="13" fontFamily="sans-serif" fontWeight="800" fill="#ffffff" letterSpacing="-0.5">Razorpay</text>
        </svg>
      ),
    },
    {
      id: 'paypal',
      name: 'PayPal',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 85 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 3H5C4.2 3 3.5 3.6 3.4 4.4L0.5 21.5C0.4 22 0.8 22.5 1.3 22.5H5.8C6.6 22.5 7.3 21.9 7.4 21.1L8.6 13.5H11.5C15.8 13.5 18.7 11.4 19.3 7.4C19.9 3.6 17.5 3 12.5 3Z" fill="#003087"/>
          <path d="M17.5 3H10C9.2 3 8.5 3.6 8.4 4.4L5.5 21.5C5.4 22 5.8 22.5 6.3 22.5H10.8C11.6 22.5 12.3 21.9 12.4 21.1L13.6 13.5H16.5C20.8 13.5 23.7 11.4 24.3 7.4C24.9 3.6 22.5 3 17.5 3Z" fill="#0079C1" opacity="0.9"/>
          <text x="28" y="17" fontSize="13" fontFamily="sans-serif" fontWeight="800" fill="#ffffff">PayPal</text>
        </svg>
      ),
    },
    {
      id: 'stripe',
      name: 'Stripe',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 75 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.2 9.5c0-.8.7-1.2 1.8-1.2 1.6 0 3.6.5 5.2 1.4V4.4c-1.7-.7-3.5-1-5.3-1C2.5 3.4 0 5.8 0 9.8c0 6.2 8.5 5.2 8.5 7.9 0 .9-.8 1.3-2 1.3-1.8 0-4.1-.7-5.8-1.7v5.3c1.9.9 3.9 1.3 5.8 1.3 4.6 0 7.3-2.3 7.3-6.3 0-6.7-8.6-5.5-8.6-8.1z" fill="#635BFF"/>
          <text x="20" y="17" fontSize="15" fontFamily="sans-serif" fontWeight="800" fill="#ffffff">stripe</text>
        </svg>
      ),
    },
    {
      id: 'visa',
      name: 'Visa',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="17" fontSize="18" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fill="#ffffff" letterSpacing="1">
            VI<tspan fill="#F7B600">S</tspan>A
          </text>
        </svg>
      ),
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 90 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="11" r="9" fill="#EB001B"/>
          <circle cx="21" cy="11" r="9" fill="#F79E1B" fillOpacity="0.85"/>
          <text x="34" y="15" fontSize="11" fontFamily="sans-serif" fontWeight="700" fill="#ffffff">mastercard</text>
        </svg>
      ),
    },
    {
      id: 'amex',
      name: 'American Express',
      enabled: true,
      svg: (
        <svg className="h-4.5 w-auto" viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="22" rx="3" fill="#006FCF"/>
          <text x="5" y="15" fontSize="10" fontFamily="sans-serif" fontWeight="900" fill="#ffffff" letterSpacing="0.5">AMEX</text>
        </svg>
      ),
    },
    {
      id: 'rupay',
      name: 'RuPay',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 65 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="16" fontSize="13" fontFamily="sans-serif" fontWeight="900" fill="#00529C">
            Ru<tspan fill="#F37023">Pay</tspan>
            <tspan fill="#00529C" fontSize="10">❯❯</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'upi',
      name: 'UPI',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 55 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="55" height="22" rx="3" fill="#000000" stroke="#73BE43" strokeWidth="1"/>
          <path d="M12 5L18 11L12 17H7L13 11L7 5H12Z" fill="#73BE43"/>
          <text x="22" y="16" fontSize="12" fontFamily="sans-serif" fontWeight="900" fill="#ffffff">UPI</text>
        </svg>
      ),
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 80 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="11" r="9" fill="#5F259F"/>
          <text x="6" y="15" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#ffffff">पे</text>
          <text x="24" y="15" fontSize="12" fontFamily="sans-serif" fontWeight="800" fill="#ffffff">PhonePe</text>
        </svg>
      ),
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 65 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="16" fontSize="14" fontFamily="sans-serif" fontWeight="800" fill="#ffffff">
            <tspan fill="#4285F4">G</tspan>
            <tspan fill="#EA4335">P</tspan>
            <tspan fill="#FBBC05">a</tspan>
            <tspan fill="#34A853">y</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 70 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5.5c-.4.5-1.1.9-1.7.9-.1-.7.3-1.4.7-1.8.4-.5 1.2-.9 1.8-.9.1.7-.3 1.4-.8 1.8zm1.8 1c-1 0-1.8.5-2.2.5s-1.2-.5-2-.5c-1.1 0-2.1.6-2.6 1.6-1.1 1.9-.3 4.7.8 6.2 0 .7.9 1.5 1.7 1.4.8 0 1.1-.5 2-.5s1.1.5 2 .5c.9 0 1.5-.7 2-1.4.6-.9.8-1.8.1-1.9-1.6-.6-1.9-2.9-.3-3.9-.6-.8-1.6-1.2-2.3-1.2z" fill="#ffffff"/>
          <text x="20" y="16" fontSize="13" fontFamily="sans-serif" fontWeight="700" fill="#ffffff">Pay</text>
        </svg>
      ),
    },
    {
      id: 'amazonpay',
      name: 'Amazon Pay',
      enabled: true,
      svg: (
        <svg className="h-4 w-auto" viewBox="0 0 90 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="2" y="15" fontSize="12" fontFamily="sans-serif" fontWeight="800" fill="#FF9900">
            amazon <tspan fill="#ffffff">pay</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      enabled: true,
      svg: (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100 font-sans whitespace-nowrap">
          <Building2 className="w-4 h-4 text-[var(--brand-gold)]" />
          <span>Net Banking</span>
        </div>
      ),
    },
    {
      id: 'cod',
      name: 'Cash on Delivery (India Only)',
      enabled: codEnabled,
      svg: (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100 font-sans whitespace-nowrap">
          <Banknote className="w-4 h-4 text-emerald-400" />
          <span>COD (India)</span>
        </div>
      ),
    },
  ];

  return (
    <div className="py-8 border-b border-white/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[var(--brand-gold)]" />
          <h4 className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] uppercase tracking-[0.2em]">
            SECURE PAYMENTS & ENCRYPTED CHECKOUT
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 font-sans">
          SSL 256-Bit Bank Grade Encryption • Official Gateways
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {paymentMethods.map((method) => {
          if (!method.enabled) return null;
          return (
            <div
              key={method.id}
              className="bg-[var(--brand-primary-deep)] border border-white/10 hover:border-[var(--brand-gold)]/60 px-3 py-2 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm cursor-default select-none h-10 group"
              title={method.name}
            >
              <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                {method.svg}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
