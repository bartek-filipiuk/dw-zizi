"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Layers,
  Image,
  Menu,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sections", label: "Sections", icon: Layers },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/menu", label: "Menu", icon: Menu },
  { href: "/admin/submissions", label: "Submissions", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-charcoal-800 bg-charcoal-950">
      {/* Logo */}
      <div className="border-b border-charcoal-800 px-6 py-5">
        <Link href="/admin/dashboard" className="font-serif text-lg tracking-[0.2em] text-cream-50">
          DW ZIZI
        </Link>
        <p className="mt-1 text-xs text-charcoal-400">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-oak-500/10 text-oak-400"
                    : "text-charcoal-300 hover:bg-charcoal-800 hover:text-cream-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-charcoal-800 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-charcoal-400 transition-colors hover:text-cream-100"
        >
          View Site →
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-charcoal-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
