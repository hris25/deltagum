"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      inputSize = "md",
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const baseClasses = [
      "transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-1",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ];

    const variantClasses = {
      default: [
        "border border-gray-300 bg-white",
        "focus:border-pink-500 focus:ring-pink-500/20",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "",
      ],
      filled: [
        "border-0 bg-gray-100",
        "focus:bg-white focus:ring-pink-500/20",
        error ? "bg-red-50 focus:ring-red-500/20" : "",
      ],
      outlined: [
        "border-2 border-gray-300 bg-transparent",
        "focus:border-pink-500 focus:ring-pink-500/20",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "",
      ],
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const roundedClasses = {
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
    };

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[inputSize],
      roundedClasses[inputSize],
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      fullWidth && "w-full",
      className
    );

    const iconSize = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const iconPosition = {
      sm: "left-3",
      md: "left-3",
      lg: "left-4",
    };

    const rightIconPosition = {
      sm: "right-3",
      md: "right-3",
      lg: "right-4",
    };

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <motion.label
            className={cn(
              "block text-sm font-medium mb-2 transition-colors",
              error ? "text-red-700" : "text-gray-700",
              disabled && "text-gray-400"
            )}
            animate={{
              color: isFocused
                ? error
                  ? "#dc2626"
                  : "#ec4899"
                : error
                ? "#dc2626"
                : "#374151",
            }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
                iconPosition[inputSize]
              )}
            >
              <span className={iconSize[inputSize]}>{leftIcon}</span>
            </div>
          )}

          {/* Input */}
          <motion.input
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            whileFocus={{ scale: 1.01 }}
            {...(({
              onAnimationStart,
              onAnimationEnd,
              onAnimationIteration,
              onDrag,
              onDragStart,
              onDragEnd,
              ...rest
            }) => rest)(props)}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
                rightIconPosition[inputSize]
              )}
            >
              <span className={iconSize[inputSize]}>{rightIcon}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Composant Textarea
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled" | "outlined";
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = "default",
      inputSize = "md",
      fullWidth = false,
      resize = "vertical",
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const baseClasses = [
      "transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-1",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "min-h-[80px]",
    ];

    const variantClasses = {
      default: [
        "border border-gray-300 bg-white",
        "focus:border-pink-500 focus:ring-pink-500/20",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "",
      ],
      filled: [
        "border-0 bg-gray-100",
        "focus:bg-white focus:ring-pink-500/20",
        error ? "bg-red-50 focus:ring-red-500/20" : "",
      ],
      outlined: [
        "border-2 border-gray-300 bg-transparent",
        "focus:border-pink-500 focus:ring-pink-500/20",
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "",
      ],
    };

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const roundedClasses = {
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
    };

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const textareaClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[inputSize],
      roundedClasses[inputSize],
      resizeClasses[resize],
      fullWidth && "w-full",
      className
    );

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <motion.label
            className={cn(
              "block text-sm font-medium mb-2 transition-colors",
              error ? "text-red-700" : "text-gray-700",
              disabled && "text-gray-400"
            )}
            animate={{
              color: isFocused
                ? error
                  ? "#dc2626"
                  : "#ec4899"
                : error
                ? "#dc2626"
                : "#374151",
            }}
          >
            {label}
          </motion.label>
        )}

        {/* Textarea */}
        <motion.textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          whileFocus={{ scale: 1.01 }}
          {...(({
            onAnimationStart,
            onAnimationEnd,
            onAnimationIteration,
            onDrag,
            onDragStart,
            onDragEnd,
            ...rest
          }) => rest)(props)}
        />

        {/* Error Message */}
        {error && (
          <motion.p
            className="mt-1 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
