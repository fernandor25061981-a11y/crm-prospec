"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lead } from "@/types/database";

const TICK_MS = 20_000;

function isOverdue(lead: Lead, now: number): lead is Lead & { proximo_contato: string } {
  return lead.proximo_contato != null && new Date(lead.proximo_contato).getTime() <= now;
}

export function useOverdueLeads(leads: Lead[]): {
  overdueLeads: Array<Lead & { proximo_contato: string }>;
  now: number;
} {
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

  return { overdueLeads, now };
}
