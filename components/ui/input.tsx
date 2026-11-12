import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus-visible:border-[var(--accent-purple)]/60 focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)]/20 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
