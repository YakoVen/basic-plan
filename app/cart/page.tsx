"use client";

import LayoutWrapper from '@/components/general/layout-wrapper';
import Breadcrumbs from '@/components/general/breadcrumbs';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/service/Utils';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  return (
    <LayoutWrapper>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Mon Panier' }]} />

        <h1 className="text-3xl font-bold mb-8 mt-4">Mon Panier</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">Votre panier est vide.</p>
            <Link href="/articles" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div key={`${item.articleId}-${item.variantId || index}`} className="flex gap-4 p-4 border rounded-2xl bg-white shadow-sm">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                      </div>
                      <span className="font-bold text-indigo-600">{formatPrice(item.price)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border rounded-lg h-9">
                        <button
                          onClick={() => updateQuantity(item.articleId, item.quantity - 1, item.variantId)}
                          className="px-3 text-gray-500 hover:text-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.articleId, item.quantity + 1, item.variantId)}
                          className="px-3 text-gray-500 hover:text-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.articleId, item.variantId)}
                        className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl h-fit sticky top-24">
              <h3 className="text-lg font-bold mb-4">Recapitulatif</h3>
              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Sous-total ({itemCount} articles)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span className="text-gray-400">Calculee a la commande</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl mb-6 pt-4 border-t">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(subtotal)}</span>
              </div>
              <Link href="/checkout" className="block w-full py-3 text-center bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                Passer la commande
              </Link>
              <Link href="/articles" className="block w-full py-3 text-center text-indigo-600 mt-2 text-sm hover:underline">
                Continuer les achats
              </Link>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
