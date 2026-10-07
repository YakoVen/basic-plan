export interface Variant {
  id: string;
  name: string; // e.g., 'Rouge / M'
  type: string; // e.g., 'color', 'size'
  color?: string; // hex color code
  size?: string;
  material?: string;
  inStock: boolean;
  price?: number; // optional override price
}

export interface Article {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  screenshots: string[];
  price: number;
  originalPrice?: number;
  oldPrice?: number;
  category: number;
  active: boolean;
  rating?: number;
  ratingsCount?: number;
  salesCount?: number;
  variants?: Variant[];
  hasVariants?: boolean;
  inStock?: boolean;
  createdAt?: string;
}
