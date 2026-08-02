"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { dateKey, isSameDay } from "@/lib/agenda";
import { BTN_GHOST, FOCUS_RING } from "@/lib/ui";
import type { Lead } from "@/types/database";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type CalendarCell = { date: Date; inMonth: boolean };

function buildWeeks(currentMonth: Date): CalendarCell[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const start = new Date(year, month, 1 - firstOfMonth.getDay());
  const totalCells = Math.ceil((firstOfMonth.getDay() + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { date, inMonth: date.getMonth() === month };
  });
}

function monthLabel(date: Date): string {
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function MonthCalendar({
  currentMonth,
  onMonthChange,
  selectedDate,
  onSelectDate,
  leadsByDate,
}: {
  currentMonth: Date;
  onMonthChange: (next: Date) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  leadsByDate: Map<string, Lead[]>;
}) {
  const cells = useMemo(() => buildWeeks(currentMonth), [currentMonth]);
  const today = useMemo(() => new Date(), []);

  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{monthLabel(currentMonth)}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
            }
            className={`rounded-md p-1 text-muted hover:bg-hover ${FOCUS_RING}`}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(new Date())}
            className={`${BTN_GHOST} px-2 py-1 text-xs`}
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() =>
              onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
            }
            className={`rounded-md p-1 text-muted hover:bg-hover ${FOCUS_RING}`}
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-faint">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-1">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ date, inMonth }) => {
          const key = dateKey(date);
          const dayLeads = leadsByDate.get(key) ?? [];
          const hasOverdue = dayLeads.some(
            (lead) =>
              lead.proximo_contato &&
              new Date(lead.proximo_contato).getTime() < new Date().getTime()
          );
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-md text-sm hover:bg-hover ${FOCUS_RING} ${
                inMonth ? "" : "text-disabled"
              } ${isToday ? "font-semibold ring-1 ring-inset ring-accent" : ""} ${
                isSelected ? "bg-accent text-accent-fg hover:bg-accent-hover" : ""
              }`}
            >
              <span>{date.getDate()}</span>
              {dayLeads.length > 0 && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected
                      ? "bg-accent-fg"
                      : hasOverdue
                        ? "bg-red-600 dark:bg-red-400"
                        : "bg-foreground"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
