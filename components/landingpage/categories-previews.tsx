"use client";

import React from 'react';
import Link from 'next/link';
import { categories } from '@/service/constants';

const categoryStyles = [
  { gradient: 'from-violet-500 to-purple-600', icon: '👗', label: 'Mode' },
  { gradient: 'from-blue-500 to-cyan-500', icon: '📱', label: 'High-Tech' },
  { gradient: 'from-amber-500 to-orange-500', icon: '🏠', label: 'Maison' },
  { gradient: 'from-green-500 to-emerald-500', icon: '⚽', label: 'Sport' },
  { gradient: 'from-pink-500 to-rose-500', icon: '💄', label: 'Beauté' },
  { gradient: 'from-indigo-500 to-blue-600', icon: '🧳', label: 'Bagagerie' },
];

export default function CategoriesPreviews() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explorer par Catégories</h2>
          <p className="text-gray-500 mt-2">Trouvez ce que vous cherchez facilement</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => {
            const style = categoryStyles[index] || categoryStyles[0];
            return (
              <Link
                key={index}
                href={`/articles?category=${index}`}
                className="group"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                  <div className="text-4xl sm:text-5xl mb-3">{style.icon}</div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">{cat.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
