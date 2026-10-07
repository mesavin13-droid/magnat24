import React from 'react';
import { useStore } from '../context/StoreContext';
import { Check, Clock, Truck, CheckCircle2, Phone, RotateCcw, Package } from 'lucide-react';
import { OrderStatus } from '../types';

export const OrdersScreen: React.FC = () => {
  const { orders, repeatOrder, setActiveTab } = useStore();

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
        <Package className="w-12 h-12 text-slate-300 mb-2" />
        <h2 className="text-base font-bold text-slate-900">У вас пока нет активных заказов</h2>
        <p className="text-xs text-slate-500 mt-1">Оформите первый заказ в каталоге</p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="mt-4 py-2.5 px-5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs"
        >
          В каталог
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 bg-slate-50 min-h-screen animate-in fade-in duration-150">
      
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Мои заказы</h1>
        <p className="text-xs text-slate-500 font-semibold">История покупок и текущие доставки</p>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {orders.map((order) => {
          // Status steps logic
          const steps: { key: OrderStatus; label: string }[] = [
            { key: 'new', label: 'Заказ принят' },
            { key: 'assembling', label: 'Собираем' },
            { key: 'in_transit', label: 'Передан в доставку' },
            { key: 'delivered', label: 'Доставлен' },
          ];

          const getStepState = (stepKey: OrderStatus) => {
            const orderStatusRank: Record<string, number> = {
              'new': 1,
              'paid': 1,
              'processing': 1,
              'assembling': 2,
              'in_transit': 3,
              'delivered': 4,
              'cancelled': 0
            };
            const currentRank = orderStatusRank[order.orderStatus] || 1;
            const stepRank = orderStatusRank[stepKey] || 1;

            if (currentRank > stepRank) return 'completed';
            if (currentRank === stepRank) return 'current';
            return 'pending';
          };

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4"
            >
              {/* Order number & price */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Заказ №{order.orderNumber}
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {order.deliveryDate} &bull; {order.deliveryTimeSlot || '14:00 - 18:00'}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900">
                    {order.totalAmount.toLocaleString('ru-RU')} ₽
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {order.paymentMethod === 'sbp' ? 'СБП' : order.paymentMethod === 'card' ? 'Карта' : 'При получении'}
                  </span>
                </div>
              </div>

              {/* Status Stepper Checklist */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Статус доставки:
                </div>
                {steps.map((s, idx) => {
                  const state = getStepState(s.key);
                  return (
                    <div key={idx} className="flex items-center gap-2.5 text-xs">
                      {state === 'completed' && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      {state === 'current' && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 animate-pulse">
                          <Clock className="w-3 h-3" />
                        </div>
                      )}
                      {state === 'pending' && (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 text-transparent flex items-center justify-center shrink-0">
                          &bull;
                        </div>
                      )}

                      <span className={`${
                        state === 'completed' ? 'text-slate-800 font-bold' :
                        state === 'current' ? 'text-slate-900 font-black' :
                        'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Address & Driver Details */}
              <div className="text-xs space-y-1 text-slate-600">
                <div>
                  <span className="text-slate-400">Адрес: </span>
                  <strong className="text-slate-800 font-bold">{order.deliveryAddress || order.pickupPoint}</strong>
                </div>

                {order.driver && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-between mt-2">
                    <div>
                      <div className="text-amber-900 font-bold">Водитель: {order.driver.name}</div>
                      <div className="text-[11px] text-amber-700">{order.driver.vehicleModel} ({order.driver.vehicleNumber})</div>
                    </div>
                    <a
                      href={`tel:${order.driver.phone.replace(/\s+/g, '')}`}
                      className="py-1.5 px-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Вызов</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Items summary */}
              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                {order.items.map((i, idxx) => (
                  <div key={idxx} className="flex justify-between text-slate-600">
                    <span className="line-clamp-1">{i.product.name} × {i.quantity}</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {(i.quantity * i.product.price).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>

              {/* Repeat button */}
              <button
                onClick={() => repeatOrder(order.id)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Повторить заказ</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
