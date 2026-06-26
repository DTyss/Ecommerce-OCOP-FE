export interface OcopRegionProfile {
  slug: string;
  name: string;
  description: string;
  image: string;
  banner: string;
  provinceCount: number;
  specialties: string[];
}

export interface OcopLocation {
  id: string;
  productId: string;
  shopId: string;
  name: string;
  province: string;
  region: string;
  category: string;
  latitude: number;
  longitude: number;
}
