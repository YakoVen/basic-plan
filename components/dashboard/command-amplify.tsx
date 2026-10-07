'use client';
import React from 'react';
import { X, Printer, MapPin, Phone, Package, CreditCard } from 'lucide-react';
import { Order } from '@/interfaces/order';
import { formatPrice } from '@/service/Utils';
import { order_states } from '@/service/constants';

interface Props {
  order: Order;
  onClose: () => void;
}

export default function CommandAmplify({ order, onClose }: Props) {
  const stateInfo = order_states[order.state] || order_states[0];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">Commande #{order.id.substring(0, 8)}</h2>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Imprimer">
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-${stateInfo.color}-100 text-${stateInfo.color}-700`}>
            {stateInfo.label}
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Client
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Nom: </span>
                <span className="font-medium">{order.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Telephone: </span>
                <a href={`tel:${order.phone}`} className="font-medium text-indigo-600">{order.phone}</a>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Livraison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Wilaya: </span>
                <span className="font-medium">{order.wilaya}</span>
              </div>
              <div>
                <span className="text-gray-500">Commune: </span>
                <span className="font-medium">{order.commune}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Adresse: </span>
                <span className="font-medium">{order.address}</span>
              </div>
              <div>
                <span className="text-gray-500">Methode: </span>
                <span className="font-medium">{order.deliveryMethod === 'home' ? 'A domicile' : 'Bureau / Point relais'}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" /> Articles ({order.items?.length ?? 0})
            </h3>
            <div className="space-y-3">
              {(order.items ?? []).map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    {item.variantName && (
                      <p className="text-sm text-gray-500">{item.variantName}</p>
                    )}
                    <p className="text-sm text-gray-500">Qte: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Recapitulatif
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sous-total</span>
                <span>{formatPrice(order.subtotal ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Livraison</span>
                <span>{formatPrice(order.deliveryFee ?? 0)}</span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Reduction {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-{formatPrice(order.discount ?? 0)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
