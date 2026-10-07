import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { WAREHOUSES, COMPANY_INFO } from '../data/mockData';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  Check, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Scale, 
  Box, 
  Phone, 
  FileText,
  Star,
  Sparkles
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    products, 
    addToCart, 
    toggleFavorite, 
    isFavorite,
    currentCity,
    setActiveTab,
    setIsCalculatorOpen
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId);
  const [quantity, setQuantity] = useState(product?.minOrder || 1);
  const [activeTab, setActiveModalTab] = useState<'specs' | 'warehouses' | 'delivery' | 'reviews'>('specs');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isFav = isFavorite(product.id);
  const isBulkApplied = quantity >= product.bulkThreshold;
  const currentUnitPrice = isBulkApplied ? product.bulkPrice : product.price;
  const totalPrice = currentUnitPrice * quantity;
  const totalWeight = ((product.weightKg || 1) * quantity).toFixed(1);
  const totalVolume = ((product.volumeM3 || 0.01) * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 800);
  };

  const handleQuickCheckout = () => {
    addToCart(product, quantity);
    setSelectedProductId(null);
    setActiveTab('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg">
              АРТ: {product.sku}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Категория: <strong className="text-slate-800">{product.brand}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`p-2 rounded-xl transition-colors ${
                isFav ? 'bg-rose-50 text-rose-500' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedProductId(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-4/3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Гарантия качества по ГОСТ</span>
                </div>
              </div>

              {/* Quick Logistics Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Общий вес</div>
                    <div className="text-xs font-bold text-slate-900">{totalWeight} кг</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Общий объем</div>
                    <div className="text-xs font-bold text-slate-900">{totalVolume} м³</div>
                  </div>
                </div>
              </div>

              {/* Calculator Callout */}
              <button
                onClick={() => { setSelectedProductId(null); setIsCalculatorOpen(true); }}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Рассчитать точный объем в калькуляторе</span>
              </button>
            </div>

            {/* Right: Pricing, Specs & Actions */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{product.reviewsCount} отзывов покупателей</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-semibold">В наличии на складах</span>
                </div>

                {/* Price block */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[11px] uppercase font-bold text-slate-500">Цена за единицу</div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {currentUnitPrice.toLocaleString('ru-RU')} ₽ <span className="text-sm font-semibold text-slate-500">/{product.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] uppercase font-bold text-slate-500">Итоговая сумма</div>
                      <div className="text-2xl sm:text-3xl font-black text-amber-600">
                        {totalPrice.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>

                  {product.bulkThreshold && (
                    <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-600">Оптовая цена при заказе от {product.bulkThreshold} {product.unit}:</span>
                      <strong className="text-emerald-700 font-bold">{product.bulkPrice} ₽/{product.unit}</strong>
                    </div>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-700">Количество ({product.unit}):</span>
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(product.minOrder || 1, prev - 1))}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={product.minOrder || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minOrder || 1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center font-extrabold text-sm bg-transparent outline-none text-slate-900"
                    />
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>Добавлено в корзину!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>В корзину ({totalPrice.toLocaleString('ru-RU')} ₽)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleQuickCheckout}
                  className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <span>Купить сразу</span>
                </button>
              </div>
            </div>

          </div>

          {/* Sub-tabs: Tech specs, Warehouse Stock, Delivery */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveModalTab('specs')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Характеристики и ГОСТ
              </button>
              <button
                onClick={() => setActiveModalTab('warehouses')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'warehouses'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Наличие на складах
              </button>
              <button
                onClick={() => setActiveModalTab('delivery')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'delivery'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Доставка и разгрузка
              </button>
            </div>

            <div className="pt-4">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-100 text-xs">
                      <span className="text-slate-500">{spec.label}</span>
                      <strong className="text-slate-900 font-semibold">{spec.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'warehouses' && (
                <div className="space-y-3">
                  {WAREHOUSES.filter(w => !w.isMainOffice).map((w) => {
                    const isKrsk = w.city === 'Красноярск';
                    const stock = isKrsk ? product.stockKrasnoyarsk : product.stockNovosibirsk;
                    return (
                      <div key={w.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-amber-600" />
                          <div>
                            <div className="font-bold text-xs text-slate-900">{w.name}</div>
                            <div className="text-[11px] text-slate-500">{w.address} • {w.workHours}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-600">{stock} {product.unit}</div>
                          <div className="text-[10px] text-slate-400">Самовывоз доступен</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>🚚 <strong>Собственный автопарк:</strong> Доставка по Красноярску и пригороду (Емельяново, Солонцы, Дивногорск, Березовка) манипуляторами, самосвалами и Газелями.</p>
                  <p>⏱ <strong>Срочная доставка:</strong> от 2-3 часов с момента подтверждения оплаты.</p>
                  <p>🏗 <strong>Разгрузка:</strong> Манипуляторы с грузоподъемностью стрелы до 3 тонн обеспечивают разгрузку и подъем материалов на объект.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
