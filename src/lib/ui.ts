// Classes compartilhadas do design system. As cores vêm dos tokens de globals.css
// (--line, --muted, --accent...), que já trocam sozinhos no dark mode — por isso
// nenhuma classe daqui precisa de par `dark:`.

// Anel de foco: aplicar em todo controle interativo.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ring";

export const CARD = "rounded-md border border-line bg-surface shadow-sm";

export const INPUT = `w-full rounded-md border border-line-strong bg-transparent px-3 py-1.5 text-sm ${FOCUS_RING}`;
export const LABEL = "mb-1 block text-sm text-faint";

export const BTN_PRIMARY = `rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-50 ${FOCUS_RING}`;
export const BTN_GHOST = `rounded-md px-3 py-1.5 text-sm text-muted hover:bg-hover ${FOCUS_RING}`;
export const BTN_OUTLINE = `rounded-md border border-line-strong px-3 py-1.5 text-sm text-muted hover:bg-hover ${FOCUS_RING}`;
export const BTN_ICON = `flex h-10 w-10 items-center justify-center rounded-md hover:bg-hover ${FOCUS_RING}`;

// Botão de ação da ficha: ocupa a coluna inteira do grid, com ícone + rótulo dentro.
// Sem cor nem borda — cada variante (neutra, accent, danger, barra de temperatura)
// completa por cima. É o que mantém os controles da ficha na mesma altura.
export const BTN_ACTION = `flex h-10 w-full items-center justify-center gap-2 rounded-md px-2 text-sm ${FOCUS_RING}`;

// Item da sidebar desktop. Todos os botões (+ Lead, CSV, Kanban, Agenda, Sair)
// usam a mesma base; só Kanban/Agenda alternam para o estado ativo. Mesmo
// esquema de cor do botão primário (BTN_PRIMARY / "Exportar" do modal CSV):
// fundo accent, texto accent-fg. O ativo usa accent-hover para se distinguir
// dos demais sem sair da mesma família de cor.
export const SIDEBAR_ITEM = `rounded-md border border-transparent px-2 py-1.5 text-center text-sm font-medium ${FOCUS_RING}`;
export const SIDEBAR_ITEM_IDLE = "bg-accent text-accent-fg hover:bg-accent-hover";
export const SIDEBAR_ITEM_ACTIVE = "bg-accent-hover text-accent-fg";
