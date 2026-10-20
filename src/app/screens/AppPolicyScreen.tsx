import React, { useEffect } from 'react';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import { LIVE_BASE_URL } from '../utils/nativeUrl';

export type AppPolicyKind = 'shipping' | 'returns' | 'privacy';

const POLICIES: Record<AppPolicyKind, { title: string; path: string; subtitle: string }> = {
  shipping: { title: 'Shipping Policy', path: '/shipping-policy', subtitle: 'Delivery information and shipping terms' },
  returns: { title: 'Returns & Refund Policy', path: '/refund-policy', subtitle: 'Returns, refunds and eligibility' },
  privacy: { title: 'Privacy Policy', path: '/privacy-policy', subtitle: 'How your information is handled' },
};

export const AppPolicyScreen: React.FC<{ policy: AppPolicyKind; onBack: () => void }> = ({ policy, onBack }) => {
  const info = POLICIES[policy];
  const url = `${LIVE_BASE_URL}${info.path}`;
  const openPolicy = () => {
    if (Capacitor.isNativePlatform()) {
      void Browser.open({ url, presentationStyle: 'fullscreen' }).catch(() => window.open(url, '_blank', 'noopener,noreferrer'));
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  useEffect(() => { openPolicy(); }, [policy]);
  return (
    <div className="flex min-h-[calc(100dvh-90px)] flex-col bg-[#FAF7F2]">
      <div className="border-b border-[#DCC99B] bg-[#0E382C] px-5 py-5">
        <button type="button" onClick={onBack} className="mb-4 flex items-center gap-2 text-sm font-bold text-[#FFF9EA]"><ArrowLeft className="h-5 w-5" /> Back</button>
        <div className="flex items-center gap-3">
          <FileText className="h-9 w-9 shrink-0 text-[#E6C86B]" />
          <div><h1 className="font-serif text-2xl font-bold !text-[#FFF9EA]" style={{color:'#FFF9EA',WebkitTextFillColor:'#FFF9EA'}}>{info.title}</h1><p className="mt-1 text-xs text-[#E8DDBD]">{info.subtitle}</p></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-white px-6 py-12 text-center">
        <FileText className="h-14 w-14 text-[#B88B2D]" />
        <p className="text-base font-semibold text-[#0E382C]">View the latest {info.title.toLowerCase()} securely in the in-app browser.</p>
        <button type="button" onClick={openPolicy} className="rounded-xl bg-[#0E382C] px-6 py-3 font-bold text-white">Open {info.title}</button>
      </div>

    </div>
  );
};
