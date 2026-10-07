import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Heart, Check, Info, ArrowUpRight, Scale, Box } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    currentCity, 
    addToCart, 
    toggleFavorite, 
    isFavorite, 
    setSelectedProductId 
  } = useStore();

  const [qty, setQty] = useState(product.minOrder || 1);
  const [isAdded, setIsAdded] = useState(false);

  const isFav = isFavorite(product.id);
  const currentStock = currentCity === 'Красноярск' ? product.stockKrasnoyarsk : product.stockNovosibirsk;
  const isAvailable = currentStock > 0;

  const isBulkDiscountApplied = qty >= product.bulkThreshold;
  const activeUnitPrice = isBulkDiscountApplied ? product.bulkPrice : product.price;
  const totalCardPrice = activeUnitPrice * qty;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 800);
  };

  return (
    <div 
      onClick={() => setSelectedProductId(product.id)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* 1. Image & Badges */}
      <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isPopular && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm">
              ХИТ
            </span>
          )}
          {product.bulkThreshold && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Опт от {product.bulkThreshold} {product.unit}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm z-10 ${
            isFav 
              ? 'bg-rose-500 text-white shadow-rose-500/30' 
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* SKU code tag */}
        <div className="absolute bottom-2 left-2.5 bg-slate-900/70 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
          Арт: {product.sku}
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock indicator */}
          <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
            <span className="text-slate-400 font-medium truncate">{product.brand}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
              <span className={`text-[11px] font-semibold ${isAvailable ? 'text-emerald-700' : 'text-rose-600'}`}>
                {isAvailable ? `${currentStock.toLocaleString('ru-RU')} ${product.unit}` : 'Под заказ 1-2 дня'}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Specs preview badges */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
            {product.weightKg > 0 && (
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1">
                <Scale className="w-3 h-3 text-slate-400" />
                {product.weightKg >= 1000 ? `${(product.weightKg / 1000).toFixed(1)} т` : `${product.weightKg} кг`}
              </span>
            )}
            {product.volumeM3 > 0 && (
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1">
                <Box className="w-3 h-3 text-slate-400" />
                {product.volumeM3} м³
              </span>
            )}
          </div>
        </div>

        {/* 3. Pricing & Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          
          {/* Price breakdown */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {activeUnitPrice.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-xs text-slate-400 font-medium">/{product.unit}</span>
              </div>

              {product.bulkPrice < product.price && (
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span>Опт: {product.bulkPrice} ₽ (от {product.bulkThreshold} {product.unit})</span>
                </div>
              )}
            </div>

            {qty > 1 && (
              <div className="text-right">
                <div className="text-xs font-bold text-amber-600">
                  = {totalCardPrice.toLocaleString('ru-RU')} ₽
                </div>
                {isBulkDiscountApplied && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Оптовая скидка
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Stepper + Add button */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Quantity Stepper */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80">
              <button
                onClick={() => setQty((prev) => Math.max(product.minOrder || 1, prev - (product.category === 'brick' ? 50 : 1)))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors text-xs"
              >
                -
              </button>
              <input
                type="number"
                min={product.minOrder || 1}
                value={qty}
                onChange={(e) => setQty(Math.max(product.minOrder || 1, parseInt(e.target.value) || 1))}
                className="w-12 text-center text-xs font-bold bg-transparent outline-none text-slate-900"
              />
              <button
                onClick={() => setQty((prev) => prev + (product.category === 'brick' ? 50 : 1))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors text-xs"
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-md'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>В корзине!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Купить</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
