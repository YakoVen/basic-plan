import { db } from './config';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, DocumentData 
} from 'firebase/firestore';
import { Article } from '../../interfaces/article';
import { Order } from '../../interfaces/order';
import { DeliveryZone } from '../../interfaces/delivery-zone';

import { mockProducts } from '../mock-data';

// --- ARTICLES ---
export async function getArticles(filters?: any): Promise<Article[]> {
  try {
    const articlesCol = collection(db, 'articles');
    let q = query(articlesCol);
    
    if (filters?.active !== undefined) {
      q = query(q, where('active', '==', filters.active));
    }
    if (filters?.category !== undefined) {
      q = query(q, where('category', '==', filters.category));
    }
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    }
  } catch (err) {
    console.error("Firebase getArticles error, using fallback", err);
  }
  
  // Fallback to mock products
  let filteredMocks = mockProducts;
  if (filters?.active !== undefined) {
    filteredMocks = filteredMocks.filter(p => p.active === filters.active);
  }
  if (filters?.category !== undefined) {
    filteredMocks = filteredMocks.filter(p => p.category === filters.category);
  }
  return filteredMocks;
}

export async function getArticle(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, 'articles', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Article;
    }
  } catch (err) {
    console.error("Firebase getArticle error, using fallback", err);
  }
  return mockProducts.find(p => p.id === id) || null;
}

export async function createArticle(data: Omit<Article, 'id'>): Promise<string> {
  const docRef = doc(collection(db, 'articles'));
  await setDoc(docRef, { ...data, createdAt: new Date().toISOString() });
  return docRef.id;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  const docRef = doc(db, 'articles', id);
  await updateDoc(docRef, data as DocumentData);
}

export async function deleteArticle(id: string): Promise<void> {
  const docRef = doc(db, 'articles', id);
  await deleteDoc(docRef);
}

export async function saveArticle(data: Partial<Article>, id?: string): Promise<string> {
  if (id) {
    await updateArticle(id, data);
    return id;
  } else {
    const docRef = doc(collection(db, 'articles'));
    await setDoc(docRef, { ...data, createdAt: new Date().toISOString() });
    return docRef.id;
  }
}

export async function toggleArticleActive(id: string): Promise<void> {
  const article = await getArticle(id);
  if (article) {
    await updateArticle(id, { active: !article.active });
  }
}

export async function toggleArticleStock(id: string): Promise<void> {
  const article = await getArticle(id);
  if (article) {
    const next = !(article.inStock ?? true);
    const patch: Partial<Article> = { inStock: next };
    if (article.hasVariants && article.variants && article.variants.length > 0) {
      patch.variants = article.variants.map((v) => ({ ...v, inStock: next }));
    }
    await updateArticle(id, patch);
  }
}

export function getEffectiveInStock(article: Article): boolean {
  if (article.hasVariants && article.variants && article.variants.length > 0) {
    return article.variants.some((v) => v.inStock ?? true);
  }
  return article.inStock ?? true;
}

// --- ORDERS ---
export async function getOrders(filters?: any): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    let q = query(ordersCol, orderBy('date', 'desc'));
    
    if (filters?.state !== undefined) {
      q = query(q, where('state', '==', filters.state));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (err) {
    console.error("Firebase getOrders error", err);
  }
  return [];
}

export async function createOrder(data: Omit<Order, 'id' | 'date'>): Promise<string> {
  const docRef = doc(collection(db, 'orders'));
  await setDoc(docRef, { ...data, date: new Date().toISOString(), state: 0 });
  return docRef.id;
}

export async function updateOrderState(id: string, state: number): Promise<void> {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { state });
}




// --- DELIVERY ZONES ---
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  try {
    const zonesCol = collection(db, 'delivery_zones');
    const snapshot = await getDocs(zonesCol);
    return snapshot.docs.map(doc => ({ wilayaId: parseInt(doc.id, 10), ...doc.data() } as DeliveryZone));
  } catch (err) {
    console.error("Firebase getDeliveryZones error", err);
  }
  return [];
}

export async function updateDeliveryZone(wilayaId: number, data: Partial<DeliveryZone>): Promise<void> {
  const docRef = doc(db, 'delivery_zones', wilayaId.toString());
  await setDoc(docRef, data, { merge: true });
}

export async function getDeliveryPrice(wilayaId: number, method: 'home' | 'desk'): Promise<number> {
  try {
    const docRef = doc(db, 'delivery_zones', wilayaId.toString());
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as DeliveryZone;
      return method === 'home' ? data.homePrice : data.deskPrice;
    }
  } catch (err) {
    console.error("Firebase getDeliveryPrice error", err);
  }
  return 500;
}
