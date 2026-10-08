export type VegType = 'VEG' | 'NON_VEG';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  required?: boolean;
  options: CustomizationOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  categoryName?: string;
  image: string;
  vegType: VegType;
  isBestSeller?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes?: number;
  prepTimeMinutes?: number;
  ingredients?: string[];
  customizations?: CustomizationGroup[];
  rating?: number;
  ratingCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive?: boolean;
  itemCount?: number;
}

export interface CartItemOption {
  groupId?: string;
  groupTitle?: string;
  groupName?: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique item line id (combining productId + options)
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions: CartItemOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'DELIVERY' | 'PICKUP';

export type OrderStatus =
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'UPI'
  | 'CARD'
  | 'NET_BANKING'
  | 'COD'
  | 'PAY_AT_CAFE';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'COD';

export interface DeliveryAddress {
  id?: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
  deliveryInstructions?: string;
  instructions?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
}

export interface OrderItemRecord {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vegType: VegType;
  selectedOptions?: CartItemOption[];
  specialInstructions?: string;
}

export interface Order {
  id: string; // Internal UUID
  orderNumber: string; // e.g. CC-2026-0001
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  packagingFee?: number;
  tipAmount?: number;
  couponCode?: string;
  grandTotal: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  deliveryAddress?: DeliveryAddress;
  estimatedTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  cancellationReason?: string;
}

export interface DeliveryZoneRule {
  minDistanceKm: number;
  maxDistanceKm: number;
  fee: number;
}

export interface DeliverySettings {
  isOpen?: boolean;
  maxDeliveryRadiusKm: number;
  zones: DeliveryZoneRule[];
  freeDeliveryThreshold: number; // e.g. Free delivery on orders > 299
  minimumOrderValue: number; // e.g. 99
  estimatedDeliveryTimeMinutes?: number; // e.g. 35
  estimatedPickupTimeMinutes?: number; // e.g. 15
  estimatedTimeMinutes?: number;
  cafeLatitude?: number;
  cafeLongitude?: number;
  cafeAddress?: string;
  cafePhone?: string;
  cafeAltPhone?: string;
  cafeWhatsApp?: string;
  cafeEmail?: string;
  instagramUrl?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minimumOrderAmount: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  savedAddresses: DeliveryAddress[];
  favoriteProductIds: string[];
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'KITCHEN';
}
