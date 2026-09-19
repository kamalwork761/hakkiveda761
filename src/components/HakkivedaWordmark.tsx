import React, { useState, useEffect, useRef } from 'react';

interface HakkivedaWordmarkProps {
  className?: string;
  size?: 'mobile' | 'sm' | 'md' | 'lg';
  theme?: 'dark-header' | 'light-footer';
  animate?: boolean;
}

const FULL_WORD = 'HAKKIVEDA';
const HAKKI_LEN = 5; // 'HAKKI' (5 letters) + 'VEDA' (4 letters)

export const HakkivedaWordmark: React.FC<HakkivedaWordmarkProps> = ({
  className = '',
  size = 'md',
  theme = 'dark-header',
  animate = true,
}) => {
  // Check for prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  // Character count during typewriter phase (1..9)
  const [charCount, setCharCount] = useState<number>(shouldAnimate ? 1 : 9);
  // Animation phase: 'typing' | 'spacing' | 'motion3d' | 'static'
  const [phase, setPhase] = useState<'typing' | 'spacing' | 'motion3d' | 'static'>(
    shouldAnimate ? 'typing' : 'static'
  );

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      setCharCount(9);
      setPhase('static');
      return;
    }

    const clearAllTimers = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };

    const runCycle = () => {
      clearAllTimers();

      // 1. TYPEWRITER: ~1.6s across 9 characters (200ms per step)
      setPhase('typing');
      setCharCount(1); // 'H'

      for (let i = 2; i <= 9; i++) {
        timeoutsRef.current.push(
          setTimeout(() => {
            setCharCount(i);
          }, (i - 1) * 200)
        );
      }

      // 2. LETTER SPACING EFFECT: ~1.0s (1800ms -> 2800ms)
      // Gently increases letter spacing, then smoothly brings letters back together
      timeoutsRef.current.push(
        setTimeout(() => {
          setPhase('spacing');
        }, 1800)
      );

      // 3. SUBTLE 3D WORD MOVEMENT: ~1.0s (2800ms -> 3800ms)
      // Slight rotation left, slight rotation right, return to normal
      timeoutsRef.current.push(
        setTimeout(() => {
          setPhase('motion3d');
        }, 2800)
      );

      // 4. REMAIN STATIC AFTERWARD: (3800ms -> 10000ms)
      timeoutsRef.current.push(
        setTimeout(() => {
          setPhase('static');
        }, 3800)
      );
    };

    runCycle();
    intervalRef.current = setInterval(runCycle, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearAllTimers();
    };
  }, [shouldAnimate]);

  // Derived typed string partition
  const currentText = FULL_WORD.slice(0, charCount);
  const hakkiPart = currentText.slice(0, HAKKI_LEN);
  const vedaPart = currentText.slice(HAKKI_LEN);

  // Responsive font sizes matching HAKKIVEDA design tokens
  const sizeClasses: Record<string, string> = {
    mobile: 'text-[17px] xs:text-[18.5px] sm:text-[20px]',
    sm: 'text-[16px] sm:text-[18px]',
    md: 'text-[22px] sm:text-[24px] lg:text-[25px]',
    lg: 'text-[28px] sm:text-[32px]',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  // Active animation class
  let phaseClass = '';
  if (phase === 'spacing') {
    phaseClass = 'hv-wordmark-spacing';
  } else if (phase === 'motion3d') {
    phaseClass = 'hv-wordmark-3d';
  }

  return (
    <span
      className={`hv-wordmark-container relative inline-flex items-center select-none font-bold uppercase ${currentSizeClass} ${className}`}
      style={{
        fontFamily: "'Cinzel', 'Cormorant Garamond', 'Playfair Display', Georgia, serif",
        perspective: '700px',
        lineHeight: 1,
      }}
      aria-label="HAKKIVEDA"
      role="img"
    >
      {/* INVISIBLE SKELETON:
          Guarantees 0px layout shift, 0px navigation movement, and 0px header height change
          by permanently occupying the exact width and height of the full word 'HAKKIVEDA' */}
      <span
        aria-hidden="true"
        className="invisible pointer-events-none select-none leading-none tracking-[0.08em]"
      >
        HAKKIVEDA
      </span>

      {/* VISIBLE ANIMATED CONTENT:
          Anchored inside the reserved bounds.
          HAKKI = Forest Green (#0F2E22)
          VEDA = Muted Gold (#C5A059) */}
      <span
        className={`hv-wordmark-inner absolute left-0 top-0 bottom-0 flex items-center font-bold uppercase whitespace-nowrap leading-none ${phaseClass}`}
        style={{
          fontFamily: "'Cinzel', 'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          letterSpacing: '0.08em',
          transformStyle: 'preserve-3d',
          willChange: 'transform, letter-spacing',
        }}
      >
        <span className="text-[#0F2E22] drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] transition-colors">
          {hakkiPart}
        </span>
        <span className="text-[#C5A059] drop-shadow-[0_1px_1px_rgba(197,160,89,0.15)] transition-colors">
          {vedaPart}
        </span>
      </span>

      <style>{`
        /* LETTER SPACING EFFECT: ~1.0s */
        @keyframes hvWordmarkSpacingKeyframes {
          0% {
            letter-spacing: 0.08em;
          }
          50% {
            letter-spacing: 0.20em;
          }
          100% {
            letter-spacing: 0.08em;
          }
        }

        /* SUBTLE 3D WORD MOVEMENT: ~1.0s */
        @keyframes hvWordmark3dKeyframes {
          0% {
            transform: perspective(700px) rotateY(0deg) rotateX(0deg);
          }
          30% {
            transform: perspective(700px) rotateY(-7.5deg) rotateX(2deg);
          }
          70% {
            transform: perspective(700px) rotateY(7.5deg) rotateX(-2deg);
          }
          100% {
            transform: perspective(700px) rotateY(0deg) rotateX(0deg);
          }
        }

        .hv-wordmark-spacing {
          animation: hvWordmarkSpacingKeyframes 1000ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .hv-wordmark-3d {
          animation: hvWordmark3dKeyframes 1000ms cubic-bezier(0.35, 0, 0.25, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .hv-wordmark-spacing,
          .hv-wordmark-3d {
            animation: none !important;
            transform: none !important;
            letter-spacing: 0.08em !important;
          }
        }
      `}</style>
    </span>
  );
};
