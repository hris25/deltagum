"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = "default",
      size = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
      default:
        "border-gray-300 bg-white focus:border-pink-500 focus:ring-pink-500",
      outline:
        "border-gray-300 bg-transparent focus:border-pink-500 focus:ring-pink-500",
      filled:
        "border-gray-200 bg-gray-50 focus:border-pink-500 focus:ring-pink-500",
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const errorClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <select
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            errorClasses,
            className
          )}
          {...props}
        >
          {children}
        </select>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
