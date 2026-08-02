"use client";

import { CalendarClock, Pencil, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/kanban/WhatsAppIcon";
import { ProximoContatoLabel } from "@/components/kanban/ProximoContatoLabel";
import {
  TEMPERATURA_GMN_COLORS,
  TEMPERATURA_GMN_LABELS,
  TEMPERATURA_SITE_COLORS,
  TEMPERATURA_SITE_LABELS,
} from "@/lib/temperatura";
import { BTN_ACTION, FOCUS_RING } from "@/lib/ui";
import { getWhatsappUrl } from "@/lib/whatsapp";
import type { Lead } from "@/types/database";
import { AgendamentoModal } from "./AgendamentoModal";
import { ExcluirLeadModal } from "./ExcluirLeadModal";
import { StatusBar } from "./StatusBar";

function ActionButton({
  href,
  onClick,
  icon,
  caption,
  tone = "neutral",
  disabled,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  caption: string;
  tone?: "neutral" | "accent" | "danger";
  disabled?: boolean;
}) {
  const toneClassName = disabled
    ? "pointer-events-none border-line text-disabled"
    : tone === "accent"
      ? "border-line-strong text-green-600 hover:bg-hover dark:text-green-500"
      : tone === "danger"
        ? "border-line-danger-strong text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        : "border-line-strong text-muted hover:bg-hover";

  const className = `${BTN_ACTION} border ${toneClassName}`;
  const content = (
    <>
      {icon}
      <span className="truncate">{caption}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

export function LeadFichaInfo({
  lead,
  onEdit,
  onDelete,
  onPatch,
  onError,
}: {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onPatch: (patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  const telefoneHref = lead.telefone_fixo ? `tel:${lead.telefone_fixo}` : undefined;
  const whatsappHref = getWhatsappUrl(lead.whatsapp) ?? undefined;
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const [excluirOpen, setExcluirOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{lead.nome}</h1>
        <h2 className="text-base text-muted">{lead.categoria ?? "Sem categoria"}</h2>
        <h3 className="mt-2 text-base text-faint">
          {lead.responsavel ?? "Sem responsável"} · {lead.recepcionista ?? "Sem recepcionista"}
        </h3>
        <h3 className="text-base text-faint">
          {lead.cidade ?? "Sem cidade"} · {lead.idade_negocio ?? "Sem idade do negócio"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatusBar
          label="SITE"
          value={lead.temperatura_site}
          labels={TEMPERATURA_SITE_LABELS}
          colors={TEMPERATURA_SITE_COLORS}
          href={lead.website_url}
        />
        <StatusBar
          label="GMN"
          value={lead.temperatura_gmn}
          labels={TEMPERATURA_GMN_LABELS}
          colors={TEMPERATURA_GMN_COLORS}
          href={lead.maps_url}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ActionButton
          href={telefoneHref}
          disabled={!telefoneHref}
          icon={<Phone className="h-4 w-4" />}
          caption={lead.telefone_fixo ?? "Sem telefone"}
        />
        <ActionButton
          href={whatsappHref}
          disabled={!whatsappHref}
          icon={<WhatsAppIcon className="h-4 w-4" />}
          caption={lead.whatsapp ?? "Sem WhatsApp"}
        />
      </div>

      <div className="rounded-md border border-line p-3">
        {/* Rótulo e data no mesmo tamanho e na mesma linha. O flex-wrap é só válvula
            de segurança: no desktop a raiz é 80% e os dois cabem folgados, mas no
            mobile 1,125rem vale 18px e a dupla estouraria a caixa. */}
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-[1.125rem] text-faint">Próximo compromisso</span>
          <ProximoContatoLabel proximoContato={lead.proximo_contato} />
        </div>
        <p className="mb-2 text-sm text-muted">{lead.lembrete || "Sem lembrete"}</p>
        <button
          type="button"
          onClick={() => setAgendamentoOpen(true)}
          className={`flex h-9 w-full items-center justify-center gap-2 rounded-md border border-line-strong text-sm text-muted hover:bg-hover ${FOCUS_RING}`}
        >
          <CalendarClock className="h-4 w-4" />
          Editar agendamento
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ActionButton
          onClick={onEdit}
          icon={<Pencil className="h-4 w-4" />}
          caption="Editar lead"
          tone="accent"
        />
        <ActionButton
          onClick={() => setExcluirOpen(true)}
          icon={<Trash2 className="h-4 w-4" />}
          caption="Excluir lead"
          tone="danger"
        />
      </div>

      <AgendamentoModal
        leadId={lead.id}
        proximoContato={lead.proximo_contato}
        lembrete={lead.lembrete}
        open={agendamentoOpen}
        onClose={() => setAgendamentoOpen(false)}
        onPatch={onPatch}
        onError={onError}
      />

      <ExcluirLeadModal
        nome={lead.nome}
        open={excluirOpen}
        onClose={() => setExcluirOpen(false)}
        onConfirm={onDelete}
      />
    </div>
  );
}
