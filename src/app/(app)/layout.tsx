import Link from "next/link";
import { logout } from "../login/actions";

const NAV_LINKS = [
  { href: "/kanban", label: "Kanban" },
  { href: "/agenda", label: "Agenda" },
];

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-full flex">
      <aside className="w-32 shrink-0 border-r border-black/[.08] dark:border-white/[.145] flex flex-col gap-1 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/preguica.gif" alt="" className="w-full rounded-md" />
        <Link
          href="/kanban?new=1"
          className="rounded-md bg-zinc-900 px-2 py-1.5 text-center text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Lead
        </Link>
        <nav className="mt-1 flex flex-1 flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-black/[.04] dark:hover:bg-white/[.06]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-zinc-500 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
          >
            Sair
          </button>
        </form>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
