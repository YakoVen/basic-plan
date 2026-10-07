import React from 'react';
import LayoutWrapper from '@/components/general/layout-wrapper';
import WelcomSection from '@/components/landingpage/welcom-section';
import CategoriesPreviews from '@/components/landingpage/categories-previews';
import FeaturedProducts from '@/components/landingpage/featured-products';
import SuggestionsPreview from '@/components/landingpage/suggestions-preview';
import RatingsPreview from '@/components/landingpage/ratings-preview';
import StoreSection from '@/components/landingpage/store-section';
import { getArticles } from '@/service/firebase/database';
import { Article } from '@/interfaces/article';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let allArticles: Article[] = [];
  try {
    allArticles = await getArticles({ active: true });
  } catch {
    // Firebase not configured yet — use empty array
  }

  const featuredProducts = allArticles.slice(0, 10);
  const suggestedProducts = allArticles.slice(10, 14);

  return (
    <LayoutWrapper>
      <WelcomSection />
      <CategoriesPreviews />
      <FeaturedProducts products={featuredProducts} />
      <SuggestionsPreview products={suggestedProducts} />
      <RatingsPreview />
      <StoreSection />
    </LayoutWrapper>
  );
}
