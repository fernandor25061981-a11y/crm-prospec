"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FOCUS_RING } from "@/lib/ui";
import { normalizarUrl } from "@/lib/url";
import { createLead, updateLead } from "@/services/leads";
import type { Lead, LeadInsert, LeadUpdate } from "@/types/database";
import { LeadFormPanel } from "./LeadFormPanel";
import type { LeadFormState } from "./types";

// Botões maiores e centralizados só neste modal — BTN_GHOST/BTN_PRIMARY são
// compartilhados com o resto do app, então o precedente (ExcluirLeadModal
// tem seu próprio BTN_DANGER) é declarar a variante localmente.
const BTN_GHOST_LG = `flex h-11 items-center justify-center rounded-md px-8 text-base text-muted hover:bg-hover ${FOCUS_RING}`;
const BTN_PRIMARY_LG = `flex h-11 items-center justify-center rounded-md bg-accent px-8 text-base font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50 ${FOCUS_RING}`;

const EMPTY_FORM: LeadFormState = {
  nome: "",
  categoria: "",
  idade_negocio: "",
  cidade: "",
  telefone_fixo: "",
  whatsapp: "",
  recepcionista: "",
  responsavel: "",
  maps_url: "",
  website_url: "",
  temperatura_site: "sem_site",
  temperatura_gmn: "sem_perfil",
};

function leadToForm(lead: Lead): LeadFormState {
  return {
    nome: lead.nome,
    categoria: lead.categoria ?? "",
    idade_negocio: lead.idade_negocio ?? "",
    cidade: lead.cidade ?? "",
    telefone_fixo: lead.telefone_fixo ?? "",
    whatsapp: lead.whatsapp ?? "",
    recepcionista: lead.recepcionista ?? "",
    responsavel: lead.responsavel ?? "",
    maps_url: lead.maps_url ?? "",
    website_url: lead.website_url ?? "",
    temperatura_site: lead.temperatura_site,
    temperatura_gmn: lead.temperatura_gmn,
  };
}

function formToPayload(form: LeadFormState) {
  return {
    nome: form.nome.trim(),
    categoria: form.categoria.trim() || null,
    idade_negocio: form.idade_negocio.trim() || null,
    cidade: form.cidade.trim() || null,
    telefone_fixo: form.telefone_fixo.trim() || null,
    whatsapp: form.whatsapp.trim() || null,
    recepcionista: form.recepcionista.trim() || null,
    responsavel: form.responsavel.trim() || null,
    maps_url: normalizarUrl(form.maps_url) || null,
    website_url: normalizarUrl(form.website_url) || null,
    temperatura_site: form.temperatura_site,
    temperatura_gmn: form.temperatura_gmn,
  };
}

export function LeadFormModal({
  lead,
  open,
  onCancel,
  onCreated,
  onPatched,
  onError,
}: {
  lead: Lead | null;
  open: boolean;
  onCancel: () => void;
  onCreated: (lead: Lead) => void;
  onPatched: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState<LeadFormState>(() => (lead ? leadToForm(lead) : EMPTY_FORM));
  const [saving, setSaving] = useState(false);
  const [loadedLeadId, setLoadedLeadId] = useState<string | null>(lead?.id ?? null);

  if ((lead?.id ?? null) !== loadedLeadId) {
    setLoadedLeadId(lead?.id ?? null);
    setForm(lead ? leadToForm(lead) : EMPTY_FORM);
  }

  function handleChange(patch: Partial<LeadFormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) {
      onError("Nome é obrigatório.");
      return;
    }

    const payload = formToPayload(form);
    setSaving(true);
    try {
      if (lead) {
        const patch: LeadUpdate = payload;
        await updateLead(lead.id, patch);
        onPatched(lead.id, patch);
      } else {
        const novoLead: LeadInsert = {
          ...payload,
          status_kanban: "lead_novo",
          lembrete: null,
          proximo_contato: null,
        };
        const criado = await createLead(novoLead);
        onCreated(criado);
      }
    } catch {
      onError(
        lead
          ? "Não foi possível salvar as alterações. Tente novamente."
          : "Não foi possível criar o lead. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onCancel} widthClassName="max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="mb-4 text-lg font-semibold">{lead ? "Editar Lead" : "Novo Lead"}</h2>

        <LeadFormPanel form={form} onChange={handleChange} />

        <div className="mt-6 flex justify-center gap-3 border-t border-line pt-4">
          <button type="button" onClick={onCancel} className={BTN_GHOST_LG}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} className={BTN_PRIMARY_LG}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
