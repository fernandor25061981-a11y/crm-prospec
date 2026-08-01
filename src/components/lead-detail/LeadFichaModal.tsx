"use client";

import { Modal } from "@/components/ui/Modal";
import type { Lead } from "@/types/database";
import { HistoricoPanel } from "./HistoricoPanel";
import { LeadFichaInfo } from "./LeadFichaInfo";

export function LeadFichaModal({
  lead,
  open,
  onClose,
  onEdit,
  onPatch,
  onError,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  if (!lead) return null;

  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ficha do Lead</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm hover:bg-black/[.04] dark:hover:bg-white/[.06]"
        >
          Fechar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <LeadFichaInfo
          lead={lead}
          onEdit={() => onEdit(lead)}
          onPatch={(patch) => onPatch(lead.id, patch)}
          onError={onError}
        />

        <div className="border-t border-black/[.08] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 dark:border-white/[.145]">
          <HistoricoPanel leadId={lead.id} onError={onError} />
        </div>
      </div>
    </Modal>
  );
}
