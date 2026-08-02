"use client";

import { Phone } from "lucide-react";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/kanban/WhatsAppIcon";
import { addAnotacaoManual } from "@/services/leads";
import type { InteracaoTipo } from "@/types/database";

function AnotacaoForm({
  tipo,
  onCancel,
  onSave,
}: {
  tipo: Extract<InteracaoTipo, "ligacao" | "whatsapp">;
  onCancel: () => void;
  onSave: (descricao: string) => void;
}) {
  const [descricao, setDescricao] = useState("");

  return (
    <div className="mb-3 rounded-md border border-black/[.08] p-3 dark:border-white/[.145]">
      <textarea
        autoFocus
        rows={3}
        placeholder={tipo === "ligacao" ? "Resumo da ligação..." : "Resumo do WhatsApp..."}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="mb-2 w-full rounded-md border border-black/[.08] bg-transparent px-2 py-1 text-sm dark:border-white/[.145]"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-2 py-1 text-xs hover:bg-black/[.04] dark:hover:bg-white/[.06]"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(descricao)}
          className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export function RegistrarInteracaoPanel({
  leadId,
  onError,
  onSaved,
}: {
  leadId: string;
  onError: (message: string) => void;
  onSaved: () => void;
}) {
  const [formTipo, setFormTipo] = useState<Extract<InteracaoTipo, "ligacao" | "whatsapp"> | null>(
    null
  );

  async function handleSave(
    tipo: Extract<InteracaoTipo, "ligacao" | "whatsapp">,
    descricao: string
  ) {
    if (!descricao.trim()) {
      onError("Descreva o resumo antes de salvar.");
      return;
    }
    setFormTipo(null);
    try {
      await addAnotacaoManual(leadId, tipo, descricao.trim());
      onSaved();
    } catch {
      onError("Não foi possível salvar a anotação. Tente novamente.");
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormTipo("ligacao")}
          className="flex items-center gap-1.5 rounded-md border border-black/[.08] px-2 py-1 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
        >
          <Phone className="h-3.5 w-3.5" /> Registrar Ligação
        </button>
        <button
          type="button"
          onClick={() => setFormTipo("whatsapp")}
          className="flex items-center gap-1.5 rounded-md border border-black/[.08] px-2 py-1 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" /> Registrar WhatsApp
        </button>
      </div>

      {formTipo && (
        <div className="mt-3">
          <AnotacaoForm
            tipo={formTipo}
            onCancel={() => setFormTipo(null)}
            onSave={(descricao) => handleSave(formTipo, descricao)}
          />
        </div>
      )}
    </div>
  );
}
