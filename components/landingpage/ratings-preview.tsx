import React from 'react';
import { Star } from 'lucide-react';

const mockReviews = [
  { id: 1, name: 'Amine B.', text: 'Superbe expérience, livraison très rapide à Alger.', rating: 5 },
  { id: 2, name: 'Sarah K.', text: 'La qualité des produits est incroyable, je recommande fortement.', rating: 5 },
  { id: 3, name: 'Karim M.', text: 'Service client réactif et paiement à la livraison très pratique.', rating: 4 },
];

export default function RatingsPreview() {
  return (
    <section className="py-16 bg-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits qui nous font confiance pour leurs achats quotidiens.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold mr-3">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{review.name}</h4>
                  <span className="text-xs text-gray-500">Client vérifié</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
