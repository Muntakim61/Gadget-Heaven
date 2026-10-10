export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-surface-2 ${className}`} />
);

export const CardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-subtle bg-surface">
    <Skeleton className="h-56 rounded-none" />
    <div className="flex flex-col gap-3 p-5">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="mt-2 h-9 w-full rounded-full" />
    </div>
  </div>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div
    className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    aria-busy="true"
    aria-label="Loading products"
  >
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
