import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-beige",
        props.className,
      )}
    />
  );
}
