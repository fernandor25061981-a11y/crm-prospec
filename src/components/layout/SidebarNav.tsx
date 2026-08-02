"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOCUS_RING } from "@/lib/ui";

const NAV_LINKS = [
  { href: "/kanban", label: "Kanban" },
  { href: "/agenda", label: "Agenda" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-1 flex flex-1 flex-col gap-1">
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-2 py-1.5 text-center text-sm font-medium ${FOCUS_RING} ${
              active
                ? "bg-accent-soft text-accent"
                : "border border-line-strong text-muted hover:bg-hover"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
