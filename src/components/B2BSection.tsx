import React from 'react';
import {
  Building2,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Package,
  FileCheck,
  Tag,
  Truck,
  Headphones,
  Award,
  Sparkles,
  Star,
  Lock,
  ArrowRight,
  Layers,
  Factory,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const renderIcon = (iconName: string) => {
  const cls = 'w-5 h-5 shrink-0 text-[#123F2A]';
  switch (iconName) {
    case 'Package':
    case 'Bulk':
      return <Package className={cls} />;
    case 'FileCheck':
    case 'Documentation':
      return <FileCheck className={cls} />;
    case 'Tag':
    case 'PrivateLabel':
      return <Tag className={cls} />;
    case 'Truck':
    case 'Shipping':
      return <Truck className={cls} />;
    case 'ShieldCheck':
    case 'Factory':
      return <ShieldCheck className={cls} />;
    case 'Headphones':
    case 'Support':
      return <Headphones className={cls} />;
    case 'Building2':
      return <Building2 className={cls} />;
    case 'Globe':
      return <Globe className={cls} />;
    case 'Award':
      return <Award className={cls} />;
    case 'Layers':
      return <Layers className={cls} />;
    default:
      return <CheckCircle2 className={cls} />;
  }
};

const DEFAULT_BENEFIT_CARDS = [
  {
    id: 'b2b-1',
    icon: 'Package',
    title: 'Bulk & Distributor Supply',
    description: 'High-volume packaged units and 25L - 200L raw oil drums with progressive volume price tiers.',
  },
  {
    id: 'b2b-2',
    icon: 'Tag',
    title: 'Private Label Opportunities',
    description: 'Custom white-label branding, customized bottle sizes, and bespoke herbal formulation options.',
  },
  {
    id: 'b2b-3',
    icon: 'FileCheck',
    title: 'Export Documentation Support',
    description: 'Full Certificate of Analysis (COA), MSDS, laboratory safety reports, and phytosanitary clearance.',
  },
  {
    id: 'b2b-4',
    icon: 'Truck',
    title: 'Worldwide Shipping Support',
    description: 'Expedited air courier and containerized sea freight logistics with complete export customs assistance.',
  },
  {
    id: 'b2b-5',
    icon: 'ShieldCheck',
    title: 'Direct Factory Supply',
    description: 'Guaranteed 100% authentic 42-herb Ayurvedic formulations direct from our source facility in Mysore.',
  },
  {
    id: 'b2b-6',
    icon: 'Headphones',
    title: 'Dedicated B2B Assistance',
    description: 'Assigned export trade manager for quotation dispatch, sample dispatch, and priority logistics tracking.',
  },
];

export const B2BSection: React.FC = () => {
  const { b2bSectionConfig, playSound } = useStore();

  const handleNavigateToEnquiry = () => {
    playSound?.('nav_click');
    window.history.pushState({}, '', '/b2b-enquiry');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const config = b2bSectionConfig;
  if (config && config.enabled === false) {
    return null;
  }

  return (
    <section
      id="b2b"
      className="py-16 sm:py-20 relative overflow-hidden border-t border-b border-[#E5D8B5] scroll-mt-12 bg-[#FAF8F2]"
    >
      <div id="b2b-export" className="absolute -top-12 left-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-10">
        {/* Main B2B Container */}
        <div className="bg-white border border-[#E5D8B5] rounded-3xl p-6 sm:p-12 shadow-md">
          {/* Header Area */}
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#123F2A]/10 text-[#123F2A] border border-[#123F2A]/20">
              <Building2 className="w-3.5 h-3.5 text-[#C9A84E]" />
              Wholesale & Export Partnerships
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#123F2A] leading-tight">
              Partner With HAKKIVEDA
            </h2>

            <h3 className="text-sm sm:text-base font-semibold text-[#123F2A]">
              Wholesale, Distribution & Export Partnerships
            </h3>

            <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#37463D] max-w-2xl">
              HAKKIVEDA collaborates with global distributors, retail chains, Ayurvedic wellness stores, luxury salons, spas, and international partners. We supply authentic tribal herbal hair formulations with full export documentation and direct factory pricing.
            </p>
          </div>

          {/* 6 Concise Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
            {DEFAULT_BENEFIT_CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-[#FAF8F2] border border-[#E5D8B5] hover:border-[#C9A84E] rounded-2xl p-4.5 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5D8B5] flex items-center justify-center shrink-0 shadow-2xs">
                    {renderIcon(card.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#123F2A] leading-snug">
                      {card.title}
                    </h4>
                    <p className="text-xs text-[#37463D] mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Destination Badges & Primary CTA Banner */}
          <div className="mt-8 pt-6 border-t border-[#E5D8B5] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#123F2A]" />
                <span className="text-[11px] uppercase tracking-wider text-[#123F2A] font-bold">
                  International Export Destinations:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'India',
                  'Singapore',
                  'Malaysia',
                  'UAE / GCC',
                  'USA',
                  'United Kingdom',
                  'Mauritius',
                  'Fiji',
                  'Canada',
                  'Australia',
                  'Germany',
                ].map((country, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-[#E5D8B5] text-[#123F2A] text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                type="button"
                id="homepage-b2b-submit-enquiry-btn"
                onClick={handleNavigateToEnquiry}
                className="b2b-submit-btn w-full sm:w-auto bg-[#123F2A] hover:bg-[#0B2F20] text-white !text-white px-8 py-4 rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.18em] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#C9A84E] shrink-0" />
                <span className="text-white !text-white font-bold tracking-wider">Submit B2B Enquiry</span>
                <ArrowRight className="w-4 h-4 text-[#C9A84E] shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
