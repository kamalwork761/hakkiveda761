import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface AppHairAnalysisCardProps {
  onStartAnalysis: () => void;
}

export const AppHairAnalysisCard: React.FC<AppHairAnalysisCardProps> = ({
  onStartAnalysis,
}) => {
  return (
    <div className="w-full px-4 py-3">
      <div
        onClick={onStartAnalysis}
        className="rounded-3xl p-4 bg-gradient-to-br from-[#0E382C] via-[#134E3F] to-[#07241C] text-white shadow-md border border-[#C5A059]/40 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
      >
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#C5A059]/10 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-[#C5A059] text-[#0E382C] font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI Scalp Diagnosis</span>
            </span>
            <span className="text-[10px] text-emerald-200 font-semibold">
              Takes 60 Seconds • 100% Free
            </span>
          </div>

          <h3 className="font-serif text-base font-bold text-[#FDF8EC] leading-tight">
            Discover Your Root Cause & Custom Regimen
          </h3>

          <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed font-sans">
            Answer 4 quick scalp questions to get personalized Hakki-Pikki tribal remedies targeted directly to your follicular stage.
          </p>

          <div className="mt-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>35,000+ Scalps Diagnosed</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStartAnalysis();
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-[#d4af37] active:scale-95 transition-all"
            >
              <span>Start Free Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
