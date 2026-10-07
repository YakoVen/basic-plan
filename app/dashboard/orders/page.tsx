'use client';
import React from 'react';
import OrderTable from '@/components/dashboard/order-table';

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>
      <OrderTable />
    </div>
  );
}
