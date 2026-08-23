import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface ProductFullscreenViewerProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  productName: string;
  onClose: () => void;
}

export const ProductFullscreenViewer: React.FC<ProductFullscreenViewerProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  productName,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(3, prev + 0.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(1, prev - 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div
      id="product-fullscreen-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar Controls */}
      <div
        className="flex items-center justify-between z-20 pb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white">
          <h4 className="text-xs sm:text-sm font-serif-luxury font-bold text-slate-200 line-clamp-1 max-w-xs sm:max-w-md">
            {productName}
          </h4>
          <span className="text-[11px] text-[var(--brand-gold)] font-mono">
            Image {currentIndex + 1} of {images.length}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/10">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-[var(--brand-gold)] px-2 font-bold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-30 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                title="Reset zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-rose-500/80 text-white rounded-xl border border-white/20 transition-colors cursor-pointer"
            aria-label="Close fullscreen gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden my-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-30 p-3 rounded-full bg-black/60 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] border border-white/20 transition-all shadow-xl cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Current Image */}
        <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
          <img
            src={images[currentIndex]}
            alt={`${productName} fullscreen view ${currentIndex + 1}`}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.2s ease-out',
              maxHeight: '80vh',
              maxWidth: '85vw',
            }}
            className="object-contain select-none cursor-grab active:cursor-grabbing rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-30 p-3 rounded-full bg-black/60 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] border border-white/20 transition-all shadow-xl cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 z-20 scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setZoomLevel(1);
                setCurrentIndex(idx);
              }}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-black/40 p-1 flex items-center justify-center cursor-pointer ${
                currentIndex === idx
                  ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/40 scale-105 shadow-lg'
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
