interface TechBadgeProps {
  label: string;
}

export function TechBadge({ label }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center justify-center h-7 px-2.5 bg-brand text-brand-foreground rounded-lg text-[12px] font-sans whitespace-nowrap">
      {label}
    </span>
  );
}
