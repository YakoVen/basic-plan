"use client";

import { useState, useMemo } from 'react';
import { Article } from '@/interfaces/article';
import FilterBar from './filter-bar';
import ItemCard from '@/components/general/item-card';
import { Search, SlidersHorizontal, X, PackageSearch } from 'lucide-react';

interface Props {
  articles: Article[];
}

export default function ArticlesListing({ articles }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
      .filter((a) => selectedCategories.length === 0 || selectedCategories.includes(a.category))
      .filter((a) => a.price >= priceRange[0] && a.price <= priceRange[1])
      .filter((a) => !inStockOnly || (a.inStock !== false))
      .sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [articles, search, selectedCategories, priceRange, inStockOnly, sortOrder]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-gray-700 hover:bg-gray-50"
        >
          <SlidersHorizontal size={18} />
          Filtres
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
          <FilterBar 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
          />
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <FilterBar 
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
            />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1">
        <div className="hidden lg:flex justify-between items-center mb-6">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
          <select 
            className="bg-white border border-gray-200 py-2.5 px-4 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Aucun produit trouvé</h3>
            <p className="text-gray-400 text-sm">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredArticles.map(article => (
              <ItemCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
