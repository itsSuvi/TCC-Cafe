import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Order, OrderStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Haversine formula to compute approximate straight-line distance in km between two geo-coordinates
 */
export function calculateCoordinatesDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

export function getOrderStatusConfig(status: OrderStatus, orderType: 'DELIVERY' | 'PICKUP' = 'DELIVERY') {
  const isDelivery = orderType === 'DELIVERY';

  switch (status) {
    case 'RECEIVED':
      return {
        label: 'Order Placed',
        description: 'We have received your order and sent it to the kitchen.',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        stepIndex: 0,
        color: '#D97706',
      };
    case 'CONFIRMED':
      return {
        label: 'Order Confirmed',
        description: 'Chef has accepted your order.',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        stepIndex: 1,
        color: '#2563EB',
      };
    case 'PREPARING':
      return {
        label: 'Baking & Preparing',
        description: 'Fresh ingredients are being crafted with love right now.',
        badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-400',
        stepIndex: 2,
        color: '#CA8A04',
      };
    case 'READY':
      return {
        label: isDelivery ? 'Ready for Dispatch' : 'Ready for Pickup',
        description: isDelivery
          ? 'Packed fresh and waiting for delivery partner pickup.'
          : 'Your order is hot & ready! You can pick it up at our café counter.',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-400',
        stepIndex: 3,
        color: '#059669',
      };
    case 'OUT_FOR_DELIVERY':
      return {
        label: 'Out for Delivery',
        description: 'Delivery partner is on the way to your doorstep.',
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
        stepIndex: 4,
        color: '#7C3AED',
      };
    case 'DELIVERED':
      return {
        label: isDelivery ? 'Delivered with Love' : 'Picked Up',
        description: 'Enjoy your delicious feast! Bon appétit!',
        badgeBg: 'bg-green-100 text-green-900 border-green-500',
        stepIndex: 5,
        color: '#16A34A',
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        description: 'This order was cancelled.',
        badgeBg: 'bg-red-100 text-red-900 border-red-300',
        stepIndex: -1,
        color: '#DC2626',
      };
    default:
      return {
        label: status,
        description: '',
        badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
        stepIndex: 0,
        color: '#78716C',
      };
  }
}

export function generateWhatsAppOrderUrl(order: Order, cafeWhatsApp: string = '918090205081'): string {
  const itemsText = order.items
    .map((item) => `• ${item.quantity}x ${item.productName} (₹${item.totalPrice})`)
    .join('\n');

  const addressText =
    order.orderType === 'DELIVERY' && order.deliveryAddress
      ? `\n📍 *Delivery Address:* ${order.deliveryAddress.houseFlat}, ${order.deliveryAddress.street}, ${order.deliveryAddress.area}`
      : '\n🛍️ *Order Type:* Pickup from Café';

  const message = `Hello The Classic Crush! 👋
Here are my order details:

🔖 *Order ID:* ${order.orderNumber}
👤 *Name:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}
${addressText}

📦 *Items:*
${itemsText}

💰 *Grand Total:* ₹${order.grandTotal} (${order.paymentMethod} - ${order.paymentStatus})
🕒 *Status:* ${order.orderStatus}

Please update me on my order status. Thank you! 🍰❤️`;

  return `https://wa.me/${cafeWhatsApp}?text=${encodeURIComponent(message)}`;
}
