"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // ¡Ahora sí enlazado!

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "bg-accent text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-accent/90 transition",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
