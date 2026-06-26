import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

function GalleryImage({
  src,
  alt,
  className,
  testId,
}: {
  src: string;
  alt: string;
  className: string;
  testId?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        data-testid={testId}
        role="img"
        aria-label={alt}
        className={cn(
          className,
          "from-ocop-50 to-ocop-amber/10 text-ocop flex flex-col items-center justify-center gap-2 bg-gradient-to-br via-white p-3 text-center dark:from-green-950/30 dark:via-gray-900 dark:to-amber-950/20",
        )}
      >
        <Icon icon="mdi:image-off-outline" width={28} />
        <span className="line-clamp-2 text-xs font-semibold">{alt}</span>
      </span>
    );
  }

  return <img data-testid={testId} src={src} alt={alt} onError={() => setFailed(true)} className={className} />;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const { t } = useTranslation("storefront");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  const showPreviousImage = () => {
    setSelectedIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setSelectedIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div
      data-testid="product-image-gallery"
      className="grid gap-3 self-start sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-4"
    >
      <div className="relative order-2 h-[78px] sm:order-1 sm:h-auto">
        <div className="storefront-horizontal-scrollbar absolute inset-0 flex gap-2 overflow-x-auto pb-1 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pr-1 sm:pb-0">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={t("productDetail.selectImage", { index: index + 1 })}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "group/thumb relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 shadow-sm transition-all sm:h-[78px] sm:w-[78px] dark:bg-gray-900",
                selectedIndex === index
                  ? "border-ocop ring-ocop/15 shadow-[0_6px_18px_rgba(11,107,58,0.18)] ring-2"
                  : "hover:border-ocop/45 dark:hover:border-ocop/60 border-transparent hover:shadow-md dark:border-gray-800",
              )}
            >
              <GalleryImage
                src={image}
                alt={`${productName} ${index + 1}`}
                className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover/thumb:scale-105"
              />
              {selectedIndex === index && (
                <span className="bg-ocop absolute bottom-2 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full shadow-sm sm:top-1/2 sm:bottom-auto sm:left-1 sm:h-8 sm:w-1 sm:-translate-x-0 sm:-translate-y-1/2" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="ocop-gradient-border group relative z-0 order-1 aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_12px_35px_rgba(15,23,42,0.10)] sm:order-2 dark:bg-gray-900 dark:shadow-[0_12px_35px_rgba(0,0,0,0.32)]">
        <GalleryImage
          key={selectedImage}
          testId="product-gallery-main-image"
          src={selectedImage}
          alt={productName}
          className="h-full w-full object-cover transition-opacity duration-300"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/30 to-transparent p-4 text-white">
          <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </span>
          <span className="text-ocop flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
            <Icon icon="mdi:image-multiple-outline" width={20} />
          </span>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label={t("productDetail.previousImage")}
              onClick={showPreviousImage}
              className="hover:bg-ocop absolute top-1/2 left-3 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/88 text-gray-700 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:text-white dark:border-gray-700 dark:bg-gray-900/88 dark:text-gray-200"
            >
              <Icon icon="mdi:chevron-left" width={24} />
            </button>
            <button
              type="button"
              aria-label={t("productDetail.nextImage")}
              onClick={showNextImage}
              className="hover:bg-ocop absolute top-1/2 right-3 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/88 text-gray-700 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:text-white dark:border-gray-700 dark:bg-gray-900/88 dark:text-gray-200"
            >
              <Icon icon="mdi:chevron-right" width={24} />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent" />
      </div>
    </div>
  );
}
