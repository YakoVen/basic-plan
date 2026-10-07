'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Article } from '@/interfaces/article';
import { getArticles, deleteArticle, toggleArticleActive, toggleArticleStock, getEffectiveInStock } from '@/service/firebase/database';
import { categories } from '@/service/constants';
import { formatPrice } from '@/service/Utils';
import toast from 'react-hot-toast';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [stockTogglingId, setStockTogglingId] = useState<string | null>(null);

  useEffect(() => { loadArticles(); }, []);

  async function loadArticles() {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success('Article supprime');
      setDeleteId(null);
    } catch {
      toast.error('Erreur de suppression');
    }
  }

  async function handleToggle(id: string, currentActive: boolean) {
    setTogglingId(id);
    try {
      await toggleArticleActive(id);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
      );
      toast.success(currentActive ? 'Article masque' : 'Article visible');
    } catch {
      toast.error('Erreur');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleStockToggle(id: string, currentInStock: boolean) {
    setStockTogglingId(id);
    try {
      await toggleArticleStock(id);
      setArticles((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          const next = !currentInStock;
          return {
            ...a,
            inStock: next,
            variants: a.hasVariants && a.variants ? a.variants.map((v) => ({ ...v, inStock: next })) : a.variants,
          };
        })
      );
      toast.success(currentInStock ? 'Marque comme epuise' : 'Marque en stock');
    } catch {
      toast.error('Erreur');
    } finally {
      setStockTogglingId(null);
    }
  }

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link
          href="/dashboard/articles/add"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" /> Ajouter un article
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun article trouve</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm text-gray-500">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Titre</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Categorie</th>
                  <th className="px-4 py-3">Visible</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        {article.thumbnail && (
                          <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 font-medium max-w-[200px]">
                      <span className="line-clamp-2">{article.title}</span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">{formatPrice(article.price)}</td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStockToggle(article.id, getEffectiveInStock(article))}
                        disabled={stockTogglingId === article.id}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          !getEffectiveInStock(article)
                            ? 'text-red-700 bg-red-100 hover:bg-red-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        } disabled:opacity-50 flex items-center justify-center min-w-[80px]`}
                        title="Cliquer pour modifier la disponibilite"
                      >
                        {stockTogglingId === article.id ? (
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : !getEffectiveInStock(article) ? (
                          'Epuise'
                        ) : (
                          'En stock'
                        )}
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {categories[article.category]?.name || '-'}
                    </td>

                    {/* Visibility toggle switch */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(article.id, !!article.active)}
                          disabled={togglingId === article.id}
                          title={article.active ? 'Cliquer pour masquer' : 'Cliquer pour afficher'}
                          className="relative inline-flex items-center cursor-pointer disabled:cursor-not-allowed focus:outline-none"
                        >
                          {/* Track */}
                          <span className={`block w-11 h-6 rounded-full transition-colors duration-200 ${article.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {/* Thumb */}
                          <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center ${article.active ? 'translate-x-5' : 'translate-x-0'}`}>
                            {togglingId === article.id && (
                              <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            )}
                          </span>
                        </button>
                        <span className={`text-xs font-medium ${article.active ? 'text-green-600' : 'text-gray-400'}`}>
                          {article.active ? 'Oui' : 'Non'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/articles/${article.id}`} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteId(article.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 mb-4">Voulez-vous vraiment supprimer cet article ?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
