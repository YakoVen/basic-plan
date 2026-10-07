import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function WelcomSection() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 to-white overflow-hidden rounded-3xl mx-4 my-6 sm:mx-6 lg:mx-8 shadow-sm border border-indigo-100">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex flex-col items-center text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-6">
          <ShoppingBag size={16} className="mr-2" />
          Nouvelle Collection
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
          Découvrez notre <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
            boutique exclusive
          </span>
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-gray-600 mb-10">
          Trouvez les meilleurs produits aux meilleurs prix. Livraison disponible dans les 58 wilayas d&apos;Algerie avec paiement a la livraison.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/articles" 
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Voir la boutique
            <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link 
            href="/categories" 
            className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-300"
          >
            Parcourir les catégories
          </Link>
        </div>
      </div>
    </section>
  );
}
