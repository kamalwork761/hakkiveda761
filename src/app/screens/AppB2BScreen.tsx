import React from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Boxes,
  Factory,
  Handshake,
  Globe2,
  Download,
  MessageCircle,
  PackageCheck,
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const AppB2BScreen: React.FC<Props> = ({ onBack }) => {
  const services = [
    {
      icon: Boxes,
      title: 'Bulk Orders',
      text: 'Volume pricing for retailers, resellers and institutional buyers.',
      badge: 'MOQ Applies',
      style: 'from-emerald-500 to-emerald-700',
    },
    {
      icon: Handshake,
      title: 'Wholesale & Distribution',
      text: 'Join HAKKIVEDA as a wholesale or distribution partner in your market.',
      badge: 'Partner Program',
      style: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Factory,
      title: 'Third-Party Manufacturing',
      text: 'Discuss eligible herbal and cosmetic manufacturing requirements for your brand.',
      badge: 'Custom MOQ',
      style: 'from-violet-500 to-purple-700',
    },
    {
      icon: PackageCheck,
      title: 'Private / White Label',
      text: 'Selected products can be supplied for private-label opportunities subject to MOQ.',
      badge: 'Brand Ready',
      style: 'from-amber-500 to-orange-600',
    },
    {
      icon: Globe2,
      title: 'International Export',
      text: 'Support for eligible export orders, documentation and distributor supply.',
      badge: 'Export',
      style: 'from-cyan-500 to-teal-700',
    },
  ];

  return (
    <div className="min-h-full bg-[#FAF7F2] pb-24">
      <div className="sticky top-0 z-20 bg-[#0B3D30] px-4 py-3 border-b border-[#D6B65D]/25">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D6B65D]">
              Business With HAKKIVEDA
            </p>
            <h1 className="font-serif text-lg font-bold text-white">
              B2B & Private Label
            </h1>
          </div>
        </div>
      </div>

      <section className="px-4 pt-5">
        <div className="rounded-3xl bg-gradient-to-br from-[#0E382C] to-[#174D3D] p-5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#D6B65D]/15 border border-[#D6B65D]/30 flex items-center justify-center">
            <BriefcaseBusiness className="w-6 h-6 text-[#E5C86F]" />
          </div>

          <h2 className="font-serif text-xl font-bold text-[#FFF8E7] mt-3">
            Build Your Herbal Business With Us
          </h2>

          <p className="text-[11px] leading-relaxed text-emerald-100/80 mt-2">
            HAKKIVEDA supports wholesalers, distributors, retailers, importers and
            private-label partners looking for herbal products from Mysuru, Karnataka.
          </p>
        </div>
      </section>

      <section className="px-4 py-5 space-y-3">
        {services.map(({ icon: Icon, title, text, badge, style }) => (
          <div
            key={title}
            className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex gap-3">
              <div
                className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${style} flex items-center justify-center shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[13px] font-black text-[#123F34]">
                    {title}
                  </h3>

                  <span className="rounded-full bg-[#FFF5D8] px-2 py-1 text-[8px] font-black text-[#A37E35]">
                    {badge}
                  </span>
                </div>

                <p className="text-[10px] leading-relaxed text-slate-500 mt-1">
                  {text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="px-4 pb-5">
        <div className="rounded-3xl bg-[#FFF8E7] border border-[#D6B65D]/40 p-4">
          <p className="text-[9px] uppercase tracking-[0.16em] font-black text-[#A37E35]">
            MOQ & Pricing
          </p>

          <h3 className="font-serif text-lg font-bold text-[#123F34] mt-1">
            Flexible business enquiries
          </h3>

          <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
            Minimum order quantity depends on the product, packaging, branding,
            destination and manufacturing requirement. Contact our B2B team for a
            quotation based on your requirement.
          </p>
        </div>
      </section>

      <section className="px-4 pb-5">
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://wa.me/917619536831?text=Hello%20HAKKIVEDA%2C%20I%20am%20interested%20in%20B2B%20or%20distribution."
            className="rounded-2xl bg-[#0E382C] p-4 text-center shadow-md active:scale-95"
          >
            <MessageCircle className="w-6 h-6 text-[#E5C86F] mx-auto" />
            <p className="text-[11px] font-black text-white mt-2">
              Request B2B Quote
            </p>
          </a>

          <a
            href="https://hakkiveda.com/downloads/hakkiveda-catalogue.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-white border border-[#D6B65D]/50 p-4 text-center shadow-sm active:scale-95"
          >
            <Download className="w-6 h-6 text-[#A37E35] mx-auto" />
            <p className="text-[11px] font-black text-[#123F34] mt-2">
              Download Catalogue
            </p>
            <p className="text-[8px] text-slate-500 mt-0.5">
              View 14-page product catalogue
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};
