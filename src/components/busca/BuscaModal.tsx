"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { buscarLeads, categoriasDisponiveis, LIMITE_RESULTADOS, SEM_CATEGORIA } from "@/lib/busca";
import { STATUS_KANBAN_LABELS } from "@/lib/kanban";
import { CONTATO_PRINCIPAL_COLORS, getContatoPrincipal } from "@/lib/leads";
import { BTN_GHOST, FOCUS_RING, INPUT } from "@/lib/ui";
import type { Lead } from "@/types/database";

export function BuscaModal({
  open,
  onClose,
  leads,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  leads: Lead[];
  onSelect: (lead: Lead) => void;
}) {
  const [termo, setTermo] = useState("");
  // "" = todas as categorias.
  const [categoria, setCategoria] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTermo("");
      setCategoria("");
    }
  }

  // O Modal dá foco no painel ao abrir; como ele é filho daqui, o efeito dele
  // roda primeiro e este por último — é o que deixa o cursor cair no campo.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const resultados = useMemo(
    () => buscarLeads(leads, termo, categoria),
    [leads, termo, categoria]
  );
  const categorias = useMemo(() => categoriasDisponiveis(leads), [leads]);
  const temSemCategoria = useMemo(() => leads.some((lead) => !lead.categoria), [leads]);
  const filtrou = termo.trim().length > 0 || categoria !== "";

  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Buscar cliente</h2>
        <button type="button" onClick={onClose} className={BTN_GHOST}>
          Fechar
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Enter abre o primeiro resultado: com um nome digitado por inteiro,
          // é quase sempre o único.
          if (resultados.length > 0) onSelect(resultados[0]);
        }}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            ref={inputRef}
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Nome, telefone, cidade, responsável..."
            aria-label="Buscar cliente"
            className={`${INPUT} pl-9`}
          />
        </div>

        {/* Só aparece se houver categoria nos dados — sem isso o controle seria inútil. */}
        {categorias.length > 0 && (
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoria"
            className={`${INPUT} mt-2`}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
            {temSemCategoria && <option value={SEM_CATEGORIA}>Sem categoria</option>}
          </select>
        )}
      </form>

      <div className="mt-4 max-h-[50vh] overflow-y-auto">
        {!filtrou && (
          <p className="py-6 text-center text-sm text-faint">
            Digite ou escolha uma categoria para procurar entre {leads.length} clientes.
          </p>
        )}

        {filtrou && resultados.length === 0 && (
          <p className="py-6 text-center text-sm text-faint">Nenhum cliente encontrado.</p>
        )}

        {resultados.length > 0 && (
          <ul className="flex flex-col gap-1">
            {resultados.map((lead) => {
              const contato = getContatoPrincipal(lead);
              const telefone = lead.telefone_fixo ?? lead.whatsapp;
              const detalhes = [lead.cidade, telefone].filter(Boolean).join(" · ");

              return (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(lead)}
                    className={`w-full rounded-md px-3 py-2 text-left hover:bg-hover ${FOCUS_RING}`}
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {lead.nome}
                      </span>
                      <span className="shrink-0 text-xs text-faint">
                        {STATUS_KANBAN_LABELS[lead.status_kanban]}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-baseline gap-2 text-xs">
                      <span className={`min-w-0 truncate ${CONTATO_PRINCIPAL_COLORS[contato.tipo]}`}>
                        {contato.texto}
                      </span>
                      {detalhes && <span className="min-w-0 truncate text-faint">{detalhes}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {resultados.length === LIMITE_RESULTADOS && (
          <p className="pt-2 text-center text-xs text-faint">
            Mostrando os {LIMITE_RESULTADOS} primeiros — refine a busca.
          </p>
        )}
      </div>
    </Modal>
  );
}
