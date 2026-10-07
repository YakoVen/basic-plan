import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mt-8"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
      </div>
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  );
}

// Generic skeleton block used by loading.tsx files
export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

