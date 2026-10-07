import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Scale, 
  Truck, 
  Sparkles,
  Plus
} from 'lucide-react';

export const ProductDetailScreen: React.FC = () => {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    products, 
    addToCart, 
    toggleFavorite, 
    isFavorite,
    setActiveTab 
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[1]; // default to Knauf Rotband if none
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const isFav = isFavorite(product.id);

  // Gallery images (product photo + variations)
  const photos = product.gallery || [
    product.image,
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'
  ];

  // Compatible cross-sell items
  const compatibleProducts = (product.compatibleProductIds || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 800);
  };

  return (
    <div className="pb-28 bg-white min-h-screen animate-in fade-in duration-150">
      
      {/* Top action bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-30">
        <button
          onClick={() => setActiveTab('catalog')}
          className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>

        <button
          onClick={() => toggleFavorite(product.id)}
          className={`p-2 rounded-xl transition-colors ${
            isFav ? 'bg-rose-50 text-rose-500' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
          }`}
          aria-label="В избранное"
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 1. Photo Gallery */}
      <div className="px-4 pt-3">
        <div className="relative aspect-4/3 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
          <img
            src={photos[activePhotoIdx]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
            АРТ: {product.sku}
          </div>
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 mt-2.5">
            {photos.map((img, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  activePhotoIdx === i ? 'border-amber-500 scale-102' : 'border-slate-200 opacity-70'
                }`}
              >
                <img src={img} alt="Превью" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Product Info */}
      <div className="px-4 pt-4 space-y-4">
        {/* Availability & Rating */}
        <div className="flex items-center justify-between">
          <div className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>В наличии</span>
          </div>

          <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-slate-900">{product.rating}</span>
            <span className="text-slate-400 font-normal">({product.reviewsCount} отзывов)</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">
            {product.subtitle || product.category}
          </p>
        </div>

        {/* Price & Unit breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {product.price.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              {product.unitPriceLabel || `${product.price} ₽ / ${product.unit}`}
            </div>
          </div>

          {product.bulkThreshold && (
            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                Опт от {product.bulkThreshold} {product.unit}
              </span>
              <div className="text-xs font-black text-slate-800 mt-1">
                {product.bulkPrice} ₽ /{product.unit}
              </div>
            </div>
          )}
        </div>

        {/* Quantity Stepper & Main Big Button */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 rounded-xl bg-white active:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm shadow-2xs"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-black text-slate-900">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-10 h-10 rounded-xl bg-white active:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-sm shadow-2xs"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Добавлено!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Добавить в корзину ({(product.price * qty).toLocaleString('ru-RU')} ₽)</span>
              </>
            )}
          </button>
        </div>

        {/* Description */}
        <div className="pt-2">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        {/* 3. Tech Specs Table */}
        <div className="pt-4 border-t border-slate-200">
          <h2 className="font-extrabold text-sm text-slate-900 mb-3 tracking-tight">Характеристики</h2>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex justify-between p-3 odd:bg-slate-50 even:bg-white">
                <span className="text-slate-500 font-medium">{spec.label}</span>
                <span className="text-slate-900 font-bold text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. «Подходит вместе» (Cross-sell) */}
        {compatibleProducts.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h2 className="font-extrabold text-sm text-slate-900 mb-2.5 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Подходит вместе</span>
            </h2>

            <div className="space-y-2">
              {compatibleProducts.map((cp) => (
                <div 
                  key={cp.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <img src={cp.image} alt={cp.name} className="w-11 h-11 rounded-xl object-cover bg-white shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">{cp.name}</div>
                    <div className="text-[11px] font-black text-amber-700">{cp.price} ₽</div>
                  </div>

                  <button
                    onClick={() => addToCart(cp, 1)}
                    className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Купить</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
