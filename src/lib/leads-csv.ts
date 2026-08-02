import { dateKey } from "@/lib/agenda";
import { parseCsv, toCsv } from "@/lib/csv";
import { formatDataHoraCsv, parseDataHoraBr } from "@/lib/datetime";
import { STATUS_KANBAN_LABELS } from "@/lib/kanban";
import type {
  Lead,
  LeadInsert,
  StatusKanban,
  TemperaturaGmn,
  TemperaturaSite,
} from "@/types/database";

// Mesmos rótulos do formulário (LeadFormPanel), pra não inventar vocabulário novo.
export const CSV_CABECALHOS = [
  "Nome",
  "Categoria",
  "Idade do Negócio",
  "Cidade",
  "Telefone",
  "WhatsApp",
  "Recepcionista",
  "Responsável",
  "URL do Website",
  "URL do Maps",
  "Status do Site",
  "Status do GMN",
  "Próximo Compromisso",
  "Lembrete",
  "Fase",
] as const;

export type CsvCabecalho = (typeof CSV_CABECALHOS)[number];

// "Criado em" só sai na exportação; na importação é ignorado como qualquer coluna desconhecida.
export const CSV_CABECALHOS_EXPORT = [...CSV_CABECALHOS, "Criado em"];

// Os rótulos de temperatura.ts vêm com prefixo ("Site: sem site"), que não serve como célula.
const TEMPERATURA_SITE_CSV: Record<TemperaturaSite, string> = {
  sem_site: "sem site",
  incompleto: "incompleto",
  ranqueado: "ranqueado",
};

const TEMPERATURA_GMN_CSV: Record<TemperaturaGmn, string> = {
  sem_perfil: "sem perfil",
  abandonado: "abandonado",
  otimizado: "otimizado",
};

export const MODELO_LINHA_EXEMPLO = [
  "Bar do Zé",
  "Restaurante",
  "5 anos",
  "Recife",
  "8133334444",
  "81999998888",
  "Maria",
  "João",
  "https://bardoze.com.br",
  "https://maps.app.goo.gl/exemplo",
  "sem site",
  "abandonado",
  "05/08/2026 14:30",
  "Ligar depois das 14h",
  "Lead novo",
];

export const MODELO_CSV = toCsv([[...CSV_CABECALHOS], MODELO_LINHA_EXEMPLO]);

function normalizar(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s]+/g, " ");
}

/** Índice que aceita tanto o rótulo da tela ("Não atendeu") quanto o valor cru ("nao_atendeu"). */
function criarIndice<T extends string>(rotulos: Record<T, string>): Map<string, T> {
  const indice = new Map<string, T>();
  for (const [valor, rotulo] of Object.entries(rotulos) as [T, string][]) {
    indice.set(normalizar(rotulo), valor);
    indice.set(normalizar(valor), valor);
  }
  return indice;
}

const INDICE_FASE = criarIndice(STATUS_KANBAN_LABELS);
const INDICE_SITE = criarIndice(TEMPERATURA_SITE_CSV);
const INDICE_GMN = criarIndice(TEMPERATURA_GMN_CSV);

function converterEnum<T extends string>(texto: string, indice: Map<string, T>, padrao: T): T | null {
  const chave = normalizar(texto);
  if (!chave) return padrao;
  return indice.get(chave) ?? null;
}

type LinhaResultado = { ok: true; lead: LeadInsert } | { ok: false; erro: string };

function linhaParaLeadInsert(valorDe: (cabecalho: CsvCabecalho) => string): LinhaResultado {
  const nome = valorDe("Nome").trim();
  if (!nome) return { ok: false, erro: "Nome vazio" };

  const fase = converterEnum(valorDe("Fase"), INDICE_FASE, "lead_novo");
  if (!fase) return { ok: false, erro: `Fase desconhecida: "${valorDe("Fase").trim()}"` };

  const temperaturaSite = converterEnum(valorDe("Status do Site"), INDICE_SITE, "sem_site");
  if (!temperaturaSite) {
    return { ok: false, erro: `Status do Site desconhecido: "${valorDe("Status do Site").trim()}"` };
  }

  const temperaturaGmn = converterEnum(valorDe("Status do GMN"), INDICE_GMN, "sem_perfil");
  if (!temperaturaGmn) {
    return { ok: false, erro: `Status do GMN desconhecido: "${valorDe("Status do GMN").trim()}"` };
  }

  const dataTexto = valorDe("Próximo Compromisso").trim();
  const proximoContato = dataTexto ? parseDataHoraBr(dataTexto) : null;
  if (dataTexto && !proximoContato) {
    return { ok: false, erro: `Data inválida: "${dataTexto}" (use dd/mm/aaaa hh:mm)` };
  }

  return {
    ok: true,
    lead: {
      nome,
      categoria: valorDe("Categoria").trim() || null,
      idade_negocio: valorDe("Idade do Negócio").trim() || null,
      cidade: valorDe("Cidade").trim() || null,
      telefone_fixo: valorDe("Telefone").trim() || null,
      whatsapp: valorDe("WhatsApp").trim() || null,
      recepcionista: valorDe("Recepcionista").trim() || null,
      responsavel: valorDe("Responsável").trim() || null,
      website_url: valorDe("URL do Website").trim() || null,
      maps_url: valorDe("URL do Maps").trim() || null,
      status_kanban: fase,
      temperatura_site: temperaturaSite,
      temperatura_gmn: temperaturaGmn,
      proximo_contato: proximoContato,
      lembrete: valorDe("Lembrete").trim() || null,
    },
  };
}

export function leadParaLinhaCsv(lead: Lead): string[] {
  return [
    lead.nome,
    lead.categoria ?? "",
    lead.idade_negocio ?? "",
    lead.cidade ?? "",
    lead.telefone_fixo ?? "",
    lead.whatsapp ?? "",
    lead.recepcionista ?? "",
    lead.responsavel ?? "",
    lead.website_url ?? "",
    lead.maps_url ?? "",
    TEMPERATURA_SITE_CSV[lead.temperatura_site],
    TEMPERATURA_GMN_CSV[lead.temperatura_gmn],
    lead.proximo_contato ? formatDataHoraCsv(lead.proximo_contato) : "",
    lead.lembrete ?? "",
    STATUS_KANBAN_LABELS[lead.status_kanban],
    formatDataHoraCsv(lead.created_at),
  ];
}

/**
 * O banco não tem nenhuma chave única, então a deduplicação é feita aqui:
 * dois leads são o mesmo se baterem em qualquer uma destas chaves.
 */
function chavesDedup(lead: Pick<Lead, "nome" | "cidade" | "whatsapp" | "maps_url">): string[] {
  const chaves: string[] = [];

  const maps = normalizar(lead.maps_url ?? "");
  if (maps) chaves.push(`maps:${maps}`);

  const digitos = (lead.whatsapp ?? "").replace(/\D/g, "");
  if (digitos.length >= 8) chaves.push(`zap:${digitos}`);

  const nome = normalizar(lead.nome);
  if (nome) chaves.push(`nome:${nome}|${normalizar(lead.cidade ?? "")}`);

  return chaves;
}

export type AnaliseCsv = {
  totalLinhas: number;
  novos: LeadInsert[];
  duplicados: number;
  erros: string[];
  colunasIgnoradas: string[];
};

export function analisarCsv(texto: string, leadsExistentes: Lead[]): AnaliseCsv {
  const linhas = parseCsv(texto);
  if (linhas.length === 0) throw new Error("O arquivo está vazio.");

  const indicePorCabecalho = new Map<CsvCabecalho, number>();
  const colunasIgnoradas: string[] = [];

  linhas[0].forEach((bruto, indice) => {
    const normalizado = normalizar(bruto);
    const conhecido = CSV_CABECALHOS.find((cabecalho) => normalizar(cabecalho) === normalizado);
    if (conhecido) indicePorCabecalho.set(conhecido, indice);
    else if (normalizado) colunasIgnoradas.push(bruto.trim());
  });

  if (!indicePorCabecalho.has("Nome")) {
    throw new Error(
      'O arquivo precisa ter uma coluna "Nome". Baixe o modelo e confira os cabeçalhos.'
    );
  }

  const chavesConhecidas = new Set(leadsExistentes.flatMap(chavesDedup));
  const novos: LeadInsert[] = [];
  const erros: string[] = [];
  let totalLinhas = 0;
  let duplicados = 0;

  for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i];
    if (valores.every((valor) => valor.trim() === "")) continue;
    totalLinhas++;

    const valorDe = (cabecalho: CsvCabecalho) => {
      const indice = indicePorCabecalho.get(cabecalho);
      return indice === undefined ? "" : valores[indice] ?? "";
    };

    const resultado = linhaParaLeadInsert(valorDe);
    if (!resultado.ok) {
      erros.push(`Linha ${i + 1}: ${resultado.erro}`);
      continue;
    }

    // Alimenta o Set a cada linha aceita, assim repetições dentro do próprio arquivo também caem.
    const chaves = chavesDedup(resultado.lead);
    if (chaves.some((chave) => chavesConhecidas.has(chave))) {
      duplicados++;
      continue;
    }
    for (const chave of chaves) chavesConhecidas.add(chave);
    novos.push(resultado.lead);
  }

  return { totalLinhas, novos, duplicados, erros, colunasIgnoradas };
}

export function nomeArquivoExport(fase: StatusKanban | "todas"): string {
  return `leads-${fase}-${dateKey(new Date())}.csv`;
}
