import Link from "next/link";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { BTN_PRIMARY, FOCUS_RING } from "@/lib/ui";
import { logout } from "../login/actions";

const navButtonClass = `${BTN_PRIMARY} px-2 text-center`;

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-full flex">
      <aside className="hidden w-32 shrink-0 border-r border-line md:flex flex-col gap-1 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/preguica.gif" alt="" className="w-full rounded-md" />
        <Link href="/kanban?new=1" className={navButtonClass}>
          + Lead
        </Link>
        <Link href="/kanban?csv=1" className={navButtonClass}>
          CSV
        </Link>
        <SidebarNav />
        <form action={logout}>
          <button
            type="submit"
            className={`w-full rounded-md px-2 py-2 text-left text-sm font-medium text-faint hover:bg-hover ${FOCUS_RING}`}
          >
            Sair
          </button>
        </form>
      </aside>
      <main className="flex-1 min-w-0 pb-16 md:pb-0">{children}</main>
      <MobileBottomNav logout={logout} />
    </div>
  );
}
