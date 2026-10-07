import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus, Product, DriverInfo } from '../types';
import { CATEGORIES, WAREHOUSES } from '../data/mockData';
import { 
  ShieldCheck, 
  Package, 
  Boxes, 
  Truck, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Search, 
  Check, 
  X, 
  FileText,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Send
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    updateOrderPayment, 
    products, 
    updateProduct, 
    addProduct, 
    deleteProduct,
    sendTelegramMessage,
    setActiveTab
  } = useStore();

  const [adminSubTab, setAdminSubTab] = useState<'orders' | 'products' | 'logistics' | 'analytics'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  
  // Driver assignment modal
  const [selectedOrderForDriver, setSelectedOrderForDriver] = useState<Order | null>(null);
  const [driverName, setDriverName] = useState('Алексей Кузнецов');
  const [driverPhone, setDriverPhone] = useState('+7 (913) 540-19-82');
  const [vehicleModel, setVehicleModel] = useState('КамАЗ Манипулятор 5т');
  const [vehicleNumber, setVehicleNumber] = useState('М 420 УХ 124');
  const [estimatedArrival, setEstimatedArrival] = useState('45 минут');

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProdData, setNewProdData] = useState<Partial<Product>>({
    name: '',
    sku: 'PROD-' + Math.floor(100 + Math.random() * 900),
    category: 'keramzit',
    price: 300,
    bulkPrice: 270,
    bulkThreshold: 20,
    unit: 'мешок',
    stockKrasnoyarsk: 500,
    stockNovosibirsk: 200,
    minOrder: 1,
    weightKg: 25,
    volumeM3: 0.05,
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    description: 'Новый строительный материал от ООО «Магнат».',
    brand: 'Магнат',
    specs: [{ label: 'ГОСТ', value: '30340-2012' }],
    rating: 5.0,
    reviewsCount: 1,
    inStock: true,
    tags: ['Новинка'],
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.orderStatus === orderStatusFilter;
  });

  // Analytics Calculations
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const averageCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const inTransitCount = orders.filter(o => o.orderStatus === 'in_transit').length;
  const lowStockProducts = products.filter(p => p.stockKrasnoyarsk < 50 || p.stockNovosibirsk < 20);

  const handleAssignDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDriver) return;

    const driverInfo: DriverInfo = {
      name: driverName,
      phone: driverPhone,
      vehicleModel,
      vehicleNumber,
      estimatedArrival,
      currentLocationName: 'Выехал со склада Кутузова 1 ст72',
    };

    updateOrderStatus(
      selectedOrderForDriver.id, 
      'in_transit', 
      `Назначен водитель ${driverName} (${vehicleNumber}). Доставка на объект.`,
      driverInfo
    );

    setSelectedOrderForDriver(null);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProdData as any);
    setIsNewProductModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Панель администратора «Магнат24»</h1>
              <p className="text-xs text-slate-500">Управление заказами, остатками складов, автопарком и тарифами</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sync-api')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Шлюз 1С:Склад</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-xs"
          >
            В витрину магазина
          </button>
        </div>
      </div>

      {/* 2. Admin Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-bold my-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setAdminSubTab('orders')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            adminSubTab === 'orders'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Заказы ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminSubTab('products')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            adminSubTab === 'products'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Товары & Склад ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminSubTab('logistics')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            adminSubTab === 'logistics'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Логистика & Доставка ({inTransitCount})</span>
        </button>

        <button
          onClick={() => setAdminSubTab('analytics')}
          className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            adminSubTab === 'analytics'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Аналитика & Выручка</span>
        </button>
      </div>

      {/* 3. SUB-TAB 1: ORDERS MANAGEMENT */}
      {adminSubTab === 'orders' && (
        <div className="space-y-6">
          {/* Status filters */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'Все заказы' },
              { id: 'new', label: 'Новые' },
              { id: 'paid', label: 'Оплаченные' },
              { id: 'assembling', label: 'Комплектация' },
              { id: 'in_transit', label: 'В пути к клиенту' },
              { id: 'delivered', label: 'Выполненные' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderStatusFilter(f.id)}
                className={`py-1.5 px-3 rounded-xl transition-all ${
                  orderStatusFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                        {order.city}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Клиент: <strong className="text-slate-800">{order.customerName}</strong> ({order.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Changer */}
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      aria-label="Смена статуса заказа"
                      className="bg-slate-100 border border-slate-300 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-800 outline-none"
                    >
                      <option value="new">Принят (Новый)</option>
                      <option value="paid">Оплачен</option>
                      <option value="assembling">Комплектуется на складе</option>
                      <option value="in_transit">В пути к клиенту</option>
                      <option value="delivered">Доставлен (Выполнен)</option>
                      <option value="cancelled">Отменен</option>
                    </select>

                    {/* Dispatch Driver button */}
                    <button
                      onClick={() => setSelectedOrderForDriver(order)}
                      className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{order.driver ? 'Водитель назначен' : 'Назначить водителя'}</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="text-xs text-slate-600 space-y-1">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {i.product.name} × {i.quantity} {i.product.unit}</span>
                      <span className="font-mono font-semibold">{(i.quantity * i.product.price).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-3">
                  <div>
                    <span className="text-slate-500">Доставка: </span>
                    <span className="font-semibold text-slate-800">{order.deliveryMethod === 'delivery' ? order.deliveryAddress : order.pickupPoint}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">Оплата ({order.paymentMethod.toUpperCase()}): </span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {order.paymentStatus === 'paid' ? 'Оплачено' : 'Ожидает оплаты'}
                    </span>
                    <span className="text-base font-black text-slate-900">{order.totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 2: PRODUCTS CRUD & WAREHOUSE STOCK */}
      {adminSubTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Фильтр товаров по названию или SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Добавить стройматериал</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {products
              .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase()))
              .map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-slate-500 flex gap-2 mt-0.5">
                        <span className="font-mono">АРТ: {p.sku}</span>
                        <span>•</span>
                        <span>Категория: {p.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Розница / Опт</span>
                      <strong className="text-slate-900">{p.price} ₽</strong> / <strong className="text-emerald-600">{p.bulkPrice} ₽</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Остаток Красноярск</span>
                      <strong className={p.stockKrasnoyarsk < 50 ? 'text-rose-600' : 'text-slate-900'}>
                        {p.stockKrasnoyarsk} {p.unit}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Остаток Новосибирск</span>
                      <strong className={p.stockNovosibirsk < 20 ? 'text-rose-600' : 'text-slate-900'}>
                        {p.stockNovosibirsk} {p.unit}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Редактировать товар"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Удалить товар"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. SUB-TAB 3: LOGISTICS & ACTIVE FLEET */}
      {adminSubTab === 'logistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500">Газель 1.5т</div>
              <div className="text-xl font-black text-slate-900 mt-1">3 рейса сегодня</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">До 1500 кг груза</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500">Манипулятор 5т</div>
              <div className="text-xl font-black text-slate-900 mt-1">5 рейсов сегодня</div>
              <div className="text-[11px] text-amber-600 font-semibold mt-1">Стрела до 3т (разгрузка)</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500">Самосвал 15т</div>
              <div className="text-xl font-black text-slate-900 mt-1">2 рейса сегодня</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-1">Сыпучие грузы / навал</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="text-xs text-slate-500">Шаланда 20т</div>
              <div className="text-xl font-black text-slate-900 mt-1">1 рейс сегодня</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-1">Оптовые стройплощадки</div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              <span>Текущие маршруты водителей на линии</span>
            </h3>

            <div className="space-y-3">
              {orders.filter(o => o.driver).map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <div className="font-bold text-amber-400 text-sm">
                      Заказ #{ord.orderNumber} &bull; {ord.driver?.name} ({ord.driver?.vehicleNumber})
                    </div>
                    <div className="text-slate-300 mt-0.5">
                      Адрес: {ord.deliveryAddress} &bull; Вес: {(ord.totalWeightKg / 1000).toFixed(1)} т
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                      {ord.driver?.estimatedArrival || 'В пути'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 4: ANALYTICS */}
      {adminSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Общая выручка</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {totalRevenue.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">+14.2% к прошлой неделе</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Средний чек заказа</span>
                <BarChart3 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {averageCheck.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[11px] text-slate-400 mt-1">По всем складам Красноярска и НСК</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Внимание к остаткам</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600 mt-2">
                {lowStockProducts.length} поз.
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Остаток ниже минимального порога</div>
            </div>
          </div>
        </div>
      )}

      {/* DRIVER ASSIGN MODAL */}
      {selectedOrderForDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Назначить водителя на заказ #{selectedOrderForDriver.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrderForDriver(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAssignDriver} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">ФИО водителя</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Телефон водителя</label>
                <input
                  type="text"
                  required
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Модель ТС</label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Госномер</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Расчетное время прибытия к клиенту</label>
                <input
                  type="text"
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  placeholder="30 минут"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md mt-4"
              >
                Отправить уведомление клиенту и в Telegram
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Редактирование товара</h3>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Название товара</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Цена розница (₽)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Цена опт (₽)</label>
                  <input
                    type="number"
                    value={editingProduct.bulkPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, bulkPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Остаток склад Красноярск</label>
                  <input
                    type="number"
                    value={editingProduct.stockKrasnoyarsk}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockKrasnoyarsk: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Остаток склад Новосибирск</label>
                  <input
                    type="number"
                    value={editingProduct.stockNovosibirsk}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockNovosibirsk: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md mt-4"
              >
                Сохранить изменения
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Добавление нового стройматериала</h3>
              <button onClick={() => setIsNewProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Название товара *</label>
                <input
                  type="text"
                  required
                  value={newProdData.name}
                  onChange={(e) => setNewProdData({ ...newProdData, name: e.target.value })}
                  placeholder="Например: Керамзит фракция 0-5 мм (песок) 50л"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Категория</label>
                  <select
                    value={newProdData.category}
                    onChange={(e) => setNewProdData({ ...newProdData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Единица измерения</label>
                  <select
                    value={newProdData.unit}
                    onChange={(e) => setNewProdData({ ...newProdData, unit: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="мешок">мешок</option>
                    <option value="шт">шт</option>
                    <option value="м³">м³</option>
                    <option value="упак">упак</option>
                    <option value="тонна">тонна</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Цена розничная (₽)</label>
                  <input
                    type="number"
                    value={newProdData.price}
                    onChange={(e) => setNewProdData({ ...newProdData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Оптовая цена (₽)</label>
                  <input
                    type="number"
                    value={newProdData.bulkPrice}
                    onChange={(e) => setNewProdData({ ...newProdData, bulkPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Остаток Красноярск</label>
                  <input
                    type="number"
                    value={newProdData.stockKrasnoyarsk}
                    onChange={(e) => setNewProdData({ ...newProdData, stockKrasnoyarsk: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Остаток Новосибирск</label>
                  <input
                    type="number"
                    value={newProdData.stockNovosibirsk}
                    onChange={(e) => setNewProdData({ ...newProdData, stockNovosibirsk: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md mt-4"
              >
                Опубликовать в каталоге
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
