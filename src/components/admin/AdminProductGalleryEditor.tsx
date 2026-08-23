import React, { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Plus,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  GripVertical,
  Eye,
  EyeOff,
  Maximize2,
  Info,
  Sparkles,
  X,
} from 'lucide-react';
import { uploadFileToServer } from '../../utils/upload';
import { ProductGalleryItem } from '../../types/store';

interface AdminProductGalleryEditorProps {
  images: string[];
  galleryItems?: ProductGalleryItem[];
  onChange: (images: string[], galleryItems: ProductGalleryItem[]) => void;
  onShowToast?: (msg: string) => void;
  maxImages?: number;
}

export const AdminProductGalleryEditor: React.FC<AdminProductGalleryEditorProps> = ({
  images,
  galleryItems,
  onChange,
  onShowToast,
  maxImages = 20,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // Sync internal items representation
  const items: ProductGalleryItem[] = React.useMemo(() => {
    if (galleryItems && galleryItems.length > 0) {
      return galleryItems;
    }
    const combined = images && images.length > 0 ? images : [];
    return combined.map((url, idx) => ({
      id: `img-${idx}-${Date.now()}`,
      url,
      altText: `Product image ${idx + 1}`,
      active: true,
      sortOrder: idx,
    }));
  }, [images, galleryItems]);

  const emitChanges = (nextItems: ProductGalleryItem[]) => {
    const urls = nextItems.map((item) => item.url);
    onChange(urls, nextItems);
  };

  // Handle multi-upload
  const processFiles = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      notify('Please select valid image files.');
      return;
    }

    const availableSlots = maxImages - items.length;
    if (availableSlots <= 0) {
      notify(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      notify(`Only the first ${availableSlots} images were uploaded (limit: ${maxImages}).`);
    }

    try {
      const uploadedUrls = await Promise.all(
        filesToUpload.map(async (file) => {
          try {
            return await uploadFileToServer(file);
          } catch (e) {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (ev) => resolve((ev.target?.result as string) || '');
              reader.readAsDataURL(file);
            });
          }
        })
      );

      const validUrls = uploadedUrls.filter(Boolean);
      const newItems: ProductGalleryItem[] = validUrls.map((url, i) => ({
        id: `img-${Date.now()}-${i}`,
        url,
        altText: `Product gallery view ${items.length + i + 1}`,
        active: true,
        sortOrder: items.length + i,
      }));

      const next = [...items, ...newItems];
      emitChanges(next);
      notify(`Added ${validUrls.length} image(s) to gallery!`);
    } catch (err: any) {
      notify(`Upload failed: ${err.message || 'Error processing files'}`);
    }
  };

  const handleDropzoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDropzoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleAddUrl = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (items.length >= maxImages) {
      notify(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    const newItem: ProductGalleryItem = {
      id: `img-${Date.now()}`,
      url: trimmed,
      altText: `Product image ${items.length + 1}`,
      active: true,
      sortOrder: items.length,
    };

    emitChanges([...items, newItem]);
    setUrlInput('');
    notify('Image URL added to gallery!');
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0 || index >= items.length) return;
    const next = [...items];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    emitChanges(next);
    notify('Set as Primary Featured Image!');
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const next = [...items];
    const temp = next[index];
    next[index] = next[newIndex];
    next[newIndex] = temp;
    emitChanges(next);
  };

  const handleDelete = (index: number) => {
    if (items.length <= 1) {
      notify('A product must have at least 1 image.');
      return;
    }
    const next = items.filter((_, i) => i !== index);
    emitChanges(next);
    notify('Image removed from gallery');
  };

  const handleToggleActive = (index: number) => {
    const next = items.map((item, i) => (i === index ? { ...item, active: !item.active } : item));
    emitChanges(next);
    notify(next[index].active ? 'Image enabled' : 'Image hidden from customer view');
  };

  const handleUpdateAltText = (index: number, alt: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, altText: alt } : item));
    emitChanges(next);
  };

  const handleReplaceFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFileToServer(file);
      const next = [...items];
      next[index] = { ...next[index], url };
      emitChanges(next);
      notify(`Replaced image #${index + 1}`);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const next = [...items];
          next[index] = { ...next[index], url: ev.target.result as string };
          emitChanges(next);
          notify(`Replaced image #${index + 1}`);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleThumbnailDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleThumbnailDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleThumbnailDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const next = [...items];
    const [draggedItem] = next.splice(draggedIndex, 1);
    next.splice(targetIndex, 0, draggedItem);

    setDraggedIndex(null);
    emitChanges(next);
    notify('Gallery order updated!');
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* Spec Guidance Callout Banner */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-200">
        <Info className="w-5 h-5 text-[var(--brand-gold,#D4AF37)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-100 flex items-center gap-2">
            <span>Recommended Image Specifications</span>
            <span className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[9px] font-bold px-1.5 py-0.5 rounded">
              WebP / JPG
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            • <strong>1200 × 1200px</strong> (1:1 square ratio) provides crisp desktop zoom and mobile responsiveness.<br />
            • First image serves as the <strong>Main Featured Image</strong> across store listings and hero display.<br />
            • Custom <strong>Alt Text</strong> improves Google SEO search rankings and accessibility.
          </p>
        </div>
      </div>

      {/* Multi-Select Drag & Drop Dropzone */}
      <div
        onDragOver={handleDropzoneDragOver}
        onDragLeave={handleDropzoneDragLeave}
        onDrop={handleDropzoneDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          isDraggingOver
            ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 scale-[1.01]'
            : 'border-white/20 bg-[var(--brand-primary-deep,#07150E)] hover:border-[var(--brand-gold)]/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-dark,#0B1D13)] border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)]">
            <Upload className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <p className="text-slate-100 font-bold text-sm">
              Drag & drop product images here, or{' '}
              <label className="text-[var(--brand-gold)] underline cursor-pointer hover:text-white font-bold">
                browse files
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports multiple image uploads simultaneously. Images are stored securely on the server.
            </p>
          </div>
        </div>
      </div>

      {/* Add via Image URL */}
      <div className="flex gap-2 bg-[var(--brand-primary-deep,#07150E)] p-2.5 rounded-xl border border-white/10">
        <div className="relative flex-1">
          <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl(e);
              }
            }}
            placeholder="Or paste direct image URL (https://...)"
            className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-1.5 rounded-lg font-bold text-xs uppercase hover:bg-white transition-all flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </div>

      {/* Gallery Cards List */}
      {items.length > 0 ? (
        <div className="space-y-3">
          <div className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Gallery & Hero Images ({items.length})</span>
            <span className="text-[10px] text-slate-400 lowercase font-normal">
              ★ Drag cards or use arrows to reorder • First image is Primary
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => {
              const isPrimary = idx === 0;

              return (
                <div
                  key={item.id || idx}
                  draggable
                  onDragStart={(e) => handleThumbnailDragStart(e, idx)}
                  onDragOver={(e) => handleThumbnailDragOver(e, idx)}
                  onDrop={(e) => handleThumbnailDrop(e, idx)}
                  className={`relative group bg-[var(--brand-primary-deep,#07150E)] border rounded-2xl p-3 flex flex-col justify-between transition-all ${
                    isPrimary
                      ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/30 bg-[var(--brand-primary-dark)]'
                      : item.active === false
                      ? 'opacity-60 border-dashed border-white/20'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                >
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between mb-2 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isPrimary
                            ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold'
                            : 'bg-black/50 text-slate-300'
                        }`}
                      >
                        {isPrimary ? (
                          <>
                            <Star className="w-3 h-3 fill-current" />
                            <span>Primary Hero</span>
                          </>
                        ) : (
                          <span>#{idx + 1} Gallery</span>
                        )}
                      </span>

                      {item.active === false && (
                        <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 py-0.5 rounded">
                          Disabled
                        </span>
                      )}
                    </div>

                    <span
                      className="text-slate-400 cursor-grab active:cursor-grabbing p-1 hover:text-white"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Image Viewport & Zoom Button */}
                  <div className="h-36 w-full bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center relative p-1 group/img">
                    <img
                      src={item.url}
                      alt={item.altText || `Product thumbnail ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform group-hover/img:scale-105"
                    />

                    {/* Overlay Zoom Action */}
                    <button
                      type="button"
                      onClick={() => setPreviewZoomUrl(item.url)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity gap-1 text-xs font-bold backdrop-blur-xs cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4 text-[var(--brand-gold)]" />
                      <span>Zoom</span>
                    </button>
                  </div>

                  {/* Alt Text Input for SEO */}
                  <div className="mt-2.5 space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">
                      Alt Text (SEO Description)
                    </label>
                    <input
                      type="text"
                      value={item.altText || ''}
                      onChange={(e) => handleUpdateAltText(idx, e.target.value)}
                      placeholder="e.g. Pure Hakki-Pikki Hair Oil Bottle"
                      className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                    />
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-white/10 text-[10px]">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleMakePrimary(idx)}
                        className="w-full bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 py-1 rounded-lg font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set as Main Hero</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      {/* Move Left */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'left')}
                        className="flex-1 bg-black/40 hover:bg-black/80 disabled:opacity-30 text-slate-300 p-1.5 rounded-lg border border-white/10 flex items-center justify-center"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Replace File */}
                      <label
                        className="flex-1 bg-black/40 hover:bg-black/80 text-slate-300 p-1.5 rounded-lg border border-white/10 flex items-center justify-center cursor-pointer"
                        title="Replace this image"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceFile(idx, e)}
                          className="hidden"
                        />
                      </label>

                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(idx)}
                        className={`flex-1 p-1.5 rounded-lg border flex items-center justify-center ${
                          item.active !== false
                            ? 'bg-black/40 border-white/10 text-emerald-400 hover:bg-black/80'
                            : 'bg-rose-950/40 border-rose-500/30 text-rose-400 hover:bg-rose-900/60'
                        }`}
                        title={item.active !== false ? 'Hide image from customers' : 'Show image to customers'}
                      >
                        {item.active !== false ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Move Right */}
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => handleMove(idx, 'right')}
                        className="flex-1 bg-black/40 hover:bg-black/80 disabled:opacity-30 text-slate-300 p-1.5 rounded-lg border border-white/10 flex items-center justify-center"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="flex-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 p-1.5 rounded-lg border border-rose-500/30 flex items-center justify-center"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-200 text-center font-semibold text-xs">
          ⚠️ Warning: No product images uploaded yet. Upload at least 1 image.
        </div>
      )}

      {/* Zoom Lightbox Modal */}
      {previewZoomUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-[var(--brand-gold)] rounded-2xl p-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewZoomUrl(null)}
              className="absolute top-3 right-3 text-slate-300 hover:text-white bg-black/60 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-[var(--brand-gold)] mb-3">High-Resolution Image Preview</h4>
            <div className="max-h-[75vh] overflow-hidden rounded-xl bg-black/40 p-2 flex items-center justify-center">
              <img
                src={previewZoomUrl}
                alt="Zoom preview"
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
