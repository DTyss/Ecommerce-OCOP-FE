import type { OcopStar } from "@/features/catalog/types/catalog";

export type SellerProductStatus = "active" | "outOfStock" | "pending";

export interface SellerRegistrationDraft {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  region: string;
  businessAddress: string;
  businessLicense: string;
  socialLink: string;
  productCategory: string;
  mainProduct: string;
  shopDescription: string;
  logoFileName: string;
  ocopCertificateCode: string;
  acceptedTerms: boolean;
}

export interface SellerProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  ocopStar: OcopStar;
  status: SellerProductStatus;
  image: string;
  soldCount: number;
  updatedAt: string;
}

export interface SellerDashboardMetric {
  id: string;
  labelKey: string;
  value: string;
  icon: string;
  tone: "green" | "amber" | "blue" | "red";
}
