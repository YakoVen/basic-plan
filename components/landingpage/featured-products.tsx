"use client";

import React from 'react';
import Link from 'next/link';
import ItemCard from '../general/item-card';
import { Article } from '@/interfaces/article';

interface FeaturedProductsProps {
  products: Article[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Produits Populaires</h2>
          <Link href="/articles" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            Voir tout &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.slice(0, 10).map((product) => (
            <ItemCard key={product.id} article={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
