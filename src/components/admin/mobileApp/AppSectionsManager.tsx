import React, { useState } from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  Upload,
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
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);

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

  const handleSectionBannerUpload = async (
    sectionId: 'hair_analysis' | 'brand_story' | 'promo_banner',
    file: File
  ) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Please upload JPG, PNG or WebP image.');
      return;
    }

    setUploadingSectionId(sectionId);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/mobile-app?folder=banners', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Banner upload failed');
      }

      const updated = sections.map((section) =>
        section.id === sectionId
          ? { ...section, imageUrl: data.url }
          : section
      );

      onSave(updated);
    } catch (err: any) {
      alert(err.message || 'Banner upload failed.');
    } finally {
      setUploadingSectionId(null);
    }
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
                {(section.id === 'hair_analysis' || section.id === 'brand_story' || section.id === 'promo_banner') && (
                  <div className="flex items-center gap-2">
                    {section.imageUrl && (
                      <img
                        src={section.imageUrl}
                        alt="Hair Analysis banner"
                        className="w-14 h-8 rounded-lg object-cover border border-white/20"
                      />
                    )}

                    <label
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C5A059]/15 text-[#E8D279] hover:bg-[#C5A059]/25 cursor-pointer flex items-center gap-1"
                      title="Upload Hair Analysis banner"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {uploadingSectionId === section.id
                          ? 'Uploading...'
                          : section.imageUrl
                            ? 'Replace Banner'
                            : 'Upload Banner'}
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        disabled={uploadingSectionId === section.id}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            handleSectionBannerUpload(
                              section.id as 'hair_analysis' | 'brand_story',
                              file
                            );
                          e.currentTarget.value = '';
                        }}
                      />
                    </label>

                    {section.imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = sections.map((item) =>
                            item.id === section.id
                              ? { ...item, imageUrl: '' }
                              : item
                          );
                          onSave(updated);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/40 bg-red-950/30 text-red-300 hover:bg-red-950/50"
                      >
                        Remove Banner
                      </button>
                    )}
                  </div>
                )}

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
