import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  MapPin, 
  Truck, 
  Phone, 
  Boxes, 
  X,
  Smartphone,
  Monitor
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export const DesktopHeader: React.FC = () => {
  const { 
    currentCity, 
    setCurrentCity, 
    searchQuery, 
    setSearchQuery, 
    cart, 
    user, 
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

  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const favCount = user.favorites.length;

  // Live search results preview
  const liveResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      
      {/* Top Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Город:</span>
              <select
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value as any)}
                aria-label="Выбор города"
                className="bg-transparent text-amber-400 font-bold outline-none cursor-pointer"
              >
                <option value="Новосибирск" className="bg-slate-900 text-white">Новосибирск</option>
                <option value="Красноярск" className="bg-slate-900 text-white">Красноярск</option>
              </select>
            </div>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{COMPANY_INFO.workingHours}</span>
            <span className="text-slate-500">•</span>
            <button
              onClick={() => setIsWelcomeSplashOpen(true)}
              className="text-slate-300 hover:text-amber-400 transition-colors font-medium cursor-pointer"
            >
              О магазине
            </button>
            <span className="text-slate-500">•</span>
            <button
              onClick={() => replayBrandLoader()}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>▶ Интро «М»</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Viewport switch */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 mr-1">Режим:</span>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  deviceMode === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>390px</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  deviceMode === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>1440px</span>
              </button>
            </div>

            <a href={`tel:${COMPANY_INFO.phones.novosibirsk.replace(/\s+/g, '')}`} className="font-bold text-amber-400">
              {currentCity === 'Новосибирск' ? COMPANY_INFO.phones.novosibirsk : COMPANY_INFO.phones.krasnoyarsk}
            </a>
          </div>
        </div>
      </div>

      {/* Main Desktop Bar */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div 
            onClick={(e) => {
              // Click on M icon replays intro
              e.stopPropagation();
              replayBrandLoader();
            }}
            title="Нажмите, чтобы посмотреть анимацию буквы М"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-black shadow-xs hover:border-amber-500/60 transition-all cursor-pointer"
          >
            <svg viewBox="0 0 100 100" className="w-6 h-6">
              <path
                d="M 18 80 L 18 20 L 50 60 L 82 20 L 82 80"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="14"
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
          </div>
          <div>
            <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              МАГНАТ<span className="text-amber-500">24</span>
            </span>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Стройматериалы</div>
          </div>
        </div>

        {/* Catalog Button */}
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-2.5 px-5 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'bg-slate-900 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          <span>Каталог</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeTab !== 'catalog') setActiveTab('catalog');
              setIsSearchFocused(false);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Цемент, гипсокартон, профиль…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-9 text-sm text-slate-900 font-medium outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                title="Быстрый поиск"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Очистить поиск"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Clickable Action Button: НАЙТИ */}
            <button
              type="submit"
              onClick={() => {
                if (activeTab !== 'catalog') setActiveTab('catalog');
                setIsSearchFocused(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer select-none"
              title="Найти стройматериалы"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Найти</span>
            </button>
          </form>

          {/* Desktop Live Search dropdown */}
          {isSearchFocused && searchQuery.trim().length > 1 && liveResults.length > 0 && (
            <div 
              onMouseDown={(e) => e.preventDefault()} // prevent blur
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 overflow-hidden divide-y divide-slate-100"
            >
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 flex justify-between items-center bg-slate-50">
                <span>Результаты поиска ({liveResults.length})</span>
                <span className="text-[11px] text-amber-600">Нажмите для перехода</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {liveResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedProductId(item.id);
                      setActiveTab('product-detail');
                      setIsSearchFocused(false);
                    }}
                    className="p-3 hover:bg-amber-50/60 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.subtitle || item.category}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-sm text-slate-900">{item.price.toLocaleString('ru-RU')} ₽</div>
                      <div className="text-[10px] text-slate-400">за {item.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                onClick={() => {
                  setActiveTab('catalog');
                  setIsSearchFocused(false);
                }}
                className="p-2.5 text-center text-xs font-bold text-amber-600 hover:bg-amber-50 cursor-pointer bg-slate-50"
              >
                Показать все результаты в каталоге →
              </div>
            </div>
          )}
        </div>

        {/* Nav Links: О магазине, Калькулятор, Мои объекты, Профиль, Корзина */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
          <button
            onClick={() => setIsWelcomeSplashOpen(true)}
            className="hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="О компании МАГНАТ24 и условия доставки"
          >
            <span>О магазине</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className="hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Калькулятор</span>
          </button>

          <button
            onClick={() => setActiveTab('objects')}
            className="hover:text-amber-600 transition-colors flex items-center gap-1.5"
          >
            <span>Мои объекты</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="hover:text-amber-600 transition-colors flex items-center gap-1.5"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Профиль</span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`py-2 px-3.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all ${
              activeTab === 'cart' || activeTab === 'checkout'
                ? 'bg-slate-900 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Корзина ({cartCount})</span>
          </button>
        </div>

      </div>

    </header>
  );
};
