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
        className="w-full text-left overflow-hidden rounded-[28px] bg-gradient-to-br from-[#073B2F] via-[#0B5A45] to-[#0A7A5A] border border-[#E2C35F]/45 shadow-[0_12px_34px_rgba(7,59,47,0.26)] active:scale-[0.99] transition-all"
      >
        <div className="relative p-5">
          <div className="absolute -top-12 -right-8 w-36 h-36 rounded-full bg-[#F2D56D]/14 blur-[1px]" />
          <div className="absolute -bottom-14 -left-8 w-32 h-32 rounded-full bg-cyan-300/10 blur-xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#F5DA7A]/22 to-white/10 border border-[#F5DA7A]/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Globe2 className="w-7 h-7 text-[#F3D66F]" />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] font-black text-[#E6C86B]">
                    From Mysuru to the World
                  </p>

                  <h3 className="font-serif text-[22px] font-black leading-tight mt-1" style={{ color: "#FFF8E8", WebkitTextFillColor: "#FFF8E8" }}>
                    Global Tribal Community
                  </h3>

                  <p className="text-[11px] text-emerald-50/85 mt-1.5 leading-relaxed">
                    International customers, wholesalers, distributors and business partners.
                  </p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-[#E6C86B] shrink-0 mt-1" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="rounded-2xl bg-gradient-to-b from-white/15 to-white/8 border border-white/15 px-2 py-3 text-center shadow-inner">
                <MapPin className="w-4 h-4 text-[#E6C86B] mx-auto" />
                <p className="text-[15px] font-black text-white mt-1">14+</p>
                <p className="text-[8px] text-emerald-100/65">Markets</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-b from-white/15 to-white/8 border border-white/15 px-2 py-3 text-center shadow-inner">
                <Handshake className="w-4 h-4 text-[#E6C86B] mx-auto" />
                <p className="text-[13px] font-black text-white mt-1">B2B</p>
                <p className="text-[8px] text-emerald-100/65">Partners</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-b from-white/15 to-white/8 border border-white/15 px-2 py-3 text-center shadow-inner">
                <PackageCheck className="w-4 h-4 text-[#E6C86B] mx-auto" />
                <p className="text-[13px] font-black text-white mt-1">Export</p>
                <p className="text-[8px] text-emerald-100/65">Support</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#F0CD68]/20 to-white/10 border border-[#F0CD68]/35 px-3.5 py-3">
              <span className="text-[10px] font-black text-[#FFF1BA]">
                Explore countries, export reach & partner opportunities
              </span>

              <span className="text-[10px] font-black text-[#F3D66F] whitespace-nowrap ml-2">
                Explore →
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
