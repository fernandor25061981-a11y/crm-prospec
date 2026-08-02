import {
  TEMPERATURA_GMN_COLORS,
  TEMPERATURA_GMN_LABELS,
  TEMPERATURA_SITE_COLORS,
  TEMPERATURA_SITE_LABELS,
} from "@/lib/temperatura";
import type { TemperaturaGmn, TemperaturaSite } from "@/types/database";

export function TemperatureBar({
  site,
  gmn,
}: {
  site: TemperaturaSite;
  gmn: TemperaturaGmn;
}) {
  return (
    <div
      className="flex shrink-0 gap-1"
      title={`${TEMPERATURA_SITE_LABELS[site]} · ${TEMPERATURA_GMN_LABELS[gmn]}`}
    >
      <span
        className={`flex h-5 shrink-0 items-center justify-center rounded-full px-2.5 text-xs font-bold tracking-wide text-black ${TEMPERATURA_SITE_COLORS[site]}`}
      >
        SITE
      </span>
      <span
        className={`flex h-5 shrink-0 items-center justify-center rounded-full px-2.5 text-xs font-bold tracking-wide text-black ${TEMPERATURA_GMN_COLORS[gmn]}`}
      >
        GMN
      </span>
    </div>
  );
}
