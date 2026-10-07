'use client';
import React, { useState, useEffect } from 'react';
import { Search, Eye, Download } from 'lucide-react';
import { Order } from '@/interfaces/order';
import { getOrders, updateOrderState } from '@/service/firebase/database';
import { formatPrice } from '@/service/Utils';
import { order_states } from '@/service/constants';
import CommandAmplify from './command-amplify';
import toast from 'react-hot-toast';

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | -1>(-1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  async function handleStateChange(orderId: string, newState: number) {
    try {
      await updateOrderState(orderId, newState);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, state: newState } : o))
      );
      toast.success('Statut mis a jour');
    } catch {
      toast.error('Erreur');
    }
  }

  function exportToCSV() {
    const headers = ['ID', 'Date', 'Client', 'Telephone', 'Wilaya', 'Articles', 'Total', 'Statut'];
    const rows = filtered.map((o) => [
      o.id.substring(0, 8),
      o.date,
      o.name,
      o.phone,
      o.wilaya,
      o.items?.length.toString() ?? '0',
      (o.total ?? 0).toString(),
      order_states[o.state]?.label || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  const filtered = orders
    .filter((o) => statusFilter === -1 || o.state === statusFilter)
    .filter((o) => o.name.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search));

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.state === 0).length,
    revenue: orders.filter((o) => o.state >= 1).reduce((sum, o) => sum + (o.total ?? 0), 0),
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>;
  }

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total commandes</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Revenus</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Rechercher par nom ou telephone..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(Number(e.target.value)); setPage(1); }}
          className="border rounded-lg px-3 py-2">
          <option value={-1}>Tous les statuts</option>
          {order_states.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Telephone</th>
                <th className="px-4 py-3">Articles</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-500">#{order.id.substring(0, 8)}</td>
                  <td className="px-4 py-3 text-sm">{order.date}</td>
                  <td className="px-4 py-3 font-medium">{order.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <a href={`tel:${order.phone}`} className="text-indigo-600">{order.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.items?.length ?? 0} article(s)</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total ?? 0)}</td>
                  <td className="px-4 py-3">
                    <select value={order.state}
                      onChange={(e) => handleStateChange(order.id, Number(e.target.value))}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer
                        ${order.state === 0 ? 'bg-yellow-100 text-yellow-700' :
                          order.state === 1 ? 'bg-blue-100 text-blue-700' :
                          order.state === 2 ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'}`}>
                      {order_states.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-500">Aucune commande</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <p className="text-sm text-gray-500">
              {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} sur {filtered.length}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50">Suiv</button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <CommandAmplify order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
