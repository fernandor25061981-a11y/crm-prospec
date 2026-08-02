"use client";

import { Phone } from "lucide-react";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/kanban/WhatsAppIcon";
import { BTN_ACTION, BTN_GHOST, BTN_PRIMARY, FOCUS_RING } from "@/lib/ui";
import { addAnotacaoManual } from "@/services/leads";
import type { InteracaoTipo } from "@/types/database";

// Mesma variante neutra do ActionButton da ficha, para os dois pares de botões
// ficarem com a mesma altura e alinhamento.
const BTN_REGISTRAR = `${BTN_ACTION} border border-line-strong text-muted hover:bg-hover`;

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
    <div className="mb-3 rounded-md border border-line p-3">
      <textarea
        autoFocus
        rows={3}
        placeholder={tipo === "ligacao" ? "Resumo da ligação..." : "Resumo do WhatsApp..."}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className={`mb-2 w-full rounded-md border border-line-strong bg-transparent px-2 py-1 text-sm ${FOCUS_RING}`}
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className={`${BTN_GHOST} px-2 py-1 text-xs`}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(descricao)}
          className={`${BTN_PRIMARY} px-2 py-1 text-xs`}
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
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setFormTipo("ligacao")} className={BTN_REGISTRAR}>
          <Phone className="h-4 w-4" />
          <span className="truncate">Registrar Ligação</span>
        </button>
        <button type="button" onClick={() => setFormTipo("whatsapp")} className={BTN_REGISTRAR}>
          <WhatsAppIcon className="h-4 w-4" />
          <span className="truncate">Registrar WhatsApp</span>
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
