import { useQuery } from "@tanstack/react-query";
import { ocopService } from "@/features/ocop/services/ocopService";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

const ocopKeys = {
  regions: ["storefront", "ocop", "regions"] as const,
  region: (slug: string) => ["storefront", "ocop", "regions", slug] as const,
  locations: ["storefront", "ocop", "locations"] as const,
};

export function useOcopRegions() {
  return useQuery({
    queryKey: ocopKeys.regions,
    queryFn: ocopService.getRegions,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useOcopRegion(slug: string) {
  return useQuery({
    queryKey: ocopKeys.region(slug),
    queryFn: () => ocopService.getRegionBySlug(slug),
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

export function useOcopLocations() {
  return useQuery({
    queryKey: ocopKeys.locations,
    queryFn: ocopService.getLocations,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}
