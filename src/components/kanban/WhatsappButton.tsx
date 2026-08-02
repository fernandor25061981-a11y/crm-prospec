"use client";

import { getWhatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsappButton({ whatsapp }: { whatsapp: string | null }) {
  const url = getWhatsappUrl(whatsapp);

  if (!url) {
    return (
      <span
        className="flex h-12 w-12 items-center justify-center rounded-md text-zinc-300 dark:text-zinc-700"
        title="Sem WhatsApp cadastrado"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Abrir WhatsApp"
      onPointerDown={(e) => e.stopPropagation()}
      className="flex h-12 w-12 items-center justify-center rounded-md text-green-600 hover:bg-black/[.04] dark:text-green-500 dark:hover:bg-white/[.06]"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
