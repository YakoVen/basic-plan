import { Metadata } from 'next';
import { getArticles } from '@/service/firebase/database';
import ArticlesListing from '@/components/articles-page/articles-listing';
import LayoutWrapper from '@/components/general/layout-wrapper';
import { store_name } from '@/service/constants';
import { Article } from '@/interfaces/article';

export const metadata: Metadata = {
  title: `Boutique | ${store_name}`,
  description: 'Parcourez notre collection de produits',
};

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  let articles: Article[] = [];
  try {
    articles = await getArticles({ active: true });
  } catch {
    // Firebase not configured
  }

  return (
    <LayoutWrapper>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Nos Produits</h1>
            <p className="text-gray-500 mt-1">Découvrez notre sélection de produits</p>
          </div>
          <ArticlesListing articles={articles} />
        </div>
      </div>
    </LayoutWrapper>
  );
}
