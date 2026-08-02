"use client";

import { Modal } from "@/components/ui/Modal";
import { BTN_GHOST, FOCUS_RING } from "@/lib/ui";

// Único botão sólido de perigo do app: as cores vêm da escala do Tailwind e não
// dos tokens de globals.css, que só têm variantes de linha (--line-danger).
const BTN_DANGER = `rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 ${FOCUS_RING}`;

export function ExcluirLeadModal({
  nome,
  open,
  onClose,
  onConfirm,
}: {
  nome: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-md">
      <h2 className="mb-2 text-lg font-semibold">Excluir lead</h2>

      <p className="mb-6 text-sm text-muted">
        Tem certeza que deseja excluir <span className="font-medium text-foreground">{nome}</span>? O
        histórico de interações também será removido e essa ação não pode ser desfeita.
      </p>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={BTN_GHOST}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            onConfirm();
          }}
          className={BTN_DANGER}
        >
          Excluir lead
        </button>
      </div>
    </Modal>
  );
}
