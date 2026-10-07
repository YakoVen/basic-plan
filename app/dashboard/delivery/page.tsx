'use client';
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { DeliveryZone } from '@/interfaces/delivery-zone';
import { getDeliveryZones, updateDeliveryZone } from '@/service/firebase/database';
import { wilayas } from '@/service/constants';
import toast from 'react-hot-toast';

export default function DeliveryPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bulkDesk, setBulkDesk] = useState('');
  const [bulkHome, setBulkHome] = useState('');

  useEffect(() => {
    loadZones();
  }, []);

  async function loadZones() {
    try {
      const data = await getDeliveryZones();
      if (data.length > 0) {
        setZones(data);
      } else {
        const defaultZones: DeliveryZone[] = wilayas.map((w, i) => ({
          wilayaId: i + 1,
          wilayaName: w,
          deskPrice: 400,
          homePrice: 600,
          active: true,
        }));
        setZones(defaultZones);
      }
    } catch {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  function updateZoneField(wilayaId: number, field: keyof DeliveryZone, value: number | boolean) {
    setZones((prev) =>
      prev.map((z) => z.wilayaId === wilayaId ? { ...z, [field]: value } : z)
    );
  }

  function applyBulkPrices() {
    if (!bulkDesk && !bulkHome) return;
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        deskPrice: bulkDesk ? Number(bulkDesk) : z.deskPrice,
        homePrice: bulkHome ? Number(bulkHome) : z.homePrice,
      }))
    );
    toast.success('Prix appliques a toutes les wilayas');
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      for (const zone of zones) {
        await updateDeliveryZone(zone.wilayaId, {
          deskPrice: zone.deskPrice,
          homePrice: zone.homePrice,
          active: zone.active,
        });
      }
      toast.success('Zones de livraison sauvegardees');
    } catch {
      toast.error('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="space-y-4">{[...Array(10)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Zones de livraison</h1>
        <button onClick={handleSaveAll} disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder tout
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Prix en masse</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bureau (DA)</label>
            <input type="number" value={bulkDesk} onChange={(e) => setBulkDesk(e.target.value)}
              className="w-28 border rounded-lg px-3 py-2 text-sm" placeholder="400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Domicile (DA)</label>
            <input type="number" value={bulkHome} onChange={(e) => setBulkHome(e.target.value)}
              className="w-28 border rounded-lg px-3 py-2 text-sm" placeholder="600" />
          </div>
          <button onClick={applyBulkPrices} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
            Appliquer a tout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-500">
              <tr>
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3">Wilaya</th>
                <th className="px-4 py-3">Bureau (DA)</th>
                <th className="px-4 py-3">Domicile (DA)</th>
                <th className="px-4 py-3">Actif</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {zones.map((zone) => (
                <tr key={zone.wilayaId} className={`hover:bg-gray-50 ${!zone.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-2 text-sm text-gray-400">{zone.wilayaId}</td>
                  <td className="px-4 py-2 font-medium text-sm">{zone.wilayaName}</td>
                  <td className="px-4 py-2">
                    <input type="number" value={zone.deskPrice}
                      onChange={(e) => updateZoneField(zone.wilayaId, 'deskPrice', Number(e.target.value))}
                      className="w-24 border rounded px-2 py-1 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={zone.homePrice}
                      onChange={(e) => updateZoneField(zone.wilayaId, 'homePrice', Number(e.target.value))}
                      className="w-24 border rounded px-2 py-1 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="checkbox" checked={zone.active}
                      onChange={(e) => updateZoneField(zone.wilayaId, 'active', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
