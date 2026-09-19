import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

type DepthLayer = 'far' | 'mid' | 'near';

interface BotanicalParticleConfig {
  id: number;
  name: string;
  asset: string;
  depth: DepthLayer;
  leftPercent: number;
  durationSec: number;
  delaySec: number;
  driftTrajectory: 'driftLeft' | 'driftRight' | 'driftWave';
  swayName: 'swayA' | 'swayB' | 'swayC';
  swayDurationSec: number;
  rotStartDeg: number;
  opacity: number;
  mobileVisible: boolean;
}

// 13 Highly Curated Deterministic Particles
// Strategic placement:
// - Left Margins / Gutters: 2%, 5%, 8%, 12%, 15%
// - Right Margins / Gutters: 84%, 88%, 91%, 95%, 98%
// - Subtle Desktop Interstitial Lanes: 21%, 79% (subtle far-depth elements only)
// - Central Content (25% - 75%): Completely clear of decorative elements so titles, prices, cards, and CTA buttons remain pristine!
//
// Desktop: 13 particles across 3 depth tiers (Far, Mid, Near)
// Mobile: 4 particles strictly positioned at extreme screen edges (2%, 8%, 92%, 96%)
const PARTICLES: BotanicalParticleConfig[] = [
  // --- LEFT CORRIDOR ---
  {
    id: 1,
    name: 'ayurvedic_herb_cluster',
    asset: '/images/botanical/ayurvedic_herb_cluster.webp',
    depth: 'near',
    leftPercent: 2,
    durationSec: 22,
    delaySec: -8,
    driftTrajectory: 'driftRight',
    swayName: 'swayA',
    swayDurationSec: 5.4,
    rotStartDeg: 12,
    opacity: 0.72,
    mobileVisible: true,
  },
  {
    id: 2,
    name: 'neem_leaf',
    asset: '/images/botanical/neem_leaf.webp',
    depth: 'mid',
    leftPercent: 6,
    durationSec: 26,
    delaySec: -14,
    driftTrajectory: 'driftLeft',
    swayName: 'swayB',
    swayDurationSec: 6.2,
    rotStartDeg: -14,
    opacity: 0.58,
    mobileVisible: false,
  },
  {
    id: 3,
    name: 'tulsi_leaf',
    asset: '/images/botanical/tulsi_leaf.webp',
    depth: 'near',
    leftPercent: 9,
    durationSec: 19,
    delaySec: -4,
    driftTrajectory: 'driftWave',
    swayName: 'swayC',
    swayDurationSec: 4.8,
    rotStartDeg: 8,
    opacity: 0.70,
    mobileVisible: true,
  },
  {
    id: 4,
    name: 'dried_herb_fragment',
    asset: '/images/botanical/dried_herb_fragment.webp',
    depth: 'far',
    leftPercent: 12,
    durationSec: 32,
    delaySec: -20,
    driftTrajectory: 'driftLeft',
    swayName: 'swayA',
    swayDurationSec: 7.0,
    rotStartDeg: -22,
    opacity: 0.38,
    mobileVisible: false,
  },
  {
    id: 5,
    name: 'shikakai_pod',
    asset: '/images/botanical/shikakai_pod.webp',
    depth: 'mid',
    leftPercent: 15,
    durationSec: 24,
    delaySec: -11,
    driftTrajectory: 'driftRight',
    swayName: 'swayB',
    swayDurationSec: 5.6,
    rotStartDeg: 16,
    opacity: 0.62,
    mobileVisible: false,
  },

  // --- SUBTLE DESKTOP INTERSTITIAL LANES (Far Depth, Low Opacity) ---
  {
    id: 6,
    name: 'brahmi_leaf',
    asset: '/images/botanical/brahmi_leaf.webp',
    depth: 'far',
    leftPercent: 21,
    durationSec: 30,
    delaySec: -18,
    driftTrajectory: 'driftWave',
    swayName: 'swayC',
    swayDurationSec: 6.8,
    rotStartDeg: -10,
    opacity: 0.34,
    mobileVisible: false,
  },
  {
    id: 7,
    name: 'golden_herb_petal',
    asset: '/images/botanical/golden_herb_petal.webp',
    depth: 'far',
    leftPercent: 79,
    durationSec: 28,
    delaySec: -12,
    driftTrajectory: 'driftLeft',
    swayName: 'swayA',
    swayDurationSec: 6.0,
    rotStartDeg: 14,
    opacity: 0.36,
    mobileVisible: false,
  },

  // --- RIGHT CORRIDOR ---
  {
    id: 8,
    name: 'curry_leaf',
    asset: '/images/botanical/curry_leaf.webp',
    depth: 'mid',
    leftPercent: 84,
    durationSec: 25,
    delaySec: -16,
    driftTrajectory: 'driftRight',
    swayName: 'swayB',
    swayDurationSec: 5.8,
    rotStartDeg: -16,
    opacity: 0.56,
    mobileVisible: false,
  },
  {
    id: 9,
    name: 'hibiscus_petal',
    asset: '/images/botanical/hibiscus_petal.webp',
    depth: 'near',
    leftPercent: 88,
    durationSec: 21,
    delaySec: -6,
    driftTrajectory: 'driftWave',
    swayName: 'swayC',
    swayDurationSec: 5.0,
    rotStartDeg: 20,
    opacity: 0.68,
    mobileVisible: true,
  },
  {
    id: 10,
    name: 'bhringraj_sprig',
    asset: '/images/botanical/bhringraj_sprig.webp',
    depth: 'near',
    leftPercent: 92,
    durationSec: 20,
    delaySec: -3,
    driftTrajectory: 'driftLeft',
    swayName: 'swayA',
    swayDurationSec: 4.9,
    rotStartDeg: -12,
    opacity: 0.74,
    mobileVisible: true,
  },
  {
    id: 11,
    name: 'amla_sprig',
    asset: '/images/botanical/amla_sprig.webp',
    depth: 'mid',
    leftPercent: 95,
    durationSec: 23,
    delaySec: -9,
    driftTrajectory: 'driftRight',
    swayName: 'swayB',
    swayDurationSec: 5.2,
    rotStartDeg: 10,
    opacity: 0.64,
    mobileVisible: false,
  },
  {
    id: 12,
    name: 'sage_leaf_variant',
    asset: '/images/botanical/sage_leaf_variant.webp',
    depth: 'far',
    leftPercent: 98,
    durationSec: 31,
    delaySec: -22,
    driftTrajectory: 'driftWave',
    swayName: 'swayC',
    swayDurationSec: 6.6,
    rotStartDeg: -18,
    opacity: 0.38,
    mobileVisible: false,
  },
];

export const BotanicalAmbientLayer: React.FC = () => {
  const { isCheckoutOpen, adminAuthenticated } = useStore();

  // Route tracking for section-awareness
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('app:navigate', handleLocationChange);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('app:navigate', handleLocationChange);
      mql.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // 1. Accessibility: Hide moving layer when prefers-reduced-motion is active
  if (prefersReducedMotion) {
    return null;
  }

  // 2. Special Reduction & Disabling Rules:
  // - Admin & login routes
  const isAdminRoute = currentPath.startsWith('/admin') || adminAuthenticated;
  if (isAdminRoute) {
    return null;
  }

  // - Checkout & payment modal / routes
  const isCheckoutArea =
    isCheckoutOpen ||
    currentPath === '/checkout' ||
    currentPath.startsWith('/checkout/') ||
    currentPath === '/payment';
  if (isCheckoutArea) {
    return null;
  }

  // - Hair Analysis form inputs / quiz flow
  const isHairAnalysisArea =
    currentPath === '/hair-analysis' ||
    currentPath === '/hair-quiz' ||
    currentPath === '/root-analysis' ||
    currentPath === '/consultation';
  if (isHairAnalysisArea) {
    return null;
  }

  return (
    <div
      className="botanical-ambient-container fixed inset-0 pointer-events-none overflow-hidden select-none z-[20]"
      aria-hidden="true"
    >
      {PARTICLES.map((particle) => {
        // Size mapping according to depth tier:
        // Desktop:
        // - FAR: 32px – 38px
        // - MID: 48px – 56px
        // - NEAR: 66px – 76px
        // Mobile:
        // - FAR: 24px
        // - MID: 36px
        // - NEAR: 46px
        let sizeClasses = 'w-[36px] h-[36px] md:w-[52px] md:h-[52px]'; // mid default
        let depthFilter = 'drop-shadow(0 2px 5px rgba(0,0,0,0.16))';

        if (particle.depth === 'far') {
          sizeClasses = 'w-[24px] h-[24px] md:w-[36px] md:h-[36px]';
          depthFilter = 'blur(0.4px) drop-shadow(0 1px 3px rgba(0,0,0,0.12))';
        } else if (particle.depth === 'near') {
          sizeClasses = 'w-[46px] h-[46px] md:w-[72px] md:h-[72px]';
          depthFilter = 'drop-shadow(0 5px 12px rgba(0,0,0,0.22)) brightness(1.04)';
        }

        // Visibility: Desktop renders all 12 rich particles; Mobile renders 4 edge-isolated particles
        const visibilityClass = particle.mobileVisible ? 'block' : 'hidden md:block';

        return (
          <div
            key={particle.id}
            className={`botanical-particle-track absolute top-0 ${visibilityClass}`}
            style={{
              left: `${particle.leftPercent}%`,
              animation: `${particle.driftTrajectory} ${particle.durationSec}s linear infinite`,
              animationDelay: `${particle.delaySec}s`,
              willChange: 'transform, opacity',
            }}
          >
            <div
              className={`botanical-particle-sway ${sizeClasses}`}
              style={{
                opacity: particle.opacity,
                filter: depthFilter,
                animation: `${particle.swayName} ${particle.swayDurationSec}s ease-in-out infinite alternate`,
                willChange: 'transform',
                transform: `rotate(${particle.rotStartDeg}deg)`,
              }}
            >
              <img
                src={particle.asset}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain pointer-events-none select-none"
                style={{
                  imageRendering: 'auto',
                }}
              />
            </div>
          </div>
        );
      })}

      <style>{`
        /* 1. Multi-axis Diagonal Trajectory: Drift Left */
        @keyframes driftLeft {
          0% {
            transform: translate3d(24px, -14vh, 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          88% {
            opacity: 1;
          }
          100% {
            transform: translate3d(-32px, 112vh, 0);
            opacity: 0;
          }
        }

        /* 2. Multi-axis Diagonal Trajectory: Drift Right */
        @keyframes driftRight {
          0% {
            transform: translate3d(-20px, -14vh, 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          88% {
            opacity: 1;
          }
          100% {
            transform: translate3d(36px, 112vh, 0);
            opacity: 0;
          }
        }

        /* 3. Subtle Wave Trajectory */
        @keyframes driftWave {
          0% {
            transform: translate3d(0, -14vh, 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          50% {
            transform: translate3d(18px, 48vh, 0);
          }
          88% {
            opacity: 1;
          }
          100% {
            transform: translate3d(-14px, 112vh, 0);
            opacity: 0;
          }
        }

        /* Natural Rotational and 3D Tilting Sways */
        @keyframes swayA {
          0% {
            transform: translateX(-16px) rotate(-16deg) rotateY(-8deg);
          }
          50% {
            transform: translateX(0px) rotate(4deg) rotateY(6deg);
          }
          100% {
            transform: translateX(20px) rotate(18deg) rotateY(12deg);
          }
        }

        @keyframes swayB {
          0% {
            transform: translateX(18px) rotate(16deg) rotateX(10deg);
          }
          50% {
            transform: translateX(-4px) rotate(-3deg) rotateX(-5deg);
          }
          100% {
            transform: translateX(-22px) rotate(-20deg) rotateX(-12deg);
          }
        }

        @keyframes swayC {
          0% {
            transform: translateX(-12px) rotate(-10deg) scale(0.96);
          }
          50% {
            transform: translateX(14px) rotate(14deg) scale(1.03);
          }
          100% {
            transform: translateX(-8px) rotate(-6deg) scale(0.98);
          }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .botanical-ambient-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
