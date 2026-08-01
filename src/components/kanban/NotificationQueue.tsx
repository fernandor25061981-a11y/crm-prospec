"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lead } from "@/types/database";
import { NotificationCard } from "./NotificationCard";

const TICK_MS = 20_000;

function isOverdue(lead: Lead, now: number): lead is Lead & { proximo_contato: string } {
  return lead.proximo_contato != null && new Date(lead.proximo_contato).getTime() <= now;
}

export function NotificationQueue({
  leads,
  onPatch,
  onError,
}: {
  leads: Lead[];
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const overdueLeads = useMemo(() => {
    return leads
      .filter((lead): lead is Lead & { proximo_contato: string } => isOverdue(lead, now))
      .sort(
        (a, b) => new Date(a.proximo_contato).getTime() - new Date(b.proximo_contato).getTime()
      );
  }, [leads, now]);

  if (overdueLeads.length === 0) return null;

  return (
    <div className="border-b border-black/[.08] bg-red-50/60 px-6 py-3 dark:border-white/[.145] dark:bg-red-950/20">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold text-red-700 dark:text-red-400">
          Fila de Notificações
        </span>
        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900 dark:text-red-300">
          {overdueLeads.length}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {overdueLeads.map((lead) => (
          <NotificationCard
            key={lead.id}
            lead={lead}
            now={now}
            onPatch={onPatch}
            onError={onError}
          />
        ))}
      </div>
    </div>
  );
}
