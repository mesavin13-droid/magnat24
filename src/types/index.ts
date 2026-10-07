export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle?: string; // e.g. "Штукатурка гипсовая, 30 кг"
  category: string;
  subcategory?: string;
  price: number;
  unit: 'мешок' | 'шт' | 'м³' | 'м²' | 'тонна' | 'паллет' | 'упак' | 'рулон' | 'кг';
  unitPriceLabel?: string; // e.g. "23,30 ₽ / кг" or "590 ₽ / мешок"
  itemsPerPack?: number; // количество внутри упаковки
  bulkPrice: number;
  bulkThreshold: number;
  inStock: boolean;
  stockKrasnoyarsk: number;
  stockNovosibirsk: number;
  minOrder: number;
  weightKg: number; // вес одной единицы в кг
  volumeM3: number; // объем одной единицы в м3
  image: string;
  gallery?: string[];
  description: string;
  specs: ProductSpec[];
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isPromo?: boolean;
  discountPercent?: number;
  brand: string;
  tags: string[];
  compatibleProductIds?: string[]; // Подходит вместе (грунтовка, шпатель, сетка...)
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPackaging?: string;
}

export type OrderStatus = 
  | 'new' 
  | 'processing' 
  | 'paid' 
  | 'assembling' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 
  | 'sbp' 
  | 'card' 
  | 'upon_receipt' 
  | 'tpay' 
  | 'sberpay' 
  | 'invoice';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type DeliveryMethod = 
  | 'delivery' 
  | 'pickup';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note: string;
  updatedBy?: string;
}

export interface DriverInfo {
  name: string;
  phone: string;
  vehicleModel: string;
  vehicleNumber: string;
  currentLocationName?: string;
  estimatedArrival?: string;
}

export interface LegalEntityDetails {
  companyName: string;
  inn: string;
  kpp?: string;
  ogrn?: string;
  legalAddress: string;
  bankName: string;
  bik: string;
  checkingAccount: string;
  correspondentAccount: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCost: number;
  totalAmount: number;
  totalWeightKg: number;
  totalVolumeM3: number;
  customerType: 'individual' | 'legal';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  legalDetails?: LegalEntityDetails;
  deliveryMethod: DeliveryMethod;
  city: 'Красноярск' | 'Новосибирск' | 'Пригород / Межгород';
  deliveryAddress?: string;
  pickupPoint?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  deliveryVehicleRequired?: string;
  comment?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  driver?: DriverInfo;
  telegramNotified: boolean;
}

export interface ConstructionBundle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'foundation' | 'masonry' | 'insulation' | 'roofing' | 'screed';
  itemCount: number;
  price: number;
  oldPrice: number;
  discountPercent: number;
  image: string;
  items: {
    product: Product;
    quantity: number;
  }[];
}

export interface UserObjectProject {
  id: string;
  title: string;
  address: string;
  purchasedItems: {
    id: string;
    name: string;
    date: string;
    quantity: string;
  }[];
  pendingItems: {
    productId: string;
    name: string;
    quantity: number;
    estimatedPrice: number;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  customerType: 'individual' | 'legal';
  legalDetails?: LegalEntityDetails;
  savedAddresses: string[];
  bonusPoints: number;
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP Pro';
  favorites: string[];
  objects: UserObjectProject[];
}

export interface TelegramMessage {
  id: string;
  timestamp: string;
  chatId: string;
  text: string;
  type: 'order_created' | 'status_update' | 'payment_confirmed' | 'delivery_dispatched' | 'system';
  orderId?: string;
  isRead: boolean;
}

export interface TelegramBotSettings {
  botToken: string;
  customerChatId: string;
  adminChatId: string;
  botUsername: string;
  notificationsEnabled: boolean;
  notifyOnStatusChange: boolean;
  notifyOnPayment: boolean;
  notifyOnStockAlert: boolean;
}

export interface StockSyncLog {
  id: string;
  timestamp: string;
  source: '1C:Enterprise 8.3' | 'MoySklad' | 'REST Webhook' | 'Manual Batch';
  itemsProcessed: number;
  itemsUpdated: number;
  status: 'success' | 'warning' | 'error';
  executionTimeMs: number;
  message: string;
  payloadPreview?: string;
}

export interface WarehouseLocation {
  id: string;
  name: string;
  city: 'Красноярск' | 'Новосибирск';
  address: string;
  phone: string;
  workHours: string;
  isMainOffice: boolean;
  canPickup: boolean;
  coordinates: [number, number];
}
