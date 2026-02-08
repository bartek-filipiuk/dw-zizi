"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Star, Eye, EyeOff } from "lucide-react";

interface GalleryItemData {
  id: string;
  name: string;
  slug: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  images: { id: string; url: string; type: string }[];
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading gallery...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-cream-50">Gallery</h1>
        <Link
          href="/admin/gallery/new"
          className="flex items-center gap-2 rounded-md bg-oak-600 px-4 py-2 text-sm text-cream-50 hover:bg-oak-500"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/admin/gallery/${item.id}`}
            className="group overflow-hidden rounded-lg border border-charcoal-800 bg-charcoal-900 transition-colors hover:border-charcoal-700"
          >
            <div className="relative aspect-video">
              {item.images[0] ? (
                <Image
                  src={item.images[0].url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-charcoal-800 text-charcoal-600">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <p className="flex-1 font-medium text-cream-50">{item.name}</p>
                {item.featured && <Star className="h-4 w-4 fill-oak-400 text-oak-400" />}
                {item.visible ? (
                  <Eye className="h-4 w-4 text-teal-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-charcoal-500" />
                )}
                <Edit className="h-4 w-4 text-charcoal-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="text-xs text-charcoal-400">
                {item.images.length} images · /{item.slug}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
