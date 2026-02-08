"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function NewGalleryItemPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    woodType: "",
    dimensions: "",
    featured: false,
    visible: true,
  });

  const handleSave = async () => {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/gallery/${data.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/gallery")}
          className="rounded-md p-2 text-charcoal-400 hover:bg-charcoal-800 hover:text-cream-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 font-serif text-2xl text-cream-50">New Gallery Item</h1>
        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.slug}
          className="flex items-center gap-2 rounded-md bg-oak-600 px-4 py-2 text-sm text-cream-50 hover:bg-oak-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Creating..." : "Create"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm({ ...form, name, slug: generateSlug(name) });
              }}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
              placeholder="The Whispering Oak"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
              placeholder="the-whispering-oak"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full resize-none rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Wood Type</label>
            <input
              type="text"
              value={form.woodType}
              onChange={(e) => setForm({ ...form, woodType: e.target.value })}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Dimensions</label>
            <input
              type="text"
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-oak-500"
            />
            <label htmlFor="featured" className="text-sm text-charcoal-300">Featured</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="visible"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              className="h-4 w-4 accent-oak-500"
            />
            <label htmlFor="visible" className="text-sm text-charcoal-300">Visible</label>
          </div>
        </div>

        <p className="text-xs text-charcoal-500">
          You can add images after creating the gallery item.
        </p>
      </div>
    </div>
  );
}
