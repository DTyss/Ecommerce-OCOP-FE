import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-64" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-3 sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-4">
          <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[72px] w-[72px] rounded-xl sm:h-[78px] sm:w-[78px]" />
            ))}
          </div>
          <Skeleton className="order-1 aspect-square rounded-2xl sm:order-2" />
        </div>
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
