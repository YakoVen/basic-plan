"use client";

import React from 'react';
import ItemCard from '../general/item-card';
import { Article } from '@/interfaces/article';

interface SuggestionsPreviewProps {
  products: Article[];
}

export default function SuggestionsPreview({ products }: SuggestionsPreviewProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Suggestions pour vous</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ItemCard key={product.id} article={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
