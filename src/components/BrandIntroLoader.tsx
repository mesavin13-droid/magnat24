import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Truck, ShieldCheck } from 'lucide-react';

export const BrandIntroLoader: React.FC = () => {
  const { isBrandLoaderActive, setIsBrandLoaderActive } = useStore();
  const [isClosing, setIsClosing] = useState(false);
  const [statusStep, setStatusStep] = useState(0);

  // Total presentation time: ~1.7s, perfectly synchronized with CSS keyframes
  useEffect(() => {
    if (!isBrandLoaderActive) return;

    setIsClosing(false);
    setStatusStep(0);

    // Update text milestones with gentle, non-spamming state changes
    const t1 = setTimeout(() => setStatusStep(1), 500);
    const t2 = setTimeout(() => setStatusStep(2), 1050);
    const t3 = setTimeout(() => setStatusStep(3), 1400);

    // Auto exit
    const exitTimer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setIsBrandLoaderActive(false);
      }, 300);
    }, 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(exitTimer);
    };
  }, [isBrandLoaderActive, setIsBrandLoaderActive]);

  if (!isBrandLoaderActive) return null;

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      setIsBrandLoaderActive(false);
    }, 150);
  };

  const getStatusText = () => {
    switch (statusStep) {
      case 0:
        return 'Черчение контура буквы «М»…';
      case 1:
        return 'Загрузка каталога 1 248 стройматериалов…';
      case 2:
        return 'Проверка остатков на складах Сибири…';
      default:
        return 'МАГНАТ24 готов к покупкам!';
    }
  };

  return (
    <div
      onClick={() => handleSkip()}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#101114] text-white select-none transition-opacity duration-300 cursor-pointer ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Embedded pure hardware-accelerated CSS animations */}
      <style>{`
        @keyframes drawStrokeM {
          0% {
            stroke-dashoffset: 580;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes badgeReveal {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes textSlideUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fillProgress {
          0% {
            transform: scaleX(0);
          }
          35% {
            transform: scaleX(0.45);
          }
          75% {
            transform: scaleX(0.85);
          }
          100% {
            transform: scaleX(1);
          }
        }

        @keyframes ambientGlowPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.05);
          }
        }

        .anim-draw-m {
          stroke-dasharray: 580;
          stroke-dashoffset: 580;
          animation: drawStrokeM 1.1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          will-change: stroke-dashoffset;
        }

        .anim-badge-24 {
          opacity: 0;
          animation: badgeReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.65s forwards;
          will-change: opacity, transform;
        }

        .anim-brand-text {
          opacity: 0;
          animation: textSlideUp 0.45s ease-out 0.85s forwards;
          will-change: opacity, transform;
        }

        .anim-progress-bar {
          transform-origin: left;
          animation: fillProgress 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          will-change: transform;
        }

        .anim-ambient-glow {
          animation: ambientGlowPulse 2.5s ease-in-out infinite;
          will-change: opacity, transform;
        }
      `}</style>

      {/* Subtle background blueprint grid */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Skip button in top right */}
      <button
        onClick={handleSkip}
        className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer backdrop-blur-sm"
        title="Нажмите, чтобы пропустить"
      >
        <span>Пропустить</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
      </button>

      {/* Center Animated Emblem Container */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative flex flex-col items-center justify-center max-w-sm px-6 text-center cursor-default"
      >
        
        {/* Amber Ambient Glow behind the letter M (GPU accelerated CSS pulse) */}
        <div 
          className="anim-ambient-glow absolute w-52 h-52 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
        />

        {/* SVG Drawing Canvas of letter «М» */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg 
            viewBox="0 0 260 260" 
            className="w-full h-full drop-shadow-[0_10px_20px_rgba(245,158,11,0.22)]"
          >
            <defs>
              <linearGradient id="mGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>
            </defs>

            {/* 1. Architectural blueprint drafting guides (faint dotted trace) */}
            <path
              d="M 46 210 L 46 50 L 130 156 L 214 50 L 214 210"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
              strokeDasharray="4 6"
              className="opacity-40"
            />

            {/* Corner dimension ticks */}
            <circle cx="46" cy="210" r="3.5" fill="#F59E0B" className="opacity-60" />
            <circle cx="46" cy="50" r="3.5" fill="#F59E0B" className="opacity-60" />
            <circle cx="130" cy="156" r="3.5" fill="#F59E0B" className="opacity-60" />
            <circle cx="214" cy="50" r="3.5" fill="#F59E0B" className="opacity-60" />
            <circle cx="214" cy="210" r="3.5" fill="#F59E0B" className="opacity-60" />

            {/* 2. Main Animated Amber Stroke (draws with pure GPU-accelerated CSS keyframe) */}
            <path
              d="M 46 210 L 46 50 L 130 156 L 214 50 L 214 210"
              fill="none"
              stroke="url(#mGrad)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="anim-draw-m"
            />

            {/* 3. Glowing White Laser Core */}
            <path
              d="M 46 210 L 46 50 L 130 156 L 214 50 L 214 210"
              fill="none"
              stroke="#FFFBEB"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="anim-draw-m"
            />

            {/* 4. Center badge "24" inside notch (pops in at 0.65s) */}
            <g className="anim-badge-24">
              <rect 
                x="108" 
                y="180" 
                width="44" 
                height="26" 
                rx="6" 
                fill="#F59E0B" 
                className="shadow-md"
              />
              <text 
                x="130" 
                y="198" 
                fill="#111827" 
                fontSize="15" 
                fontWeight="900" 
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                24
              </text>
            </g>
          </svg>
        </div>

        {/* Brand Name & Slogans (slides up smoothly at 0.85s) */}
        <div className="anim-brand-text mt-3 space-y-1">
          <div className="flex items-center justify-center gap-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center">
              <span>МАГНАТ</span>
              <span className="text-amber-500 ml-1">24</span>
              <span className="text-slate-400 font-bold text-xl ml-0.5">.РФ</span>
            </h1>
          </div>
          
          <p className="text-[11px] sm:text-xs font-semibold text-slate-300 tracking-wider uppercase">
            Оптово-розничный гипермаркет стройматериалов
          </p>

          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mt-1">
            <span>С 2000 ГОДА</span>
            <span>•</span>
            <span>НОВОСИБИРСК & КРАСНОЯРСК</span>
          </div>
        </div>

        {/* GPU-Accelerated Progress Bar */}
        <div className="w-full max-w-xs mt-6 space-y-2">
          <div className="h-2 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
            <div 
              className="anim-progress-bar h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span className="truncate">{getStatusText()}</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Кликните в любом месте для входа
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Fast Info Chips */}
      <div className="absolute bottom-6 flex items-center gap-3 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-amber-500" />
          <span>Доставка за 3 часа</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ГОСТ сертификаты</span>
        </span>
      </div>

    </div>
  );
};
