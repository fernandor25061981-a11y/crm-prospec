"use client";

import { useEffect, useState } from "react";

type Display = { text: string; overdue: boolean };

function computeDisplay(proximoContato: string): Display {
  const date = new Date(proximoContato);
  return {
    text: new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date),
    overdue: date.getTime() < Date.now(),
  };
}

export function ProximoContatoLabel({
  proximoContato,
}: {
  proximoContato: string | null;
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
    return (
      <span className="text-[18px] text-zinc-400 dark:text-zinc-500">Sem próximo compromisso</span>
    );
  }

  if (!display) {
    return <span className="text-[18px] text-zinc-500 dark:text-zinc-400">…</span>;
  }

  return (
    <span
      className={
        display.overdue
          ? "text-[18px] font-medium text-red-600 dark:text-red-400"
          : "text-[18px] text-zinc-500 dark:text-zinc-400"
      }
    >
      {display.text}
    </span>
  );
}
