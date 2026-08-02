"use client";

import { Calendar, FileSpreadsheet, LayoutGrid, LogOut, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOCUS_RING } from "@/lib/ui";

// "+ Lead", "Buscar" e "CSV" abrem modais via query string; não são destinos,
// então nunca entram no estado ativo (por isso só os itens sem query trazem `match`).
const NAV_LINKS = [
  { href: "/kanban?new=1", label: "+ Lead", icon: Plus, match: null },
  { href: "/kanban?busca=1", label: "Buscar", icon: Search, match: null },
  { href: "/kanban", label: "Kanban", icon: LayoutGrid, match: "/kanban" },
  { href: "/agenda", label: "Agenda", icon: Calendar, match: "/agenda" },
  { href: "/kanban?csv=1", label: "CSV", icon: FileSpreadsheet, match: null },
];

// Com 5 itens o espaço por coluna aperta: px-1 e nowrap evitam o rótulo quebrar em duas linhas.
const itemClass = `flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-xs font-medium whitespace-nowrap ${FOCUS_RING}`;

export function MobileBottomNav({ logout }: { logout: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface md:hidden">
      {NAV_LINKS.map((link) => {
        const active = link.match !== null && pathname === link.match;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`${itemClass} ${
              active ? "bg-accent-soft text-accent" : "text-muted hover:bg-hover"
            }`}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
      <form action={logout} className="flex flex-1">
        <button type="submit" className={`${itemClass} text-muted hover:bg-hover`}>
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </form>
    </nav>
  );
}
