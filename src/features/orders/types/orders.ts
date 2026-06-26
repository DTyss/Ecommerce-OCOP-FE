import type { CheckoutAddress, PaymentMethod, ShippingOption } from "@/features/checkout/types/checkout";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "shipping" | "completed" | "cancelled";

export interface OrderItem {
  productId: string;
  quantity: number;
  snapshot: {
    name: string;
    image: string;
    price: number;
  };
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: CheckoutAddress;
  shippingMethod: ShippingOption;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  voucherCode: string | null;
}
