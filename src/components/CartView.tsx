import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Truck, 
  Scale, 
  Box, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal, 
    cartWeightTotal, 
    cartVolumeTotal, 
    recommendedVehicle,
    setActiveTab,
    setSelectedProductId
  } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Ваша корзина пока пуста</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
          Выберите нужные стройматериалы в каталоге или воспользуйтесь инженерным калькулятором для точного расчета.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveTab('catalog')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-md"
          >
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Корзина заказа</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Проверьте состав заказа, объем и рекомендуемый автотранспорт для доставки
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Очистить корзину</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const isBulk = item.quantity >= item.product.bulkThreshold;
            const unitPrice = isBulk ? item.product.bulkPrice : item.product.price;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-amber-400 transition-colors"
              >
                {/* Product image and title */}
                <div 
                  onClick={() => setSelectedProductId(item.product.id)}
                  className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      АРТ: {item.product.sku}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-amber-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>{unitPrice.toLocaleString('ru-RU')} ₽ / {item.product.unit}</span>
                      {isBulk && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Оптовая цена
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepper, subtotal and delete */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {/* Stepper */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - (item.product.category === 'brick' ? 50 : 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition-colors text-xs"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 text-center font-bold text-xs bg-transparent outline-none text-slate-900"
                    />
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + (item.product.category === 'brick' ? 50 : 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[100px]">
                    <div className="text-base font-extrabold text-slate-900">
                      {itemTotal.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {(item.product.weightKg * item.quantity).toFixed(0)} кг
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Logistics & Vehicle Recommendation Panel */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold">Инженерный расчет веса и логистики заказа</h3>
              </div>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Автоподбор ТС
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Общий вес груза:</span>
                </div>
                <div className="text-base font-extrabold text-white mt-1">
                  {cartWeightTotal >= 1000 ? `${(cartWeightTotal / 1000).toFixed(2)} тонн` : `${cartWeightTotal.toFixed(0)} кг`}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-sky-400" />
                  <span>Общий объем партии:</span>
                </div>
                <div className="text-base font-extrabold text-white mt-1">
                  {cartVolumeTotal.toFixed(2)} м³
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Рекомендуемый транспорт:</span>
                </div>
                <div className="text-sm font-bold text-amber-400 mt-1">
                  {recommendedVehicle.name}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
              💡 {recommendedVehicle.desc} (базовый тариф доставки: {recommendedVehicle.cost.toLocaleString('ru-RU')} ₽ по городу).
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Checkout Button */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-black text-slate-900">Итого по заказу</h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Товары ({cart.length} поз.):</span>
                <span className="font-semibold text-slate-900">{cartSubtotal.toLocaleString('ru-RU')} ₽</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Оптовая экономия:</span>
                  <span>- {cartDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Ориентировочная доставка:</span>
                <span className="font-semibold text-slate-900">{recommendedVehicle.cost.toLocaleString('ru-RU')} ₽</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900">Всего к оплате:</span>
                <span className="text-2xl font-black text-amber-600">
                  {(cartTotal + recommendedVehicle.cost).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('checkout')}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <span>Перейти к оформлению</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className="w-full py-3 px-4 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Продолжить покупки в каталоге</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Безопасная оплата: СБП, карты РФ (МИР), безнал</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Мгновенный трекинг через Telegram-бота</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
