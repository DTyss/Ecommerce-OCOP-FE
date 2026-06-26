import type { BundleOffer, Voucher } from "@/features/marketing/types/marketing";
import { MOCK_PRODUCTS } from "@/features/catalog/mock/data";

export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: "voucher-percent-10",
    code: "OCOP10",
    type: "percentage",
    value: 10,
    minSpend: 200000,
    maxDiscount: 100000,
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
  {
    id: "voucher-freeship",
    code: "FREESHIP",
    type: "freeShipping",
    value: 0,
    minSpend: 150000,
    maxDiscount: 40000,
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
  {
    id: "voucher-fixed-50",
    code: "OCOP50K",
    type: "fixed",
    value: 50000,
    minSpend: 500000,
    maxDiscount: null,
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
];

const resolveProducts = (ids: string[]) =>
  ids
    .map((id) => MOCK_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is (typeof MOCK_PRODUCTS)[number] => Boolean(product));

export const MOCK_BUNDLES: BundleOffer[] = [
  {
    id: "bundle-p01-gift",
    primaryProductId: "p01",
    products: resolveProducts(["p01", "p13"]),
    bundlePrice: 1399000,
  },
  {
    id: "bundle-p02-tea",
    primaryProductId: "p02",
    products: resolveProducts(["p02", "p11"]),
    bundlePrice: 305000,
  },
  {
    id: "bundle-p03-highland",
    primaryProductId: "p03",
    products: resolveProducts(["p03", "p08"]),
    bundlePrice: 299000,
  },
  {
    id: "bundle-p04-phu-quoc",
    primaryProductId: "p04",
    products: resolveProducts(["p04", "p13", "p14"]),
    bundlePrice: 369000,
  },
];
