import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { COMPANY_INFO, CATEGORIES } from '../data/mockData';
import { 
  MapPin, 
  Phone, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Calculator, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  Boxes,
  Truck,
  Building2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentCity,
    setCurrentCity,
    searchQuery,
    setSearchQuery,
    products,
    selectedCategory,
    setSelectedCategory,
    cart,
    cartTotal,
    user,
    telegramMessages,
    setIsTelegramOpen,
    setIsCalculatorOpen,
    activeTab,
    setActiveTab,
    setSelectedProductId,
    syncLogs
  } = useStore();

  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadTelegramCount = telegramMessages.filter(m => !m.isRead).length;
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Search filtered results preview
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  // Close search preview on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. TOP INFORMATION STRIP */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* City selector & working hours */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer group">
              <MapPin className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-xs">Город:</span>
              <select 
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value as 'Красноярск' | 'Новосибирск')}
                aria-label="Выбор города"
                className="bg-transparent text-amber-300 font-semibold cursor-pointer outline-none text-xs pr-1"
              >
                <option value="Красноярск" className="bg-slate-900 text-white">Красноярск</option>
                <option value="Новосибирск" className="bg-slate-900 text-white">Новосибирск</option>
              </select>
            </div>

            <div className="hidden md:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{COMPANY_INFO.workingHours}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentCity === 'Красноярск' ? 'Склады: ул. Кутузова 1 ст72 / Борисевича 30а/2' : 'Склад: ул. Петухова 47а'}</span>
            </div>
          </div>

          {/* Direct Actions: 1C sync, Telegram Bot, Admin */}
          <div className="flex items-center gap-3 ml-auto">
            {/* 1C Status Indicator */}
            <button
              onClick={() => setActiveTab('sync-api')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all text-xs ${
                activeTab === 'sync-api'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
              title="Интеграция со складской системой 1C"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <RefreshCw className="w-3 h-3 text-emerald-400" />
              <span className="font-mono font-medium hidden sm:inline">1С:Склад API</span>
            </button>

            {/* Telegram Bot Notification button */}
            <button
              onClick={() => setIsTelegramOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/30 transition-all text-xs"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span className="font-medium">Telegram Бот</span>
              {unreadTelegramCount > 0 && (
                <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                  {unreadTelegramCount}
                </span>
              )}
            </button>

            {/* Admin Panel Link */}
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'catalog' : 'admin')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors text-xs font-medium ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{activeTab === 'admin' ? 'В магазин' : 'Админ-панель'}</span>
            </button>

            {/* Direct Phone */}
            <a 
              href={`tel:${COMPANY_INFO.phones.direct.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{currentCity === 'Красноярск' ? COMPANY_INFO.phones.krasnoyarsk : COMPANY_INFO.phones.novosibirsk}</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          
          {/* Logo & Slogan */}
          <div 
            onClick={() => { setActiveTab('catalog'); setSelectedCategory(null); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Boxes className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors font-sans">
                  МАГНАТ<span className="text-amber-500">24</span>.РФ
                </span>
                <span className="hidden sm:inline-block bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                  ОПТ & РОЗНИЦА
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Керамзит, кирпич, газобетон, утеплители от производителя
              </p>
            </div>
          </div>

          {/* Catalog Dropdown Button */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setIsCatalogMenuOpen(!isCatalogMenuOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                isCatalogMenuOpen
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
              }`}
            >
              <Menu className="w-5 h-5" />
              <span>Каталог товаров</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatalogMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Catalog Dropdown Menu */}
            {isCatalogMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Категории</span>
                  <button 
                    onClick={() => { setSelectedCategory(null); setIsCatalogMenuOpen(false); setActiveTab('catalog'); }}
                    className="text-xs text-amber-600 font-semibold hover:underline"
                  >
                    Весь каталог
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto space-y-0.5 px-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsCatalogMenuOpen(false);
                        setActiveTab('catalog');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-amber-50 text-amber-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-slate-400">
                        {products.filter(p => p.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Smart Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск стройматериалов: керамзит, кирпич М150, Силекс, пеноплекс..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Очистить поиск"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 overflow-hidden">
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 border-b border-slate-100 flex justify-between items-center">
                  <span>Результаты поиска ({searchResults.length})</span>
                  <span className="text-[11px] text-amber-600">Нажмите для перехода</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="p-2.5 hover:bg-amber-50/70 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Арт: {p.sku}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">
                            {currentCity === 'Красноярск' ? `${p.stockKrasnoyarsk} ${p.unit} в наличии` : `${p.stockNovosibirsk} ${p.unit} в наличии`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-slate-900">{p.price.toLocaleString('ru-RU')} ₽</div>
                        <div className="text-[10px] text-slate-400">за {p.unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Icons: Calculator, Favorites, Profile, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Material Calculator Shortcut */}
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors group relative"
              title="Калькулятор стройматериалов"
            >
              <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-medium hidden sm:block">Расчет</span>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => { setActiveTab('account'); }}
              className="flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors relative group"
              title="Избранные товары"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-medium hidden sm:block">Избранное</span>
              {user.favorites.length > 0 && (
                <span className="absolute 1 top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {user.favorites.length}
                </span>
              )}
            </button>

            {/* User Cabinet */}
            <button
              onClick={() => setActiveTab('account')}
              className={`flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-colors relative group ${
                activeTab === 'account'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
              }`}
              title="Личный кабинет покупателя"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-medium hidden sm:block">Кабинет</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                activeTab === 'cart' || activeTab === 'checkout'
                  ? 'bg-slate-900 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-950 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-[10px] uppercase font-bold opacity-80">Корзина</div>
                <div className="text-xs font-extrabold">
                  {cartTotal > 0 ? `${cartTotal.toLocaleString('ru-RU')} ₽` : '0 ₽'}
                </div>
              </div>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Меню навигации"
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* 3. SECONDARY CATEGORY STRIP */}
      <div className="bg-slate-50 border-t border-slate-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2 text-xs font-semibold gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setSelectedCategory(null); setActiveTab('catalog'); }}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === null && activeTab === 'catalog'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                Все товары
              </button>

              {CATEGORIES.slice(0, 8).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveTab('catalog');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id && activeTab === 'catalog'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0 border-l border-slate-200 pl-4">
              <button
                onClick={() => setActiveTab('delivery-info')}
                className={`flex items-center gap-1 text-xs hover:text-amber-600 transition-colors ${
                  activeTab === 'delivery-info' ? 'text-amber-600 font-bold' : 'text-slate-600'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                <span>Доставка и оплата</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex items-center gap-1 text-xs hover:text-amber-600 transition-colors ${
                  activeTab === 'contacts' ? 'text-amber-600 font-bold' : 'text-slate-600'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Контакты и склады</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск стройматериалов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Mobile links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => { setIsCalculatorOpen(true); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-amber-50 text-amber-800 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Калькулятор</span>
            </button>
            <button
              onClick={() => { setIsTelegramOpen(true); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-sky-50 text-sky-800 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Telegram Бот</span>
            </button>
            <button
              onClick={() => { setActiveTab('delivery-info'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Доставка</span>
            </button>
            <button
              onClick={() => { setActiveTab('contacts'); setIsMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Контакты</span>
            </button>
          </div>

          {/* Categories */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Категории каталога</div>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveTab('catalog');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left p-2 rounded-lg text-xs font-medium ${
                    selectedCategory === cat.id ? 'bg-amber-500 text-white font-bold' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
