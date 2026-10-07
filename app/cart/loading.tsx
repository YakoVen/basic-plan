import LayoutWrapper from '@/components/general/layout-wrapper';
import Skeleton from '@/components/general/skeleton';

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-32 mb-6" />

        {/* Cart items */}
        <div className="space-y-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border p-4 flex gap-4 animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-9 w-24 bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded self-start" />
            </div>
          ))}
        </div>

        {/* Summary card */}
        <div className="bg-gray-50 rounded-2xl border p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/5" />
          </div>
          <div className="h-12 bg-gray-200 rounded-xl w-full mt-4" />
        </div>
      </div>
    </LayoutWrapper>
  );
}
