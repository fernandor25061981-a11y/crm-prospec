// Aceita URL digitada sem protocolo (ex.: "meusite.com.br") — o input do
// formulário é type="text" justamente para não travar no submit nativo.
export function normalizarUrl(url: string): string {
  const valor = url.trim();
  if (!valor) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(valor) ? valor : `https://${valor}`;
}
