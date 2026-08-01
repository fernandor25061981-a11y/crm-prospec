"use client";

import { Pencil, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/kanban/WhatsAppIcon";
import {
  TEMPERATURA_GMN_COLORS,
  TEMPERATURA_GMN_LABELS,
  TEMPERATURA_SITE_COLORS,
  TEMPERATURA_SITE_LABELS,
} from "@/lib/temperatura";
import { getWhatsappUrl } from "@/lib/whatsapp";
import type { Lead } from "@/types/database";
import { AgendamentoInline } from "./AgendamentoInline";
import { StatusBar } from "./StatusBar";

function ActionButton({
  href,
  onClick,
  icon,
  caption,
  primary,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  caption: string;
  primary?: boolean;
}) {
  const className = primary
    ? "flex h-10 w-full items-center justify-center rounded-md bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    : `flex h-10 w-full items-center justify-center rounded-md border ${
        href
          ? "border-black/[.08] text-zinc-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-white/[.06]"
          : "pointer-events-none border-black/[.08] text-zinc-300 dark:border-white/[.145] dark:text-zinc-700"
      }`;

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
      <span className="mt-1 block truncate text-center text-xs text-zinc-500 dark:text-zinc-400">
        {caption}
      </span>
    </div>
  );
}

export function LeadFichaInfo({
  lead,
  onEdit,
  onPatch,
  onError,
}: {
  lead: Lead;
  onEdit: () => void;
  onPatch: (patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{lead.nome}</h1>
        <h2 className="text-sm text-zinc-600 dark:text-zinc-300">
          {lead.categoria ?? "Sem categoria"}
        </h2>
        <h3 className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {lead.responsavel ?? "Sem responsável"} · {lead.recepcionista ?? "Sem recepcionista"}
        </h3>
        <h3 className="text-sm text-zinc-500 dark:text-zinc-400">
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

      <div className="grid grid-cols-3 gap-2">
        <ActionButton
          onClick={onEdit}
          icon={<Pencil className="h-4 w-4" />}
          caption="Editar lead"
          primary
        />
        <ActionButton
          href={lead.telefone_fixo ? `tel:${lead.telefone_fixo}` : undefined}
          icon={<Phone className="h-4 w-4" />}
          caption={lead.telefone_fixo ?? "Sem telefone"}
        />
        <ActionButton
          href={getWhatsappUrl(lead.whatsapp) ?? undefined}
          icon={<WhatsAppIcon className="h-4 w-4" />}
          caption={lead.whatsapp ?? "Sem WhatsApp"}
        />
      </div>

      <AgendamentoInline
        leadId={lead.id}
        proximoContato={lead.proximo_contato}
        onPatch={(proximo_contato) => onPatch({ proximo_contato })}
        onError={onError}
      />
    </div>
  );
}
