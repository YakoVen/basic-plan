import LayoutWrapper from '@/components/general/layout-wrapper';

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="h-9 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-1/3 mt-4" />

            {/* Variants */}
            <div className="flex gap-2 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 w-20 bg-gray-200 rounded-xl" />
              ))}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex gap-4 mt-4">
              <div className="h-12 w-28 bg-gray-200 rounded-xl" />
              <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
            </div>

            {/* Buy Now button */}
            <div className="h-12 w-full bg-gray-200 rounded-xl" />

            {/* Description */}
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
