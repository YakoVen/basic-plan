'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { Article, Variant } from '@/interfaces/article';
import { categories } from '@/service/constants';
import { saveArticle, getArticle } from '@/service/firebase/database';
import { uploadImage } from '@/service/firebase/storage';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Props {
  mode?: 'add' | 'edit';
  articleId?: string;
}

export default function ArticleEditor({ mode = 'add', articleId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [category, setCategory] = useState(0);
  const [active, setActive] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [hasVariants, setHasVariants] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && articleId) {
      loadArticle(articleId);
    }
  }, [mode, articleId]);

  async function loadArticle(id: string) {
    try {
      const article = await getArticle(id);
      if (article) {
        setTitle(article.title);
        setDescription(article.description);
        setPrice(article.price);
        setOldPrice(article.oldPrice || article.originalPrice || 0);
        setCategory(article.category);
        setActive(article.active);
        setInStock(article.inStock ?? true);
        setThumbnailPreview(article.thumbnail);
        setExistingScreenshots(article.screenshots || []);
        setVariants(article.variants || []);
        setHasVariants(article.hasVariants || false);
      }
    } catch {
      toast.error('Erreur de chargement');
    }
  }

  function addVariant() {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: '',
      type: 'size',
      inStock: true,
    };
    setVariants([...variants, newVariant]);
  }

  function updateVariant(id: string, field: keyof Variant, value: string | number | boolean) {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  function removeVariant(id: string) {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }

  function handleScreenshotsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setScreenshotFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setScreenshotPreviews((prev) => [...prev, ...previews]);
  }

  function removeScreenshot(index: number, isExisting: boolean) {
    if (isExisting) {
      setExistingScreenshots((prev) => prev.filter((_, i) => i !== index));
    } else {
      setScreenshotFiles((prev) => prev.filter((_, i) => i !== index));
      setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error('Titre requis'); return; }
    if (price <= 0) { toast.error('Prix invalide'); return; }

    setSaving(true);
    try {
      let thumbnailUrl = thumbnailPreview;
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile, `articles/${Date.now()}_thumb`);
      }

      const uploadedScreenshots: string[] = [...existingScreenshots];
      for (const file of screenshotFiles) {
        const url = await uploadImage(file, `articles/${Date.now()}_${file.name}`);
        uploadedScreenshots.push(url);
      }

      const finalInStock = hasVariants
        ? variants.some(v => v.inStock)
        : inStock;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const articleData: Record<string, any> = {
        title,
        description,
        price,
        oldPrice: oldPrice || null,
        originalPrice: oldPrice || null,
        category,
        active,
        thumbnail: thumbnailUrl,
        screenshots: uploadedScreenshots,
        variants: hasVariants ? variants : [],
        hasVariants,
        inStock: finalInStock,
      };

      await saveArticle(articleData as Partial<Article>, articleId);
      toast.success(mode === 'add' ? 'Article cree' : 'Article mis a jour');
      router.push('/dashboard/articles');
    } catch (err) {
      console.error(err);
      toast.error('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'add' ? 'Nouvel article' : 'Modifier l\'article'}
      </h1>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Informations</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={4} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DA)</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2" min={0} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancien prix (DA)</label>
                <input type="number" value={oldPrice} onChange={(e) => setOldPrice(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2" min={0} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                <select value={category} onChange={(e) => setCategory(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2">
                  {categories.map((cat, i) => (
                    <option key={i} value={i}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {!hasVariants && (
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="inStockGlobal" checked={inStock} onChange={(e) => setInStock(e.target.checked)} 
                  className="rounded border-gray-300 text-indigo-600" />
                <label htmlFor="inStockGlobal" className="text-sm font-medium text-gray-700">En stock (disponible &agrave; l&apos;achat)</label>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Images</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image principale</label>
              <div className="flex items-center gap-4">
                {thumbnailPreview && (
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-20 h-20 object-cover rounded-lg" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-400">
                  <Upload className="w-4 h-4" /> Choisir une image
                  <input type="hidden" />
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Captures additionnelles</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {existingScreenshots.map((url, i) => (
                  <div key={`ex-${i}`} className="relative w-20 h-20">
                    <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeScreenshot(i, true)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {screenshotPreviews.map((url, i) => (
                  <div key={`new-${i}`} className="relative w-20 h-20">
                    <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeScreenshot(i, false)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-400 w-fit">
                <Plus className="w-4 h-4" /> Ajouter des images
                <input type="file" accept="image/*" multiple onChange={handleScreenshotsChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Variantes</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600" />
              <span className="text-sm">Activer les variantes</span>
            </label>
          </div>
          {hasVariants && (
            <div className="space-y-3">
              {variants.map((variant) => (
                <div key={variant.id} className="flex flex-wrap gap-3 items-center p-3 bg-gray-50 rounded-lg">
                  <input type="text" value={variant.name} onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                    placeholder="Nom (ex: Rouge / M)" className="flex-1 min-w-[150px] border rounded px-2 py-1.5 text-sm" />
                  <select value={variant.type} onChange={(e) => updateVariant(variant.id, 'type', e.target.value)}
                    className="border rounded px-2 py-1.5 text-sm">
                    <option value="size">Taille</option>
                    <option value="color">Couleur</option>
                    <option value="material">Materiau</option>
                  </select>
                  
                  <label className="flex items-center gap-2 ml-2">
                    <input type="checkbox" checked={variant.inStock} onChange={(e) => updateVariant(variant.id, 'inStock', e.target.checked)} 
                      className="rounded border-gray-300 text-indigo-600" />
                    <span className="text-sm text-gray-700">En stock</span>
                  </label>

                  {variant.type === 'color' && (
                    <input type="color" value={variant.color || '#000000'} onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer ml-2" />
                  )}
                  <button type="button" onClick={() => removeVariant(variant.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-auto">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addVariant}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                <Plus className="w-4 h-4" /> Ajouter une variante
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.push('/dashboard/articles')}
            className="px-6 py-2.5 border rounded-lg hover:bg-gray-50">Annuler</button>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Sauvegarde...' : mode === 'add' ? 'Creer l\'article' : 'Mettre a jour'}
          </button>
        </div>
      </div>
    </form>
  );
}
