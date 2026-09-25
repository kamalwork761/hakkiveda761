import React from 'react';
import { Globe, Star, Quote } from 'lucide-react';

export const AppGlobalClientsCompact: React.FC = () => {
  const internationalHighlights = [
    { country: 'Mauritius', flag: '🇲🇺', name: 'Devika Ramgoolam', text: 'Thickened my crown within 45 days. Truly miraculous oil.' },
    { country: 'Singapore', flag: '🇸🇬', name: 'Marcus Tan', text: 'Stops humid scalp itch instantly and keeps follicles alive.' },
    { country: 'UAE', flag: '🇦🇪', name: 'Fatima Al-Zahra', text: 'Shields against harsh desalinated shower water hair loss.' },
    { country: 'Malaysia', flag: '🇲🇾', name: 'Priya Pillay', text: 'Authentic forest aroma, pure natural botanical revival.' },
  ];

  return (
    <div className="w-full px-4 py-3">
      <div className="rounded-3xl bg-white border border-emerald-950/10 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0E382C] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#0E382C]" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-slate-900 leading-tight">
                Global Tribal Community
              </h3>
              <p className="text-[10px] text-slate-500 font-sans">
                Trusted across 14+ countries worldwide
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Export Grade
          </span>
        </div>

        {/* Horizontal Testimonials */}
        <div
          className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {internationalHighlights.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-52 rounded-2xl bg-[#FAF7F2] p-3 border border-emerald-950/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{item.flag}</span>
                    <span className="text-xs font-bold text-slate-800">{item.country}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 italic leading-relaxed line-clamp-2">
                  "{item.text}"
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] font-medium text-slate-500 truncate">
                — {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
