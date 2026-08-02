"use client";

import { useEffect, useState } from "react";
import { formatDataHora } from "@/lib/datetime";

type Display = { text: string; overdue: boolean };

function computeDisplay(proximoContato: string): Display {
  const date = new Date(proximoContato);
  return {
    text: formatDataHora(proximoContato),
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
    return <span className="text-[18px] text-faint">Sem próximo compromisso</span>;
  }

  if (!display) {
    return <span className="text-[18px] text-faint">…</span>;
  }

  return (
    <span
      className={
        display.overdue
          ? "text-[18px] font-medium text-red-600 dark:text-red-400"
          : "text-[18px] text-faint"
      }
    >
      {display.text}
    </span>
  );
}
