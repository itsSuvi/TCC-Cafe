'use client';

import React, { useState, useEffect } from 'react';
import { DeliverySettings } from '@/lib/types';
import { Settings, Save, CheckCircle2, Store, Phone, Truck, ShieldCheck } from 'lucide-react';

export default function SettingsClient() {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/delivery/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/delivery/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      alert('Error updating settings');
    }
  };

  if (loading || !settings) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#EADDCF] animate-pulse h-64" />
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
          Outlet Configuration
        </span>
        <h1 className="font-serif text-3xl font-black text-[#23140C]">
          Store & Delivery Settings
        </h1>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Outlet delivery settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Status Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#23140C] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#8B5E34]" />
            <span>Storefront Status & Operation</span>
          </h2>

          <div className="flex items-center justify-between p-4 bg-[#FAF6F0] rounded-2xl border border-[#EADDCF]">
            <div>
              <span className="font-bold text-sm text-[#23140C] block">
                Accepting Online Orders
              </span>
              <span className="text-xs text-stone-500">
                Turn off when kitchen is closed or during campus breaks.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                settings.isOpen
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-red-600 text-white'
              }`}
            >
              {settings.isOpen ? 'ONLINE (Open) ✓' : 'OFFLINE (Closed)'}
            </button>
          </div>
        </div>

        {/* Delivery Rules */}
        <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#23140C] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#8B5E34]" />
            <span>Delivery & Pricing Thresholds</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Max Delivery Radius (Km)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={settings.maxDeliveryRadiusKm}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxDeliveryRadiusKm: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Free Delivery Minimum Order (₹)
              </label>
              <input
                type="number"
                min={0}
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeDeliveryThreshold: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Estimated Delivery Window (Mins)
              </label>
              <input
                type="number"
                min={5}
                value={settings.estimatedTimeMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    estimatedTimeMinutes: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Packaging Fee (₹)
              </label>
              <input
                type="number"
                min={0}
                value={10}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] bg-stone-100 text-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="bg-white p-6 rounded-3xl border border-[#EADDCF] shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#23140C] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#8B5E34]" />
            <span>Staff & Outlet Contacts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Santosh Singh Tomar Contact
              </label>
              <input
                type="text"
                defaultValue="8090205081"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Sandeep Singh Contact
              </label>
              <input
                type="text"
                defaultValue="8318008104"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98"
        >
          <Save className="w-4 h-4 text-[#E7C86A]" />
          <span>Save All Settings</span>
        </button>
      </form>
    </div>
  );
}
