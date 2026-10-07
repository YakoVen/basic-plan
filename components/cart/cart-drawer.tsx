"use client";

import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/service/Utils';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}

export default function CartDrawer({ isOpen, setIsOpen }: Props) {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingBag /> Mon Panier</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={`${item.articleId}-${item.variantId || index}`} className="flex gap-4 border-b pb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                      <button onClick={() => removeItem(item.articleId, item.variantId)} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                    </div>
                    {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.articleId, item.quantity - 1, item.variantId)} className="px-2 py-1 text-gray-500"><Minus size={14}/></button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.articleId, item.quantity + 1, item.variantId)} className="px-2 py-1 text-gray-500"><Plus size={14}/></button>
                      </div>
                      <span className="font-bold text-indigo-600">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex gap-2">
              <Link href="/cart" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-center border border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50">
                Voir le panier
              </Link>
              <Link href="/checkout" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-center bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                Commander
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
