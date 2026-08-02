"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "@/lib/datetime";
import { updateAgendamento } from "@/services/leads";
import type { Lead } from "@/types/database";

export function AgendamentoModal({
  leadId,
  proximoContato,
  lembrete,
  open,
  onClose,
  onPatch,
  onError,
}: {
  leadId: string;
  proximoContato: string | null;
  lembrete: string | null;
  open: boolean;
  onClose: () => void;
  onPatch: (patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  const [dataValue, setDataValue] = useState(() => toDatetimeLocalValue(proximoContato));
  const [lembreteValue, setLembreteValue] = useState(lembrete ?? "");
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDataValue(toDatetimeLocalValue(proximoContato));
      setLembreteValue(lembrete ?? "");
    }
  }

  async function handleSave() {
    const previous = { proximo_contato: proximoContato, lembrete };
    const novoProximoContato = dataValue ? fromDatetimeLocalValue(dataValue) : null;
    const novoLembrete = lembreteValue.trim() || null;

    onClose();
    onPatch({ proximo_contato: novoProximoContato, lembrete: novoLembrete });

    try {
      await updateAgendamento(leadId, novoProximoContato, novoLembrete);
    } catch {
      onPatch(previous);
      onError("Não foi possível salvar o agendamento. Tente novamente.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Agendamento</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm hover:bg-black/[.04] dark:hover:bg-white/[.06]"
        >
          Fechar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
            Próximo compromisso
          </label>
          <input
            type="datetime-local"
            value={dataValue}
            onChange={(e) => setDataValue(e.target.value)}
            className="w-full rounded-md border border-black/[.08] bg-transparent px-2 py-1.5 text-sm dark:border-white/[.145]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Lembrete</label>
          <textarea
            value={lembreteValue}
            onChange={(e) => setLembreteValue(e.target.value)}
            rows={3}
            placeholder="Ex.: retornar após o cliente decidir sobre o orçamento"
            className="w-full resize-none rounded-md border border-black/[.08] bg-transparent px-2 py-1.5 text-sm dark:border-white/[.145]"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm hover:bg-black/[.04] dark:hover:bg-white/[.06]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}
