import React, { useState, useRef } from 'react';
import { Upload, Trash2, Star, ArrowLeft, ArrowRight, RefreshCw, Plus, Image as ImageIcon, CheckCircle, AlertCircle, Link as LinkIcon, GripVertical } from 'lucide-react';

interface AdminProductImageManagerProps {
  images: string[]; // Array of image URLs/dataURIs. Index 0 is Primary.
  onChange: (images: string[]) => void;
  onShowToast?: (msg: string) => void;
  maxImages?: number;
}

export const AdminProductImageManager: React.FC<AdminProductImageManagerProps> = ({
  images,
  onChange,
  onShowToast,
  maxImages = 20,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const replaceInputRef = useRef<{ index: number; input: HTMLInputElement | null } | null>(null);

  // Helper to trigger toast
  const notify = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

  // Ensure we always have an array
  const currentImages = images && images.length > 0 ? images : [];

  // Helper to handle multiple file upload preserving exact original pixels
  const processFiles = (filesList: FileList | File[]) => {
    const files = Array.from(filesList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      notify('Please select valid image files.');
      return;
    }

    const availableSlots = maxImages - currentImages.length;
    if (availableSlots <= 0) {
      notify(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      notify(`Only the first ${availableSlots} images were uploaded to respect the ${maxImages} image limit.`);
    }

    let loadedCount = 0;
    const newImageUrls: string[] = [];

    filesToUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImageUrls.push(e.target.result as string);
        }
        loadedCount++;
        if (loadedCount === filesToUpload.length) {
          const updated = [...currentImages, ...newImageUrls];
          onChange(updated);
          notify(`Added ${newImageUrls.length} image(s) successfully!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Drag & Drop Dropzone
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

  // Handle File Input Selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  // Add Image via URL
  const handleAddUrl = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (currentImages.length >= maxImages) {
      notify(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    onChange([...currentImages, trimmed]);
    setUrlInput('');
    notify('Image URL added!');
  };

  // Set image at index as Primary (Index 0)
  const handleMakePrimary = (index: number) => {
    if (index === 0 || index >= currentImages.length) return;
    const updated = [...currentImages];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
    notify('Set as Primary featured product image!');
  };

  // Move Image Left / Right
  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentImages.length) return;

    const updated = [...currentImages];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    onChange(updated);
  };

  // Delete Individual Image
  const handleDelete = (index: number) => {
    if (currentImages.length <= 1) {
      notify('A product must have at least 1 image.');
      return;
    }
    const updated = currentImages.filter((_, i) => i !== index);
    onChange(updated);
    notify('Image deleted');
  };

  // Replace Individual Image
  const handleReplaceFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const updated = [...currentImages];
        updated[index] = ev.target.result as string;
        onChange(updated);
        notify(`Replaced image #${index + 1}`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Thumbnail Drag & Drop Reordering
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

    const updated = [...currentImages];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setDraggedIndex(null);
    onChange(updated);
    notify('Image order updated!');
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <label className="block text-slate-200 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Product Gallery Images</span>
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Upload between 1 and {maxImages} images. Drag & drop to reorder. The 1st image is the Primary image.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/30 px-3 py-1.5 rounded-full font-mono">
          <span className="text-[11px] text-[var(--brand-gold)] font-bold">
            {currentImages.length} / {maxImages} Images
          </span>
          {currentImages.length >= 1 ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          )}
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
            : 'border-white/20 bg-[var(--brand-primary-deep)] hover:border-[var(--brand-gold)]/60'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)]">
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
              Supports multi-select. Exact original pixels preserved (No compression or recoloring).
            </p>
          </div>
        </div>
      </div>

      {/* Add via Image URL */}
      <div className="flex gap-2 bg-[var(--brand-primary-deep)] p-2 rounded-xl border border-white/10">
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
            className="w-full bg-[var(--brand-primary-dark)] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
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

      {/* Images Thumbnails Grid & Management Bar */}
      {currentImages.length > 0 ? (
        <div className="space-y-3">
          <div className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Uploaded Images ({currentImages.length})</span>
            <span className="text-[10px] text-slate-400 lowercase font-normal">
              ★ First image is Primary (Featured)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {currentImages.map((imgUrl, idx) => {
              const isPrimary = idx === 0;

              return (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleThumbnailDragStart(e, idx)}
                  onDragOver={(e) => handleThumbnailDragOver(e, idx)}
                  onDrop={(e) => handleThumbnailDrop(e, idx)}
                  className={`relative group bg-[var(--brand-primary-deep)] border rounded-xl p-2 flex flex-col justify-between transition-all ${
                    isPrimary
                      ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/40 bg-[var(--brand-primary-dark)]'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                >
                  {/* Position Badge & Drag Handle */}
                  <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold">
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
                          <span>Primary</span>
                        </>
                      ) : (
                        <span>#{idx + 1}</span>
                      )}
                    </span>

                    <span className="text-slate-400 cursor-grab active:cursor-grabbing p-0.5 hover:text-white" title="Drag to reorder">
                      <GripVertical className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Thumbnail Image Container */}
                  <div className="h-28 w-full bg-black/40 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative p-1">
                    <img
                      src={imgUrl}
                      alt={`Product thumbnail ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-2 space-y-1.5 pt-1.5 border-t border-white/10 text-[10px]">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleMakePrimary(idx)}
                        className="w-full bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 py-1 rounded font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>Make Primary</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      {/* Move Left */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'left')}
                        className="flex-1 bg-black/40 hover:bg-black/80 disabled:opacity-30 text-slate-300 p-1 rounded border border-white/10 flex items-center justify-center"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>

                      {/* Replace File */}
                      <label className="flex-1 bg-black/40 hover:bg-black/80 text-slate-300 p-1 rounded border border-white/10 flex items-center justify-center cursor-pointer" title="Replace this image">
                        <RefreshCw className="w-3 h-3 text-[var(--brand-gold)]" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceFile(idx, e)}
                          className="hidden"
                        />
                      </label>

                      {/* Move Right */}
                      <button
                        type="button"
                        disabled={idx === currentImages.length - 1}
                        onClick={() => handleMove(idx, 'right')}
                        className="flex-1 bg-black/40 hover:bg-black/80 disabled:opacity-30 text-slate-300 p-1 rounded border border-white/10 flex items-center justify-center"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="flex-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 p-1 rounded border border-rose-500/30 flex items-center justify-center"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3 h-3" />
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
    </div>
  );
};
