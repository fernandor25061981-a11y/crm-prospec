"use client";

import { CalendarClock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { updateProximoContato } from "@/services/leads";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "@/lib/datetime";

export function ReschedulePopover({
  leadId,
  proximoContato,
  onPatch,
  onError,
}: {
  leadId: string;
  proximoContato: string | null;
  onPatch: (proximoContato: string | null) => void;
  onError: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => toDatetimeLocalValue(proximoContato));
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function close(event: Event) {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }

    function closeAll() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", close);
    window.addEventListener("scroll", closeAll, true);
    window.addEventListener("resize", closeAll);

    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("scroll", closeAll, true);
      window.removeEventListener("resize", closeAll);
    };
  }, [open]);

  function handleOpen() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setValue(toDatetimeLocalValue(proximoContato));
    setOpen(true);
  }

  async function handleSave() {
    const previous = proximoContato;
    const novoValor = value ? fromDatetimeLocalValue(value) : null;
    setOpen(false);
    onPatch(novoValor);
    try {
      await updateProximoContato(leadId, novoValor);
    } catch {
      onPatch(previous);
      onError("Não foi possível reagendar o contato. Tente novamente.");
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        title="Reagendar próximo contato"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleOpen}
        className="flex h-12 w-12 items-center justify-center rounded-md text-zinc-500 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
      >
        <CalendarClock className="h-6 w-6" />
      </button>

      {open && pos && (
        <div
          ref={popoverRef}
          onPointerDown={(e) => e.stopPropagation()}
          style={{ position: "fixed", top: pos.top, left: pos.left }}
          className="z-50 w-64 rounded-md border border-black/[.08] bg-white p-3 shadow-lg dark:border-white/[.145] dark:bg-zinc-900"
        >
          <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
            Próximo contato
          </label>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mb-3 w-full rounded-md border border-black/[.08] bg-transparent px-2 py-1 text-sm dark:border-white/[.145]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs hover:bg-black/[.04] dark:hover:bg-white/[.06]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
