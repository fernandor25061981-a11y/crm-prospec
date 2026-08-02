"use client";

import { ArrowRightLeft, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDataHora } from "@/lib/datetime";
import { getInteracoes } from "@/services/leads";
import type { Interacao, InteracaoTipo } from "@/types/database";
import { WhatsAppIcon } from "../kanban/WhatsAppIcon";

function InteracaoIcon({ tipo }: { tipo: InteracaoTipo }) {
  if (tipo === "ligacao") return <Phone className="h-4 w-4" />;
  if (tipo === "whatsapp") return <WhatsAppIcon className="h-4 w-4" />;
  return <ArrowRightLeft className="h-4 w-4" />;
}

export function HistoricoPanel({
  leadId,
  onError,
  refreshToken = 0,
}: {
  leadId: string;
  onError: (message: string) => void;
  refreshToken?: number;
}) {
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedLeadId, setLoadedLeadId] = useState(leadId);

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
  }, [leadId, onError, refreshToken]);

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 text-sm font-semibold">Histórico e Interações</h3>

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
                {formatDataHora(interacao.data_criacao)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
