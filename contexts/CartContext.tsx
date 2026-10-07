"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../interfaces/order';

interface CartContextProps {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (articleId: string, variantId?: string) => void;
  updateQuantity: (articleId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  buyNow: (item: CartItem) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('ecom_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ecom_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.articleId === newItem.articleId && item.variantId === newItem.variantId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }

      return [...prevItems, newItem];
    });
  };

  const removeItem = (articleId: string, variantId?: string) => {
    setItems((prevItems) => 
      prevItems.filter(item => !(item.articleId === articleId && item.variantId === variantId))
    );
  };

  const updateQuantity = (articleId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(articleId, variantId);
      return;
    }
    
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.articleId === articleId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const buyNow = (item: CartItem) => {
    setItems([{ ...item }]);
  };

  return (
    <CartContext.Provider value={{ items, subtotal, itemCount, addItem, removeItem, updateQuantity, clearCart, buyNow }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
