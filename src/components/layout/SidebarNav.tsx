"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_ITEM, SIDEBAR_ITEM_ACTIVE, SIDEBAR_ITEM_IDLE } from "@/lib/ui";

const NAV_LINKS = [
  { href: "/kanban", label: "Kanban" },
  { href: "/agenda", label: "Agenda" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    // O gap acompanha o do <aside>: o vão CSV→Kanban e Agenda→Sair vem de lá,
    // o Kanban→Agenda vem daqui, e os três precisam bater.
    <nav className="flex flex-col gap-2">
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`${SIDEBAR_ITEM} ${active ? SIDEBAR_ITEM_ACTIVE : SIDEBAR_ITEM_IDLE}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
