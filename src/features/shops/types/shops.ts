export interface Shop {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  productCount: number;
  followerCount: number;
  region: string;
  category: string;
  responseRate: string;
  joinedDate: string;
  badge: "featured" | "favorite" | null;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  certificate: string;
  description: string;
  categoryTags: string[];
}

export type ShopSummary = Shop;
