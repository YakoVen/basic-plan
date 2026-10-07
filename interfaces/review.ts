export interface Review {
  id: string;
  articleId: string;
  authorName: string;
  rating: number; // 1-5
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}
