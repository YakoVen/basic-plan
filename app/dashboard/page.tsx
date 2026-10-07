'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { getOrders, getArticles } from '@/service/firebase/database';
import { Order } from '@/interfaces/order';
import { Article } from '@/interfaces/article';
import { formatPrice } from '@/service/Utils';

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersData, articlesData] = await Promise.all([
          getOrders(),
          getArticles(),
        ]);
        setOrders(ordersData);
        setArticles(articlesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter((o) => o.state === 0).length,
    revenue: orders.filter((o) => o.state >= 1).reduce((sum, o) => sum + (o.total ?? 0), 0),
    activeArticles: articles.filter((a) => a.active).length,
  };

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total commandes</span>
            <ShoppingCart className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">En attente</span>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Revenus</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Articles actifs</span>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{stats.activeArticles}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/articles/add"
          className="bg-indigo-600 text-white rounded-xl p-5 hover:bg-indigo-700 transition flex items-center justify-between">
          <span className="font-medium">Ajouter un article</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/dashboard/orders"
          className="bg-white rounded-xl shadow p-5 hover:shadow-md transition flex items-center justify-between">
          <span className="font-medium">Voir les commandes</span>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </Link>
        <Link href="/dashboard/delivery"
          className="bg-white rounded-xl shadow p-5 hover:shadow-md transition flex items-center justify-between">
          <span className="font-medium">Gerer la livraison</span>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="font-semibold">Commandes recentes</h2>
          <Link href="/dashboard/orders" className="text-sm text-indigo-600 hover:underline">Voir tout</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-5 text-gray-500 text-center">Aucune commande</p>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.name}</p>
                  <p className="text-sm text-gray-500">{order.date} - {order.items?.length ?? 0} article(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total ?? 0)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.state === 0 ? 'bg-yellow-100 text-yellow-700' :
                    order.state === 1 ? 'bg-blue-100 text-blue-700' :
                    order.state === 2 ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.state === 0 ? 'En attente' : order.state === 1 ? 'Confirmee' : order.state === 2 ? 'Expediee' : 'Livree'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
