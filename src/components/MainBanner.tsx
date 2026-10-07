import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Truck, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

export const MainBanner: React.FC = () => {
  const { setActiveTab, currentCity } = useStore();

  return (
    <div className="px-4 py-1.5">
      <div className="relative rounded-2xl bg-gradient-to-br from-[#16171B] via-[#1B1D22] to-[#121316] text-white overflow-hidden p-4 sm:p-5 border border-slate-700/80 shadow-md">
        
        {/* Real photo visual backdrop overlay with smooth left-to-right gradient fade */}
        <div 
          className="absolute inset-0 right-0 w-full sm:w-3/5 ml-auto opacity-35 sm:opacity-45 bg-cover bg-right pointer-events-none mix-blend-luminosity"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80')` }}
        />
        {/* Subtle dark gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#16171B] via-[#16171B]/90 to-transparent pointer-events-none" />

        {/* Content Container - Perfectly aligned */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          
          {/* Left Text Column */}
          <div className="flex-1 space-y-2.5 max-w-sm">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/35 text-[11px] font-bold px-2.5 py-0.5 rounded-full w-fit">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>{currentCity} • Доставка от 490 ₽ сегодня</span>
            </div>

            {/* Main Headline & Subtitle */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                Всё для стройки
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-0.5 leading-snug">
                Материалы с доставкой на объект
              </p>
            </div>

            {/* Trust bullet points */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>1 248 товаров в наличии</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Опт и розница</span>
              </span>
            </div>

            {/* Action button */}
            <div className="pt-0.5">
              <button
                onClick={() => setActiveTab('catalog')}
                className="w-full sm:w-fit py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98 min-h-[40px]"
              >
                <span>Перейти в каталог</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </div>

          {/* Right Floating Badge / Visual Elements (visible on mobile as well) */}
          <div className="hidden xs:flex sm:flex flex-col items-end justify-center gap-1.5 shrink-0 sm:pr-2">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 text-right shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Собственный автопарк
              </span>
              <span className="text-xs font-black text-amber-400 flex items-center gap-1 justify-end">
                <span>Газели и манипуляторы</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Сертификаты ГОСТ</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
