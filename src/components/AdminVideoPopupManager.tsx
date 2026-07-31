import React, { useState } from 'react';
import {
  Video,
  Upload,
  Save,
  Eye,
  Calendar,
  Clock,
  Smartphone,
  Monitor,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { uploadFileToServer } from '../utils/upload';
import { VideoPopupFrequency, VideoPopupConfig } from '../types/store';
import { VideoPopupModal } from './VideoPopupModal';

interface AdminVideoPopupManagerProps {
  showToast?: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminVideoPopupManager: React.FC<AdminVideoPopupManagerProps> = ({ showToast }) => {
  const { videoPopupConfig, updateVideoPopupConfig, products } = useStore();

  const [formConfig, setFormConfig] = useState<VideoPopupConfig>({
    ...videoPopupConfig,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    try {
      const url = await uploadFileToServer(file);
      setFormConfig((prev) => ({ ...prev, videoUrl: url }));
      if (showToast) showToast('Video uploaded successfully!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to upload video file.', 'error');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPoster(true);
    try {
      const url = await uploadFileToServer(file);
      setFormConfig((prev) => ({ ...prev, posterUrl: url }));
      if (showToast) showToast('Poster image uploaded successfully!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to upload poster image.', 'error');
    } finally {
      setIsUploadingPoster(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateVideoPopupConfig(formConfig);
      if (showToast) showToast('Video popup settings saved & synced to database!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to save popup settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[var(--brand-primary-dark,#123F2B)] to-[#1b5038] text-white p-6 rounded-2xl shadow-lg border border-[var(--brand-gold,#D4AF37)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-gold,#D4AF37)] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Promotional Video Modal</span>
          </div>
          <h2 className="text-2xl font-serif font-bold">Auto-Play Video Popup Manager</h2>
          <p className="text-sm text-slate-200 mt-1">
            Configure time-delayed, frequency-capped video announcements to engage visitors when they land on HAKKIVEDA.
          </p>
        </div>

        <button
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-gold,#D4AF37)] text-[var(--brand-primary-dark,#123F2B)] font-bold text-sm shadow-md hover:bg-amber-300 transition-all cursor-pointer shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Live Test Preview</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Status & Frequency Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold text-[var(--brand-primary-dark,#123F2B)] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--brand-gold,#D4AF37)]" />
            <span>Activation & Frequency Rules</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Toggle Switch */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-800 block">Enable Video Popup</label>
                <span className="text-xs text-slate-500">Show video popup to visitors</span>
              </div>
              <input
                type="checkbox"
                checked={formConfig.enabled}
                onChange={(e) => setFormConfig({ ...formConfig, enabled: e.target.checked })}
                className="w-6 h-6 accent-[var(--brand-primary-dark,#123F2B)] rounded cursor-pointer"
              />
            </div>

            {/* Display Frequency */}
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">
                Display Frequency
              </label>
              <select
                value={formConfig.frequency}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    frequency: e.target.value as VideoPopupFrequency,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-sm text-slate-800 focus:ring-2 focus:ring-[var(--brand-gold,#D4AF37)] focus:outline-none"
              >
                <option value="ONCE_PER_SESSION">Once Per Session</option>
                <option value="EVERY_3_DAYS">Once Every 3 Days</option>
                <option value="EVERY_7_DAYS">Once Every 7 Days</option>
                <option value="ALWAYS">Always Show (On Every Load)</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>

            {/* Trigger Delay (Seconds) */}
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">
                Pop-up Trigger Delay (Seconds)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={formConfig.delaySeconds}
                onChange={(e) =>
                  setFormConfig({
                    ...formConfig,
                    delaySeconds: parseFloat(e.target.value) || 2.5,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-sm text-slate-800 focus:ring-2 focus:ring-[var(--brand-gold,#D4AF37)] focus:outline-none"
              />
            </div>
          </div>

          {/* Devices & Target Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Device Controls */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 block">Device Visibility</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={formConfig.enableDesktop}
                    onChange={(e) =>
                      setFormConfig({ ...formConfig, enableDesktop: e.target.checked })
                    }
                    className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                  />
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <span>Desktop Devices</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={formConfig.enableMobile}
                    onChange={(e) =>
                      setFormConfig({ ...formConfig, enableMobile: e.target.checked })
                    }
                    className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                  />
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span>Mobile Devices</span>
                </label>
              </div>
            </div>

            {/* Date Range Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Campaign Start Date
                </label>
                <input
                  type="date"
                  value={formConfig.startDate || ''}
                  onChange={(e) => setFormConfig({ ...formConfig, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Campaign End Date
                </label>
                <input
                  type="date"
                  value={formConfig.endDate || ''}
                  onChange={(e) => setFormConfig({ ...formConfig, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Video Source & Media Assets */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold text-[var(--brand-primary-dark,#123F2B)] flex items-center gap-2">
            <Video className="w-5 h-5 text-[var(--brand-gold,#D4AF37)]" />
            <span>Video & Thumbnail Assets</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                Video File / MP4 / WEBM URL
              </label>
              <input
                type="text"
                value={formConfig.videoUrl}
                onChange={(e) => setFormConfig({ ...formConfig, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:ring-2 focus:ring-[var(--brand-gold,#D4AF37)]"
              />
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer border border-slate-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingVideo ? 'Uploading MP4...' : 'Upload Video File'}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={isUploadingVideo}
                  />
                </label>
              </div>
            </div>

            {/* Poster Thumbnail Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Poster Thumbnail Image</label>
              <input
                type="text"
                value={formConfig.posterUrl}
                onChange={(e) => setFormConfig({ ...formConfig, posterUrl: e.target.value })}
                placeholder="/images/hakkiveda_108_oil_gold.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:ring-2 focus:ring-[var(--brand-gold,#D4AF37)]"
              />
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer border border-slate-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingPoster ? 'Uploading Poster...' : 'Upload Poster Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                    disabled={isUploadingPoster}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Call-to-Action Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold text-[var(--brand-primary-dark,#123F2B)] flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[var(--brand-gold,#D4AF37)]" />
            <span>Popup Text & Call-to-Action</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Popup Heading</label>
              <input
                type="text"
                value={formConfig.heading}
                onChange={(e) => setFormConfig({ ...formConfig, heading: e.target.value })}
                placeholder="Special Herbal Offer!"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">
                CTA Button Label
              </label>
              <input
                type="text"
                value={formConfig.ctaText}
                onChange={(e) => setFormConfig({ ...formConfig, ctaText: e.target.value })}
                placeholder="Shop Hair Oil - 20% Off"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">
              Short Description / Offer Text
            </label>
            <textarea
              rows={3}
              value={formConfig.description}
              onChange={(e) => setFormConfig({ ...formConfig, description: e.target.value })}
              placeholder="Experience 100% Authentic Adivasi 108 Mountain Herbs Oil..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">CTA Destination</label>
              <select
                value={formConfig.ctaDestination}
                onChange={(e) =>
                  setFormConfig({ ...formConfig, ctaDestination: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
              >
                <option value="#products">#products (Products Catalog)</option>
                <option value="#ai-quiz">#ai-quiz (Open AI Hair Quiz)</option>
                <option value="#categories">#categories (Browse Collections)</option>
                <option value="#b2b-export">#b2b-export (B2B Bulk Export)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">
                Attach Featured Product (Optional)
              </label>
              <select
                value={formConfig.linkedProductId || ''}
                onChange={(e) =>
                  setFormConfig({ ...formConfig, linkedProductId: e.target.value || undefined })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
              >
                <option value="">-- No Product Attached --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand-primary-dark,#123F2B)] text-white font-bold shadow-lg hover:bg-[#1a553a] transition-all cursor-pointer border border-[var(--brand-gold,#D4AF37)]"
          >
            <Save className="w-5 h-5 text-[var(--brand-gold,#D4AF37)]" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Video Popup Settings'}</span>
          </button>
        </div>
      </form>

      {/* Test Preview Modal */}
      {isPreviewOpen && (
        <VideoPopupModal
          forceShow={true}
          onClosePreview={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};
