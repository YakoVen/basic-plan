"use client";

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './cart-drawer';

export default function CartIcon() {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
      >
        <ShoppingBag size={24} />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-in zoom-in">
            {itemCount}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
