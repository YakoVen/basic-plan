import React from 'react';
import { Truck, ShieldCheck, HeadphonesIcon, CreditCard } from 'lucide-react';

const features = [
  {
    icon: <Truck className="w-8 h-8 text-indigo-600" />,
    title: 'Livraison 58 Wilayas',
    description: 'Service de livraison rapide et fiable partout en Algérie.'
  },
  {
    icon: <CreditCard className="w-8 h-8 text-indigo-600" />,
    title: 'Paiement à la livraison',
    description: 'Payez en toute sécurité à la réception de votre commande.'
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
    title: 'Garantie Qualité',
    description: 'Des produits authentiques et de haute qualité.'
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8 text-indigo-600" />,
    title: 'Support 7/7',
    description: 'Une équipe à votre écoute pour vous accompagner.'
  }
];

export default function StoreSection() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
