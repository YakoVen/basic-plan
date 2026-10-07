"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Article } from '@/interfaces/article';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, calculateDiscount } from '@/service/Utils';
import { getEffectiveInStock } from '@/service/firebase/database';
import toast from 'react-hot-toast';

export interface ItemCardProps {
  article: Article;
}

export default function ItemCard({ article }: ItemCardProps) {
  const { addItem } = useCart();

  const inStock = getEffectiveInStock(article);
  const hasVariants = article.hasVariants && article.variants && article.variants.length > 0;
  const oldPrice = article.oldPrice || article.originalPrice;
  const discount = oldPrice ? calculateDiscount(oldPrice, article.price) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      toast('Selectionnez les options du produit', { icon: '👆' });
      return;
    }
    if (!inStock) return;

    addItem({
      articleId: article.id,
      title: article.title,
      price: article.price,
      thumbnail: article.thumbnail,
      quantity: 1,
    });
    toast.success('Ajoute au panier');
  };

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative">

        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {discount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Rupture
            </span>
          )}
        </div>

        {hasVariants && (
          <div className="absolute top-2 right-2 z-10">
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
              {article.variants!.length} options
            </span>
          </div>
        )}

        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart size={40} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-gray-900 font-medium line-clamp-2 min-h-[3rem] mb-1 group-hover:text-indigo-600 transition-colors">
            {article.title}
          </h3>

          <div className="mt-auto pt-2 flex items-end justify-between">
            <div>
              {oldPrice && oldPrice > article.price && (
                <div className="text-xs text-gray-400 line-through">
                  {formatPrice(oldPrice)}
                </div>
              )}
              <div className="text-lg font-bold text-indigo-700">
                {formatPrice(article.price)}
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={!inStock}
              className={`p-2 rounded-full transition-colors ${
                inStock
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Ajouter au panier"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
