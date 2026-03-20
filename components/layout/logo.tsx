import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg viewBox="0 0 72 72" aria-hidden="true" className="h-12 w-12">
        <rect x="2" y="2" width="68" height="68" rx="22" fill="#F8F4EE" stroke="rgba(0,0,0,.12)" />
        <path d="M25 20h12.5c10.5 0 17.5 6.2 17.5 16 0 10.3-7.7 16-19 16H25V20zm10.8 25.4c6.9 0 11.2-3.2 11.2-9.4 0-6-4-9.2-10.7-9.2h-3.1v18.6h2.6z" fill="#000" />
      </svg>
      <div>
        <p className="font-serif text-2xl leading-none tracking-[0.08em]">Decotable</p>
        {!compact ? (
          <p className="text-[10px] uppercase tracking-[0.42em] text-stone">Maison, table & cadeaux</p>
        ) : null}
      </div>
    </div>
  );
}
