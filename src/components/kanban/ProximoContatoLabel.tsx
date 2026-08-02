"use client";

import { useEffect, useState } from "react";
import { formatDataHora, formatDataHoraSemAno } from "@/lib/datetime";

type Display = { text: string; textCurto: string; overdue: boolean };

function computeDisplay(proximoContato: string): Display {
  const date = new Date(proximoContato);
  return {
    text: formatDataHora(proximoContato),
    textCurto: formatDataHoraSemAno(proximoContato),
    overdue: date.getTime() < Date.now(),
  };
}

export function ProximoContatoLabel({
  proximoContato,
  curtoNoDesktop = false,
}: {
  proximoContato: string | null;
  /** No desktop, esconde o ano — o card do kanban não tem largura para ele. */
  curtoNoDesktop?: boolean;
}) {
  const [display, setDisplay] = useState<Display | null>(null);

  useEffect(() => {
    if (!proximoContato) {
      setDisplay(null);
      return;
    }

    setDisplay(computeDisplay(proximoContato));
    const id = setInterval(() => setDisplay(computeDisplay(proximoContato)), 60_000);
    return () => clearInterval(id);
  }, [proximoContato]);

  if (!proximoContato) {
    return <span className="text-[1.125rem] text-faint">Sem próximo compromisso</span>;
  }

  if (!display) {
    return <span className="text-[1.125rem] text-faint">…</span>;
  }

  return (
    <span
      className={
        display.overdue
          ? "text-[1.125rem] font-medium text-red-600 dark:text-red-400"
          : "text-[1.125rem] text-faint"
      }
    >
      {curtoNoDesktop ? (
        <>
          <span className="md:hidden">{display.text}</span>
          <span className="hidden md:inline">{display.textCurto}</span>
        </>
      ) : (
        display.text
      )}
    </span>
  );
}
