export const CATEGORY_IMAGES = {
  regional: "/images/categories/Dac-san-vung-mien-optimized.jpg",
  food: "/images/categories/Thuc-pham-optimized.jpg",
  drink: "/images/categories/Do-uong-optimized.jpg",
  agriculture: "/images/categories/Nong-san-optimized.jpg",
  medicinal: "/images/categories/San-pham-duoc-lieu-optimized.jpg",
  handicraft: "/images/categories/Thu-cong-my-nghe-optimized.jpg",
  textile: "/images/categories/may-mac-tho-cam-optimized.jpg",
  region: "/images/regions/markers/region-star.svg",
} as const;

export const REGION_IMAGES = {
  "tay-bac": "/images/regions/tay-bac.jpg",
  "dong-bac": "/images/regions/dong-bac.jpg",
  "dong-bang-song-hong": "/images/regions/dong-bang-song-hong.jpg",
  "bac-trung-bo": "/images/regions/bac-trung-bo.jpg",
  "nam-trung-bo": "/images/regions/nam-trung-bo.jpg",
  "tay-nguyen": "/images/regions/tay-nguyen.jpg",
  "dong-nam-bo": "/images/regions/dong-nam-bo.jpg",
  "dong-bang-cuu-long": "/images/regions/dong-bang-cuu-long.jpg",
} as const;

function normalizeImageKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function getLocalRegionImage(slug: keyof typeof REGION_IMAGES) {
  return REGION_IMAGES[slug];
}

export function getLocalCategoryImage(value: string) {
  const key = normalizeImageKey(value);

  if (/may mac|tho cam|textile|brocade|silk|scarf/.test(key)) {
    return CATEGORY_IMAGES.textile;
  }
  if (/thu cong|handicraft|ceramic|pottery/.test(key)) {
    return CATEGORY_IMAGES.handicraft;
  }
  if (/duoc lieu|medicinal|mushroom|herbal|medicine/.test(key)) {
    return CATEGORY_IMAGES.medicinal;
  }
  if (/do uong|drink|tea|coffee/.test(key)) {
    return CATEGORY_IMAGES.drink;
  }
  if (
    /nong san|agriculture|vegetable|farm|rice|fruit|pomelo|orange|honey|potato|orchard|plantation|pepper/.test(
      key,
    )
  ) {
    return CATEGORY_IMAGES.agriculture;
  }
  if (/thuc pham|food|birdnest|sauce|beef|package|gift/.test(key)) {
    return CATEGORY_IMAGES.food;
  }
  if (/region|vietnam|mekong|mountain|river|coast|sea|beach|city|delta/.test(key)) {
    return CATEGORY_IMAGES.region;
  }

  return CATEGORY_IMAGES.regional;
}
