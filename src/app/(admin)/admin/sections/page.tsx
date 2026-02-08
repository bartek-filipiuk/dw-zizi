"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Edit } from "lucide-react";

interface Section {
  id: string;
  slug: string;
  title: string;
  visible: boolean;
  sortOrder: number;
  images: { id: string }[];
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then(setSections)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-charcoal-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
        Loading sections...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-cream-50">Sections</h1>

      <div className="space-y-2">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/admin/sections/${section.id}`}
            className="flex items-center justify-between rounded-lg border border-charcoal-800 bg-charcoal-900 p-4 transition-colors hover:border-charcoal-700"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-charcoal-800 text-xs text-charcoal-400">
                {section.sortOrder}
              </span>
              <div>
                <p className="font-medium text-cream-50">{section.title}</p>
                <p className="text-xs text-charcoal-400">/{section.slug} · {section.images.length} images</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {section.visible ? (
                <Eye className="h-4 w-4 text-teal-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-charcoal-500" />
              )}
              <Edit className="h-4 w-4 text-charcoal-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
