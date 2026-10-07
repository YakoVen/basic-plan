import React from 'react';

export default function EditCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 border border-gray-100">
      <h3 className="font-semibold text-lg border-b pb-2 mb-4">{title}</h3>
      {children}
    </div>
  );
}
