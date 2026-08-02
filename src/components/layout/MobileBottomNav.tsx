"use client";

import { Calendar, LayoutGrid, LogOut, Plus } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/kanban?new=1", label: "+ Lead", icon: Plus },
  { href: "/kanban", label: "Kanban", icon: LayoutGrid },
  { href: "/agenda", label: "Agenda", icon: Calendar },
];

export function MobileBottomNav({ logout }: { logout: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-black/[.08] bg-white md:hidden dark:border-white/[.145] dark:bg-zinc-900">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex flex-1 flex-col items-center gap-0.5 px-2 py-2 text-xs font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-white/[.06]"
        >
          <link.icon className="h-5 w-5" />
          {link.label}
        </Link>
      ))}
      <form action={logout} className="flex flex-1">
        <button
          type="submit"
          className="flex flex-1 flex-col items-center gap-0.5 px-2 py-2 text-xs font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-white/[.06]"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </form>
    </nav>
  );
}
