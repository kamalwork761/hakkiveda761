import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  Trash2,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Check,
  HelpCircle,
  Leaf,
  Loader2,
  Eye,
  Info,
  HeartHandshake,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HairAnalysisAnswers, HairProfileResult, VisualAssessment } from '../../types/hairAnalysis';
import { HAKKIVEDA_HAIR_STAGES, ScalpStageIllustration, HairLossPatternIllustration } from './HairLossPatternIllustrations';
import { generateHairProfile } from '../../utils/hairProfileEngine';
import { uploadFileToServer } from '../../utils/upload';
import { getProductUrl } from '../../utils/productUtils';
import { INITIAL_COUNTRIES } from '../../data/initialData';

interface HairAnalysisPageProps {
  onReturnHome?: () => void;
  onNavigateProduct?: (productUrl: string) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

const STORAGE_KEY_ANSWERS = 'hakkiveda_hair_analysis_draft_v1';
const STORAGE_KEY_RESULT = 'hakkiveda_hair_analysis_result_v1';

const INITIAL_ANSWERS: HairAnalysisAnswers = {
  name: '',
  countryCode: '+91',
  mobile: '',
  gender: '',
  ageGroup: '',
  country: 'India',
  city: '',
  mainConcern: '',
  hairLossPattern: '',
  hairStage: '',
  duration: '',
  severity: '',
  scalpConditions: [],
  hairQualities: [],
  familyHistory: '',
  stressLevel: '',
  sleepHours: '',
  exerciseFrequency: '',
  dietType: '',
  proteinIntake: '',
  digestionIssues: [],
  healthBackground: [],
  washFrequency: '',
  oilingFrequency: '',
  treatments: [],
  currentProducts: [],
  mainGoal: '',
  photos: {},
  visualAssessment: undefined,
  consent: false,
};

export const HairAnalysisPage: React.FC<HairAnalysisPageProps> = ({
  onReturnHome,
  onNavigateProduct,
  isModal = false,
  onCloseModal,
}) => {
  const {
    products,
    countries = INITIAL_COUNTRIES,
    addToCart,
    formatPrice,
    setIsCartOpen,
    playSound,
  } = useStore();

  // Step state: 0 = Opening screen, 1..26 = Question steps, 27 = Analyzing screen, 28 = Result screen
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<HairAnalysisAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (saved) return { ...INITIAL_ANSWERS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Error reading saved hair quiz draft', e);
    }
    return INITIAL_ANSWERS;
  });

  const [result, setResult] = useState<HairProfileResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESULT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved result', e);
    }
    return null;
  });

  const [analyzingStatusIdx, setAnalyzingStatusIdx] = useState<number>(0);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);
  const [allAdded, setAllAdded] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    } catch (e) {
      // Storage quota exceeded or disabled
    }
  }, [answers]);

  useEffect(() => {
    if (result) {
      try {
        localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result));
      } catch (e) {}
    }
  }, [result]);

  // Scroll to top of container when step changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // Rotating status text during analysis
  const rotatingStatuses = [
    'Understanding your hair pattern…',
    'Reviewing scalp condition…',
    'Checking lifestyle factors…',
    'Building your personalized HAKKIVEDA ritual…',
  ];

  useEffect(() => {
    if (step === 27) {
      const interval = setInterval(() => {
        setAnalyzingStatusIdx((prev) => (prev + 1) % rotatingStatuses.length);
      }, 750);

      const timeout = setTimeout(async () => {
        clearInterval(interval);
        // Generate profile result
        const generated = generateHairProfile(answers, products);
        setResult(generated);
        setStep(28); // Show result page
        playSound('success_chime');

        // Submit lead asynchronously to backend
        try {
          setSubmittingLead(true);
          await fetch('/api/hair-analysis/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: answers.name,
              mobile: answers.mobile,
              countryCode: answers.countryCode,
              gender: answers.gender,
              ageGroup: answers.ageGroup,
              country: answers.country,
              city: answers.city,
              allAnswers: answers,
              photoReferences: answers.photos,
              generatedProfile: generated,
              recommendedProductIds: generated.recommendedProductIds,
            }),
          });
        } catch (err) {
          console.warn('Error saving hair analysis lead to server:', err);
        } finally {
          setSubmittingLead(false);
        }
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step, answers, products]);

  // Handle single selection with automatic progression where intuitive
  const handleSingleSelect = (field: keyof HairAnalysisAnswers, value: any, autoAdvance = true) => {
    playSound('nav_click');
    setAnswers((prev) => ({ ...prev, [field]: value }));
    if (autoAdvance) {
      setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 220);
    }
  };

  // Handle multiple selection
  const handleMultiToggle = (field: 'scalpConditions' | 'hairQualities' | 'digestionIssues' | 'healthBackground' | 'treatments' | 'currentProducts', value: string, clearAllValue = 'None') => {
    playSound('nav_click');
    setAnswers((prev) => {
      const currentList = prev[field] as string[];
      if (value === clearAllValue || value === 'None of these' || value === 'Nothing' || value === 'Prefer not to say') {
        return {
          ...prev,
          [field]: currentList.includes(value) ? [] : [value],
        };
      }
      const filtered = currentList.filter(
        (item) => item !== 'None' && item !== 'None of these' && item !== 'Nothing' && item !== 'Prefer not to say'
      );
      if (filtered.includes(value)) {
        return { ...prev, [field]: filtered.filter((i) => i !== value) };
      } else {
        return { ...prev, [field]: [...filtered, value] };
      }
    });
  };

  // Photo upload handling - dedicated Top/Crown Photo upload & AI analysis
  const handleTopCrownPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous error
    setPhotoUploadError(null);
    setIsUploadingPhoto(true);
    playSound('nav_click');

    try {
      // 1. Client-side fast check for immediate user-friendly feedback
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const rawExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];

      if (!allowedMimes.includes(file.type.toLowerCase()) && (!rawExt || !allowedExts.includes(rawExt))) {
        setPhotoUploadError('Please upload a JPG, PNG or WebP image.');
        playSound('nav_click');
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setPhotoUploadError('Image must be 15MB or smaller.');
        playSound('nav_click');
        return;
      }

      // 2. Build standard FormData with single 'photo' field
      const formData = new FormData();
      formData.append('photo', file);
      if (answers.gender) {
        formData.append('gender', answers.gender);
      }
      if (answers.hairStage || answers.hairLossPattern) {
        formData.append('selectedStage', answers.hairStage || answers.hairLossPattern);
      }

      // 3. Post directly to /api/hair-analysis/analyze-photo without manually setting Content-Type
      let res: Response;
      try {
        res = await fetch('/api/hair-analysis/analyze-photo', {
          method: 'POST',
          body: formData,
        });
      } catch (netErr: any) {
        setPhotoUploadError('Could not connect to the photo analysis service.');
        playSound('nav_click');
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        const errorMsg = data?.message || data?.error || 'Photo upload failed. Please try a different image.';
        setPhotoUploadError(errorMsg);
        playSound('nav_click');
        return;
      }

      if (!data.success) {
        if (data.code === 'IMAGE_TOO_LARGE') {
          setPhotoUploadError(data.message || 'Image must be 15MB or smaller.');
        } else if (data.code === 'INVALID_IMAGE') {
          setPhotoUploadError(data.message || 'Please upload a JPG, PNG or WebP image.');
        } else if (data.code === 'ANALYSIS_FAILED') {
          // File uploaded successfully, but AI visual analysis could not complete
          if (data.url) {
            setAnswers((prev) => ({
              ...prev,
              photos: { ...prev.photos, topCrown: data.url },
              visualAssessment: undefined,
            }));
          }
          setPhotoUploadError(
            data.message || 'We received your photo, but visual analysis could not be completed. Please retry.'
          );
        } else {
          setPhotoUploadError(data.message || data.error || 'Photo upload failed. Please try a different image.');
        }
        playSound('nav_click');
        return;
      }

      // Upload and analysis succeeded!
      const photoUrl = data.url;
      const visualAssessment: VisualAssessment | undefined = data.visualAssessment;

      setAnswers((prev) => ({
        ...prev,
        photos: {
          ...prev.photos,
          topCrown: photoUrl,
        },
        visualAssessment,
      }));

      // Check if image quality was flagged as insufficient
      if (
        data.analysisStatus === 'IMAGE_QUALITY_INSUFFICIENT' ||
        visualAssessment?.imageQualityStatus === 'IMAGE_QUALITY_INSUFFICIENT' ||
        visualAssessment?.analysisStatus === 'IMAGE_QUALITY_INSUFFICIENT'
      ) {
        setPhotoUploadError(
          data.message || 'Please retake the photo in brighter light with the crown clearly visible.'
        );
        playSound('nav_click');
      } else {
        playSound('pop');
      }
    } catch (err: any) {
      setPhotoUploadError(err?.message || 'Could not connect to the photo analysis service.');
      playSound('nav_click');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleRemoveTopCrownPhoto = () => {
    playSound('nav_click');
    setPhotoUploadError(null);
    setAnswers((prev) => {
      const nextPhotos = { ...prev.photos };
      delete nextPhotos.topCrown;
      return {
        ...prev,
        photos: nextPhotos,
        visualAssessment: undefined,
      };
    });
  };

  const handlePhotoUpload = async (slot: 'frontHairline' | 'topCrown' | 'sideView', e: React.ChangeEvent<HTMLInputElement>) => {
    if (slot === 'topCrown') {
      return handleTopCrownPhotoUpload(e);
    }
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingSlot(slot);
      playSound('nav_click');
      const uploadedUrl = await uploadFileToServer(file);
      setAnswers((prev) => ({
        ...prev,
        photos: {
          ...prev.photos,
          [slot]: uploadedUrl,
        },
      }));
      playSound('pop');
    } catch (err: any) {
      alert(err?.message || 'Could not upload photo. Please try again.');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemovePhoto = (slot: 'frontHairline' | 'topCrown' | 'sideView') => {
    if (slot === 'topCrown') {
      return handleRemoveTopCrownPhoto();
    }
    playSound('nav_click');
    setAnswers((prev) => {
      const nextPhotos = { ...prev.photos };
      delete nextPhotos[slot];
      return { ...prev, photos: nextPhotos };
    });
  };

  const handleRetake = () => {
    playSound('nav_click');
    setStep(1);
  };

  const handleAddAllToCart = () => {
    if (!result?.recommendedProducts) return;
    playSound('cart_add');
    result.recommendedProducts.forEach((item) => {
      const fullProduct = products.find((p) => p.id === item.id);
      if (fullProduct) {
        addToCart(fullProduct, 1);
      }
    });
    setAllAdded(true);
    setIsCartOpen(true);
  };

  const handleAddSingleProduct = (productId: string) => {
    const fullProduct = products.find((p) => p.id === productId);
    if (fullProduct) {
      playSound('cart_add');
      addToCart(fullProduct, 1);
      setAddedProductIds((prev) => [...prev, productId]);
    }
  };

  // Compute progress percentage (Steps 1 to 26 = 26 questions/review)
  const totalQuestions = 26;
  const progressPercent = step === 0 ? 0 : step >= 27 ? 100 : Math.round((step / totalQuestions) * 100);

  // Validation rules for Next button
  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return answers.name.trim().length >= 2;
      case 2:
        return answers.mobile.trim().length >= 5;
      case 3:
        return Boolean(answers.gender);
      case 4:
        return Boolean(answers.ageGroup);
      case 5:
        return Boolean(answers.country);
      case 6:
        return Boolean(answers.mainConcern);
      case 7:
        return Boolean(answers.hairStage || answers.hairLossPattern);
      case 8:
        return Boolean(answers.duration);
      case 9:
        return Boolean(answers.severity);
      case 10:
        return answers.scalpConditions.length > 0;
      case 11:
        return answers.hairQualities.length > 0;
      case 12:
        return Boolean(answers.familyHistory);
      case 13:
        return Boolean(answers.stressLevel);
      case 14:
        return Boolean(answers.sleepHours);
      case 15:
        return Boolean(answers.exerciseFrequency);
      case 16:
        return Boolean(answers.dietType);
      case 17:
        return Boolean(answers.proteinIntake);
      case 18:
        return answers.digestionIssues.length > 0;
      case 19:
        return answers.healthBackground.length > 0;
      case 20:
        return Boolean(answers.washFrequency);
      case 21:
        return Boolean(answers.oilingFrequency);
      case 22:
        return answers.treatments.length > 0;
      case 23:
        return answers.currentProducts.length > 0;
      case 24:
        return Boolean(answers.mainGoal);
      case 25:
        return Boolean(
          answers.photos?.topCrown &&
          answers.visualAssessment &&
          answers.visualAssessment.imageQualityStatus !== 'IMAGE_QUALITY_INSUFFICIENT' &&
          answers.visualAssessment.analysisStatus !== 'IMAGE_QUALITY_INSUFFICIENT'
        );
      case 26:
        return answers.consent;
      default:
        return true;
    }
  };

  // Smart Branching Helpers
  // e.g., Filter options based on gender
  const availableHealthBackground = [
    'Thyroid condition',
    ...(answers.gender === 'Female' || answers.gender === 'Prefer not to say' ? ['PCOS'] : []),
    'Diabetes',
    'Anaemia / low iron',
    'Recent major illness or fever',
    'Recent surgery',
    'Recent major weight loss',
    ...(answers.gender === 'Female' ? ['Pregnancy / postpartum'] : []),
    'Currently taking regular medication',
    'None',
    'Prefer not to say',
  ];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#FBF9F4] text-[#132A1C] font-sans flex flex-col selection:bg-[#C9A84E] selection:text-[#0B2F20] ${
        isModal ? 'fixed inset-0 z-50 overflow-y-auto bg-[#FBF9F4]' : ''
      }`}
    >
      {/* TOP HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-[#FBF9F4]/95 backdrop-blur-md border-b border-[#E7DFC9] py-3.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step > 0 && step < 27 && (
            <button
              type="button"
              onClick={() => {
                playSound('nav_click');
                setStep((prev) => Math.max(0, prev - 1));
              }}
              className="p-2 rounded-xl text-[#0B2F20] hover:bg-[#EAE2CE] transition-colors cursor-pointer flex items-center gap-1 text-sm font-semibold"
              aria-label="Previous Step"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Back</span>
            </button>
          )}

          <div
            onClick={() => {
              if (onReturnHome) onReturnHome();
              else if (onCloseModal) onCloseModal();
              else window.location.href = '/';
            }}
            className="cursor-pointer flex items-center gap-2"
          >
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-[#0B2F20]">
              HAKKIVEDA
            </span>
            <span className="text-[10px] tracking-widest uppercase bg-[#0B2F20] text-[#C9A84E] px-2 py-0.5 rounded-full font-bold">
              Root Analysis
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {step >= 1 && step <= 26 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6E5F]">
              <span>Step {step} of {totalQuestions}</span>
              <span className="font-bold text-[#0B2F20] bg-[#EAE2CE] px-2 py-0.5 rounded-full">
                {progressPercent}%
              </span>
            </div>
          )}

          {isModal && onCloseModal && (
            <button
              type="button"
              onClick={() => {
                playSound('modal_close');
                onCloseModal();
              }}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-[#EAE2CE] transition-colors"
              aria-label="Close Hair Analysis"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* PROGRESS TRACKER BAR (Visible during questions 1-26) */}
      {step >= 1 && step <= 26 && (
        <div className="w-full bg-[#E5DBC5] h-1.5 sticky top-[57px] z-20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0B2F20] via-[#1B4D35] to-[#C9A84E] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-12 flex flex-col justify-center">
        {/* ============================================================
            STEP 0: OPENING SCREEN
            ============================================================ */}
        {step === 0 && (
          <div className="text-center space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Top botanical badge */}
            <div className="inline-flex items-center gap-2 bg-[#E9E1CC] border border-[#D5C7A8] px-4 py-1.5 rounded-full text-[#0B2F20] text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-[#C9A84E]" />
              <span>Authentic Tribal Root Diagnostic</span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl font-serif-luxury font-bold text-[#0B2F20] leading-tight tracking-tight">
                Understand Your Hair From the Root
              </h1>
              <p className="text-sm sm:text-base text-[#465E4E] leading-relaxed max-w-xl mx-auto">
                Answer a few questions about your hair, scalp, lifestyle and routine to receive a personalized HAKKIVEDA hair-care profile.
              </p>
            </div>

            {/* Value Highlights Pill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2 text-left">
              <div className="bg-white/80 border border-[#E7DFC9] rounded-2xl p-4 shadow-xs flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#C9A84E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#0B2F20] uppercase tracking-wider">Root Consultation</h4>
                  <p className="text-[11px] text-[#556D5D] mt-0.5">Scalp terrain & follicle evaluation</p>
                </div>
              </div>
              <div className="bg-white/80 border border-[#E7DFC9] rounded-2xl p-4 shadow-xs flex items-start gap-3">
                <Leaf className="w-5 h-5 text-[#0B2F20] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#0B2F20] uppercase tracking-wider">Ayurvedic Ritual</h4>
                  <p className="text-[11px] text-[#556D5D] mt-0.5">108 forest herb matching</p>
                </div>
              </div>
              <div className="bg-white/80 border border-[#E7DFC9] rounded-2xl p-4 shadow-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C9A84E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#0B2F20] uppercase tracking-wider">100% Private</h4>
                  <p className="text-[11px] text-[#556D5D] mt-0.5">Safe, confidential wellness review</p>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  playSound('cta_click');
                  setStep(1);
                }}
                className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] bg-[#0B2F20] text-[#FAF8F2] hover:bg-[#13442E] active:scale-98 text-sm sm:text-base font-bold uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-3 cursor-pointer border border-[#C9A84E]/40"
              >
                <span>Start My Free Hair Analysis</span>
                <ChevronRight className="w-4 h-4 text-[#C9A84E]" />
              </button>
              <p className="text-xs text-[#6C8272] font-medium">
                Takes about 3–5 minutes
              </p>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 1: NAME
            ============================================================ */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Welcome</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                What should we call you?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Let's personalize your HAKKIVEDA consultation.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder="Your first name"
                value={answers.name}
                onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isStepValid()) {
                    playSound('nav_click');
                    setStep(2);
                  }
                }}
                className="w-full text-lg sm:text-xl font-medium px-5 py-4 rounded-2xl bg-white border border-[#D8CEB7] focus:border-[#0B2F20] focus:ring-2 focus:ring-[#0B2F20]/10 outline-none text-[#0B2F20] placeholder-[#A4B3A8] transition-all shadow-xs"
              />
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 2: MOBILE NUMBER
            ============================================================ */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Contact & Consultation</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                What is your mobile / WhatsApp number?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                We may use this to save your hair profile and support your consultation.
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={answers.countryCode}
                onChange={(e) => setAnswers({ ...answers, countryCode: e.target.value })}
                placeholder="+91"
                className="w-24 sm:w-28 text-base font-semibold px-3 sm:px-4 py-4 rounded-2xl bg-white border border-[#D8CEB7] focus:border-[#0B2F20] focus:ring-2 focus:ring-[#0B2F20]/10 outline-none text-[#0B2F20] text-center shadow-xs"
              />
              <input
                type="tel"
                autoFocus
                placeholder="Mobile number"
                value={answers.mobile}
                onChange={(e) => setAnswers({ ...answers, mobile: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isStepValid()) {
                    playSound('nav_click');
                    setStep(3);
                  }
                }}
                className="flex-1 text-lg font-medium px-5 py-4 rounded-2xl bg-white border border-[#D8CEB7] focus:border-[#0B2F20] focus:ring-2 focus:ring-[#0B2F20]/10 outline-none text-[#0B2F20] placeholder-[#A4B3A8] shadow-xs"
              />
            </div>

            <div className="bg-[#EFE9DA]/60 border border-[#D9CDB2] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#526857]">
              <ShieldCheck className="w-4 h-4 text-[#0B2F20] shrink-0 mt-0.5" />
              <span>
                Your information is kept private and used only for your HAKKIVEDA hair-care journey.
              </span>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 3: GENDER
            ============================================================ */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Profile</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How do you identify?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Certain hormonal and hair growth patterns vary by biological and lifestyle factors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[
                { label: 'Male', desc: 'Male pattern thinning & crown focus' },
                { label: 'Female', desc: 'Diffuse thinning & hormonal wellness' },
                { label: 'Prefer not to say', desc: 'Standard botanical evaluation' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSingleSelect('gender', opt.label)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                    answers.gender === opt.label
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base font-bold text-[#0B2F20]">{opt.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        answers.gender === opt.label ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                      }`}
                    >
                      {answers.gender === opt.label && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <span className="text-xs text-[#5E7565] mt-2">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 4: AGE
            ============================================================ */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Biological Stage</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                What is your age group?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => handleSingleSelect('ageGroup', age)}
                  className={`py-4 px-4 rounded-2xl border text-center font-bold text-sm sm:text-base transition-all cursor-pointer ${
                    answers.ageGroup === age
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#2B4232] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 5: LOCATION
            ============================================================ */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Climate & Water Quality</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Where are you located?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Environmental factors such as hard water, humidity, and heat influence scalp oiliness and root shedding.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2F20] mb-1.5">
                  Country
                </label>
                <select
                  value={answers.country}
                  onChange={(e) => setAnswers({ ...answers, country: e.target.value })}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white border border-[#D8CEB7] text-[#0B2F20] font-medium outline-none focus:border-[#0B2F20] shadow-xs cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2F20] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai, London, Dubai"
                  value={answers.city}
                  onChange={(e) => setAnswers({ ...answers, city: e.target.value })}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white border border-[#D8CEB7] text-[#0B2F20] font-medium outline-none focus:border-[#0B2F20] shadow-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 6: MAIN HAIR CONCERN
            ============================================================ */}
        {step === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Primary Focus</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                What is your main hair concern?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Select the single biggest issue you want to solve first.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Hair Fall',
                'Hair Thinning',
                'Receding Hairline',
                'Crown Thinning',
                'Bald Patches',
                'Dandruff',
                'Dry / Frizzy Hair',
                'Oily Scalp',
                'Slow Hair Growth',
                'Premature Greying',
              ].map((concern) => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => handleSingleSelect('mainConcern', concern)}
                  className={`py-3.5 px-4 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    answers.mainConcern === concern
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span>{concern}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      answers.mainConcern === concern ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                    }`}
                  >
                    {answers.mainConcern === concern && <Check className="w-2.5 h-2.5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 7: HAIR LOSS PATTERN (with visual stage illustrations)
            ============================================================ */}
        {step === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Stage-Wise Mapping</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Which Stage Looks Closest to Your Hair?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Visualizing follicular density helps us match the exact tribal botanical concentration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HAKKIVEDA_HAIR_STAGES.map((stageItem) => {
                const isSelected =
                  answers.hairStage === stageItem.badge ||
                  answers.hairLossPattern === `${stageItem.badge}: ${stageItem.title}` ||
                  (stageItem.id === 'NOT_SURE' && (answers.hairStage === 'NOT SURE' || answers.hairLossPattern === 'Not Sure'));

                return (
                  <button
                    key={stageItem.id}
                    type="button"
                    onClick={() => {
                      playSound('nav_click');
                      setAnswers((prev) => ({
                        ...prev,
                        hairStage: stageItem.badge,
                        hairLossPattern: `${stageItem.badge}: ${stageItem.title}`,
                      }));
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group min-h-[220px] ${
                      isSelected
                        ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/20 shadow-md'
                        : 'border-[#D8CEB7] bg-white/75 hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-2">
                      <span
                        className={`text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                          isSelected
                            ? 'bg-[#0B2F20] text-[#C9A84E]'
                            : 'bg-[#EAE2CE] text-[#0B2F20]'
                        }`}
                      >
                        {stageItem.badge}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-[#0B2F20] bg-[#0B2F20] text-white'
                            : 'border-[#B4C2B8] group-hover:border-[#0B2F20]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <div className="w-full flex justify-center py-2 bg-[#FAF7F0] rounded-xl border border-[#EBE4D5] my-2">
                      <ScalpStageIllustration stage={stageItem.id} gender={answers.gender} className="w-20 h-20" />
                    </div>

                    <div className="space-y-1 mt-auto">
                      <h4 className="text-sm font-bold text-[#0B2F20] leading-snug">{stageItem.title}</h4>
                      <p className="text-xs text-[#5D7363] leading-relaxed">{stageItem.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 8: DURATION
            ============================================================ */}
        {step === 8 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Timeline</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How long have you been experiencing this concern?
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                'Less than 3 months',
                '3–6 months',
                '6–12 months',
                '1–3 years',
                'More than 3 years',
              ].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => handleSingleSelect('duration', dur)}
                  className={`w-full py-4 px-5 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    answers.duration === dur
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span>{dur}</span>
                  {answers.duration === dur && <Check className="w-4 h-4 text-[#0B2F20]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 9: SEVERITY
            ============================================================ */}
        {step === 9 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Hair Fall Quantity</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How much hair fall do you usually notice?
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Mild', desc: 'Standard 20–50 strands daily in brush or shower' },
                { label: 'Moderate', desc: 'Noticeable strands across pillow, floor, and clothes' },
                { label: 'Heavy', desc: 'Frequent clump shedding during washing or combing' },
                { label: 'Very heavy / handfuls', desc: 'Significant handfuls coming out with gentle touch' },
                { label: 'Not sure', desc: 'General thinning observed over time' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSingleSelect('severity', item.label)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    answers.severity === item.label
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold text-[#0B2F20] block">{item.label}</span>
                    <span className="text-xs text-[#5D7363] mt-0.5 block">{item.desc}</span>
                  </div>
                  {answers.severity === item.label && <Check className="w-4 h-4 text-[#0B2F20] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 10: SCALP CONDITION (Multiple)
            ============================================================ */}
        {step === 10 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Scalp Terrain</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How would you describe your scalp?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Select all that apply to help balance oil production and moisture levels.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Normal',
                'Dry',
                'Oily',
                'Dandruff',
                'Itchy',
                'Flaky',
                'Sensitive',
                'Red / irritated',
              ].map((cond) => {
                const isSelected = answers.scalpConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleMultiToggle('scalpConditions', cond)}
                    className={`p-3.5 rounded-xl border text-center font-medium text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                        : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                    }`}
                  >
                    <span>{cond}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 11: HAIR QUALITY (Multiple)
            ============================================================ */}
        {step === 11 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Strand Texture</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How would you describe your hair?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Select all that match your natural or current strand state.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Thin',
                'Thick',
                'Dry',
                'Frizzy',
                'Brittle',
                'Damaged',
                'Normal',
                'Chemically treated',
              ].map((qual) => {
                const isSelected = answers.hairQualities.includes(qual);
                return (
                  <button
                    key={qual}
                    type="button"
                    onClick={() => handleMultiToggle('hairQualities', qual)}
                    className={`p-3.5 rounded-xl border text-center font-medium text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                        : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                    }`}
                  >
                    <span>{qual}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 12: FAMILY HISTORY
            ============================================================ */}
        {step === 12 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Genetics & Lineage</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Does anyone in your close family have significant hair thinning or baldness?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Father', 'Mother', 'Both parents', 'Sibling', 'No', 'Not sure'].map((fam) => (
                <button
                  key={fam}
                  type="button"
                  onClick={() => handleSingleSelect('familyHistory', fam)}
                  className={`py-4 px-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    answers.familyHistory === fam
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 13: STRESS
            ============================================================ */}
        {step === 13 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Lifestyle Factors</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How would you describe your current stress level?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Low', desc: 'Calm & balanced daily' },
                { label: 'Moderate', desc: 'Typical work/life pressures' },
                { label: 'High', desc: 'Frequent exhaustion or tension' },
                { label: 'Very high', desc: 'Severe continuous stress' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSingleSelect('stressLevel', item.label)}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                    answers.stressLevel === item.label
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span className="text-sm font-bold text-[#0B2F20]">{item.label}</span>
                  <span className="text-[11px] text-[#617666] mt-1">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 14: SLEEP
            ============================================================ */}
        {step === 14 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Restorative Sleep</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How much do you usually sleep?
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                'Less than 5 hours',
                '5–7 hours',
                '7–9 hours',
                'More than 9 hours',
                'Irregular sleep',
              ].map((sleep) => (
                <button
                  key={sleep}
                  type="button"
                  onClick={() => handleSingleSelect('sleepHours', sleep)}
                  className={`w-full py-4 px-5 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    answers.sleepHours === sleep
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span>{sleep}</span>
                  {answers.sleepHours === sleep && <Check className="w-4 h-4 text-[#0B2F20]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 15: EXERCISE
            ============================================================ */}
        {step === 15 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Physical Activity</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How often do you exercise?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Rarely', '1–2 times per week', '3–4 times per week', 'Almost daily'].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleSingleSelect('exerciseFrequency', ex)}
                  className={`p-4 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center min-h-[72px] ${
                    answers.exerciseFrequency === ex
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 16: DIET TYPE
            ============================================================ */}
        {step === 16 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Nutritional Foundation</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Which best describes your diet?
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                'Vegetarian',
                'Non-vegetarian',
                'Vegan',
                'Eggetarian',
                'Mixed / no fixed diet',
              ].map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => handleSingleSelect('dietType', diet)}
                  className={`w-full py-4 px-5 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    answers.dietType === diet
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span>{diet}</span>
                  {answers.dietType === diet && <Check className="w-4 h-4 text-[#0B2F20]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 17: PROTEIN INTAKE
            ============================================================ */}
        {step === 17 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Hair Building Blocks</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How often do you include protein-rich foods?
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Rarely', desc: 'Little to no dedicated protein intake' },
                { label: 'A few times per week', desc: 'Occasional legumes, eggs, or paneer' },
                { label: 'Most days', desc: 'Regular protein sources with major meals' },
                { label: 'Daily', desc: 'High conscious protein focus every day' },
                { label: 'Not sure', desc: 'Balanced mixed home meals' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSingleSelect('proteinIntake', item.label)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    answers.proteinIntake === item.label
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold text-[#0B2F20]">{item.label}</span>
                    <span className="text-xs text-[#5D7363] block mt-0.5">{item.desc}</span>
                  </div>
                  {answers.proteinIntake === item.label && <Check className="w-4 h-4 text-[#0B2F20]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 18: DIGESTION (Multiple, None of these clears others)
            ============================================================ */}
        {step === 18 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Agni & Gut Wellness</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Do you frequently experience any of these?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Ayurveda recognizes digestive balance as the root transporter of nutrients to hair follicles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Acidity',
                'Bloating',
                'Constipation',
                'Poor appetite',
                'Irregular digestion',
                'None of these',
              ].map((issue) => {
                const isSelected = answers.digestionIssues.includes(issue);
                return (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => handleMultiToggle('digestionIssues', issue, 'None of these')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                        : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                    }`}
                  >
                    <span className="text-sm">{issue}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 19: HEALTH BACKGROUND (Multiple, No diagnosis claimed)
            ============================================================ */}
        {step === 19 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">General Health</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Do any of these apply to you?
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                For wellness context only. We do not diagnose or treat any medical conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableHealthBackground.map((item) => {
                const isSelected = answers.healthBackground.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleMultiToggle('healthBackground', item, 'None')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                        : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 20: CURRENT HAIR ROUTINE (WASH FREQUENCY)
            ============================================================ */}
        {step === 20 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Cleansing Habits</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How often do you wash your hair?
              </h2>
            </div>

            <div className="space-y-2.5">
              {['Daily', 'Every 2 days', '2–3 times per week', 'Once per week', 'Less often'].map((wash) => (
                <button
                  key={wash}
                  type="button"
                  onClick={() => handleSingleSelect('washFrequency', wash)}
                  className={`w-full py-4 px-5 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    answers.washFrequency === wash
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span>{wash}</span>
                  {answers.washFrequency === wash && <Check className="w-4 h-4 text-[#0B2F20]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 21: HAIR OILING FREQUENCY
            ============================================================ */}
        {step === 21 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Scalp Lubrication</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                How often do you oil your scalp?
              </h2>
            </div>

            <div className="space-y-2.5">
              {['Never', 'Occasionally', 'Once per week', '2–3 times per week', 'Almost daily'].map((oil) => (
                <button
                  key={oil}
                  type="button"
                  onClick={() => handleSingleSelect('oilingFrequency', oil)}
                  className={`w-full py-4 px-5 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    answers.oilingFrequency === oil
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span>{oil}</span>
                  {answers.oilingFrequency === oil && <Check className="w-4 h-4 text-[#0B2F20]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 22: CHEMICAL / HEAT TREATMENT (Multiple)
            ============================================================ */}
        {step === 22 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Processing & Heat</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Do you regularly use any of these?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                'Hair dye',
                'Bleach',
                'Straightening',
                'Keratin treatment',
                'Hair dryer',
                'Straightener / curler',
                'None',
              ].map((treat) => {
                const isSelected = answers.treatments.includes(treat);
                return (
                  <button
                    key={treat}
                    type="button"
                    onClick={() => handleMultiToggle('treatments', treat, 'None')}
                    className={`p-4 rounded-xl border text-center font-medium text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                        : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                    }`}
                  >
                    <span>{treat}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 23: CURRENT PRODUCTS (Multiple)
            ============================================================ */}
        {step === 23 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Current Regimen</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                What are you currently using for your hair?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Hair oil',
                'Regular shampoo',
                'Anti-dandruff shampoo',
                'Hair serum',
                'Minoxidil',
                'Supplements',
                'Ayurvedic products',
                'Nothing',
              ].map((prod) => {
                const isSelected = answers.currentProducts.includes(prod);
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => handleMultiToggle('currentProducts', prod, 'Nothing')}
                    className={`p-3.5 rounded-xl border text-center font-medium text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                        : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                    }`}
                  >
                    <span>{prod}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#0B2F20] bg-[#0B2F20] text-white' : 'border-[#B4C2B8]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 24: MAIN GOAL
            ============================================================ */}
        {step === 24 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Desired Outcome</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                What result matters most to you?
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                'Reduce hair fall',
                'Support stronger-looking roots',
                'Improve scalp health',
                'Control dandruff',
                'Improve hair softness',
                'Support thicker-looking hair',
                'Improve overall hair-care routine',
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleSingleSelect('mainGoal', goal)}
                  className={`w-full py-4 px-5 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    answers.mainGoal === goal
                      ? 'border-[#0B2F20] bg-white ring-2 ring-[#0B2F20]/15 text-[#0B2F20] font-bold shadow-md'
                      : 'border-[#D8CEB7] bg-white/70 text-[#253D2C] hover:bg-white hover:border-[#0B2F20]/50 shadow-xs'
                  }`}
                >
                  <span>{goal}</span>
                  {answers.mainGoal === goal && <Check className="w-4 h-4 text-[#0B2F20]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 25: PHOTO UPLOAD (Required Top / Crown Photo)
            ============================================================ */}
        {step === 25 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#0B2F20] text-[#C9A84E] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 text-[#C9A84E]" />
                <span>Mandatory Scalp Assessment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Upload Your Top / Crown Hair Photo
              </h2>
              <p className="text-xs sm:text-sm text-[#556D5D]">
                Take a clear photo from above showing the scalp, crown and surrounding hair.
              </p>
            </div>

            {/* Photo Requirements List */}
            <div className="bg-[#FAF7F0] border border-[#E3D8C3] rounded-2xl p-4 sm:p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B2F20] mb-2.5 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#C9A84E]" />
                Photo Requirements for Accurate Formulation:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4F6757]">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#0B2F20] shrink-0" />
                  <span>Good natural lighting (avoid harsh shadows)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#0B2F20] shrink-0" />
                  <span>No beauty or smoothing filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#0B2F20] shrink-0" />
                  <span>Hair should not be wet</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#0B2F20] shrink-0" />
                  <span>Avoid applying oil immediately before photo</span>
                </li>
                <li className="flex items-center gap-2 sm:col-span-2">
                  <Check className="w-3.5 h-3.5 text-[#0B2F20] shrink-0" />
                  <span>Scalp/crown area should be clearly visible from an overhead angle</span>
                </li>
              </ul>
            </div>

            {/* Privacy Disclaimer (Part 8) */}
            <div className="bg-[#EAE2CE]/70 border border-[#D5C7A8] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#3E5546]">
              <ShieldCheck className="w-4 h-4 text-[#0B2F20] shrink-0 mt-0.5" />
              <span>
                Your photo is used only to generate your HAKKIVEDA hair-care profile and is not used for medical diagnosis.
              </span>
            </div>

            {/* Main Upload Box */}
            <div className="bg-white border-2 border-dashed border-[#D8CEB7] hover:border-[#0B2F20]/50 transition-colors rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs">
              {isUploadingPhoto ? (
                <div className="flex flex-col items-center justify-center space-y-3 py-8 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-[#0B2F20] flex items-center justify-center shadow-md">
                    <Loader2 className="w-7 h-7 text-[#C9A84E] animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#0B2F20]">Analyzing Scalp & Follicular Density…</p>
                    <p className="text-xs text-[#627768]">Evaluating crown density and scalp visibility</p>
                  </div>
                </div>
              ) : answers.photos.topCrown ? (
                <div className="w-full flex flex-col items-center space-y-5 animate-fadeIn">
                  <div className="relative group">
                    <img
                      src={answers.photos.topCrown}
                      alt="Top Crown Photo Preview"
                      className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl border-2 border-[#C9A84E] shadow-md"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={handleRemoveTopCrownPhoto}
                        className="p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Assessment Feedback */}
                  {answers.visualAssessment?.imageQualityStatus === 'IMAGE_QUALITY_INSUFFICIENT' ? (
                    <div className="w-full max-w-lg bg-[#FAF0ED] border border-[#F2C2B8] text-[#8C2C1D] p-4 rounded-xl text-left space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        <AlertCircle className="w-4 h-4 text-[#8C2C1D] shrink-0" />
                        <span>Image Quality Insufficient</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#752417]">
                        The photo appears too blurry or dark to assess clearly. Please take or upload a clearer photo showing your top/crown area under good natural lighting to continue.
                      </p>
                    </div>
                  ) : answers.visualAssessment ? (
                    <div className="w-full max-w-lg bg-[#FAF7F0] border border-[#E1D6C2] rounded-2xl p-4 text-left space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E7DFC9] pb-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#144728]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0B2F20]">
                            Visual Assessment Verified
                          </span>
                        </div>
                        {answers.visualAssessment.confidence > 0 && (
                          <span className="text-[11px] font-bold text-[#C9A84E] bg-[#0B2F20] px-2 py-0.5 rounded-full">
                            {answers.visualAssessment.confidence}% Confidence
                          </span>
                        )}
                      </div>

                      {/* Consistency message (Part 6) */}
                      {answers.visualAssessment.comparisonNote && (
                        <div className="text-xs text-[#2A4332] bg-white/80 p-2.5 rounded-lg border border-[#E7DFC9]">
                          {answers.visualAssessment.comparisonNote}
                        </div>
                      )}

                      {/* Observations */}
                      {answers.visualAssessment.observations && answers.visualAssessment.observations.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#728878] block">
                            Visible Characteristics:
                          </span>
                          <ul className="space-y-1 text-xs text-[#445E4C]">
                            {answers.visualAssessment.observations.slice(0, 2).map((obs, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2F20] mt-1.5 shrink-0" />
                                <span>{obs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Replace Photo Button */}
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-[#EAE2CE] hover:bg-[#DDD3BD] text-[#0B2F20] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-xs">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/*"
                      capture="environment"
                      onChange={handleTopCrownPhotoUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replace Photo</span>
                  </label>
                </div>
              ) : (
                <label className="w-full flex flex-col items-center justify-center cursor-pointer py-6 group">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/*"
                    capture="environment"
                    onChange={handleTopCrownPhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-full bg-[#EAE2CE] group-hover:bg-[#0B2F20] group-hover:text-[#C9A84E] text-[#0B2F20] transition-colors flex items-center justify-center mb-3 shadow-xs">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-base font-bold text-[#0B2F20] group-hover:text-[#174B32] transition-colors">
                    Take or Upload Top / Crown Photo
                  </span>
                  <p className="text-xs text-[#63796A] mt-1 max-w-xs">
                    JPG, PNG, or WebP up to 15MB. Please ensure natural overhead lighting.
                  </p>
                  <span className="mt-4 text-xs font-bold text-[#FAF8F2] bg-[#0B2F20] group-hover:bg-[#164E34] px-6 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-md">
                    TAKE OR UPLOAD PHOTO
                  </span>
                </label>
              )}
            </div>

            {/* Inline Error Notice if upload failed */}
            {photoUploadError && (
              <div className="p-3.5 bg-[#FAF0ED] border border-[#F2C2B8] text-[#8C2C1D] rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{photoUploadError}</span>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            STEP 26: REVIEW & CONSENT
            ============================================================ */}
        {step === 26 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Summary Review</span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                Review Your Consultation Details
              </h2>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs">
              <div className="p-3 bg-[#FAF7F0] rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E7565] block">Name</span>
                <span className="text-base font-bold text-[#0B2F20] mt-0.5 block">{answers.name}</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E7565] block">Main Concern</span>
                <span className="text-base font-bold text-[#0B2F20] mt-0.5 block">{answers.mainConcern}</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E7565] block">Hair Stage</span>
                <span className="text-sm font-semibold text-[#0B2F20] mt-0.5 block">
                  {answers.hairStage || answers.hairLossPattern || 'Stage 1'}
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E7565] block">Scalp Condition</span>
                <span className="text-sm font-semibold text-[#0B2F20] mt-0.5 block">
                  {answers.scalpConditions.join(', ') || 'Balanced'}
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E7565] block">Top / Crown Photo</span>
                <span className="text-sm font-semibold text-[#144728] mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#144728]" /> Photo Uploaded & Verified
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E7565] block">Hair-Loss Duration</span>
                <span className="text-sm font-semibold text-[#0B2F20] mt-0.5 block">{answers.duration || 'Not specified'}</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E7565] block">Desired Goal</span>
                <span className="text-sm font-bold text-[#0B2F20] mt-0.5 block">{answers.mainGoal || 'Root strength & reduced hair fall'}</span>
              </div>
            </div>

            {/* Consent Checkbox & Privacy */}
            <div className="bg-[#EFE8D6]/70 border border-[#DACDAE] rounded-2xl p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers.consent}
                  onChange={(e) => setAnswers({ ...answers, consent: e.target.checked })}
                  className="w-5 h-5 rounded mt-0.5 accent-[#0B2F20] cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-[#243B2A] leading-relaxed">
                  I agree to HAKKIVEDA using my submitted information to generate my personalized hair-care profile and contact me regarding relevant products or support.
                </span>
              </label>

              <div className="text-[11px] text-[#556D5D] pl-8">
                Read our{' '}
                <a href="/privacy-policy" target="_blank" className="underline font-bold text-[#0B2F20] hover:text-[#C9A84E]">
                  Privacy Policy
                </a>. Your personal details are never rented or sold to external third parties.
              </div>
            </div>

            {/* Final CTA button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!isStepValid()}
                onClick={() => {
                  playSound('form_submit');
                  setStep(27); // Trigger analyzing animation
                }}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm sm:text-base flex items-center justify-center gap-3 transition-all cursor-pointer ${
                  isStepValid()
                    ? 'bg-[#0B2F20] text-[#FAF8F2] hover:bg-[#144930] shadow-lg hover:shadow-xl'
                    : 'bg-[#D3C7AB] text-[#867B63] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#C9A84E]" />
                <span>Analyze My Hair Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            CONTINUE BUTTON BAR (For steps 1-25)
            ============================================================ */}
        {step >= 1 && step <= 25 && (
          <div className="pt-6 sm:pt-8 border-t border-[#E7DFC9] mt-6 space-y-3">
            {step === 25 && !isStepValid() && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C2C1D] bg-[#FAF0ED] border border-[#F2C2B8] p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#8C2C1D]" />
                <span>Please upload a clear top/crown photo to continue.</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playSound('nav_click');
                  setStep((prev) => Math.max(0, prev - 1));
                }}
                className="text-xs sm:text-sm font-semibold text-[#576E5F] hover:text-[#0B2F20] flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                disabled={!isStepValid() || (step === 25 && isUploadingPhoto)}
                onClick={() => {
                  playSound('nav_click');
                  setStep((prev) => prev + 1);
                }}
                className={`py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  isStepValid() && !(step === 25 && isUploadingPhoto)
                    ? 'bg-[#0B2F20] text-[#FAF8F2] hover:bg-[#154E34] shadow-md hover:shadow-lg'
                    : 'bg-[#D8CDAF] text-[#8E8367] cursor-not-allowed opacity-70'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 27: ANIMATED ANALYSIS SCREEN
            ============================================================ */}
        {step === 27 && (
          <div className="py-16 text-center space-y-8 animate-fadeIn">
            {/* Pulsing botanical circle */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#0B2F20]/10 animate-ping" />
              <div className="w-24 h-24 rounded-full bg-[#0B2F20] text-[#C9A84E] border-2 border-[#C9A84E] flex items-center justify-center shadow-xl relative z-10 animate-pulse">
                <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C9A84E] bg-[#0B2F20] px-3.5 py-1 rounded-full">
                Tribal Formulation Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0B2F20] transition-all min-h-[56px] flex items-center justify-center">
                {rotatingStatuses[analyzingStatusIdx]}
              </h3>
              <p className="text-xs text-[#5C7162]">
                Synthesizing Hakki-Pikki botanical wisdom and lifestyle data…
              </p>
            </div>
          </div>
        )}

        {/* ============================================================
            STEP 28: RESULT PAGE
            ============================================================ */}
        {step === 28 && result && (
          <div className="space-y-10 animate-fadeIn pb-16">
            {/* Header / Intro */}
            <div className="text-center space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 bg-[#EAE2CE] border border-[#D5C7A8] px-4 py-1 rounded-full text-[#0B2F20] text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-[#C9A84E]" />
                <span>Personalized Consultation Result</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0B2F20] leading-tight">
                Your HAKKIVEDA Hair Profile
              </h1>
              <p className="text-sm sm:text-base text-[#4C6454] max-w-xl mx-auto">
                Prepared especially for <strong className="text-[#0B2F20] font-bold">{answers.name}</strong> based on your hair roots, scalp terrain, and daily lifestyle markers.
              </p>
            </div>

            {/* ============================================================
                PART 7: VISUAL HAIR ASSESSMENT (Photo-Based)
                ============================================================ */}
            {result.visualAssessment && (
              <div className="bg-white border-2 border-[#C9A84E]/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DFC9] pb-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-[#0B2F20] text-[#C9A84E] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Camera className="w-3.5 h-3.5 text-[#C9A84E]" />
                      <span>Visual Hair Assessment</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0B2F20]">
                      Photo-Supported Scalp & Density Analysis
                    </h3>
                    <p className="text-xs sm:text-sm text-[#556D5D]">
                      Evaluated from your top/crown photo to fine-tune your personalized herbal ritual.
                    </p>
                  </div>

                  {result.visualAssessment.confidence > 0 && (
                    <div className="flex items-center gap-2.5 bg-[#FAF7F0] border border-[#D8CEB7] px-4 py-2.5 rounded-xl shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#0B2F20]" />
                      <div className="text-left">
                        <span className="text-[10px] uppercase font-bold text-[#728878] block">Image Confidence</span>
                        <span className="text-sm font-bold text-[#0B2F20]">{result.visualAssessment.confidence}% Match</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comparison Note (Part 6) */}
                {result.stageComparison && (
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                      result.stageComparison.includes('different')
                        ? 'bg-[#FAF3E0] border-[#E8D19F] text-[#694A0E]'
                        : 'bg-[#EBF3ED] border-[#B9D8C1] text-[#144728]'
                    }`}
                  >
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm font-medium leading-relaxed">
                      {result.stageComparison}
                    </div>
                  </div>
                )}

                {/* Visual Assessment Grid: Photo + Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Photo Preview Column */}
                  {answers.photos?.topCrown && (
                    <div className="md:col-span-4 flex flex-col items-center">
                      <div className="relative rounded-2xl overflow-hidden border-2 border-[#C9A84E]/60 shadow-md w-full max-w-[220px] aspect-square bg-[#FAF7F0]">
                        <img
                          src={answers.photos.topCrown}
                          alt="Top Crown Hair Analysis"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 text-center">
                          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                            Analyzed Crown Photo
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual Parameters Column */}
                  <div className={`space-y-3 ${answers.photos?.topCrown ? 'md:col-span-8' : 'md:col-span-12'}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Visible Scalp Exposure */}
                      <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E7DFC9]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#728878] block">
                          Scalp Visibility
                        </span>
                        <span className="text-sm font-bold text-[#0B2F20] mt-0.5 block capitalize">
                          {result.visualAssessment.scalpVisibility.toLowerCase()}
                        </span>
                      </div>

                      {/* Crown Density Appearance */}
                      <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E7DFC9]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#728878] block">
                          Crown Density
                        </span>
                        <span className="text-sm font-bold text-[#0B2F20] mt-0.5 block capitalize">
                          {result.visualAssessment.crownDensityAppearance.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>

                      {/* Thinning Pattern */}
                      <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E7DFC9]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#728878] block">
                          Thinning Pattern
                        </span>
                        <span className="text-sm font-bold text-[#0B2F20] mt-0.5 block capitalize">
                          {result.visualAssessment.thinningPattern.toLowerCase()}
                        </span>
                      </div>

                      {/* Selected Stage */}
                      <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E7DFC9]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#728878] block">
                          Selected Stage
                        </span>
                        <span className="text-sm font-bold text-[#0B2F20] mt-0.5 block">
                          {result.selectedStage || 'Stage 1'}
                        </span>
                      </div>

                      {/* Photo-Supported Stage */}
                      <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E7DFC9]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#728878] block">
                          Photo-Supported Stage
                        </span>
                        <span className="text-sm font-bold text-[#0B2F20] mt-0.5 block">
                          {result.photoSupportedStage || result.selectedStage || 'Stage 1'}
                        </span>
                      </div>

                      {/* Visible Flaking */}
                      <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E7DFC9]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#728878] block">
                          Visible Flaking
                        </span>
                        <span className="text-sm font-bold text-[#0B2F20] mt-0.5 block capitalize">
                          {result.visualAssessment.visibleFlaking.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    {/* Observational bullets */}
                    {result.visualAssessment.observations && result.visualAssessment.observations.length > 0 && (
                      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E7DFC9] space-y-2 mt-2">
                        <span className="text-xs font-bold text-[#0B2F20] block">
                          Photo Assessment Observations:
                        </span>
                        <ul className="space-y-1.5">
                          {result.visualAssessment.observations.map((obs, idx) => (
                            <li key={idx} className="text-xs text-[#445E4C] flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2F20] mt-1.5 shrink-0" />
                              <span>{obs}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[#6A7E70] italic text-center border-t border-[#E7DFC9] pt-3">
                  Disclaimer: This visual assessment is for cosmetic hair-care formulation and botanical guidance only. A clinician should assess sudden or severe hair loss.
                </div>
              </div>
            )}

            {/* CORE ASSESSMENT PROFILE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Card 1: Main Concern */}
              <div className="bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#728878] block">Main Concern</span>
                  <h4 className="text-lg font-bold text-[#0B2F20] mt-1">{result.mainConcern}</h4>
                </div>
                <div className="mt-3 text-xs text-[#526B5B] bg-[#FAF7F0] p-2 rounded-lg">
                  Reported pattern: <span className="font-semibold text-[#0B2F20]">{answers.hairLossPattern || 'Standard'}</span>
                </div>
              </div>

              {/* Card 2: Scalp Profile */}
              <div className="bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#728878] block">Scalp Profile</span>
                  <h4 className="text-lg font-bold text-[#0B2F20] mt-1">{result.scalpProfile}</h4>
                </div>
                <div className="mt-3 text-xs text-[#526B5B] bg-[#FAF7F0] p-2 rounded-lg">
                  Ayurvedic tendency: <span className="font-semibold text-[#0B2F20]">{result.doshaType}</span>
                </div>
              </div>

              {/* Card 3: Hair Fall Level */}
              <div className="bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#728878] block">Hair Fall Level</span>
                  <h4 className="text-lg font-bold text-[#0B2F20] mt-1">{result.hairFallLevel}</h4>
                </div>
                <div className="mt-3 text-xs text-[#526B5B] bg-[#FAF7F0] p-2 rounded-lg">
                  Duration: <span className="font-semibold text-[#0B2F20]">{answers.duration || 'Under 6 months'}</span>
                </div>
              </div>

              {/* Card 4: Lifestyle Factors */}
              <div className="bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#728878] block">Lifestyle Factors</span>
                  <div className="mt-2 space-y-1">
                    {result.lifestyleFactors.length > 0 ? (
                      result.lifestyleFactors.map((fact, idx) => (
                        <div key={idx} className="text-xs font-semibold text-[#0B2F20] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84E]" />
                          <span>{fact}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-[#526B5B]">Balanced daily routine</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 5: Family History */}
              <div className="bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#728878] block">Family History</span>
                  <h4 className="text-lg font-bold text-[#0B2F20] mt-1">{result.familyHistory}</h4>
                </div>
                <p className="text-xs text-[#526B5B] mt-2 leading-relaxed">
                  Genetic tendencies can be supported with proactive topical root conditioning.
                </p>
              </div>

              {/* Card 6: Hair Goal */}
              <div className="bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#728878] block">Hair Goal</span>
                  <h4 className="text-lg font-bold text-[#0B2F20] mt-1">{result.hairGoal}</h4>
                </div>
                <div className="mt-3 text-xs text-[#C9A84E] bg-[#0B2F20] font-bold px-2.5 py-1 rounded-md inline-block">
                  Targeted Regimen
                </div>
              </div>
            </div>

            {/* PERSONALIZED BOTANICAL INSIGHTS */}
            <div className="bg-[#EFE8D6]/60 border border-[#D8CEB7] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C9A84E]" />
                <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#0B2F20]">
                  Personalized Botanical Insights
                </h3>
              </div>
              <div className="space-y-3">
                {result.insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#273E2E] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#0B2F20] shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* YOUR SUGGESTED HAKKIVEDA RITUAL */}
            <div className="space-y-6">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Traditional 4-Step Regimen</span>
                <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                  Your Suggested HAKKIVEDA Ritual
                </h3>
                <p className="text-xs sm:text-sm text-[#556D5D]">
                  Handcrafted from Mysore tribal heritage over 21 solar cycles to revive follicle health naturally.
                </p>
              </div>

              {/* Ritual 4 Steps Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {result.ritualSteps.map((stepItem) => (
                  <div
                    key={stepItem.stepNumber}
                    className="bg-white border border-[#D8CEB7] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-[#0B2F20] text-[#C9A84E] text-xs font-bold flex items-center justify-center">
                          {stepItem.stepNumber}
                        </span>
                        <span className="text-[10px] font-bold text-[#556D5D] bg-[#FAF7F0] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {stepItem.frequency}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#0B2F20] pt-1">{stepItem.title}</h4>
                      <p className="text-xs text-[#C9A84E] font-bold">{stepItem.subtitle}</p>
                      <p className="text-xs text-[#526B5B] leading-relaxed pt-1">{stepItem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOMMENDED STORE PRODUCTS */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84E]">Curated Products</span>
                  <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0B2F20]">
                    Formulated For Your Hair Profile
                  </h3>
                </div>

                {result.recommendedProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddAllToCart}
                    className={`py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      allAdded
                        ? 'bg-[#154E34] text-white'
                        : 'bg-[#0B2F20] text-[#FAF8F2] hover:bg-[#154E34] shadow-md hover:shadow-lg'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C9A84E]" />
                    <span>{allAdded ? 'Routine Added to Cart!' : 'Add Recommended Routine to Cart'}</span>
                  </button>
                )}
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {result.recommendedProducts.map((prod) => {
                  const isAdded = addedProductIds.includes(prod.id) || allAdded;
                  const fullProduct = products.find((p) => p.id === prod.id);

                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-[#D8CEB7] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Product Image & Tag */}
                        <div className="relative h-48 sm:h-52 bg-[#0B2F20]/5 overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              e.currentTarget.src = '/images/hakkiveda_108_oil_gold.jpg';
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 bg-[#0B2F20] text-[#C9A84E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {prod.ritualRole}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-2.5">
                          <h4 className="text-base font-bold text-[#0B2F20] leading-snug line-clamp-2">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-[#526B5B] leading-relaxed line-clamp-3">
                            {prod.reason}
                          </p>

                          {/* Pricing */}
                          <div className="pt-2 flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#0B2F20]">
                              {formatPrice(prod.priceINR)}
                            </span>
                            {prod.originalPriceINR && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(prod.originalPriceINR)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                        {fullProduct && (
                          <a
                            href={getProductUrl(fullProduct)}
                            onClick={(e) => {
                              if (onNavigateProduct) {
                                e.preventDefault();
                                onNavigateProduct(getProductUrl(fullProduct));
                              }
                            }}
                            className="py-2.5 px-3 rounded-xl border border-[#0B2F20] text-[#0B2F20] hover:bg-[#FAF7F0] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>View Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddSingleProduct(prod.id)}
                          className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#0B2F20] text-[#FAF8F2] hover:bg-[#154E34]'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C9A84E]" />
                          <span>{isAdded ? 'In Cart' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM RETAKE & SUPPORT ACTIONS */}
            <div className="pt-6 border-t border-[#E7DFC9] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleRetake}
                className="text-xs sm:text-sm font-semibold text-[#5A7061] hover:text-[#0B2F20] flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg border border-[#D8CEB7] bg-white"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Analysis
              </button>

              <div className="flex items-center gap-2 text-xs text-[#556D5D]">
                <HeartHandshake className="w-4 h-4 text-[#C9A84E]" />
                <span>Need personal guidance? Contact our WhatsApp hair advisors.</span>
              </div>
            </div>

            {/* MANDATORY SAFETY & COMPLIANCE DISCLAIMER */}
            <div className="bg-[#FAF7F0] border border-[#E7DFC9] rounded-2xl p-5 text-center text-xs text-[#5A7061] leading-relaxed max-w-2xl mx-auto space-y-1">
              <p className="font-semibold text-[#0B2F20]">Important Wellness Notice</p>
              <p>
                “Your HAKKIVEDA Hair Profile is a wellness-oriented assessment based on the information you provided. It is not a medical diagnosis. For sudden, severe, patchy or unexplained hair loss, consult a qualified healthcare professional.”
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
