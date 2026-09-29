import React from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  Sparkles,
} from 'lucide-react';
import { MobileAppSectionConfig } from '../../../types/mobileApp';

interface AppSectionsManagerProps {
  sections: MobileAppSectionConfig[];
  onSave: (updated: MobileAppSectionConfig[]) => void;
  isSaving: boolean;
  onOpenLivePreview?: () => void;
}

export const AppSectionsManager: React.FC<AppSectionsManagerProps> = ({
  sections,
  onSave,
  isSaving,
  onOpenLivePreview,
}) => {
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((s, idx) => {
      s.displayOrder = idx + 1;
    });
    onSave(updated);
  };

  const handleToggle = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    onSave(updated);
  };

  const getSectionDescription = (id: string) => {
    switch (id) {
      case 'hero':
        return 'Full-width 2:1 hero banner slides carousel with CTAs';
      case 'categories':
        return 'Horizontal quick category pills with custom icons';
      case 'shop_by_concern':
        return 'Targeted remedy cards (Hair Fall, Baldness, Dandruff, etc.)';
      case 'best_sellers':
        return 'Horizontal best sellers product carousel with live badges';
      case 'promo_banner':
        return 'Promotional 3:1 coupon banners and special kit offers';
      case 'flagship_product':
        return 'Highlighted 108 Sacred Forest Herbs Flagship formulation box';
      case 'recommended':
        return 'Curated recommended products carousel for holistic growth';
      case 'hair_analysis':
        return 'Interactive AI hair root diagnostic questionnaire teaser card';
      case 'brand_story':
        return 'Hakki-Pikki tribal elders heritage & Pakshirajapura forest story';
      case 'global_clients':
        return 'Compact worldwide verification strip with client countries';
      default:
        return 'Mobile home screen section';
    }
  };

  return (
    <div className="space-y-6 mobile-app-admin text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <span>Android Home Screen Sections Ordering</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Arrange the exact vertical order of sections displayed on the mobile app home screen.
          </p>
        </div>

        {onOpenLivePreview && (
          <button
            type="button"
            onClick={onOpenLivePreview}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Eye className="w-4 h-4 text-[#C5A059]" />
            <span>Open Phone Preview</span>
          </button>
        )}
      </div>

      {/* Sections List */}
      <div className="space-y-2.5">
        {sections.map((section, index) => {
          return (
            <div
              key={section.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                section.enabled
                  ? 'bg-black/40 border-white/10 hover:border-[#C5A059]/40'
                  : 'bg-black/20 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-[#C5A059]/15 text-[#C5A059] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xs font-bold text-white truncate">
                      {section.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({section.id})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">
                    {getSectionDescription(section.id)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white disabled:opacity-20"
                  title="Move section up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white disabled:opacity-20"
                  title="Move section down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(section.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ml-1 ${
                    section.enabled
                      ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {section.enabled ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
