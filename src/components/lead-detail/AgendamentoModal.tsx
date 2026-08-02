"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "@/lib/datetime";
import { BTN_GHOST, BTN_PRIMARY, INPUT } from "@/lib/ui";
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
        <button type="button" onClick={onClose} className={BTN_GHOST}>
          Fechar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-faint">Próximo compromisso</label>
          <input
            type="datetime-local"
            value={dataValue}
            onChange={(e) => setDataValue(e.target.value)}
            className={INPUT}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-faint">Lembrete</label>
          <textarea
            value={lembreteValue}
            onChange={(e) => setLembreteValue(e.target.value)}
            rows={3}
            placeholder="Ex.: retornar após o cliente decidir sobre o orçamento"
            className={`${INPUT} resize-none`}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={BTN_GHOST}>
            Cancelar
          </button>
          <button type="button" onClick={handleSave} className={BTN_PRIMARY}>
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}
