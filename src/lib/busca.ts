import { STATUS_KANBAN_LABELS } from "@/lib/kanban";
import type { Lead } from "@/types/database";

// A busca roda sobre os leads que o board já tem em memória, então o teto é só
// para não despejar a base inteira na lista enquanto o termo ainda é curto.
export const LIMITE_RESULTADOS = 50;

// "" no filtro de categoria significa "todas"; este valor cobre o outro extremo.
// Categoria real nunca é string vazia — o formulário e o CSV gravam null quando o
// campo fica em branco —, então não há colisão possível com uma categoria de verdade.
export const SEM_CATEGORIA = "__sem_categoria__";

// Sem acento e em minúsculas dos dois lados: "joao" precisa achar "João".
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function apenasDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

// Tudo que identifica o cliente na tela entra no texto pesquisável — inclusive o
// rótulo da fase, que é como o usuário se refere a ela ("follow up"), nunca o enum.
function textoPesquisavel(lead: Lead): string {
  return normalizar(
    [
      lead.nome,
      lead.categoria,
      lead.cidade,
      lead.responsavel,
      lead.recepcionista,
      lead.telefone_fixo,
      lead.whatsapp,
      lead.lembrete,
      STATUS_KANBAN_LABELS[lead.status_kanban],
    ]
      .filter(Boolean)
      .join(" ")
  );
}

// Telefone é comparado só por dígitos: o usuário digita "11 98765" e o banco
// guarda "(11) 98765-4321".
function telefonesEmDigitos(lead: Lead): string {
  return `${apenasDigitos(lead.telefone_fixo ?? "")} ${apenasDigitos(lead.whatsapp ?? "")}`;
}

// As opções do filtro saem dos próprios leads: categoria é texto livre, não há enum.
export function categoriasDisponiveis(leads: Lead[]): string[] {
  const encontradas = new Set<string>();
  for (const lead of leads) if (lead.categoria) encontradas.add(lead.categoria);
  return [...encontradas].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function casaCategoria(lead: Lead, categoria: string): boolean {
  if (!categoria) return true;
  if (categoria === SEM_CATEGORIA) return !lead.categoria;
  return lead.categoria === categoria;
}

/**
 * Casa quando *todos* os termos aparecem em algum campo do lead — assim
 * "silva joao" acha o mesmo que "joao silva". Resultados com o nome batendo
 * sobem, porque é por nome que se procura um cliente.
 *
 * A categoria filtra por igualdade, e sozinha já basta: escolher uma categoria
 * sem digitar nada lista os clientes dela.
 */
export function buscarLeads(leads: Lead[], termo: string, categoria = ""): Lead[] {
  const termoNormalizado = normalizar(termo.trim());
  const termos = termoNormalizado.split(/\s+/).filter(Boolean);
  if (termos.length === 0 && !categoria) return [];

  const encontrados: { lead: Lead; peso: number }[] = [];

  for (const lead of leads) {
    if (!casaCategoria(lead, categoria)) continue;

    // Só normaliza o texto do lead quando há termo — listar uma categoria inteira
    // não precisa pagar por isso.
    if (termos.length > 0) {
      const texto = textoPesquisavel(lead);
      const telefones = telefonesEmDigitos(lead);

      const casaTudo = termos.every((parte) => {
        const digitos = apenasDigitos(parte);
        return (digitos.length > 0 && telefones.includes(digitos)) || texto.includes(parte);
      });
      if (!casaTudo) continue;
    }

    // Sem termo, `startsWith("")` é true para todos: peso 0 em bloco, e o sort
    // estável preserva a ordem original do board.
    const nome = normalizar(lead.nome);
    const peso = nome.startsWith(termoNormalizado) ? 0 : nome.includes(termoNormalizado) ? 1 : 2;
    encontrados.push({ lead, peso });
  }

  // sort é estável no JS, então dentro do mesmo peso a ordem original (mais
  // recentes primeiro, que é como o board carrega) se mantém.
  encontrados.sort((a, b) => a.peso - b.peso);

  return encontrados.slice(0, LIMITE_RESULTADOS).map((item) => item.lead);
}
