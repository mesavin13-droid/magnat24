import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Award, 
  Printer, 
  Phone, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    orders, 
    products, 
    addToCart, 
    setSelectedProductId, 
    setActiveTab,
    toggleFavorite 
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'favorites' | 'profile' | 'bonuses'>('orders');
  const [selectedOrderForDoc, setSelectedOrderForDoc] = useState<Order | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);

  // Status badge helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Принят</span>;
      case 'paid':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Оплачен</span>;
      case 'assembling':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Комплектуется на складе</span>;
      case 'in_transit':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse">🚚 В пути к вам</span>;
      case 'delivered':
        return <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full">✅ Доставлен</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Отменен</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full">В обработке</span>;
    }
  };

  const favoriteProducts = products.filter((p) => user.favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* 1. Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            {user.name.charAt(0) || 'И'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                Статус: {user.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span>{user.phone}</span>
              <span>•</span>
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Bonus Points Card */}
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center gap-4 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Бонусные баллы «Магнат»</div>
            <div className="text-xl font-black text-amber-400">
              {user.bonusPoints.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'orders'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>История заказов ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('favorites')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'favorites'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Избранные товары ({favoriteProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Мой профиль и реквизиты</span>
        </button>
      </div>

      {/* 3. Subtabs Content */}

      {/* ORDERS TAB */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">У вас пока нет оформленных заказов</h3>
              <p className="text-xs text-slate-500 mt-1">Оформите первый заказ строительных материалов со скидкой новоселам!</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        Заказ #{order.orderNumber}
                      </span>
                      {getStatusBadge(order.orderStatus)}
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      Оформлен {formattedDate}
                    </div>
                  </div>

                  {/* Driver & Transit Tracker Bar (if in transit) */}
                  {order.driver && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>Водитель: {order.driver.name}</span>
                            <span className="font-mono bg-slate-900 text-amber-400 px-2 py-0.5 rounded text-[10px]">
                              {order.driver.vehicleNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            {order.driver.vehicleModel} &bull; {order.driver.currentLocationName || 'На маршруте доставки'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={`tel:${order.driver.phone.replace(/\s+/g, '')}`}
                          className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Позвонить водителю</span>
                        </a>

                        <button
                          onClick={() => setTrackingModalOrder(order)}
                          className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <span>Онлайн-трекер</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">&bull;</span>
                          <span className="font-semibold text-slate-800">{item.product.name}</span>
                        </div>
                        <span className="text-slate-600 font-mono font-medium">
                          {item.quantity} {item.product.unit} &bull; {(item.quantity * (item.quantity >= item.product.bulkThreshold ? item.product.bulkPrice : item.product.price)).toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Bottom Actions & Totals */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Способ доставки: </span>
                        <strong className="text-slate-800">{order.deliveryMethod === 'delivery' ? order.deliveryAddress : order.pickupPoint}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Итого: </span>
                        <strong className="text-base font-black text-slate-900">{order.totalAmount.toLocaleString('ru-RU')} ₽</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Print Invoice Button */}
                      <button
                        onClick={() => setSelectedOrderForDoc(order)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>Печать счета / УПД</span>
                      </button>

                      {/* Repeat Order */}
                      <button
                        onClick={() => {
                          order.items.forEach(i => addToCart(i.product, i.quantity));
                          setActiveTab('cart');
                        }}
                        className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Повторить заказ</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* FAVORITES TAB */}
      {activeSubTab === 'favorites' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Список избранного пуст</h3>
              <p className="text-xs text-slate-500 mt-1">Добавляйте понравившиеся стройматериалы сердечком на карточке товара</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 items-center">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</h4>
                    <div className="text-sm font-black text-amber-600 mt-0.5">{p.price} ₽/{p.unit}</div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="py-1 px-2.5 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-bold"
                      >
                        В корзину
                      </button>
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className="py-1 px-2 rounded-lg text-rose-500 hover:bg-rose-50 text-[11px] font-bold"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE & REQUISITES TAB */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <h3 className="text-lg font-black text-slate-900">Персональные данные и адреса</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ФИО клиента</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => updateUserProfile({ name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Телефон</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => updateUserProfile({ phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email для уведомлений</label>
              <input
                type="text"
                value={user.email}
                onChange={(e) => updateUserProfile({ email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Сохраненные адреса доставки</h4>
            <div className="space-y-2">
              {user.savedAddresses.map((addr, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{addr}</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Основной</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRACKING LIVE MAP MODAL */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">
                  Онлайн-трекер доставки #{trackingModalOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Route Map View */}
            <div className="relative h-64 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex flex-col justify-between p-4">
              {/* Map grid simulation */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs max-w-xs">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>Транспорт в движении</span>
                </div>
                <div className="text-slate-300 text-[11px] mt-1">
                  Водитель: {trackingModalOrder.driver?.name} ({trackingModalOrder.driver?.vehicleNumber})
                </div>
              </div>

              {/* Destination pin & vehicle marker */}
              <div className="relative z-10 flex items-center justify-between text-xs text-white">
                <div className="bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
                  🏢 Склад: ул. Кутузова 1 ст72
                </div>
                <div className="text-amber-400 font-bold animate-bounce">
                  🚚 ~18 минут до прибытия
                </div>
                <div className="bg-emerald-950/90 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-700">
                  📍 {trackingModalOrder.deliveryAddress?.slice(0, 24)}...
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              По прибытии на объект водитель свяжется с вами по номеру: <strong>{trackingModalOrder.customerPhone}</strong>. Пожалуйста, обеспечьте свободный подъезд для габаритов автомобиля.
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE / УПД MODAL */}
      {selectedOrderForDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Электронный счет-фактура и товарная накладная (УПД) #{selectedOrderForDoc.orderNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Печать документа</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-y-auto p-8 font-serif text-slate-900 text-xs space-y-6">
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="text-center font-bold text-lg">СЧЕТ НА ОПЛАТУ № {selectedOrderForDoc.orderNumber} от {new Date(selectedOrderForDoc.createdAt).toLocaleDateString('ru-RU')} г.</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <strong>Поставщик:</strong> ООО «Магнат»<br />
                  <strong>ИНН / КПП:</strong> 2464132890 / 246401001<br />
                  <strong>Адрес:</strong> 660093, г. Красноярск, ул. Академика Павлова, д. 27а, оф. 103<br />
                  <strong>Банк:</strong> ПАО «Сбербанк» г. Красноярск, БИК 040407627<br />
                  <strong>Р/счет:</strong> 40702810431000028491
                </div>

                <div>
                  <strong>Покупатель:</strong> {selectedOrderForDoc.customerName}<br />
                  <strong>Телефон:</strong> {selectedOrderForDoc.customerPhone}<br />
                  <strong>Адрес доставки:</strong> {selectedOrderForDoc.deliveryAddress || 'Самовывоз со склада'}<br />
                  <strong>Основание:</strong> Заказ в интернет-магазине магнат24.рф
                </div>
              </div>

              {/* Items table */}
              <table className="w-full border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-400 p-1.5">№</th>
                    <th className="border border-slate-400 p-1.5 text-left">Товары (работы, услуги)</th>
                    <th className="border border-slate-400 p-1.5">Кол-во</th>
                    <th className="border border-slate-400 p-1.5">Ед.</th>
                    <th className="border border-slate-400 p-1.5">Цена, руб.</th>
                    <th className="border border-slate-400 p-1.5">Сумма, руб.</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderForDoc.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-400 p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-slate-400 p-1.5">{it.product.name}</td>
                      <td className="border border-slate-400 p-1.5 text-center">{it.quantity}</td>
                      <td className="border border-slate-400 p-1.5 text-center">{it.product.unit}</td>
                      <td className="border border-slate-400 p-1.5 text-right">{it.product.price}</td>
                      <td className="border border-slate-400 p-1.5 text-right font-bold">{(it.quantity * it.product.price).toLocaleString('ru-RU')}</td>
                    </tr>
                  ))}
                  {selectedOrderForDoc.deliveryCost > 0 && (
                    <tr>
                      <td className="border border-slate-400 p-1.5 text-center">{selectedOrderForDoc.items.length + 1}</td>
                      <td className="border border-slate-400 p-1.5">Доставка автотранспортом ({selectedOrderForDoc.deliveryVehicleRequired})</td>
                      <td className="border border-slate-400 p-1.5 text-center">1</td>
                      <td className="border border-slate-400 p-1.5 text-center">рейс</td>
                      <td className="border border-slate-400 p-1.5 text-right">{selectedOrderForDoc.deliveryCost}</td>
                      <td className="border border-slate-400 p-1.5 text-right font-bold">{selectedOrderForDoc.deliveryCost.toLocaleString('ru-RU')}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="text-right text-xs space-y-1">
                <div><strong>Итого к оплате: {selectedOrderForDoc.totalAmount.toLocaleString('ru-RU')} руб.</strong></div>
                <div className="text-slate-500">В том числе НДС (20%): {Math.round(selectedOrderForDoc.totalAmount * 0.2).toLocaleString('ru-RU')} руб.</div>
              </div>

              <div className="pt-8 flex justify-between items-end border-t border-slate-300">
                <div>
                  <div className="font-bold">Руководитель предприятия: _________________ (Магнат О.В.)</div>
                  <div className="mt-4 font-bold">Главный бухгалтер: _________________ (Иванова С.М.)</div>
                </div>
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-600 flex items-center justify-center text-[10px] text-blue-700 font-bold uppercase text-center rotate-[-12deg]">
                  ООО «МАГНАТ»<br />Для документов<br />г. Красноярск
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
