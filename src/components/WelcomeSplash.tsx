import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { COMPANY_INFO } from '../data/mockData';
import { 
  Truck, 
  Layers, 
  CreditCard, 
  Calculator, 
  MapPin, 
  ArrowRight, 
  X, 
  Check, 
  Phone, 
  Building2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const WelcomeSplash: React.FC = () => {
  const { 
    isWelcomeSplashOpen, 
    setIsWelcomeSplashOpen, 
    currentCity, 
    setCurrentCity, 
    setActiveTab,
    replayBrandLoader
  } = useStore();

  const [dontShowAgain, setDontShowAgain] = useState(true);

  if (!isWelcomeSplashOpen) return null;

  const handleClose = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem('magnat24_welcome_seen_v1', 'true');
    }
    setIsWelcomeSplashOpen(false);
  };

  const handleStartShopping = () => {
    handleClose();
    setActiveTab('home');
  };

  const handleOpenCatalog = () => {
    handleClose();
    setActiveTab('catalog');
  };

  const handleOpenCalculator = () => {
    handleClose();
    setActiveTab('calculator');
  };

  const currentPhone = currentCity === 'Новосибирск' 
    ? COMPANY_INFO.phones.novosibirsk 
    : COMPANY_INFO.phones.krasnoyarsk;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900"
      >
        
        {/* Header Ribbon / Brand Top */}
        <div className="relative bg-slate-900 text-white p-5 sm:p-6 overflow-hidden">
          {/* Subtle construction texture backdrop */}
          <div 
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-luminosity"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1000&q=80')` }}
          />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Construction M emblem */}
              <button
                type="button"
                onClick={() => replayBrandLoader()}
                title="Посмотреть анимацию буквы М"
                className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 hover:bg-amber-500/30 transition-all cursor-pointer group shadow-sm"
              >
                <svg viewBox="0 0 100 100" className="w-7 h-7 filter drop-shadow">
                  <path
                    d="M 18 80 L 18 20 L 50 60 L 82 20 L 82 80"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 18 80 L 18 20 L 50 60 L 82 20 L 82 80"
                    fill="none"
                    stroke="#FFFBEB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                  <span>{COMPANY_INFO.name} • С 2000 года</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                  МАГНАТ<span className="text-amber-500">24</span>.РФ
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 leading-snug">
                  Оптово-розничный гипермаркет строительных материалов
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Закрыть приветствие"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          
          {/* 1. Quick City Confirmation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Выберите город отгрузки и доставки:</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrentCity('Новосибирск')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  currentCity === 'Новосибирск'
                    ? 'bg-amber-500/15 border-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">Новосибирск</span>
                  {currentCity === 'Новосибирск' && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />}
                </div>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">Склад: ул. Петухова</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentCity('Красноярск')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  currentCity === 'Красноярск'
                    ? 'bg-amber-500/15 border-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">Красноярск</span>
                  {currentCity === 'Красноярск' && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />}
                </div>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">Склад: ул. Ак. Павлова</span>
              </button>
            </div>
          </div>

          {/* 2. Key Advantages Grid (Practical, Construction-focused) */}
          <div className="space-y-2">
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-400 block px-1">
              Почему заказывают в МАГНАТ24:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug">Доставка от 3 часов</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Собственный автопарк: Газели, манипуляторы и самосвалы прямо на объект.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug">Прямые склады и опт</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Керамзит, кирпич, газобетон Силекс, Пеноплэкс, сухие смеси Knauf/Волма.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug">Оплата с НДС и СБП</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Работаем с физлицами, бригадами и юрлицами. Оплата онлайн или водителю.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug">Инженерный расчёт</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Встроенный калькулятор расхода газоблоков, кирпича и стяжки в 1 клик.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact & Phone row */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 font-medium">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold">Отдел продаж:</span>
              <a href={`tel:${currentPhone.replace(/\s+/g, '')}`} className="font-black text-xs hover:underline text-slate-900">
                {currentPhone}
              </a>
            </div>
            <span className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md font-bold">
              8:30 – 18:00
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleStartShopping}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98 min-h-[48px]"
            >
              <span>Перейти к покупкам</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={handleOpenCatalog}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Каталог товаров</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300 accent-amber-500 cursor-pointer"
              />
              <span>Не показывать при входе</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  replayBrandLoader();
                }}
                className="text-slate-600 hover:text-amber-600 font-bold flex items-center gap-1 cursor-pointer"
                title="Посмотреть анимацию буквы М"
              >
                <span>▶ Анимация «М»</span>
              </button>
              <span>•</span>
              <button
                onClick={handleOpenCalculator}
                className="text-amber-600 hover:underline font-bold cursor-pointer"
              >
                📐 Калькулятор
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
