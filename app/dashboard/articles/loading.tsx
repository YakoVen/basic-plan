export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="h-10 bg-gray-200 rounded-lg w-36" />
      </div>

      {/* Article cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="flex gap-2 mt-2">
                <div className="h-7 bg-gray-200 rounded w-16" />
                <div className="h-7 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
