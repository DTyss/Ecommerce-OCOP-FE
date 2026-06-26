import { MOCK_SHIPPING_OPTIONS } from "@/features/checkout/mock/data";
import type { CheckoutAddress, ShippingOption } from "@/features/checkout/types/checkout";
import { MOCK_PRODUCTS } from "@/features/catalog/mock/data";
import type { Order } from "@/features/orders/types/orders";

const address: CheckoutAddress = {
  fullName: "Nguyễn Văn An",
  phone: "0912345678",
  province: "Thành phố Hồ Chí Minh",
  district: "Quận 1",
  ward: "Phường Bến Nghé",
  addressDetail: "12 Lê Lợi",
};

const orderItems = (entries: Array<[string, number]>) =>
  entries.map(([productId, quantity]) => {
    const product = MOCK_PRODUCTS.find((item) => item.id === productId);

    if (!product) {
      throw new Error(`Invalid order item seed: ${productId}`);
    }

    return {
      productId,
      quantity,
      snapshot: {
        name: product.name,
        image: product.image,
        price: product.price,
      },
    };
  });

const buildOrder = (
  id: string,
  createdAt: string,
  status: Order["status"],
  entries: Array<[string, number]>,
  shippingOption: ShippingOption,
  discountAmount = 0,
  voucherCode: string | null = null,
): Order => {
  const items = orderItems(entries);
  const subtotal = items.reduce((sum, item) => sum + item.snapshot.price * item.quantity, 0);

  return {
    id,
    createdAt,
    status,
    items,
    shippingAddress: address,
    shippingMethod: shippingOption,
    paymentMethod: "cod",
    subtotal,
    shippingFee: shippingOption.price,
    discountAmount,
    total: subtotal + shippingOption.price - discountAmount,
    voucherCode,
  };
};

export const MOCK_ORDERS: Order[] = [
  buildOrder("ORD-260616-001", "2026-06-15T09:12:00.000Z", "pending", [["p01", 1]], MOCK_SHIPPING_OPTIONS[0]),
  buildOrder(
    "ORD-260612-002",
    "2026-06-12T11:20:00.000Z",
    "confirmed",
    [["p02", 2]],
    MOCK_SHIPPING_OPTIONS[1],
    20000,
    "OCOP20",
  ),
  buildOrder(
    "ORD-260607-003",
    "2026-06-07T15:45:00.000Z",
    "preparing",
    [
      ["p03", 1],
      ["p08", 1],
    ],
    MOCK_SHIPPING_OPTIONS[0],
  ),
  buildOrder(
    "ORD-260602-004",
    "2026-06-02T08:05:00.000Z",
    "shipping",
    [
      ["p04", 2],
      ["p05", 3],
    ],
    MOCK_SHIPPING_OPTIONS[2],
  ),
  buildOrder(
    "ORD-260527-005",
    "2026-05-27T10:34:00.000Z",
    "completed",
    [
      ["p11", 2],
      ["p06", 1],
    ],
    MOCK_SHIPPING_OPTIONS[0],
    30000,
    "FREESHIP",
  ),
  buildOrder("ORD-260520-006", "2026-05-20T13:18:00.000Z", "cancelled", [["p12", 1]], MOCK_SHIPPING_OPTIONS[1]),
];
