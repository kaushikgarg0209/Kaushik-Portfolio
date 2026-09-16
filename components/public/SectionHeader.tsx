interface SectionHeaderProps {
  command: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ command, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <p className="mb-2 font-mono text-sm text-cyan-400">{command}</p>
      <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
    </div>
  );
}
