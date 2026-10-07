"use client";

import { categories } from '@/service/constants';
import { RotateCcw } from 'lucide-react';

interface Props {
  selectedCategories: number[];
  setSelectedCategories: (c: number[]) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (b: boolean) => void;
}

export default function FilterBar({
  selectedCategories, setSelectedCategories, priceRange, setPriceRange, inStockOnly, setInStockOnly
}: Props) {

  const toggleCat = (index: number) => {
    if (selectedCategories.includes(index)) {
      setSelectedCategories(selectedCategories.filter(c => c !== index));
    } else {
      setSelectedCategories([...selectedCategories, index]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Catégories</h3>
        <div className="space-y-2.5">
          {categories.map((cat, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(index)}
                onChange={() => toggleCat(index)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Prix (DA)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0] || ''}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Min"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            value={priceRange[1] === 100000 ? '' : priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Max"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">En stock uniquement</span>
        </label>
      </div>

      <button
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 100000]);
          setInStockOnly(false);
        }}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <RotateCcw size={14} />
        Réinitialiser les filtres
      </button>
    </div>
  );
}
