export type ScalpVisibilityLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type CrownDensityLevel = 'GOOD' | 'MILD_REDUCTION' | 'MODERATE_REDUCTION' | 'SIGNIFICANT_REDUCTION';
export type ThinningPatternType = 'NONE' | 'FRONTAL' | 'CROWN' | 'DIFFUSE' | 'PATCHY' | 'MIXED';
export type VisibleFlakingLevel = 'NONE' | 'MILD' | 'MODERATE' | 'SIGNIFICANT';
export type VisibleRednessLevel = 'NONE' | 'MILD' | 'MODERATE';

export interface VisualAssessment {
  scalpVisibility: ScalpVisibilityLevel;
  crownDensityAppearance: CrownDensityLevel;
  thinningPattern: ThinningPatternType;
  visibleFlaking: VisibleFlakingLevel;
  visibleRedness: VisibleRednessLevel;
  confidence: number;
  observations: string[];
  suggestedStage?: string;
  imageQualityStatus: 'OK' | 'IMAGE_QUALITY_INSUFFICIENT';
  analysisStatus?: 'OK' | 'IMAGE_QUALITY_INSUFFICIENT' | 'FAILED';
  comparisonNote?: string;
}

export interface HairAnalysisAnswers {
  name: string;
  countryCode: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Prefer not to say' | '';
  ageGroup: string;
  country: string;
  city: string;
  mainConcern: string;
  hairLossPattern: string;
  hairStage?: string;
  duration: string;
  severity: string;
  scalpConditions: string[];
  hairQualities: string[];
  familyHistory: string;
  stressLevel: string;
  sleepHours: string;
  exerciseFrequency: string;
  dietType: string;
  proteinIntake: string;
  digestionIssues: string[];
  healthBackground: string[];
  washFrequency: string;
  oilingFrequency: string;
  treatments: string[];
  currentProducts: string[];
  mainGoal: string;
  photos: {
    frontHairline?: string;
    topCrown?: string;
    sideView?: string;
  };
  visualAssessment?: VisualAssessment;
  consent: boolean;
}

export interface RitualStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  frequency: string;
}

export interface RecommendedProductItem {
  id: string;
  name: string;
  category: string;
  image: string;
  priceINR: number;
  originalPriceINR?: number;
  reason: string;
  ritualRole: string;
}

export interface HairProfileResult {
  mainConcern: string;
  scalpProfile: string;
  hairFallLevel: string;
  lifestyleFactors: string[];
  familyHistory: string;
  hairGoal: string;
  insights: string[];
  doshaType: string;
  ritualSteps: RitualStep[];
  recommendedProductIds: string[];
  recommendedProducts: RecommendedProductItem[];
  visualAssessment?: VisualAssessment;
  selectedStage?: string;
  photoSupportedStage?: string;
  stageComparison?: string;
}

export interface HairAnalysisLead {
  id: string;
  createdAt: string;
  name: string;
  mobile: string;
  countryCode: string;
  gender: string;
  ageGroup: string;
  country: string;
  city: string;
  allAnswers: HairAnalysisAnswers;
  photoReferences?: {
    frontHairline?: string;
    topCrown?: string;
    sideView?: string;
  };
  visualAssessment?: VisualAssessment;
  generatedProfile: HairProfileResult;
  recommendedProductIds: string[];
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
}

