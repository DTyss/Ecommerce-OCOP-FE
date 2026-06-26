import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_ORDERS } from "@/features/orders/mock/data";
import type { Order } from "@/features/orders/types/orders";

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        })),
      getOrderById: (id) => get().orders.find((order) => order.id === id),
    }),
    { name: "ocop-orders" },
  ),
);
