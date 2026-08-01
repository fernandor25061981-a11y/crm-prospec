"use client";

import { ArrowRightLeft, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { addAnotacaoManual, getInteracoes } from "@/services/leads";
import type { Interacao, InteracaoTipo } from "@/types/database";
import { WhatsAppIcon } from "../kanban/WhatsAppIcon";

function formatDataCriacao(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(iso)
  );
}

function InteracaoIcon({ tipo }: { tipo: InteracaoTipo }) {
  if (tipo === "ligacao") return <Phone className="h-4 w-4" />;
  if (tipo === "whatsapp") return <WhatsAppIcon className="h-4 w-4" />;
  return <ArrowRightLeft className="h-4 w-4" />;
}

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
    <div className="mb-3 rounded-md border border-black/[.08] p-3 dark:border-white/[.145]">
      <textarea
        autoFocus
        rows={3}
        placeholder={tipo === "ligacao" ? "Resumo da ligação..." : "Resumo do WhatsApp..."}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="mb-2 w-full rounded-md border border-black/[.08] bg-transparent px-2 py-1 text-sm dark:border-white/[.145]"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-2 py-1 text-xs hover:bg-black/[.04] dark:hover:bg-white/[.06]"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(descricao)}
          className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export function HistoricoPanel({
  leadId,
  onError,
}: {
  leadId: string;
  onError: (message: string) => void;
}) {
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedLeadId, setLoadedLeadId] = useState(leadId);
  const [formTipo, setFormTipo] = useState<Extract<InteracaoTipo, "ligacao" | "whatsapp"> | null>(
    null
  );

  if (loadedLeadId !== leadId) {
    setLoadedLeadId(leadId);
    setInteracoes([]);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;
    getInteracoes(leadId)
      .then((data) => {
        if (!cancelled) setInteracoes(data);
      })
      .catch(() => {
        if (!cancelled) onError("Não foi possível carregar o histórico.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [leadId, onError]);

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
      const nova = await addAnotacaoManual(leadId, tipo, descricao.trim());
      setInteracoes((prev) => [nova, ...prev]);
    } catch {
      onError("Não foi possível salvar a anotação. Tente novamente.");
    }
  }

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 text-sm font-semibold">Histórico e Interações</h3>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setFormTipo("ligacao")}
          className="flex items-center gap-1.5 rounded-md border border-black/[.08] px-2 py-1 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
        >
          <Phone className="h-3.5 w-3.5" /> Registrar Ligação
        </button>
        <button
          type="button"
          onClick={() => setFormTipo("whatsapp")}
          className="flex items-center gap-1.5 rounded-md border border-black/[.08] px-2 py-1 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" /> Registrar WhatsApp
        </button>
      </div>

      {formTipo && (
        <AnotacaoForm
          tipo={formTipo}
          onCancel={() => setFormTipo(null)}
          onSave={(descricao) => handleSave(formTipo, descricao)}
        />
      )}

      <div className="flex-1 space-y-3 overflow-y-auto">
        {loading && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Carregando histórico...</p>
        )}
        {!loading && interacoes.length === 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Nenhuma interação registrada ainda.
          </p>
        )}
        {interacoes.map((interacao) => (
          <div key={interacao.id} className="flex gap-2 text-sm">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[.04] text-zinc-600 dark:bg-white/[.06] dark:text-zinc-300">
              <InteracaoIcon tipo={interacao.tipo} />
            </span>
            <div>
              <p className="text-zinc-700 dark:text-zinc-200">{interacao.descricao}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatDataCriacao(interacao.data_criacao)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
