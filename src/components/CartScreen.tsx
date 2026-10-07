import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Truck, ShieldCheck, Home, CheckCircle2 } from 'lucide-react';

export const CartScreen: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal,
    cartWeightTotal,
    setActiveTab,
    setSelectedProductId,
    deviceMode
  } = useStore();

  const totalItemCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const isDesktop = deviceMode === 'desktop';

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-900">Ваша корзина пуста</h2>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Выберите нужные товары в каталоге или воспользуйтесь быстрым подбором материалов
        </p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="mt-5 py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs"
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-[#F4F5F7] min-h-screen animate-in fade-in duration-150 ${isDesktop ? 'pb-16' : 'pb-32 sm:pb-36'}`}>
      
      {/* Top Header bar with back and home shortcuts */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-bold transition-colors"
            aria-label="Назад в каталог"
            title="Назад в каталог"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Каталог</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="На главную"
            title="На главную"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="ml-1">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">Корзина</h1>
            <p className="text-[11px] text-slate-500 font-semibold">{totalItemCount} товаров в заказе</p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-600 font-bold px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Очистить
        </button>
      </div>

      {/* Main Content Layout */}
      <div className={`p-3 sm:p-5 max-w-lg mx-auto space-y-3 ${isDesktop ? 'max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 space-y-0' : ''}`}>
        
        {/* Left / Main Column: Items List */}
        <div className={`space-y-2.5 ${isDesktop ? 'md:col-span-2' : ''}`}>
          {cart.map((item) => {
            const isBulk = item.quantity >= item.product.bulkThreshold;
            const unitPrice = isBulk ? item.product.bulkPrice : item.product.price;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 flex gap-3 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Photo */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  onClick={() => { setSelectedProductId(item.product.id); setActiveTab('product-detail'); }}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 shrink-0 cursor-pointer"
                />

                {/* Details & Actions */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 
                        onClick={() => { setSelectedProductId(item.product.id); setActiveTab('product-detail'); }}
                        className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 cursor-pointer hover:text-amber-600 leading-snug"
                      >
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 -mr-1 shrink-0"
                        title="Удалить из корзины"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                      {item.product.subtitle || `${unitPrice} ₽ / ${item.product.unit}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    {/* Stepper with clear touch targets */}
                    <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white active:bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-2xs cursor-pointer"
                        aria-label="Уменьшить количество"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white active:bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm shadow-2xs cursor-pointer"
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {itemTotal.toLocaleString('ru-RU')} ₽
                      </div>
                      {isBulk && (
                        <span className="text-[10px] text-emerald-700 font-bold">Опт применен</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Heavy load & logistics note */}
          {cartWeightTotal > 0 && (
            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 flex justify-between items-center font-medium shadow-2xs">
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Вес заказа:</span>
              </span>
              <strong className="text-slate-900 font-black">
                {cartWeightTotal >= 1000 ? `${(cartWeightTotal / 1000).toFixed(2)} т` : `${cartWeightTotal} кг`}
              </strong>
            </div>
          )}

          {/* Inline Order Summary Card for Mobile (Scrollable flow) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
            <h2 className="font-black text-sm text-slate-900">Сводка по заказу</h2>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Товары ({totalItemCount} шт.):</span>
                <span className="font-bold text-slate-900">{cartSubtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Оптовая скидка:</span>
                  <span>-{cartDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Доставка по городу:</span>
                <span className="font-semibold text-slate-900">от 490 ₽</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">Итого:</span>
                <span className="text-xl font-black text-slate-900">
                  {cartTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            {/* Direct prominent inline CTA button */}
            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Перейти к оформлению ({cartTotal.toLocaleString('ru-RU')} ₽)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Безопасная оплата • СБП, карты РФ, безнал</span>
            </div>
          </div>

          {/* Continue shopping button */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>+ В каталог</span>
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>На главную</span>
            </button>
          </div>
        </div>

        {/* Desktop Sidebar Summary Card (only when in desktop view) */}
        {isDesktop && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm h-fit sticky top-24">
            <h2 className="font-black text-base text-slate-900">Сумма заказа</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Товары ({totalItemCount} шт.):</span>
                <span className="font-bold text-slate-900">{cartSubtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Оптовая скидка:</span>
                  <span>-{cartDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Доставка:</span>
                <span className="font-semibold text-slate-900">от 490 ₽</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">Итого:</span>
                <span className="text-2xl font-black text-slate-900">
                  {cartTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Безопасная оплата СБП / Карты / Счёт</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Уведомления статуса в Telegram</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Pinned Mobile Bottom Bar: ALWAYS visible, centered with phone frame, 100% unobstructed */}
      {!isDesktop && (
        <div className="fixed bottom-0 left-0 right-0 sm:max-w-[430px] sm:left-1/2 sm:-translate-x-1/2 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between gap-3">
            
            {/* Total breakdown */}
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">
                Итого к оплате
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                {cartTotal.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[10px] text-emerald-700 font-bold leading-none mt-0.5">
                {cartDiscount > 0 ? `Скидка ${cartDiscount.toLocaleString('ru-RU')} ₽` : 'Доставка от 490 ₽'}
              </div>
            </div>

            {/* Huge unhindered Checkout Button */}
            <button
              onClick={() => setActiveTab('checkout')}
              className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 shrink-0 min-h-[48px] cursor-pointer"
              aria-label="Перейти к оформлению заказа"
            >
              <span>Оформить</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
