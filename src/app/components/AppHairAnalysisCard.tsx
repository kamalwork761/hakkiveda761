import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ScanFace } from 'lucide-react';

interface AppHairAnalysisCardProps {
  imageUrl?: string;
  onStartAnalysis: () => void;
}

export const AppHairAnalysisCard: React.FC<AppHairAnalysisCardProps> = ({
  imageUrl,
  onStartAnalysis,
}) => {
  if (imageUrl) {
    return (
      <div className="w-full px-4 py-3">
        <button
          type="button"
          onClick={onStartAnalysis}
          className="block w-full overflow-hidden rounded-3xl active:scale-[0.99] transition-transform"
        >
          <img
            src={imageUrl}
            alt="Free AI Hair Analysis"
            className="block w-full h-auto"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-3">
      <div
        onClick={onStartAnalysis}
        className="relative overflow-hidden rounded-3xl border border-[#D6B86C]/40 bg-gradient-to-br from-[#0B2E25] via-[#12614B] to-[#0A3A2D] p-4 shadow-xl cursor-pointer active:scale-[0.99] transition-all"
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#E0BD65]/15 blur-xl" />
        <div className="absolute right-4 top-12 opacity-10">
          <ScanFace className="w-28 h-28 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5D77F] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#0E382C]">
              <Sparkles className="w-3 h-3" />
              Free AI Hair Check
            </span>

            <span className="text-[9px] font-bold text-emerald-100">
              60 Seconds
            </span>
          </div>

          <h3 className="mt-2 font-serif text-xl font-bold leading-tight text-white">
            Discover Your Hair & Scalp Needs
          </h3>

          <p className="mt-1.5 max-w-[88%] text-[11px] leading-relaxed text-emerald-100/85">
            Answer a few quick questions and get a personalized HAKKIVEDA product recommendation.
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-100">
              <ShieldCheck className="w-4 h-4 text-[#F5D77F]" />
              Free • Quick • Personalized
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStartAnalysis();
              }}
              className="flex items-center gap-1.5 rounded-full bg-[#F5D77F] px-4 py-2 text-[11px] font-black text-[#0E382C] shadow-lg active:scale-95"
            >
              Start Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
