export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-40" />
        <div className="h-10 bg-gray-200 rounded-lg w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            {[...Array(3)].map((_, j) => (
              <div key={j} className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
