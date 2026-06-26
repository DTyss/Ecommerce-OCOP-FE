import { mockCategories } from "@/features/catalog/mock/data";
import type {
  Category,
  OcopStar,
  Product,
  ProductDiscoveryFilters,
  ProductDiscoveryParams,
  ProductDiscoveryResult,
  ProductSortKey,
} from "@/features/catalog/types/catalog";

export const DEFAULT_PAGE_SIZE = 12;

const SORT_KEYS: ProductSortKey[] = ["popular", "priceAsc", "priceDesc", "ratingDesc", "newest"];

type DiscoveryInput = Partial<
  Omit<ProductDiscoveryParams, "ocopStar" | "minPrice" | "maxPrice" | "rating" | "page" | "pageSize">
> & {
  ocopStar?: OcopStar | string | null;
  minPrice?: number | string | null;
  maxPrice?: number | string | null;
  rating?: number | string | null;
  page?: number | string | null;
  pageSize?: number | string | null;
};

export type SerializedDiscoveryParams = {
  keyword?: string;
  category?: string;
  region?: string;
  ocopStar?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: ProductSortKey;
  page?: number;
};

const parseNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = parseNumber(value);
  return parsed && parsed > 0 ? Math.floor(parsed) : fallback;
};

const parseOcopStar = (value: unknown): OcopStar | null => {
  const parsed = parseNumber(value);
  return parsed === 3 || parsed === 4 || parsed === 5 ? parsed : null;
};

const parseRating = (value: unknown) => {
  const parsed = parseNumber(value);
  return parsed && parsed >= 1 && parsed <= 5 ? parsed : null;
};

const parseSort = (value: unknown): ProductSortKey =>
  typeof value === "string" && SORT_KEYS.includes(value as ProductSortKey) ? (value as ProductSortKey) : "popular";

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const tokenizeText = (value: string) => normalizeText(value).match(/[a-z0-9]+/g) ?? [];

const editDistance = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1]! + 1,
        previous[rightIndex]! + 1,
        previous[rightIndex - 1]! + substitutionCost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length]!;
};

const tokenMatchScore = (queryToken: string, productToken: string) => {
  if (queryToken === productToken) return 1;
  if (productToken.startsWith(queryToken)) return 0.92;
  if (queryToken.length >= 3 && productToken.includes(queryToken)) return 0.82;

  // Very short tokens produce noisy typo matches, so only fuzzy-match 3+ chars.
  if (queryToken.length < 3) return 0;

  const distance = editDistance(queryToken, productToken);
  const maxDistance = queryToken.length <= 4 ? 1 : Math.max(1, Math.floor(queryToken.length * 0.3));
  const similarity = 1 - distance / Math.max(queryToken.length, productToken.length);

  return distance <= maxDistance && similarity >= 0.6 ? similarity * 0.8 : 0;
};

const SEARCH_FIELDS = [
  { value: (product: Product) => product.name, weight: 1 },
  { value: (product: Product) => product.tags.join(" "), weight: 0.88 },
  { value: (product: Product) => product.category, weight: 0.8 },
  { value: (product: Product) => product.region, weight: 0.78 },
  { value: (product: Product) => product.description, weight: 0.62 },
] as const;

/** Returns a relevance score, or null when every keyword token cannot be matched. */
export const getProductSearchScore = (product: Product, keyword: string) => {
  const keywordTokens = tokenizeText(keyword);

  if (!keywordTokens.length) {
    return 0;
  }

  let totalScore = 0;

  for (const keywordToken of keywordTokens) {
    let bestScore = 0;

    for (const field of SEARCH_FIELDS) {
      for (const productToken of tokenizeText(field.value(product))) {
        bestScore = Math.max(bestScore, tokenMatchScore(keywordToken, productToken) * field.weight);
      }
    }

    if (bestScore === 0) return null;
    totalScore += bestScore;
  }

  const normalizedKeyword = normalizeText(keyword).trim();
  const normalizedName = normalizeText(product.name);
  const phraseBonus = normalizedName.includes(normalizedKeyword) ? 0.35 : 0;

  return totalScore / keywordTokens.length + phraseBonus;
};

/** Fuzzy product search ranked by name/tag relevance, then popularity. */
export function fuzzySearchProducts(products: Product[], keyword: string, limit?: number) {
  const ranked = products
    .map((product) => ({
      product,
      score: getProductSearchScore(product, keyword),
    }))
    .filter((entry): entry is { product: Product; score: number } => entry.score !== null)
    .sort(
      (a, b) => b.score - a.score || b.product.rating - a.product.rating || b.product.soldCount - a.product.soldCount,
    )
    .map(({ product }) => product);

  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

export function getCategoryNameBySlug(slug: string, categories: Category[] = mockCategories) {
  return categories.find((category) => category.slug === slug)?.name ?? null;
}

/** Resolve the canonical category slug, with a Vietnamese-safe fallback. */
export function getCategorySlugByName(name: string, categories: Category[] = mockCategories) {
  const category = categories.find((item) => normalizeText(item.name) === normalizeText(name));

  return (
    category?.slug ??
    normalizeText(name)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export function normalizeDiscoveryParams(input: DiscoveryInput): ProductDiscoveryParams {
  const minPrice = parseNumber(input.minPrice);
  const maxPrice = parseNumber(input.maxPrice);

  return {
    keyword: typeof input.keyword === "string" ? input.keyword.trim() : "",
    category: typeof input.category === "string" ? input.category.trim() : "",
    region: typeof input.region === "string" ? input.region.trim() : "",
    ocopStar: parseOcopStar(input.ocopStar),
    minPrice: minPrice !== null && minPrice >= 0 ? minPrice : null,
    maxPrice: maxPrice !== null && maxPrice >= 0 ? maxPrice : null,
    rating: parseRating(input.rating),
    sort: parseSort(input.sort),
    page: parsePositiveInt(input.page, 1),
    pageSize: parsePositiveInt(input.pageSize, DEFAULT_PAGE_SIZE),
  };
}

export function serializeDiscoveryParams(params: ProductDiscoveryParams): SerializedDiscoveryParams {
  return {
    ...(params.keyword ? { keyword: params.keyword } : {}),
    ...(params.category ? { category: params.category } : {}),
    ...(params.region ? { region: params.region } : {}),
    ...(params.ocopStar ? { ocopStar: params.ocopStar } : {}),
    ...(params.minPrice !== null ? { minPrice: params.minPrice } : {}),
    ...(params.maxPrice !== null ? { maxPrice: params.maxPrice } : {}),
    ...(params.rating !== null ? { rating: params.rating } : {}),
    ...(params.sort !== "popular" ? { sort: params.sort } : {}),
    ...(params.page > 1 ? { page: params.page } : {}),
  };
}

const filterByCategory = (products: Product[], slug: string) => {
  if (!slug || slug === "dac-san-vung-mien") {
    return products;
  }

  if (slug === "ocop-5-sao") {
    return products.filter((product) => product.ocopStar === 5);
  }

  if (slug === "ocop-4-sao") {
    return products.filter((product) => product.ocopStar === 4);
  }

  if (slug === "noi-bat") {
    return products.filter((product) => product.badge === "hot" || product.soldCount > 500);
  }

  const categoryName = getCategoryNameBySlug(slug);
  return categoryName
    ? products.filter(
        (product) => product.category === categoryName || getCategorySlugByName(product.category) === slug,
      )
    : products;
};

const sortProducts = (products: Product[], sort: ProductSortKey) =>
  [...products].sort((a, b) => {
    switch (sort) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "ratingDesc":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "newest":
        return Number(b.badge === "new") - Number(a.badge === "new") || b.id.localeCompare(a.id);
      case "popular":
      default:
        return b.rating - a.rating || b.soldCount - a.soldCount;
    }
  });

export function discoverProducts(products: Product[], params: ProductDiscoveryParams): ProductDiscoveryResult {
  let filtered = params.keyword ? fuzzySearchProducts(products, params.keyword) : products;

  filtered = filterByCategory(filtered, params.category);

  if (params.region) {
    filtered = filtered.filter((product) => product.region === params.region);
  }

  if (params.ocopStar) {
    filtered = filtered.filter((product) => product.ocopStar === params.ocopStar);
  }

  if (params.minPrice !== null) {
    filtered = filtered.filter((product) => product.price >= params.minPrice!);
  }

  if (params.maxPrice !== null) {
    filtered = filtered.filter((product) => product.price <= params.maxPrice!);
  }

  if (params.rating !== null) {
    filtered = filtered.filter((product) => product.rating >= params.rating!);
  }

  // Relevance is the natural default for a keyword search. Explicit sort
  // choices (price/rating/newest) still take precedence.
  const sorted = params.keyword && params.sort === "popular" ? filtered : sortProducts(filtered, params.sort);
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.pageSize));
  const page = Math.min(Math.max(params.page, 1), totalPages);
  const start = (page - 1) * params.pageSize;

  return {
    items: sorted.slice(start, start + params.pageSize),
    totalItems,
    totalPages,
    page,
    pageSize: params.pageSize,
  };
}

export function getUniqueRegions(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.region))].sort((a, b) => a.localeCompare(b));
}

export function getPriceBounds(products: Product[]) {
  if (!products.length) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...products.map((product) => product.price)),
    max: Math.max(...products.map((product) => product.price)),
  };
}

export function hasActiveDiscoveryFilters(filters: ProductDiscoveryFilters) {
  return Boolean(
    filters.keyword ||
    filters.category ||
    filters.region ||
    filters.ocopStar ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.rating !== null,
  );
}
