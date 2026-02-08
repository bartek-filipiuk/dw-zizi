"use client";

import { useEffect, useState } from "react";
import { Layers, Image, Mail, Menu } from "lucide-react";

interface Stats {
  sections: number;
  galleryItems: number;
  submissions: number;
  unreadSubmissions: number;
  menuItems: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [sectionsRes, galleryRes, submissionsRes, menuRes] = await Promise.all([
        fetch("/api/sections"),
        fetch("/api/gallery"),
        fetch("/api/submissions"),
        fetch("/api/menu"),
      ]);

      const [sections, gallery, submissions, menu] = await Promise.all([
        sectionsRes.json(),
        galleryRes.json(),
        submissionsRes.json(),
        menuRes.json(),
      ]);

      setStats({
        sections: Array.isArray(sections) ? sections.length : 0,
        galleryItems: Array.isArray(gallery) ? gallery.length : 0,
        submissions: Array.isArray(submissions) ? submissions.length : 0,
        unreadSubmissions: Array.isArray(submissions)
          ? submissions.filter((s: { read: boolean }) => !s.read).length
          : 0,
        menuItems: Array.isArray(menu) ? menu.length : 0,
      });
    } catch {
      // ignore
    }
  };

  const statCards = stats
    ? [
        { label: "Sections", value: stats.sections, icon: Layers, color: "text-teal-400" },
        { label: "Gallery Items", value: stats.galleryItems, icon: Image, color: "text-oak-400" },
        {
          label: "Submissions",
          value: stats.submissions,
          subValue: stats.unreadSubmissions > 0 ? `${stats.unreadSubmissions} unread` : undefined,
          icon: Mail,
          color: "text-cream-300",
        },
        { label: "Menu Items", value: stats.menuItems, icon: Menu, color: "text-charcoal-300" },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl text-cream-50">Dashboard</h1>

      {!stats ? (
        <div className="flex items-center gap-2 text-charcoal-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-oak-400 border-t-transparent" />
          Loading...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-lg border border-charcoal-800 bg-charcoal-900 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-charcoal-400">{card.label}</span>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <p className="text-3xl font-semibold text-cream-50">
                  {card.value}
                </p>
                {card.subValue && (
                  <p className="mt-1 text-xs text-oak-400">{card.subValue}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
