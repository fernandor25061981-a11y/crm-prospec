export function StatusBar<T extends string>({
  label,
  value,
  labels,
  colors,
  href,
}: {
  label: string;
  value: T;
  labels: Record<T, string>;
  colors: Record<T, string>;
  href: string | null;
}) {
  const content = (
    <>
      <span className={`block h-2.5 w-full rounded-full ${colors[value]}`} />
      <span className="mt-1 block text-center text-xs text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="pointer-events-none opacity-50" title={labels[value]}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={labels[value]}
      className="block rounded-md transition-opacity hover:opacity-80"
    >
      {content}
    </a>
  );
}
