import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  UserProfile, 
  TelegramMessage, 
  TelegramBotSettings, 
  StockSyncLog,
  DriverInfo,
  ConstructionBundle,
  UserObjectProject
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_USER, 
  INITIAL_TELEGRAM_SETTINGS, 
  INITIAL_SYNC_LOGS,
  CONSTRUCTION_BUNDLES
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export type AppTab = 
  | 'home' 
  | 'catalog' 
  | 'cart' 
  | 'checkout' 
  | 'orders' 
  | 'profile' 
  | 'account'
  | 'calculator' 
  | 'objects' 
  | 'admin' 
  | 'sync-api'
  | 'contacts'
  | 'delivery-info'
  | 'product-detail';

interface StoreContextType {
  // Viewport mode
  deviceMode: 'mobile' | 'desktop';
  setDeviceMode: (mode: 'mobile' | 'desktop') => void;

  // Products & Catalog
  products: Product[];
  currentCity: 'Новосибирск' | 'Красноярск';
  setCurrentCity: (city: 'Новосибирск' | 'Красноярск') => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedTaskFilter: string | null;
  setSelectedTaskFilter: (task: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  bundles: ConstructionBundle[];
  addBundleToCart: (bundle: ConstructionBundle) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  cartWeightTotal: number;
  cartVolumeTotal: number;
  recommendedVehicle: { name: string; capacityKg: number; maxM3: number; cost: number; desc: string };

  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string, driver?: DriverInfo) => void;
  updateOrderPayment: (orderId: string, paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded') => void;
  repeatOrder: (orderId: string) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;

  // User Profile & Objects
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addProjectPendingToCart: (projectId: string) => void;

  // Telegram System
  telegramSettings: TelegramBotSettings;
  updateTelegramSettings: (settings: Partial<TelegramBotSettings>) => void;
  telegramMessages: TelegramMessage[];
  sendTelegramMessage: (text: string, type?: TelegramMessage['type'], orderId?: string) => void;
  markTelegramMessagesRead: () => void;
  isTelegramOpen: boolean;
  setIsTelegramOpen: (open: boolean) => void;

  // 1C & Stock Sync
  syncLogs: StockSyncLog[];
  triggerStockSync: (customPayload?: any, source?: StockSyncLog['source']) => Promise<{ success: boolean; updatedCount: number; message: string }>;
  resetToDefaultData: () => void;

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string, duration?: number) => void;
  removeToast: (id: string) => void;

  // Navigation & Modals
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;
  isWelcomeSplashOpen: boolean;
  setIsWelcomeSplashOpen: (open: boolean) => void;
  isBrandLoaderActive: boolean;
  setIsBrandLoaderActive: (active: boolean) => void;
  replayBrandLoader: () => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'magnat24_products_v3',
  ORDERS: 'magnat24_orders_v3',
  CART: 'magnat24_cart_v3',
  USER: 'magnat24_user_v3',
  CITY: 'magnat24_city_v3',
  DEVICE_MODE: 'magnat24_device_mode_v3',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Device Mode
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  // City
  const [currentCity, setCurrentCity] = useState<'Новосибирск' | 'Красноярск'>('Новосибирск');

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Bundles
  const [bundles] = useState<ConstructionBundle[]>(CONSTRUCTION_BUNDLES);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // User
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Telegram
  const [telegramSettings, setTelegramSettings] = useState<TelegramBotSettings>(INITIAL_TELEGRAM_SETTINGS);
  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>([
    {
      id: 'tg-init-1',
      timestamp: new Date().toISOString(),
      chatId: '592019482',
      text: '👋 Добро пожаловать в бот МАГНАТ24!\nЗдесь вы будете получать мгновенные уведомления о статусах заказов и выезде машины.',
      type: 'system',
      isRead: true
    }
  ]);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);

  // Sync Logs
  const [syncLogs, setSyncLogs] = useState<StockSyncLog[]>(INITIAL_SYNC_LOGS);

  // UI state
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] || null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isWelcomeSplashOpen, setIsWelcomeSplashOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('magnat24_welcome_seen_v1');
      return !seen;
    }
    return true;
  });
  const [isBrandLoaderActive, setIsBrandLoaderActive] = useState<boolean>(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const replayBrandLoader = () => {
    setIsBrandLoaderActive(true);
  };
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string, duration = 1400) => {
    const id = 't-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const sendTelegramMessage = (text: string, type: TelegramMessage['type'] = 'system', orderId?: string) => {
    const newMsg: TelegramMessage = {
      id: 'tg-' + Date.now(),
      timestamp: new Date().toISOString(),
      chatId: telegramSettings.customerChatId,
      text,
      type,
      orderId,
      isRead: false
    };
    setTelegramMessages((prev) => [newMsg, ...prev]);
    addToast('info', 'Telegram-бот', text.slice(0, 60) + '...');
  };

  const markTelegramMessagesRead = () => {
    setTelegramMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast('success', 'Добавлено в корзину', `${product.name} (${quantity} ${product.unit})`, 1300);
  };

  const addBundleToCart = (bundle: ConstructionBundle) => {
    bundle.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    addToast('success', 'Комплект добавлен', `${bundle.title} (${bundle.itemCount} товаров)`);
    setActiveTab('cart');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Cart calculations
  let cartSubtotal = 0;
  let cartDiscount = 0;
  let cartWeightTotal = 0;
  let cartVolumeTotal = 0;

  cart.forEach((item) => {
    const isBulk = item.quantity >= item.product.bulkThreshold;
    const basePrice = item.product.price * item.quantity;
    const appliedPrice = (isBulk ? item.product.bulkPrice : item.product.price) * item.quantity;
    cartSubtotal += basePrice;
    cartDiscount += (basePrice - appliedPrice);
    cartWeightTotal += (item.product.weightKg || 1) * item.quantity;
    cartVolumeTotal += (item.product.volumeM3 || 0.01) * item.quantity;
  });

  const cartTotal = cartSubtotal - cartDiscount;

  const getRecommendedVehicle = () => {
    if (cartWeightTotal <= 1500) {
      return { name: 'Газель 1.5т', capacityKg: 1500, maxM3: 8, cost: 490, desc: 'Для стройматериалов до 1.5 т' };
    } else if (cartWeightTotal <= 5000) {
      return { name: 'Манипулятор 5т', capacityKg: 5000, maxM3: 16, cost: 3000, desc: 'С разгрузкой стрелой' };
    } else {
      return { name: 'Самосвал 15т', capacityKg: 15000, maxM3: 25, cost: 5500, desc: 'Для тяжелых партий' };
    }
  };

  const recommendedVehicle = getRecommendedVehicle();

  // Create order
  const createOrder = (orderData: Partial<Order>): Order => {
    const orderNum = String(Math.floor(2000 + Math.random() * 8000));
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal ?? cartSubtotal,
      discount: orderData.discount ?? cartDiscount,
      deliveryCost: orderData.deliveryCost ?? 490,
      totalAmount: (orderData.subtotal ?? cartSubtotal) - (orderData.discount ?? cartDiscount) + (orderData.deliveryCost ?? 490),
      totalWeightKg: orderData.totalWeightKg ?? cartWeightTotal,
      totalVolumeM3: orderData.totalVolumeM3 ?? cartVolumeTotal,
      customerType: orderData.customerType || user.customerType || 'individual',
      customerName: orderData.customerName || user.name,
      customerPhone: orderData.customerPhone || user.phone,
      customerEmail: orderData.customerEmail || user.email,
      deliveryMethod: orderData.deliveryMethod || 'delivery',
      city: currentCity,
      deliveryAddress: orderData.deliveryAddress || 'г. Новосибирск, ул. Ленина, д. 28, кв. 14',
      deliveryDate: orderData.deliveryDate || 'Сегодня',
      deliveryTimeSlot: orderData.deliveryTimeSlot || '14:00 - 18:00',
      deliveryVehicleRequired: 'Газель 1.5т',
      comment: orderData.comment,
      paymentMethod: orderData.paymentMethod || 'sbp',
      paymentStatus: orderData.paymentMethod === 'upon_receipt' ? 'pending' : 'paid',
      orderStatus: 'new',
      statusHistory: [
        {
          status: 'new',
          timestamp: new Date().toISOString(),
          note: 'Заказ принят в системе МАГНАТ24',
        }
      ],
      telegramNotified: true,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrder(newOrder);

    // Send Telegram Notification
    sendTelegramMessage(
      `✓ Заказ №${newOrder.orderNumber} принят!\nСумма: ${newOrder.totalAmount.toLocaleString('ru-RU')} ₽\nАдрес: ${newOrder.deliveryAddress}\nБлижайшая доставка: ${newOrder.deliveryDate}`,
      'order_created',
      newOrder.id
    );

    addToast('success', `Заказ №${newOrder.orderNumber} оформлен!`, 'Отслеживайте статус в разделе «Заказы».');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string, driver?: DriverInfo) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newHistory = [
            ...o.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Статус изменен на ${status}`,
            }
          ];
          return {
            ...o,
            orderStatus: status,
            statusHistory: newHistory,
            driver: driver || o.driver,
          };
        }
        return o;
      })
    );
  };

  const updateOrderPayment = (orderId: string, paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentStatus,
            orderStatus: paymentStatus === 'paid' && o.orderStatus === 'new' ? 'paid' : o.orderStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    addToast('success', 'Товар обновлен', product.name);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: 'prod-custom-' + Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
    addToast('success', 'Товар добавлен', newProd.name);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Товар удален', 'Удалено из базы данных');
  };

  const repeatOrder = (orderId: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;
    target.items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    addToast('success', 'Повтор заказа', `Товары из заказа №${target.orderNumber} добавлены в корзину`);
    setActiveTab('cart');
  };

  const addProjectPendingToCart = (projectId: string) => {
    const project = user.objects.find(p => p.id === projectId);
    if (!project) return;
    project.pendingItems.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    addToast('success', 'Закупка начата', `Материалы для объекта «${project.title}» добавлены в корзину`);
    setActiveTab('cart');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    addToast('success', 'Профиль обновлен', 'Данные успешно сохранены');
  };

  const toggleFavorite = (productId: string) => {
    setUser((prev) => {
      const exists = prev.favorites.includes(productId);
      const favorites = exists
        ? prev.favorites.filter((id) => id !== productId)
        : [...prev.favorites, productId];
      return { ...prev, favorites };
    });
  };

  const isFavorite = (productId: string) => user.favorites.includes(productId);

  const updateTelegramSettings = (settings: Partial<TelegramBotSettings>) => {
    setTelegramSettings((prev) => ({ ...prev, ...settings }));
  };

  const triggerStockSync = async (customPayload?: any, source: StockSyncLog['source'] = '1C:Enterprise 8.3') => {
    await new Promise((res) => setTimeout(res, 500));
    const newLog: StockSyncLog = {
      id: 'sync-' + Date.now(),
      timestamp: new Date().toISOString(),
      source,
      itemsProcessed: products.length,
      itemsUpdated: 5,
      status: 'success',
      executionTimeMs: 280,
      message: 'Успешный обмен с 1С. Остатки и цены обновлены.',
      payloadPreview: JSON.stringify({ status: '200 OK', source, time: new Date().toISOString() })
    };
    setSyncLogs((prev) => [newLog, ...prev]);
    addToast('success', '1С:Синхронизация', 'Остатки успешно обновлены');
    return { success: true, updatedCount: 5, message: 'Синхронизировано' };
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    addToast('info', 'Данные сброшены', 'База восстановлена');
  };

  return (
    <StoreContext.Provider
      value={{
        deviceMode,
        setDeviceMode,
        products,
        currentCity,
        setCurrentCity,
        selectedCategory,
        setSelectedCategory,
        selectedTaskFilter,
        setSelectedTaskFilter,
        searchQuery,
        setSearchQuery,
        bundles,
        addBundleToCart,
        updateProduct,
        addProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartWeightTotal,
        cartVolumeTotal,
        recommendedVehicle,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPayment,
        repeatOrder,
        activeOrder,
        setActiveOrder,
        user,
        updateUserProfile,
        toggleFavorite,
        isFavorite,
        addProjectPendingToCart,
        telegramSettings,
        updateTelegramSettings,
        telegramMessages,
        sendTelegramMessage,
        markTelegramMessagesRead,
        isTelegramOpen,
        setIsTelegramOpen,
        syncLogs,
        triggerStockSync,
        resetToDefaultData,
        toasts,
        addToast,
        removeToast,
        activeTab,
        setActiveTab,
        selectedProductId,
        setSelectedProductId,
        isFilterOpen,
        setIsFilterOpen,
        isCalculatorOpen,
        setIsCalculatorOpen,
        isWelcomeSplashOpen,
        setIsWelcomeSplashOpen,
        isBrandLoaderActive,
        setIsBrandLoaderActive,
        replayBrandLoader,
        isSearchModalOpen,
        setIsSearchModalOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
