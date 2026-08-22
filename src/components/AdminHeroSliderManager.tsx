import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  Upload,
  CheckCircle2,
  XCircle,
  Play,
  Monitor,
  Tablet,
  Smartphone,
  Calendar,
  Layers,
  Settings,
  BarChart3,
  Link,
  HelpCircle,
  Video,
  Image as ImageIcon,
  MousePointer,
  RotateCcw,
  Sliders,
  Check,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HeroSlide, HeroSliderSettings } from '../types/store';

const normalizeMediaUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('uploads/')) {
    return '/' + trimmed;
  }
  return trimmed;
};

interface AdminHeroSliderManagerProps {
  showToast: (message: string) => void;
}

export const AdminHeroSliderManager: React.FC<AdminHeroSliderManagerProps> = ({ showToast }) => {
  const store = useStore();
  const heroSlides = Array.isArray(store?.heroSlides) ? store.heroSlides : [];
  const heroSliderSettings = store?.heroSliderSettings || {
    autoPlay: true,
    autoPlayDelay: 6,
    transitionSpeed: 700,
    pauseOnHover: true,
    infiniteLoop: true,
    swipeSupport: true,
  };
  const updateHeroSliderSettings = store?.updateHeroSliderSettings || (() => {});
  const addHeroSlide = store?.addHeroSlide || (async () => {});
  const updateHeroSlide = store?.updateHeroSlide || (async () => {});
  const deleteHeroSlide = store?.deleteHeroSlide || (async () => {});
  const reorderHeroSlides = store?.reorderHeroSlides || (async () => {});
  const duplicateHeroSlide = store?.duplicateHeroSlide || (async () => {});
  const saveHeroSlides = store?.saveHeroSlides || (async () => false);
  const products = Array.isArray(store?.products) ? store.products : [];
  const categories = Array.isArray(store?.categories) ? store.categories : [];
  const blogs = Array.isArray(store?.blogs) ? store.blogs : [];
  const setIsQuizOpen = store?.setIsQuizOpen || (() => {});
  const setIsB2BModalOpen = store?.setIsB2BModalOpen || (() => {});

  const [activeTab, setActiveTab] = useState<'banners' | 'global_settings' | 'analytics'>('banners');

  // Form State for Create / Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  // Slide Form Fields
  const [tag, setTag] = useState('AUTHENTIC HAKKI-PIKKI SECRET');
  const [smallHeading, setSmallHeading] = useState('100% ORGANIC TRIBAL BOTANICALS');
  const [title, setTitle] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [subtitle, setSubtitle] = useState('');
  
  // Media State
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [image, setImage] = useState('/images/hero_tribal_elders.jpg');
  const [imageFilename, setImageFilename] = useState('hero_tribal_elders.jpg');
  const [mobileImage, setMobileImage] = useState('');
  const [mobileImageFilename, setMobileImageFilename] = useState('');
  const [backgroundVideo, setBackgroundVideo] = useState('');
  const [backgroundVideoFilename, setBackgroundVideoFilename] = useState('');

  // Media File & Object URL States for instant preview & memory leak prevention
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string | null>(null);

  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // 3D Layered Foreground Subject & Overflow State
  const [enable3dOverflow, setEnable3dOverflow] = useState(false);
  const [foregroundCutoutUrl, setForegroundCutoutUrl] = useState('');
  const [foregroundCutoutFilename, setForegroundCutoutFilename] = useState('');
  const [cutoutFile, setCutoutFile] = useState<File | null>(null);
  const [cutoutPreviewUrl, setCutoutPreviewUrl] = useState<string | null>(null);
  const [desktopPosX, setDesktopPosX] = useState(70);
  const [desktopPosY, setDesktopPosY] = useState(0);
  const [desktopWidth, setDesktopWidth] = useState(440);
  const [desktopBottomOverflow, setDesktopBottomOverflow] = useState(130);
  const [mobilePosX, setMobilePosX] = useState(60);
  const [mobilePosY, setMobilePosY] = useState(0);
  const [mobileWidth, setMobileWidth] = useState(260);
  const [mobileBottomOverflow, setMobileBottomOverflow] = useState(65);
  const [disableMobileOverflow, setDisableMobileOverflow] = useState(false);

  // Upload Progress & File Error States
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileError, setFileError] = useState<string | null>(null);

  // Primary CTA
  const [ctaText, setCtaText] = useState('Shop Tribal Elixir');
  const [ctaLink, setCtaLink] = useState('#products');
  const [ctaType, setCtaType] = useState<NonNullable<HeroSlide['ctaType']>>('COLLECTION');

  // Secondary CTA
  const [secondaryCtaText, setSecondaryCtaText] = useState('Start AI Scalp Quiz');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState('#ai-quiz');
  const [secondaryCtaType, setSecondaryCtaType] = useState<NonNullable<HeroSlide['secondaryCtaType']>>('QUIZ');

  // Controls & Scheduling
  const [active, setActive] = useState(true);
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'SCHEDULED'>('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Display Settings
  const [textPosition, setTextPosition] = useState<'LEFT' | 'CENTER' | 'RIGHT'>('LEFT');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [overlayColor, setOverlayColor] = useState('var(--brand-primary-dark)');
  const [overlayOpacity, setOverlayOpacity] = useState(80);
  const [textColor, setTextColor] = useState('white');

  // Animation
  const [animation, setAnimation] = useState<NonNullable<HeroSlide['animation']>>('kenburns');

  // SEO
  const [altText, setAltText] = useState('Adivasi HakkiVeda Herbal Oil Banner');
  const [imageTitle, setImageTitle] = useState('HakkiVeda Tribal Hair Care Banner');

  // Validation Error State
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modals & Preview
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Sort slides by sortOrder
  const sortedSlides = [...heroSlides].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Memory Leak Prevention: Cleanup Object URLs on unmount
  React.useEffect(() => {
    return () => {
      if (desktopPreviewUrl) URL.revokeObjectURL(desktopPreviewUrl);
      if (mobilePreviewUrl) URL.revokeObjectURL(mobilePreviewUrl);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      if (cutoutPreviewUrl) URL.revokeObjectURL(cutoutPreviewUrl);
    };
  }, [desktopPreviewUrl, mobilePreviewUrl, videoPreviewUrl, cutoutPreviewUrl]);

  // Cleanup helper
  const cleanupObjectUrls = () => {
    if (desktopPreviewUrl) {
      URL.revokeObjectURL(desktopPreviewUrl);
      setDesktopPreviewUrl(null);
    }
    if (mobilePreviewUrl) {
      URL.revokeObjectURL(mobilePreviewUrl);
      setMobilePreviewUrl(null);
    }
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    if (cutoutPreviewUrl) {
      URL.revokeObjectURL(cutoutPreviewUrl);
      setCutoutPreviewUrl(null);
    }
    setDesktopFile(null);
    setMobileFile(null);
    setVideoFile(null);
    setCutoutFile(null);
  };

  // Reset Form
  const resetForm = () => {
    cleanupObjectUrls();
    setIsEditing(false);
    setEditingSlideId(null);
    setTag('AUTHENTIC HAKKI-PIKKI SECRET');
    setSmallHeading('100% ORGANIC TRIBAL BOTANICALS');
    setTitle('');
    setHighlightText('');
    setSubtitle('');
    setMediaType('IMAGE');
    setImage('/images/hero_tribal_elders.jpg');
    setImageFilename('hero_tribal_elders.jpg');
    setMobileImage('');
    setMobileImageFilename('');
    setBackgroundVideo('');
    setBackgroundVideoFilename('');
    setEnable3dOverflow(false);
    setForegroundCutoutUrl('');
    setForegroundCutoutFilename('');
    setDesktopPosX(70);
    setDesktopPosY(0);
    setDesktopWidth(440);
    setDesktopBottomOverflow(130);
    setMobilePosX(60);
    setMobilePosY(0);
    setMobileWidth(260);
    setMobileBottomOverflow(65);
    setDisableMobileOverflow(false);
    setCtaText('Shop Tribal Elixir');
    setCtaLink('#products');
    setCtaType('COLLECTION');
    setSecondaryCtaText('Start AI Scalp Quiz');
    setSecondaryCtaLink('#ai-quiz');
    setSecondaryCtaType('QUIZ');
    setActive(true);
    setStatus('ACTIVE');
    setStartDate('');
    setEndDate('');
    setTextPosition('LEFT');
    setTextAlignment('left');
    setOverlayColor('var(--brand-primary-dark)');
    setOverlayOpacity(80);
    setTextColor('white');
    setAnimation('kenburns');
    setAltText('Adivasi HakkiVeda Herbal Oil Banner');
    setImageTitle('HakkiVeda Tribal Hair Care Banner');
    setValidationError(null);
    setFileError(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  // Open Edit Mode
  const handleEditInit = (slide: HeroSlide) => {
    cleanupObjectUrls();
    setIsEditing(true);
    setEditingSlideId(slide.id);
    setTag(slide.tag || '');
    setSmallHeading(slide.smallHeading || '');
    setTitle(slide.title || '');
    setHighlightText(slide.highlightText || '');
    setSubtitle(slide.subtitle || '');
    setMediaType(slide.mediaType || 'IMAGE');
    setImage(slide.image || '');
    setImageFilename(slide.imageFilename || '');
    setMobileImage(slide.mobileImage || '');
    setMobileImageFilename(slide.mobileImageFilename || '');
    setBackgroundVideo(slide.backgroundVideo || '');
    setBackgroundVideoFilename(slide.backgroundVideoFilename || '');
    setEnable3dOverflow(Boolean(slide.enable3dOverflow));
    setForegroundCutoutUrl(slide.foregroundCutoutUrl || '');
    setForegroundCutoutFilename(slide.foregroundCutoutFilename || '');
    setDesktopPosX(slide.desktopPosX ?? 70);
    setDesktopPosY(slide.desktopPosY ?? 0);
    setDesktopWidth(slide.desktopWidth ?? 440);
    setDesktopBottomOverflow(slide.desktopBottomOverflow ?? 130);
    setMobilePosX(slide.mobilePosX ?? 60);
    setMobilePosY(slide.mobilePosY ?? 0);
    setMobileWidth(slide.mobileWidth ?? 260);
    setMobileBottomOverflow(slide.mobileBottomOverflow ?? 65);
    setDisableMobileOverflow(Boolean(slide.disableMobileOverflow));
    setCtaText(slide.ctaText || '');
    setCtaLink(slide.ctaLink || '');
    setCtaType(slide.ctaType || 'COLLECTION');
    setSecondaryCtaText(slide.secondaryCtaText || '');
    setSecondaryCtaLink(slide.secondaryCtaLink || '');
    setSecondaryCtaType(slide.secondaryCtaType || 'QUIZ');
    setActive(slide.active ?? true);
    setStatus(slide.status || 'ACTIVE');
    setStartDate(slide.startDate || '');
    setEndDate(slide.endDate || '');
    setTextPosition(slide.textPosition || 'LEFT');
    setTextAlignment(slide.textAlignment || 'left');
    setOverlayColor(slide.overlayColor || 'var(--brand-primary-dark)');
    setOverlayOpacity(slide.overlayOpacity ?? 80);
    setTextColor(slide.textColor || 'white');
    setAnimation(slide.animation || 'kenburns');
    setAltText(slide.altText || '');
    setImageTitle(slide.imageTitle || '');
    setValidationError(null);
    setFileError(null);

    // Scroll to form
    const el = document.getElementById('hero-banner-editor-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Instant File Selection Handler with format & size validation
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetType: 'DESKTOP' | 'MOBILE' | 'VIDEO' | 'CUTOUT'
  ) => {
    setFileError(null);
    setValidationError(null);

    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`[HeroSliderManager] File selected for ${targetType}:`, file.name, file.type, file.size);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (targetType === 'VIDEO') {
      const validVideoExts = ['mp4', 'webm', 'ogg', 'mov'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validVideoTypes.includes(file.type) && !validVideoExts.includes(ext)) {
        setFileError('Unsupported video format. Please upload MP4, WEBM, OGG, or MOV.');
        e.target.value = '';
        return;
      }
    } else {
      const validImageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!validImageTypes.includes(file.type) && !validImageExts.includes(ext)) {
        setFileError('Unsupported format. Please upload PNG, WebP, SVG, JPG, or GIF.');
        e.target.value = '';
        return;
      }
    }

    // 100MB file size limit for hero images and videos
    const maxSizeBytes = 100 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 100MB.`);
      e.target.value = '';
      return;
    }

    // Create temporary object URL for instant preview & revoke old one
    const objectUrl = URL.createObjectURL(file);
    console.log(`[HeroSliderManager] Object URL generated for ${targetType}:`, objectUrl);

    if (targetType === 'DESKTOP') {
      if (desktopPreviewUrl) URL.revokeObjectURL(desktopPreviewUrl);
      setDesktopFile(file);
      setDesktopPreviewUrl(objectUrl);
      setImageFilename(file.name);
    } else if (targetType === 'MOBILE') {
      if (mobilePreviewUrl) URL.revokeObjectURL(mobilePreviewUrl);
      setMobileFile(file);
      setMobilePreviewUrl(objectUrl);
      setMobileImageFilename(file.name);
    } else if (targetType === 'VIDEO') {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoFile(file);
      setVideoPreviewUrl(objectUrl);
      setBackgroundVideoFilename(file.name);
    } else if (targetType === 'CUTOUT') {
      if (cutoutPreviewUrl) URL.revokeObjectURL(cutoutPreviewUrl);
      setCutoutFile(file);
      setCutoutPreviewUrl(objectUrl);
      setForegroundCutoutFilename(file.name);
    }

    // Reset input value so selecting the same file triggers onChange
    e.target.value = '';
  };

  // Helper to upload media file to server endpoint, falling back to data URL if server unreachable
  const uploadMediaFile = async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          if (onProgress) onProgress(100);
          return data.url;
        }
      }
    } catch (e) {
      console.warn('[HeroSliderManager] Server upload endpoint unreachable, using local encoding fallback:', e);
    }
    return await readFileAsDataUrl(file, onProgress);
  };

  // Helper to read file bytes with smart canvas compression for images
  const readFileAsDataUrl = (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const isCompressibleImage = file.type.startsWith('image/') && file.size > 500 * 1024;
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      reader.onload = () => {
        const rawResult = reader.result;
        if (typeof rawResult !== 'string') {
          reject(new Error('Failed to process selected file.'));
          return;
        }

        if (!isCompressibleImage) {
          resolve(rawResult);
          return;
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDimension = 1920;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawResult);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        };

        img.onerror = () => {
          resolve(rawResult);
        };

        img.src = rawResult;
      };

      reader.onerror = () => {
        reject(reader.error || new Error('Error reading selected file.'));
      };

      reader.readAsDataURL(file);
    });
  };

  // Validate Form
  const validateForm = (): boolean => {
    setValidationError(null);

    if (mediaType === 'IMAGE') {
      const hasDesktopImage = desktopFile !== null || (image && image.trim().length > 0);
      if (!hasDesktopImage) {
        setValidationError('Desktop Hero Image is required. Please upload an image file or provide an image URL.');
        return false;
      }
    }

    if (mediaType === 'VIDEO') {
      const hasVideo = videoFile !== null || (backgroundVideo && backgroundVideo.trim().length > 0);
      if (!hasVideo) {
        setValidationError('Background Video is required when Video mode is selected.');
        return false;
      }
    }

    if (!title.trim()) {
      setValidationError('Main Heading (Title) cannot be empty.');
      return false;
    }

    if (ctaText.trim() && !ctaLink.trim()) {
      setValidationError('Primary Button Link is required when button text is provided.');
      return false;
    }

    if (secondaryCtaText.trim() && !secondaryCtaLink.trim()) {
      setValidationError('Secondary Button Link is required when secondary button text is provided.');
      return false;
    }

    return true;
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Publish button clicked');
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(10);
    setFileError(null);

    try {
      let finalImageUrl = image;
      let finalMobileUrl = mobileImage;
      let finalVideoUrl = backgroundVideo;

      // 1. Process Desktop Image
      if (desktopFile) {
        console.log('[HeroSliderManager] Processing desktop file:', desktopFile.name);
        setUploadProgress(25);
        finalImageUrl = await uploadMediaFile(desktopFile, (p) => {
          setUploadProgress(25 + Math.round(p * 0.35));
        });
      }

      // 2. Process Mobile Image
      if (mobileFile) {
        console.log('[HeroSliderManager] Processing mobile file:', mobileFile.name);
        setUploadProgress(60);
        finalMobileUrl = await uploadMediaFile(mobileFile, (p) => {
          setUploadProgress(60 + Math.round(p * 0.25));
        });
      }

      // 3. Process Video File
      if (mediaType === 'VIDEO' && videoFile) {
        console.log('[HeroSliderManager] Processing video file:', videoFile.name);
        setUploadProgress(70);
        finalVideoUrl = await uploadMediaFile(videoFile, (p) => {
          setUploadProgress(70 + Math.round(p * 0.25));
        });
      }

      // 4. Process 3D Foreground Cutout File
      let finalCutoutUrl = foregroundCutoutUrl;
      if (cutoutFile) {
        console.log('[HeroSliderManager] Processing cutout file:', cutoutFile.name);
        setUploadProgress(80);
        finalCutoutUrl = await uploadMediaFile(cutoutFile, (p) => {
          setUploadProgress(80 + Math.round(p * 0.15));
        });
      }

      // Ensure proper media URL mapping based on mediaType
      if (mediaType === 'IMAGE') {
        finalVideoUrl = ''; // Clear video if slide is configured as IMAGE
      } else if (mediaType === 'VIDEO') {
        finalVideoUrl = finalVideoUrl || finalImageUrl;
        if (!finalImageUrl || finalImageUrl === '/images/hero_tribal_elders.jpg') {
          finalImageUrl = finalVideoUrl;
        }
      }

      setUploadProgress(95);

      const slideData: Omit<HeroSlide, 'id'> = {
        tag,
        smallHeading,
        title,
        highlightText,
        subtitle,
        image: finalImageUrl,
        imageFilename: desktopFile ? desktopFile.name : imageFilename,
        mobileImage: finalMobileUrl,
        mobileImageFilename: mobileFile ? mobileFile.name : mobileImageFilename,
        backgroundVideo: finalVideoUrl,
        backgroundVideoFilename: videoFile ? videoFile.name : backgroundVideoFilename,
        mediaType,
        ctaText,
        ctaLink,
        ctaType,
        secondaryCtaText,
        secondaryCtaLink,
        secondaryCtaType,
        active: status === 'DRAFT' ? false : active,
        status,
        startDate,
        endDate,
        textPosition,
        textAlignment,
        overlayColor,
        overlayOpacity,
        textColor,
        animation,
        altText,
        imageTitle,
        enable3dOverflow,
        foregroundCutoutUrl: finalCutoutUrl,
        foregroundCutoutFilename: cutoutFile ? cutoutFile.name : foregroundCutoutFilename,
        desktopPosX,
        desktopPosY,
        desktopWidth,
        desktopBottomOverflow,
        mobilePosX,
        mobilePosY,
        mobileWidth,
        mobileBottomOverflow,
        disableMobileOverflow,
      };

      if (isEditing && editingSlideId) {
        await updateHeroSlide(editingSlideId, slideData);
        showToast('Hero banner slide updated successfully!');
      } else {
        await addHeroSlide(slideData);
        showToast('New hero banner slide created!');
      }

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        resetForm();
      }, 200);
    } catch (err: any) {
      console.error('[HeroSliderManager] Upload / Save error:', err);
      setFileError(err?.message || 'Upload failed. Please try selecting the file again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Reorder Handler
  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const nextList = [...sortedSlides];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextList.length) return;

    const temp = nextList[index];
    nextList[index] = nextList[targetIndex];
    nextList[targetIndex] = temp;

    reorderHeroSlides(nextList);
    showToast('Banner slides order saved');
  };

  // Link Preset Selector Helper
  const applyLinkPreset = (
    type: 'PRODUCT' | 'CATEGORY' | 'COLLECTION' | 'QUIZ' | 'JOURNAL' | 'EXTERNAL' | 'B2B' | 'CONTACT',
    value: string,
    target: 'PRIMARY' | 'SECONDARY'
  ) => {
    let finalLink = value;
    if (type === 'PRODUCT') finalLink = `#product-${value}`;
    if (type === 'CATEGORY') finalLink = `#category-${value}`;
    if (type === 'COLLECTION') finalLink = `#${value}`;
    if (type === 'QUIZ') finalLink = '#ai-quiz';
    if (type === 'JOURNAL') finalLink = `#blog-${value}`;
    if (type === 'B2B') finalLink = '#b2b';
    if (type === 'CONTACT') finalLink = '#footer';

    if (target === 'PRIMARY') {
      setCtaType(type);
      setCtaLink(finalLink);
    } else {
      setSecondaryCtaType(type);
      setSecondaryCtaLink(finalLink);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--brand-primary-dark)] border border-white/10 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-[var(--brand-gold)]">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Adivasi Master Banner System</span>
          </div>
          <h1 className="text-2xl font-bold font-serif-luxury text-slate-100 mt-1">Hero Slider Manager</h1>
          <p className="text-xs text-slate-300">
            Create, schedule, reorder, and analyze high-converting homepage hero banners.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-[var(--brand-primary-deep)] p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'banners' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Banners ({heroSlides.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('global_settings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'global_settings' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Slider Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>CTR Analytics</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BANNERS & EDITOR */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Editor Form */}
          <form
            id="hero-banner-editor-form"
            onSubmit={handleSubmit}
            className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/30 p-5 rounded-2xl space-y-5 text-xs text-slate-200 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] flex items-center justify-center font-bold">
                  {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-[var(--brand-gold)] text-sm uppercase">
                  {isEditing ? 'Edit Hero Banner Slide' : 'Create New Hero Banner Slide'}
                </h3>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 bg-[var(--brand-primary-deep)] px-3 py-1 rounded-lg border border-white/10"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>

            {validationError && (
              <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {fileError && (
              <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-3 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{fileError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFileError(null)}
                  className="text-rose-300 hover:text-white text-xs font-bold p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Form Grid Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Content & Copy */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1. Banner Typography & Content</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge / Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. AUTHENTIC HAKKI-PIKKI SECRET"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Small Heading / Eyebrow</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% ORGANIC TRIBAL BOTANICALS"
                      value={smallHeading}
                      onChange={(e) => setSmallHeading(e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Main Heading (Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ancient Rituals"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Highlight Gold Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Modern Care"
                      value={highlightText}
                      onChange={(e) => setHighlightText(e.target.value)}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-[var(--brand-gold)] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Description / Subtitle</label>
                  <textarea
                    rows={2}
                    placeholder="Harness the power of 42 rare mountain herbs, formulated by the Hakki-Pikki tribe..."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                  />
                </div>

                {/* Primary CTA */}
                <div className="border-t border-white/10 pt-3 space-y-3">
                  <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5" />
                    <span>Primary CTA Button</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Button Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Shop Tribal Elixir"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Link Destination / Type</label>
                      <div className="flex gap-2">
                        <select
                          value={ctaType}
                          onChange={(e) => setCtaType(e.target.value as any)}
                          className="bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100 w-1/3"
                        >
                          <option value="COLLECTION">Collection</option>
                          <option value="PRODUCT">Product</option>
                          <option value="CATEGORY">Category</option>
                          <option value="QUIZ">AI Quiz</option>
                          <option value="JOURNAL">Journal</option>
                          <option value="B2B">B2B</option>
                          <option value="CONTACT">Contact</option>
                          <option value="EXTERNAL">Custom URL</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Link e.g. #products"
                          value={ctaLink}
                          onChange={(e) => setCtaLink(e.target.value)}
                          className="w-2/3 bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset Quick Selectors */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                    <span className="text-slate-400">Quick link:</span>
                    {(products || []).slice(0, 3).map((p) => {
                      const productTitle = p?.title || p?.name || 'Product';
                      return (
                        <button
                          key={p?.id || productTitle}
                          type="button"
                          onClick={() => applyLinkPreset('PRODUCT', p?.id || '', 'PRIMARY')}
                          className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)]/20 text-slate-300 border border-white/10 px-2 py-0.5 rounded"
                        >
                          {productTitle.slice(0, 15)}{productTitle.length > 15 ? '...' : ''}
                        </button>
                      );
                    })}
                    {(categories || []).slice(0, 2).map((c) => (
                      <button
                        key={c?.id || c?.name}
                        type="button"
                        onClick={() => applyLinkPreset('CATEGORY', c?.name || '', 'PRIMARY')}
                        className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)]/20 text-slate-300 border border-white/10 px-2 py-0.5 rounded"
                      >
                        {c?.name || 'Category'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="border-t border-white/10 pt-3 space-y-3">
                  <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5" />
                    <span>Secondary CTA Button (Optional)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Button Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Start AI Scalp Quiz"
                        value={secondaryCtaText}
                        onChange={(e) => setSecondaryCtaText(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Link Destination</label>
                      <input
                        type="text"
                        placeholder="e.g. #ai-quiz"
                        value={secondaryCtaLink}
                        onChange={(e) => setSecondaryCtaLink(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-lg text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Media, Display, SEO & Scheduling */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>2. Media Upload & Responsive Media</span>
                </h4>

                {/* Media Type Toggle */}
                <div className="flex items-center gap-2 bg-[var(--brand-primary-deep)] p-1 rounded-lg border border-white/10 w-fit">
                  <button
                    type="button"
                    onClick={() => setMediaType('IMAGE')}
                    className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                      mediaType === 'IMAGE' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image Media</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('VIDEO')}
                    className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                      mediaType === 'VIDEO' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Background</span>
                  </button>
                </div>

                {/* Desktop Image */}
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Desktop Hero Image *</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-white transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleFileSelect(e, 'DESKTOP')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or Image URL"
                      value={image}
                      onChange={(e) => {
                        if (desktopPreviewUrl) {
                          URL.revokeObjectURL(desktopPreviewUrl);
                          setDesktopPreviewUrl(null);
                        }
                        setDesktopFile(null);
                        setImage(e.target.value);
                      }}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-lg text-slate-100 text-xs"
                    />
                  </div>
                  {desktopFile ? (
                    <span className="text-[10px] text-amber-300 mt-1 block font-semibold">
                      Selected file: {desktopFile.name} ({(desktopFile.size / 1024).toFixed(0)} KB)
                    </span>
                  ) : imageFilename ? (
                    <span className="text-[10px] text-emerald-400 mt-1 block">Saved file: {imageFilename}</span>
                  ) : null}
                </div>

                {/* Mobile Image */}
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Hero Image (Optional)</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-[var(--brand-primary-deep)] border border-white/20 text-slate-200 px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 hover:border-[var(--brand-gold)]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Mobile</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleFileSelect(e, 'MOBILE')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or Mobile Image URL"
                      value={mobileImage}
                      onChange={(e) => {
                        if (mobilePreviewUrl) {
                          URL.revokeObjectURL(mobilePreviewUrl);
                          setMobilePreviewUrl(null);
                        }
                        setMobileFile(null);
                        setMobileImage(e.target.value);
                      }}
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-lg text-slate-100 text-xs"
                    />
                  </div>
                  {mobileFile ? (
                    <span className="text-[10px] text-amber-300 mt-1 block font-semibold">
                      Selected mobile file: {mobileFile.name} ({(mobileFile.size / 1024).toFixed(0)} KB)
                    </span>
                  ) : mobileImageFilename ? (
                    <span className="text-[10px] text-emerald-400 mt-1 block">Saved file: {mobileImageFilename}</span>
                  ) : null}
                </div>

                {/* Video Background */}
                {mediaType === 'VIDEO' && (
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Background Video (MP4 / WebM)</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-[var(--brand-primary-deep)] border border-white/20 text-slate-200 px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 hover:border-[var(--brand-gold)]">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Video</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={(e) => handleFileSelect(e, 'VIDEO')}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Video URL e.g. https://.../video.mp4"
                        value={backgroundVideo}
                        onChange={(e) => {
                          if (videoPreviewUrl) {
                            URL.revokeObjectURL(videoPreviewUrl);
                            setVideoPreviewUrl(null);
                          }
                          setVideoFile(null);
                          setBackgroundVideo(e.target.value);
                        }}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-lg text-slate-100 text-xs"
                      />
                    </div>
                    {videoFile ? (
                      <span className="text-[10px] text-amber-300 mt-1 block font-semibold">
                        Selected video file: {videoFile.name}
                      </span>
                    ) : backgroundVideoFilename ? (
                      <span className="text-[10px] text-emerald-400 mt-1 block">Saved file: {backgroundVideoFilename}</span>
                    ) : null}
                  </div>
                )}

                {/* Media Preview Box */}
                <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">Media Preview</span>
                    {(desktopFile || mobileFile || videoFile) && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold animate-pulse">
                        New File Selected (Unsaved Preview)
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    {mediaType === 'VIDEO' && (videoPreviewUrl || backgroundVideo) ? (
                      <video
                        key={videoPreviewUrl || backgroundVideo}
                        src={videoPreviewUrl || backgroundVideo}
                        className="w-28 h-16 object-cover rounded-lg border border-white/10 shadow-md"
                        autoPlay
                        muted
                        loop
                      />
                    ) : (desktopPreviewUrl || image) ? (
                      <img
                        key={desktopPreviewUrl || image}
                        src={desktopPreviewUrl || image}
                        alt="Desktop Preview"
                        className="w-28 h-16 object-cover rounded-lg border border-white/10 shadow-md"
                      />
                    ) : (
                      <div className="w-28 h-16 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 text-xs">
                        No Media
                      </div>
                    )}

                    <div className="flex-1 text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <span>Desktop:</span>
                        <span className="text-[var(--brand-gold)] truncate max-w-[180px]">
                          {desktopFile ? desktopFile.name : imageFilename || (image ? 'URL Specified' : 'None')}
                        </span>
                      </div>

                      {(mobilePreviewUrl || mobileImage) && (
                        <div className="flex items-center gap-1.5 text-slate-300 text-[10px]">
                          <Smartphone className="w-3 h-3 text-[var(--brand-gold)]" />
                          <span>Mobile:</span>
                          <span className="text-slate-200 truncate max-w-[180px]">
                            {mobileFile ? mobileFile.name : mobileImageFilename || 'Custom Mobile Image'}
                          </span>
                        </div>
                      )}

                      {isUploading && (
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] text-amber-300 font-bold">
                            <span>Uploading original file...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-[var(--brand-gold)] to-amber-300 transition-all duration-200"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display & Layout Settings */}
                <div className="border-t border-white/10 pt-3 space-y-3">
                  <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>3. Layout, Overlay & Animation</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Text Position</label>
                      <select
                        value={textPosition}
                        onChange={(e) => setTextPosition(e.target.value as any)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-lg text-slate-100"
                      >
                        <option value="LEFT">Left Aligned</option>
                        <option value="CENTER">Center Screen</option>
                        <option value="RIGHT">Right Aligned</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Overlay Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={overlayColor}
                          onChange={(e) => setOverlayColor(e.target.value)}
                          className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={overlayColor}
                          onChange={(e) => setOverlayColor(e.target.value)}
                          className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-1.5 rounded text-slate-100 uppercase text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Overlay Opacity ({overlayOpacity}%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                        className="w-full accent-[var(--brand-gold)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Animation Effect</label>
                      <select
                        value={animation}
                        onChange={(e) => setAnimation(e.target.value as any)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-lg text-slate-100"
                      >
                        <option value="kenburns">Ken Burns Zoom</option>
                        <option value="fade">Smooth Fade</option>
                        <option value="slide">Horizontal Slide</option>
                        <option value="zoom">Scale In</option>
                        <option value="parallax">Parallax Layer</option>
                        <option value="leaves">Floating Forest Leaves</option>
                        <option value="goldsweep">Golden Light Sweep</option>
                        <option value="none">None (Static)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Publish Control / Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-lg text-slate-100 font-bold"
                      >
                        <option value="ACTIVE">Active (Live on Site)</option>
                        <option value="DRAFT">Draft (Hidden)</option>
                        <option value="SCHEDULED">Scheduled Date Range</option>
                      </select>
                    </div>
                  </div>

                  {status === 'SCHEDULED' && (
                    <div className="grid grid-cols-2 gap-3 bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10">
                      <div>
                        <label className="block text-slate-400 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded text-slate-100"
                        />
                      </div>
                    </div>
                  )}

                  {/* SEO Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-400 mb-1">SEO Image Alt Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Adivasi Herbal Hair Oil"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">SEO Image Title</label>
                      <input
                        type="text"
                        placeholder="e.g. HakkiVeda Hair Care"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. 3D Layered Overflow Effect */}
                <div className="border-t border-white/10 pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>4. 3D Layered Foreground Subject & Overflow</span>
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enable3dOverflow}
                        onChange={(e) => setEnable3dOverflow(e.target.checked)}
                        className="w-4 h-4 accent-[var(--brand-gold)] rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        {enable3dOverflow ? (
                          <span className="text-[var(--brand-gold)]">3D Overflow Enabled</span>
                        ) : (
                          'Enable 3D Effect'
                        )}
                      </span>
                    </label>
                  </div>

                  {enable3dOverflow && (
                    <div className="bg-[var(--brand-primary-deep)] p-3.5 rounded-xl border border-[var(--brand-gold)]/30 space-y-3">
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Layer 2 transparent cutout (e.g. subject, long hair, botanicals) extends seamlessly outside the hero slider boundary into the next section for an ultra-luxurious depth illusion.
                      </p>

                      {/* Foreground Cutout Upload */}
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold text-xs">
                          Transparent Foreground Cutout (PNG / WebP / SVG) *
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-white transition-all shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Cutout</span>
                            <input
                              type="file"
                              accept="image/png,image/webp,image/svg+xml,image/gif"
                              onChange={(e) => handleFileSelect(e, 'CUTOUT')}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. /images/woman_long_hair_cutout.svg or cutout URL"
                            value={foregroundCutoutUrl}
                            onChange={(e) => {
                              if (cutoutPreviewUrl) {
                                URL.revokeObjectURL(cutoutPreviewUrl);
                                setCutoutPreviewUrl(null);
                              }
                              setCutoutFile(null);
                              setForegroundCutoutUrl(e.target.value);
                            }}
                            className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded-lg text-slate-100 text-xs"
                          />
                        </div>
                        {cutoutFile ? (
                          <span className="text-[10px] text-amber-300 mt-1 block font-semibold">
                            Selected cutout: {cutoutFile.name} ({(cutoutFile.size / 1024).toFixed(0)} KB)
                          </span>
                        ) : foregroundCutoutFilename ? (
                          <span className="text-[10px] text-emerald-400 mt-1 block">Saved cutout: {foregroundCutoutFilename}</span>
                        ) : null}
                      </div>

                      {/* Cutout Live Preview */}
                      {(cutoutPreviewUrl || foregroundCutoutUrl) && (
                        <div className="flex items-center gap-3 p-2 bg-black/40 rounded-lg border border-white/10">
                          <div className="w-16 h-16 rounded border border-white/20 bg-[repeating-conic-gradient(#333_0_25%,#222_0_50%)] bg-[length:12px_12px] flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={cutoutPreviewUrl || foregroundCutoutUrl}
                              alt="3D Cutout Preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="text-[11px] text-slate-300 space-y-0.5">
                            <div className="font-bold text-[var(--brand-gold)]">3D Subject Layer Ready</div>
                            <div className="text-[10px] text-slate-400">
                              Subject will float & respond gently to cursor movements with bottom overlap.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Desktop Positioning Grid */}
                      <div className="border-t border-white/10 pt-2 space-y-3">
                        <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Monitor className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                            <span>Desktop Positioning & Depth</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Move Y Offset UP (negative) or DOWN (positive) to align transparent subject
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                          {/* Desktop Position X */}
                          <div>
                            <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                              <span className="font-semibold">Position X</span>
                              <span className="font-mono text-[var(--brand-gold)]">{desktopPosX}%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={desktopPosX}
                                onChange={(e) => setDesktopPosX(Number(e.target.value))}
                                className="w-full accent-[var(--brand-gold)] cursor-pointer"
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={desktopPosX}
                                onChange={(e) => setDesktopPosX(e.target.value === '' ? 0 : Number(e.target.value))}
                                className="w-14 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                              />
                            </div>
                          </div>

                          {/* Desktop Width */}
                          <div>
                            <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                              <span className="font-semibold">Width (200-900px)</span>
                              <span className="font-mono text-[var(--brand-gold)]">{desktopWidth}px</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="range"
                                min="200"
                                max="900"
                                value={desktopWidth}
                                onChange={(e) => setDesktopWidth(Number(e.target.value))}
                                className="w-full accent-[var(--brand-gold)] cursor-pointer"
                              />
                              <input
                                type="number"
                                min="100"
                                max="1200"
                                value={desktopWidth}
                                onChange={(e) => setDesktopWidth(e.target.value === '' ? 0 : Number(e.target.value))}
                                className="w-16 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                              />
                            </div>
                          </div>

                          {/* Bottom Overflow */}
                          <div>
                            <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                              <span className="font-semibold">Bottom Overflow (0-500px)</span>
                              <span className="font-mono text-[var(--brand-gold)]">{desktopBottomOverflow}px</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="range"
                                min="0"
                                max="500"
                                value={desktopBottomOverflow}
                                onChange={(e) => setDesktopBottomOverflow(Number(e.target.value))}
                                className="w-full accent-[var(--brand-gold)] cursor-pointer"
                              />
                              <input
                                type="number"
                                min="0"
                                max="500"
                                value={desktopBottomOverflow}
                                onChange={(e) => setDesktopBottomOverflow(e.target.value === '' ? 0 : Number(e.target.value))}
                                className="w-16 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                              />
                            </div>
                          </div>

                          {/* Desktop Y Offset (-600px to +600px) */}
                          <div>
                            <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                              <span className="font-semibold">Y Offset (-600 to +600px)</span>
                              <span className={`font-mono font-bold ${desktopPosY < 0 ? 'text-cyan-300' : desktopPosY > 0 ? 'text-amber-300' : 'text-slate-300'}`}>
                                {desktopPosY > 0 ? `+${desktopPosY}` : desktopPosY}px
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="range"
                                min="-600"
                                max="600"
                                step="1"
                                value={desktopPosY}
                                onChange={(e) => setDesktopPosY(Number(e.target.value))}
                                className="w-full accent-[var(--brand-gold)] cursor-pointer"
                              />
                              <input
                                type="number"
                                min="-600"
                                max="600"
                                step="1"
                                value={desktopPosY}
                                onChange={(e) => setDesktopPosY(e.target.value === '' ? 0 : Number(e.target.value))}
                                className="w-16 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick Y-Offset Presets for Desktop */}
                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                          <span className="text-slate-400 mr-1">Quick Y Offset Presets:</span>
                          {[-400, -300, -250, -200, -150, -100, 0, 50, 100, 200].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setDesktopPosY(val)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                                desktopPosY === val
                                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold shadow-sm'
                                  : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
                              }`}
                            >
                              {val > 0 ? `+${val}` : val}px
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mobile Positioning Grid */}
                      <div className="border-t border-white/10 pt-2 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                            <span>Mobile Positioning & Depth</span>
                          </div>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                            <input
                              type="checkbox"
                              checked={disableMobileOverflow}
                              onChange={(e) => setDisableMobileOverflow(e.target.checked)}
                              className="w-3.5 h-3.5 accent-[var(--brand-gold)] rounded cursor-pointer"
                            />
                            <span>Disable on Mobile</span>
                          </label>
                        </div>

                        {!disableMobileOverflow && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                              {/* Mobile X */}
                              <div>
                                <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                                  <span className="font-semibold">Mobile X</span>
                                  <span className="font-mono text-[var(--brand-gold)]">{mobilePosX}%</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={mobilePosX}
                                    onChange={(e) => setMobilePosX(Number(e.target.value))}
                                    className="w-full accent-[var(--brand-gold)] cursor-pointer"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={mobilePosX}
                                    onChange={(e) => setMobilePosX(e.target.value === '' ? 0 : Number(e.target.value))}
                                    className="w-14 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                                  />
                                </div>
                              </div>

                              {/* Mobile Width */}
                              <div>
                                <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                                  <span className="font-semibold">Mobile Width (120-700px)</span>
                                  <span className="font-mono text-[var(--brand-gold)]">{mobileWidth}px</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="range"
                                    min="120"
                                    max="700"
                                    value={mobileWidth}
                                    onChange={(e) => setMobileWidth(Number(e.target.value))}
                                    className="w-full accent-[var(--brand-gold)] cursor-pointer"
                                  />
                                  <input
                                    type="number"
                                    min="80"
                                    max="900"
                                    value={mobileWidth}
                                    onChange={(e) => setMobileWidth(e.target.value === '' ? 0 : Number(e.target.value))}
                                    className="w-16 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                                  />
                                </div>
                              </div>

                              {/* Mobile Overflow */}
                              <div>
                                <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                                  <span className="font-semibold">Mobile Overflow (0-300px)</span>
                                  <span className="font-mono text-[var(--brand-gold)]">{mobileBottomOverflow}px</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="range"
                                    min="0"
                                    max="300"
                                    value={mobileBottomOverflow}
                                    onChange={(e) => setMobileBottomOverflow(Number(e.target.value))}
                                    className="w-full accent-[var(--brand-gold)] cursor-pointer"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    max="500"
                                    value={mobileBottomOverflow}
                                    onChange={(e) => setMobileBottomOverflow(e.target.value === '' ? 0 : Number(e.target.value))}
                                    className="w-16 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                                  />
                                </div>
                              </div>

                              {/* Mobile Y Offset (-600px to +600px) */}
                              <div>
                                <div className="flex items-center justify-between text-slate-300 text-[10px] mb-1">
                                  <span className="font-semibold">Mobile Y (-600 to +600px)</span>
                                  <span className={`font-mono font-bold ${mobilePosY < 0 ? 'text-cyan-300' : mobilePosY > 0 ? 'text-amber-300' : 'text-slate-300'}`}>
                                    {mobilePosY > 0 ? `+${mobilePosY}` : mobilePosY}px
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="range"
                                    min="-600"
                                    max="600"
                                    step="1"
                                    value={mobilePosY}
                                    onChange={(e) => setMobilePosY(Number(e.target.value))}
                                    className="w-full accent-[var(--brand-gold)] cursor-pointer"
                                  />
                                  <input
                                    type="number"
                                    min="-600"
                                    max="600"
                                    step="1"
                                    value={mobilePosY}
                                    onChange={(e) => setMobilePosY(e.target.value === '' ? 0 : Number(e.target.value))}
                                    className="w-16 bg-[var(--brand-primary-dark)] border border-white/20 px-1 py-1 rounded text-slate-100 text-xs font-mono text-center"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Quick Y-Offset Presets for Mobile */}
                            <div className="flex flex-wrap items-center gap-1 text-[10px]">
                              <span className="text-slate-400 mr-1">Quick Mobile Y Presets:</span>
                              {[-500, -400, -350, -300, -250, -200, -150, -100, -50, 0, 50, 100].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setMobilePosY(val)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                                    mobilePosY === val
                                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold shadow-sm'
                                      : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
                                  }`}
                                >
                                  {val > 0 ? `+${val}` : val}px
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  if (validateForm()) {
                    const tempSlide: HeroSlide = {
                      id: editingSlideId || 'temp-preview',
                      tag,
                      smallHeading,
                      title,
                      highlightText,
                      subtitle,
                      image: desktopPreviewUrl || image,
                      mobileImage: mobilePreviewUrl || mobileImage,
                      backgroundVideo: videoPreviewUrl || backgroundVideo,
                      mediaType,
                      ctaText,
                      ctaLink,
                      secondaryCtaText,
                      secondaryCtaLink,
                      active: true,
                      textPosition,
                      overlayColor,
                      overlayOpacity,
                      animation,
                      enable3dOverflow,
                      foregroundCutoutUrl: cutoutPreviewUrl || foregroundCutoutUrl,
                      desktopPosX,
                      desktopPosY,
                      desktopWidth,
                      desktopBottomOverflow,
                      mobilePosX,
                      mobilePosY,
                      mobileWidth,
                      mobileBottomOverflow,
                      disableMobileOverflow,
                    };
                    setPreviewSlide(tempSlide);
                  }
                }}
                className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)]/20 text-slate-200 border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Live Preview Form Banner</span>
              </button>

              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isUploading}
                    className="px-4 py-2.5 rounded-xl border border-white/20 text-slate-300 font-bold hover:bg-white/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[var(--brand-primary-dark)] border-t-transparent rounded-full animate-spin" />
                      <span>Publishing Media ({uploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEditing ? 'Save Banner Changes' : 'Publish New Banner Slide'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Slide List & Ordering */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--brand-gold)] text-sm uppercase flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Existing Hero Banners ({sortedSlides.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Drag/Move arrows to set display sequence</span>
            </div>

            {sortedSlides.length === 0 ? (
              <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-8 rounded-2xl text-center text-slate-400">
                No hero banners configured yet. Fill the form above to add your first banner!
              </div>
            ) : (
              <div className="space-y-3">
                {sortedSlides.map((s, index) => {
                  const ctr = s.impressions ? ((s.clicks || 0) / s.impressions) * 100 : 0;
                  return (
                    <div
                      key={s.id}
                      className={`bg-[var(--brand-primary-dark)] border p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                        s.active ? 'border-white/10 hover:border-[var(--brand-gold)]/40' : 'border-rose-500/30 opacity-75'
                      }`}
                    >
                      {/* Left thumbnail & info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Sequence controls */}
                        <div className="flex flex-col gap-1 text-slate-400">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'UP')}
                            className="p-1 hover:text-[var(--brand-gold)] disabled:opacity-30 disabled:hover:text-slate-400"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono text-center text-slate-500 font-bold">{index + 1}</span>
                          <button
                            disabled={index === sortedSlides.length - 1}
                            onClick={() => handleMove(index, 'DOWN')}
                            className="p-1 hover:text-[var(--brand-gold)] disabled:opacity-30 disabled:hover:text-slate-400"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Media Thumbnail */}
                        <div className="relative w-28 h-18 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black">
                          {(() => {
                            const imageUrl = normalizeMediaUrl(s.image);
                            console.log('Hero preview image URL', imageUrl);
                            return s.mediaType === 'VIDEO' && s.backgroundVideo ? (
                              <video src={normalizeMediaUrl(s.backgroundVideo)} className="w-full h-full object-cover" autoPlay muted loop />
                            ) : (
                              <img src={imageUrl} alt={s.title} className="w-full h-full object-cover" />
                            );
                          })()}
                          <span className="absolute top-1 left-1 bg-black/60 backdrop-blur text-[9px] text-[var(--brand-gold)] px-1.5 py-0.5 rounded font-bold uppercase">
                            {s.mediaType === 'VIDEO' ? 'VIDEO' : 'IMG'}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold text-[var(--brand-gold)] uppercase bg-[var(--brand-gold)]/10 px-2 py-0.5 rounded">
                              {s.tag || 'HERO BANNER'}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                s.status === 'ACTIVE'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : s.status === 'SCHEDULED'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {s.status || (s.active ? 'ACTIVE' : 'DRAFT')}
                            </span>
                            {s.enable3dOverflow && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>3D Layer</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-100 truncate">{s.title}</h4>
                          <p className="text-xs text-slate-300 truncate">{s.subtitle || 'No description provided'}</p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-0.5">
                            <span>Imp: {s.impressions || 0}</span>
                            <span>Clicks: {s.clicks || 0}</span>
                            <span className="text-[var(--brand-gold)] font-bold">CTR: {ctr.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {/* Quick Active Toggle */}
                        <button
                          onClick={() => {
                            updateHeroSlide(s.id, { active: !s.active });
                            showToast(s.active ? 'Slide deactivated' : 'Slide activated');
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                            s.active
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                          }`}
                        >
                          {s.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{s.active ? 'Enabled' : 'Disabled'}</span>
                        </button>

                        <button
                          onClick={() => setPreviewSlide(s)}
                          className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)]/20 text-slate-200 border border-white/10 p-2 rounded-lg"
                          title="Preview Banner"
                        >
                          <Eye className="w-4 h-4 text-[var(--brand-gold)]" />
                        </button>

                        <button
                          onClick={() => handleEditInit(s)}
                          className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)]/20 text-slate-200 border border-white/10 p-2 rounded-lg"
                          title="Edit Slide"
                        >
                          <Edit2 className="w-4 h-4 text-slate-300" />
                        </button>

                        <button
                          onClick={() => {
                            duplicateHeroSlide(s.id);
                            showToast('Banner slide duplicated!');
                          }}
                          className="bg-[var(--brand-primary-deep)] hover:bg-[var(--brand-gold)]/20 text-slate-200 border border-white/10 p-2 rounded-lg"
                          title="Duplicate Slide"
                        >
                          <Copy className="w-4 h-4 text-slate-300" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 p-2 rounded-lg"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL SLIDER BEHAVIOUR RULES */}
      {activeTab === 'global_settings' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs text-slate-200">
          <div>
            <h3 className="font-bold text-[var(--brand-gold)] text-sm uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Global Slider Behavior Rules</span>
            </h3>
            <p className="text-slate-300 text-xs mt-1">
              Control autoplay speeds, hover behavior, infinite loop, and mobile gestures across the homepage slider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">Auto Play</span>
                <input
                  type="checkbox"
                  checked={Boolean(heroSliderSettings?.autoPlay)}
                  onChange={(e) => updateHeroSliderSettings({ autoPlay: e.target.checked })}
                  className="w-4 h-4 accent-[var(--brand-gold)] cursor-pointer"
                />
              </div>
              <p className="text-slate-400 text-[11px]">Automatically cycle through slides on homepage</p>
            </div>

            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
              <label className="block font-bold text-slate-100">Auto Play Delay ({heroSliderSettings?.autoPlayDelay ?? 6}s)</label>
              <select
                value={heroSliderSettings?.autoPlayDelay ?? 6}
                onChange={(e) => updateHeroSliderSettings({ autoPlayDelay: Number(e.target.value) })}
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded text-slate-100"
              >
                <option value={3}>3 Seconds (Fast)</option>
                <option value={5}>5 Seconds</option>
                <option value={6}>6 Seconds (Recommended)</option>
                <option value={8}>8 Seconds</option>
                <option value={10}>10 Seconds (Slow)</option>
              </select>
            </div>

            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
              <label className="block font-bold text-slate-100">Transition Speed ({heroSliderSettings?.transitionSpeed ?? 700}ms)</label>
              <select
                value={heroSliderSettings?.transitionSpeed ?? 700}
                onChange={(e) => updateHeroSliderSettings({ transitionSpeed: Number(e.target.value) })}
                className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded text-slate-100"
              >
                <option value={300}>300 ms (Snappy)</option>
                <option value={500}>500 ms</option>
                <option value={700}>700 ms (Silky Smooth)</option>
                <option value={1000}>1000 ms (Slow Fade)</option>
              </select>
            </div>

            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">Pause On Hover</span>
                <input
                  type="checkbox"
                  checked={Boolean(heroSliderSettings?.pauseOnHover)}
                  onChange={(e) => updateHeroSliderSettings({ pauseOnHover: e.target.checked })}
                  className="w-4 h-4 accent-[var(--brand-gold)] cursor-pointer"
                />
              </div>
              <p className="text-slate-400 text-[11px]">Pause autoplay timer when user hovers over slide</p>
            </div>

            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">Infinite Loop</span>
                <input
                  type="checkbox"
                  checked={Boolean(heroSliderSettings?.infiniteLoop)}
                  onChange={(e) => updateHeroSliderSettings({ infiniteLoop: e.target.checked })}
                  className="w-4 h-4 accent-[var(--brand-gold)] cursor-pointer"
                />
              </div>
              <p className="text-slate-400 text-[11px]">Continuously loop back to first slide after last</p>
            </div>

            <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">Mobile Swipe Support</span>
                <input
                  type="checkbox"
                  checked={Boolean(heroSliderSettings?.swipeSupport)}
                  onChange={(e) => updateHeroSliderSettings({ swipeSupport: e.target.checked })}
                  className="w-4 h-4 accent-[var(--brand-gold)] cursor-pointer"
                />
              </div>
              <p className="text-slate-400 text-[11px]">Enable touch swipe gestures on smartphones/tablets</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & CTR */}
      {activeTab === 'analytics' && (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-6 rounded-2xl space-y-6 text-xs text-slate-200">
          <div>
            <h3 className="font-bold text-[var(--brand-gold)] text-sm uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Banner Performance & CTR Analytics</span>
            </h3>
            <p className="text-slate-300 text-xs mt-1">
              Track impression counts, CTA clickthroughs, and conversion efficiency per slide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-xl">
              <span className="text-slate-400 text-[11px]">Total Banner Views</span>
              <p className="text-2xl font-bold font-serif-luxury text-slate-100 mt-1">
                {heroSlides.reduce((acc, s) => acc + (s.impressions || 0), 0)}
              </p>
            </div>
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-xl">
              <span className="text-slate-400 text-[11px]">Total CTA Clicks</span>
              <p className="text-2xl font-bold font-serif-luxury text-[var(--brand-gold)] mt-1">
                {heroSlides.reduce((acc, s) => acc + (s.clicks || 0), 0)}
              </p>
            </div>
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-xl">
              <span className="text-slate-400 text-[11px]">Average CTR Rate</span>
              <p className="text-2xl font-bold font-serif-luxury text-emerald-400 mt-1">
                {(() => {
                  const totImp = heroSlides.reduce((acc, s) => acc + (s.impressions || 0), 0);
                  const totClk = heroSlides.reduce((acc, s) => acc + (s.clicks || 0), 0);
                  return totImp ? ((totClk / totImp) * 100).toFixed(1) + '%' : '0.0%';
                })()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase">Breakdown By Banner Slide</h4>
            {sortedSlides.map((s) => {
              const imp = s.impressions || 0;
              const clk = s.clicks || 0;
              const ctr = imp ? ((clk / imp) * 100).toFixed(1) : '0.0';
              return (
                <div key={s.id} className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={s.image} alt={s.title} className="w-16 h-12 object-cover rounded-lg border border-white/10" />
                    <div>
                      <h5 className="font-bold text-slate-100">{s.title}</h5>
                      <span className="text-[10px] text-[var(--brand-gold)]">{s.tag}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="block text-[10px] text-slate-400">Views</span>
                      <span className="font-bold text-slate-200">{imp}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">Clicks</span>
                      <span className="font-bold text-[var(--brand-gold)]">{clk}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">CTR Rate</span>
                      <span className="font-bold text-emerald-400">{ctr}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-dark)] border border-white/20 p-6 rounded-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-100 font-serif-luxury">Confirm Banner Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this hero banner slide? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteHeroSlide(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('Hero banner deleted successfully');
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg"
              >
                Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewSlide && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Top Bar Controls */}
          <div className="w-full max-w-6xl bg-[var(--brand-primary-dark)] border border-white/20 rounded-t-2xl p-4 flex items-center justify-between text-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[var(--brand-gold)]" />
              <span className="font-bold text-sm uppercase font-serif-luxury">Banner Live Preview</span>
            </div>

            {/* Viewport Selector */}
            <div className="flex items-center gap-2 bg-[var(--brand-primary-deep)] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setPreviewViewport('desktop')}
                className={`p-2 rounded-lg ${
                  previewViewport === 'desktop' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View (1280px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewViewport('tablet')}
                className={`p-2 rounded-lg ${
                  previewViewport === 'tablet' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewViewport('mobile')}
                className={`p-2 rounded-lg ${
                  previewViewport === 'mobile' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setPreviewSlide(null)}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Canvas Container */}
          <div className="w-full max-w-6xl bg-black rounded-b-2xl border-x border-b border-white/20 p-4 sm:p-8 overflow-auto flex items-center justify-center">
            <div
              className={`transition-all duration-300 relative rounded-2xl border border-[var(--brand-gold)]/40 shadow-2xl bg-[var(--brand-primary-dark)] overflow-visible ${
                previewViewport === 'desktop'
                  ? 'w-full h-[500px]'
                  : previewViewport === 'tablet'
                  ? 'w-[768px] h-[480px]'
                  : 'w-[375px] h-[540px]'
              }`}
            >
              {/* Media Background Clipped */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                {(() => {
                  const previewImgUrl = normalizeMediaUrl(
                    previewViewport === 'mobile' && previewSlide.mobileImage
                      ? previewSlide.mobileImage
                      : previewSlide.image
                  );
                  console.log('Hero preview image URL', previewImgUrl);
                  return previewSlide.mediaType === 'VIDEO' && previewSlide.backgroundVideo ? (
                    <video src={normalizeMediaUrl(previewSlide.backgroundVideo)} className="w-full h-full object-cover" autoPlay muted loop />
                  ) : (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${previewImgUrl}')`,
                      }}
                    />
                  );
                })()}

                {/* Dynamic Overlay Color & Opacity */}
                <div
                  className="absolute inset-0 transition-all"
                  style={{
                    backgroundColor: previewSlide.overlayColor || 'var(--brand-primary-dark)',
                    opacity: (previewSlide.overlayOpacity ?? 80) / 100,
                  }}
                />
              </div>

              {/* Text Content */}
              <div
                className={`relative z-10 h-full p-6 sm:p-10 flex flex-col justify-center ${
                  previewSlide.textPosition === 'CENTER'
                    ? 'items-center text-center max-w-2xl mx-auto'
                    : previewSlide.textPosition === 'RIGHT'
                    ? 'items-end text-right ml-auto max-w-xl'
                    : 'items-start text-left max-w-xl'
                }`}
              >
                {previewSlide.tag && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[var(--brand-gold)] text-[var(--brand-gold)] font-sans text-[10px] uppercase tracking-widest rounded-full bg-black/40 font-bold mb-3 shadow">
                    <Sparkles className="w-3 h-3 text-[var(--brand-gold)]" />
                    <span>{previewSlide.tag}</span>
                  </span>
                )}

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury leading-tight text-white">
                  {previewSlide.title}{' '}
                  {previewSlide.highlightText && (
                    <span className="italic text-[var(--brand-gold)] block sm:inline">{previewSlide.highlightText}</span>
                  )}
                </h1>

                {previewSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-200 mt-3 font-light leading-relaxed">
                    {previewSlide.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {previewSlide.ctaText && (
                    <span className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2">
                      <span>{previewSlide.ctaText}</span>
                    </span>
                  )}
                  {previewSlide.secondaryCtaText && (
                    <span className="border border-[var(--brand-gold)]/60 text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider backdrop-blur-md bg-black/30">
                      <span>{previewSlide.secondaryCtaText}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 3D Foreground Cutout Layer Preview */}
              {previewSlide.enable3dOverflow && previewSlide.foregroundCutoutUrl && !(previewViewport === 'mobile' && previewSlide.disableMobileOverflow) && (
                <div
                  className="absolute pointer-events-none z-20 transition-all duration-300"
                  style={{
                    left: previewViewport === 'mobile' 
                      ? `${previewSlide.mobilePosX ?? 60}%` 
                      : `${previewSlide.desktopPosX ?? 70}%`,
                    bottom: previewViewport === 'mobile'
                      ? `-${previewSlide.mobileBottomOverflow ?? 65}px`
                      : `-${previewSlide.desktopBottomOverflow ?? 130}px`,
                    width: previewViewport === 'mobile'
                      ? `${previewSlide.mobileWidth ?? 260}px`
                      : `${previewSlide.desktopWidth ?? 440}px`,
                    transform: `translateX(-50%) translateY(${
                      previewViewport === 'mobile' 
                        ? (previewSlide.mobilePosY ?? 0) 
                        : (previewSlide.desktopPosY ?? 0)
                    }px)`,
                  }}
                >
                  <img
                    src={normalizeMediaUrl(previewSlide.foregroundCutoutUrl)}
                    alt="3D Foreground Preview"
                    className="w-full h-auto object-contain hero-3d-overflow-shadow"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
