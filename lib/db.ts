import fs from 'fs';
import path from 'path';
import {
  Category,
  Product,
  Order,
  OrderStatus,
  PaymentStatus,
  DeliverySettings,
  Coupon,
  Review,
  UserProfile,
  DeliveryAddress,
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
} from './seedData';

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  orders: Order[];
  deliverySettings: DeliverySettings;
  coupons: Coupon[];
  reviews: Review[];
  users: UserProfile[];
  orderCounter: number;
}

const DB_FILE_PATH = path.join(process.cwd(), 'database', 'data.json');

// In-memory singleton cache to ensure lightning-fast read/write and thread safety
let memoryDb: DatabaseSchema | null = null;

function ensureDbLoaded(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      memoryDb = JSON.parse(fileData);
      if (!memoryDb?.categories || memoryDb.categories.length === 0) {
        throw new Error('Corrupted or empty DB, re-seeding');
      }
      return memoryDb!;
    }
  } catch (err) {
    console.warn('Database initialization from file fallback to default seed:', err);
  }

  // Initialize initial seed data
  const initialOrders: Order[] = [
    {
      id: 'ord-seed-1',
      orderNumber: 'CC-2026-0001',
      customerName: 'Santosh Tomar',
      customerPhone: '8090205081',
      customerEmail: 'santosh@classiccrush.com',
      orderType: 'DELIVERY',
      items: [
        {
          productId: 'prod-triple-chocolate',
          productName: 'Triple Chocolate',
          productImage: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
          quantity: 2,
          unitPrice: 69,
          totalPrice: 138,
          vegType: 'VEG',
        },
        {
          productId: 'prod-cold-coffee',
          productName: 'Cold Coffee',
          productImage: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
          quantity: 2,
          unitPrice: 49,
          totalPrice: 98,
          vegType: 'VEG',
        },
      ],
      subtotal: 236,
      deliveryFee: 20,
      tax: 12,
      discount: 0,
      grandTotal: 268,
      orderStatus: 'DELIVERED',
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      paymentId: 'pay_sim_001',
      deliveryAddress: {
        fullName: 'Santosh Tomar',
        phoneNumber: '8090205081',
        houseFlat: 'Cabin 4B, Faculty Block',
        street: 'School of Hotel Management',
        area: 'University Road',
        city: 'Lucknow',
        pincode: '226001',
        landmark: 'Near Central Library',
        distanceKm: 1.2,
      },
      estimatedTimeMinutes: 25,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      deliveryPartnerName: 'Rahul Verma',
      deliveryPartnerPhone: '+91 9876543210',
    },
    {
      id: 'ord-seed-2',
      orderNumber: 'CC-2026-0002',
      customerName: 'Sandeep Singh',
      customerPhone: '8318008104',
      orderType: 'PICKUP',
      items: [
        {
          productId: 'prod-korean-bun-2pcs',
          productName: 'Korean Bun (2 Pcs)',
          productImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          quantity: 1,
          unitPrice: 59,
          totalPrice: 59,
          vegType: 'VEG',
        },
        {
          productId: 'prod-cheese-masala-patties',
          productName: 'Cheese Masala Patties',
          productImage: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
          quantity: 2,
          unitPrice: 35,
          totalPrice: 70,
          vegType: 'VEG',
        },
        {
          productId: 'prod-hot-coffee',
          productName: 'Hot Coffee',
          productImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
          quantity: 2,
          unitPrice: 30,
          totalPrice: 60,
          vegType: 'VEG',
        },
      ],
      subtotal: 189,
      deliveryFee: 0,
      tax: 9,
      discount: 0,
      grandTotal: 198,
      orderStatus: 'PREPARING',
      paymentMethod: 'PAY_AT_CAFE',
      paymentStatus: 'PENDING',
      estimatedTimeMinutes: 15,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString(),
    },
  ];

  memoryDb = {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    orders: initialOrders,
    deliverySettings: INITIAL_DELIVERY_SETTINGS,
    coupons: INITIAL_COUPONS,
    reviews: INITIAL_REVIEWS,
    users: [],
    orderCounter: 3,
  };

  saveDb();
  return memoryDb;
}

function saveDb() {
  if (!memoryDb) return;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file to disk:', err);
  }
}

export const db = {
  // --- CATEGORIES ---
  getCategories: async (): Promise<Category[]> => {
    const data = ensureDbLoaded();
    return [...data.categories].sort((a, b) => a.order - b.order);
  },

  getCategoryById: async (id: string): Promise<Category | null> => {
    const data = ensureDbLoaded();
    return data.categories.find((c) => c.id === id) || null;
  },

  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const data = ensureDbLoaded();
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    data.categories.push(newCategory);
    saveDb();
    return newCategory;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    const data = ensureDbLoaded();
    const idx = data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    data.categories[idx] = { ...data.categories[idx], ...updates };
    saveDb();
    return data.categories[idx];
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    const data = ensureDbLoaded();
    const idx = data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    data.categories.splice(idx, 1);
    saveDb();
    return true;
  },

  // --- PRODUCTS ---
  getProducts: async (filters?: {
    categoryId?: string;
    search?: string;
    isBestSeller?: boolean;
    vegType?: 'VEG' | 'NON_VEG';
    isAvailableOnly?: boolean;
  }): Promise<Product[]> => {
    const data = ensureDbLoaded();
    let result = [...data.products];

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters?.isBestSeller !== undefined) {
      result = result.filter((p) => p.isBestSeller === filters.isBestSeller);
    }

    if (filters?.vegType) {
      result = result.filter((p) => p.vegType === filters.vegType);
    }

    if (filters?.isAvailableOnly) {
      result = result.filter((p) => p.isAvailable);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    return result;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const data = ensureDbLoaded();
    return data.products.find((p) => p.id === id) || null;
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    const data = ensureDbLoaded();
    return data.products.find((p) => p.slug === slug) || null;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const data = ensureDbLoaded();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
    data.products.push(newProduct);
    saveDb();
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    const data = ensureDbLoaded();
    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    data.products[idx] = { ...data.products[idx], ...updates };
    saveDb();
    return data.products[idx];
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const data = ensureDbLoaded();
    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    data.products.splice(idx, 1);
    saveDb();
    return true;
  },

  toggleProductAvailability: async (id: string): Promise<Product | null> => {
    const data = ensureDbLoaded();
    const product = data.products.find((p) => p.id === id);
    if (!product) return null;
    product.isAvailable = !product.isAvailable;
    saveDb();
    return product;
  },

  // --- ORDERS ---
  getOrders: async (filters?: {
    status?: OrderStatus;
    phone?: string;
    limit?: number;
  }): Promise<Order[]> => {
    const data = ensureDbLoaded();
    let result = [...data.orders];

    if (filters?.status) {
      result = result.filter((o) => o.orderStatus === filters.status);
    }

    if (filters?.phone) {
      const cleanPhone = filters.phone.replace(/[^0-9]/g, '');
      result = result.filter((o) => o.customerPhone.replace(/[^0-9]/g, '').includes(cleanPhone));
    }

    // sort most recent first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const data = ensureDbLoaded();
    return data.orders.find((o) => o.id === id || o.orderNumber.toUpperCase() === id.toUpperCase()) || null;
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const data = ensureDbLoaded();
    data.orderCounter += 1;
    const padded = String(data.orderCounter).padStart(4, '0');
    const orderNumber = `CC-2026-${padded}`;
    const id = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    data.orders.unshift(newOrder);
    saveDb();
    return newOrder;
  },

  updateOrderStatus: async (
    id: string,
    status: OrderStatus,
    extra?: { deliveryPartnerName?: string; deliveryPartnerPhone?: string; cancellationReason?: string }
  ): Promise<Order | null> => {
    const data = ensureDbLoaded();
    const order = data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    if (extra?.deliveryPartnerName) order.deliveryPartnerName = extra.deliveryPartnerName;
    if (extra?.deliveryPartnerPhone) order.deliveryPartnerPhone = extra.deliveryPartnerPhone;
    if (extra?.cancellationReason) order.cancellationReason = extra.cancellationReason;

    // Automatically update payment status if cash order is delivered
    if (status === 'DELIVERED' && (order.paymentMethod === 'COD' || order.paymentMethod === 'PAY_AT_CAFE')) {
      order.paymentStatus = 'PAID';
    }

    saveDb();
    return order;
  },

  updateOrderPaymentStatus: async (
    id: string,
    paymentStatus: PaymentStatus,
    paymentId?: string
  ): Promise<Order | null> => {
    const data = ensureDbLoaded();
    const order = data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.paymentStatus = paymentStatus;
    if (paymentId) order.paymentId = paymentId;
    order.updatedAt = new Date().toISOString();
    saveDb();
    return order;
  },

  // --- DELIVERY SETTINGS & CALCULATION ---
  getDeliverySettings: async (): Promise<DeliverySettings> => {
    const data = ensureDbLoaded();
    return data.deliverySettings;
  },

  updateDeliverySettings: async (settings: Partial<DeliverySettings>): Promise<DeliverySettings> => {
    const data = ensureDbLoaded();
    data.deliverySettings = { ...data.deliverySettings, ...settings };
    saveDb();
    return data.deliverySettings;
  },

  calculateDeliveryFee: async (
    distanceKm: number,
    subtotal: number
  ): Promise<{
    isDeliverable: boolean;
    deliveryFee: number;
    reason?: string;
  }> => {
    const data = ensureDbLoaded();
    const settings = data.deliverySettings;

    if (distanceKm > settings.maxDeliveryRadiusKm) {
      return {
        isDeliverable: false,
        deliveryFee: 0,
        reason: `Delivery location (${distanceKm.toFixed(1)} km) is beyond our maximum delivery radius of ${settings.maxDeliveryRadiusKm} km. Please choose Pickup from Café.`,
      };
    }

    // Check free delivery threshold
    if (settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold) {
      return {
        isDeliverable: true,
        deliveryFee: 0,
        reason: `Eligible for Free Delivery! (Order above ₹${settings.freeDeliveryThreshold})`,
      };
    }

    // Match zone
    let matchedFee = 25; // fallback
    for (const zone of settings.zones) {
      if (distanceKm >= zone.minDistanceKm && distanceKm <= zone.maxDistanceKm) {
        matchedFee = zone.fee;
        break;
      }
    }

    return {
      isDeliverable: true,
      deliveryFee: matchedFee,
    };
  },

  // --- COUPONS ---
  getCoupons: async (): Promise<Coupon[]> => {
    const data = ensureDbLoaded();
    return data.coupons;
  },

  getCouponByCode: async (code: string): Promise<Coupon | null> => {
    const data = ensureDbLoaded();
    return data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive) || null;
  },

  validateCoupon: async (
    code: string,
    subtotal: number
  ): Promise<{
    isValid: boolean;
    discount: number;
    message: string;
    coupon?: Coupon;
  }> => {
    const coupon = await db.getCouponByCode(code);
    if (!coupon) {
      return { isValid: false, discount: 0, message: 'Invalid or expired coupon code' };
    }

    if (subtotal < coupon.minimumOrderAmount) {
      return {
        isValid: false,
        discount: 0,
        message: `Coupon requires a minimum order amount of ₹${coupon.minimumOrderAmount}`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'FLAT') {
      discount = Math.min(coupon.discountValue, subtotal);
    } else if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    }

    return {
      isValid: true,
      discount,
      message: `Coupon "${coupon.code}" applied successfully! You save ₹${discount}`,
      coupon,
    };
  },

  createCoupon: async (coupon: Omit<Coupon, 'id'>): Promise<Coupon> => {
    const data = ensureDbLoaded();
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
    };
    data.coupons.push(newCoupon);
    saveDb();
    return newCoupon;
  },

  toggleCouponStatus: async (id: string): Promise<Coupon | null> => {
    const data = ensureDbLoaded();
    const coupon = data.coupons.find((c) => c.id === id);
    if (!coupon) return null;
    coupon.isActive = !coupon.isActive;
    saveDb();
    return coupon;
  },

  deleteCoupon: async (id: string): Promise<boolean> => {
    const data = ensureDbLoaded();
    const idx = data.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    data.coupons.splice(idx, 1);
    saveDb();
    return true;
  },

  // --- REVIEWS ---
  getReviews: async (productId?: string): Promise<Review[]> => {
    const data = ensureDbLoaded();
    if (productId) {
      return data.reviews.filter((r) => r.productId === productId);
    }
    return data.reviews;
  },

  createReview: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    const data = ensureDbLoaded();
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    data.reviews.unshift(newReview);

    // Update product average rating
    const productReviews = data.reviews.filter((r) => r.productId === reviewData.productId);
    const avg =
      productReviews.reduce((sum, r) => sum + r.rating, 0) / (productReviews.length || 1);
    const product = data.products.find((p) => p.id === reviewData.productId);
    if (product) {
      product.rating = Math.round(avg * 10) / 10;
      product.ratingCount = productReviews.length;
    }

    saveDb();
    return newReview;
  },

  // --- USER PROFILE & ADDRESSES ---
  getUserProfile: async (phone: string): Promise<UserProfile> => {
    const data = ensureDbLoaded();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let user = data.users.find((u) => u.phone.replace(/[^0-9]/g, '') === cleanPhone);

    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: 'Guest Customer',
        phone: cleanPhone,
        savedAddresses: [],
        favoriteProductIds: [],
        createdAt: new Date().toISOString(),
      };
      data.users.push(user);
      saveDb();
    }
    return user;
  },

  saveUserAddress: async (phone: string, address: DeliveryAddress): Promise<UserProfile> => {
    const user = await db.getUserProfile(phone);
    const data = ensureDbLoaded();
    const addrWithId = {
      ...address,
      id: address.id || `addr-${Date.now()}`,
    };

    const existingIdx = user.savedAddresses.findIndex((a) => a.id === addrWithId.id);
    if (existingIdx >= 0) {
      user.savedAddresses[existingIdx] = addrWithId;
    } else {
      user.savedAddresses.push(addrWithId);
    }
    if (address.fullName) user.name = address.fullName;
    if (address.email) user.email = address.email;

    saveDb();
    return user;
  },

  toggleFavorite: async (phone: string, productId: string): Promise<string[]> => {
    const user = await db.getUserProfile(phone);
    const idx = user.favoriteProductIds.indexOf(productId);
    if (idx >= 0) {
      user.favoriteProductIds.splice(idx, 1);
    } else {
      user.favoriteProductIds.push(productId);
    }
    saveDb();
    return user.favoriteProductIds;
  },

  // --- ANALYTICS & STATS (FOR ADMIN) ---
  getAdminStats: async () => {
    const data = ensureDbLoaded();
    const orders = data.orders;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'RECEIVED' || o.orderStatus === 'CONFIRMED').length;
    const preparingOrders = orders.filter((o) => o.orderStatus === 'PREPARING').length;
    const readyOrders = orders.filter((o) => o.orderStatus === 'READY' || o.orderStatus === 'OUT_FOR_DELIVERY').length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED').length;

    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'CANCELLED')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    // Product frequency count
    const productFrequency: Record<string, { name: string; count: number; revenue: number; image: string }> = {};
    for (const ord of orders) {
      if (ord.orderStatus === 'CANCELLED') continue;
      for (const item of ord.items) {
        if (!productFrequency[item.productId]) {
          productFrequency[item.productId] = {
            name: item.productName,
            count: 0,
            revenue: 0,
            image: item.productImage,
          };
        }
        productFrequency[item.productId].count += item.quantity;
        productFrequency[item.productId].revenue += item.totalPrice;
      }
    }

    const popularProducts = Object.values(productFrequency)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      cancelledOrders,
      popularProducts,
      recentOrders: orders.slice(0, 8),
      totalProducts: data.products.length,
      availableProducts: data.products.filter((p) => p.isAvailable).length,
    };
  },
};
