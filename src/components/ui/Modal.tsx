"use client";

import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  children,
  widthClassName = "max-w-6xl",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClassName?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  // onClose vem como arrow inline dos chamadores, então muda de identidade a cada
  // render do pai. Fora da ref, ele viraria dependência do efeito e o focus() abaixo
  // roubaria o cursor de quem estivesse digitando dentro do modal.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("keydown", handleKeydown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          tabIndex={-1}
          className={`max-h-[90vh] w-full overflow-y-auto rounded-md border border-line bg-surface p-6 shadow-lg outline-none ${widthClassName}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
