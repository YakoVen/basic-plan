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

  /* --- DzShip shipping fields (optional) --- */

  /** What the customer picked (1-69). */
  wilayaCode?: number;
  /** What the courier receives (1-58, or the `shipAs` code for 59-69). */
  wilayaShipCode?: number;
  /** Courier spelling of the commune. `commune` above stays the display value. */
  communeName?: string;
  /** Stop-desk id when `deliveryMethod === 'desk'`. */
  stopDeskId?: string;
  stopDeskName?: string;
  /** What the driver collects. Integer DZD. */
  codAmount?: number;
  /** Delivery fee captured at quote time — quotes change, accounting should not. */
  quotedDeliveryFee?: number;
  /** Captured at quote time. A returned parcel costs this plus handling. */
  returnFee?: number;
}
