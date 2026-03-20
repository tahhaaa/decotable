import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beige disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-ink text-white hover:bg-black/85",
        variant === "secondary" && "bg-beige text-white hover:bg-beige/90",
        variant === "ghost" && "border border-black/10 bg-white hover:bg-black/[0.03]",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
