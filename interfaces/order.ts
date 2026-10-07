export interface CartItem {
  articleId: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

export interface Order {
  id: string;
  date: string;
  name: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  address: string;
  wilaya: string;
  commune: string;
  deliveryMethod: 'home' | 'desk';
  state: number; // 0=pending, 1=confirmed, 2=shipped, 3=delivered
}
