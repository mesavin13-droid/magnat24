import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Check, Truck, Building, Calendar, CreditCard, QrCode, Banknote, Home, ShieldCheck } from 'lucide-react';
import { DeliveryMethod, PaymentMethod } from '../types';
import { WAREHOUSES } from '../data/mockData';

export const CheckoutScreen: React.FC = () => {
  const { 
    cartTotal, 
    user, 
    createOrder, 
    setActiveTab, 
    currentCity 
  } = useStore();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState(user.savedAddresses[0] || 'г. Новосибирск, ул. Ленина, д. 28, кв. 14');
  const [pickupPoint, setPickupPoint] = useState(WAREHOUSES[0].name);
  const [dateChoice, setDateChoice] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [timeSlot, setTimeSlot] = useState('14:00 - 18:00');
  const [name, setName] = useState(user.name || 'Иван Савин');
  const [phone, setPhone] = useState(user.phone || '+7 (902) 924-85-44');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sbp');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryPrice = deliveryMethod === 'pickup' ? 0 : 490;
  const finalTotal = cartTotal + deliveryPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      createOrder({
        customerName: name,
        customerPhone: phone,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? address : undefined,
        pickupPoint: deliveryMethod === 'pickup' ? pickupPoint : undefined,
        deliveryDate: dateChoice === 'today' ? 'Сегодня' : dateChoice === 'tomorrow' ? 'Завтра' : 'По согласованию',
        deliveryTimeSlot: timeSlot,
        paymentMethod,
        deliveryCost: deliveryPrice
      });
      setIsSubmitting(false);
      setActiveTab('orders');
    }, 600);
  };

  return (
    <div className="pb-32 sm:pb-36 bg-slate-50 min-h-screen animate-in fade-in duration-150">
      
      {/* Top bar with back and home shortcuts */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cart')}
            className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-bold transition-colors"
            title="Назад в корзину"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Корзина</span>
          </button>
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Оформление заказа
          </h1>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          title="На главную"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto text-xs">
        
        {/* Шаг 1: Получение */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px]">
            1. Способ получения
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              className={`p-3 rounded-xl border text-left font-bold transition-all flex items-center gap-2 ${
                deliveryMethod === 'delivery'
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-black'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Доставка</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={`p-3 rounded-xl border text-left font-bold transition-all flex items-center gap-2 ${
                deliveryMethod === 'pickup'
                  ? 'bg-amber-500 border-amber-500 text-slate-950 font-black'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Самовывоз</span>
            </button>
          </div>
        </div>

        {/* Шаг 2: Адрес доставки */}
        {deliveryMethod === 'delivery' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px]">
              2. Адрес доставки
            </label>
            <input
              type="text"
              required
              placeholder="Город, улица, дом, квартира/строение"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 border border-transparent"
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
            <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px]">
              2. Склад самовывоза
            </label>
            <select
              value={pickupPoint}
              onChange={(e) => setPickupPoint(e.target.value)}
              className="w-full bg-slate-100 rounded-xl px-3 py-2.5 font-bold text-slate-900 text-xs outline-none"
            >
              {WAREHOUSES.map(w => (
                <option key={w.id} value={w.name}>{w.name} — {w.address}</option>
              ))}
            </select>
          </div>
        )}

        {/* Шаг 3: Дата и время */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px]">
            3. Дата и время
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'today', label: 'Сегодня' },
              { id: 'tomorrow', label: 'Завтра' },
              { id: 'custom', label: 'Выбрать дату' },
            ].map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDateChoice(d.id as any)}
                className={`py-2 px-2 rounded-xl text-center font-bold transition-all ${
                  dateChoice === d.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full bg-slate-100 rounded-xl px-3 py-2 font-bold text-slate-800 text-xs outline-none mt-2"
          >
            <option value="10:00 - 14:00">10:00 - 14:00 (Утро)</option>
            <option value="14:00 - 18:00">14:00 - 18:00 (День)</option>
            <option value="18:00 - 21:00">18:00 - 21:00 (Вечер)</option>
          </select>
        </div>

        {/* Шаг 4: Контактные данные */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px]">
            4. Контактные данные
          </label>
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-[11px] block mb-0.5">Имя</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-slate-100 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs outline-none"
              />
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block mb-0.5">Телефон для связи</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 000-00-00"
                className="w-full bg-slate-100 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Шаг 5: Оплата */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <label className="block font-black text-slate-900 uppercase tracking-wider text-[11px]">
            5. Способ оплаты
          </label>
          <div className="space-y-2">
            {[
              { id: 'sbp', label: 'СБП (Система быстрых платежей)', desc: 'Моментально без комиссии', icon: QrCode },
              { id: 'card', label: 'Банковская карта (МИР, Visa, MC)', desc: 'Безопасный 3D Secure', icon: CreditCard },
              { id: 'upon_receipt', label: 'При получении', desc: 'Наличными или картой водителю', icon: Banknote },
            ].map(pm => {
              const Icon = pm.icon;
              const isSel = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSel
                      ? 'bg-amber-500/10 border-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSel ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs">{pm.label}</div>
                      <div className="text-[10px] text-slate-400">{pm.desc}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSel ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  }`}>
                    {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Submit Block inside the form */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isSubmitting ? 'Оформление заказа...' : `Подтвердить и оплатить (${finalTotal.toLocaleString('ru-RU')} ₽)`}
          </button>
          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Безопасный шлюз • Мгновенная фискализация чека</span>
          </div>
        </div>

        {/* Pinned Bottom Bar: Итого & Оплатить заказ */}
        <div className="fixed bottom-0 left-0 right-0 sm:max-w-[430px] sm:left-1/2 sm:-translate-x-1/2 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">
                Итого к оплате
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                {finalTotal.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5">
                {deliveryMethod === 'delivery' ? 'С учетом доставки' : 'Самовывоз со склада'}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 min-h-[48px] shrink-0 cursor-pointer active:scale-98"
            >
              {isSubmitting ? 'Оформление...' : 'Оплатить заказ'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
