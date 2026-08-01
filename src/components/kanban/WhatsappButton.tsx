"use client";

import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsappButton({ whatsapp }: { whatsapp: string | null }) {
  if (!whatsapp) {
    return (
      <span
        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 dark:text-zinc-700"
        title="Sem WhatsApp cadastrado"
      >
        <WhatsAppIcon className="h-4 w-4" />
      </span>
    );
  }

  const digits = whatsapp.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Abrir WhatsApp"
      onPointerDown={(e) => e.stopPropagation()}
      className="flex h-8 w-8 items-center justify-center rounded-md text-green-600 hover:bg-black/[.04] dark:text-green-500 dark:hover:bg-white/[.06]"
    >
      <WhatsAppIcon className="h-4 w-4" />
    </a>
  );
}
