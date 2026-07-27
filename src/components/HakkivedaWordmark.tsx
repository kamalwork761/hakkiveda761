import React from 'react';

interface HakkivedaWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark-header' | 'light-footer';
}

export const HakkivedaWordmark: React.FC<HakkivedaWordmarkProps> = ({
  className = '',
  size = 'md',
  theme = 'dark-header',
}) => {
  const letters = ['H', 'A', 'K', 'K', 'I', 'V', 'E', 'D', 'A'];

  // Dimensions based on size
  const sizeClasses = {
    sm: 'h-5 sm:h-6 w-32 sm:w-44',
    md: 'h-6 sm:h-8 w-36 sm:w-56',
    lg: 'h-8 sm:h-10 w-48 sm:w-72',
  }[size];

  // Colors based on theme
  // Forest Green Fill: #1B5E43 or #2D6A4F with #C8A24A Golden Stroke
  const strokeColor = '#C8A24A';
  const fillColor = theme === 'dark-header' ? '#1f6b4e' : '#144533';

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      <svg
        className={`w-auto ${sizeClasses}`}
        viewBox="0 0 340 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HAKKIVEDA"
        role="img"
      >
        <defs>
          {/* Subtle Golden Glow Filter */}
          <filter id="gold-glow-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="0.6" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Luxury Forest Green Fill Gradient */}
          <linearGradient id="forest-green-luxury" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D6A4F" />
            <stop offset="50%" stopColor="#1B5E43" />
            <stop offset="100%" stopColor="#0F3828" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes drawStroke {
            0% {
              stroke-dashoffset: 120;
              fill-opacity: 0;
            }
            25% {
              stroke-dashoffset: 0;
              fill-opacity: 0;
            }
            35% {
              stroke-dashoffset: 0;
              fill-opacity: 1;
            }
            75% {
              stroke-dashoffset: 0;
              fill-opacity: 1;
            }
            88% {
              stroke-dashoffset: 0;
              fill-opacity: 0;
            }
            100% {
              stroke-dashoffset: 120;
              fill-opacity: 0;
            }
          }

          @keyframes goldenGlowPulse {
            0%, 25% {
              filter: drop-shadow(0 0 0px rgba(200, 162, 74, 0));
            }
            35% {
              filter: drop-shadow(0 0 10px rgba(200, 162, 74, 0.85));
            }
            48% {
              filter: drop-shadow(0 0 3px rgba(200, 162, 74, 0.3));
            }
            65% {
              filter: drop-shadow(0 0 7px rgba(200, 162, 74, 0.55));
            }
            80% {
              filter: drop-shadow(0 0 3px rgba(200, 162, 74, 0.3));
            }
            90%, 100% {
              filter: drop-shadow(0 0 0px rgba(200, 162, 74, 0));
            }
          }

          .wordmark-group {
            animation: goldenGlowPulse 10s ease-in-out infinite;
          }

          .letter-path {
            font-family: 'Cinzel', 'Cormorant Garamond', 'Playfair Display', serif;
            font-weight: 700;
            font-size: 34px;
            letter-spacing: 0.12em;
            stroke: ${strokeColor};
            stroke-width: 1.2px;
            stroke-dasharray: 120;
            stroke-dashoffset: 120;
            fill: url(#forest-green-luxury);
            fill-opacity: 0;
            stroke-linecap: round;
            stroke-linejoin: round;
            animation: drawStroke 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          /* Left-to-right staggered delays for each letter */
          .letter-0 { animation-delay: 0.0s; }
          .letter-1 { animation-delay: 0.25s; }
          .letter-2 { animation-delay: 0.5s; }
          .letter-3 { animation-delay: 0.75s; }
          .letter-4 { animation-delay: 1.0s; }
          .letter-5 { animation-delay: 1.25s; }
          .letter-6 { animation-delay: 1.5s; }
          .letter-7 { animation-delay: 1.75s; }
          .letter-8 { animation-delay: 2.0s; }
        `}</style>

        <g className="wordmark-group" y="36">
          {/* Render each letter individually for perfect left-to-right stroke animation */}
          {/* Coordinates adjusted for 'Cinzel' serif typography alignment */}
          <text x="5" y="36" className="letter-path letter-0">H</text>
          <text x="42" y="36" className="letter-path letter-1">A</text>
          <text x="78" y="36" className="letter-path letter-2">K</text>
          <text x="114" y="36" className="letter-path letter-3">K</text>
          <text x="150" y="36" className="letter-path letter-4">I</text>
          <text x="172" y="36" className="letter-path letter-5">V</text>
          <text x="210" y="36" className="letter-path letter-6">E</text>
          <text x="244" y="36" className="letter-path letter-7">D</text>
          <text x="282" y="36" className="letter-path letter-8">A</text>
        </g>
      </svg>
    </div>
  );
};
