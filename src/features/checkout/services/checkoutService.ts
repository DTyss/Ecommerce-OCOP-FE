import type { Order } from "@/features/orders/types/orders";

const delay = <T>(value: T, ms = 200): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `order-${Date.now()}`;
};

export const checkoutService = {
  createOrder: async (order: Omit<Order, "id" | "createdAt">): Promise<Order> =>
    delay({
      ...order,
      id: createId(),
      createdAt: new Date().toISOString(),
    }),
};
