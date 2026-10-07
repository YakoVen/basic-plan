import LayoutWrapper from '@/components/general/layout-wrapper';
import Skeleton from '@/components/general/skeleton';

export default function Loading() {
  return (
    <LayoutWrapper>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="hidden md:block w-64 flex-shrink-0">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
}
