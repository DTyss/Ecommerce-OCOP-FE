import { MOCK_OCOP_LOCATIONS, MOCK_OCOP_REGIONS } from "@/features/ocop/mock/data";
import type { OcopLocation, OcopRegionProfile } from "@/features/ocop/types/ocop";

const delay = <T>(value: T, ms = 200): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const ocopService = {
  getRegions: async (): Promise<OcopRegionProfile[]> => delay(MOCK_OCOP_REGIONS),
  getRegionBySlug: async (slug: string): Promise<OcopRegionProfile | null> =>
    delay(MOCK_OCOP_REGIONS.find((region) => region.slug === slug) ?? null),
  getLocations: async (): Promise<OcopLocation[]> => delay(MOCK_OCOP_LOCATIONS),
};
