

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow animate-pulse">
        <div className="p-5 border-b flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-5 py-4 flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-48" />
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
