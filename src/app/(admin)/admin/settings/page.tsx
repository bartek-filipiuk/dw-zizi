"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
  label?: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings.map((s) => ({ key: s.key, value: s.value, label: s.label }))),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-cream-50">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-oak-600 px-4 py-2 text-sm text-cream-50 hover:bg-oak-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.key}>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">
              {setting.label || setting.key}
            </label>
            {setting.key === "metaDescription" ? (
              <textarea
                value={setting.value}
                onChange={(e) => updateSetting(setting.key, e.target.value)}
                rows={3}
                className="w-full resize-none rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
              />
            ) : (
              <input
                type="text"
                value={setting.value}
                onChange={(e) => updateSetting(setting.key, e.target.value)}
                className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
