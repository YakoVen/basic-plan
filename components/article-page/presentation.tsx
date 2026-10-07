"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article, Variant } from '@/interfaces/article';
import { formatPrice, calculateDiscount } from '@/service/Utils';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, ShoppingCart, Share2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  article: Article;
}

export default function Presentation({ article }: Props) {
  const { addItem, buyNow } = useCart();
  const router = useRouter();
  const variants = article.variants ?? [];
  const hasRealVariants = !!article.hasVariants && variants.length > 0;
  const firstInStock = variants.find((v) => (v.inStock ?? true)) ?? variants[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(firstInStock);
  const [quantity, setQuantity] = useState(1);

  const allImages = [article.thumbnail, ...(article.screenshots || [])].filter(Boolean);
  const [mainImg, setMainImg] = useState(allImages[0] || '');

  const price = article.price;
  const oldPrice = article.oldPrice || article.originalPrice;
  const discount = oldPrice ? calculateDiscount(oldPrice, price) : 0;
  const globalInStock = article.inStock ?? true;
  const selectedInStock = selectedVariant ? (selectedVariant.inStock ?? true) : true;
  const isOOS = hasRealVariants ? !selectedInStock : !globalInStock;

  const handleAdd = () => {
    if (isOOS) return;
    addItem({
      articleId: article.id,
      title: article.title,
      price: price,
      thumbnail: article.thumbnail,
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
    });
    toast.success('Ajoute au panier !');
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (isOOS) return;
    buyNow({
      articleId: article.id,
      title: article.title,
      price: price,
      thumbnail: article.thumbnail,
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
    });
    router.push('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copie !');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12 px-4">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-2xl overflow-hidden border bg-gray-50">
            {mainImg && <img src={mainImg} alt={article.title} className="w-full h-full object-cover" />}
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">-{discount}%</span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${mainImg === img ? 'border-indigo-600' : 'border-transparent'}`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className={`font-medium ${isOOS ? 'text-red-600' : 'text-green-600'}`}>
              {isOOS ? 'Rupture de stock' : 'En stock'}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl font-bold text-indigo-600">{formatPrice(price)}</span>
            {oldPrice && oldPrice > price && (
              <span className="text-xl text-gray-400 line-through">{formatPrice(oldPrice)}</span>
            )}
          </div>

          {hasRealVariants && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Variantes</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 border rounded-xl text-sm transition ${selectedVariant?.id === v.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'} ${(v.inStock ?? true) ? '' : 'opacity-50 line-through'}`}
                  >
                    {v.type === 'color' && v.color && (
                      <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: v.color }} />
                    )}
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border rounded-xl h-12">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-gray-500 hover:text-black"><Minus size={16} /></button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-gray-500 hover:text-black"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAdd}
              disabled={isOOS}
              className="flex-1 h-12 border-2 border-indigo-600 text-indigo-600 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-indigo-50 disabled:opacity-50 transition-all"
            >
              <ShoppingCart size={20} />
              {isOOS ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={isOOS}
            className="w-full h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all mb-8"
          >
            <Zap size={20} />
            Commander maintenant
          </button>

          <div className="flex gap-4 mb-8">
            <button onClick={handleShare} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <Share2 size={20} /> Partager
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + price + ' DA')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors font-medium"
            >
              Commander via WhatsApp
            </a>
          </div>

          <div className="prose prose-sm text-gray-600">
            <h3 className="text-lg font-medium text-black">Description</h3>
            <p className="whitespace-pre-line">{article.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
