"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface MenuItemData {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  visible: boolean;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemData | null>(null);
  const [newItem, setNewItem] = useState({ label: "", href: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (item: MenuItemData) => {
    setSaving(item.id);
    try {
      await fetch(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } finally {
      setSaving(null);
    }
  };

  const handleAdd = async () => {
    if (!newItem.label || !newItem.href) return;
    setAdding(true);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          sortOrder: items.length,
          visible: true,
        }),
      });
      if (res.ok) {
        const item = await res.json();
        setItems([...items, item]);
        setNewItem({ label: "", href: "" });
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/menu/${deleteTarget.id}`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const updateItem = (id: string, updates: Partial<MenuItemData>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading menu...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 font-serif text-3xl text-cream-50">Menu</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-charcoal-800 bg-charcoal-900 p-4"
          >
            <GripVertical className="h-4 w-4 cursor-grab text-charcoal-600" />

            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(item.id, { label: e.target.value })}
              className="flex-1 rounded border border-charcoal-700 bg-charcoal-800 px-3 py-2 text-sm text-cream-50 outline-none focus:border-oak-400"
              placeholder="Label"
            />

            <input
              type="text"
              value={item.href}
              onChange={(e) => updateItem(item.id, { href: e.target.value })}
              className="flex-1 rounded border border-charcoal-700 bg-charcoal-800 px-3 py-2 text-sm text-cream-50 outline-none focus:border-oak-400"
              placeholder="#section"
            />

            <input
              type="checkbox"
              checked={item.visible}
              onChange={(e) => updateItem(item.id, { visible: e.target.checked })}
              className="h-4 w-4 accent-oak-500"
              title="Visible"
            />

            <button
              onClick={() => handleSave(item)}
              disabled={saving === item.id}
              className="rounded p-1.5 text-charcoal-400 hover:bg-charcoal-700 hover:text-cream-100"
              title="Save"
            >
              <Save className="h-4 w-4" />
            </button>

            <button
              onClick={() => setDeleteTarget(item)}
              className="rounded p-1.5 text-charcoal-400 hover:bg-red-600/10 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-dashed border-charcoal-700 p-4">
        <Plus className="h-4 w-4 text-charcoal-500" />

        <input
          type="text"
          value={newItem.label}
          onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
          className="flex-1 rounded border border-charcoal-700 bg-charcoal-800 px-3 py-2 text-sm text-cream-50 outline-none focus:border-oak-400"
          placeholder="Label"
        />

        <input
          type="text"
          value={newItem.href}
          onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
          className="flex-1 rounded border border-charcoal-700 bg-charcoal-800 px-3 py-2 text-sm text-cream-50 outline-none focus:border-oak-400"
          placeholder="#section"
        />

        <button
          onClick={handleAdd}
          disabled={adding || !newItem.label || !newItem.href}
          className="rounded-md bg-oak-600 px-4 py-2 text-sm text-cream-50 hover:bg-oak-500 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Menu Item"
        message={`Delete "${deleteTarget?.label}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
