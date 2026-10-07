import LayoutWrapper from '@/components/general/layout-wrapper';
import Skeleton from '@/components/general/skeleton';

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Skeleton className="h-9 w-56 mb-8" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left — form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-11 bg-gray-200 rounded-xl" />
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border space-y-3 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-16 bg-gray-200 rounded-xl" />
              <div className="h-16 bg-gray-200 rounded-xl" />
            </div>
          </div>

          {/* Right — summary */}
          <div className="bg-gray-50 p-6 rounded-2xl border space-y-4 h-fit animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
              </div>
            </div>
            <div className="h-14 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
