"use client";

import { BTN_ICON } from "@/lib/ui";
import { getWhatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsappButton({ whatsapp }: { whatsapp: string | null }) {
  const url = getWhatsappUrl(whatsapp);

  if (!url) {
    return (
      <span
        className="flex h-10 w-10 items-center justify-center rounded-md text-disabled"
        title="Sem WhatsApp cadastrado"
      >
        <WhatsAppIcon className="h-5 w-5" />
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
      className={`${BTN_ICON} text-green-600 dark:text-green-500`}
    >
      <WhatsAppIcon className="h-5 w-5" />
    </a>
  );
}
