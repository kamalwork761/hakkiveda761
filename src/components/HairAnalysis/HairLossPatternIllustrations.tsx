import React from 'react';

export interface HairStageItem {
  id: string; // e.g. 'STAGE_1'
  stageNumber: number | null; // 1..6 or null for NOT SURE
  badge: string; // 'STAGE 1'
  title: string;
  description: string;
}

export const HAKKIVEDA_HAIR_STAGES: HairStageItem[] = [
  {
    id: 'STAGE_1',
    stageNumber: 1,
    badge: 'STAGE 1',
    title: 'Minimal visible thinning',
    description: 'Hairline and crown mostly appear full.',
  },
  {
    id: 'STAGE_2',
    stageNumber: 2,
    badge: 'STAGE 2',
    title: 'Early thinning',
    description: 'Slight reduction in density or mild hairline recession.',
  },
  {
    id: 'STAGE_3',
    stageNumber: 3,
    badge: 'STAGE 3',
    title: 'Noticeable thinning',
    description: 'Visible thinning around crown, hairline or both.',
  },
  {
    id: 'STAGE_4',
    stageNumber: 4,
    badge: 'STAGE 4',
    title: 'Advanced thinning',
    description: 'Larger visible scalp area with reduced hair density.',
  },
  {
    id: 'STAGE_5',
    stageNumber: 5,
    badge: 'STAGE 5',
    title: 'Extensive thinning',
    description: 'Significant visible thinning across crown/top region.',
  },
  {
    id: 'STAGE_6',
    stageNumber: 6,
    badge: 'STAGE 6',
    title: 'Severe top-area hair loss',
    description: 'Major reduction of hair coverage across the upper scalp.',
  },
  {
    id: 'NOT_SURE',
    stageNumber: null,
    badge: 'NOT SURE',
    title: 'Not Sure',
    description: 'Uncertain? We will assess your stage from your top/crown photo.',
  },
];

interface ScalpStageIllustrationProps {
  stage: string | number; // 'STAGE_1' | 'Stage 1' | 1 | 'NOT_SURE'
  gender?: string;
  className?: string;
}

export const ScalpStageIllustration: React.FC<ScalpStageIllustrationProps> = ({
  stage,
  className = 'w-24 h-24',
}) => {
  // Normalize stage string
  const normalized = String(stage).toUpperCase();

  // STAGE 1: Minimal visible thinning (full, dense hair)
  if (normalized.includes('1') || normalized.includes('MINIMAL')) {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head silhouette base */}
        <ellipse cx="60" cy="62" rx="42" ry="48" fill="#F4EFE3" stroke="#0B2F20" strokeWidth="2.5" />
        {/* Nose indicator at top */}
        <path d="M 57 14 C 60 10 63 10 63 14" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        {/* Ears */}
        <path d="M 17 56 C 14 59 14 67 18 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        <path d="M 103 56 C 106 59 106 67 102 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />

        {/* Full thick hair fill */}
        <path
          d="M 22 62 C 22 36 34 26 60 26 C 86 26 98 36 98 62 C 98 94 86 106 60 106 C 34 106 22 94 22 62 Z"
          fill="#0B2F20"
        />
        {/* Natural dense hairline */}
        <path
          d="M 28 46 C 36 34 46 36 60 36 C 74 36 84 34 92 46"
          stroke="#C9A84E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Dense hair texture strokes */}
        <path d="M 38 48 Q 60 42 82 48" stroke="#1D4A34" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 34 60 Q 60 52 86 60" stroke="#1D4A34" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 36 74 Q 60 66 84 74" stroke="#1D4A34" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 42 88 Q 60 82 78 88" stroke="#1D4A34" strokeWidth="1.5" strokeLinecap="round" />

        {/* Muted gold botanical vitality sparkle */}
        <circle cx="60" cy="58" r="2.5" fill="#C9A84E" />
        <path d="M 60 51 L 60 65 M 53 58 L 67 58" stroke="#C9A84E" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  // STAGE 2: Early thinning (slight reduction in density / early hairline retreat)
  if (normalized.includes('2') || normalized.includes('EARLY')) {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head silhouette base */}
        <ellipse cx="60" cy="62" rx="42" ry="48" fill="#F4EFE3" stroke="#0B2F20" strokeWidth="2.5" />
        {/* Nose indicator */}
        <path d="M 57 14 C 60 10 63 10 63 14" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        {/* Ears */}
        <path d="M 17 56 C 14 59 14 67 18 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        <path d="M 103 56 C 106 59 106 67 102 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />

        {/* Hair mass */}
        <path
          d="M 22 62 C 22 36 34 26 60 26 C 86 26 98 36 98 62 C 98 94 86 106 60 106 C 34 106 22 94 22 62 Z"
          fill="#0B2F20"
        />
        {/* Slight M-shape hairline recession */}
        <path
          d="M 28 48 C 34 38 42 42 60 38 C 78 42 86 38 92 48"
          stroke="#C9A84E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Subtle crown swirl with slight scalp visibility */}
        <ellipse cx="60" cy="62" rx="10" ry="12" fill="#E8DEC5" stroke="#C9A84E" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Fine sparse hair wisps in the vortex */}
        <path d="M 56 60 Q 60 56 64 60" stroke="#0B2F20" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 56 65 Q 60 69 64 65" stroke="#0B2F20" strokeWidth="1.2" strokeLinecap="round" />

        {/* Surrounding hair flow lines */}
        <path d="M 36 78 Q 60 74 84 78" stroke="#1D4A34" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // STAGE 3: Noticeable thinning (visible thinning around crown, hairline or both)
  if (normalized.includes('3') || normalized.includes('NOTICEABLE')) {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head silhouette base */}
        <ellipse cx="60" cy="62" rx="42" ry="48" fill="#F4EFE3" stroke="#0B2F20" strokeWidth="2.5" />
        {/* Nose indicator */}
        <path d="M 57 14 C 60 10 63 10 63 14" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        {/* Ears */}
        <path d="M 17 56 C 14 59 14 67 18 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        <path d="M 103 56 C 106 59 106 67 102 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />

        {/* Hair coverage with distinct crown opening */}
        <path
          d="M 22 62 C 22 36 34 26 60 26 C 86 26 98 36 98 62 C 98 94 86 106 60 106 C 34 106 22 94 22 62 Z"
          fill="#0B2F20"
        />
        {/* Deeper frontal temples */}
        <path
          d="M 26 52 C 34 42 44 48 60 42 C 76 48 86 42 94 52"
          stroke="#C9A84E"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Noticeable circular thinning at crown (20-30% area) */}
        <ellipse cx="60" cy="64" rx="16" ry="18" fill="#EFE8D6" stroke="#C9A84E" strokeWidth="2" strokeDasharray="3 3" />
        {/* Sparse micro-strands in thinning zone */}
        <circle cx="56" cy="60" r="1" fill="#0B2F20" />
        <circle cx="64" cy="62" r="1" fill="#0B2F20" />
        <circle cx="59" cy="68" r="1" fill="#0B2F20" />
        <path d="M 55 64 Q 60 61 65 64" stroke="#0B2F20" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  // STAGE 4: Advanced thinning (larger visible scalp area with reduced hair density)
  if (normalized.includes('4') || normalized.includes('ADVANCED')) {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head silhouette base */}
        <ellipse cx="60" cy="62" rx="42" ry="48" fill="#F4EFE3" stroke="#0B2F20" strokeWidth="2.5" />
        {/* Nose indicator */}
        <path d="M 57 14 C 60 10 63 10 63 14" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        {/* Ears */}
        <path d="M 17 56 C 14 59 14 67 18 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        <path d="M 103 56 C 106 59 106 67 102 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />

        {/* Remaining outer hair rim */}
        <path
          d="M 22 62 C 22 36 34 26 60 26 C 86 26 98 36 98 62 C 98 94 86 106 60 106 C 34 106 22 94 22 62 Z"
          fill="#0B2F20"
        />

        {/* Large exposed crown area extending forward */}
        <ellipse cx="60" cy="65" rx="22" ry="24" fill="#F2ECE0" stroke="#C9A84E" strokeWidth="2" strokeDasharray="4 2" />

        {/* Thinning bridge between front and crown */}
        <path d="M 44 48 C 50 44 70 44 76 48" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <path d="M 52 54 Q 60 52 68 54" stroke="#C9A84E" strokeWidth="1.2" strokeLinecap="round" />

        {/* Scalp visibility texture */}
        <circle cx="54" cy="66" r="1.2" fill="#C9A84E" />
        <circle cx="66" cy="66" r="1.2" fill="#C9A84E" />
        <circle cx="60" cy="74" r="1.2" fill="#C9A84E" />
      </svg>
    );
  }

  // STAGE 5: Extensive thinning (significant visible thinning across crown/top region)
  if (normalized.includes('5') || normalized.includes('EXTENSIVE')) {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head silhouette base */}
        <ellipse cx="60" cy="62" rx="42" ry="48" fill="#F4EFE3" stroke="#0B2F20" strokeWidth="2.5" />
        {/* Nose indicator */}
        <path d="M 57 14 C 60 10 63 10 63 14" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        {/* Ears */}
        <path d="M 17 56 C 14 59 14 67 18 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        <path d="M 103 56 C 106 59 106 67 102 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />

        {/* Remaining outer lateral hair band */}
        <path
          d="M 22 62 C 22 36 34 26 60 26 C 86 26 98 36 98 62 C 98 94 86 106 60 106 C 34 106 22 94 22 62 Z"
          fill="#0B2F20"
        />

        {/* Large conjoined top & crown exposed scalp (65-75% scalp visibility) */}
        <path
          d="M 36 48 C 42 36 78 36 84 48 C 88 62 86 82 60 84 C 34 82 32 62 36 48 Z"
          fill="#F7F3E9"
          stroke="#C9A84E"
          strokeWidth="2"
        />

        {/* Few faint miniaturized strands */}
        <path d="M 55 46 Q 60 44 65 46" stroke="#0B2F20" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
        <path d="M 56 64 Q 60 62 64 64" stroke="#0B2F20" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />

        <circle cx="52" cy="56" r="1.5" fill="#C9A84E" fillOpacity="0.6" />
        <circle cx="68" cy="56" r="1.5" fill="#C9A84E" fillOpacity="0.6" />
      </svg>
    );
  }

  // STAGE 6: Severe top-area hair loss (major reduction across upper scalp)
  if (normalized.includes('6') || normalized.includes('SEVERE')) {
    return (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head silhouette base */}
        <ellipse cx="60" cy="62" rx="42" ry="48" fill="#F4EFE3" stroke="#0B2F20" strokeWidth="2.5" />
        {/* Nose indicator */}
        <path d="M 57 14 C 60 10 63 10 63 14" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        {/* Ears */}
        <path d="M 17 56 C 14 59 14 67 18 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
        <path d="M 103 56 C 106 59 106 67 102 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />

        {/* Classical peripheral horseshoe hair rim only */}
        <path
          d="M 22 62 C 22 50 24 40 30 36 C 26 50 28 85 60 98 C 92 85 94 50 90 36 C 96 40 98 50 98 62 C 98 94 86 106 60 106 C 34 106 22 94 22 62 Z"
          fill="#0B2F20"
        />

        {/* Entire upper scalp exposed and smooth */}
        <ellipse cx="60" cy="56" rx="28" ry="32" fill="#FAF7F0" stroke="#C9A84E" strokeWidth="2.2" />

        {/* Perimeter fringe demarcation */}
        <path
          d="M 32 46 C 30 74 42 90 60 90 C 78 90 90 74 88 46"
          stroke="#C9A84E"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Subtle follicle marks at peripheral boundary */}
        <circle cx="42" cy="80" r="1.2" fill="#0B2F20" />
        <circle cx="78" cy="80" r="1.2" fill="#0B2F20" />
        <circle cx="60" cy="86" r="1.2" fill="#0B2F20" />
      </svg>
    );
  }

  // NOT SURE: Visual inquiry badge with head outline & magnifying glass
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head outline */}
      <ellipse cx="60" cy="62" rx="42" ry="48" fill="#F4EFE3" stroke="#0B2F20" strokeWidth="2.5" />
      {/* Nose indicator */}
      <path d="M 57 14 C 60 10 63 10 63 14" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
      {/* Ears */}
      <path d="M 17 56 C 14 59 14 67 18 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />
      <path d="M 103 56 C 106 59 106 67 102 70" stroke="#0B2F20" strokeWidth="2" strokeLinecap="round" />

      {/* Gentle hair framing */}
      <path
        d="M 28 50 C 38 34 50 38 60 38 C 70 38 82 34 92 50"
        stroke="#0B2F20"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Centered Magnifying Glass & Question Mark for AI Photo Confirmation */}
      <circle cx="58" cy="60" r="16" fill="#FFFFFF" stroke="#C9A84E" strokeWidth="2.5" />
      <path d="M 69 71 L 80 82" stroke="#C9A84E" strokeWidth="3" strokeLinecap="round" />
      {/* Question mark inside lens */}
      <path
        d="M 54 55 C 54 50 62 50 62 55 C 62 58 58 59 58 63"
        stroke="#0B2F20"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="58" cy="68" r="1.5" fill="#0B2F20" />
    </svg>
  );
};

// Backward-compatible alias
export const HairLossPatternIllustration = ScalpStageIllustration;
