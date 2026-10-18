import React from 'react';
import {
  ArrowLeft,
  Globe2,
  MapPin,
  Handshake,
  PackageCheck,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const AppGlobalCommunityScreen: React.FC<Props> = ({ onBack }) => {
  const markets = [
    'Nepal',
    'Sri Lanka',
    'Mauritius',
    'UAE',
    'Zambia',
    'Zimbabwe',
    'Tanzania',
    'Kenya',
    'Egypt',
    'Malaysia',
    'Cameroon',
    'Senegal',
    'Libya',
    'Australia',
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
              Worldwide Network
            </p>
            <h1 className="font-serif text-lg font-bold text-white">
              Global Tribal Community
            </h1>
          </div>
        </div>
      </div>

      <section className="px-4 pt-5">
        <div className="rounded-3xl bg-gradient-to-br from-[#0E382C] to-[#174D3D] p-5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#D6B65D]/15 border border-[#D6B65D]/30 flex items-center justify-center">
            <Globe2 className="w-6 h-6 text-[#E5C86F]" />
          </div>

          <h2 className="font-serif text-xl font-bold text-[#FFF8E7] mt-3">
            From Mysuru to Global Markets
          </h2>

          <p className="text-[11px] leading-relaxed text-emerald-100/80 mt-2">
            HAKKIVEDA works with customers, wholesalers and business partners across
            multiple international markets while preserving its herbal heritage from Karnataka.
          </p>
        </div>
      </section>

      <section className="px-4 py-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <p className="text-2xl font-black text-[#123F34] mt-2">14+</p>
            <p className="text-[10px] text-slate-500">International markets reached</p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <Handshake className="w-5 h-5 text-blue-600" />
            <p className="text-[13px] font-black text-[#123F34] mt-2">B2B Partners</p>
            <p className="text-[10px] text-slate-500">Wholesale & distributor opportunities</p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <PackageCheck className="w-5 h-5 text-orange-600" />
            <p className="text-[13px] font-black text-[#123F34] mt-2">Export Support</p>
            <p className="text-[10px] text-slate-500">Documentation for eligible export orders</p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-violet-600" />
            <p className="text-[13px] font-black text-[#123F34] mt-2">Brand Authenticity</p>
            <p className="text-[10px] text-slate-500">Direct HAKKIVEDA supply channels</p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-5">
        <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#B58B35]" />
            <h3 className="font-serif text-base font-bold text-[#123F34]">
              Markets We Serve
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {markets.map((market) => (
              <span
                key={market}
                className="rounded-full bg-[#F4EFE3] border border-[#D6B65D]/25 px-3 py-1.5 text-[10px] font-bold text-[#123F34]"
              >
                {market}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="rounded-3xl bg-[#FFF8E7] border border-[#D6B65D]/40 p-4">
          <p className="text-[9px] uppercase tracking-[0.16em] font-black text-[#A37E35]">
            Partner With HAKKIVEDA
          </p>

          <h3 className="font-serif text-lg font-bold text-[#123F34] mt-1">
            Grow with our international network
          </h3>

          <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
            Opportunities are available for wholesalers, distributors, retailers,
            importers and private-label partners in selected markets.
          </p>
        </div>
      </section>
    </div>
  );
};
