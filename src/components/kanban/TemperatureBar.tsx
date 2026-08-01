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
      className="flex w-full gap-0.5"
      title={`${TEMPERATURA_SITE_LABELS[site]} · ${TEMPERATURA_GMN_LABELS[gmn]}`}
    >
      <span className={`h-1.5 flex-1 rounded-full ${TEMPERATURA_SITE_COLORS[site]}`} />
      <span className={`h-1.5 flex-1 rounded-full ${TEMPERATURA_GMN_COLORS[gmn]}`} />
    </div>
  );
}
