interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ kicker, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      {kicker && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {kicker}
        </p>
      )}
      <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
    </div>
  );
}
