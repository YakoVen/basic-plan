import LayoutWrapper from '@/components/general/layout-wrapper';
import Skeleton from '@/components/general/skeleton';

export default function Loading() {
  return (
    <LayoutWrapper>
      {/* Hero skeleton */}
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <Skeleton className="h-[420px] w-full" />
      </div>

      {/* Categories skeleton */}
      <div className="mb-10">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-32 h-32 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="mb-10">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="w-full aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions skeleton */}
      <div className="mb-10">
        <Skeleton className="h-6 w-44 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
}
