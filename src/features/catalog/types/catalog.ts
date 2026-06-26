export type OcopStar = 3 | 4 | 5;

export type ProductBadge = "hot" | "new" | "sale" | null;

export interface Product {
  id: string;
  name: string;
  /** Stable SEO-friendly slug for later category/search routes. */
  slug: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  rating: number;
  reviewCount: number;
  ocopStar: OcopStar;
  region: string;
  category: string;
  image: string;
  images: string[];
  shopId: string;
  stock: number;
  soldCount: number;
  badge: ProductBadge;
  description: string;
  tags: string[];
}

export interface Region {
  id: string;
  name: string;
  image: string;
  /** Raw product count, rendered as "356+ SP" */
  productCount: number;
}

export interface Category {
  id: string;
  name: string;
  /** Iconify icon name */
  icon: string;
  slug: string;
}

export interface ProductShopSummary {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  soldCount: number;
  productCount: number;
  region: string;
  responseRate: string;
  joinedDate: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  images: string[];
  verifiedPurchase: boolean;
}

export interface ReviewDraft {
  productId: string;
  rating: number;
  comment: string;
  images: string[];
}

export interface ShippingPolicy {
  freeShippingThreshold: number | null;
  estimatedDays: string;
  returnDays: number;
  provider: string;
}

export interface OcopCertificate {
  star: OcopStar;
  certificateCode: string;
  issuedBy: string;
  issuedDate: string;
  image: string;
}

export interface ProductTraceability {
  qrValue: string;
  batchCode: string;
  producer: string;
  productionDate: string;
  materialRegion: string;
}

export interface ProductDetail extends Product {
  shop: ProductShopSummary;
  reviews: ProductReview[];
  shippingPolicy: ShippingPolicy;
  ocopCertificate: OcopCertificate;
  traceability: ProductTraceability;
  relatedProductIds: string[];
}

export type ProductSortKey = "popular" | "priceAsc" | "priceDesc" | "ratingDesc" | "newest";

export interface ProductDiscoveryFilters {
  keyword: string;
  category: string;
  region: string;
  ocopStar: OcopStar | null;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
}

export interface ProductDiscoveryParams extends ProductDiscoveryFilters {
  sort: ProductSortKey;
  page: number;
  pageSize: number;
}

export interface ProductDiscoveryResult {
  items: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
