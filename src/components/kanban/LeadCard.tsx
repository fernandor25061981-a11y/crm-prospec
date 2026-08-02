"use client";

import { useDraggable } from "@dnd-kit/core";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Lead, StatusKanban } from "@/types/database";
import { LeadCardBody } from "./LeadCardBody";

export function LeadCard({
  lead,
  fallbackTexto = null,
  onPatch,
  onError,
  onOpen,
  onChangeFase,
}: {
  lead: Lead;
  fallbackTexto?: string | null;
  onPatch: (patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
  onChangeFase: (novaFase: StatusKanban) => void;
}) {
  const isMobile = useIsMobile();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });

  const dragProps = isMobile ? {} : { ...listeners, ...attributes };

  return (
    <div
      ref={setNodeRef}
      {...dragProps}
      onClick={() => onOpen(lead)}
      className={`cursor-pointer ${isMobile ? "touch-pan-y" : "touch-none"} ${isDragging ? "opacity-30" : ""}`}
    >
      <LeadCardBody
        lead={lead}
        fallbackTexto={fallbackTexto}
        onPatch={onPatch}
        onError={onError}
        onChangeFase={onChangeFase}
      />
    </div>
  );
}
