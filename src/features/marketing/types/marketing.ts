import type { Product } from "@/features/catalog/types/catalog";

export type VoucherType = "percentage" | "fixed" | "freeShipping";

export interface Voucher {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  minSpend: number;
  maxDiscount: number | null;
  expiresAt: string;
}

export interface FlashSaleProduct {
  product: Product;
  salePrice: number;
  soldPercent: number;
}

export interface FlashSaleCampaign {
  id: string;
  endsAt: string;
  items: FlashSaleProduct[];
}

export interface BundleOffer {
  id: string;
  primaryProductId: string;
  products: Product[];
  bundlePrice: number;
}

export interface ProductRecommendations {
  similar: Product[];
  sameRegion: Product[];
  sameShop: Product[];
}
