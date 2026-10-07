'use client';
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('Your Store');
  const [storeDescription, setStoreDescription] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      // TODO: Save to Firestore settings collection
      await new Promise((r) => setTimeout(r, 500));
      toast.success('Parametres sauvegardes');
    } catch {
      toast.error('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parametres de la boutique</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Identity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Identite de la boutique</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)}
                rows={4} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Contact</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telephone 1</label>
              <input type="tel" value={phone1} onChange={(e) => setPhone1(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" placeholder="0555 00 00 00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telephone 2</label>
              <input type="tel" value={phone2} onChange={(e) => setPhone2(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" placeholder="0555 00 00 00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" placeholder="contact@store.com" />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Reseaux sociaux</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
              <input type="url" value={tiktok} onChange={(e) => setTiktok(e.target.value)}
                className="w-full border rounded-lg px-3 py-2" placeholder="https://tiktok.com/..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
