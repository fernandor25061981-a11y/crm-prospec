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
      <span className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
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
              className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                selected
                  ? `${colors[option]} border-transparent text-white`
                  : "border-black/[.08] bg-transparent text-zinc-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-white/[.06]"
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
