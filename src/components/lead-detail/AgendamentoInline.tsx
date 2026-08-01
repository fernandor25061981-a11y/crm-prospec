"use client";

import { useState } from "react";
import { ProximoContatoLabel } from "@/components/kanban/ProximoContatoLabel";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "@/lib/datetime";
import { updateProximoContato } from "@/services/leads";

export function AgendamentoInline({
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
  const [value, setValue] = useState(() => toDatetimeLocalValue(proximoContato));
  const [loadedContato, setLoadedContato] = useState(proximoContato);

  if (loadedContato !== proximoContato) {
    setLoadedContato(proximoContato);
    setValue(toDatetimeLocalValue(proximoContato));
  }

  async function handleSave() {
    const previous = proximoContato;
    const novoValor = value ? fromDatetimeLocalValue(value) : null;
    onPatch(novoValor);
    try {
      await updateProximoContato(leadId, novoValor);
    } catch {
      onPatch(previous);
      onError("Não foi possível reagendar o contato. Tente novamente.");
    }
  }

  return (
    <div className="rounded-md border border-black/[.08] p-3 dark:border-white/[.145]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Próximo contato</span>
        <ProximoContatoLabel proximoContato={proximoContato} />
      </div>
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border border-black/[.08] bg-transparent px-2 py-1.5 text-sm dark:border-white/[.145]"
        />
        <button
          type="button"
          onClick={handleSave}
          className="shrink-0 rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
