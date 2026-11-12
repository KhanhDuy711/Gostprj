import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)]/60",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)] text-white shadow-[0_0_24px_-6px_var(--accent-purple)] hover:shadow-[0_0_32px_-4px_var(--accent-blue)] hover:scale-[1.02]",
        outline:
          "border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-[var(--accent-purple)]/50",
        ghost: "text-white/80 hover:text-white hover:bg-white/[0.06]",
        secondary: "bg-[var(--bg-secondary)] text-white hover:bg-white/10",
        link: "text-[var(--accent-blue)] underline-offset-4 hover:underline",
        destructive: "bg-red-600/90 text-white hover:bg-red-600",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
