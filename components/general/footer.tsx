import React from 'react';
import Link from 'next/link';
import { ExternalLink, Phone, Mail } from 'lucide-react';
import { store_name, contact_info } from '@/service/constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-xl font-bold text-indigo-600 mb-4">{store_name}</h3>
            <p className="text-gray-500 text-sm mb-4">
              Votre boutique de confiance pour tous vos achats en ligne en Algérie. 
              Paiement à la livraison et service de qualité.
            </p>
            <div className="flex space-x-4">
              {contact_info.socials.map((social) => (
                <a key={social.platform} href={social.link || '#'} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-600">
                  <ExternalLink size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-indigo-600">Accueil</Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-500 hover:text-indigo-600">Boutique</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-indigo-600">Contactez-nous</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>+213 XX XX XX XX</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>contact@maboutique.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {store_name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
