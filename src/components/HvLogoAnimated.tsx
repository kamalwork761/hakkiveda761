import React, { useState } from 'react';

interface HvLogoAnimatedProps {
  logoUrl?: string;
  altText: string;
  size: 'desktop' | 'mobile';
  fallbackInitials?: string;
}

export const HvLogoAnimated: React.FC<HvLogoAnimatedProps> = ({
  logoUrl,
  altText,
  size,
  fallbackInitials = 'HV',
}) => {
  const [loadError, setLoadError] = useState(false);

  const isDesktop = size === 'desktop';
  const imgClasses = isDesktop
    ? 'h-[56px] max-h-[56px] max-w-[56px] w-auto object-contain drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)]'
    : 'h-7 xs:h-8 sm:h-8.5 max-h-9 max-w-[36px] w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]';

  const containerClasses = isDesktop
    ? 'w-[56px] h-[56px] flex items-center justify-center shrink-0'
    : 'w-7 xs:w-8 sm:w-8.5 h-7 xs:h-8 sm:h-8.5 flex items-center justify-center shrink-0';

  const hasValidLogo = Boolean(logoUrl) && !loadError;

  return (
    <div
      className={`hv-3d-logo-root ${containerClasses} select-none`}
      style={{
        perspective: '900px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="hv-3d-logo-inner flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105"
        style={{
          animation: 'hv3dReveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, hv3dRotationalSway 6s ease-in-out 1s infinite alternate',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
      >
        {hasValidLogo ? (
          <img
            src={logoUrl}
            alt={altText}
            className={`${imgClasses} transition-transform duration-300`}
            style={{ objectFit: 'contain' }}
            onError={() => setLoadError(true)}
            loading="eager"
            decoding="async"
          />
        ) : (
          isDesktop ? (
            <div className="w-12 h-12 border-2 border-[var(--brand-gold,#D4AF37)] flex items-center justify-center rotate-45 group-hover:bg-[var(--brand-gold,#D4AF37)] transition-all duration-500 shadow-lg shrink-0">
              <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold,#D4AF37)] group-hover:text-[#123F2A] text-base tracking-tighter">
                {fallbackInitials}
              </span>
            </div>
          ) : (
            <div className="w-[26px] h-[26px] xs:w-[28px] xs:h-[28px] sm:w-[30px] sm:h-[30px] border border-[#C9A84E] bg-[#FAF7F2] flex items-center justify-center rotate-45 group-hover:bg-[#C9A84E]/10 transition-all duration-300 shadow-xs shrink-0">
              <span className="-rotate-45 font-bold font-brand text-[#0F2E22] text-[10px] xs:text-[11px] sm:text-xs tracking-tight">
                {fallbackInitials}
              </span>
            </div>
          )
        )}
      </div>

      <style>{`
        @keyframes hv3dReveal {
          0% {
            opacity: 0;
            transform: perspective(800px) rotateY(-90deg) scale(0.85);
          }
          50% {
            opacity: 1;
            transform: perspective(800px) rotateY(14deg) scale(1.04);
          }
          75% {
            transform: perspective(800px) rotateY(-6deg) scale(1.0);
          }
          100% {
            opacity: 1;
            transform: perspective(800px) rotateY(0deg) scale(1.0);
          }
        }

        @keyframes hv3dRotationalSway {
          0%, 100% {
            transform: perspective(800px) rotateY(0deg);
          }
          33% {
            transform: perspective(800px) rotateY(6deg);
          }
          66% {
            transform: perspective(800px) rotateY(-6deg);
          }
        }

        .group:hover .hv-3d-logo-inner {
          transform: perspective(800px) rotateY(12deg) scale(1.08) !important;
        }
      `}</style>
    </div>
  );
};
