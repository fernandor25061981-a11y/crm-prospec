import { FOCUS_RING } from "@/lib/ui";

export function TemperatureSelector<T extends string>({
  label,
  value,
  options,
  labels,
  colors,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  colors: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm text-faint">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`flex-1 rounded-md border px-2 py-1.5 text-sm font-medium transition-colors ${FOCUS_RING} ${
                selected
                  ? `${colors[option]} border-transparent text-white`
                  : "border-line-strong bg-transparent text-muted hover:bg-hover"
              }`}
            >
              {labels[option]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
