"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ImageUploader from "@/components/admin/ImageUploader";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import Image from "next/image";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-md bg-charcoal-800" /> }
);

interface SectionImage {
  id: string;
  url: string;
  alt?: string | null;
  role: string;
}

interface Section {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  visible: boolean;
  sortOrder: number;
  images: SectionImage[];
}

export default function SectionEditPage() {
  const params = useParams();
  const router = useRouter();
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    ctaText: "",
    ctaLink: "",
    visible: true,
  });

  useEffect(() => {
    fetch(`/api/sections/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSection(data);
        setForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          body: data.body || "",
          ctaText: data.ctaText || "",
          ctaLink: data.ctaLink || "",
          visible: data.visible,
        });
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/sections/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setSection(data);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("role", section?.slug === "hero" ? "background" : "feature");

    const res = await fetch(`/api/sections/${params.id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setSection(data);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const res = await fetch(`/api/sections/${params.id}?imageId=${imageId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSection((prev) =>
        prev ? { ...prev, images: prev.images.filter((i) => i.id !== imageId) } : null
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!section) return <p className="text-charcoal-400">Section not found</p>;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/sections")}
          className="rounded-md p-2 text-charcoal-400 hover:bg-charcoal-800 hover:text-cream-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-cream-50">Edit: {section.slug}</h1>
        </div>
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
        {/* Title */}
        <div>
          <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Subtitle</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
          />
        </div>

        {/* Body */}
        <div>
          <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Body Content</label>
          <RichTextEditor
            content={form.body}
            onChange={(html) => setForm({ ...form, body: html })}
          />
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">CTA Text</label>
            <input
              type="text"
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">CTA Link</label>
            <input
              type="text"
              value={form.ctaLink}
              onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
              className="w-full rounded-md border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream-50 outline-none focus:border-oak-400"
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="visible"
            checked={form.visible}
            onChange={(e) => setForm({ ...form, visible: e.target.checked })}
            className="h-4 w-4 rounded border-charcoal-700 accent-oak-500"
          />
          <label htmlFor="visible" className="text-sm text-charcoal-300">
            Visible on public page
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="mb-4 block text-xs tracking-[0.15em] text-charcoal-300 uppercase">Images</label>

          <div className="mb-4 grid grid-cols-3 gap-4">
            {section.images.map((img) => (
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
                  {img.role}
                </span>
              </div>
            ))}
          </div>

          <ImageUploader onUpload={handleImageUpload} />
        </div>
      </div>
    </div>
  );
}
