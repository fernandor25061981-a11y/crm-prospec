export function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

const DATA_HORA_BR = /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::\d{2})?)?$/;

/**
 * Aceita `dd/mm/aaaa hh:mm` (o que o Excel mostra) ou ISO e devolve ISO.
 * Devolve null em vez de estourar — `fromDatetimeLocalValue` joga RangeError
 * em data inválida, o que derrubaria a importação inteira por uma linha ruim.
 */
export function parseDataHoraBr(valor: string): string | null {
  const texto = valor.trim();
  if (!texto) return null;

  const partes = DATA_HORA_BR.exec(texto);
  if (partes) {
    const [, dia, mes, ano, hora = "00", minuto = "00"] = partes;
    const date = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));
    // O construtor acomoda datas impossíveis (31/02 vira 03/03), então confere a volta.
    if (date.getDate() !== Number(dia) || date.getMonth() !== Number(mes) - 1) return null;
    return date.toISOString();
  }

  const date = new Date(texto);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function formatDataHora(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Igual ao formatDataHora, mas com ano de 4 dígitos: o CSV precisa reimportar sem ambiguidade. */
export function formatDataHoraCsv(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(iso))
    .replace(",", "");
}
