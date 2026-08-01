"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "@/lib/datetime";
import { createLead, updateLead } from "@/services/leads";
import type { Lead, LeadInsert, LeadUpdate } from "@/types/database";
import { LeadFormPanel } from "./LeadFormPanel";
import type { LeadFormState } from "./types";

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
  proximo_contato: "",
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
    proximo_contato: toDatetimeLocalValue(lead.proximo_contato),
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
    maps_url: form.maps_url.trim() || null,
    website_url: form.website_url.trim() || null,
    temperatura_site: form.temperatura_site,
    temperatura_gmn: form.temperatura_gmn,
    proximo_contato: form.proximo_contato
      ? fromDatetimeLocalValue(form.proximo_contato)
      : null,
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
        const novoLead: LeadInsert = { ...payload, status_kanban: "lead_novo" };
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

        <div className="mt-6 flex justify-end gap-2 border-t border-black/[.08] pt-4 dark:border-white/[.145]">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm hover:bg-black/[.04] dark:hover:bg-white/[.06]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
