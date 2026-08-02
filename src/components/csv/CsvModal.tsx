"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { baixarCsv, toCsv } from "@/lib/csv";
import { STATUS_KANBAN_LABELS, STATUS_KANBAN_ORDEM } from "@/lib/kanban";
import {
  analisarCsv,
  CSV_CABECALHOS,
  CSV_CABECALHOS_EXPORT,
  leadParaLinhaCsv,
  MODELO_CSV,
  MODELO_LINHA_EXEMPLO,
  nomeArquivoExport,
  type AnaliseCsv,
} from "@/lib/leads-csv";
import { createLeads } from "@/services/leads";
import type { Lead, StatusKanban } from "@/types/database";

const ULTIMA_FASE = STATUS_KANBAN_ORDEM[STATUS_KANBAN_ORDEM.length - 1];
const MAX_ERROS_VISIVEIS = 10;

const borda = "border-black/[.08] dark:border-white/[.145]";
const botaoPrimario =
  "rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200";
const botaoSecundario =
  "rounded-md px-3 py-1.5 text-sm hover:bg-black/[.04] dark:hover:bg-white/[.06]";
const celula = `border-r ${borda} px-2 py-1.5 whitespace-nowrap last:border-r-0`;

export function CsvModal({
  open,
  onClose,
  leads,
  onImported,
  onError,
}: {
  open: boolean;
  onClose: () => void;
  leads: Lead[];
  onImported: (novos: Lead[]) => void;
  onError: (message: string) => void;
}) {
  const [analise, setAnalise] = useState<AnaliseCsv | null>(null);
  const [erroArquivo, setErroArquivo] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const [fase, setFase] = useState<StatusKanban | "todas">(ULTIMA_FASE);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setAnalise(null);
      setErroArquivo(null);
      setFase(ULTIMA_FASE);
    }
  }

  const totalPorFase = useMemo(() => {
    const contagem = new Map<StatusKanban, number>();
    for (const lead of leads) {
      contagem.set(lead.status_kanban, (contagem.get(lead.status_kanban) ?? 0) + 1);
    }
    return contagem;
  }, [leads]);

  async function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    setAnalise(null);
    setErroArquivo(null);

    try {
      setAnalise(analisarCsv(await arquivo.text(), leads));
    } catch (erro) {
      // Ao contrário do resto do app, a mensagem daqui já vem pronta em português do analisarCsv.
      setErroArquivo(erro instanceof Error ? erro.message : "Não foi possível ler o arquivo.");
    } finally {
      // Sem limpar, escolher o mesmo arquivo de novo não dispara o onChange.
      input.value = "";
    }
  }

  async function handleImportar() {
    if (!analise || analise.novos.length === 0) return;

    setImportando(true);
    try {
      onImported(await createLeads(analise.novos));
      onClose();
    } catch {
      onError("Não foi possível importar os leads. Tente novamente.");
    } finally {
      setImportando(false);
    }
  }

  function handleExportar() {
    const selecionados = fase === "todas" ? leads : leads.filter((l) => l.status_kanban === fase);
    const linhas = [CSV_CABECALHOS_EXPORT, ...selecionados.map(leadParaLinhaCsv)];
    baixarCsv(nomeArquivoExport(fase), toCsv(linhas));
  }

  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Importar / Exportar CSV</h2>
        <button type="button" onClick={onClose} className={botaoSecundario}>
          Fechar
        </button>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Importar</h3>

        <div className={`rounded-md border ${borda}`}>
          <div className={`flex items-center justify-between gap-2 border-b ${borda} px-3 py-2`}>
            <span className="text-sm font-medium">Formato esperado</span>
            <button
              type="button"
              onClick={() => baixarCsv("modelo-leads.csv", MODELO_CSV)}
              className={botaoSecundario}
            >
              Baixar modelo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-max border-collapse text-xs">
              <thead className="bg-black/[.03] dark:bg-white/[.05]">
                <tr>
                  {CSV_CABECALHOS.map((cabecalho) => (
                    <th key={cabecalho} className={`${celula} text-left font-medium`}>
                      {cabecalho}
                      {cabecalho === "Nome" && (
                        <span className="text-red-600 dark:text-red-400"> *</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-zinc-500 dark:text-zinc-400">
                  {MODELO_LINHA_EXEMPLO.map((valor, indice) => (
                    <td key={CSV_CABECALHOS[indice]} className={`${celula} border-t ${borda}`}>
                      {valor}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className={`border-t ${borda} px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400`}>
            <span className="text-red-600 dark:text-red-400">*</span> Só o Nome é obrigatório —
            colunas ausentes ou células vazias entram em branco. Separador{" "}
            <span className="font-mono">;</span> (padrão do Excel). Fase vazia entra como Lead novo.
            Data em <span className="font-mono">dd/mm/aaaa hh:mm</span>. Fase, Status do Site e
            Status do GMN aceitam o texto que aparece na tela (ex.: &quot;Não atendeu&quot;,
            &quot;sem site&quot;).
          </p>
        </div>

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleArquivo}
          className="w-full text-sm text-zinc-500 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-zinc-700 dark:text-zinc-400 dark:file:bg-white dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
        />

        {erroArquivo && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {erroArquivo}
          </p>
        )}

        {analise && (
          <div className={`flex flex-col gap-2 rounded-md border ${borda} px-3 py-2`}>
            <p className="text-sm">
              <span className="font-semibold">{analise.novos.length}</span> novos ·{" "}
              {analise.duplicados} já existem · {analise.erros.length} com erro
              <span className="text-zinc-500 dark:text-zinc-400">
                {" "}
                (de {analise.totalLinhas} linhas)
              </span>
            </p>

            {analise.colunasIgnoradas.length > 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Colunas ignoradas: {analise.colunasIgnoradas.join(", ")}
              </p>
            )}

            {analise.erros.length > 0 && (
              <ul className="flex flex-col gap-0.5 text-xs text-red-700 dark:text-red-400">
                {analise.erros.slice(0, MAX_ERROS_VISIVEIS).map((erro) => (
                  <li key={erro}>{erro}</li>
                ))}
                {analise.erros.length > MAX_ERROS_VISIVEIS && (
                  <li className="text-zinc-500 dark:text-zinc-400">
                    e mais {analise.erros.length - MAX_ERROS_VISIVEIS}...
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleImportar}
            disabled={importando || !analise || analise.novos.length === 0}
            className={botaoPrimario}
          >
            {importando
              ? "Importando..."
              : `Importar ${analise ? analise.novos.length : 0} leads`}
          </button>
        </div>
      </section>

      <section className={`mt-6 flex flex-col gap-3 border-t ${borda} pt-4`}>
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Exportar</h3>

        <div className="flex items-center gap-2">
          <select
            value={fase}
            onChange={(e) => setFase(e.target.value as StatusKanban | "todas")}
            className={`flex-1 rounded-md border ${borda} bg-transparent px-3 py-1.5 text-sm`}
          >
            {STATUS_KANBAN_ORDEM.map((status) => (
              <option key={status} value={status}>
                {STATUS_KANBAN_LABELS[status]} ({totalPorFase.get(status) ?? 0})
              </option>
            ))}
            <option value="todas">Todas as fases ({leads.length})</option>
          </select>

          <button type="button" onClick={handleExportar} className={botaoPrimario}>
            Exportar
          </button>
        </div>
      </section>
    </Modal>
  );
}
