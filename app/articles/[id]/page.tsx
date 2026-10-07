import { Metadata } from 'next';
import { getArticle } from '@/service/firebase/database';
import Presentation from '@/components/article-page/presentation';
import LayoutWrapper from '@/components/general/layout-wrapper';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const article = await getArticle(id);
    if (!article) return { title: 'Article non trouve' };
    return {
      title: article.title,
      description: article.description?.substring(0, 160),
      openGraph: {
        title: article.title,
        description: article.description?.substring(0, 160),
        images: article.thumbnail ? [article.thumbnail] : [],
      },
    };
  } catch {
    return { title: 'Article' };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;

  let article;
  try {
    article = await getArticle(id);
  } catch {
    notFound();
  }

  if (!article) notFound();

  return (
    <LayoutWrapper>
      <Presentation article={article} />
    </LayoutWrapper>
  );
}
