import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Check, ShoppingCart } from 'lucide-react';

export const PopularProductCard: React.FC<{ product: Product }> = ({ product }) => {
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
      className="w-52 shrink-0 bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all select-none cursor-pointer"
    >
      <div>
        {/* Photo + In-stock badge */}
        <div className="relative h-36 rounded-xl bg-slate-100 overflow-hidden mb-2.5">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
            loading="lazy" 
          />
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>В наличии</span>
          </div>
        </div>

        {/* Title & subtitle */}
        <h3 className="font-bold text-xs text-slate-900 line-clamp-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
          {product.subtitle || `${product.weightKg} кг`}
        </p>
      </div>

      {/* Price & Cart row */}
      <div className="mt-3 pt-2.5 border-t border-slate-100">
        {/* Prominent Price */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-lg font-black text-slate-900 tracking-tight">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            /{product.unit}
          </span>
        </div>

        {/* Stepper and Button */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded-lg bg-white active:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
            >
              −
            </button>
            <span className="w-7 text-center text-xs font-black text-slate-900">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-lg bg-white active:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:bg-amber-600'
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

export const PopularProductsSection: React.FC = () => {
  const { products, setActiveTab } = useStore();
  const popularList = products.filter(p => p.isPopular).slice(0, 8);

  return (
    <div className="py-3">
      <div className="px-4 flex items-center justify-between mb-2.5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Часто покупают</h2>
          <p className="text-[11px] text-slate-500 font-medium">Популярные материалы с быстрой отгрузкой</p>
        </div>
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-xs font-bold text-amber-600 hover:text-amber-700"
        >
          Все &rarr;
        </button>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
        {popularList.map((product) => (
          <PopularProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
