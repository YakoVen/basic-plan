"use client";

import { useState, useEffect } from 'react';
import LayoutWrapper from '@/components/general/layout-wrapper';
import Breadcrumbs from '@/components/general/breadcrumbs';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/service/Utils';
import { wilayas } from '@/service/constants';
import { getDeliveryZones } from '@/service/firebase/database';
import { DeliveryZone } from '@/interfaces/delivery-zone';
import { createOrderAction } from '@/app/actions/orders';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'desk'>('home');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [zones, setZones] = useState<DeliveryZone[]>([]);

  useEffect(() => {
    getDeliveryZones().then(setZones).catch(() => {});
  }, []);

  const wilayaIndex = wilayas.indexOf(selectedWilaya) + 1;
  const zone = zones.find((z) => z.wilayaId === wilayaIndex);
  const deliveryFee = selectedWilaya ? (zone ? (deliveryMethod === 'home' ? zone.homePrice : zone.deskPrice) : (deliveryMethod === 'home' ? 600 : 400)) : 0;
  const homePrice = zone?.homePrice ?? 600;
  const deskPrice = zone?.deskPrice ?? 400;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    formData.append('items', JSON.stringify(items));
    formData.append('deliveryMethod', deliveryMethod);
    formData.append('subtotal', subtotal.toString());
    formData.append('deliveryFee', deliveryFee.toString());
    formData.append('discount', '0');
    formData.append('total', total.toString());

    const result = await createOrderAction(formData);

    if (result.success) {
      toast.success('Commande confirmee !');
      clearCart();
      router.push('/');
    } else {
      toast.error(result.error || 'Erreur lors de la commande');
    }
    setLoading(false);
  };

  return (
    <LayoutWrapper>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Breadcrumbs items={[{ label: 'Panier', href: '/cart' }, { label: 'Caisse' }]} />
        <h1 className="text-3xl font-bold mb-8 mt-4">Finaliser la commande</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
              <h2 className="text-xl font-bold border-b pb-2">Informations de livraison</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input name="fullName" required type="text" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                <input name="phone" required type="tel" placeholder="05XX XX XX XX" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                <select
                  name="wilaya"
                  required
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="">Selectionner une wilaya</option>
                  {wilayas.map((w, i) => (
                    <option key={i} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                <input name="commune" required type="text" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>

              {deliveryMethod === 'home' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complete</label>
                  <input name="address" required type="text" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-600" />
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
              <h2 className="text-xl font-bold border-b pb-2">Methode de livraison</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${deliveryMethod === 'home' ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                  <input type="radio" name="deliveryRadio" value="home" checked={deliveryMethod === 'home'} onChange={() => setDeliveryMethod('home')} className="mr-3" />
                  <div className="flex-1">
                    <div className="font-medium">Livraison a domicile</div>
                    <div className="text-sm text-gray-500">Livraison directement chez vous</div>
                  </div>
                  {selectedWilaya && <span className="font-medium text-indigo-600">{formatPrice(homePrice)}</span>}
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${deliveryMethod === 'desk' ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                  <input type="radio" name="deliveryRadio" value="desk" checked={deliveryMethod === 'desk'} onChange={() => setDeliveryMethod('desk')} className="mr-3" />
                  <div className="flex-1">
                    <div className="font-medium">Point relais / Bureau</div>
                    <div className="text-sm text-gray-500">Recuperez votre colis en bureau</div>
                  </div>
                  {selectedWilaya && <span className="font-medium text-indigo-600">{formatPrice(deskPrice)}</span>}
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl h-fit border sticky top-24">
            <h2 className="text-xl font-bold mb-6">Recapitulatif</h2>

            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div key={`${item.articleId}-${item.variantId || index}`} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm line-clamp-1">{item.title}</div>
                    {item.variantName && <div className="text-xs text-gray-500">{item.variantName}</div>}
                  </div>
                  <div className="font-semibold text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium">{selectedWilaya ? formatPrice(deliveryFee) : '--'}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedWilaya}
              className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Traitement...' : 'Confirmer la commande (COD)'}
            </button>
          </div>
        </form>
      </div>
    </LayoutWrapper>
  );
}
