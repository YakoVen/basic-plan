"use server";

import { createOrder, getDeliveryPrice } from '@/service/firebase/database';
import { CartItem } from '@/interfaces/order';
import { wilayas } from '@/service/constants';

export async function createOrderAction(formData: FormData) {
  try {
    const name = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const wilaya = formData.get('wilaya') as string;
    const commune = formData.get('commune') as string;
    const address = formData.get('address') as string || '';
    const deliveryMethod = formData.get('deliveryMethod') as 'home' | 'desk';
    const items: CartItem[] = JSON.parse(formData.get('items') as string);
    const deliveryFee = Number(formData.get('deliveryFee') || 0);
    const total = Number(formData.get('total'));

    if (!name || !phone || !wilaya || !items?.length) {
      return { success: false, error: 'Champs requis manquants' };
    }

    const phoneClean = phone.replace(/\s/g, '');
    if (!/^0[5-7]\d{8}$/.test(phoneClean)) {
      return { success: false, error: 'Numero de telephone invalide' };
    }

    // Recompute subtotal from items to prevent client tampering
    const realSubtotal = items.reduce((acc, it) => acc + Number(it.price) * Number(it.quantity), 0);
    if (!Number.isFinite(realSubtotal) || realSubtotal <= 0) {
      return { success: false, error: 'Panier invalide' };
    }

    // Server-side delivery price check (allow admin default drift of 200 DA)
    const wilayaId = wilayas.indexOf(wilaya) + 1;
    if (wilayaId > 0) {
      const expectedFee = await getDeliveryPrice(wilayaId, deliveryMethod);
      if (Math.abs(expectedFee - deliveryFee) > 200) {
        return { success: false, error: 'Frais de livraison invalides, rechargez la page' };
      }
    }
    const expectedTotal = realSubtotal + deliveryFee;
    if (Math.abs(expectedTotal - total) > 1) {
      return { success: false, error: 'Total invalide, rechargez la page' };
    }

    const orderId = await createOrder({
      name,
      phone: phoneClean,
      wilaya,
      commune,
      address,
      deliveryMethod,
      items,
      subtotal: realSubtotal,
      deliveryFee,
      discount: 0,
      couponCode: undefined,
      total: expectedTotal,
      state: 0,
    });

    return { success: true, orderId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return { success: false, error: message };
  }
}
