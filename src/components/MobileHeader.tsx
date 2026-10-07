import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Heart, ShoppingCart, MapPin, X, ArrowLeft, Smartphone, Monitor } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const { 
    currentCity, 
    setCurrentCity, 
    searchQuery, 
    setSearchQuery, 
    user, 
    cart, 
    activeTab, 
    setActiveTab,
    deviceMode,
    setDeviceMode,
    products,
    setSelectedProductId,
    setIsWelcomeSplashOpen,
    replayBrandLoader,
    setIsSearchModalOpen
  } = useStore();

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const favCount = user.favorites.length;

  // Search live suggestions
  const liveResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      
      {/* Viewport device mode switcher toggle (discreet top bar) */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold text-white text-[11px] tracking-wide">МАГНАТ24.РФ</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">&bull; Стройматериалы с доставкой</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              deviceMode === 'mobile'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>390px</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              deviceMode === 'desktop'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>1440px</span>
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Back button if sub-screen OR Brand Logo */}
        <div className="flex items-center gap-2">
          {activeTab !== 'home' && (
            <button
              onClick={() => setActiveTab('home')}
              className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Назад на главную"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => replayBrandLoader()}
              title="Посмотреть анимацию буквы М"
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-black shadow-2xs hover:border-amber-500/60 active:scale-95 transition-all cursor-pointer"
            >
              <svg viewBox="0 0 100 100" className="w-5 h-5">
                <path
                  d="M 18 80 L 18 20 L 50 60 L 82 20 L 82 80"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 18 80 L 18 20 L 50 60 L 82 20 L 82 80"
                  fill="none"
                  stroke="#FFFBEB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 text-left select-none group"
            >
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                МАГНАТ<span className="text-amber-500">24</span>
              </span>
            </button>
          </div>
        </div>

        {/* Right: Favorites & Cart */}
        <div className="flex items-center gap-2">
          {/* Favorites */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center relative transition-colors"
            aria-label="Избранные товары"
          >
            <Heart className="w-5 h-5 text-slate-700" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {favCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => setActiveTab('cart')}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center relative transition-all shadow-xs"
            aria-label="Корзина покупок"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-slate-950 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-amber-300">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Under Header: Location Selector */}
      <div className="px-4 pb-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <select
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value as any)}
            aria-label="Выбор города"
            className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer pr-1"
          >
            <option value="Новосибирск">Новосибирск</option>
            <option value="Красноярск">Красноярск</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsWelcomeSplashOpen(true)} 
            className="text-slate-500 hover:text-amber-600 font-bold text-[11px] cursor-pointer"
            title="О магазине МАГНАТ24 и доставка"
          >
            О магазине
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={() => setActiveTab('calculator')} 
            className="text-amber-600 font-bold hover:underline text-[11px]"
          >
            📐 Калькулятор
          </button>
        </div>
      </div>

      {/* Prominent Search Bar: «Что ищете?» */}
      <div className="px-4 pb-3 relative">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (activeTab !== 'catalog') setActiveTab('catalog');
          }}
          className="flex items-center gap-1.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Цемент, гипсокартон, профиль…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (activeTab !== 'catalog') setActiveTab('catalog'); }}
              className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
              title="Открыть быстрый поиск"
            >
              <Search className="w-4 h-4" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Очистить поиск"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Button (Кнопка Поиск / Найти) */}
          <button
            type="submit"
            onClick={() => {
              if (activeTab !== 'catalog') setActiveTab('catalog');
            }}
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-xs transition-all cursor-pointer select-none"
            title="Искать товары"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Найти</span>
          </button>
        </form>

        {/* Live Search suggestions dropdown */}
        {searchQuery.trim().length > 1 && liveResults.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-50 overflow-hidden divide-y divide-slate-100">
            {liveResults.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProductId(item.id);
                  setActiveTab('product-detail');
                }}
                className="p-2.5 hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-500">{item.subtitle || item.category}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-xs text-slate-900">{item.price} ₽</span>
                </div>
              </div>
            ))}
            <div 
              onClick={() => {
                if (activeTab !== 'catalog') setActiveTab('catalog');
              }}
              className="p-2 text-center text-xs font-bold text-amber-600 hover:bg-amber-50 cursor-pointer"
            >
              Показать все результаты в каталоге →
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
