import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-beige",
        className,
      )}
    />
  ),
);

Select.displayName = "Select";
