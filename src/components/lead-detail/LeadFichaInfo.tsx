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
import { getWhatsappUrl } from "@/lib/whatsapp";
import type { Lead } from "@/types/database";
import { AgendamentoModal } from "./AgendamentoModal";
import { RegistrarInteracaoPanel } from "./RegistrarInteracaoPanel";
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
    ? "pointer-events-none border-black/[.08] text-zinc-300 dark:border-white/[.145] dark:text-zinc-700"
    : tone === "accent"
      ? "border-black/[.08] text-green-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-green-500 dark:hover:bg-white/[.06]"
      : tone === "danger"
        ? "border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
        : "border-black/[.08] text-zinc-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-white/[.06]";

  const className = `flex h-10 w-full items-center justify-center rounded-md border ${toneClassName}`;

  return (
    <div>
      {onClick ? (
        <button type="button" onClick={onClick} className={className}>
          {icon}
        </button>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {icon}
        </a>
      )}
      <span className="mt-1 block truncate text-center text-sm text-zinc-500 dark:text-zinc-400">
        {caption}
      </span>
    </div>
  );
}

export function LeadFichaInfo({
  lead,
  onEdit,
  onDelete,
  onPatch,
  onError,
  onInteracaoSalva,
}: {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onPatch: (patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onInteracaoSalva: () => void;
}) {
  const telefoneHref = lead.telefone_fixo ? `tel:${lead.telefone_fixo}` : undefined;
  const whatsappHref = getWhatsappUrl(lead.whatsapp) ?? undefined;
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{lead.nome}</h1>
        <h2 className="text-base text-zinc-600 dark:text-zinc-300">
          {lead.categoria ?? "Sem categoria"}
        </h2>
        <h3 className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          {lead.responsavel ?? "Sem responsável"} · {lead.recepcionista ?? "Sem recepcionista"}
        </h3>
        <h3 className="text-base text-zinc-500 dark:text-zinc-400">
          {lead.cidade ?? "Sem cidade"} · {lead.idade_negocio ?? "Sem idade do negócio"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatusBar
          label="Site"
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
          onClick={onDelete}
          icon={<Trash2 className="h-4 w-4" />}
          caption="Excluir lead"
          tone="danger"
        />
        <ActionButton
          onClick={onEdit}
          icon={<Pencil className="h-4 w-4" />}
          caption="Editar lead"
          tone="accent"
        />
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

      <div className="rounded-md border border-black/[.08] p-3 dark:border-white/[.145]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Próximo compromisso</span>
          <ProximoContatoLabel proximoContato={lead.proximo_contato} />
        </div>
        <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-300">
          {lead.lembrete || "Sem lembrete"}
        </p>
        <button
          type="button"
          onClick={() => setAgendamentoOpen(true)}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-black/[.08] text-sm text-zinc-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-white/[.06]"
        >
          <CalendarClock className="h-4 w-4" />
          Editar agendamento
        </button>
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

      <RegistrarInteracaoPanel leadId={lead.id} onError={onError} onSaved={onInteracaoSalva} />
    </div>
  );
}
