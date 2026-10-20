import React from 'react';
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
  return (
    <div className="flex min-h-[calc(100dvh-90px)] flex-col bg-[#FAF7F2]">
      <div className="border-b border-[#DCC99B] bg-[#0E382C] px-5 py-5">
        <button type="button" onClick={onBack} className="mb-4 flex items-center gap-2 text-sm font-bold text-[#FFF9EA]"><ArrowLeft className="h-5 w-5" /> Back</button>
        <div className="flex items-center gap-3">
          <FileText className="h-9 w-9 shrink-0 text-[#E6C86B]" />
          <div><h1 className="font-serif text-2xl font-bold !text-[#FFF9EA]" style={{color:'#FFF9EA',WebkitTextFillColor:'#FFF9EA'}}>{info.title}</h1><p className="mt-1 text-xs text-[#E8DDBD]">{info.subtitle}</p></div>
        </div>
      </div>
      <div className="flex-1 bg-white">
        <iframe title={info.title} src={url} className="block h-[calc(100dvh-205px)] min-h-[460px] w-full border-0" />
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border-t border-[#DCC99B] bg-[#FFF8E8] px-4 py-3 text-sm font-bold text-[#0E382C]">
        Open full {info.title} <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};
