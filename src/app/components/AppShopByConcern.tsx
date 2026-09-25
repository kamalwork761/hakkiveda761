import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle, Droplets, Zap } from 'lucide-react';

interface AppShopByConcernProps {
  onSelectConcern: (concern: string) => void;
}

const CONCERNS = [
  {
    id: 'hair-fall',
    title: 'Hair Fall Control',
    subtitle: 'Reduces shedding in 14 days',
    badge: '14-Day Result',
    icon: ShieldCheck,
    color: 'from-emerald-900 to-[#0E382C]',
  },
  {
    id: 'hair-growth',
    title: 'Hair Regrowth',
    subtitle: 'Crown & hairline activation',
    badge: '108 Herbs',
    icon: Sparkles,
    color: 'from-[#0E382C] to-emerald-950',
  },
  {
    id: 'baldness',
    title: 'Baldness & Thinning',
    subtitle: 'Dormant follicle revival',
    badge: 'Clinical Grade',
    icon: Zap,
    color: 'from-amber-950 to-[#0E382C]',
  },
  {
    id: 'dandruff',
    title: 'Dandruff & Itch',
    subtitle: 'Scalp detox & antifungal',
    badge: 'Deep Purify',
    icon: AlertCircle,
    color: 'from-teal-950 to-[#0E382C]',
  },
  {
    id: 'scalp-care',
    title: 'Scalp Hydration',
    subtitle: 'Lipid barrier & root strength',
    badge: 'Cold Pressed',
    icon: Droplets,
    color: 'from-slate-900 to-[#0E382C]',
  },
];

export const AppShopByConcern: React.FC<AppShopByConcernProps> = ({
  onSelectConcern,
}) => {
  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between px-4 mb-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950/70 font-sans">
            Shop by Concern
          </h2>
          <p className="text-[11px] text-slate-500 font-sans">
            Targeted tribal formulations for specific hair needs
          </p>
        </div>
      </div>

      <div
        className="flex items-stretch gap-3 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CONCERNS.map((c) => {
          const IconComponent = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectConcern(c.id)}
              className="flex-shrink-0 w-44 rounded-2xl p-3 bg-white border border-emerald-950/10 shadow-sm hover:shadow-md active:scale-98 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0E382C]/10 text-[#0E382C] flex items-center justify-center group-hover:bg-[#0E382C] group-hover:text-[#C5A059] transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded-full border border-[#C5A059]/20">
                    {c.badge}
                  </span>
                </div>
                <h3 className="font-serif text-sm font-bold text-slate-900 leading-tight">
                  {c.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {c.subtitle}
                </p>
              </div>

              <div className="mt-3 flex items-center text-[11px] font-semibold text-[#0E382C] group-hover:text-[#C5A059] transition-colors">
                <span>Explore Remedies</span>
                <span className="ml-1 text-xs">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
