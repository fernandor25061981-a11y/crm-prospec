"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Lead } from "@/types/database";
import { LeadCardBody } from "./LeadCardBody";

export function LeadCard({
  lead,
  onPatch,
  onError,
  onOpen,
}: {
  lead: Lead;
  onPatch: (patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(lead)}
      className={`touch-none cursor-pointer ${isDragging ? "opacity-30" : ""}`}
    >
      <LeadCardBody lead={lead} onPatch={onPatch} onError={onError} />
    </div>
  );
}
