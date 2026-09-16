"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  Terminal,
  User,
  FolderKanban,
  BarChart3,
  Quote,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Star },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-cyan-400" />
          <span className="font-mono text-sm font-semibold text-white">
            portfolio/admin
          </span>
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          className="rounded-md p-1 text-slate-400 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          onClick={onMobileClose}
          className="flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
        >
          View Live Site →
        </Link>
      </div>
    </aside>
  );
}
