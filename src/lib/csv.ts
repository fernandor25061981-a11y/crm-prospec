// Parser e serializador de CSV genéricos, sem nada específico de lead.

// O Excel só reconhece o arquivo como UTF-8 se ele começar com BOM; sem isso os acentos quebram.
const BOM = "\uFEFF";

/**
 * Conta separadores fora de aspas na primeira linha. O Excel em pt-BR grava com
 * `;`, mas exports de outras ferramentas costumam vir com `,`.
 */
function detectarSeparador(texto: string): string {
  let dentroDeAspas = false;
  let pontoVirgula = 0;
  let virgula = 0;

  for (const char of texto) {
    if (char === '"') dentroDeAspas = !dentroDeAspas;
    else if (dentroDeAspas) continue;
    else if (char === ";") pontoVirgula++;
    else if (char === ",") virgula++;
    else if (char === "\n") break;
  }

  return virgula > pontoVirgula ? "," : ";";
}

export function parseCsv(texto: string): string[][] {
  const conteudo = texto.startsWith(BOM) ? texto.slice(1) : texto;
  const separador = detectarSeparador(conteudo);
  const linhas: string[][] = [];
  let campos: string[] = [];
  let campo = "";
  let dentroDeAspas = false;

  for (let i = 0; i < conteudo.length; i++) {
    const char = conteudo[i];

    if (dentroDeAspas) {
      if (char !== '"') {
        campo += char;
      } else if (conteudo[i + 1] === '"') {
        campo += '"';
        i++;
      } else {
        dentroDeAspas = false;
      }
      continue;
    }

    if (char === '"') {
      dentroDeAspas = true;
    } else if (char === separador) {
      campos.push(campo);
      campo = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && conteudo[i + 1] === "\n") i++;
      campos.push(campo);
      linhas.push(campos);
      campos = [];
      campo = "";
    } else {
      campo += char;
    }
  }

  // Só sobra conteúdo pendente quando o arquivo não termina em quebra de linha.
  if (campo !== "" || campos.length > 0) {
    campos.push(campo);
    linhas.push(campos);
  }

  return linhas;
}

function escaparCampo(valor: string, separador: string): string {
  const precisaDeAspas =
    valor.includes(separador) ||
    valor.includes('"') ||
    valor.includes("\n") ||
    valor.includes("\r");

  return precisaDeAspas ? `"${valor.replace(/"/g, '""')}"` : valor;
}

export function toCsv(linhas: string[][], separador = ";"): string {
  return linhas
    .map((linha) => linha.map((valor) => escaparCampo(valor, separador)).join(separador))
    .join("\r\n");
}

export function baixarCsv(nomeArquivo: string, conteudo: string): void {
  const blob = new Blob([`${BOM}${conteudo}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}
