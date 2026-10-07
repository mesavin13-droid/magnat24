import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/mockData';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Calculator, 
  Clock, 
  ArrowUpDown, 
  Check, 
  Layers,
  ChevronRight,
  Boxes,
  Send,
  Building2
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    currentCity,
    setIsCalculatorOpen,
    setIsTelegramOpen
  } = useStore();

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'name'>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(10000);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory && p.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchSku && !matchTag) return false;
        }

        // In-stock
        if (inStockOnly) {
          const stock = currentCity === 'Красноярск' ? p.stockKrasnoyarsk : p.stockNovosibirsk;
          if (stock <= 0) return false;
        }

        // Price
        if (p.price > priceMax) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount);
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, priceMax, sortBy, currentCity]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      
      {/* 1. HERO BANNER */}
      {!selectedCategory && !searchQuery && (
        <section className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Hero Copy */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Прямые поставки от производителя в {currentCity}е</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Керамзит, кирпич и стройматериалы <span className="text-amber-500">по оптовым ценам</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Полнотелый и лицевой кирпич, автоклавный газобетон Силекс, Пеноплэкс, OSB-3, сухие смеси с оперативной доставкой манипулятором и самосвалами от 3 часов.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Рассчитать стройматериалы</span>
                  </button>

                  <button
                    onClick={() => setIsTelegramOpen(true)}
                    className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4 text-sky-400" />
                    <span>Подключить Telegram-бота</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Key Benefits Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
                  <Truck className="w-6 h-6 text-amber-400" />
                  <div className="font-bold text-xs text-white">Свой автопарк</div>
                  <div className="text-[11px] text-slate-400">Манипуляторы до 5т, самосвалы 15т, Газели</div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div className="font-bold text-xs text-white">ГОСТ и Паспорта</div>
                  <div className="text-[11px] text-slate-400">100% сертификаты качества на каждую партию</div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
                  <Building2 className="w-6 h-6 text-sky-400" />
                  <div className="font-bold text-xs text-white">3 Склада отгрузки</div>
                  <div className="text-[11px] text-slate-400">ул. Кутузова, Борисевича, Петухова</div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <div className="font-bold text-xs text-white">Отгрузка за 3 часа</div>
                  <div className="text-[11px] text-slate-400">Быстрая подача транспорта на ваш объект</div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. CATEGORY TILES STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            {selectedCategory 
              ? CATEGORIES.find(c => c.id === selectedCategory)?.name 
              : 'Каталог строительных материалов'
            }
          </h2>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              Сбросить категорию
            </button>
          )}
        </div>

        {/* Quick Category icons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-6">
          {CATEGORIES.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold shadow-md scale-102'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50 text-slate-800 shadow-xs'
                }`}
              >
                <div className="text-xs font-bold truncate">{cat.name}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-900 opacity-90' : 'text-slate-400'}`}>
                  {count} товаров
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FILTERS & SORTING BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* In-stock toggle */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span>Только в наличии на складе ({currentCity})</span>
            </label>
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 font-medium">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Сортировка товаров"
              className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">Сначала недорогие</option>
              <option value="price_desc">Сначала дорогие</option>
              <option value="name">По алфавиту (А-Я)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 4. PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Boxes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">По вашему запросу ничего не найдено</h3>
            <p className="text-xs text-slate-500 mt-1">Попробуйте изменить параметры фильтров или поисковый запрос</p>
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); setInStockOnly(false); }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
