import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, QUICK_BUILD_TASKS } from '../data/mockData';
import { SlidersHorizontal, ArrowUpDown, Check, ShoppingCart, X, Layers, Search } from 'lucide-react';
import { Product } from '../types';

export const CatalogProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, setSelectedProductId, setActiveTab } = useStore();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 750);
  };

  return (
    <div 
      onClick={() => { setSelectedProductId(product.id); setActiveTab('product-detail'); }}
      className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all cursor-pointer select-none"
    >
      <div>
        {/* Photo + In-stock status */}
        <div className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden mb-2.5">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
            loading="lazy" 
          />
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>В наличии</span>
          </div>
        </div>

        {/* Name and subtitle */}
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
          {product.subtitle || `${product.weightKg} кг`}
        </p>
      </div>

      {/* Price & Cart row */}
      <div className="mt-3 pt-2 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            /{product.unit}
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white active:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
            >
              −
            </button>
            <span className="w-6 text-center text-xs font-black text-slate-900">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white active:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 py-1.5 sm:py-2 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950'
            }`}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>В корзину</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CatalogScreen: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    selectedTaskFilter,
    setSelectedTaskFilter,
    searchQuery, 
    setSearchQuery,
    setIsFilterOpen,
    setIsSearchModalOpen
  } = useStore();

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;

      // Filter by quick task if selected
      if (selectedTaskFilter) {
        const taskObj = QUICK_BUILD_TASKS.find(t => t.id === selectedTaskFilter);
        if (taskObj && !p.tags.some(t => taskObj.tagQuery.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(taskObj.name.toLowerCase()))) {
          // Fallback if tag doesn't match directly
          const matchesCategory = taskObj.itemsList.some(item => p.name.toLowerCase().includes(item.toLowerCase().split(' ')[0]));
          if (!matchesCategory) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount);
    });
  }, [products, selectedCategory, selectedTaskFilter, searchQuery, sortBy]);

  const activeTask = QUICK_BUILD_TASKS.find(t => t.id === selectedTaskFilter);
  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="pb-28 animate-in fade-in duration-150">
      
      {/* Header bar */}
      <div className="px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Каталог</h1>
            <p className="text-xs text-slate-500 font-semibold">
              {filteredProducts.length} товаров в наличии
            </p>
          </div>

          {(selectedCategory || selectedTaskFilter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedTaskFilter(null);
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Сбросить</span>
            </button>
          )}
        </div>

        {/* Filter & Sort Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Фильтр</span>
          </button>

          <div className="flex-1 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs appearance-none outline-none cursor-pointer text-center"
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Search Pill if search query is applied */}
      {searchQuery && (
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/25 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
            <Search className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">Поиск: «{searchQuery}»</span>
            <span className="text-slate-500 font-normal">({filteredProducts.length})</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
            >
              Изменить
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Снять</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Pill if task or category is applied */}
      {(activeTask || activeCategory) && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between text-xs">
          <span className="font-bold text-amber-900">
            Подборка: {activeTask?.name || activeCategory?.name}
          </span>
          <button
            onClick={() => { setSelectedCategory(null); setSelectedTaskFilter(null); }}
            className="text-amber-800 hover:text-amber-950 font-bold underline"
          >
            Показать всё
          </button>
        </div>
      )}

      {/* Horizontal categories pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <button
          onClick={() => { setSelectedCategory(null); setSelectedTaskFilter(null); }}
          className={`shrink-0 py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            !selectedCategory && !selectedTaskFilter
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          Все товары
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCategory(c.id);
              setSelectedTaskFilter(null);
            }}
            className={`shrink-0 py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid: 2 columns on mobile, 4-5 on desktop! */}
      <div className="px-4 py-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 my-2">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">
              {searchQuery ? `По запросу «${searchQuery}» ничего не найдено` : 'Ничего не найдено'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Открыть поиск</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedTaskFilter(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {filteredProducts.map((p) => (
              <CatalogProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
