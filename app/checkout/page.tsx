"use client";

import { useState, useEffect, useCallback } from 'react';
import LayoutWrapper from '@/components/general/layout-wrapper';
import Breadcrumbs from '@/components/general/breadcrumbs';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/service/Utils';
import { getDeliveryZones } from '@/service/firebase/database';
import { DeliveryZone } from '@/interfaces/delivery-zone';
import { createOrderAction } from '@/app/actions/orders';
import AddressPicker from '@/components/shipping/address-picker';
import StopDeskPicker from '@/components/shipping/stop-desk-picker';
import type { WilayaInfo } from '@/interfaces/shipment';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Quote {
  deliveryFee: number;
  returnFee: number;
  currency: string;
  courier: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'desk'>('home');

  // Address: numeric wilaya code + exact commune spelling.
  const [wilayaCode, setWilayaCode] = useState<number | null>(null);
  const [wilayaInfo, setWilayaInfo] = useState<WilayaInfo | null>(null);
  const [communeName, setCommuneName] = useState('');
  const [zones, setZones] = useState<DeliveryZone[]>([]);

  // Stop desk
  const [stopDeskId, setStopDeskId] = useState('');
  const [stopDeskName, setStopDeskName] = useState('');

  // Live quote from the courier gateway, with static zones as fallback.
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [useFallbackZones, setUseFallbackZones] = useState(false);

  useEffect(() => {
    getDeliveryZones().then(setZones).catch(() => {});
  }, []);

  const fetchQuote = useCallback(async () => {
    if (!wilayaCode) {
      setQuote(null);
      return;
    }
    setQuoteError('');
    try {
      const res = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wilayaCode, deliveryMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cotation indisponible.');
      setQuote({
        deliveryFee: data.deliveryFee,
        returnFee: data.returnFee,
        currency: data.currency || 'DZD',
        courier: data.courier,
      });
      setUseFallbackZones(false);
    } catch (err) {
      setQuote(null);
      setQuoteError(err instanceof Error ? err.message : 'Cotation indisponible.');
      setUseFallbackZones(true);
    }
  }, [wilayaCode, deliveryMethod]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  // Static zone price, used only when the live quote fails.
  const zone = zones.find((z) => z.wilayaId === (wilayaInfo?.shipAs ?? wilayaCode));
  const zonePrice = deliveryMethod === 'home' ? zone?.homePrice ?? 600 : zone?.deskPrice ?? 400;

  const deliveryFee = quote?.deliveryFee ?? (useFallbackZones && wilayaCode ? zonePrice : 0);
  const returnFee = quote?.returnFee ?? 0;
  const homePrice = quote?.deliveryFee ?? zone?.homePrice ?? 600;
  const deskPrice = quote?.deliveryFee ?? zone?.deskPrice ?? 400;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wilayaCode || !communeName) {
      toast.error('Selectionnez une wilaya et une commune');
      return;
    }
    if (deliveryMethod === 'desk' && !stopDeskId) {
      toast.error('Choisissez un point de relais');
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    formData.append('items', JSON.stringify(items));
    formData.append('deliveryMethod', deliveryMethod);
    formData.append('wilayaCode', String(wilayaCode));
    formData.append('communeName', communeName);
    formData.append('stopDeskId', stopDeskId);
    formData.append('stopDeskName', stopDeskName);
    formData.append('returnFee', String(returnFee));
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
                <input
                  name="phone"
                  required
                  type="tel"
                  inputMode="numeric"
                  placeholder="0551234567"
                  pattern="0[5-7][0-9]{8}"
                  title="Numéro algérien : 05, 06 ou 07 suivi de 8 chiffres"
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <p className="text-xs text-gray-500 mt-1">Format 05/06/07 + 8 chiffres.</p>
              </div>

              <AddressPicker
                wilayaCode={wilayaCode}
                communeName={communeName}
                wilayaName={wilayaInfo?.nameFr}
                onWilayaChange={(code, info) => {
                  setWilayaCode(code);
                  setWilayaInfo(info);
                }}
                onCommuneChange={setCommuneName}
              />
              {/* Hidden mirrors so the server action reads the same values. */}
              <input type="hidden" name="wilaya" value={wilayaInfo?.nameFr || ''} />
              <input type="hidden" name="commune" value={communeName} />

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
                  {wilayaCode && <span className="font-medium text-indigo-600">{formatPrice(homePrice)}</span>}
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer ${deliveryMethod === 'desk' ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                  <input type="radio" name="deliveryRadio" value="desk" checked={deliveryMethod === 'desk'} onChange={() => setDeliveryMethod('desk')} className="mr-3" />
                  <div className="flex-1">
                    <div className="font-medium">Point relais / Bureau</div>
                    <div className="text-sm text-gray-500">Recuperez votre colis en bureau</div>
                  </div>
                  {wilayaCode && <span className="font-medium text-indigo-600">{formatPrice(deskPrice)}</span>}
                </label>
              </div>

              {/* Desk selection only makes sense once a wilaya is chosen. */}
              {deliveryMethod === 'desk' && wilayaCode && (
                <StopDeskPicker
                  wilayaCode={wilayaCode}
                  courier={quote?.courier || 'sandbox'}
                  communeName={communeName}
                  value={stopDeskId}
                  onChange={(id, name) => {
                    setStopDeskId(id);
                    setStopDeskName(name);
                  }}
                />
              )}

              {quoteError && useFallbackZones && (
                <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                  {quoteError} Tarif de repli appliqué : <strong>{formatPrice(zonePrice)}</strong>
                </p>
              )}

              {quote && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-1">
                  <p className="text-xs text-blue-900 font-medium">
                    Livraison {formatPrice(quote.deliveryFee)} (transporteur : {quote.courier})
                  </p>
                  {quote.returnFee > 0 && (
                    <p className="text-xs text-blue-700">
                      Frais de retour : {formatPrice(quote.returnFee)} — facturés uniquement en cas de refus.
                    </p>
                  )}
                </div>
              )}
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
                <span className="font-medium">{wilayaCode ? formatPrice(deliveryFee) : '--'}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading || !wilayaCode || !communeName || (deliveryMethod === 'desk' && !stopDeskId)}
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
