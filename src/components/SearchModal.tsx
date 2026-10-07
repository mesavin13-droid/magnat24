import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  X, 
  ArrowRight, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Tag, 
  Boxes,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';

const POPULAR_SEARCH_QUERIES = [
  'Цемент М500',
  'Гипсокартон',
  'Пеноплекс 50мм',
  'Кирпич рядовой',
  'Газобетон Силекс',
  'Профиль 60х27',
  'Ротбанд Knauf',
  'Клей для плитки',
  'Керамзит 10-20'
];

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    products,
    currentCity,
    setActiveTab,
    setSelectedProductId,
    setSelectedCategory,
    addToCart
  } = useStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [addedProductIds, setAddedProductIds] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with store searchQuery when opening
  useEffect(() => {
    if (isSearchModalOpen) {
      setLocalQuery(searchQuery);
      // Auto focus input after render
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen, searchQuery]);

  if (!isSearchModalOpen) return null;

  // Real-time filtered products
  const trimmed = localQuery.trim().toLowerCase();
  const matchedProducts = trimmed.length > 0
    ? products.filter((p) => {
        const inName = p.name.toLowerCase().includes(trimmed);
        const inSku = p.sku.toLowerCase().includes(trimmed);
        const inCat = p.category.toLowerCase().includes(trimmed);
        const inSub = p.subtitle ? p.subtitle.toLowerCase().includes(trimmed) : false;
        const inBrand = p.brand ? p.brand.toLowerCase().includes(trimmed) : false;
        const inTags = p.tags.some((t) => t.toLowerCase().includes(trimmed));
        return inName || inSku || inCat || inSub || inBrand || inTags;
      })
    : [];

  const handleExecuteSearch = (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : localQuery).trim();
    setSearchQuery(q);
    setSelectedCategory(null);
    setActiveTab('catalog');
    setIsSearchModalOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setActiveTab('product-detail');
    setIsSearchModalOpen(false);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[88vh] border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Поиск товаров"
      >
        {/* Top Header & Search Bar */}
        <div className="p-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-black">
                <Search className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight">Поиск стройматериалов</h2>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>Склады в г. {currentCity}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              aria-label="Закрыть поиск"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Что нужно найти? (напр., цемент, гипсокартон)"
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-amber-500 rounded-2xl py-3 pl-11 pr-10 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalQuery('');
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Очистить строку поиска"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Clickable Action Button: НАЙТИ */}
            <button
              type="submit"
              className="py-3 px-4 sm:px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
            >
              <span>Найти</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular quick tags */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <TrendingUp className="w-3 h-3 text-amber-500" />
              <span>Часто ищут:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
              {POPULAR_SEARCH_QUERIES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setLocalQuery(tag);
                    handleExecuteSearch(tag);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1"
                >
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 divide-y divide-slate-100">
          {trimmed.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Boxes className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Введите название стройматериала</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Ищите по названию, бренду, артикулу или назначению. В каталоге {products.length} позиций в наличии.
              </p>
            </div>
          ) : matchedProducts.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6 my-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">По запросу «{localQuery}» ничего не найдено</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Проверьте правильность написания или выберите категорию в каталоге
              </p>
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setActiveTab('catalog');
                  setIsSearchModalOpen(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Перейти во весь каталог</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1">
                <span>Найдено товаров: {matchedProducts.length}</span>
                <span className="text-[11px] text-emerald-600">В наличии на складе</span>
              </div>

              {matchedProducts.map((p) => {
                const stock = currentCity === 'Красноярск' ? p.stockKrasnoyarsk : p.stockNovosibirsk;
                const isAdded = !!addedProductIds[p.id];

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Арт: {p.sku}</span>
                      </div>
                      
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate mt-0.5 group-hover:text-amber-600 transition-colors">
                        {p.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {stock} {p.unit}
                        </span>
                        {p.brand && <span>• {p.brand}</span>}
                      </div>
                    </div>

                    {/* Price & Add to cart button */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="text-right">
                        <div className="font-black text-sm sm:text-base text-slate-900">
                          {p.price.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          за {p.unit}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, p)}
                        className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-xs'
                        }`}
                        title="Добавить в корзину"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span className="text-[10px]">В корзине</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            <span className="text-[10px]">В корзину</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom CTA when results are present */}
        {matchedProducts.length > 0 && (
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-medium truncate">
              Показаны лучшие совпадения ({matchedProducts.length})
            </div>

            <button
              type="button"
              onClick={() => handleExecuteSearch()}
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Показать в каталоге</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
