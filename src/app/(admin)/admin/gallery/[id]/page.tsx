"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import Image from "next/image";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-md bg-charcoal-800" /> }
);

interface GalleryImage {
  id: string;
  url: string;
  alt?: string | null;
  type: string;
}

interface GalleryItemData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  woodType?: string | null;
  dimensions?: string | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  images: GalleryImage[];
}

export default function GalleryEditPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<GalleryItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    woodType: "",
    dimensions: "",
    featured: false,
    visible: true,
  });

  useEffect(() => {
    fetch(`/api/gallery/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          woodType: data.woodType || "",
          dimensions: data.dimensions || "",
          featured: data.featured,
          visible: data.visible,
        });
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/gallery/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setItem(data);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "full");

    const res = await fetch(`/api/gallery/${params.id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setItem(data);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const res = await fetch(`/api/gallery/${params.id}?imageId=${imageId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItem((prev) =>
        prev ? { ...prev, images: prev.images.filter((i) => i.id !== imageId) } : null
      );
    }
  };

  const handleDeleteItem = async () => {
    await fetch(`/api/gallery/${params.id}`, { method: "DELETE" });
    router.push("/admin/gallery");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!item) return <p className="text-charcoal-400">Gallery item not found</p>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/gallery")}
          className="rounded-md p-2 text-charcoal-400 hover:bg-charcoal-800 hover:text-cream-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-cream-50">Edit: {item.name}</h1>
        </div>
        <button
          onClick={() => setDeleteOpen(true)}
          className="flex items-center gap-2 rounded-md border border-red-600/30 px-4 py-2 text-sm text-red-400 hover:bg-red-600/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-oak-600 px-4 py-2 text-sm text-cream-50 hover:bg-oak-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Description</label>
          <RichTextEditor
            content={form.description}
            onChange={(html) => setForm({ ...form, description: html })}
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

        {/* Images */}
        <div>
          <label className="mb-4 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Images</label>
          <div className="mb-4 grid grid-cols-3 gap-4">
            {item.images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-md">
                <Image
                  src={img.url}
                  alt={img.alt || ""}
                  width={400}
                  height={300}
                  className="aspect-video w-full object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal-950/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="rounded-full bg-red-600 p-2 text-white hover:bg-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="absolute bottom-1 left-1 rounded bg-charcoal-950/80 px-2 py-0.5 text-[10px] text-charcoal-300">
                  {img.type}
                </span>
              </div>
            ))}
          </div>
          <ImageUploader onUpload={handleImageUpload} />
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Gallery Item"
        message={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
