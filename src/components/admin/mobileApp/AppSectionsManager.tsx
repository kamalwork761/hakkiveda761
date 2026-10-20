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
    sectionId: 'hair_analysis' | 'brand_story' | 'promo_banner' | 'global_clients',
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

      {/* Dedicated Global Community artwork manager */}
      {sections.some((section) => section.id === 'global_clients') && (
        <div className="rounded-2xl border border-[#C5A059]/40 bg-gradient-to-br from-[#082E26] to-[#0C4939] p-4 sm:p-5 space-y-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#F5DC93]">Global Tribal Community Banner</h3>
            <p className="mt-1 text-xs leading-relaxed text-emerald-100/85">
              Upload the banner you designed in Canva. It will replace the default three-card design in the Android app. Recommended: 1080 × 660 px, JPG, PNG or WebP.
            </p>
          </div>
          {sections.find((section) => section.id === 'global_clients')?.imageUrl ? (
            <img
              src={sections.find((section) => section.id === 'global_clients')!.imageUrl}
              alt="Current Global Tribal Community banner"
              className="w-full max-w-lg rounded-xl border border-[#C5A059]/30 object-contain"
            />
          ) : (
            <p className="rounded-xl border border-dashed border-[#C5A059]/40 px-4 py-6 text-center text-xs text-emerald-100/70">
              No custom banner uploaded yet. The app currently shows its default card.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#D8B45C] px-4 py-2.5 text-sm font-bold text-[#073B2F] hover:bg-[#F0D487]">
              <Upload className="h-4 w-4" />
              {uploadingSectionId === 'global_clients'
                ? 'Uploading banner...'
                : sections.find((section) => section.id === 'global_clients')?.imageUrl
                  ? 'Replace Global Banner'
                  : 'Upload Global Banner'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingSectionId !== null || isSaving}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleSectionBannerUpload('global_clients', file);
                  event.currentTarget.value = '';
                }}
              />
            </label>
            {sections.find((section) => section.id === 'global_clients')?.imageUrl && (
              <button
                type="button"
                disabled={isSaving || uploadingSectionId !== null}
                onClick={() => onSave(sections.map((section) => section.id === 'global_clients' ? { ...section, imageUrl: '' } : section))}
                className="rounded-xl border border-red-400/40 px-4 py-2.5 text-xs font-bold text-red-200 hover:bg-red-950/40"
              >
                Remove Banner
              </button>
            )}
          </div>
          <p className="text-[11px] text-emerald-100/65">
            The entire banner remains tappable and opens the existing Global Community page. Your original section order and other settings stay unchanged.
          </p>
        </div>
      )}

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
                {(section.id === 'hair_analysis' || section.id === 'brand_story' || section.id === 'promo_banner' || section.id === 'global_clients') && (
                  <div className="flex items-center gap-2">
                    {section.imageUrl && (
                      <img
                        src={section.imageUrl}
                        alt={`${section.name} banner`}
                        className="w-14 h-8 rounded-lg object-cover border border-white/20"
                      />
                    )}

                    <label
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C5A059]/15 text-[#E8D279] hover:bg-[#C5A059]/25 cursor-pointer flex items-center gap-1"
                      title={`Upload ${section.name} banner`}
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
                              section.id as 'hair_analysis' | 'brand_story' | 'promo_banner' | 'global_clients',
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
