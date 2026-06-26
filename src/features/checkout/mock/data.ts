import type { PaymentOption, ShippingOption } from "@/features/checkout/types/checkout";

export const MOCK_SHIPPING_OPTIONS: ShippingOption[] = [
  {
    method: "standard",
    label: "Giao hàng tiêu chuẩn",
    price: 30000,
    estimatedDays: "2-3 ngày",
    provider: "GHTK",
  },
  {
    method: "express",
    label: "Giao hàng nhanh",
    price: 45000,
    estimatedDays: "1-2 ngày",
    provider: "GHN",
  },
  {
    method: "economy",
    label: "Giao hàng tiết kiệm",
    price: 18000,
    estimatedDays: "4-6 ngày",
    provider: "Viettel Post",
  },
];

export const MOCK_PAYMENT_OPTIONS: PaymentOption[] = [
  {
    method: "cod",
    label: "Thanh toán khi nhận hàng",
    icon: "mdi:cash",
    description: "Trả tiền mặt cho đơn vị vận chuyển khi nhận sản phẩm.",
  },
  {
    method: "bank_transfer",
    label: "Chuyển khoản ngân hàng",
    icon: "mdi:bank-transfer",
    description: "Chuyển khoản theo thông tin đơn hàng sau khi đặt.",
  },
  {
    method: "wallet",
    label: "Ví điện tử",
    icon: "mdi:wallet-outline",
    description: "Chọn ví điện tử để hoàn tất thanh toán sau khi đặt hàng.",
  },
];
