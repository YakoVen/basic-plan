export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-40" />

      {/* Wilaya table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
        <div className="divide-y">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-4 items-center">
              <div className="h-4 bg-gray-200 rounded w-8" />
              <div className="h-4 bg-gray-200 rounded flex-1" />
              <div className="h-8 bg-gray-200 rounded w-24" />
              <div className="h-8 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
