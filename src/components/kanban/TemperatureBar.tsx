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
      className="flex w-full gap-1"
      title={`${TEMPERATURA_SITE_LABELS[site]} · ${TEMPERATURA_GMN_LABELS[gmn]}`}
    >
      <span
        className={`flex h-6 flex-1 items-center justify-center rounded-full text-[11px] font-bold tracking-wide text-white ${TEMPERATURA_SITE_COLORS[site]}`}
      >
        SITE
      </span>
      <span
        className={`flex h-6 flex-1 items-center justify-center rounded-full text-[11px] font-bold tracking-wide text-white ${TEMPERATURA_GMN_COLORS[gmn]}`}
      >
        GMN
      </span>
    </div>
  );
}
