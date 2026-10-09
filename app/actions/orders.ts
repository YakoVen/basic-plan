"use server";

import { createOrder, getDeliveryPrice } from '@/service/firebase/database';
import { CartItem } from '@/interfaces/order';
import { validateAddress, validatePhone, resolveShipCode } from '@/service/shipping/wilaya-data';

export async function createOrderAction(formData: FormData) {
  try {
    const name = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const wilaya = formData.get('wilaya') as string;
    const commune = formData.get('commune') as string;
    const address = formData.get('address') as string || '';
    const deliveryMethod = formData.get('deliveryMethod') as 'home' | 'desk';
    const items: CartItem[] = JSON.parse(formData.get('items') as string);
    const total = Number(formData.get('total'));

    // DzShip address fields. The numeric code is authoritative.
    const wilayaCode = Number(formData.get('wilayaCode'));
    const communeName = (formData.get('communeName') as string) || commune;
    const stopDeskId = (formData.get('stopDeskId') as string) || undefined;
    const stopDeskName = (formData.get('stopDeskName') as string) || undefined;
    const returnFee = Number(formData.get('returnFee') || 0);

    if (!name || !phone || !wilaya || !items?.length) {
      return { success: false, error: 'Champs requis manquants' };
    }

    if (!Number.isInteger(wilayaCode) || wilayaCode < 1 || wilayaCode > 69) {
      return { success: false, error: 'Wilaya invalide' };
    }

    // Validate the commune the way the courier will, before anything is stored.
    const addressCheck = validateAddress(wilayaCode, communeName);
    if (!addressCheck.ok) {
      return { success: false, error: addressCheck.error };
    }

    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.ok) {
      return { success: false, error: phoneCheck.error };
    }
    const phoneClean = phoneCheck.phone;

    if (deliveryMethod === 'desk' && !stopDeskId) {
      return { success: false, error: 'Point de relais requis' };
    }

    // Recompute subtotal from items to prevent client tampering
    const realSubtotal = items.reduce((acc, it) => acc + Number(it.price) * Number(it.quantity), 0);
    if (!Number.isFinite(realSubtotal) || realSubtotal <= 0) {
      return { success: false, error: 'Panier invalide' };
    }

    // Prefer a live courier quote; fall back to the static zone check (with
    // the historical 200 DA drift allowance) when the gateway is unreachable.
    let deliveryFee = Number(formData.get('deliveryFee') || 0);
    let verifiedReturnFee = 0;
    try {
      const { quoteRate, getDefaultCourier } = await import('@/service/shipping/dzship');
      const quote = await quoteRate(
        {
          toWilaya: resolveShipCode(wilayaCode),
          toCommune: communeName,
          deliveryType: deliveryMethod === 'desk' ? 'stopdesk' : 'home',
        },
        getDefaultCourier()
      );
      deliveryFee = quote.deliveryFee;
      verifiedReturnFee = quote.returnFee;
    } catch {
      if (wilayaCode >= 1 && wilayaCode <= 58) {
        const expectedFee = await getDeliveryPrice(wilayaCode, deliveryMethod);
        if (Math.abs(expectedFee - deliveryFee) > 200) {
          return { success: false, error: 'Frais de livraison invalides, rechargez la page' };
        }
      } else if (!Number.isFinite(deliveryFee) || deliveryFee < 0) {
        return { success: false, error: 'Frais de livraison invalides' };
      }
    }
    const finalReturnFee = verifiedReturnFee || returnFee;
    const expectedTotal = realSubtotal + deliveryFee;
    if (Math.abs(expectedTotal - total) > 1) {
      return { success: false, error: 'Total invalide, rechargez la page' };
    }

    const orderId = await createOrder({
      name,
      phone: phoneClean,
      wilaya,
      commune: communeName,
      address,
      deliveryMethod,
      items,
      subtotal: realSubtotal,
      deliveryFee,
      quotedDeliveryFee: deliveryFee,
      returnFee: finalReturnFee,
      discount: 0,
      couponCode: undefined,
      total: expectedTotal,
      state: 0,
      wilayaCode,
      wilayaShipCode: resolveShipCode(wilayaCode),
      communeName,
      stopDeskId,
      stopDeskName,
      // What the driver collects.
      codAmount: expectedTotal,
    });

    return { success: true, orderId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return { success: false, error: message };
  }
}
