import React from 'react';
import {
  ArrowRight,
  Globe2,
  Handshake,
  MapPin,
  PackageCheck,
} from 'lucide-react';

interface Props {
  onOpen?: () => void;
}

export const AppGlobalClientsCompact: React.FC<Props> = ({ onOpen }) => {
  return (
    <div className="w-full px-4 py-4">
      <button
        type="button"
        onClick={onOpen}
        className="w-full text-left overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B382C] via-[#10503D] to-[#17634C] border border-[#D6B65D]/35 shadow-lg active:scale-[0.99] transition-all"
      >
        <div className="relative p-4">
          <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-[#D6B65D]/10" />
          <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E6C86B]/15 border border-[#E6C86B]/30 flex items-center justify-center shrink-0">
                  <Globe2 className="w-6 h-6 text-[#E6C86B]" />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] font-black text-[#E6C86B]">
                    From Mysuru to the World
                  </p>

                  <h3 className="font-serif text-lg font-bold leading-tight mt-0.5" style={{ color: "#FFF8E8", WebkitTextFillColor: "#FFF8E8" }}>
                    Global Tribal Community
                  </h3>

                  <p className="text-[10px] text-emerald-100/75 mt-1 leading-relaxed">
                    International customers, wholesalers, distributors and business partners.
                  </p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-[#E6C86B] shrink-0 mt-1" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="rounded-2xl bg-white/10 border border-white/10 px-2 py-2.5 text-center">
                <MapPin className="w-4 h-4 text-[#E6C86B] mx-auto" />
                <p className="text-[13px] font-black text-white mt-1">14+</p>
                <p className="text-[8px] text-emerald-100/65">Markets</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 px-2 py-2.5 text-center">
                <Handshake className="w-4 h-4 text-[#E6C86B] mx-auto" />
                <p className="text-[10px] font-black text-white mt-1">B2B</p>
                <p className="text-[8px] text-emerald-100/65">Partners</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 px-2 py-2.5 text-center">
                <PackageCheck className="w-4 h-4 text-[#E6C86B] mx-auto" />
                <p className="text-[10px] font-black text-white mt-1">Export</p>
                <p className="text-[8px] text-emerald-100/65">Support</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#FFF7DB]/10 border border-[#E6C86B]/20 px-3 py-2">
              <span className="text-[9px] font-bold text-[#F7E8B5]">
                Explore countries, export reach & partner opportunities
              </span>

              <span className="text-[9px] font-black text-[#E6C86B] whitespace-nowrap ml-2">
                Explore →
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
