"use client";

import { Globe, MapPin } from "lucide-react";
import {
  TEMPERATURA_GMN_COLORS,
  TEMPERATURA_GMN_LABELS,
  TEMPERATURA_SITE_COLORS,
  TEMPERATURA_SITE_LABELS,
} from "@/lib/temperatura";
import type { TemperaturaGmn, TemperaturaSite } from "@/types/database";
import { TemperatureSelector } from "./TemperatureSelector";
import type { LeadFormState } from "./types";

const TEMPERATURA_SITE_OPTIONS: TemperaturaSite[] = ["sem_site", "incompleto", "ranqueado"];
const TEMPERATURA_GMN_OPTIONS: TemperaturaGmn[] = ["sem_perfil", "abandonado", "otimizado"];

const inputClassName =
  "w-full rounded-md border border-black/[.08] bg-transparent px-3 py-1.5 text-sm dark:border-white/[.145]";
const labelClassName = "mb-1 block text-xs text-zinc-500 dark:text-zinc-400";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className={labelClassName}>{label}</span>
      {children}
    </div>
  );
}

export function LeadFormPanel({
  form,
  onChange,
}: {
  form: LeadFormState;
  onChange: (patch: Partial<LeadFormState>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Nome">
        <input
          type="text"
          required
          value={form.nome}
          onChange={(e) => onChange({ nome: e.target.value })}
          className={inputClassName}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoria">
          <input
            type="text"
            value={form.categoria}
            onChange={(e) => onChange({ categoria: e.target.value })}
            className={inputClassName}
          />
        </Field>
        <Field label="Idade do Negócio">
          <input
            type="text"
            value={form.idade_negocio}
            onChange={(e) => onChange({ idade_negocio: e.target.value })}
            className={inputClassName}
          />
        </Field>
      </div>

      <Field label="Cidade">
        <input
          type="text"
          value={form.cidade}
          onChange={(e) => onChange({ cidade: e.target.value })}
          className={inputClassName}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Telefone">
          <input
            type="tel"
            value={form.telefone_fixo}
            onChange={(e) => onChange({ telefone_fixo: e.target.value })}
            className={inputClassName}
          />
        </Field>
        <Field label="WhatsApp">
          <input
            type="tel"
            value={form.whatsapp}
            onChange={(e) => onChange({ whatsapp: e.target.value })}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Recepcionista">
          <input
            type="text"
            value={form.recepcionista}
            onChange={(e) => onChange({ recepcionista: e.target.value })}
            className={inputClassName}
          />
        </Field>
        <Field label="Responsável">
          <input
            type="text"
            value={form.responsavel}
            onChange={(e) => onChange({ responsavel: e.target.value })}
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="URL do Maps">
          <div className="flex gap-2">
            <input
              type="url"
              value={form.maps_url}
              onChange={(e) => onChange({ maps_url: e.target.value })}
              className={inputClassName}
            />
            <a
              href={form.maps_url || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!form.maps_url}
              title="Abrir no Maps"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                form.maps_url
                  ? "text-zinc-600 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-white/[.06]"
                  : "pointer-events-none text-zinc-300 dark:text-zinc-700"
              }`}
            >
              <MapPin className="h-4 w-4" />
            </a>
          </div>
        </Field>
        <Field label="URL do Website">
          <div className="flex gap-2">
            <input
              type="url"
              value={form.website_url}
              onChange={(e) => onChange({ website_url: e.target.value })}
              className={inputClassName}
            />
            <a
              href={form.website_url || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!form.website_url}
              title="Abrir website"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                form.website_url
                  ? "text-zinc-600 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-white/[.06]"
                  : "pointer-events-none text-zinc-300 dark:text-zinc-700"
              }`}
            >
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TemperatureSelector
          label="Status do Site"
          value={form.temperatura_site}
          options={TEMPERATURA_SITE_OPTIONS}
          labels={TEMPERATURA_SITE_LABELS}
          colors={TEMPERATURA_SITE_COLORS}
          onChange={(temperatura_site) => onChange({ temperatura_site })}
        />
        <TemperatureSelector
          label="Status do GMN"
          value={form.temperatura_gmn}
          options={TEMPERATURA_GMN_OPTIONS}
          labels={TEMPERATURA_GMN_LABELS}
          colors={TEMPERATURA_GMN_COLORS}
          onChange={(temperatura_gmn) => onChange({ temperatura_gmn })}
        />
      </div>

      <Field label="Próximo Contato">
        <input
          type="datetime-local"
          value={form.proximo_contato}
          onChange={(e) => onChange({ proximo_contato: e.target.value })}
          className={inputClassName}
        />
      </Field>
    </div>
  );
}
