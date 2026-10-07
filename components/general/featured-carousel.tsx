"use client";

import React, { useRef, useState, useEffect } from 'react';
import ItemCard from './item-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/interfaces/article';

interface FeaturedCarouselProps {
  articles: Article[];
  title?: string;
}

export default function FeaturedCarousel({ articles, title = "Produits en vedette" }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="py-8 relative group">
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      
      <div className="relative">
        {/* Navigation Buttons */}
        {showLeft && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white/90 p-2 rounded-full shadow-md text-indigo-600 hover:bg-indigo-50 focus:outline-none hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article, index) => (
            <div key={article.id || index} className="min-w-[240px] md:min-w-[280px] snap-start flex-none">
              <ItemCard article={article} />
            </div>
          ))}
        </div>

        {showRight && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white/90 p-2 rounded-full shadow-md text-indigo-600 hover:bg-indigo-50 focus:outline-none hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
