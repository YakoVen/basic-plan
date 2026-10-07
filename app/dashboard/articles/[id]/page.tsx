'use client';
import React, { use } from 'react';
import ArticleEditor from '@/components/dashboard/article-editor';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ArticleEditor mode="edit" articleId={id} />;
}
