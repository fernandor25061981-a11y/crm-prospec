"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { BTN_GHOST } from "@/lib/ui";
import type { Lead } from "@/types/database";
import { HistoricoPanel } from "./HistoricoPanel";
import { LeadFichaInfo } from "./LeadFichaInfo";

export function LeadFichaModal({
  lead,
  open,
  onClose,
  onEdit,
  onDelete,
  onPatch,
  onError,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  const [historicoVersion, setHistoricoVersion] = useState(0);

  if (!lead) return null;

  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ficha do Lead</h2>
        <button type="button" onClick={onClose} className={BTN_GHOST}>
          Fechar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LeadFichaInfo
          lead={lead}
          onEdit={() => onEdit(lead)}
          onDelete={() => onDelete(lead)}
          onPatch={(patch) => onPatch(lead.id, patch)}
          onError={onError}
          onInteracaoSalva={() => setHistoricoVersion((v) => v + 1)}
        />

        <div className="border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <HistoricoPanel leadId={lead.id} onError={onError} refreshToken={historicoVersion} />
        </div>
      </div>
    </Modal>
  );
}
