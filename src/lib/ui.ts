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
