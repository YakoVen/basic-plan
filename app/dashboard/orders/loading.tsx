export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg flex-1" />
        <div className="h-10 bg-gray-200 rounded-lg w-36" />
        <div className="h-10 bg-gray-200 rounded-lg w-20" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
        <div className="bg-gray-50 px-4 py-3 flex gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
        <div className="divide-y">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-4 py-4 flex gap-4 items-center">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32 flex-1" />
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-7 w-7 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
