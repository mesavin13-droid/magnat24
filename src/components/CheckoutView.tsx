import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { WAREHOUSES, COMPANY_INFO } from '../data/mockData';
import { PaymentMethod, DeliveryMethod, LegalEntityDetails } from '../types';
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  Truck, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  Smartphone,
  Lock,
  Sparkles,
  Building2,
  AlertCircle
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartTotal, 
    cartWeightTotal, 
    cartVolumeTotal, 
    recommendedVehicle,
    currentCity,
    user,
    createOrder,
    setActiveTab,
    setActiveOrder
  } = useStore();

  // Form states
  const [customerType, setCustomerType] = useState<'individual' | 'legal'>('individual');
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '+7 (902) 924-85-44');
  const [email, setEmail] = useState(user.email || 'me.savin13@gmail.com');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState(user.savedAddresses[0] || 'г. Красноярск, ул. Елены Стасовой, д. 48Г');
  const [pickupPoint, setPickupPoint] = useState(WAREHOUSES[1].name);
  const [deliveryDate, setDeliveryDate] = useState('2026-10-08');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('10:00 - 14:00');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sbp');

  // Legal details
  const [legalDetails, setLegalDetails] = useState<LegalEntityDetails>({
    companyName: 'ООО «СибСтройМонтаж»',
    inn: '2465298101',
    kpp: '246501001',
    ogrn: '1142468001923',
    legalAddress: '660077, г. Красноярск, ул. 78 Добровольческой Бригады, д. 14а',
    bankName: 'Сибирский банк ПАО Сбербанк',
    bik: '040407627',
    checkingAccount: '40702810931000049211',
    correspondentAccount: '30101810800000000627'
  });

  // Payment UI simulation state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  // Card form simulation
  const [cardNumber, setCardNumber] = useState('2200 7001 8492 3847');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('849');

  const deliveryCost = deliveryMethod === 'pickup' ? 0 : recommendedVehicle.cost;
  const finalTotal = cartTotal + deliveryCost;

  const handleFillDemoLegal = () => {
    setCustomerType('legal');
    setName('Генеральный директор Савин И.С.');
    setLegalDetails({
      companyName: 'ООО «СибСтройМонтаж»',
      inn: '2465298101',
      kpp: '246501001',
      ogrn: '1142468001923',
      legalAddress: '660077, г. Красноярск, ул. 78 Добровольческой Бригады, д. 14а',
      bankName: 'Сибирский банк ПАО Сбербанк',
      bik: '040407627',
      checkingAccount: '40702810931000049211',
      correspondentAccount: '30101810800000000627'
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Simulate online gateway processing latency
    await new Promise(r => setTimeout(r, 1200));

    const newOrder = createOrder({
      customerType,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      legalDetails: customerType === 'legal' ? legalDetails : undefined,
      deliveryMethod,
      city: currentCity,
      deliveryAddress: deliveryMethod === 'delivery' ? address : undefined,
      pickupPoint: deliveryMethod === 'pickup' ? pickupPoint : undefined,
      deliveryDate,
      deliveryTimeSlot,
      deliveryVehicleRequired: recommendedVehicle.name,
      comment,
      paymentMethod,
      paymentStatus: paymentMethod === 'invoice' ? 'pending' : 'paid',
      deliveryCost,
    });

    setIsProcessingPayment(false);
    setPaymentSuccess(true);
    setCreatedOrderNumber(newOrder.orderNumber);
    setActiveOrder(newOrder);
  };

  if (paymentSuccess && createdOrderNumber) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase">
              Заказ оформлен &bull; Оплата подтверждена
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Спасибо за заказ #{createdOrderNumber}!
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
              Заказ передан в отдел комплектации складов ООО «Магнат». Уведомления со статусами и контактами водителя отправлены в ваш Telegram-бот.
            </p>
          </div>

          {/* Key order specs */}
          <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Получатель:</span>
              <span className="font-bold text-slate-900">{name} ({phone})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Способ получения:</span>
              <span className="font-bold text-slate-900">
                {deliveryMethod === 'delivery' ? `Доставка: ${address}` : `Самовывоз: ${pickupPoint}`}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Транспорт:</span>
              <span className="font-bold text-slate-900">{recommendedVehicle.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Способ оплаты:</span>
              <span className="font-bold text-emerald-600">
                {paymentMethod === 'sbp' && 'СБП (Система быстрых платежей)'}
                {paymentMethod === 'card' && 'Банковская карта (МИР)'}
                {paymentMethod === 'tpay' && 'T-Pay (Tinkoff Pay)'}
                {paymentMethod === 'sberpay' && 'SberPay'}
                {paymentMethod === 'invoice' && 'Безналичный счет (сформирован)'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-bold">Итоговая сумма:</span>
              <span className="text-sm font-black text-slate-900">{finalTotal.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => setActiveTab('account')}
              className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-md"
            >
              Перейти в Личный кабинет к отслеживанию
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
            >
              Вернуться в каталог
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('cart')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Оформление заказа</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Заполните данные для доставки и выберите удобный способ онлайн-оплаты
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 cols: Details & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: Customer Type */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">1</span>
                <span>Данные покупателя</span>
              </h2>

              <button
                type="button"
                onClick={handleFillDemoLegal}
                className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Заполнить юр. лицо (демо)</span>
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCustomerType('individual')}
                className={`py-3 px-4 rounded-2xl border text-left font-bold text-xs flex items-center gap-3 transition-all ${
                  customerType === 'individual'
                    ? 'border-amber-500 bg-amber-50 text-slate-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${customerType === 'individual' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                  {customerType === 'individual' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
                <span>Физическое лицо</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerType('legal')}
                className={`py-3 px-4 rounded-2xl border text-left font-bold text-xs flex items-center gap-3 transition-all ${
                  customerType === 'legal'
                    ? 'border-amber-500 bg-amber-50 text-slate-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${customerType === 'legal' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                  {customerType === 'legal' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
                <span>Юридическое лицо / ИП</span>
              </button>
            </div>

            {/* General inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ФИО контактного лица *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Савин"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Телефон для смс/звонка *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email для чека/счета *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@mail.ru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Legal fields if legal */}
            {customerType === 'legal' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Реквизиты организации для счета и УПД</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Наименование компании</label>
                    <input
                      type="text"
                      value={legalDetails.companyName}
                      onChange={(e) => setLegalDetails({ ...legalDetails, companyName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">ИНН / КПП</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={legalDetails.inn}
                        onChange={(e) => setLegalDetails({ ...legalDetails, inn: e.target.value })}
                        placeholder="ИНН"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                      />
                      <input
                        type="text"
                        value={legalDetails.kpp || ''}
                        onChange={(e) => setLegalDetails({ ...legalDetails, kpp: e.target.value })}
                        placeholder="КПП"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Юридический адрес</label>
                    <input
                      type="text"
                      value={legalDetails.legalAddress}
                      onChange={(e) => setLegalDetails({ ...legalDetails, legalAddress: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Delivery Method */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">2</span>
              <span>Способ получения и адрес</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'border-amber-500 bg-amber-50/70 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold">Доставка транспортом</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-normal">
                  {recommendedVehicle.name} • от {recommendedVehicle.cost} ₽
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-amber-500 bg-amber-50/70 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Самовывоз со склада</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-normal">
                  Бесплатно • 3 склада в Красноярске/НСК
                </div>
              </button>
            </div>

            {deliveryMethod === 'delivery' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Адрес доставки (город, улица, дом, объект) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="г. Красноярск, ул. Елены Стасовой, д. 48Г"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Дата доставки</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Временной интервал</label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
                    >
                      <option value="09:00 - 13:00">09:00 - 13:00 (Утро)</option>
                      <option value="13:00 - 17:00">13:00 - 17:00 (День)</option>
                      <option value="17:00 - 20:00">17:00 - 20:00 (Вечер)</option>
                      <option value="Срочно за 3 часа">Срочно за 3 часа (+1000 ₽)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Выберите склад для самовывоза:</label>
                <select
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  {WAREHOUSES.filter(w => !w.isMainOffice).map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name} ({w.address}) — {w.workHours}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Комментарий к заказу и проезду</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Например: заезд со стороны шлагбаума, разгрузка у левого ангара, нужен длинный вылет стрелы манипулятора..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* STEP 3: Online Payment Gateways */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">3</span>
              <span>Способ онлайн-оплаты</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* SBP */}
              <button
                type="button"
                onClick={() => setPaymentMethod('sbp')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'sbp'
                    ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <div className="text-xs font-bold">СБП (QR-код)</div>
                <div className="text-[10px] text-emerald-600 font-medium">0% комиссии</div>
              </button>

              {/* Bank Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <div className="text-xs font-bold">Карта (МИР/Visa)</div>
                <div className="text-[10px] text-slate-400">3D Secure</div>
              </button>

              {/* T-Pay / SberPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('tpay')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'tpay'
                    ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
                <div className="text-xs font-bold">T-Pay / SberPay</div>
                <div className="text-[10px] text-slate-400">В 1 клик</div>
              </button>

              {/* Invoice */}
              <button
                type="button"
                onClick={() => setPaymentMethod('invoice')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'invoice'
                    ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
                <div className="text-xs font-bold">Счет на оплату</div>
                <div className="text-[10px] text-slate-400">Для юр. лиц</div>
              </button>
            </div>

            {/* Payment Sub-Gateways View */}
            <div className="pt-3 border-t border-slate-100">
              {/* SBP Dynamic QR simulation */}
              {paymentMethod === 'sbp' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl border border-amber-300 shadow-sm flex items-center justify-center shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://magnat24.rf/pay/sbp?sum=${finalTotal}&order=M${Date.now()}`}
                      alt="QR-код СБП"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs text-slate-700 space-y-1.5 text-center sm:text-left">
                    <div className="font-extrabold text-sm text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                      <span>Оплата через Систему быстрых платежей</span>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">Мгновенно</span>
                    </div>
                    <p className="text-slate-500">
                      Отсканируйте динамический QR-код в приложении любого банка (Сбер, Т-Банк, ВТБ, Альфа-Банк). Средства зачисляются за 3 секунды без комиссии.
                    </p>
                  </div>
                </div>
              )}

              {/* Bank card input fields */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Защищенный платежный шлюз (МИР / Visa / Mastercard)</span>
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Номер банковской карты</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Срок действия</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="ММ/ГГ"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* T-Pay */}
              {paymentMethod === 'tpay' && (
                <div className="p-4 rounded-2xl bg-yellow-50/70 border border-yellow-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Быстрая оплата в 1 клик через T-Pay или SberPay</div>
                  <p className="text-slate-500">После нажатия кнопки «Оплатить заказ» откроется защищенное окно подтверждения в мобильном приложении банка.</p>
                </div>
              )}

              {/* Invoice for Legal entities */}
              {paymentMethod === 'invoice' && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Безналичная оплата для юридических лиц с НДС 20%</span>
                  </div>
                  <p className="text-slate-600">
                    Счет на оплату от ООО «Магнат» (ИНН 2464132890) с факсимиле и печатью сформируется автоматически сразу после отправки заказа.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right col: Order calculation summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-28">
            <h3 className="text-lg font-black text-slate-900">Ваш заказ</h3>

            {/* Compact items list */}
            <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2 flex justify-between gap-2">
                  <span className="text-slate-700 line-clamp-1 flex-1 font-medium">
                    {item.product.name}
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">
                    {item.quantity} {item.product.unit} &bull; {(item.quantity * (item.quantity >= item.product.bulkThreshold ? item.product.bulkPrice : item.product.price)).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Товары:</span>
                <span className="font-semibold text-slate-900">{cartSubtotal.toLocaleString('ru-RU')} ₽</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Оптовая скидка:</span>
                  <span>- {cartDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Доставка ({deliveryMethod === 'pickup' ? 'Самовывоз' : recommendedVehicle.name}):</span>
                <span className="font-semibold text-slate-900">{deliveryCost.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">Итого:</span>
                <span className="text-2xl font-black text-amber-600">
                  {finalTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessingPayment}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Обработка транзакции...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Оплатить и оформить заказ</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Шифрование платежей по протоколу TLS 1.3 / ГОСТ</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
