"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { store_name } from '@/service/constants';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Mock useCart
  const { itemCount: cartItemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              {store_name}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Accueil
            </Link>
            <Link href="/articles" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Boutique
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-2">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-gray-500">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
              Accueil
            </Link>
            <Link href="/articles" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
              Boutique
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
