export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'Brassware' | 'Ceramics' | 'Textiles' | 'Living' | 'Acoustic' | 'Copperware';
  price: number;
  originalPrice?: number;
  image: string;
  fallbackBg: string;
  description: string;
  craftOrigin: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
  stockCount: number;
  tag?: string;
  rating: number;
  reviewCount: number;
  availableColors?: { name: string; hex: string }[];
  availableSizes?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface SavedItem {
  id: string;
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  savedAt: number;
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  description: string;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  upiId?: string;
  cardNumberMasked?: string;
}

export interface OrderSummary {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  appliedPromoCode?: string;
  shippingCost: number;
  shippingMethod: 'standard' | 'express' | 'courier';
  tax: number;
  total: number;
  customer: OrderCustomer;
  orderNote?: string;
  isGiftWrap?: boolean;
  createdAt: string;
  estimatedDelivery: string;
}

export type IndianCourierName =
  | 'Blue Dart Express'
  | 'Delhivery'
  | 'DTDC Express'
  | 'India Post (Speed Post)'
  | 'Shadowfax Metro';

export type ShipmentStage =
  | 'order_confirmed'
  | 'artisan_packed'
  | 'dispatched_hub'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export interface TrackingCheckpoint {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  completed: boolean;
  isCurrent?: boolean;
}

export interface ShipmentData {
  orderId: string;
  awbNumber: string;
  courierName: IndianCourierName;
  courierContact: string;
  estimatedDelivery: string;
  currentStage: ShipmentStage;
  deliveryAddress: {
    recipientName: string;
    city: string;
    state: string;
    pincode: string;
  };
  itemsSummary: {
    name: string;
    quantity: number;
    image: string;
  }[];
  checkpoints: TrackingCheckpoint[];
  otpRequiredForDelivery: boolean;
  deliveryAgent?: {
    name: string;
    phone: string;
    maskedOtp?: string;
  };
}

export interface CustomerStory {
  id: string;
  author: string;
  city: string;
  state: string;
  avatar?: string;
  rating: number;
  date: string;
  productName: string;
  verifiedBuyer: boolean;
  headline: string;
  review: string;
  highlightTag: string;
}

