import Link from "next/link";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { SIDEBAR_ITEM, SIDEBAR_ITEM_IDLE } from "@/lib/ui";
import { logout } from "../login/actions";

const navButtonClass = `${SIDEBAR_ITEM} ${SIDEBAR_ITEM_IDLE}`;

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-full flex">
      <aside className="hidden w-32 shrink-0 border-r border-line md:flex flex-col gap-2 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/preguica.gif" alt="" className="w-full rounded-md" />
        <Link href="/kanban?new=1" className={navButtonClass}>
          Novo
        </Link>
        <Link href="/kanban?busca=1" className={navButtonClass}>
          Buscar
        </Link>
        <Link href="/kanban?csv=1" className={navButtonClass}>
          CSV
        </Link>
        <SidebarNav />
        <form action={logout}>
          {/* w-full porque o filho flex do aside é o <form>, não o <button>. */}
          <button type="submit" className={`w-full ${navButtonClass}`}>
            Sair
          </button>
        </form>
      </aside>
      <main className="flex-1 min-w-0 pb-16 md:pb-0">{children}</main>
      <MobileBottomNav logout={logout} />
    </div>
  );
}
