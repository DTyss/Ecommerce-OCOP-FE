import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/features/catalog/hooks/useCatalog";
import { useOcopLocations } from "@/features/ocop/hooks/useOcop";
import { Controls } from "@/lib/map/controls";
import { Map } from "@/lib/map/map";
import { Marker, MarkerContent } from "@/lib/map/marker";
import { MarkerPopup } from "@/lib/map/popup";
import type { MapStyleOption } from "@/lib/map/types";
import { formatCurrency } from "@/utils/currency";

const ALL = "all";

const OCOP_MAP_STYLE: MapStyleOption = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export default function OcopMapPage() {
  const { t } = useTranslation("storefront");
  const search = useSearch({ from: "/_storefront/ocop-map" });
  const { data: locations = [], isLoading } = useOcopLocations();
  const { data: products = [] } = useProducts();
  const [region, setRegion] = useState(search.region ?? ALL);
  const [category, setCategory] = useState(ALL);

  const regions = useMemo(() => [...new Set(locations.map((location) => location.region))].sort(), [locations]);
  const categories = useMemo(() => [...new Set(locations.map((location) => location.category))].sort(), [locations]);
  const filteredLocations = useMemo(
    () =>
      locations.filter(
        (location) =>
          (region === ALL || location.region === region) && (category === ALL || location.category === category),
      ),
    [category, locations, region],
  );

  return (
    <div className="space-y-6">
      <section className="ocop-gradient-border from-ocop-50 to-ocop-amber/10 dark:to-ocop-amber/5 flex flex-col gap-5 rounded-2xl bg-gradient-to-r via-white p-5 shadow-[0_8px_28px_rgba(11,107,58,0.09)] lg:flex-row lg:items-end lg:justify-between dark:from-green-950/25 dark:via-gray-900">
        <div className="max-w-2xl">
          <span className="text-ocop inline-flex items-center gap-2 text-sm font-bold">
            <Icon icon="mdi:map-marker-star-outline" width={20} />
            {t("ocop.map.eyebrow")}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{t("ocop.map.title")}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{t("ocop.map.subtitle")}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-[460px]">
          <FilterSelect
            label={t("ocop.map.filterRegion")}
            value={region}
            allLabel={t("ocop.map.allRegions")}
            items={regions}
            onChange={setRegion}
          />
          <FilterSelect
            label={t("ocop.map.filterCategory")}
            value={category}
            allLabel={t("ocop.map.allCategories")}
            items={categories}
            onChange={setCategory}
          />
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 text-sm">
        <p className="font-medium text-gray-600 dark:text-gray-300">
          {t("ocop.map.resultCount", { count: filteredLocations.length })}
        </p>
        <Link to="/regions" className="text-ocop hover:text-ocop-dark font-semibold">
          {t("ocop.map.exploreRegions")}
          <Icon icon="mdi:chevron-right" className="inline" width={17} />
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-[620px] rounded-2xl" />
      ) : (
        <section className="ocop-gradient-border relative h-[620px] overflow-hidden rounded-2xl bg-gray-100 shadow-[0_12px_36px_rgba(11,107,58,0.12)] dark:bg-gray-900">
          <Map center={[106.2, 16.3]} zoom={5} minZoom={4} maxZoom={15} style={OCOP_MAP_STYLE}>
            <Controls showZoom showFullscreen position="top-right" />
            {filteredLocations.map((location) => {
              const product = products.find((item) => item.id === location.productId);

              return (
                <Marker key={location.id} longitude={location.longitude} latitude={location.latitude}>
                  <MarkerContent>
                    <span
                      className="bg-ocop flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition hover:scale-110"
                      aria-label={location.name}
                    >
                      <Icon icon="mdi:leaf-maple" width={19} />
                    </span>
                  </MarkerContent>
                  <MarkerPopup
                    closeButton
                    className="w-64 overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900"
                  >
                    {product && (
                      <img src={product.image} alt={product.name} className="aspect-[16/9] w-full object-cover" />
                    )}
                    <div className="p-3">
                      <p className="line-clamp-2 font-bold text-gray-900 dark:text-gray-100">{location.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Icon icon="mdi:map-marker-outline" width={15} />
                        {location.province} · {location.region}
                      </p>
                      {product && <p className="text-ocop mt-2 text-lg font-bold">{formatCurrency(product.price)}</p>}
                      <Link
                        to="/product/$productId"
                        params={{ productId: location.productId }}
                        className="bg-ocop hover:bg-ocop-dark mt-3 flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-white"
                      >
                        {t("ocop.map.viewProduct")}
                        <Icon icon="mdi:arrow-right" width={16} />
                      </Link>
                    </div>
                  </MarkerPopup>
                </Marker>
              );
            })}
          </Map>

          {filteredLocations.length === 0 && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/65 backdrop-blur-sm dark:bg-gray-950/65">
              <div className="text-center">
                <Icon icon="mdi:map-marker-off-outline" className="mx-auto text-gray-400" width={48} />
                <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">{t("ocop.map.empty")}</p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  allLabel,
  items,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  items: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-ocop/20 bg-white dark:bg-gray-900">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
